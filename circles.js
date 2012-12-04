"use strict";

var vec = {
  DIM: 2,

  zero: function() {
    return [0, 0];
  },

  nan: function() {
    return [0/0, 0/0];
  },

  copy: function(r, a) {
    for (var i = 0; i < vec.DIM; i++)
      r[i] = a[i];
  },

  clone: function(a) {
    var b = [];
    for (var i = 0; i < vec.DIM; i++)
      b.push(a[i]);
    return b;
  },

  add: function(r, a, b) {
    for (var i = 0; i < vec.DIM; i++)
      r[i] = a[i] + b[i];
  },

  sub: function(r, a, b) {
    for (var i = 0; i < vec.DIM; i++)
      r[i] = a[i] - b[i];
  },

  mul: function(r, f, a) {
    for (var i = 0; i < vec.DIM; i++)
      r[i] = f * a[i];
  },

  mad: function vec_mad(r, f, a) {
    for (var i = 0; i < vec.DIM; i++)
      r[i] += f * a[i];
  },

  dot: function(a, b) {
    var result = 0;
    for (var i = 0; i < vec.DIM; i++)
      result += a[i] * b[i];
    return result;
  },

  len: function(a) {
    return Math.sqrt(vec.dot(a, a));
  },

  normalize: function(a) {
    return vec.mul(a, 1 / vec.len(a), a);
  },

  from_polar: function(alpha, r) {
    return [r * Math.cos(alpha), r * Math.sin(alpha)];
  },
};

var circ = {
  Pi_Di: function(p, d, c_i, r_i) {
    var Ri = vec.zero();
    vec.sub(Ri, p, c_i);
    var d_dot_Ri = vec.dot(d, Ri);
    if (d_dot_Ri > 0)
      return [vec.nan(), vec.nan()];
    var q = Math.sqrt(r_i * r_i - vec.dot(Ri, Ri) + d_dot_Ri * d_dot_Ri);

    var P_i = vec.clone(p);
    vec.mad(P_i, -d_dot_Ri - q, d);

    var P_i_sub_c_i = vec.zero();
    vec.sub(P_i_sub_c_i, P_i, c_i);
    var D_i = vec.clone(d);
    vec.mad(D_i, 2 * q / (r_i * r_i), P_i_sub_c_i);

    //var tmp = vec.clone(Ri);
    //vec.mad(tmp, -d_dot_Ri - q, d);
    //var D_i = vec.clone(d);
    //vec.mad(D_i, 2 * q / (r_i * r_i), tmp);

    return [P_i, D_i];
  }
};

function rescale(a0, a1, b0, b1, x) {
  return b0 + (x - a0) / (a1 - a0) * (b1 - b0);
}

function draw() {
  var canvas = document.getElementById('canvas');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  var scale = 0.2;
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = Math.pow(scale, 3);
  ctx.translate(0, canvas.height);
  ctx.scale(scale * canvas.width, -scale * canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 100);
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 0);
  ctx.stroke();

  var p = [2.7,0.7];
  var c_i = [4,2], r_i = 0.7;
  var c_j = [1,3.4], r_j = 0.3;
  var c_k = [4,4.5], r_k = 0.3;

  ctx.beginPath();
  ctx.arc(p[0], p[1], 0.02, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(c_i[0], c_i[1], r_i, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(c_j[0], c_j[1], r_j, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(c_k[0], c_k[1], r_k, 0, 2 * Math.PI);
  ctx.stroke();

  var N = 50000;
  for (var i = 0; i < N; i++) {
    var alpha = rescale(0, 1, 0, 2 * Math.PI, i / (N-1));
    var d = vec.from_polar(alpha, 1);

    var Pi_Di = circ.Pi_Di(p, d, c_i, r_i);
    var P_i = Pi_Di[0];
    var D_i = Pi_Di[1];

    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(P_i[0], P_i[1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(P_i[0], P_i[1], 0.02, 0, 2 * Math.PI);
    ctx.fill();

    var q = vec.clone(P_i);
    vec.add(q, q, D_i);
    ctx.beginPath();
    ctx.moveTo(P_i[0], P_i[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.stroke();

    var Pj_Dj = circ.Pi_Di(P_i, D_i, c_j, r_j);
    var P_j = Pj_Dj[0];
    var D_j = Pj_Dj[1];

    ctx.beginPath();
    ctx.arc(P_j[0], P_j[1], 0.02, 0, 2 * Math.PI);
    ctx.fill();

    q = vec.clone(P_j);
    vec.add(q, q, D_j);
    ctx.beginPath();
    ctx.moveTo(P_j[0], P_j[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.stroke();

    var Pk_Dk = circ.Pi_Di(P_j, D_j, c_k, r_k);
    var P_k = Pk_Dk[0];
    var D_k = Pk_Dk[1];

    ctx.beginPath();
    ctx.arc(P_k[0], P_k[1], 0.02, 0, 2 * Math.PI);
    ctx.fill();

    q = vec.clone(P_k);
    vec.add(q, q, D_k);
    ctx.beginPath();
    ctx.moveTo(P_k[0], P_k[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.stroke();
  }
}

window.addEventListener('load', draw, false);
