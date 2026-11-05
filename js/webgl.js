(() => {
  'use strict';
  const canvas = document.querySelector('#organic-canvas');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas || reduced.matches || getComputedStyle(canvas).display === 'none') return;
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power' }); }
  catch { return; }
  if (!gl) return;

  const vertexSource = 'attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}';
  const fragmentSource = `
    precision mediump float;
    uniform vec2 resolution;
    uniform float time;
    void main() {
      vec2 p = gl_FragCoord.xy / resolution;
      p.x *= resolution.x / resolution.y;
      float breath = sin(time * 0.28) * 0.06;
      vec2 center = vec2(0.65 + sin(time * 0.11) * 0.13, 0.45);
      float wave = sin(p.y * 5.0 + time * 0.19) * 0.09;
      float cloud = 1.0 - smoothstep(0.0, 0.62 + breath, length((p - center) * vec2(0.85, 1.0) + vec2(wave, 0.0)));
      float ripple = sin(p.x * 3.5 + p.y * 4.0 - time * 0.13) * 0.5 + 0.5;
      vec3 color = mix(vec3(0.82, 0.87, 0.73), vec3(0.68, 0.79, 0.65), ripple);
      float alpha = cloud * 0.2;
      gl_FragColor = vec4(color * alpha, alpha);
    }`;
  function shader(type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
      gl.deleteShader(result);
      return null;
    }
    return result;
  }
  const vertex = shader(gl.VERTEX_SHADER, vertexSource);
  const fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'resolution');
  const time = gl.getUniformLocation(program, 'time');
  let frame = 0;
  let visible = true;
  let lost = false;
  let previous = 0;
  let phase = 0;
  let lastDraw = -Infinity;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    // Meia resolução e DPR limitado: o efeito atmosférico dispensa pixels extras.
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
    canvas.width = Math.max(1, Math.floor(rect.width * scale));
    canvas.height = Math.max(1, Math.floor(rect.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolution, canvas.width, canvas.height);
  }
  function draw(now) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches || lost) return;
    if (previous) phase += Math.min(now - previous, 100) / 1000;
    previous = now;
    if (now - lastDraw >= 1000 / 24) {
      gl.uniform1f(time, phase);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      lastDraw = now;
    }
    frame = requestAnimationFrame(draw);
  }
  function synchronize() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (visible && !document.hidden && !reduced.matches && !lost) frame = requestAnimationFrame(draw);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    synchronize();
  }).observe(canvas);
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', synchronize);
  reduced.addEventListener('change', synchronize);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; synchronize(); canvas.hidden = true; });
  // Se o contexto for perdido, o fundo CSS permanece como alternativa estática.
  resize();
  synchronize();
})();
