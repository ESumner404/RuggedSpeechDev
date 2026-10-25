var n, l$4, u$2, t$2, i$2, r$3, o$2, e$3, f$3, c$3, a$2, s$3, h$3, p$4, v$2, d$2 = {}, w$2 = [], _$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, g$1 = Array.isArray;
function m$2(n2, l2) {
  for (var u2 in l2) n2[u2] = l2[u2];
  return n2;
}
function b$1(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function k$1(l2, u2, t2) {
  var i2, r2, o2, e2 = {};
  for (o2 in u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : e2[o2] = u2[o2];
  if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
  return x$1(l2, e2, i2, r2, null);
}
function x$1(n2, t2, i2, r2, o2) {
  var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u$2 : o2, __i: -1, __u: 0 };
  return null == o2 && null != l$4.vnode && l$4.vnode(e2), e2;
}
function S$1(n2) {
  return n2.children;
}
function C$1(n2, l2) {
  this.props = n2, this.context = l2;
}
function $(n2, l2) {
  if (null == l2) return n2.__ ? $(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
  return "function" == typeof n2.type ? $(n2) : null;
}
function I(n2) {
  if (n2.__P && n2.__d) {
    var u2 = n2.__v, t2 = u2.__e, i2 = [], r2 = [], o2 = m$2({}, u2);
    o2.__v = u2.__v + 1, l$4.vnode && l$4.vnode(o2), q(n2.__P, o2, u2, n2.__n, n2.__P.namespaceURI, 32 & u2.__u ? [t2] : null, i2, null == t2 ? $(u2) : t2, !!(32 & u2.__u), r2), o2.__v = u2.__v, o2.__.__k[o2.__i] = o2, D(i2, o2, r2), u2.__e = u2.__ = null, o2.__e != t2 && P(o2);
  }
}
function P(n2) {
  if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l2) {
    if (null != l2 && null != l2.__e) return n2.__e = n2.__c.base = l2.__e;
  }), P(n2);
}
function A$1(n2) {
  (!n2.__d && (n2.__d = true) && i$2.push(n2) && !H$1.__r++ || r$3 != l$4.debounceRendering) && ((r$3 = l$4.debounceRendering) || o$2)(H$1);
}
function H$1() {
  try {
    for (var n2, l2 = 1; i$2.length; ) i$2.length > l2 && i$2.sort(e$3), n2 = i$2.shift(), l2 = i$2.length, I(n2);
  } finally {
    i$2.length = H$1.__r = 0;
  }
}
function L(n2, l2, u2, t2, i2, r2, o2, e2, f2, c2, a2) {
  var s2, h2, p2, v2, y2, _2, g2 = t2 && t2.__k || w$2, m2 = l2.length;
  for (f2 = T$1(u2, l2, g2, f2, m2), s2 = 0; s2 < m2; s2++) null != (p2 = u2.__k[s2]) && (h2 = -1 != p2.__i && g2[p2.__i] || d$2, p2.__i = s2, _2 = q(n2, p2, h2, i2, r2, o2, e2, f2, c2, a2), v2 = p2.__e, p2.ref && h2.ref != p2.ref && (h2.ref && J(h2.ref, null, p2), a2.push(p2.ref, p2.__c || v2, p2)), null == y2 && null != v2 && (y2 = v2), 4 & p2.__u ? (f2 = j$2(p2, f2, n2), h2.__e && (h2.__e = null)) : "function" == typeof p2.type && void 0 !== _2 ? f2 = _2 : v2 && (f2 = v2.nextSibling), p2.__u &= -7);
  return u2.__e = y2, f2;
}
function T$1(n2, l2, u2, t2, i2) {
  var r2, o2, e2, f2, c2, a2 = u2.length, s2 = a2, h2 = 0;
  for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2 ? ("string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? o2 = n2.__k[r2] = x$1(null, o2, null, null, null) : g$1(o2) ? o2 = n2.__k[r2] = x$1(S$1, { children: o2 }, null, null, null) : void 0 === o2.constructor && o2.__b > 0 ? o2 = n2.__k[r2] = x$1(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : n2.__k[r2] = o2, f2 = r2 + h2, o2.__ = n2, o2.__b = n2.__b + 1, e2 = null, -1 != (c2 = o2.__i = O(o2, u2, f2, s2)) && (s2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > a2 ? h2-- : i2 < a2 && h2++), "function" != typeof o2.type && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
  if (s2) for (r2 = 0; r2 < a2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = $(e2)), K(e2, e2));
  return t2;
}
function j$2(n2, l2, u2) {
  var t2, i2;
  if ("function" == typeof n2.type) {
    for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++) t2[i2] && (t2[i2].__ = n2, l2 = j$2(t2[i2], l2, u2));
    return l2;
  }
  n2.__e != l2 && (l2 && n2.type && !l2.parentNode && (l2 = $(n2)), l2 = u2.insertBefore(n2.__e, l2 || null));
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 == l2.nodeType);
  return l2;
}
function O(n2, l2, u2, t2) {
  var i2, r2, o2, e2 = n2.key, f2 = n2.type, c2 = l2[u2], a2 = null != c2 && 0 == (2 & c2.__u);
  if (null === c2 && null == e2 || a2 && e2 == c2.key && f2 == c2.type) return u2;
  if (t2 > (a2 ? 1 : 0)) {
    for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) if (null != (c2 = l2[o2 = i2 >= 0 ? i2-- : r2++]) && 0 == (2 & c2.__u) && e2 == c2.key && f2 == c2.type) return o2;
  }
  return -1;
}
function z$1(n2, l2, u2) {
  "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || _$1.test(l2) ? u2 : u2 + "px";
}
function N(n2, l2, u2, t2, i2) {
  var r2, o2;
  n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || z$1(n2.style, l2, "");
    if (u2) for (l2 in u2) t2 && u2[l2] == t2[l2] || z$1(n2.style, l2, u2[l2]);
  }
  else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(s$3, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2[a$2] = t2[a$2] : (u2[a$2] = h$3, n2.addEventListener(l2, r2 ? v$2 : p$4, r2)) : n2.removeEventListener(l2, r2 ? v$2 : p$4, r2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u2 ? "" : u2;
      break n;
    } catch (n3) {
    }
    "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
  }
}
function V(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (null == u2[c$3]) u2[c$3] = h$3++;
      else if (u2[c$3] < t2[a$2]) return;
      return t2(l$4.event ? l$4.event(u2) : u2);
    }
  };
}
function q(n2, u2, t2, i2, r2, o2, e2, f2, c2, a2) {
  var s2, h2, p2, v2, y2, d2, _2, k2, x2, M, I2, P2, A2, H2, T2, j2, F = u2.type;
  if (void 0 !== u2.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), o2 = [f2 = u2.__e = t2.__e]), (s2 = l$4.__b) && s2(u2);
  n: if ("function" == typeof F) {
    h2 = e2.length;
    try {
      if (x2 = u2.props, M = F.prototype && F.prototype.render, I2 = (s2 = F.contextType) && i2[s2.__c], P2 = s2 ? I2 ? I2.props.value : s2.__ : i2, t2.__c ? k2 = (p2 = u2.__c = t2.__c).__ = p2.__E : (M ? u2.__c = p2 = new F(x2, P2) : (u2.__c = p2 = new C$1(x2, P2), p2.constructor = F, p2.render = Q), I2 && I2.sub(p2), p2.state || (p2.state = {}), p2.__n = i2, v2 = p2.__d = true, p2.__h = [], p2._sb = []), M && null == p2.__s && (p2.__s = p2.state), M && null != F.getDerivedStateFromProps && (p2.__s == p2.state && (p2.__s = m$2({}, p2.__s)), m$2(p2.__s, F.getDerivedStateFromProps(x2, p2.__s))), y2 = p2.props, d2 = p2.state, p2.__v = u2, v2) M && null == F.getDerivedStateFromProps && null != p2.componentWillMount && p2.componentWillMount(), M && null != p2.componentDidMount && p2.__h.push(p2.componentDidMount);
      else {
        if (M && null == F.getDerivedStateFromProps && x2 !== y2 && null != p2.componentWillReceiveProps && p2.componentWillReceiveProps(x2, P2), u2.__v == t2.__v || !p2.__e && null != p2.shouldComponentUpdate && false === p2.shouldComponentUpdate(x2, p2.__s, P2)) {
          u2.__v != t2.__v && (p2.props = x2, p2.state = p2.__s, p2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
            n3 && (n3.__ = u2);
          }), w$2.push.apply(p2.__h, p2._sb), p2._sb = [], p2.__h.length && e2.push(p2), f2 = $(t2);
          break n;
        }
        null != p2.componentWillUpdate && p2.componentWillUpdate(x2, p2.__s, P2), M && null != p2.componentDidUpdate && p2.__h.push(function() {
          p2.componentDidUpdate(y2, d2, _2);
        });
      }
      if (p2.context = P2, p2.props = x2, p2.__P = n2, p2.__e = false, A2 = l$4.__r, H2 = 0, M) p2.state = p2.__s, p2.__d = false, A2 && A2(u2), s2 = p2.render(p2.props, p2.state, p2.context), w$2.push.apply(p2.__h, p2._sb), p2._sb = [];
      else do {
        p2.__d = false, A2 && A2(u2), s2 = p2.render(p2.props, p2.state, p2.context), p2.state = p2.__s;
      } while (p2.__d && ++H2 < 25);
      p2.state = p2.__s, null != p2.getChildContext && (i2 = m$2(m$2({}, i2), p2.getChildContext())), M && !v2 && null != p2.getSnapshotBeforeUpdate && (_2 = p2.getSnapshotBeforeUpdate(y2, d2)), T2 = null != s2 && s2.type === S$1 && null == s2.key ? E$1(s2.props.children) : s2, f2 = L(n2, g$1(T2) ? T2 : [T2], u2, t2, i2, r2, o2, e2, f2, c2, a2), p2.base = u2.__e, u2.__u &= -161, p2.__h.length && e2.push(p2), k2 && (p2.__E = p2.__ = null);
    } catch (n3) {
      if (e2.length = h2, u2.__v = null, c2 || null != o2) {
        if (n3.then) {
          for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; ) f2 = f2.nextSibling;
          null != o2 && (o2[o2.indexOf(f2)] = null), u2.__e = f2;
        } else if (null != o2) for (j2 = o2.length; j2--; ) b$1(o2[j2]);
      } else u2.__e = t2.__e;
      null == u2.__k && (u2.__k = t2.__k || []), n3.then || B$1(u2), l$4.__e(n3, u2, t2);
    }
  } else null == o2 && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = G(t2.__e, u2, t2, i2, r2, o2, e2, c2, a2);
  return (s2 = l$4.diffed) && s2(u2), 128 & u2.__u ? void 0 : f2;
}
function B$1(n2) {
  n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B$1));
}
function D(n2, u2, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) J(t2[i2], t2[++i2], t2[++i2]);
  l$4.__c && l$4.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$4.__e(n3, u3.__v);
    }
  });
}
function E$1(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g$1(n2) ? n2.map(E$1) : void 0 !== n2.constructor ? null : m$2({}, n2);
}
function G(u2, t2, i2, r2, o2, e2, f2, c2, a2) {
  var s2, h2, p2, v2, y2, w2, _2, m2 = i2.props || d$2, k2 = t2.props, x2 = t2.type;
  if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e2) {
    for (s2 = 0; s2 < e2.length; s2++) if ((y2 = e2[s2]) && "setAttribute" in y2 == !!x2 && (x2 ? y2.localName == x2 : 3 == y2.nodeType)) {
      u2 = y2, e2[s2] = null;
      break;
    }
  }
  if (null == u2) {
    if (null == x2) return document.createTextNode(k2);
    u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l$4.__m && l$4.__m(t2, e2), c2 = false), e2 = null;
  }
  if (null == x2) m2 === k2 || c2 && u2.data == k2 || (u2.data = k2);
  else {
    if (e2 = "textarea" == x2 && null != k2.defaultValue ? null : e2 && n.call(u2.childNodes), !c2 && null != e2) for (m2 = {}, s2 = 0; s2 < u2.attributes.length; s2++) m2[(y2 = u2.attributes[s2]).name] = y2.value;
    for (s2 in m2) y2 = m2[s2], "dangerouslySetInnerHTML" == s2 ? p2 = y2 : "children" == s2 || s2 in k2 || "value" == s2 && "defaultValue" in k2 || "checked" == s2 && "defaultChecked" in k2 || N(u2, s2, null, y2, o2);
    for (s2 in k2) y2 = k2[s2], "children" == s2 ? v2 = y2 : "dangerouslySetInnerHTML" == s2 ? h2 = y2 : "value" == s2 ? w2 = y2 : "checked" == s2 ? _2 = y2 : c2 && "function" != typeof y2 || m2[s2] === y2 || N(u2, s2, y2, m2[s2], o2);
    if (h2) c2 || p2 && (h2.__html == p2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
    else if (p2 && (u2.innerHTML = ""), L("template" == t2.type ? u2.content : u2, g$1(v2) ? v2 : [v2], t2, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && $(i2, 0), c2, a2), null != e2) for (s2 = e2.length; s2--; ) b$1(e2[s2]);
    c2 && "textarea" != x2 || (s2 = "value", "progress" == x2 && null == w2 ? u2.removeAttribute("value") : null != w2 && (w2 !== u2[s2] || "progress" == x2 && !w2 || "option" == x2 && w2 != m2[s2]) && N(u2, s2, w2, m2[s2], o2), s2 = "checked", null != _2 && _2 != u2[s2] && N(u2, s2, _2, m2[s2], o2));
  }
  return u2;
}
function J(n2, u2, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u;
      i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
    } else n2.current = u2;
  } catch (n3) {
    l$4.__e(n3, t2);
  }
}
function K(n2, u2, t2) {
  var i2, r2;
  if (l$4.unmount && l$4.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || J(i2, null, u2)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (n3) {
      l$4.__e(n3, u2);
    }
    i2.base = i2.__P = i2.__n = null;
  }
  if (i2 = n2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && K(i2[r2], u2, t2 || "function" != typeof n2.type);
  t2 || b$1(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function Q(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function R(u2, t2, i2) {
  var r2, o2, e2, f2;
  t2 == document && (t2 = document.documentElement), l$4.__ && l$4.__(u2, t2), o2 = (r2 = false) ? null : t2.__k, e2 = [], f2 = [], q(t2, u2 = t2.__k = k$1(S$1, null, [u2]), o2 || d$2, d$2, t2.namespaceURI, o2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, e2, o2 ? o2.__e : t2.firstChild, r2, f2), D(e2, u2, f2), u2.props.children = null;
}
n = w$2.slice, l$4 = { __e: function(n2, l2, u2, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u$2 = 0, t$2 = function(n2) {
  return null != n2 && void 0 === n2.constructor;
}, C$1.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m$2({}, this.state), "function" == typeof n2 && (n2 = n2(m$2({}, u2), this.props)), n2 && m$2(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), A$1(this));
}, C$1.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), A$1(this));
}, C$1.prototype.render = S$1, i$2 = [], o$2 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$3 = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, H$1.__r = 0, f$3 = Math.random().toString(8), c$3 = "__d" + f$3, a$2 = "__a" + f$3, s$3 = /(PointerCapture)$|Capture$/i, h$3 = 0, p$4 = V(false), v$2 = V(true);
var f$2 = 0;
function u$1(e2, t2, n2, o2, i2, u2) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$2, __i: -1, __u: 0, __source: i2, __self: u2 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l$4.vnode && l$4.vnode(l2), l2;
}
var t$1, r$2, u, i$1, o$1 = 0, f$1 = [], c$2 = l$4, e$2 = c$2.__b, a$1 = c$2.__r, v$1 = c$2.diffed, l$3 = c$2.__c, m$1 = c$2.unmount, p$3 = c$2.__;
function s$2(n2, t2) {
  c$2.__h && c$2.__h(r$2, n2, o$1 || t2), o$1 = 0;
  var u2 = r$2.__H || (r$2.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function h$2(n2, u2) {
  var i2 = s$2(t$1++, 3);
  !c$2.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r$2.__H.__h.push(i2));
}
function A(n2) {
  return o$1 = 5, T(function() {
    return { current: n2 };
  }, []);
}
function T(n2, r2) {
  var u2 = s$2(t$1++, 7);
  return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function j$1() {
  for (var n2; n2 = f$1.shift(); ) {
    var t2 = n2.__H;
    if (n2.__P && t2) try {
      t2.__h.some(z), t2.__h.some(B), t2.__h = [];
    } catch (r2) {
      t2.__h = [], c$2.__e(r2, n2.__v);
    }
  }
}
c$2.__b = function(n2) {
  r$2 = null, e$2 && e$2(n2);
}, c$2.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), p$3 && p$3(n2, t2);
}, c$2.__r = function(n2) {
  a$1 && a$1(n2), t$1 = 0;
  var i2 = (r$2 = n2.__c).__H;
  i2 && (u === r$2 ? (i2.__h = [], r$2.__h = [], i2.__.some(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i2.__h.some(z), i2.__h.some(B), i2.__h = [], t$1 = 0)), u = r$2;
}, c$2.diffed = function(n2) {
  v$1 && v$1(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i$1 === c$2.requestAnimationFrame || ((i$1 = c$2.requestAnimationFrame) || w$1)(j$1)), t2.__H.__.some(function(n3) {
    n3.u && (n3.__H = n3.u, n3.u = void 0);
  })), u = r$2 = null;
}, c$2.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.some(z), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], c$2.__e(r2, n3.__v);
    }
  }), l$3 && l$3(n2, t2);
}, c$2.unmount = function(n2) {
  m$1 && m$1(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.some(function(n3) {
    try {
      z(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && c$2.__e(t2, r2.__v));
};
var k = "function" == typeof requestAnimationFrame;
function w$1(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 35);
  k && (t2 = requestAnimationFrame(r2));
}
function z(n2) {
  var t2 = r$2, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r$2 = t2;
}
function B(n2) {
  var t2 = r$2;
  n2.__c = n2.__(), r$2 = t2;
}
function C(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
var i = /* @__PURE__ */ Symbol.for("preact-signals");
function t() {
  if (!(v > 1)) {
    var i2, t2 = false;
    !(function() {
      var i3 = c$1;
      c$1 = void 0;
      while (void 0 !== i3) {
        var t3 = i3.S;
        if (t3.v === i3.v) {
          for (var n3 = t3.t; void 0 !== n3; n3 = n3.x) if (n3.i === i3.i) n3.i = t3.i;
        }
        i3 = i3.o;
      }
    })();
    while (void 0 !== h$1) {
      var n2 = h$1;
      h$1 = void 0;
      s$1++;
      while (void 0 !== n2) {
        var r2 = n2.u;
        n2.u = void 0;
        n2.f &= -3;
        if (!(8 & n2.f) && w(n2)) try {
          n2.c();
        } catch (n3) {
          if (!t2) {
            i2 = n3;
            t2 = true;
          }
        }
        n2 = r2;
      }
    }
    s$1 = 0;
    v--;
    if (t2) throw i2;
  } else v--;
}
var r$1, o = void 0;
function f(i2) {
  var t2 = o, n2 = r$1;
  o = void 0;
  r$1 = void 0;
  try {
    return i2();
  } finally {
    o = t2;
    r$1 = n2;
  }
}
var h$1 = void 0, v = 0, s$1 = 0, e$1 = 0, c$1 = void 0, d$1 = 0;
function a(i2) {
  if (void 0 !== o) {
    var t2 = i2.n;
    if (void 0 === t2 || t2.t !== o) {
      t2 = { i: 0, S: i2, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t2 };
      if (void 0 !== o.s) o.s.n = t2;
      o.s = t2;
      i2.n = t2;
      if (32 & o.f) i2.S(t2);
      return t2;
    } else if (-1 === t2.i) {
      t2.i = 0;
      if (void 0 !== t2.n) {
        t2.n.p = t2.p;
        if (void 0 !== t2.p) t2.p.n = t2.n;
        t2.p = o.s;
        t2.n = void 0;
        o.s.n = t2;
        o.s = t2;
      }
      return t2;
    }
  }
}
function l$2(i2, t2) {
  this.v = i2;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.l = 0;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
l$2.prototype.brand = i;
l$2.prototype.h = function() {
  return true;
};
l$2.prototype.S = function(i2) {
  var t2 = this, n2 = this.t;
  if (n2 !== i2 && void 0 === i2.e) {
    i2.x = n2;
    this.t = i2;
    if (void 0 !== n2) n2.e = i2;
    else f(function() {
      var i3;
      null == (i3 = t2.W) || i3.call(t2);
    });
  }
};
l$2.prototype.U = function(i2) {
  var t2 = this;
  if (void 0 !== this.t) {
    var n2 = i2.e, r2 = i2.x;
    if (void 0 !== n2) {
      n2.x = r2;
      i2.e = void 0;
    }
    if (void 0 !== r2) {
      r2.e = n2;
      i2.x = void 0;
    }
    if (i2 === this.t) {
      this.t = r2;
      if (void 0 === r2) f(function() {
        var i3;
        null == (i3 = t2.Z) || i3.call(t2);
      });
    }
  }
};
l$2.prototype.subscribe = function(i2) {
  var t2 = this;
  return j(function() {
    var n2 = t2.value;
    f(function() {
      return i2(n2);
    });
  }, { name: "sub" });
};
l$2.prototype.valueOf = function() {
  return this.value;
};
l$2.prototype.toString = function() {
  return this.value + "";
};
l$2.prototype.toJSON = function() {
  return this.value;
};
l$2.prototype.peek = function() {
  var i2 = this;
  return f(function() {
    return i2.value;
  });
};
Object.defineProperty(l$2.prototype, "value", { get: function() {
  var i2 = a(this);
  if (void 0 !== i2) i2.i = this.i;
  return this.v;
}, set: function(i2) {
  if (i2 !== this.v) {
    if (s$1 > 100) throw new Error("Cycle detected");
    !(function(i3) {
      if (0 !== v && 0 === s$1) {
        if (i3.l !== e$1) {
          i3.l = e$1;
          c$1 = { S: i3, v: i3.v, i: i3.i, o: c$1 };
        }
      }
    })(this);
    this.v = i2;
    this.i++;
    d$1++;
    v++;
    try {
      for (var n2 = this.t; void 0 !== n2; n2 = n2.x) n2.t.N();
    } finally {
      t();
    }
  }
} });
function y(i2, t2) {
  return new l$2(i2, t2);
}
function w(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
  return false;
}
function _(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
    var n2 = t2.S.n;
    if (void 0 !== n2) t2.r = n2;
    t2.S.n = t2;
    t2.i = -1;
    if (void 0 === t2.n) {
      i2.s = t2;
      break;
    }
  }
}
function b(i2) {
  var t2 = i2.s, n2 = void 0;
  while (void 0 !== t2) {
    var r2 = t2.p;
    if (-1 === t2.i) {
      t2.S.U(t2);
      if (void 0 !== r2) r2.n = t2.n;
      if (void 0 !== t2.n) t2.n.p = r2;
    } else n2 = t2;
    t2.S.n = t2.r;
    if (void 0 !== t2.r) t2.r = void 0;
    t2 = r2;
  }
  i2.s = n2;
}
function p$2(i2, t2) {
  l$2.call(this, void 0, t2);
  this.x = i2;
  this.s = void 0;
  this.g = d$1 - 1;
  this.f = 4;
}
p$2.prototype = new l$2();
p$2.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === d$1) return true;
  this.g = d$1;
  this.f |= 1;
  if (this.i > 0 && !w(this)) {
    this.f &= -2;
    return true;
  }
  var i2 = o;
  try {
    _(this);
    o = this;
    var t2 = this.x();
    if (16 & this.f || this.v !== t2 || 0 === this.i) {
      this.v = t2;
      this.f &= -17;
      this.i++;
    }
  } catch (i3) {
    this.v = i3;
    this.f |= 16;
    this.i++;
  }
  o = i2;
  b(this);
  this.f &= -2;
  return true;
};
p$2.prototype.S = function(i2) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
  }
  l$2.prototype.S.call(this, i2);
};
p$2.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    l$2.prototype.U.call(this, i2);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    }
  }
};
p$2.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
  }
};
Object.defineProperty(p$2.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var i2 = a(this);
  this.h();
  if (void 0 !== i2) i2.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function g(i2, t2) {
  return new p$2(i2, t2);
}
function S(i2) {
  var n2 = i2.m;
  i2.m = void 0;
  if ("function" == typeof n2) {
    v++;
    var r2 = o;
    o = void 0;
    try {
      n2();
    } catch (t2) {
      i2.f &= -2;
      i2.f |= 8;
      m(i2);
      throw t2;
    } finally {
      o = r2;
      t();
    }
  }
}
function m(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
  i2.x = void 0;
  i2.s = void 0;
  S(i2);
}
function x(i2) {
  if (o !== this) throw new Error("Out-of-order effect");
  b(this);
  o = i2;
  this.f &= -2;
  if (8 & this.f) m(this);
  t();
}
function E(i2, t2) {
  this.x = i2;
  this.m = void 0;
  this.s = void 0;
  this.u = void 0;
  this.f = 32;
  this.name = null == t2 ? void 0 : t2.name;
  if (r$1) r$1.push(this);
}
E.prototype.c = function() {
  var i2 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    var t2 = this.x();
    if ("function" == typeof t2) this.m = t2;
  } finally {
    i2();
  }
};
E.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  S(this);
  _(this);
  v++;
  var i2 = o;
  o = this;
  return x.bind(this, i2);
};
E.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.u = h$1;
    h$1 = this;
  }
};
E.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) m(this);
};
E.prototype.dispose = function() {
  this.d();
};
function j(i2, t2) {
  var n2 = new E(i2, t2);
  try {
    n2.c();
  } catch (i3) {
    n2.d();
    throw i3;
  }
  var r2 = n2.d.bind(n2);
  r2[Symbol.dispose] = r2;
  return r2;
}
var s;
function l$1(i2, n2) {
  l$4[i2] = n2.bind(null, l$4[i2] || function() {
  });
}
function d(i2) {
  if (s) {
    var r2 = s;
    s = void 0;
    r2();
  }
  s = i2 && i2.S();
}
function h(i2) {
  var r2 = this, f2 = i2.data, o2 = useSignal(f2);
  o2.value = f2;
  var e2 = T(function() {
    var i3 = r2.__v;
    while (i3 = i3.__) if (i3.__c) {
      i3.__c.__$f |= 4;
      break;
    }
    r2.__$u.c = function() {
      var i4, t2 = r2.__$u.S(), f3 = e2.value;
      t2();
      if (t$2(f3) || 3 !== (null == (i4 = r2.base) ? void 0 : i4.nodeType)) {
        r2.__$f |= 1;
        r2.setState({});
      } else r2.base.data = f3;
    };
    return g(function() {
      var i4 = o2.value.value;
      return 0 === i4 ? 0 : true === i4 ? "" : i4 || "";
    });
  }, []);
  return e2.value;
}
h.displayName = "_st";
Object.defineProperties(l$2.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: h }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
l$1("__b", function(i2, r2) {
  if ("string" == typeof r2.type) {
    var n2, t2 = r2.props;
    for (var f2 in t2) if ("children" !== f2) {
      var o2 = t2[f2];
      if (o2 instanceof l$2) {
        if (!n2) r2.__np = n2 = {};
        n2[f2] = o2;
        t2[f2] = o2.peek();
      }
    }
  }
  i2(r2);
});
l$1("__r", function(i2, r2) {
  i2(r2);
  d();
  var n2, t2 = r2.__c;
  if (t2) {
    t2.__$f &= -2;
    if (void 0 === (n2 = t2.__$u)) t2.__$u = n2 = (function(i3) {
      var r3;
      j(function() {
        r3 = this;
      });
      r3.c = function() {
        t2.__$f |= 1;
        t2.setState({});
      };
      return r3;
    })();
  }
  d(n2);
});
l$1("__e", function(i2, r2, n2, t2) {
  d();
  i2(r2, n2, t2);
});
l$1("diffed", function(i2, r2) {
  d();
  var n2;
  if ("string" == typeof r2.type && (n2 = r2.__e)) {
    var t2 = r2.__np, f2 = r2.props;
    if (t2) {
      var o2 = n2.U;
      if (o2) for (var e2 in o2) {
        var u2 = o2[e2];
        if (void 0 !== u2 && !(e2 in t2)) {
          u2.d();
          o2[e2] = void 0;
        }
      }
      else n2.U = o2 = {};
      for (var a2 in t2) {
        var c2 = o2[a2], s2 = t2[a2];
        if (void 0 === c2) {
          c2 = p$1(n2, a2, s2, f2);
          o2[a2] = c2;
        } else c2.o(s2, f2);
      }
    }
  }
  i2(r2);
});
function p$1(i2, r2, n2, t2) {
  var f2 = r2 in i2 && void 0 === i2.ownerSVGElement, o2 = y(n2);
  return { o: function(i3, r3) {
    o2.value = i3;
    t2 = r3;
  }, d: j(function() {
    var n3 = o2.value.value;
    if (t2[r2] !== n3) {
      t2[r2] = n3;
      if (f2) i2[r2] = n3;
      else if (n3) i2.setAttribute(r2, n3);
      else i2.removeAttribute(r2);
    }
  }) };
}
l$1("unmount", function(i2, r2) {
  if ("string" == typeof r2.type) {
    var n2 = r2.__e;
    if (n2) {
      var t2 = n2.U;
      if (t2) {
        n2.U = void 0;
        for (var f2 in t2) {
          var o2 = t2[f2];
          if (o2) o2.d();
        }
      }
    }
  } else {
    var e2 = r2.__c;
    if (e2) {
      var u2 = e2.__$u;
      if (u2) {
        e2.__$u = void 0;
        u2.d();
      }
    }
  }
  i2(r2);
});
l$1("__h", function(i2, r2, n2, t2) {
  if (t2 < 3 || 9 === t2) r2.__$f |= 2;
  i2(r2, n2, t2);
});
C$1.prototype.shouldComponentUpdate = function(i2, r2) {
  if (this.__R) return true;
  var n2 = this.__$u, t2 = n2 && void 0 !== n2.s;
  for (var f2 in r2) return true;
  if (this.__f || "boolean" == typeof this.u && true === this.u) {
    if (!(t2 || 2 & this.__$f || 4 & this.__$f)) return true;
    if (1 & this.__$f) return true;
  } else {
    if (!(t2 || 4 & this.__$f)) return true;
    if (3 & this.__$f) return true;
  }
  for (var o2 in i2) if ("__source" !== o2 && i2[o2] !== this.props[o2]) return true;
  for (var e2 in this.props) if (!(e2 in i2)) return true;
  return false;
};
function useSignal(i2) {
  return T(function() {
    return y(i2);
  }, []);
}
const TILES = [
  { id: "talk", label: "Talk" },
  { id: "keyboard", label: "Keyboard" },
  { id: "myday", label: "My Day" },
  { id: "favourites", label: "Favourites" },
  { id: "mypages", label: "My Pages" },
  { id: "feelings", label: "Feelings & Help" }
];
function HomeScreen({ onSelect }) {
  return /* @__PURE__ */ u$1("div", { class: "home-screen", children: TILES.map((tile) => /* @__PURE__ */ u$1(
    "button",
    {
      type: "button",
      class: "home-screen__tile",
      "data-tile": tile.id,
      onClick: () => onSelect(tile.id),
      children: tile.label
    },
    tile.id
  )) });
}
function funPreset(name, base, deep) {
  return {
    name,
    hint: "A favourite colour.",
    colours: {
      background: mix("#ffffff", base, 0.14),
      text: "#1a1a1a",
      border: mix("#ffffff", base, 0.6),
      bars: mix("#ffffff", base, 0.32),
      accent: deep
    }
  };
}
const FUN_COLOUR_IDS = ["pink", "orange", "red", "yellow", "green", "turquoise", "blue", "purple"];
const FUN_COLOURS = {
  pink: { ...funPreset("Pink", "#f472b6", "#be185d"), swatch: "#f472b6" },
  orange: { ...funPreset("Orange", "#fb923c", "#c2410c"), swatch: "#fb923c" },
  red: { ...funPreset("Red", "#f87171", "#b91c1c"), swatch: "#f87171" },
  yellow: { ...funPreset("Yellow", "#facc15", "#a16207"), swatch: "#facc15" },
  green: { ...funPreset("Green", "#4ade80", "#15803d"), swatch: "#4ade80" },
  turquoise: { ...funPreset("Turquoise", "#2dd4bf", "#0f766e"), swatch: "#2dd4bf" },
  blue: { ...funPreset("Blue", "#60a5fa", "#1d4ed8"), swatch: "#60a5fa" },
  purple: { ...funPreset("Purple", "#a78bfa", "#6d28d9"), swatch: "#a78bfa" }
};
const isFunColour = (id) => id in FUN_COLOURS;
const SCHEME_IDS = ["standard", "calm", "sunny", "forest", "cream", "night", "yellowOnBlack"];
const THEME_PRESETS = {
  ...FUN_COLOURS,
  standard: {
    name: "Standard",
    hint: "White and clear.",
    colours: { background: "#ffffff", text: "#1a1a1a", border: "#d4d4d4", bars: "#f5f5f5", accent: "#1d4ed8" }
  },
  calm: {
    name: "Calm",
    hint: "Soft blue-grey, gentle on the eyes.",
    colours: { background: "#eef3f8", text: "#1f2933", border: "#b8c4d0", bars: "#dfe8f1", accent: "#3b6ea5" }
  },
  sunny: {
    name: "Sunny",
    hint: "Warm and light.",
    colours: { background: "#fffbea", text: "#2b2b2b", border: "#e3d9a8", bars: "#fff1b8", accent: "#b45309" }
  },
  forest: {
    name: "Forest",
    hint: "Pale green.",
    colours: { background: "#f0f7f1", text: "#1b2b1f", border: "#b5ccb8", bars: "#dcebdd", accent: "#2f7d4a" }
  },
  cream: {
    name: "Cream",
    hint: "Off-white, easier than bright white for some readers.",
    colours: { background: "#fbf3df", text: "#222222", border: "#d8c9a0", bars: "#f3e7c6", accent: "#7a3e9d" }
  },
  night: {
    name: "Night",
    hint: "Dark, with soft light writing.",
    colours: { background: "#14181f", text: "#f2f4f7", border: "#4b5563", bars: "#1e242e", accent: "#7db3ff" }
  },
  yellowOnBlack: {
    name: "Yellow on black",
    hint: "Very strong contrast.",
    colours: { background: "#000000", text: "#ffee00", border: "#ffee00", bars: "#000000", accent: "#ffffff" }
  }
};
const DEFAULT_THEME = {
  preset: "standard",
  custom: { ...THEME_PRESETS.standard.colours },
  wordColours: {}
};
function coloursFor(theme) {
  return theme.preset === "custom" ? theme.custom : THEME_PRESETS[theme.preset].colours;
}
const HEX$1 = /^#[0-9a-f]{6}$/i;
const isHex = (value) => typeof value === "string" && HEX$1.test(value);
function isTheme(value) {
  if (typeof value !== "object" || value === null) return false;
  const v2 = value;
  const custom = v2["custom"];
  const words = v2["wordColours"];
  return (v2["preset"] === "custom" || typeof v2["preset"] === "string" && v2["preset"] in THEME_PRESETS) && typeof custom === "object" && custom !== null && ["background", "text", "border", "bars", "accent"].every((key) => isHex(custom[key])) && typeof words === "object" && words !== null && Object.values(words).every(isHex);
}
function channels(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function toHex$1(values) {
  return `#${values.map((n2) => Math.round(Math.min(255, Math.max(0, n2))).toString(16).padStart(2, "0")).join("")}`;
}
function mix(a2, b2, amount) {
  const [ar, ag, ab] = channels(a2);
  const [br, bg, bb] = channels(b2);
  return toHex$1([ar + (br - ar) * amount, ag + (bg - ag) * amount, ab + (bb - ab) * amount]);
}
function luminance(hex) {
  const [r2, g2, b2] = channels(hex).map((value) => {
    const c2 = value / 255;
    return c2 <= 0.03928 ? c2 / 12.92 : ((c2 + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
}
function contrastRatio(a2, b2) {
  const [light, dark] = [luminance(a2), luminance(b2)].sort((x2, y2) => y2 - x2);
  return (light + 0.05) / (dark + 0.05);
}
const isDark = (hex) => luminance(hex) < 0.18;
function readableOn(background) {
  return contrastRatio(background, "#1a1a1a") >= contrastRatio(background, "#ffffff") ? "#1a1a1a" : "#ffffff";
}
function colourDistance(a2, b2) {
  const [ar, ag, ab] = channels(a2);
  const [br, bg, bb] = channels(b2);
  return Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2);
}
const wordColourOverrides = y({});
const VARIABLES = ["--color-background", "--color-text", "--color-border", "--color-nav-background", "--color-chip-background", "--color-accent"];
function applyTheme(theme, highContrastOn) {
  wordColourOverrides.value = theme.wordColours;
  const root = document.documentElement;
  if (highContrastOn || theme.preset === "standard") {
    for (const name of VARIABLES) root.style.removeProperty(name);
    root.style.removeProperty("color-scheme");
    root.style.setProperty("--color-accent", "#1d4ed8");
    return;
  }
  const c2 = coloursFor(theme);
  root.style.setProperty("--color-background", c2.background);
  root.style.setProperty("--color-text", c2.text);
  root.style.setProperty("--color-border", c2.border);
  root.style.setProperty("--color-nav-background", c2.bars);
  root.style.setProperty("--color-chip-background", mix(c2.background, c2.accent, 0.12));
  root.style.setProperty("--color-accent", c2.accent);
  root.style.colorScheme = isDark(c2.background) ? "dark" : "light";
}
const FITZGERALD_COLORS = {
  people: "#fef08a",
  doing: "#bbf7d0",
  describing: "#bfdbfe",
  things: "#fed7aa",
  places: "#99f6e4",
  social: "#fbcfe8",
  littleWords: "#e9d5ff",
  noStop: "#fecaca"
};
const LOW_AROUSAL_COLORS = {
  people: "#f5f0dc",
  doing: "#dcebdc",
  describing: "#dce6f0",
  things: "#f0e3d4",
  places: "#d9ece8",
  social: "#f0dce6",
  littleWords: "#e6dcf0",
  noStop: "#f0d9d9"
};
const HEX_TO_CLASS = Object.fromEntries(
  Object.entries(FITZGERALD_COLORS).map(([cls, hex]) => [hex, cls])
);
function resolveBackgroundColor(hex, lowArousal) {
  if (!hex) return hex;
  const cls = HEX_TO_CLASS[hex];
  if (!cls) return hex;
  const chosen = wordColourOverrides.value[cls];
  if (chosen) return chosen;
  return lowArousal ? LOW_AROUSAL_COLORS[cls] : hex;
}
const FITZGERALD_LABELS = {
  people: "People (yellow)",
  doing: "Doing words (green)",
  describing: "Describing words (blue)",
  things: "Things (orange)",
  places: "Places (teal)",
  social: "Social words (pink)",
  littleWords: "Little words (purple)",
  noStop: "No and stop (red)"
};
const FITZGERALD_CLASSES = Object.keys(FITZGERALD_COLORS);
function classOfColor(hex) {
  return hex ? HEX_TO_CLASS[hex] : void 0;
}
function feelingWord(id, label, emoji) {
  return {
    id,
    label,
    image: { kind: "emoji", char: emoji },
    background_color: FITZGERALD_COLORS.describing
  };
}
const FEELINGS_ITEMS = [
  feelingWord("happy", "happy", "😊"),
  feelingWord("sad", "sad", "😢"),
  feelingWord("angry", "angry", "😠"),
  feelingWord("worried", "worried", "😟"),
  feelingWord("scared", "scared", "😨"),
  feelingWord("tired-feeling", "tired", "😴"),
  feelingWord("excited", "excited", "🤩"),
  feelingWord("calm", "calm", "😌"),
  feelingWord("too-loud", "too loud", "🔊"),
  feelingWord("too-bright", "too bright", "💡"),
  feelingWord("need-quiet", "need quiet", "🤫"),
  feelingWord("need-space", "need space", "↔️"),
  feelingWord("need-to-move", "need to move", "🏃"),
  feelingWord("itchy", "itchy", "🪡"),
  feelingWord("hungry", "hungry", "🍽️"),
  feelingWord("thirsty", "thirsty", "🥤"),
  feelingWord("hurts", "hurts", "🤕"),
  feelingWord("hot", "hot", "🥵"),
  feelingWord("cold", "cold", "🥶"),
  feelingWord("need-toilet", "need toilet", "🚻")
];
const INTENSITIES = ["a little", "medium", "a lot"];
function helpPhrase(id, label, emoji) {
  return {
    id,
    label,
    image: { kind: "emoji", char: emoji },
    background_color: FITZGERALD_COLORS.social
  };
}
const HELP_ITEMS = [
  helpPhrase("lost", "I'm lost", "❓"),
  helpPhrase("unsafe", "I feel unsafe", "⚠️"),
  helpPhrase("hurt-help", "I'm hurt", "🤕"),
  helpPhrase("unwell", "I feel unwell", "🤒"),
  helpPhrase("call-parent", "Call my parent", "📞"),
  helpPhrase("toilet-help", "I need the toilet", "🚻"),
  helpPhrase("someone-hurt-me", "Someone hurt me", "🚨"),
  helpPhrase("dont-touch-me", "Don't touch me", "✋"),
  helpPhrase("dont-know-where", "I don't know where I am", "📍")
];
function getOfflineVoices(voices) {
  return voices.filter((voice) => voice.localService !== false);
}
function watchVoices(onVoices) {
  const synth = window.speechSynthesis;
  if (!synth) return () => void 0;
  let stopped = false;
  let tries = 0;
  let timer;
  const load = () => {
    if (stopped) return;
    const voices = getOfflineVoices(synth.getVoices());
    onVoices(voices);
    if (voices.length === 0 && tries < 20) {
      tries += 1;
      timer = window.setTimeout(load, 250);
    }
  };
  load();
  synth.addEventListener?.("voiceschanged", load);
  return () => {
    stopped = true;
    if (timer !== void 0) window.clearTimeout(timer);
    synth.removeEventListener?.("voiceschanged", load);
  };
}
let currentSpeech = 0;
function makeUtterance(text, options) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;
  const offlineVoices = getOfflineVoices(window.speechSynthesis.getVoices());
  const chosenVoice = options.voiceURI ? offlineVoices.find((voice) => voice.voiceURI === options.voiceURI) : offlineVoices[0];
  if (chosenVoice) utterance.voice = chosenVoice;
  return utterance;
}
function speak(text, options = {}) {
  const synth = window.speechSynthesis;
  currentSpeech += 1;
  synth.cancel();
  synth.speak(makeUtterance(text, options));
}
function speakWordByWord(words, options, onWord) {
  const synth = window.speechSynthesis;
  currentSpeech += 1;
  const mine = currentSpeech;
  synth.cancel();
  if (words.length === 0) {
    onWord(null);
    return;
  }
  function sayFrom(index) {
    if (mine !== currentSpeech) return;
    if (index >= words.length) {
      onWord(null);
      return;
    }
    const utterance = makeUtterance(words[index], options);
    const next = () => {
      if (mine === currentSpeech) sayFrom(index + 1);
      else if (index === words.length - 1) onWord(null);
    };
    utterance.onend = next;
    utterance.onerror = next;
    onWord(index);
    synth.speak(utterance);
  }
  sayFrom(0);
}
const instanceOfAny = (object, constructors) => constructors.some((c2) => object instanceof c2);
let idbProxyableTypes;
let cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const transactionDoneMap = /* @__PURE__ */ new WeakMap();
const transformCache = /* @__PURE__ */ new WeakMap();
const reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(this.request);
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
const writeMethods = ["put", "add", "delete", "clear"];
const cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
const advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
const methodMap = {};
const advanceResults = /* @__PURE__ */ new WeakMap();
const ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
const cursorIteratorTraps = {
  get(target, prop) {
    if (!advanceMethodProps.includes(prop))
      return target[prop];
    let cachedFunc = methodMap[prop];
    if (!cachedFunc) {
      cachedFunc = methodMap[prop] = function(...args) {
        advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
      };
    }
    return cachedFunc;
  }
};
async function* iterate(...args) {
  let cursor = this;
  if (!(cursor instanceof IDBCursor)) {
    cursor = await cursor.openCursor(...args);
  }
  if (!cursor)
    return;
  cursor = cursor;
  const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
  ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
  reverseTransformCache.set(proxiedCursor, unwrap(cursor));
  while (cursor) {
    yield proxiedCursor;
    cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
    advanceResults.delete(proxiedCursor);
  }
}
function isIteratorProp(target, prop) {
  return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get(target, prop, receiver) {
    if (isIteratorProp(target, prop))
      return iterate;
    return oldTraps.get(target, prop, receiver);
  },
  has(target, prop) {
    return isIteratorProp(target, prop) || oldTraps.has(target, prop);
  }
}));
function word(id, label, cls, emoji) {
  return {
    id,
    label,
    image: { kind: "emoji", char: emoji },
    background_color: FITZGERALD_COLORS[cls]
  };
}
function folder(id, label, cls, emoji, targetBoardId) {
  return {
    id,
    label,
    image: { kind: "emoji", char: emoji },
    background_color: FITZGERALD_COLORS[cls],
    load_board: { id: targetBoardId }
  };
}
function gridOrder(ids, rows, columns) {
  const cells = rows * columns;
  const padded = [...ids];
  while (padded.length < cells) padded.push(null);
  const order = [];
  for (let r2 = 0; r2 < rows; r2 += 1) {
    order.push(padded.slice(r2 * columns, (r2 + 1) * columns));
  }
  return order;
}
const ROOT_BOARD_ID = "talk-root";
const FOOD_BOARD_ID = "food";
const FOOD_DRINKS_BOARD_ID = "food-drinks";
const FEELINGS_BOARD_ID = "feelings";
const PLAY_BOARD_ID = "play";
const PEOPLE_BOARD_ID = "people";
const PLACES_BOARD_ID = "places";
const SCHOOL_BOARD_ID = "school";
const ACTIONS_BOARD_ID = "actions";
const ANIMALS_BOARD_ID = "animals";
const BODY_BOARD_ID = "body";
const HELLO_BOARD_ID = "hello";
function board(id, name, rows, columns, buttons) {
  return { id, name, grid: { rows, columns, order: gridOrder(buttons.map((b2) => b2.id), rows, columns) }, buttons };
}
const rootBoard = board(ROOT_BOARD_ID, "Talk", 4, 4, [
  word("i", "I", "littleWords", "🙋"),
  word("want", "want", "doing", "🤲"),
  word("like", "like", "doing", "👍"),
  word("more", "more", "littleWords", "➕"),
  word("no", "no", "noStop", "🚫"),
  word("yes", "yes", "littleWords", "✅"),
  word("help", "help", "social", "🆘"),
  word("go", "go", "doing", "🚶"),
  word("my", "my", "littleWords", "☝️"),
  word("feel", "feel", "describing", "❤️"),
  folder("food", "Food", "things", "🍽️", FOOD_BOARD_ID),
  folder("feelings", "Feelings", "describing", "😊", FEELINGS_BOARD_ID),
  folder("play", "Play", "things", "🧸", PLAY_BOARD_ID),
  folder("people", "People", "people", "👨‍👩‍👧", PEOPLE_BOARD_ID),
  folder("places", "Places", "places", "📍", PLACES_BOARD_ID),
  folder("actions", "Doing", "doing", "🏃", ACTIONS_BOARD_ID)
]);
const foodBoard = board(FOOD_BOARD_ID, "Food", 3, 3, [
  word("apple", "apple", "things", "🍎"),
  word("banana", "banana", "things", "🍌"),
  word("biscuit", "biscuit", "things", "🍪"),
  word("bread", "bread", "things", "🍞"),
  word("cheese", "cheese", "things", "🧀"),
  word("egg", "egg", "things", "🥚"),
  word("a-drink", "a drink", "things", "🥤"),
  folder("drinks", "Drinks", "things", "🧃", FOOD_DRINKS_BOARD_ID)
]);
const foodDrinksBoard = board(FOOD_DRINKS_BOARD_ID, "Drinks", 3, 3, [
  word("water", "water", "things", "💧"),
  word("juice", "juice", "things", "🧃"),
  word("milk", "milk", "things", "🥛")
]);
const feelingsBoard = board(FEELINGS_BOARD_ID, "Feelings", 3, 3, [
  word("happy", "happy", "describing", "😊"),
  word("sad", "sad", "describing", "😢"),
  word("angry", "angry", "describing", "😠"),
  word("tired", "tired", "describing", "😴"),
  word("hungry", "hungry", "describing", "😋"),
  word("scared-talk", "scared", "describing", "😨"),
  { ...word("it-hurts", "it hurts", "describing", "🤕"), vocalization: "It hurts" },
  folder("body", "My body", "things", "🙂", BODY_BOARD_ID)
]);
const playBoard = board(PLAY_BOARD_ID, "Play", 3, 3, [
  word("ball", "ball", "things", "⚽"),
  word("blocks", "blocks", "things", "🧱"),
  word("storybook", "book", "things", "📖"),
  word("car", "car", "things", "🚗"),
  word("teddy", "teddy", "things", "🧸"),
  word("music", "music", "things", "🎵"),
  word("tv", "TV", "things", "📺"),
  folder("animals", "Animals", "things", "🐶", ANIMALS_BOARD_ID)
]);
const peopleBoard = board(PEOPLE_BOARD_ID, "People", 4, 4, [
  word("mum", "Mum", "people", "👩"),
  word("dad", "Dad", "people", "👨"),
  word("me", "me", "people", "🙋"),
  word("you", "you", "people", "👉"),
  word("friend", "friend", "people", "🧑‍🤝‍🧑"),
  word("teacher", "teacher", "people", "🧑‍🏫"),
  word("baby", "baby", "people", "👶"),
  word("grandma", "Grandma", "people", "👵"),
  folder("hello", "Hello", "social", "👋", HELLO_BOARD_ID)
]);
const placesBoard = board(PLACES_BOARD_ID, "Places", 4, 4, [
  word("home-place", "home", "places", "🏠"),
  word("park", "park", "places", "🌳"),
  word("shop", "shop", "places", "🏪"),
  word("bedroom", "bedroom", "places", "🛏️"),
  word("kitchen", "kitchen", "places", "🍳"),
  word("car-place", "in the car", "places", "🚗"),
  folder("school", "School", "things", "🏫", SCHOOL_BOARD_ID)
]);
const schoolBoard = board(SCHOOL_BOARD_ID, "School", 3, 3, [
  word("pencil", "pencil", "things", "✏️"),
  word("school-book", "book", "things", "📚"),
  word("school-teacher", "teacher", "people", "🧑‍🏫"),
  word("break", "break", "things", "🕑"),
  word("lunch", "lunch", "things", "🍱"),
  word("my-turn", "my turn", "social", "🙋"),
  word("your-turn", "your turn", "social", "👉")
]);
const actionsBoard = board(ACTIONS_BOARD_ID, "Doing", 4, 4, [
  word("stop", "stop", "noStop", "🛑"),
  word("look", "look", "doing", "👀"),
  word("all-done", "all done", "littleWords", "🏁"),
  word("eat", "eat", "doing", "🍽️"),
  word("drink", "drink", "doing", "🥤"),
  word("sleep", "sleep", "doing", "😴"),
  word("wash", "wash", "doing", "🧼"),
  { ...word("toilet", "toilet", "things", "🚽"), vocalization: "I need the toilet" },
  word("sit", "sit", "doing", "🪑"),
  word("again", "again", "littleWords", "🔁"),
  word("open", "open", "doing", "📂"),
  word("that", "that", "littleWords", "👆"),
  word("not", "not", "noStop", "⛔")
]);
const animalsBoard = board(ANIMALS_BOARD_ID, "Animals", 3, 3, [
  word("dog", "dog", "things", "🐶"),
  word("cat", "cat", "things", "🐱"),
  word("bird", "bird", "things", "🐦"),
  word("fish", "fish", "things", "🐟"),
  word("horse", "horse", "things", "🐴"),
  word("cow", "cow", "things", "🐮"),
  word("pig", "pig", "things", "🐷"),
  word("duck", "duck", "things", "🦆"),
  word("sheep", "sheep", "things", "🐑")
]);
const bodyBoard = board(BODY_BOARD_ID, "My body", 3, 3, [
  word("head", "head", "things", "🙂"),
  word("eyes", "eyes", "things", "👁️"),
  word("ears", "ears", "things", "👂"),
  word("nose", "nose", "things", "👃"),
  word("mouth", "mouth", "things", "👄"),
  word("hand", "hand", "things", "✋"),
  word("tummy", "tummy", "things", "🎽"),
  word("leg", "leg", "things", "🦵"),
  word("foot", "foot", "things", "🦶")
]);
const helloBoard = board(HELLO_BOARD_ID, "Hello", 3, 3, [
  word("what", "what?", "social", "❓"),
  word("hello-word", "hello", "social", "👋"),
  word("goodbye", "goodbye", "social", "🖐️"),
  word("please", "please", "social", "🙏"),
  word("thank-you", "thank you", "social", "😊"),
  word("sorry", "sorry", "social", "😔"),
  word("wait", "wait", "social", "✋"),
  word("goodnight", "goodnight", "social", "🌙")
]);
const STARTER_BOARDS = [
  rootBoard,
  foodBoard,
  foodDrinksBoard,
  feelingsBoard,
  playBoard,
  peopleBoard,
  placesBoard,
  schoolBoard,
  actionsBoard,
  animalsBoard,
  bodyBoard,
  helloBoard
];
function collectVocabularyWords() {
  const labels = STARTER_BOARDS.flatMap((board2) => board2.buttons.map((button) => button.label));
  return Array.from(new Set(labels));
}
const EMPTY_LOST_MODE = { on: false, returnTo: "", phone: "", address: "", note: "" };
function isLostMode(value) {
  if (typeof value !== "object" || value === null) return false;
  const v2 = value;
  return typeof v2["on"] === "boolean" && ["returnTo", "phone", "address", "note"].every((k2) => typeof v2[k2] === "string");
}
function canTurnOn(lost) {
  return Boolean(lost.returnTo.trim() || lost.phone.trim() || lost.address.trim());
}
function lostMessage(lost, deviceName) {
  const where = [lost.returnTo.trim(), lost.address.trim()].filter(Boolean).join(", ");
  const phone = lost.phone.trim();
  const parts = [`This is a critical communication device${deviceName ? `: ${deviceName}` : ""}.`];
  if (where && phone) parts.push(`Please return it to ${where}, or phone ${phone}.`);
  else if (where) parts.push(`Please return it to ${where}.`);
  else if (phone) parts.push(`Please phone ${phone} to arrange its return.`);
  else parts.push("Please return it to its owner.");
  if (lost.note.trim()) parts.push(lost.note.trim());
  return parts.join(" ");
}
const TRAFFIC_LIGHTS = [
  { id: "red", colour: "#dc2626", short: "Please leave me", icon: "🔴" },
  { id: "amber", colour: "#f59e0b", short: "Talk gently, wait for me", icon: "🟠" },
  { id: "green", colour: "#16a34a", short: "Happy to talk", icon: "🟢" }
];
const DEFAULT_TRAFFIC = {
  status: "off",
  phrases: {
    red: "Please don't talk to me right now.",
    amber: "You can talk to me, but please be gentle and give me time.",
    green: "I'm happy to talk to you."
  }
};
function isTrafficSetting(value) {
  if (typeof value !== "object" || value === null) return false;
  const v2 = value;
  const phrases = v2["phrases"];
  return ["off", "red", "amber", "green"].includes(v2["status"]) && typeof phrases === "object" && phrases !== null && ["red", "amber", "green"].every((key) => typeof phrases[key] === "string");
}
const trafficLight = (id) => TRAFFIC_LIGHTS.find((light) => light.id === id);
const HASH_ITERATIONS = 1e5;
function toHex(bytes) {
  return Array.from(bytes, (b2) => b2.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i2 = 0; i2 < bytes.length; i2 += 1) bytes[i2] = parseInt(hex.slice(i2 * 2, i2 * 2 + 2), 16);
  return bytes;
}
async function derive(secret, salt, iterations) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, material, 256);
  return toHex(new Uint8Array(bits));
}
async function hashSecret(secret) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: toHex(salt), hash: await derive(secret, salt, HASH_ITERATIONS), iterations: HASH_ITERATIONS };
}
function sameText(a2, b2) {
  if (a2.length !== b2.length) return false;
  let difference = 0;
  for (let i2 = 0; i2 < a2.length; i2 += 1) difference |= a2.charCodeAt(i2) ^ b2.charCodeAt(i2);
  return difference === 0;
}
async function verifySecret(secret, record) {
  return sameText(await derive(secret, fromHex(record.salt), record.iterations), record.hash);
}
const isHashedSecret = (value) => typeof value === "object" && value !== null && typeof value.salt === "string" && typeof value.hash === "string" && Number.isInteger(value.iterations) && value.iterations > 0;
const FREE_ATTEMPTS = 5;
const FIRST_WAIT_MS = 3e4;
const LONGEST_WAIT_MS = 10 * 6e4;
const failures = { parent: 0, school: 0 };
const lockedUntil = { parent: 0, school: 0 };
function waitRemaining(now = Date.now(), scope = "parent") {
  return Math.max(0, lockedUntil[scope] - now);
}
function recordWrongPin(now = Date.now(), scope = "parent") {
  failures[scope] += 1;
  if (failures[scope] >= FREE_ATTEMPTS) {
    const step = failures[scope] - FREE_ATTEMPTS;
    lockedUntil[scope] = now + Math.min(LONGEST_WAIT_MS, FIRST_WAIT_MS * 2 ** step);
  }
}
function recordRightPin(scope = "parent") {
  failures[scope] = 0;
  lockedUntil[scope] = 0;
}
const RETENTION_CHOICES = [7, 30, 90, 365];
const DEFAULT_RETENTION_DAYS = 30;
const MAX_ENTRIES = 2e4;
const MAX_LABEL = 200;
const KIND_LABELS = {
  speech: "Said",
  screen: "Opened",
  adult: "Adult"
};
const HOUR = 60 * 60 * 1e3;
const DAY$1 = 24 * HOUR;
function startOfHour(at2) {
  const d2 = new Date(at2);
  d2.setMinutes(0, 0, 0);
  return d2.getTime();
}
function startOfDay(at2) {
  const d2 = new Date(at2);
  d2.setHours(0, 0, 0, 0);
  return d2.getTime();
}
function startOfWeek(at2) {
  const d2 = new Date(startOfDay(at2));
  d2.setDate(d2.getDate() - (d2.getDay() + 6) % 7);
  return d2.getTime();
}
function startOfMonth(at2) {
  const d2 = new Date(at2);
  d2.setDate(1);
  d2.setHours(0, 0, 0, 0);
  return d2.getTime();
}
const WEEKDAYS$1 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PERIOD_BARS = { hour: 24, day: 14, week: 8, month: 6 };
function buckets(entries, period, now, kinds) {
  const starts = [];
  const n2 = PERIOD_BARS[period];
  let cursor = period === "hour" ? startOfHour(now) : period === "day" ? startOfDay(now) : period === "week" ? startOfWeek(now) : startOfMonth(now);
  for (let i2 = 0; i2 < n2; i2 += 1) {
    starts.unshift(cursor);
    const d2 = new Date(cursor);
    if (period === "hour") d2.setHours(d2.getHours() - 1);
    else if (period === "day") d2.setDate(d2.getDate() - 1);
    else if (period === "week") d2.setDate(d2.getDate() - 7);
    else d2.setMonth(d2.getMonth() - 1);
    cursor = d2.getTime();
  }
  const counts = new Map(starts.map((s2) => [s2, 0]));
  const keyOf = (at2) => period === "hour" ? startOfHour(at2) : period === "day" ? startOfDay(at2) : period === "week" ? startOfWeek(at2) : startOfMonth(at2);
  for (const entry of entries) {
    if (kinds && !kinds.includes(entry.kind)) continue;
    const key = keyOf(entry.at);
    if (counts.has(key)) counts.set(key, counts.get(key) + 1);
  }
  return starts.map((start) => {
    const d2 = new Date(start);
    const label = period === "hour" ? `${String(d2.getHours()).padStart(2, "0")}:00` : period === "day" ? `${WEEKDAYS$1[d2.getDay()]} ${d2.getDate()}` : period === "week" ? `${d2.getDate()} ${MONTHS[d2.getMonth()]}` : `${MONTHS[d2.getMonth()]} ${String(d2.getFullYear()).slice(2)}`;
    return { label, start, count: counts.get(start) };
  });
}
function totals(entries, now, kinds) {
  const mine = kinds ? entries.filter((e2) => kinds.includes(e2.kind)) : entries;
  const count = (since) => mine.filter((e2) => e2.at >= since && e2.at <= now).length;
  return {
    lastHour: count(now - HOUR),
    today: count(startOfDay(now)),
    week: count(startOfDay(now) - 6 * DAY$1),
    month: count(startOfDay(now) - 29 * DAY$1),
    all: mine.length
  };
}
function topSpoken(entries, now, days, limit = 10) {
  const since = startOfDay(now) - (days - 1) * DAY$1;
  const counts = /* @__PURE__ */ new Map();
  for (const e2 of entries) {
    if (e2.kind !== "speech" || e2.at < since) continue;
    const key = e2.label.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a2, b2) => b2.count - a2.count || a2.label.localeCompare(b2.label)).slice(0, limit);
}
const pad = (n2) => String(n2).padStart(2, "0");
function formatTime$1(at2) {
  const d2 = new Date(at2);
  return `${d2.getFullYear()}-${pad(d2.getMonth() + 1)}-${pad(d2.getDate())} ${pad(d2.getHours())}:${pad(d2.getMinutes())}`;
}
function csvCell$1(text) {
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}
function entriesToCsv(entries) {
  const rows = [...entries].sort((a2, b2) => b2.at - a2.at).map((e2) => [formatTime$1(e2.at), KIND_LABELS[e2.kind], e2.label].map(csvCell$1).join(","));
  return ['"When","What","Detail"', ...rows].join("\r\n") + "\r\n";
}
const isRetention = (value) => typeof value === "number" && RETENTION_CHOICES.includes(value);
const EMPTY_SCHOOL_INFO = { school: "", className: "", teacher: "", keyAdult: "", senco: "", slt: "", phone: "", dsl: "", dslPhone: "" };
const SCHOOL_INFO_FIELDS = [
  { id: "school", label: "School or setting", placeholder: "Oakfield Primary" },
  { id: "className", label: "Class or year group", placeholder: "Year 2, Robins" },
  { id: "teacher", label: "Class teacher", placeholder: "" },
  { id: "keyAdult", label: "Key adult or teaching assistant", placeholder: "" },
  { id: "senco", label: "SENCo", placeholder: "" },
  { id: "slt", label: "Speech and language therapist", placeholder: "" },
  { id: "phone", label: "School phone", placeholder: "" },
  { id: "dsl", label: "Designated safeguarding lead", placeholder: "" },
  { id: "dslPhone", label: "Safeguarding lead phone", placeholder: "" }
];
const isSchoolInfo = (value) => typeof value === "object" && value !== null && Object.keys(EMPTY_SCHOOL_INFO).filter((key) => key !== "dsl" && key !== "dslPhone").every((key) => typeof value[key] === "string");
const TARGET_AREAS = [
  { id: "express", label: "Saying things", example: "Uses “want” plus a word to ask for something, 4 times a day." },
  { id: "understand", label: "Understanding", example: "Follows a two-step instruction with a picture to help." },
  { id: "social", label: "Talking with others", example: "Says hello and goodbye to a friend, with a reminder." },
  { id: "access", label: "Using the device", example: "Finds the Help button without help." },
  { id: "other", label: "Something else", example: "" }
];
const TARGET_STATUS_LABELS = {
  working: "Working on it",
  achieved: "Achieved",
  paused: "Paused"
};
const MAX_TARGETS = 60;
const isTargetList = (value) => Array.isArray(value) && value.length <= MAX_TARGETS && value.every((t2) => {
  if (typeof t2 !== "object" || t2 === null) return false;
  const target = t2;
  return ["id", "text", "set", "review", "notes"].every((key) => typeof target[key] === "string") && TARGET_AREAS.some((a2) => a2.id === target["area"]) && ["working", "achieved", "paused"].includes(target["status"]);
});
const NOTE_KINDS = [
  { id: "observation", label: "Something I noticed" },
  { id: "success", label: "Something that went well" },
  { id: "idea", label: "An idea to try" },
  { id: "concern", label: "Something to follow up" }
];
const MAX_NOTES = 500;
const isNoteList = (value) => Array.isArray(value) && value.length <= MAX_NOTES && value.every((n2) => {
  if (typeof n2 !== "object" || n2 === null) return false;
  const note = n2;
  return typeof note["id"] === "string" && typeof note["at"] === "number" && typeof note["by"] === "string" && typeof note["text"] === "string";
});
function sortedTargets(targets) {
  const rank = { working: 0, paused: 1, achieved: 2 };
  return [...targets].sort((a2, b2) => rank[a2.status] - rank[b2.status]);
}
function reviewDue(target, today2) {
  return target.status === "working" && target.review !== "" && target.review <= today2;
}
function schoolInfoLines(info) {
  return SCHOOL_INFO_FIELDS.filter((field) => (info[field.id] ?? "").trim() !== "").map((field) => ({
    label: field.label,
    value: (info[field.id] ?? "").trim()
  }));
}
function suggestedReturnTo(info) {
  return [info.school.trim(), info.className.trim()].filter(Boolean).join(", ");
}
const act = (id, name, time) => ({ id, name, time });
function weekday(day) {
  return [
    act(`${day}-reg`, "Registration", "08:50"),
    act(`${day}-lesson1`, "Lesson 1", "09:15"),
    act(`${day}-break`, "Break", "10:30"),
    act(`${day}-lesson2`, "Lesson 2", "10:50"),
    act(`${day}-lunch`, "Lunch", "12:00"),
    act(`${day}-play`, "Playtime", "12:30"),
    act(`${day}-lesson3`, "Lesson 3", "13:15"),
    act(`${day}-story`, "Story time", "14:45"),
    act(`${day}-home`, "Home time", "15:15")
  ];
}
function typicalSchoolWeek() {
  return {
    mon: weekday("mon"),
    tue: weekday("tue"),
    wed: weekday("wed"),
    thu: weekday("thu"),
    fri: weekday("fri"),
    sat: [],
    sun: []
  };
}
const routineIsEmpty = (routine) => Object.values(routine).every((day) => day.length === 0);
const at = (id, kind, x2, y2) => ({
  id,
  kind,
  x: Math.round(x2 / 3 * 10) / 10,
  y: Math.round(y2 / 3.6 * 10) / 10
});
const TREE_SLOTS = [
  at("top", "top", 150, 34),
  at("t1", "tree", 150, 88),
  at("t2", "tree", 128, 118),
  at("t3", "tree", 172, 118),
  at("t4", "tree", 132, 148),
  at("t5", "tree", 168, 148),
  at("t6", "tree", 106, 184),
  at("t7", "tree", 150, 178),
  at("t8", "tree", 194, 184),
  at("t9", "tree", 122, 218),
  at("t10", "tree", 178, 218),
  at("t11", "tree", 98, 248),
  at("t12", "tree", 150, 248),
  at("t13", "tree", 202, 248),
  at("t14", "tree", 66, 278),
  at("t15", "tree", 108, 278),
  at("t16", "tree", 150, 278),
  at("t17", "tree", 192, 278),
  at("t18", "tree", 234, 278),
  at("f1", "floor", 58, 334),
  at("f2", "floor", 118, 338),
  at("f3", "floor", 182, 338),
  at("f4", "floor", 242, 334)
];
const TREE_TOOLS = [
  { id: "star", label: "Star", kind: "top", emoji: "⭐" },
  { id: "red", label: "Red bauble", kind: "tree", colour: "#dc2626" },
  { id: "blue", label: "Blue bauble", kind: "tree", colour: "#2563eb" },
  { id: "gold", label: "Gold bauble", kind: "tree", colour: "#eab308" },
  { id: "pink", label: "Pink bauble", kind: "tree", colour: "#ec4899" },
  { id: "purple", label: "Purple bauble", kind: "tree", colour: "#7c3aed" },
  { id: "light", label: "Light", kind: "tree", emoji: "💡" },
  { id: "bell", label: "Bell", kind: "tree", emoji: "🔔" },
  { id: "candy", label: "Sweet", kind: "tree", emoji: "🍬" },
  { id: "giftRed", label: "Red present", kind: "floor", emoji: "🎁" },
  { id: "giftBlue", label: "Blue present", kind: "floor", colour: "#2563eb", emoji: "🎁" },
  { id: "giftGold", label: "Gold present", kind: "floor", colour: "#eab308", emoji: "🎁" },
  { id: "off", label: "Take off", kind: "any", emoji: "🧽" }
];
const TOOL_IDS = new Set(TREE_TOOLS.map((tool) => tool.id));
const SLOT_IDS = new Set(TREE_SLOTS.map((slot) => slot.id));
const isTreeDesign = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && Object.entries(value).every(([slot, tool]) => SLOT_IDS.has(slot) && typeof tool === "string" && TOOL_IDS.has(tool) && tool !== "off");
const toolById = (id) => TREE_TOOLS.find((tool) => tool.id === id);
function place(design, slot, toolId) {
  const tool = toolById(toolId);
  if (tool.id === "off") {
    if (!design[slot.id]) return { design, message: "There is nothing there to take off." };
    const rest = { ...design };
    delete rest[slot.id];
    return { design: rest, message: "Taken off." };
  }
  if (tool.kind !== slot.kind) {
    const where = tool.kind === "top" ? "The star goes on the very top." : tool.kind === "floor" ? "Presents go under the tree." : "That goes on the tree.";
    return { design, message: where };
  }
  return { design: { ...design, [slot.id]: tool.id }, message: `${tool.label} hung.` };
}
const hungCount = (design) => Object.keys(design).length;
const TRADITIONS = ["The year", "Christian", "Muslim", "Jewish", "Hindu", "Sikh", "Chinese", "Other celebrations", "Your own"];
const SEASONS = [
  {
    id: "spring",
    tradition: "The year",
    name: "Spring",
    emoji: "🌷",
    words: [
      { label: "flower", emoji: "🌸", colour: "things" },
      { label: "rain", emoji: "🌧️", colour: "things" },
      { label: "lamb", emoji: "🐑", colour: "things" },
      { label: "seed", emoji: "🌱", colour: "things" },
      { label: "butterfly", emoji: "🦋", colour: "things" },
      { label: "wellies", emoji: "🥾", colour: "things" },
      { label: "puddle", emoji: "💦", colour: "things" },
      { label: "bird", emoji: "🐦", colour: "things" },
      { label: "sunny", emoji: "☀️", colour: "describing" }
    ]
  },
  {
    id: "summer",
    tradition: "The year",
    name: "Summer",
    emoji: "☀️",
    words: [
      { label: "sun", emoji: "☀️", colour: "things" },
      { label: "ice cream", emoji: "🍦", colour: "things", says: "I want an ice cream" },
      { label: "beach", emoji: "🏖️", colour: "places" },
      { label: "swim", emoji: "🏊", colour: "doing" },
      { label: "picnic", emoji: "🧺", colour: "things" },
      { label: "sunglasses", emoji: "😎", colour: "things" },
      { label: "water", emoji: "💧", colour: "things" },
      { label: "hot", emoji: "🥵", colour: "describing" },
      { label: "sandcastle", emoji: "🏰", colour: "things" }
    ]
  },
  {
    id: "autumn",
    tradition: "The year",
    name: "Autumn",
    emoji: "🍂",
    words: [
      { label: "leaf", emoji: "🍂", colour: "things" },
      { label: "conker", emoji: "🌰", colour: "things" },
      { label: "wind", emoji: "💨", colour: "things" },
      { label: "apple", emoji: "🍎", colour: "things" },
      { label: "hedgehog", emoji: "🦔", colour: "things" },
      { label: "squirrel", emoji: "🐿️", colour: "things" },
      { label: "mushroom", emoji: "🍄", colour: "things" },
      { label: "coat", emoji: "🧥", colour: "things" },
      { label: "rain", emoji: "🌧️", colour: "things" }
    ]
  },
  {
    id: "winter",
    tradition: "The year",
    name: "Winter",
    emoji: "❄️",
    words: [
      { label: "snow", emoji: "❄️", colour: "things" },
      { label: "snowman", emoji: "⛄", colour: "things" },
      { label: "ice", emoji: "🧊", colour: "things" },
      { label: "scarf", emoji: "🧣", colour: "things" },
      { label: "gloves", emoji: "🧤", colour: "things" },
      { label: "hot chocolate", emoji: "☕", colour: "things", says: "I want a hot chocolate" },
      { label: "coat", emoji: "🧥", colour: "things" },
      { label: "cold", emoji: "🥶", colour: "describing" },
      { label: "warm", emoji: "🔥", colour: "describing" }
    ]
  },
  {
    id: "christmas",
    tradition: "Christian",
    note: "A Christian festival, also kept by many families as a family holiday.",
    name: "Christmas",
    emoji: "🎄",
    words: [
      { label: "tree", emoji: "🎄", colour: "things" },
      { label: "present", emoji: "🎁", colour: "things" },
      { label: "Santa", emoji: "🎅", colour: "people" },
      { label: "star", emoji: "⭐", colour: "things" },
      { label: "reindeer", emoji: "🦌", colour: "things" },
      { label: "snowman", emoji: "⛄", colour: "things" },
      { label: "bell", emoji: "🔔", colour: "things" },
      { label: "lights", emoji: "💡", colour: "things" },
      { label: "Merry Christmas", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "easter",
    tradition: "Christian",
    note: "A Christian festival, also kept by many families with eggs and bunnies.",
    name: "Easter",
    emoji: "🐣",
    words: [
      { label: "egg", emoji: "🥚", colour: "things" },
      { label: "chick", emoji: "🐥", colour: "things" },
      { label: "bunny", emoji: "🐰", colour: "things" },
      { label: "basket", emoji: "🧺", colour: "things" },
      { label: "chocolate", emoji: "🍫", colour: "things", says: "I want chocolate" },
      { label: "egg hunt", emoji: "🔍", colour: "doing" },
      { label: "lamb", emoji: "🐑", colour: "things" },
      { label: "flower", emoji: "🌷", colour: "things" },
      { label: "Happy Easter", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "halloween",
    tradition: "Other celebrations",
    note: "31 October.",
    name: "Halloween",
    emoji: "🎃",
    words: [
      { label: "pumpkin", emoji: "🎃", colour: "things" },
      { label: "ghost", emoji: "👻", colour: "things" },
      { label: "bat", emoji: "🦇", colour: "things" },
      { label: "spider", emoji: "🕷️", colour: "things" },
      { label: "witch", emoji: "🧙", colour: "people" },
      { label: "black cat", emoji: "🐈‍⬛", colour: "things" },
      { label: "costume", emoji: "🎭", colour: "things" },
      { label: "sweets", emoji: "🍬", colour: "things", says: "I want sweets" },
      { label: "trick or treat", emoji: "🏠", colour: "social" }
    ]
  },
  {
    id: "bonfire",
    tradition: "Other celebrations",
    note: "Bonfire Night, or Guy Fawkes Night, 5 November. It includes ways to say it is too loud.",
    name: "Bonfire Night",
    emoji: "🎆",
    words: [
      { label: "fireworks", emoji: "🎆", colour: "things" },
      { label: "sparkler", emoji: "🎇", colour: "things" },
      { label: "bonfire", emoji: "🔥", colour: "things" },
      { label: "bang", emoji: "💥", colour: "things" },
      { label: "loud", emoji: "🔊", colour: "describing" },
      { label: "ear defenders", emoji: "🎧", colour: "things", says: "I want my ear defenders" },
      { label: "hot dog", emoji: "🌭", colour: "things" },
      { label: "too loud", emoji: "🙉", colour: "social", says: "It is too loud" },
      { label: "watch", emoji: "👀", colour: "doing" }
    ]
  },
  {
    id: "diwali",
    tradition: "Hindu",
    note: "Diwali, or Deepavali, the festival of lights. Kept by Hindus, Sikhs and Jains.",
    name: "Diwali",
    emoji: "🪔",
    words: [
      { label: "diya", emoji: "🪔", colour: "things" },
      { label: "candle", emoji: "🕯️", colour: "things" },
      { label: "lights", emoji: "💡", colour: "things" },
      { label: "rangoli", emoji: "🌺", colour: "things" },
      { label: "fireworks", emoji: "🎆", colour: "things" },
      { label: "sweets", emoji: "🍬", colour: "things", says: "I want sweets" },
      { label: "new clothes", emoji: "👗", colour: "things" },
      { label: "family", emoji: "👨‍👩‍👧", colour: "people" },
      { label: "Happy Diwali", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "eid",
    tradition: "Muslim",
    note: "Eid al-Fitr, at the end of Ramadan, and Eid al-Adha.",
    name: "Eid",
    emoji: "🌙",
    words: [
      { label: "moon", emoji: "🌙", colour: "things" },
      { label: "mosque", emoji: "🕌", colour: "places" },
      { label: "prayers", emoji: "🤲", colour: "doing" },
      { label: "new clothes", emoji: "👗", colour: "things" },
      { label: "special food", emoji: "🍽️", colour: "things" },
      { label: "sweets", emoji: "🍬", colour: "things", says: "I want sweets" },
      { label: "present", emoji: "🎁", colour: "things" },
      { label: "family", emoji: "👨‍👩‍👧", colour: "people" },
      { label: "Eid Mubarak", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "hanukkah",
    tradition: "Jewish",
    note: "Hanukkah, also spelled Chanukah, the festival of lights.",
    name: "Hanukkah",
    emoji: "🕎",
    words: [
      { label: "menorah", emoji: "🕎", colour: "things" },
      { label: "candle", emoji: "🕯️", colour: "things" },
      { label: "doughnut", emoji: "🍩", colour: "things", says: "I want a doughnut" },
      { label: "coins", emoji: "🪙", colour: "things" },
      { label: "present", emoji: "🎁", colour: "things" },
      { label: "Star of David", emoji: "✡️", colour: "things" },
      { label: "lights", emoji: "💡", colour: "things" },
      { label: "family", emoji: "👨‍👩‍👧", colour: "people" },
      { label: "Happy Hanukkah", emoji: "🎉", colour: "social" }
    ]
  }
];
function seasonItems(season) {
  const seen2 = /* @__PURE__ */ new Set();
  const items = [];
  season.words.forEach((word2, index) => {
    const key = word2.label.trim().toLowerCase();
    if (!key || seen2.has(key)) return;
    seen2.add(key);
    items.push({
      id: `season-${season.id}-${index}`,
      label: word2.label.trim(),
      ...word2.says?.trim() ? { vocalization: word2.says.trim() } : {},
      image: { kind: "emoji", char: word2.emoji },
      background_color: FITZGERALD_COLORS[word2.colour]
    });
  });
  return items;
}
function seasonTemplate(season) {
  return {
    id: `season-${season.id}`,
    name: season.name,
    description: `Words for ${season.name}. Change them to match what your family does.`,
    buttons: season.words.map((word2) => ({
      label: word2.label,
      emoji: word2.emoji,
      colour: word2.colour,
      ...word2.says ? { says: word2.says } : {}
    }))
  };
}
function easterSunday(year) {
  const a2 = year % 19;
  const b2 = Math.floor(year / 100);
  const c2 = year % 100;
  const d2 = Math.floor(b2 / 4);
  const e2 = b2 % 4;
  const f2 = Math.floor((b2 + 8) / 25);
  const g2 = Math.floor((b2 - f2 + 1) / 3);
  const h2 = (19 * a2 + b2 - d2 - g2 + 15) % 30;
  const i2 = Math.floor(c2 / 4);
  const k2 = c2 % 4;
  const l2 = (32 + 2 * e2 + 2 * i2 - h2 - k2) % 7;
  const m2 = Math.floor((a2 + 11 * h2 + 22 * l2) / 451);
  const month = Math.floor((h2 + l2 - 7 * m2 + 114) / 31);
  const day = (h2 + l2 - 7 * m2 + 114) % 31 + 1;
  return new Date(year, month - 1, day);
}
const DAY = 24 * 60 * 60 * 1e3;
function suggestedSeason(date) {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 11) return "christmas";
  if (month === 9 && day >= 15) return "halloween";
  if (month === 10 && day <= 8) return "bonfire";
  const easter = easterSunday(date.getFullYear()).getTime();
  const today2 = new Date(date.getFullYear(), month, day).getTime();
  if (today2 >= easter - 14 * DAY && today2 <= easter + 7 * DAY) return "easter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}
const MORE_SEASONS = [
  {
    id: "ramadan",
    name: "Ramadan",
    emoji: "🌙",
    tradition: "Muslim",
    note: "The month of fasting. Many children join in part of it, if at all.",
    words: [
      { label: "moon", emoji: "🌙", colour: "things" },
      { label: "mosque", emoji: "🕌", colour: "places" },
      { label: "prayers", emoji: "🤲", colour: "doing" },
      { label: "Qur’an", emoji: "📖", colour: "things" },
      { label: "iftar", emoji: "🍽️", colour: "things", says: "It is time for iftar" },
      { label: "lantern", emoji: "🏮", colour: "things" },
      { label: "family", emoji: "👨‍👩‍👧", colour: "people" },
      { label: "Ramadan Mubarak", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "vaisakhi",
    name: "Vaisakhi",
    emoji: "🥁",
    tradition: "Sikh",
    note: "Also called Baisakhi. A Sikh festival, and a spring harvest festival for many Hindus.",
    words: [
      { label: "turban", emoji: "👳", colour: "things" },
      { label: "drum", emoji: "🥁", colour: "things" },
      { label: "singing", emoji: "🎶", colour: "doing" },
      { label: "langar", emoji: "🍛", colour: "things", says: "I want langar" },
      { label: "family", emoji: "👨‍👩‍👧", colour: "people" },
      { label: "Happy Vaisakhi", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "holi",
    name: "Holi",
    emoji: "🎨",
    tradition: "Hindu",
    note: "The festival of colours, in spring.",
    words: [
      { label: "colours", emoji: "🎨", colour: "things" },
      { label: "water", emoji: "💦", colour: "things" },
      { label: "bonfire", emoji: "🔥", colour: "things" },
      { label: "sweets", emoji: "🍬", colour: "things", says: "I want sweets" },
      { label: "friends", emoji: "👫", colour: "people" },
      { label: "family", emoji: "👨‍👩‍👧", colour: "people" },
      { label: "Happy Holi", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "passover",
    name: "Passover",
    emoji: "🍽️",
    tradition: "Jewish",
    note: "Pesach. The seder is the special meal.",
    words: [
      { label: "seder", emoji: "🍽️", colour: "things" },
      { label: "matzah", emoji: "🫓", colour: "things" },
      { label: "story", emoji: "📖", colour: "things" },
      { label: "singing", emoji: "🎶", colour: "doing" },
      { label: "family", emoji: "👨‍👩‍👧", colour: "people" },
      { label: "Happy Passover", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "newyear",
    name: "Chinese New Year",
    emoji: "🧧",
    tradition: "Chinese",
    note: "Also called Lunar New Year or Spring Festival.",
    words: [
      { label: "lantern", emoji: "🏮", colour: "things" },
      { label: "dragon", emoji: "🐉", colour: "things" },
      { label: "red envelope", emoji: "🧧", colour: "things" },
      { label: "fireworks", emoji: "🎆", colour: "things" },
      { label: "dumplings", emoji: "🥟", colour: "things", says: "I want dumplings" },
      { label: "family", emoji: "👨‍👩‍👧", colour: "people" },
      { label: "Happy New Year", emoji: "🎉", colour: "social" }
    ]
  },
  {
    id: "birthday",
    name: "Birthday",
    emoji: "🎂",
    tradition: "Other celebrations",
    words: [
      { label: "cake", emoji: "🎂", colour: "things" },
      { label: "candle", emoji: "🕯️", colour: "things" },
      { label: "present", emoji: "🎁", colour: "things" },
      { label: "balloon", emoji: "🎈", colour: "things" },
      { label: "party", emoji: "🥳", colour: "things" },
      { label: "card", emoji: "✉️", colour: "things" },
      { label: "singing", emoji: "🎶", colour: "doing" },
      { label: "Happy Birthday", emoji: "🎉", colour: "social" }
    ]
  }
];
const MAX_SEASON_WORDS = 12;
const MAX_CUSTOM_SEASONS = 12;
const DEFAULT_SEASONS_CONFIG = { hidden: [], words: {}, custom: [] };
const isText = (value, max) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
const isSeasonWord = (value) => {
  if (typeof value !== "object" || value === null) return false;
  const w2 = value;
  return typeof w2["label"] === "string" && w2["label"].length <= 40 && typeof w2["emoji"] === "string" && w2["emoji"].length <= 16 && typeof w2["colour"] === "string" && w2["colour"] in FITZGERALD_COLORS && (w2["says"] === void 0 || typeof w2["says"] === "string" && w2["says"].length <= 80);
};
const isSeasonsConfig = (value) => {
  if (typeof value !== "object" || value === null) return false;
  const v2 = value;
  const words = v2["words"];
  const custom = v2["custom"];
  return Array.isArray(v2["hidden"]) && v2["hidden"].length <= 60 && v2["hidden"].every((id) => typeof id === "string") && typeof words === "object" && words !== null && !Array.isArray(words) && Object.values(words).every((list) => Array.isArray(list) && list.length <= MAX_SEASON_WORDS && list.every(isSeasonWord)) && Array.isArray(custom) && custom.length <= MAX_CUSTOM_SEASONS && custom.every((c2) => {
    if (typeof c2 !== "object" || c2 === null) return false;
    const item = c2;
    return isText(item["id"], 60) && typeof item["name"] === "string" && item["name"].length <= 40 && typeof item["emoji"] === "string" && item["emoji"].length <= 16 && isText(item["tradition"], 40);
  });
};
function effectiveSeasons(config) {
  const own = (season) => ({ ...season, words: config.words[season.id] ?? season.words });
  const added = config.custom.map((entry) => ({
    id: entry.id,
    name: entry.name.trim() || "Untitled",
    emoji: entry.emoji || "🎉",
    tradition: entry.tradition,
    words: config.words[entry.id] ?? []
  }));
  return [...SEASONS.map(own), ...added];
}
const isSeasonShown = (config, id) => !config.hidden.includes(id);
const MAX_PLAYLISTS = 12;
const isPlaylistList = (value) => Array.isArray(value) && value.length <= MAX_PLAYLISTS && value.every((p2) => {
  if (typeof p2 !== "object" || p2 === null) return false;
  const list = p2;
  return typeof list["id"] === "string" && typeof list["name"] === "string" && typeof list["emoji"] === "string" && Array.isArray(list["songIds"]) && list["songIds"].every((id) => typeof id === "string");
});
function songsInPlaylist(playlist, songs) {
  return playlist.songIds.map((id) => songs.find((song) => song.id === id)).filter((song) => Boolean(song));
}
const MAX_SONG_BYTES = 30 * 1024 * 1024;
const MAX_SONGS = 60;
const BIG_LIBRARY_BYTES = 150 * 1024 * 1024;
const AUDIO_EXTENSIONS = /\.(mp3|m4a|aac|wav|ogg|oga|opus|flac|webm)$/i;
function isAudioFile(file) {
  return file.type.startsWith("audio/") || AUDIO_EXTENSIONS.test(file.name);
}
function titleFromFile(name) {
  return name.replace(AUDIO_EXTENSIONS, "").replace(/^\s*\d{1,3}\s*[-._)]\s*/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
}
function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
const isSongList = (value) => Array.isArray(value) && value.length <= MAX_SONGS && value.every((s2) => {
  if (typeof s2 !== "object" || s2 === null) return false;
  const song = s2;
  return typeof song["id"] === "string" && typeof song["title"] === "string" && typeof song["emoji"] === "string" && typeof song["blobId"] === "string" && typeof song["bytes"] === "number";
});
const BASIC_JOKES = [
  { q: "What do cows drink?", a: "Moo-lk!" },
  { q: "What do you call a sleeping bull?", a: "A bulldozer!" },
  { q: "What is a cat’s favourite colour?", a: "Purr-ple!" },
  { q: "What do you call a fish with no eyes?", a: "A fsh!" },
  { q: "Why did the banana go to the doctor?", a: "It was not peeling well!" },
  { q: "What do ducks like to eat?", a: "Quackers!" },
  { q: "What goes “tick tock woof”?", a: "A watchdog!" },
  { q: "Why did the teddy bear say no to pudding?", a: "She was stuffed!" },
  { q: "What do you call a dog on the beach?", a: "A hot dog!" },
  { q: "What is a frog’s favourite drink?", a: "Croak-a-cola!" },
  { q: "What do you call a sheep with no legs?", a: "A cloud!" },
  { q: "Why was the cat on the computer?", a: "To catch the mouse!" },
  { q: "What is yellow and goes “bang”?", a: "A firework banana!" },
  { q: "What do you call a bear with no teeth?", a: "A gummy bear!" },
  { q: "What is orange and sounds like a parrot?", a: "A carrot!" },
  { q: "Why did the cookie go to the doctor?", a: "It felt crumby!" },
  { q: "What do elves learn at school?", a: "The elf-abet!" },
  { q: "What has four legs and goes “quack”?", a: "A duck with a spare pair of legs!" },
  { q: "Where do cows go on a night out?", a: "To the moo-vies!" },
  { q: "What do you call a pig that does karate?", a: "A pork chop!" },
  { q: "Why did the sun not go to school?", a: "It already had a million degrees!" },
  { q: "What kind of key opens a banana?", a: "A mon-key!" },
  { q: "What do you get from a pampered cow?", a: "Spoiled milk!" },
  { q: "What did the big flower say to the little flower?", a: "Hi, bud!" },
  { q: "Why did the clock go to school?", a: "To learn to tell the time!" },
  { q: "What is a robot’s favourite snack?", a: "Computer chips!" },
  { q: "What do you call a snowman in summer?", a: "A puddle!" },
  { q: "What is brown and sticky?", a: "A stick!" },
  { q: "What did the sea say to the beach?", a: "Nothing, it just waved!" },
  { q: "Why do birds fly south?", a: "It is too far to walk!" }
];
const isJokeList = (value) => Array.isArray(value) && value.length <= 100 && value.every((j2) => typeof j2 === "object" && j2 !== null && typeof j2.q === "string" && typeof j2.a === "string");
function nextJokeIndex(total, told, random = Math.random) {
  if (total <= 1) return 0;
  const recent = new Set(told.slice(-Math.min(told.length, total - 1)));
  const fresh = Array.from({ length: total }, (_2, i2) => i2).filter((i2) => !recent.has(i2));
  return fresh[Math.floor(random() * fresh.length)];
}
function sillyMix(jokes, random = Math.random) {
  if (jokes.length < 2) return void 0;
  const a2 = Math.floor(random() * jokes.length);
  let b2 = Math.floor(random() * (jokes.length - 1));
  if (b2 >= a2) b2 += 1;
  return { q: jokes[a2].q, a: jokes[b2].a };
}
const EQUIPMENT = [
  { id: "hearingAids", label: "Hearing aids", hint: "Behind the ears." },
  { id: "cochlear", label: "Cochlear implant", hint: "One side, behind the ear." },
  { id: "eyePatch", label: "Eye patch", hint: "Over one eye." },
  { id: "helmet", label: "Helmet", hint: "A soft helmet." },
  { id: "oxygen", label: "Oxygen tube", hint: "A tube under the nose." },
  { id: "trach", label: "Neck tube (tracheostomy)", hint: "At the throat." },
  { id: "feedingTube", label: "Tummy tube (feeding tube)", hint: "On the tummy." },
  { id: "pump", label: "Insulin pump", hint: "Clipped at the waist." },
  { id: "sensor", label: "Glucose sensor", hint: "A round patch on the arm." },
  { id: "braces", label: "Leg braces", hint: "Supports on the lower legs." },
  { id: "crutches", label: "Crutches", hint: "When standing.", notWithChair: true },
  { id: "frame", label: "Walking frame", hint: "When standing.", notWithChair: true },
  { id: "prostheticArm", label: "Artificial arm", hint: "On one side." },
  { id: "prostheticLeg", label: "Artificial leg", hint: "On one side." }
];
const DEFAULT_BODY_LOOK = {
  figure: "neutral",
  skin: "#e0ac69",
  hair: "#4a2c17",
  hairStyle: "short",
  headwear: "none",
  headwearColour: "#7c3aed",
  outfit: "trousers",
  top: "#38bdf8",
  bottom: "#2563eb",
  wheelchair: false,
  glasses: false,
  extras: []
};
const FIGURE_STARTS = {
  boy: { label: "Boy", changes: { figure: "boy", hairStyle: "short", outfit: "shorts", top: "#2563eb", bottom: "#1a1a1a" } },
  girl: { label: "Girl", changes: { figure: "girl", hairStyle: "long", outfit: "dress", top: "#f472b6", bottom: "#f472b6" } },
  neutral: { label: "Non-binary", changes: { figure: "neutral", hairStyle: "short", outfit: "trousers", top: "#22a559", bottom: "#2563eb" } }
};
const SKIN_TONES = ["#fde7d3", "#ffdbb4", "#f1c27d", "#e0ac69", "#c68642", "#8d5524", "#6b4423", "#4a2f1b"];
const HAIR_COLOURS = ["#1a1a1a", "#4a2c17", "#8b5a2b", "#a0522d", "#e6c15a", "#c8571e", "#b0b0b0", "#f2f2f2", "#f472b6", "#38bdf8"];
const CLOTHES_COLOURS = ["#e11d48", "#f97316", "#facc15", "#22a559", "#38bdf8", "#2563eb", "#9333ea", "#f472b6", "#8a8a8a", "#1a1a1a"];
const HAIR_STYLES = [
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
  { id: "tied", label: "Tied up" },
  { id: "curly", label: "Curly" },
  { id: "none", label: "No hair" }
];
const HEADWEAR = [
  { id: "none", label: "None", hint: "" },
  { id: "hijab", label: "Hijab", hint: "A headscarf worn by many Muslim women and girls. It covers the hair and neck." },
  { id: "turban", label: "Turban", hint: "Worn by many Sikh men and boys, and by others. It covers the hair." },
  { id: "kippah", label: "Kippah", hint: "A small cap worn by many Jewish men and boys, also called a yarmulke. It sits on top of the hair." }
];
const coversHair = (headwear) => headwear === "hijab" || headwear === "turban";
const OUTFITS = [
  { id: "trousers", label: "Trousers" },
  { id: "shorts", label: "Shorts" },
  { id: "skirt", label: "Skirt" },
  { id: "dress", label: "Dress" }
];
const HEX = /^#[0-9a-f]{6}$/i;
const FIGURES = ["boy", "girl", "neutral"];
function withDefaults(look) {
  return { ...DEFAULT_BODY_LOOK, ...look, extras: look.extras ?? [] };
}
function isBodyLook(value) {
  if (typeof value !== "object" || value === null) return false;
  const v2 = value;
  const extras = v2["extras"];
  return ["skin", "hair", "top", "bottom"].every((key) => typeof v2[key] === "string" && HEX.test(v2[key])) && HAIR_STYLES.some((style) => style.id === v2["hairStyle"]) && OUTFITS.some((outfit) => outfit.id === v2["outfit"]) && (v2["headwear"] === void 0 || HEADWEAR.some((item) => item.id === v2["headwear"])) && (v2["headwearColour"] === void 0 || typeof v2["headwearColour"] === "string" && HEX.test(v2["headwearColour"])) && typeof v2["wheelchair"] === "boolean" && typeof v2["glasses"] === "boolean" && (v2["figure"] === void 0 || FIGURES.includes(v2["figure"])) && (extras === void 0 || Array.isArray(extras) && extras.every((id) => EQUIPMENT.some((e2) => e2.id === id)));
}
const hasExtra = (look, id) => look.extras.includes(id);
const DRAWING_COLOURS = [
  { name: "black", value: "#1a1a1a" },
  { name: "grey", value: "#8a8a8a" },
  { name: "red", value: "#e11d48" },
  { name: "orange", value: "#f97316" },
  { name: "yellow", value: "#facc15" },
  { name: "green", value: "#22a559" },
  { name: "light blue", value: "#38bdf8" },
  { name: "blue", value: "#2563eb" },
  { name: "purple", value: "#9333ea" },
  { name: "pink", value: "#f472b6" },
  { name: "brown", value: "#92400e" },
  { name: "white", value: "#ffffff" }
];
const BRUSH_SIZES = [
  { name: "thin", width: 6 },
  { name: "medium", width: 16 },
  { name: "thick", width: 36 }
];
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 576;
const UNDO_LIMIT = 15;
const MAX_KEPT_DRAWINGS = 12;
const isDrawingList = (value) => Array.isArray(value) && value.length <= MAX_KEPT_DRAWINGS && value.every((entry) => typeof entry === "string" && entry.startsWith("data:image/png;base64,"));
const WORD_STAGES = [1, 2, 3, 4];
const VALID_GRID_SIZES = [2, 3, 4, 5];
const QUICK_ACCESS_IDS = [
  "home",
  "help",
  "yes",
  "no",
  "favourites",
  "keyboard",
  "talk",
  "myday",
  "mypages",
  "feelings",
  "firstthen",
  "game",
  "draw",
  "body",
  "music",
  "traffic",
  // Spoken straight away, like Yes and No: handy in a classroom.
  "break",
  "question",
  "toilet",
  "finished",
  "again"
];
const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const QUICK_ACCESS_SLOTS = 6;
const DEFAULT_QUICK_ACCESS = ["home", "help", "yes", "no", "favourites", "keyboard"];
const QUICK_ACCESS_LABELS = {
  home: "Home",
  help: "Help",
  yes: "Yes",
  no: "No",
  favourites: "Favourites",
  keyboard: "Keyboard",
  talk: "Talk",
  myday: "My Day",
  mypages: "My Pages",
  feelings: "Feelings",
  firstthen: "First / Then",
  game: "Games",
  draw: "Draw",
  body: "My body",
  music: "Music",
  traffic: "Traffic light",
  break: "Break",
  question: "Question",
  toilet: "Toilet",
  finished: "Finished",
  again: "Say again"
};
const QUICK_ACCESS_SPEECH = {
  yes: "yes",
  no: "no",
  break: "I need a break",
  question: "I have a question",
  toilet: "I need the toilet",
  finished: "I've finished",
  again: "Can you say that again, please?"
};
const SCHOOL_QUICK_ACCESS = ["home", "help", "yes", "no", "break", "question"];
function isValidQuickAccess(value) {
  return Array.isArray(value) && value.length === QUICK_ACCESS_SLOTS && value.every((id) => QUICK_ACCESS_IDS.includes(id)) && new Set(value).size === value.length && value.includes("help");
}
function setQuickAccessSlot(current, slot, id) {
  const existingIndex = current.indexOf(id);
  if (existingIndex === slot) return { ok: true, buttons: current };
  const next = [...current];
  if (existingIndex !== -1) {
    next[existingIndex] = current[slot];
    next[slot] = id;
    return { ok: true, buttons: next };
  }
  if (current[slot] === "help") {
    return { ok: false, reason: "Help has to stay on the bar so it is always one press away." };
  }
  next[slot] = id;
  return { ok: true, buttons: next };
}
const WEEKDAY_LABELS = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday"
};
function weekdayOf(date) {
  const [year, month, day] = date.split("-").map(Number);
  const jsDay = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1).getDay();
  return WEEKDAYS[(jsDay + 6) % 7];
}
function routineForDate(routine, date) {
  return routine[weekdayOf(date)].map((activity) => {
    const copy = { ...activity };
    delete copy.finished;
    delete copy.changedFrom;
    return copy;
  });
}
function editRoutineActivity(routine, day, id, updates) {
  return { ...routine, [day]: routine[day].map((a2) => a2.id === id ? { ...a2, ...updates } : a2) };
}
function addRoutineActivity(routine, day, activity) {
  return { ...routine, [day]: [...routine[day], activity] };
}
function removeRoutineActivity(routine, day, id) {
  return { ...routine, [day]: routine[day].filter((a2) => a2.id !== id) };
}
function moveRoutineActivity(routine, day, id, direction) {
  const list = routine[day];
  const index = list.findIndex((a2) => a2.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= list.length) return routine;
  const next = [...list];
  [next[index], next[swapWith]] = [next[swapWith], next[index]];
  return { ...routine, [day]: next };
}
function copyToWeekdays(routine, from) {
  const next = { ...routine };
  for (const day of ["mon", "tue", "wed", "thu", "fri"]) {
    if (day !== from) next[day] = routine[from].map((activity) => ({ ...activity }));
  }
  return next;
}
const recentVersion = y(0);
const dayPlanVersion = y(0);
const activeProfileVersion = y(0);
const accessSettingsVersion = y(0);
const myPagesVersion = y(0);
const DB_VERSION = 6;
let dbPromise = null;
function openMyWordsDB() {
  if (!dbPromise) {
    dbPromise = openDB("my-words", DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore("boards", { keyPath: "id" });
          db.createObjectStore("meta");
        }
        if (oldVersion < 2) {
          db.createObjectStore("favourites", { keyPath: "id" });
          db.createObjectStore("recent", { keyPath: "id", autoIncrement: true });
        }
        if (oldVersion < 3) {
          db.createObjectStore("photos");
          db.createObjectStore("voiceClips");
          db.createObjectStore("people", { keyPath: "id" });
          db.createObjectStore("places", { keyPath: "id" });
        }
        if (oldVersion < 4) {
          db.createObjectStore("dayPlans", { keyPath: "date" });
        }
        if (oldVersion < 5) {
          db.createObjectStore("profiles", { keyPath: "id" });
        }
        if (oldVersion < 6) {
          db.createObjectStore("activity", { keyPath: "id", autoIncrement: true });
        }
      }
    });
  }
  return dbPromise;
}
const DEFAULT_FAVOURITE_IDS = ["i", "want", "like", "more", "help", "yes", "no"];
async function ensureSeeded() {
  const db = await openMyWordsDB();
  const alreadySeeded = await db.get("meta", "seeded");
  if (alreadySeeded) return;
  const boardsTx = db.transaction("boards", "readwrite");
  await Promise.all(STARTER_BOARDS.map((board2) => boardsTx.store.put(board2)));
  await boardsTx.done;
  const rootBoard2 = STARTER_BOARDS.find((board2) => board2.id === ROOT_BOARD_ID);
  const favouriteItems = DEFAULT_FAVOURITE_IDS.map(
    (id) => rootBoard2?.buttons.find((button) => button.id === id)
  ).filter((item) => Boolean(item));
  const favTx = db.transaction("favourites", "readwrite");
  await Promise.all(favouriteItems.map((item) => favTx.store.put(item)));
  await favTx.done;
  await db.put("meta", true, "seeded");
}
const DEFAULT_PROFILES = [
  { id: "home", name: "Home", rootBoardId: ROOT_BOARD_ID },
  { id: "school", name: "School", rootBoardId: SCHOOL_BOARD_ID },
  { id: "grandparents", name: "Grandparents", rootBoardId: PEOPLE_BOARD_ID },
  { id: "hospital", name: "Hospital", rootBoardId: FEELINGS_BOARD_ID }
];
const DEFAULT_PROFILE_ID = "home";
async function ensureProfilesSeeded() {
  const db = await openMyWordsDB();
  const count = await db.count("profiles");
  if (count > 0) return;
  const tx = db.transaction("profiles", "readwrite");
  await Promise.all(DEFAULT_PROFILES.map((profile) => tx.store.put(profile)));
  await tx.done;
}
async function getProfiles() {
  await ensureProfilesSeeded();
  const db = await openMyWordsDB();
  return db.getAll("profiles");
}
async function saveProfile(profile) {
  const db = await openMyWordsDB();
  await db.put("profiles", profile);
}
async function getActiveProfileId() {
  const db = await openMyWordsDB();
  return await db.get("meta", "activeProfileId") ?? DEFAULT_PROFILE_ID;
}
async function setActiveProfileId(id) {
  const db = await openMyWordsDB();
  await db.put("meta", id, "activeProfileId");
  activeProfileVersion.value += 1;
}
async function getActiveProfile() {
  await ensureProfilesSeeded();
  const [profiles, activeId] = await Promise.all([getProfiles(), getActiveProfileId()]);
  return profiles.find((profile) => profile.id === activeId) ?? profiles.find((profile) => profile.id === DEFAULT_PROFILE_ID) ?? {
    id: DEFAULT_PROFILE_ID,
    name: "Home",
    rootBoardId: ROOT_BOARD_ID
  };
}
async function getBoard(id) {
  await ensureSeeded();
  const db = await openMyWordsDB();
  return db.get("boards", id);
}
async function getRootBoard() {
  return getBoard(ROOT_BOARD_ID);
}
async function getAllBoards() {
  await ensureSeeded();
  const db = await openMyWordsDB();
  return db.getAll("boards");
}
async function updateBoard(board2) {
  const db = await openMyWordsDB();
  await db.put("boards", board2);
}
function emptyGridOrder(rows, columns) {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => null));
}
const NEW_BOARD_GRID_SIZE = 3;
async function createBoard(name, id = `board-${randomId()}`) {
  const db = await openMyWordsDB();
  const board2 = {
    id,
    name,
    grid: {
      rows: NEW_BOARD_GRID_SIZE,
      columns: NEW_BOARD_GRID_SIZE,
      order: emptyGridOrder(NEW_BOARD_GRID_SIZE, NEW_BOARD_GRID_SIZE)
    },
    buttons: []
  };
  await db.put("boards", board2);
  return board2;
}
async function getMyPages() {
  const db = await openMyWordsDB();
  return await db.get("meta", "myPages") ?? [];
}
async function saveMyPages(pages) {
  const db = await openMyWordsDB();
  await db.put("meta", pages, "myPages");
  myPagesVersion.value += 1;
}
async function createMyPage(name) {
  const id = randomId();
  const boardId = `mypage-${id}`;
  await createBoard(name, boardId);
  const page = { id, name, boardId };
  await saveMyPages([...await getMyPages(), page]);
  return page;
}
async function renameMyPage(id, name) {
  const pages = await getMyPages();
  const page = pages.find((candidate) => candidate.id === id);
  if (!page) return;
  await saveMyPages(pages.map((candidate) => candidate.id === id ? { ...candidate, name } : candidate));
  const board2 = await getBoard(page.boardId);
  if (board2) await updateBoard({ ...board2, name });
}
async function deleteMyPage(id) {
  const db = await openMyWordsDB();
  const pages = await getMyPages();
  const page = pages.find((candidate) => candidate.id === id);
  if (!page) return;
  await db.delete("boards", page.boardId);
  await saveMyPages(pages.filter((candidate) => candidate.id !== id));
}
async function getFavourites() {
  await ensureSeeded();
  const db = await openMyWordsDB();
  return db.getAll("favourites");
}
async function removeFavourite(id) {
  const db = await openMyWordsDB();
  await db.delete("favourites", id);
  favouritesVersion.value += 1;
}
async function saveFavourite(item) {
  const db = await openMyWordsDB();
  await db.put("favourites", item);
  favouritesVersion.value += 1;
}
const favouritesVersion = y(0);
const RECENT_MAX_ENTRIES = 50;
const RECENT_RETENTION_MS = 7 * 24 * 60 * 60 * 1e3;
async function isRecentEnabled() {
  const db = await openMyWordsDB();
  return await db.get("meta", "recentEnabled") === true;
}
async function setRecentEnabled(enabled) {
  const db = await openMyWordsDB();
  await db.put("meta", enabled, "recentEnabled");
}
async function pruneRecent(db) {
  const all = await db.getAll("recent");
  const cutoff = Date.now() - RECENT_RETENTION_MS;
  const expired = all.filter((entry) => entry.timestamp < cutoff);
  const fresh = all.filter((entry) => entry.timestamp >= cutoff);
  const overflowCount = fresh.length - RECENT_MAX_ENTRIES;
  const oldestOverflow = overflowCount > 0 ? [...fresh].sort((a2, b2) => a2.timestamp - b2.timestamp).slice(0, overflowCount) : [];
  const toDelete = [...expired, ...oldestOverflow];
  if (toDelete.length === 0) return;
  const tx = db.transaction("recent", "readwrite");
  await Promise.all(toDelete.map((entry) => tx.store.delete(entry.id)));
  await tx.done;
}
async function recordUtteranceIfEnabled(text) {
  void recordActivity("speech", text);
  if (!await isRecentEnabled()) return;
  const db = await openMyWordsDB();
  await db.add("recent", { text, timestamp: Date.now() });
  await pruneRecent(db);
  recentVersion.value += 1;
}
async function getRecentEntries() {
  const db = await openMyWordsDB();
  const all = await db.getAll("recent");
  return all.sort((a2, b2) => b2.timestamp - a2.timestamp || (b2.id ?? 0) - (a2.id ?? 0));
}
async function clearRecent() {
  const db = await openMyWordsDB();
  await db.clear("recent");
  recentVersion.value += 1;
}
async function getWordFrequencies() {
  const db = await openMyWordsDB();
  const stored = await db.get("meta", "wordFrequency");
  return stored ?? {};
}
async function incrementWordFrequency(word2) {
  const db = await openMyWordsDB();
  const key = word2.toLowerCase();
  const current = await db.get("meta", "wordFrequency") ?? {};
  current[key] = (current[key] ?? 0) + 1;
  await db.put("meta", current, "wordFrequency");
}
const EMPTY_PHRASE_BANK = {
  name: "",
  address: "",
  usualOrder: "",
  registerAnswer: ""
};
async function getPhraseBank() {
  const db = await openMyWordsDB();
  const stored = await db.get("meta", "phraseBank");
  return { ...EMPTY_PHRASE_BANK, ...stored ?? {} };
}
async function setPhraseBankSlot(slot, value) {
  const db = await openMyWordsDB();
  const current = await getPhraseBank();
  await db.put("meta", { ...current, [slot]: value }, "phraseBank");
}
async function getParentPinState() {
  const db = await openMyWordsDB();
  const stored = await db.get("meta", "parentPin");
  return stored ?? null;
}
async function setParentPinState(secrets) {
  const db = await openMyWordsDB();
  const state = {
    pinHash: await hashSecret(secrets.pin),
    recoveryHash: await hashSecret(secrets.recoveryCode.trim().toLowerCase())
  };
  await db.put("meta", state, "parentPin");
}
async function hasParentPin() {
  return await getParentPinState() !== null;
}
async function verifyParentPin(candidate) {
  const state = await getParentPinState();
  if (!state) return false;
  if (state.pinHash && isHashedSecret(state.pinHash)) return verifySecret(candidate, state.pinHash);
  if (typeof state.pin === "string" && candidate === state.pin) {
    const db = await openMyWordsDB();
    const { recoveryCode, ...rest } = state;
    delete rest.pin;
    const upgraded = { ...rest, pinHash: await hashSecret(candidate) };
    if (typeof recoveryCode === "string" && !rest.recoveryHash) upgraded.recoveryHash = await hashSecret(recoveryCode.trim().toLowerCase());
    await db.put("meta", upgraded, "parentPin");
    return true;
  }
  return false;
}
async function hasSchoolPin() {
  const db = await openMyWordsDB();
  return await db.get("meta", "schoolPin") !== void 0;
}
async function setSchoolPin(pin) {
  const db = await openMyWordsDB();
  await db.put("meta", { pinHash: await hashSecret(pin) }, "schoolPin");
}
async function verifySchoolPin(candidate) {
  const db = await openMyWordsDB();
  const state = await db.get("meta", "schoolPin");
  return Boolean(state && isHashedSecret(state.pinHash) && await verifySecret(candidate, state.pinHash));
}
async function clearSchoolPin() {
  const db = await openMyWordsDB();
  await db.delete("meta", "schoolPin");
}
async function verifyRecoveryCode(candidate) {
  const state = await getParentPinState();
  if (!state) return false;
  const cleaned = candidate.trim().toLowerCase();
  if (state.recoveryHash && isHashedSecret(state.recoveryHash)) return verifySecret(cleaned, state.recoveryHash);
  return typeof state.recoveryCode === "string" && cleaned === state.recoveryCode.trim().toLowerCase();
}
function randomId() {
  return crypto.randomUUID();
}
async function savePhoto(blob) {
  const db = await openMyWordsDB();
  const id = randomId();
  await db.put("photos", blob, id);
  return id;
}
async function getPhoto(blobId) {
  const db = await openMyWordsDB();
  return db.get("photos", blobId);
}
async function saveVoiceClip(blob) {
  const db = await openMyWordsDB();
  const id = randomId();
  await db.put("voiceClips", blob, id);
  return id;
}
async function deleteVoiceClip(blobId) {
  const db = await openMyWordsDB();
  await db.delete("voiceClips", blobId);
}
async function getVoiceClip(blobId) {
  const db = await openMyWordsDB();
  return db.get("voiceClips", blobId);
}
async function getPeople() {
  const db = await openMyWordsDB();
  return db.getAll("people");
}
async function savePerson(person2) {
  const db = await openMyWordsDB();
  await db.put("people", person2);
}
async function deletePerson(id) {
  const db = await openMyWordsDB();
  await db.delete("people", id);
}
async function deletePlace(id) {
  const db = await openMyWordsDB();
  await db.delete("places", id);
}
async function getPlaces() {
  const db = await openMyWordsDB();
  return db.getAll("places");
}
async function savePlace(place2) {
  const db = await openMyWordsDB();
  await db.put("places", place2);
}
async function getEffectiveDayPlan(date) {
  const db = await openMyWordsDB();
  const saved = await db.get("dayPlans", date);
  if (saved) return { plan: saved, fromRoutine: false };
  const routine = await weeklyRoutineSetting.get();
  return { plan: { date, activities: routineForDate(routine, date) }, fromRoutine: true };
}
async function saveDayPlan(plan) {
  const db = await openMyWordsDB();
  await db.put("dayPlans", plan);
  dayPlanVersion.value += 1;
}
const DEFAULT_DAY_SETTINGS = { view: "today", countdownEnabled: false };
async function getDaySettings() {
  const db = await openMyWordsDB();
  const stored = await db.get("meta", "daySettings");
  return { ...DEFAULT_DAY_SETTINGS, ...stored ?? {} };
}
async function setDaySettings(settings) {
  const db = await openMyWordsDB();
  await db.put("meta", settings, "daySettings");
}
async function hasCompletedFirstRun() {
  const db = await openMyWordsDB();
  return await db.get("meta", "firstRunCompleted") === true;
}
async function setFirstRunCompleted() {
  const db = await openMyWordsDB();
  await db.put("meta", true, "firstRunCompleted");
}
const preferredVoiceURI = y(void 0);
async function getPreferredVoiceURI() {
  const db = await openMyWordsDB();
  return await db.get("meta", "preferredVoiceURI");
}
async function setPreferredVoiceURI(uri) {
  const db = await openMyWordsDB();
  if (uri) {
    await db.put("meta", uri, "preferredVoiceURI");
  } else {
    await db.delete("meta", "preferredVoiceURI");
  }
  preferredVoiceURI.value = uri;
}
const DEFAULT_SPEECH_RATE = 1;
const preferredSpeechRate = y(DEFAULT_SPEECH_RATE);
async function getPreferredSpeechRate() {
  const db = await openMyWordsDB();
  return await db.get("meta", "preferredSpeechRate") ?? DEFAULT_SPEECH_RATE;
}
async function setPreferredSpeechRate(rate) {
  const db = await openMyWordsDB();
  await db.put("meta", rate, "preferredSpeechRate");
  preferredSpeechRate.value = rate;
}
const DEFAULT_SPEECH_PITCH = 1;
const preferredSpeechPitch = y(DEFAULT_SPEECH_PITCH);
async function getPreferredSpeechPitch() {
  const db = await openMyWordsDB();
  return await db.get("meta", "preferredSpeechPitch") ?? DEFAULT_SPEECH_PITCH;
}
async function setPreferredSpeechPitch(pitch) {
  const db = await openMyWordsDB();
  await db.put("meta", pitch, "preferredSpeechPitch");
  preferredSpeechPitch.value = pitch;
}
const DEFAULT_PRESS_MODE = "sentence";
const pressMode = y(DEFAULT_PRESS_MODE);
async function getPressMode() {
  const db = await openMyWordsDB();
  const stored = await db.get("meta", "pressMode");
  return stored === "speak" || stored === "both" || stored === "sentence" ? stored : DEFAULT_PRESS_MODE;
}
async function setPressMode(mode) {
  const db = await openMyWordsDB();
  await db.put("meta", mode, "pressMode");
  pressMode.value = mode;
}
const quickAccessButtons = y(DEFAULT_QUICK_ACCESS);
async function getQuickAccess() {
  const db = await openMyWordsDB();
  const stored = await db.get("meta", "quickAccess");
  return isValidQuickAccess(stored) ? stored : [...DEFAULT_QUICK_ACCESS];
}
async function setQuickAccess(buttons) {
  const db = await openMyWordsDB();
  await db.put("meta", buttons, "quickAccess");
  quickAccessButtons.value = buttons;
}
function storedSetting(key, fallback, isValid, portable = true) {
  const state = y(fallback);
  const setting = {
    key,
    signal: state,
    fallback,
    portable,
    async get() {
      const db = await openMyWordsDB();
      const stored = await db.get("meta", key);
      return isValid(stored) ? stored : fallback;
    },
    async set(value) {
      state.value = value;
      const db = await openMyWordsDB();
      await db.put("meta", value, key);
    },
    async restore(value) {
      if (!isValid(value)) return false;
      await setting.set(value);
      return true;
    },
    async load() {
      state.value = await setting.get();
    },
    reset() {
      state.value = fallback;
    }
  };
  return setting;
}
const isBoolean = (value) => typeof value === "boolean";
const isStageChoice = (value) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 4;
const isMinutes = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 240;
const isStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === "string");
const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isNullableNumber = (value) => value === null || typeof value === "number" && Number.isFinite(value);
const EMPTY_ABOUT_ME = {
  preferredName: "",
  howIcommunicate: "",
  whatHelps: "",
  whatIFindHard: "",
  likes: "",
  dislikes: ""
};
const isAboutMe = (value) => isPlainObject(value) && Object.keys(EMPTY_ABOUT_ME).every((field) => typeof value[field] === "string");
const EMPTY_ROUTINE = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
const isRoutine = (value) => isPlainObject(value) && Object.keys(EMPTY_ROUTINE).every((day) => Array.isArray(value[day]));
const wordStageSetting = storedSetting("wordStage", 0, isStageChoice);
const clearAfterSpeakSetting = storedSetting("clearAfterSpeak", false, isBoolean);
const schoolModeSetting = storedSetting("schoolMode", false, isBoolean);
const parentModeTimeoutSetting = storedSetting("parentModeTimeoutMin", 0, isMinutes);
const followDeviceAccessibilitySetting = storedSetting("followDeviceAccessibility", true, isBoolean);
const pressBuzzSetting = storedSetting("pressBuzz", false, isBoolean);
const isAppleLinkSetting = (value) => typeof value === "object" && value !== null && typeof value.enabled === "boolean" && typeof value.code === "string" && /^\d{0,4}$/.test(value.code);
const appleLinkSetting = storedSetting("appleLink", { enabled: false, code: "" }, isAppleLinkSetting, false);
const customPhrasesSetting = storedSetting("customPhrases", [], isStringArray);
const aboutMeSetting = storedSetting("aboutMe", EMPTY_ABOUT_ME, isAboutMe);
const weeklyRoutineSetting = storedSetting("weeklyRoutine", EMPTY_ROUTINE, isRoutine);
const usageEnabledSetting = storedSetting("usageEnabled", false, isBoolean);
const usageCountsSetting = storedSetting(
  "usageCounts",
  {},
  (value) => isPlainObject(value)
);
const speechVolumeSetting = storedSetting(
  "speechVolume",
  1,
  (value) => typeof value === "number" && value >= 0.1 && value <= 1
);
const pronunciationsSetting = storedSetting(
  "pronunciations",
  [],
  (value) => Array.isArray(value) && value.every((entry) => isPlainObject(entry) && typeof entry["written"] === "string" && typeof entry["spoken"] === "string")
);
const keyboardLayoutSetting = storedSetting(
  "keyboardLayout",
  "qwerty",
  (value) => value === "qwerty" || value === "alphabetical"
);
const EMPTY_USER_PROFILE = { name: "", deviceName: "", emoji: "", age: "", showOnScreen: true };
const isUserProfile = (value) => isPlainObject(value) && typeof value["name"] === "string" && typeof value["deviceName"] === "string" && typeof value["emoji"] === "string" && typeof value["age"] === "string" && typeof value["showOnScreen"] === "boolean";
const userProfileSetting = storedSetting("userProfile", EMPTY_USER_PROFILE, isUserProfile);
const myBodySetting = storedSetting("myBody", DEFAULT_BODY_LOOK, isBodyLook);
const customJokesSetting = storedSetting("customJokes", [], isJokeList);
const songsSetting = storedSetting("songs", [], isSongList);
const seasonsSetting = storedSetting("seasons", DEFAULT_SEASONS_CONFIG, isSeasonsConfig);
const treeDesignSetting = storedSetting("treeDesign", {}, isTreeDesign);
const playlistsSetting = storedSetting("playlists", [], isPlaylistList);
const isVolume = (value) => typeof value === "number" && value >= 0.1 && value <= 1;
const musicVolumeSetting = storedSetting("musicVolume", 0.8, isVolume);
const lostModeSetting = storedSetting("lostMode", EMPTY_LOST_MODE, isLostMode);
const trafficSetting = storedSetting("traffic", DEFAULT_TRAFFIC, isTrafficSetting);
const activityEnabledSetting = storedSetting("activityEnabled", false, isBoolean, false);
const activityRetentionSetting = storedSetting("activityRetentionDays", DEFAULT_RETENTION_DAYS, isRetention, false);
const activityVersion = y(0);
async function recordActivity(kind, label, now = Date.now()) {
  if (!activityEnabledSetting.signal.value) return;
  const trimmed = label.trim().slice(0, MAX_LABEL);
  if (!trimmed) return;
  try {
    const db = await openMyWordsDB();
    await db.add("activity", { at: now, kind, label: trimmed });
    activityVersion.value += 1;
    const cutoff = now - activityRetentionSetting.signal.value * 24 * 60 * 60 * 1e3;
    const tx = db.transaction("activity", "readwrite");
    let cursor = await tx.store.openCursor();
    while (cursor) {
      if (cursor.value.at < cutoff) await cursor.delete();
      cursor = await cursor.continue();
    }
    const left = await tx.store.getAllKeys();
    for (const key of left.slice(0, Math.max(0, left.length - MAX_ENTRIES))) await tx.store.delete(key);
    await tx.done;
  } catch {
  }
}
async function getActivity() {
  const db = await openMyWordsDB();
  const cutoff = Date.now() - activityRetentionSetting.signal.value * 24 * 60 * 60 * 1e3;
  return (await db.getAll("activity")).filter((entry) => entry.at >= cutoff);
}
async function clearActivity() {
  const db = await openMyWordsDB();
  await db.clear("activity");
  activityVersion.value += 1;
}
const schoolInfoSetting = storedSetting("schoolInfo", EMPTY_SCHOOL_INFO, isSchoolInfo);
const targetsSetting = storedSetting("targets", [], isTargetList);
const staffNotesSetting = storedSetting("staffNotes", [], isNoteList);
const noteAuthorSetting = storedSetting("noteAuthor", "", (value) => typeof value === "string", false);
const symbolStyleSetting = storedSetting("symbolStyle", "emoji", (value) => value === "emoji" || value === "drawn");
const labelStyleSetting = storedSetting("labelStyle", "both", (value) => value === "both" || value === "pictures" || value === "words");
const schoolTimeoutSetting = storedSetting("schoolTimeoutMin", 10, isMinutes);
const isSpeakStyle = (value) => value === "normal" || value === "clear" || value === "wordByWord";
const speakStyleSetting = storedSetting("speakStyle", "normal", isSpeakStyle);
const themeSetting = storedSetting("theme", DEFAULT_THEME, isTheme);
const drawingsSetting = storedSetting("drawings", [], isDrawingList);
const sentencePicturesSetting = storedSetting("sentencePictures", false, isBoolean);
const EMPTY_FIRST_THEN = {
  first: { label: "", emoji: "" },
  then: { label: "", emoji: "" },
  firstDone: false
};
const isFirstThenCard = (value) => isPlainObject(value) && typeof value["label"] === "string" && typeof value["emoji"] === "string";
const firstThenSetting = storedSetting(
  "firstThen",
  EMPTY_FIRST_THEN,
  (value) => isPlainObject(value) && isFirstThenCard(value["first"]) && isFirstThenCard(value["then"]) && typeof value["firstDone"] === "boolean"
);
const lastBackupSetting = storedSetting("lastBackupAt", null, isNullableNumber, false);
const SETTINGS = [
  wordStageSetting,
  clearAfterSpeakSetting,
  schoolModeSetting,
  schoolTimeoutSetting,
  parentModeTimeoutSetting,
  followDeviceAccessibilitySetting,
  pressBuzzSetting,
  appleLinkSetting,
  customPhrasesSetting,
  aboutMeSetting,
  weeklyRoutineSetting,
  usageEnabledSetting,
  usageCountsSetting,
  lastBackupSetting,
  speechVolumeSetting,
  pronunciationsSetting,
  keyboardLayoutSetting,
  sentencePicturesSetting,
  speakStyleSetting,
  symbolStyleSetting,
  labelStyleSetting,
  themeSetting,
  drawingsSetting,
  myBodySetting,
  customJokesSetting,
  songsSetting,
  playlistsSetting,
  treeDesignSetting,
  seasonsSetting,
  musicVolumeSetting,
  lostModeSetting,
  trafficSetting,
  schoolInfoSetting,
  targetsSetting,
  staffNotesSetting,
  noteAuthorSetting,
  activityEnabledSetting,
  activityRetentionSetting,
  userProfileSetting,
  firstThenSetting
];
async function hasContentWorthBackingUp() {
  const db = await openMyWordsDB();
  const counts = await Promise.all([
    db.count("photos"),
    db.count("voiceClips"),
    db.count("people"),
    db.count("places"),
    db.count("dayPlans")
  ]);
  return counts.some((count) => count > 0) || (await getMyPages()).length > 0;
}
async function loadStoredSettings() {
  await Promise.all(SETTINGS.map((setting) => setting.load()));
}
const DEFAULT_MEDICAL_INFO = {
  childName: "",
  allergies: "",
  conditions: "",
  contacts: [],
  medicines: "",
  equipment: "",
  eating: "",
  moving: "",
  hearingSight: "",
  communication: "",
  pain: "",
  emergencyPlan: "",
  doctor: "",
  hospital: "",
  nhsNumber: ""
};
async function getMedicalInfo() {
  const db = await openMyWordsDB();
  const stored = await db.get("meta", "medicalInfo");
  return { ...DEFAULT_MEDICAL_INFO, ...stored ?? {} };
}
async function setMedicalInfo(info) {
  const db = await openMyWordsDB();
  await db.put("meta", info, "medicalInfo");
}
async function getSessionState() {
  const db = await openMyWordsDB();
  return await db.get("meta", "sessionState") ?? null;
}
async function setSessionState(state) {
  const db = await openMyWordsDB();
  if (state) {
    await db.put("meta", state, "sessionState");
  } else {
    await db.delete("meta", "sessionState");
  }
}
const DEFAULT_ACCESS_SETTINGS = {
  dwellMs: 0,
  repeatSuppressMs: 0,
  scanningMode: "off",
  scanIntervalMs: 1500,
  highContrast: "off",
  textScale: 1,
  reduceMotion: false,
  lowArousalPalette: false
};
async function getAccessSettings() {
  const db = await openMyWordsDB();
  const stored = await db.get("meta", "accessSettings");
  return { ...DEFAULT_ACCESS_SETTINGS, ...stored ?? {} };
}
async function setAccessSettings(settings) {
  const db = await openMyWordsDB();
  await db.put("meta", settings, "accessSettings");
  accessSettingsVersion.value += 1;
}
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result.split(",", 2)[1] ?? "");
    reader.readAsDataURL(blob);
  });
}
async function base64ToBlob(base64, mime) {
  const response = await fetch(`data:${mime};base64,${base64}`);
  return response.blob();
}
async function exportBackupPayload() {
  const db = await openMyWordsDB();
  const [boards, favourites, recent, people, places, dayPlans, profiles] = await Promise.all([
    db.getAll("boards"),
    db.getAll("favourites"),
    db.getAll("recent"),
    db.getAll("people"),
    db.getAll("places"),
    db.getAll("dayPlans"),
    getProfiles()
  ]);
  const photos = {};
  for (const key of await db.getAllKeys("photos")) {
    const blob = await db.get("photos", key);
    if (blob) photos[key] = { mime: blob.type, base64: await blobToBase64(blob) };
  }
  const voiceClips = {};
  for (const key of await db.getAllKeys("voiceClips")) {
    const blob = await db.get("voiceClips", key);
    if (blob) voiceClips[key] = { mime: blob.type, base64: await blobToBase64(blob) };
  }
  const [
    recentEnabled,
    wordFrequency,
    phraseBank,
    parentPin,
    daySettings,
    activeProfileId,
    accessSettings,
    medicalInfo,
    myPages,
    schoolPin
  ] = await Promise.all([
    isRecentEnabled(),
    getWordFrequencies(),
    getPhraseBank(),
    getParentPinState(),
    getDaySettings(),
    getActiveProfileId(),
    getAccessSettings(),
    getMedicalInfo(),
    getMyPages(),
    (async () => await (await openMyWordsDB()).get("meta", "schoolPin") ?? null)()
  ]);
  const [quickAccess, pressModeValue, speechRate, speechPitch, voiceURI] = await Promise.all([
    getQuickAccess(),
    getPressMode(),
    getPreferredSpeechRate(),
    getPreferredSpeechPitch(),
    getPreferredVoiceURI()
  ]);
  const settings = {};
  for (const setting of SETTINGS) {
    if (setting.portable) settings[setting.key] = await setting.get();
  }
  return {
    formatVersion: 1,
    boards,
    favourites,
    recent,
    people,
    places,
    dayPlans,
    profiles,
    photos,
    voiceClips,
    meta: {
      recentEnabled,
      wordFrequency,
      phraseBank,
      parentPin,
      schoolPin,
      daySettings,
      activeProfileId,
      accessSettings,
      medicalInfo,
      myPages,
      quickAccess,
      pressMode: pressModeValue,
      speechRate,
      speechPitch,
      voiceURI: voiceURI ?? null,
      settings
    }
  };
}
async function importBackupPayload(payload) {
  const db = await openMyWordsDB();
  const stores = ["boards", "favourites", "recent", "people", "places", "dayPlans", "profiles", "photos", "voiceClips"];
  for (const store of stores) {
    await db.clear(store);
  }
  async function putAll(store, rows) {
    const tx = db.transaction(store, "readwrite");
    await Promise.all(rows.map((row) => tx.store.put(row)));
    await tx.done;
  }
  await putAll("boards", payload.boards);
  await putAll("favourites", payload.favourites);
  await putAll("recent", payload.recent);
  await putAll("people", payload.people);
  await putAll("places", payload.places);
  await putAll("dayPlans", payload.dayPlans);
  await putAll("profiles", payload.profiles);
  for (const [id, { mime, base64 }] of Object.entries(payload.photos)) {
    await db.put("photos", await base64ToBlob(base64, mime), id);
  }
  for (const [id, { mime, base64 }] of Object.entries(payload.voiceClips)) {
    await db.put("voiceClips", await base64ToBlob(base64, mime), id);
  }
  await db.put("meta", payload.meta.recentEnabled, "recentEnabled");
  await db.put("meta", payload.meta.wordFrequency, "wordFrequency");
  await db.put("meta", payload.meta.phraseBank, "phraseBank");
  if (payload.meta.parentPin) {
    await db.put("meta", payload.meta.parentPin, "parentPin");
  } else {
    await db.delete("meta", "parentPin");
  }
  if (payload.meta.schoolPin) {
    await db.put("meta", payload.meta.schoolPin, "schoolPin");
  } else {
    await db.delete("meta", "schoolPin");
  }
  await db.put("meta", payload.meta.daySettings, "daySettings");
  await db.put("meta", payload.meta.activeProfileId, "activeProfileId");
  await db.put("meta", payload.meta.accessSettings, "accessSettings");
  await db.put("meta", payload.meta.medicalInfo, "medicalInfo");
  await db.put("meta", payload.meta.myPages, "myPages");
  await db.put("meta", true, "seeded");
  if (isValidQuickAccess(payload.meta.quickAccess)) await setQuickAccess(payload.meta.quickAccess);
  if (payload.meta.pressMode) await setPressMode(payload.meta.pressMode);
  if (payload.meta.speechRate !== void 0) await setPreferredSpeechRate(payload.meta.speechRate);
  if (payload.meta.speechPitch !== void 0) await setPreferredSpeechPitch(payload.meta.speechPitch);
  if (payload.meta.voiceURI !== void 0) await setPreferredVoiceURI(payload.meta.voiceURI ?? void 0);
  for (const setting of SETTINGS) {
    const stored = payload.meta.settings?.[setting.key];
    if (setting.portable && stored !== void 0) await setting.restore(stored);
  }
  recentVersion.value += 1;
  dayPlanVersion.value += 1;
  activeProfileVersion.value += 1;
  accessSettingsVersion.value += 1;
  myPagesVersion.value += 1;
}
function escapeForRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function applyPronunciations(text, entries) {
  const usable = entries.filter((entry) => entry.written.trim() !== "" && entry.spoken.trim() !== "");
  if (usable.length === 0) return text;
  const spokenFor = new Map(usable.map((entry) => [entry.written.trim().toLowerCase(), entry.spoken.trim()]));
  const alternatives = [...spokenFor.keys()].sort((a2, b2) => b2.length - a2.length).map(escapeForRegExp).join("|");
  const wholeWord = new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives})(?![\\p{L}\\p{N}])`, "giu");
  return text.replace(wholeWord, (match) => spokenFor.get(match.toLowerCase()) ?? match);
}
function baseSpeakOptions() {
  return {
    rate: preferredSpeechRate.value,
    pitch: preferredSpeechPitch.value,
    volume: speechVolumeSetting.signal.value,
    ...preferredVoiceURI.value ? { voiceURI: preferredVoiceURI.value } : {}
  };
}
function playBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = speechVolumeSetting.signal.value;
    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(url);
      resolve();
    });
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("voice clip playback failed"));
    });
    void audio.play();
  });
}
async function announceItem(item, options) {
  const text = item.vocalization ?? item.label;
  if (item.voiceClipBlobId) {
    const blob = await getVoiceClip(item.voiceClipBlobId);
    if (blob) {
      await playBlob(blob);
      void recordUtteranceIfEnabled(text);
      return;
    }
  }
  speak(applyPronunciations(text, pronunciationsSetting.signal.value), { ...baseSpeakOptions(), ...options });
  void recordUtteranceIfEnabled(text);
}
function announceText(text, options) {
  speak(applyPronunciations(text, pronunciationsSetting.signal.value), baseSpeakOptions());
  if (options?.keepInHistory !== false) void recordUtteranceIfEnabled(text);
}
function announceSentence(words, onWord = () => {
}) {
  const parts = words.map((word2) => word2.trim()).filter(Boolean);
  if (parts.length === 0) return;
  const style = speakStyleSetting.signal.value;
  const pronunciations = pronunciationsSetting.signal.value;
  if (style === "wordByWord") {
    speakWordByWord(parts.map((part) => applyPronunciations(part, pronunciations)), baseSpeakOptions(), onWord);
    void recordUtteranceIfEnabled(parts.join(" "));
    return;
  }
  const base = baseSpeakOptions();
  if (style === "clear") {
    speak(applyPronunciations(parts.join(", "), pronunciations), { ...base, rate: (base.rate ?? 1) * 0.9 });
  } else {
    speak(applyPronunciations(parts.join(" "), pronunciations), base);
  }
  void recordUtteranceIfEnabled(parts.join(" "));
}
function pad2(n2) {
  return n2.toString().padStart(2, "0");
}
function getDateString(now) {
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}
function formatTime(time) {
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const period = hours >= 12 ? "pm" : "am";
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelveHour}:${pad2(minutes)}${period}`;
}
function classifyNowNextLater(activities) {
  const unfinished = activities.filter((activity) => !activity.finished);
  return {
    now: unfinished[0] ?? null,
    next: unfinished[1] ?? null,
    later: unfinished.slice(2)
  };
}
function markFinished(activities, activityId) {
  return activities.map(
    (activity) => activity.id === activityId ? { ...activity, finished: true } : activity
  );
}
const USAGE_RETENTION_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1e3;
function normalise(word2) {
  return word2.trim().toLowerCase();
}
function dropExpired(counts, now) {
  const cutoff = getDateString(new Date(now.getTime() - USAGE_RETENTION_DAYS * DAY_MS));
  return Object.fromEntries(Object.entries(counts).filter(([date]) => date >= cutoff));
}
async function recordPress(word2, now = /* @__PURE__ */ new Date()) {
  if (!usageEnabledSetting.signal.value) return;
  const key = normalise(word2);
  if (!key) return;
  const date = getDateString(now);
  const counts = dropExpired(usageCountsSetting.signal.value, now);
  const today2 = counts[date] ?? {};
  const next = { ...counts, [date]: { ...today2, [key]: (today2[key] ?? 0) + 1 } };
  usageCountsSetting.signal.value = next;
  await usageCountsSetting.set(next);
}
async function clearUsage() {
  await usageCountsSetting.set({});
}
function summariseUsage(counts, days, now = /* @__PURE__ */ new Date()) {
  const cutoff = getDateString(new Date(now.getTime() - (days - 1) * DAY_MS));
  const totals2 = /* @__PURE__ */ new Map();
  for (const [date, words] of Object.entries(counts)) {
    if (date < cutoff) continue;
    for (const [word2, count] of Object.entries(words)) totals2.set(word2, (totals2.get(word2) ?? 0) + count);
  }
  const rows = [...totals2.entries()].map(([word2, count]) => ({ word: word2, count })).sort((a2, b2) => b2.count - a2.count || a2.word.localeCompare(b2.word));
  return {
    totalPresses: rows.reduce((sum, row) => sum + row.count, 0),
    distinctWords: rows.length,
    rows
  };
}
function wordsNotUsed(availableWords, summary) {
  const used = new Set(summary.rows.map((row) => row.word));
  return [...new Set(availableWords.map(normalise))].filter((word2) => word2 && !used.has(word2)).sort();
}
function csvCell(value) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
function usageToCsv(counts) {
  const lines2 = ["date,word,count"];
  for (const date of Object.keys(counts).sort()) {
    for (const [word2, count] of Object.entries(counts[date]).sort(([a2], [b2]) => a2.localeCompare(b2))) {
      lines2.push(`${date},${csvCell(word2)},${count}`);
    }
  }
  return lines2.join("\n") + "\n";
}
const BREATH_CYCLE = [
  { phase: "in", label: "Breathe in", spoken: "Breathe in", durationMs: 4e3 },
  { phase: "hold", label: "Hold", spoken: "Hold", durationMs: 4e3 },
  { phase: "out", label: "Breathe out", spoken: "Breathe out", durationMs: 6e3 }
];
function nextBreathStepIndex(current) {
  return (current + 1) % BREATH_CYCLE.length;
}
const QUIET_TIME_DURATIONS_MIN = [1, 2, 5];
function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
function CalmTab() {
  const breathingActive = useSignal(false);
  const breathStepIndex = useSignal(0);
  const breathTimerRef = A(null);
  function stopBreathing() {
    breathingActive.value = false;
    if (breathTimerRef.current !== null) {
      clearTimeout(breathTimerRef.current);
      breathTimerRef.current = null;
    }
  }
  function runBreathStep(index) {
    breathStepIndex.value = index;
    const step = BREATH_CYCLE[index];
    announceText(step.spoken);
    breathTimerRef.current = window.setTimeout(() => runBreathStep(nextBreathStepIndex(index)), step.durationMs);
  }
  function startBreathing() {
    breathingActive.value = true;
    runBreathStep(0);
  }
  h$2(() => stopBreathing, []);
  const quietSecondsLeft = useSignal(null);
  const quietTimerRef = A(null);
  function stopQuietTime() {
    quietSecondsLeft.value = null;
    if (quietTimerRef.current !== null) {
      clearInterval(quietTimerRef.current);
      quietTimerRef.current = null;
    }
  }
  function startQuietTime(minutes) {
    stopQuietTime();
    quietSecondsLeft.value = minutes * 60;
    quietTimerRef.current = window.setInterval(() => {
      if (quietSecondsLeft.value === null) return;
      const remaining = quietSecondsLeft.value - 1;
      if (remaining <= 0) {
        stopQuietTime();
        announceText("The timer's finished. Take your time.");
      } else {
        quietSecondsLeft.value = remaining;
      }
    }, 1e3);
  }
  h$2(() => stopQuietTime, []);
  return /* @__PURE__ */ u$1("div", { class: "calm-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "calm-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "calm-tab__heading", children: "Breathing" }),
      /* @__PURE__ */ u$1("p", { class: "calm-tab__phase", role: "status", "aria-live": "polite", children: breathingActive.value ? BREATH_CYCLE[breathStepIndex.value].label : "Ready when you are" }),
      breathingActive.value ? /* @__PURE__ */ u$1("button", { type: "button", class: "calm-tab__button", onClick: stopBreathing, children: "Stop" }) : /* @__PURE__ */ u$1("button", { type: "button", class: "calm-tab__button", onClick: startBreathing, children: "Start" })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "calm-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "calm-tab__heading", children: "Quiet time" }),
      quietSecondsLeft.value !== null ? /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1("p", { class: "calm-tab__countdown", role: "status", "aria-live": "polite", children: formatCountdown(quietSecondsLeft.value) }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "calm-tab__button", onClick: stopQuietTime, children: "Stop" })
      ] }) : /* @__PURE__ */ u$1("div", { class: "calm-tab__durations", children: QUIET_TIME_DURATIONS_MIN.map((minutes) => /* @__PURE__ */ u$1("button", { type: "button", class: "calm-tab__button", onClick: () => startQuietTime(minutes), children: [
        minutes,
        " min"
      ] }, minutes)) })
    ] })
  ] });
}
const PART_LABELS = {
  pants: "Under my pants"
};
const FRONT_GROUPS = [
  { id: "head", label: "Head", parts: ["head"] },
  { id: "eyes", label: "Eyes", parts: ["eyes"] },
  { id: "ears", label: "Ears", parts: ["ears"] },
  { id: "nose", label: "Nose", parts: ["nose"] },
  { id: "mouth", label: "Mouth", parts: ["mouth"] },
  { id: "throat", label: "Throat", parts: ["throat"] },
  { id: "chest", label: "Chest", parts: ["chest"] },
  { id: "tummy", label: "Tummy", parts: ["tummy"] },
  { id: "arms", label: "Arms", parts: ["armL", "armR"] },
  { id: "hands", label: "Hands", parts: ["handL", "handR"] },
  { id: "pants", label: "Under my pants", parts: ["pants"] },
  { id: "legs", label: "Legs", parts: ["legL", "legR"] },
  { id: "knees", label: "Knees", parts: ["kneeL", "kneeR"] },
  { id: "feet", label: "Feet", parts: ["footL", "footR"] }
];
const BACK_GROUPS = [
  { id: "head", label: "Head", parts: ["head"] },
  { id: "ears", label: "Ears", parts: ["ears"] },
  { id: "neck", label: "Neck", parts: ["neck"] },
  { id: "back", label: "Back", parts: ["back"] },
  { id: "lowerBack", label: "Lower back", parts: ["lowerBack"] },
  { id: "arms", label: "Arms", parts: ["armL", "armR"] },
  { id: "hands", label: "Hands", parts: ["handL", "handR"] },
  { id: "pants", label: "Under my pants", parts: ["pants"] },
  { id: "legs", label: "Legs", parts: ["legL", "legR"] },
  { id: "knees", label: "Knees", parts: ["kneeL", "kneeR"] },
  { id: "feet", label: "Feet", parts: ["footL", "footR"] }
];
const EXTRA_GROUPS = [
  { extra: "hearingAids", group: { id: "hearing", label: "Hearing aids", parts: ["hearing"] } },
  { extra: "cochlear", group: { id: "cochlear", label: "Implant", parts: ["cochlear"] } },
  { extra: "oxygen", group: { id: "oxygen", label: "Oxygen tube", parts: ["oxygen"] }, front: true },
  { extra: "trach", group: { id: "trach", label: "Neck tube", parts: ["trach"] }, front: true },
  { extra: "feedingTube", group: { id: "feedtube", label: "Tummy tube", parts: ["feedtube"] }, front: true },
  { extra: "pump", group: { id: "pump", label: "Pump", parts: ["pump"] } },
  { extra: "sensor", group: { id: "sensor", label: "Sensor", parts: ["sensor"] } },
  { extra: "braces", group: { id: "braces", label: "Leg braces", parts: ["braces"] } }
];
const groupsFor = (view, look) => {
  const base = view === "front" ? FRONT_GROUPS : BACK_GROUPS;
  if (!look) return base;
  const extra = EXTRA_GROUPS.filter((e2) => look.extras.includes(e2.extra) && (view === "front" || !e2.front)).map((e2) => e2.group);
  return [...base, ...extra];
};
function geometry(wheelchair) {
  const legEnd = wheelchair ? 342 : 384;
  const kneeY = wheelchair ? 272 : 252 + (legEnd - 252) * 0.45;
  return { legEnd, kneeY, hipTop: 204, hipBottom: 252 };
}
function regionsFor(view, look) {
  const wheelchair = typeof look === "boolean" ? look : look.wheelchair;
  const extras = typeof look === "boolean" ? [] : look.extras;
  const { legEnd, kneeY, hipTop, hipBottom } = geometry(wheelchair);
  const e2 = (cx, cy, rx, ry) => ({ k: "e", cx, cy, rx, ry });
  const r2 = (x2, y2, w2, h2, radius = 8) => ({ k: "r", x: x2, y: y2, w: w2, h: h2, r: radius });
  const arms = (id) => ({ id, shapes: [id === "armL" ? r2(36, 98, 24, 88, 10) : r2(140, 98, 24, 88, 10)] });
  const hands = (id) => ({ id, shapes: [id === "handL" ? e2(48, 197, 12, 12) : e2(152, 197, 12, 12)] });
  const lowerBody = [
    { id: "legL", shapes: [r2(70, hipBottom, 28, legEnd - hipBottom - 6, 10)] },
    { id: "legR", shapes: [r2(102, hipBottom, 28, legEnd - hipBottom - 6, 10)] },
    { id: "kneeL", shapes: [e2(84, kneeY, 15, 12)] },
    { id: "kneeR", shapes: [e2(116, kneeY, 15, 12)] },
    { id: "footL", shapes: [e2(82, legEnd, 17, 10)] },
    { id: "footR", shapes: [e2(118, legEnd, 17, 10)] }
  ];
  const equipment = [];
  const has = (id) => extras.includes(id);
  if (has("hearingAids")) equipment.push({ id: "hearing", shapes: [e2(64, 58, 6, 11), e2(136, 58, 6, 11)] });
  if (has("cochlear")) equipment.push({ id: "cochlear", shapes: [e2(136, 58, 7, 12)] });
  if (has("braces")) equipment.push({ id: "braces", shapes: [r2(70, kneeY + 14, 28, legEnd - kneeY - 30, 6), r2(102, kneeY + 14, 28, legEnd - kneeY - 30, 6)] });
  if (has("sensor")) equipment.push({ id: "sensor", shapes: [e2(152, 126, 9, 9)] });
  if (has("pump")) equipment.push({ id: "pump", shapes: [r2(118, 208, 18, 24, 4)] });
  if (view === "front") {
    if (has("oxygen")) equipment.push({ id: "oxygen", shapes: [e2(100, 60, 14, 8)] });
    if (has("trach")) equipment.push({ id: "trach", shapes: [e2(100, 88, 8, 7)] });
    if (has("feedingTube")) equipment.push({ id: "feedtube", shapes: [e2(100, 178, 9, 9)] });
    return [
      { id: "head", shapes: [e2(100, 50, 30, 30)] },
      { id: "ears", shapes: [e2(70, 52, 8, 9), e2(130, 52, 8, 9)] },
      { id: "throat", shapes: [r2(88, 78, 24, 18, 4)] },
      { id: "chest", shapes: [r2(66, 96, 68, 54, 8)] },
      { id: "tummy", shapes: [r2(66, 150, 68, 54, 8)] },
      arms("armL"),
      arms("armR"),
      hands("handL"),
      hands("handR"),
      { id: "pants", shapes: [r2(64, hipTop, 72, hipBottom - hipTop, 10)] },
      ...lowerBody,
      { id: "eyes", shapes: [e2(88, 46, 8, 7), e2(112, 46, 8, 7)] },
      { id: "nose", shapes: [e2(100, 57, 6, 6)] },
      { id: "mouth", shapes: [e2(100, 68, 12, 6)] },
      ...equipment
    ];
  }
  return [
    { id: "head", shapes: [e2(100, 50, 30, 30)] },
    { id: "ears", shapes: [e2(70, 52, 8, 9), e2(130, 52, 8, 9)] },
    { id: "neck", shapes: [r2(88, 78, 24, 18, 4)] },
    { id: "back", shapes: [r2(66, 96, 68, 54, 8)] },
    { id: "lowerBack", shapes: [r2(66, 150, 68, 54, 8)] },
    arms("armL"),
    arms("armR"),
    hands("handL"),
    hands("handR"),
    { id: "pants", shapes: [r2(64, hipTop, 72, hipBottom - hipTop, 10)] },
    ...lowerBody,
    ...equipment
  ];
}
const FEELINGS = [
  { id: "hurts", label: "Hurts", icon: "😣", one: "hurts", many: "hurt" },
  { id: "sore", label: "Sore", icon: "🤕", one: "is sore", many: "are sore" },
  { id: "itchy", label: "Itchy", icon: "😖", one: "is itchy", many: "are itchy" },
  { id: "funny", label: "Feels funny", icon: "😕", one: "feels funny", many: "feel funny" },
  { id: "hot", label: "Hot", icon: "🥵", one: "feels hot", many: "feel hot" },
  { id: "cold", label: "Cold", icon: "🥶", one: "feels cold", many: "feel cold" },
  { id: "tight", label: "Too tight", icon: "😬", one: "is too tight", many: "are too tight" },
  { id: "notworking", label: "Not working", icon: "⚠️", one: "is not working", many: "are not working" }
];
const AMOUNTS = ["a little", "medium", "a lot"];
const AMOUNT_WORDS = { "a little": "a little", medium: "quite a lot", "a lot": "a lot" };
const NOUNS = {
  head: { one: "head" },
  eyes: { one: "eyes", plural: true },
  ears: { one: "ears", plural: true },
  nose: { one: "nose" },
  mouth: { one: "mouth" },
  throat: { one: "throat" },
  chest: { one: "chest" },
  tummy: { one: "tummy" },
  neck: { one: "neck" },
  back: { one: "back" },
  lowerBack: { one: "lower back" },
  arm: { one: "arm", many: "arms" },
  hand: { one: "hand", many: "hands" },
  leg: { one: "leg", many: "legs" },
  knee: { one: "knee", many: "knees" },
  foot: { one: "foot", many: "feet" },
  hearing: { one: "hearing aids", plural: true },
  cochlear: { one: "implant" },
  oxygen: { one: "oxygen tube" },
  trach: { one: "neck tube" },
  feedtube: { one: "tummy tube" },
  pump: { one: "pump" },
  sensor: { one: "sensor" },
  braces: { one: "leg braces", plural: true }
};
const SIDED = ["arm", "hand", "leg", "knee", "foot"];
function nounFor(id) {
  for (const base of SIDED) if (id === `${base}L` || id === `${base}R`) return base;
  return id === "pants" ? void 0 : id;
}
function listOf(items) {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
function bodySentence(selected, feeling, amount) {
  const counts = /* @__PURE__ */ new Map();
  for (const id of selected) {
    const noun = nounFor(id);
    if (noun) counts.set(noun, (counts.get(noun) ?? 0) + 1);
  }
  const wordsFor = [...counts.entries()].map(([noun, count]) => {
    const entry = NOUNS[noun];
    return `my ${count > 1 && entry.many ? entry.many : entry.one}`;
  });
  const anyPlural = wordsFor.length > 1 || [...counts.entries()].some(([noun, count]) => (NOUNS[noun].plural ?? false) || count > 1);
  const how = feeling ? FEELINGS.find((f2) => f2.id === feeling) : void 0;
  const extent = amount ? ` ${AMOUNT_WORDS[amount]}` : "";
  const sentences = [];
  if (wordsFor.length > 0) {
    const subject = listOf(wordsFor);
    sentences.push(how ? `${capitalise(subject)} ${anyPlural ? how.many : how.one}${extent}.` : `${capitalise(subject)}.`);
  }
  if (selected.includes("pants")) {
    sentences.push(how ? `It ${how.one}${extent} under my pants.` : "Under my pants.");
  }
  return sentences.join(" ");
}
const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);
function ShapeEl({ shape }) {
  return shape.k === "e" ? /* @__PURE__ */ u$1("ellipse", { cx: shape.cx, cy: shape.cy, rx: shape.rx, ry: shape.ry }) : /* @__PURE__ */ u$1("rect", { x: shape.x, y: shape.y, width: shape.w, height: shape.h, rx: shape.r ?? 0 });
}
const OUTLINE = "#1a1a1a";
const METAL = "#9aa5b1";
const PLASTIC = "#e5e7eb";
function WheelchairBack({ frame }) {
  const wheel = (cx) => /* @__PURE__ */ u$1("g", { children: [
    /* @__PURE__ */ u$1("ellipse", { cx, cy: "306", rx: "11", ry: "64", fill: "#6b7280", stroke: OUTLINE, "stroke-width": "3" }),
    /* @__PURE__ */ u$1("ellipse", { cx, cy: "306", rx: "6", ry: "54", fill: "none", stroke: "#d1d5db", "stroke-width": "2.5" }),
    [-40, -20, 0, 20, 40].map((dy) => /* @__PURE__ */ u$1("line", { x1: cx - 5, y1: 306 + dy, x2: cx + 5, y2: 306 + dy * 0.9, stroke: "#d1d5db", "stroke-width": "1.5" }, dy)),
    /* @__PURE__ */ u$1("circle", { cx, cy: "306", r: "5", fill: OUTLINE })
  ] }, cx);
  return /* @__PURE__ */ u$1("g", { "stroke-linecap": "round", children: [
    wheel(14),
    wheel(186),
    /* @__PURE__ */ u$1("g", { stroke: frame, "stroke-width": "6", fill: "none", children: [
      /* @__PURE__ */ u$1("line", { x1: "54", y1: "256", x2: "54", y2: "118" }),
      /* @__PURE__ */ u$1("line", { x1: "146", y1: "256", x2: "146", y2: "118" }),
      /* @__PURE__ */ u$1("line", { x1: "54", y1: "118", x2: "36", y2: "112" }),
      /* @__PURE__ */ u$1("line", { x1: "146", y1: "118", x2: "164", y2: "112" }),
      /* @__PURE__ */ u$1("line", { x1: "14", y1: "268", x2: "54", y2: "268" }),
      /* @__PURE__ */ u$1("line", { x1: "186", y1: "268", x2: "146", y2: "268" })
    ] }),
    /* @__PURE__ */ u$1("rect", { x: "26", y: "106", width: "16", height: "9", rx: "4", fill: OUTLINE }),
    /* @__PURE__ */ u$1("rect", { x: "158", y: "106", width: "16", height: "9", rx: "4", fill: OUTLINE })
  ] });
}
function WheelchairFront({ frame }) {
  return /* @__PURE__ */ u$1("g", { "stroke-linecap": "round", children: [
    /* @__PURE__ */ u$1("rect", { x: "50", y: "252", width: "100", height: "12", rx: "6", fill: "#475569", stroke: OUTLINE, "stroke-width": "2" }),
    /* @__PURE__ */ u$1("rect", { x: "38", y: "188", width: "22", height: "9", rx: "4", fill: OUTLINE }),
    /* @__PURE__ */ u$1("rect", { x: "140", y: "188", width: "22", height: "9", rx: "4", fill: OUTLINE }),
    /* @__PURE__ */ u$1("line", { x1: "48", y1: "197", x2: "52", y2: "256", stroke: frame, "stroke-width": "5" }),
    /* @__PURE__ */ u$1("line", { x1: "152", y1: "197", x2: "148", y2: "256", stroke: frame, "stroke-width": "5" }),
    /* @__PURE__ */ u$1("g", { stroke: frame, "stroke-width": "6", fill: "none", children: [
      /* @__PURE__ */ u$1("path", { d: "M58 264 L58 340 L78 356" }),
      /* @__PURE__ */ u$1("path", { d: "M142 264 L142 340 L122 356" })
    ] }),
    /* @__PURE__ */ u$1("rect", { x: "62", y: "352", width: "38", height: "8", rx: "3", fill: "#9aa5b1", stroke: OUTLINE, "stroke-width": "1.5" }),
    /* @__PURE__ */ u$1("rect", { x: "100", y: "352", width: "38", height: "8", rx: "3", fill: "#9aa5b1", stroke: OUTLINE, "stroke-width": "1.5" }),
    /* @__PURE__ */ u$1("line", { x1: "58", y1: "340", x2: "52", y2: "384", stroke: frame, "stroke-width": "5" }),
    /* @__PURE__ */ u$1("line", { x1: "142", y1: "340", x2: "148", y2: "384", stroke: frame, "stroke-width": "5" }),
    /* @__PURE__ */ u$1("circle", { cx: "50", cy: "398", r: "13", fill: "#374151", stroke: OUTLINE, "stroke-width": "2" }),
    /* @__PURE__ */ u$1("circle", { cx: "150", cy: "398", r: "13", fill: "#374151", stroke: OUTLINE, "stroke-width": "2" }),
    /* @__PURE__ */ u$1("circle", { cx: "50", cy: "398", r: "4", fill: "#9aa5b1" }),
    /* @__PURE__ */ u$1("circle", { cx: "150", cy: "398", r: "4", fill: "#9aa5b1" })
  ] });
}
function Headwear({ kind, colour, back }) {
  const fold = { fill: "none", stroke: OUTLINE, "stroke-width": 1.5, "stroke-linecap": "round" };
  if (kind === "hijab") {
    return /* @__PURE__ */ u$1("g", { children: back ? /* @__PURE__ */ u$1("path", { d: "M64 52 C60 10 140 10 136 52 C140 76 142 94 134 104 Q100 118 66 104 C58 94 60 76 64 52 Z", fill: colour, stroke: OUTLINE, "stroke-width": "2" }) : /* @__PURE__ */ u$1(
      "path",
      {
        "fill-rule": "evenodd",
        d: "M64 52 C60 10 140 10 136 52 C140 76 142 94 134 104 Q100 118 66 104 C58 94 60 76 64 52 Z M100 26 C86 26 77 38 77 52 C77 68 87 79 100 79 C113 79 123 68 123 52 C123 38 114 26 100 26 Z",
        fill: colour,
        stroke: OUTLINE,
        "stroke-width": "2"
      }
    ) });
  }
  if (kind === "turban") {
    return /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("path", { d: "M67 46 C62 4 138 4 133 46 Q100 32 67 46 Z", fill: colour, stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("path", { d: "M70 36 Q100 14 132 34", ...fold }),
      /* @__PURE__ */ u$1("path", { d: "M68 42 Q100 20 133 40", ...fold }),
      back && /* @__PURE__ */ u$1("ellipse", { cx: "100", cy: "50", rx: "30", ry: "14", fill: colour, stroke: OUTLINE, "stroke-width": "2" })
    ] });
  }
  return /* @__PURE__ */ u$1("path", { d: "M79 22 A21 14 0 0 1 121 22 Q100 27 79 22 Z", fill: colour, stroke: OUTLINE, "stroke-width": "2" });
}
const shade = (colour, amount = 0.2) => mix(colour, "#000000", amount);
const HEAD_TRANSFORM = "translate(100 90) scale(1.2) translate(-100 -90)";
function HairBehind({ look }) {
  const stroke = { stroke: OUTLINE, "stroke-width": 2, "stroke-linejoin": "round" };
  if (coversHair(look.headwear)) return null;
  return /* @__PURE__ */ u$1("g", { children: [
    look.hairStyle === "long" && /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("path", { d: "M65 48 C57 76 59 104 68 126 Q100 138 132 126 C141 104 143 76 135 48 Z", fill: look.hair }),
      /* @__PURE__ */ u$1("path", { d: "M65 48 C57 76 59 104 68 126 Q100 138 132 126 C141 104 143 76 135 48", fill: "none", ...stroke })
    ] }),
    look.hairStyle === "curly" && [[70, 34], [84, 18], [100, 12], [116, 18], [130, 34], [65, 54], [135, 54]].map(([cx, cy]) => /* @__PURE__ */ u$1("circle", { cx, cy, r: "14", fill: look.hair, ...stroke }, `${cx}-${cy}`)),
    look.hairStyle === "tied" && /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("circle", { cx: "100", cy: "6", r: "12", fill: look.hair, ...stroke }),
      /* @__PURE__ */ u$1("rect", { x: "91", y: "13", width: "18", height: "5", rx: "2.5", fill: shade(look.hair, 0.45), stroke: OUTLINE, "stroke-width": "1.5" })
    ] })
  ] });
}
function HeadArt({ look, back, helmet }) {
  const skin = look.skin;
  const skinShade = shade(skin, 0.22);
  const covered = coversHair(look.headwear);
  const hairy = !covered && look.hairStyle !== "none";
  const stroke = { stroke: OUTLINE, "stroke-width": 2, "stroke-linejoin": "round" };
  const brow = look.hairStyle === "none" || covered ? shade(skin, 0.5) : shade(look.hair, 0.3);
  return /* @__PURE__ */ u$1("g", { children: [
    back && hairy && look.hairStyle === "long" && /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("path", { d: "M67 58 C60 84 62 110 70 130 Q100 142 130 130 C138 110 140 84 133 58 Q100 82 67 58 Z", fill: look.hair }),
      /* @__PURE__ */ u$1("path", { d: "M67 58 C60 84 62 110 70 130 Q100 142 130 130 C138 110 140 84 133 58", fill: "none", ...stroke })
    ] }),
    /* @__PURE__ */ u$1("ellipse", { cx: "70", cy: "53", rx: "6.5", ry: "9", fill: skin, ...stroke }),
    /* @__PURE__ */ u$1("ellipse", { cx: "130", cy: "53", rx: "6.5", ry: "9", fill: skin, ...stroke }),
    /* @__PURE__ */ u$1("path", { d: "M68 49 q3 4 0 8 M132 49 q-3 4 0 8", fill: "none", stroke: skinShade, "stroke-width": "1.5", "stroke-linecap": "round" }),
    /* @__PURE__ */ u$1("circle", { cx: "100", cy: "50", r: "30", fill: skin, ...stroke }),
    hairy && !back && look.hairStyle !== "curly" && /* @__PURE__ */ u$1("path", { d: "M69 42 C58 -2 142 -2 131 42 Q120 24 100 27 Q82 24 69 42 Z", fill: look.hair, ...stroke }),
    hairy && !back && look.hairStyle === "curly" && [[78, 27], [89, 22], [100, 20], [111, 22], [122, 27]].map(([cx, cy]) => /* @__PURE__ */ u$1("circle", { cx, cy, r: "8", fill: look.hair, ...stroke }, `${cx}-${cy}`)),
    hairy && back && /* @__PURE__ */ u$1("path", { d: "M69 46 C56 -2 144 -2 131 46 C134 66 122 80 100 81 C78 80 66 66 69 46 Z", fill: look.hair, ...stroke }),
    look.headwear !== "none" && /* @__PURE__ */ u$1(Headwear, { kind: look.headwear, colour: look.headwearColour, back }),
    helmet && /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("path", { d: "M68 52 Q68 12 100 12 Q132 12 132 52 Q100 40 68 52 Z", fill: "#60a5fa", stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("line", { x1: "68", y1: "52", x2: "64", y2: "64", stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("line", { x1: "132", y1: "52", x2: "136", y2: "64", stroke: OUTLINE, "stroke-width": "2" })
    ] }),
    !back && /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("circle", { cx: "79", cy: "62", r: "5.5", fill: "#f472b6", opacity: "0.28" }),
      /* @__PURE__ */ u$1("circle", { cx: "121", cy: "62", r: "5.5", fill: "#f472b6", opacity: "0.28" }),
      /* @__PURE__ */ u$1("path", { d: "M80.5 41.5 Q88 36.5 95.5 40", fill: "none", stroke: brow, "stroke-width": "2.6", "stroke-linecap": "round" }),
      /* @__PURE__ */ u$1("path", { d: "M104.5 40 Q112 36.5 119.5 41.5", fill: "none", stroke: brow, "stroke-width": "2.6", "stroke-linecap": "round" }),
      /* @__PURE__ */ u$1("ellipse", { cx: "88", cy: "49", rx: "3.7", ry: "4.6", fill: OUTLINE }),
      /* @__PURE__ */ u$1("ellipse", { cx: "112", cy: "49", rx: "3.7", ry: "4.6", fill: OUTLINE }),
      /* @__PURE__ */ u$1("circle", { cx: "89.3", cy: "47.4", r: "1.3", fill: "#ffffff" }),
      /* @__PURE__ */ u$1("circle", { cx: "113.3", cy: "47.4", r: "1.3", fill: "#ffffff" }),
      /* @__PURE__ */ u$1("path", { d: "M97.5 57.5 Q100 61 102.5 57.5", fill: "none", stroke: skinShade, "stroke-width": "2", "stroke-linecap": "round" }),
      /* @__PURE__ */ u$1("path", { d: "M90 67 Q100 76 110 67", fill: "none", stroke: OUTLINE, "stroke-width": "2.6", "stroke-linecap": "round" })
    ] })
  ] });
}
function HeadPreview({ look: given, size = 56 }) {
  const look = withDefaults(given);
  return /* @__PURE__ */ u$1("svg", { viewBox: "40 -14 120 118", width: size, height: size, "aria-hidden": "true", focusable: "false", class: "head-preview", children: [
    /* @__PURE__ */ u$1(HairBehind, { look }),
    /* @__PURE__ */ u$1(HeadArt, { look, back: false, helmet: false })
  ] });
}
const HEAD_PARTS = /* @__PURE__ */ new Set(["head", "eyes", "ears", "nose", "mouth", "hearing", "cochlear", "oxygen"]);
function BodyFigure({ look: given, view, selected = /* @__PURE__ */ new Set(), onToggle }) {
  const look = withDefaults(given);
  const { legEnd, hipTop, hipBottom, kneeY } = geometry(look.wheelchair);
  const back = view === "back";
  const skin = look.skin;
  const trousers = look.outfit === "trousers";
  const skirt = look.outfit === "skirt";
  const dress = look.outfit === "dress";
  const bottomOnLegs = trousers;
  const extra = (id) => hasExtra(look, id);
  const torso = look.figure === "girl" ? { x: 65, w: 70 } : look.figure === "boy" ? { x: 61, w: 78 } : { x: 63, w: 74 };
  const armLeft = torso.x - 25;
  const armRight = torso.x + torso.w + 1;
  const legBottom = look.wheelchair ? legEnd - 8 : legEnd - 6;
  const chairFrame = look.bottom === "#1a1a1a" ? "#374151" : look.bottom;
  const prostheticSide = (side) => side === "arm" ? armRight : 102;
  const topShade = shade(look.top, 0.2);
  const bottomShade = shade(look.bottom, 0.22);
  const socks = !trousers;
  return /* @__PURE__ */ u$1("svg", { class: "body-figure", viewBox: "0 -34 200 454", role: "img", "aria-label": `A figure, seen from the ${view}`, children: [
    look.wheelchair && /* @__PURE__ */ u$1(WheelchairBack, { frame: chairFrame }),
    !look.wheelchair && extra("crutches") && /* @__PURE__ */ u$1("g", { stroke: "#6b7280", "stroke-width": "5", "stroke-linecap": "round", fill: "none", children: [
      /* @__PURE__ */ u$1("path", { d: "M34 120 L16 388" }),
      /* @__PURE__ */ u$1("path", { d: "M166 120 L184 388" }),
      /* @__PURE__ */ u$1("path", { d: "M28 150 L52 150" }),
      /* @__PURE__ */ u$1("path", { d: "M148 150 L172 150" })
    ] }),
    !look.wheelchair && extra("frame") && /* @__PURE__ */ u$1("g", { stroke: "#6b7280", "stroke-width": "5", "stroke-linecap": "round", fill: "none", children: [
      /* @__PURE__ */ u$1("path", { d: "M30 210 L30 392" }),
      /* @__PURE__ */ u$1("path", { d: "M170 210 L170 392" }),
      /* @__PURE__ */ u$1("path", { d: "M30 210 L170 210" }),
      /* @__PURE__ */ u$1("path", { d: "M30 300 L170 300" })
    ] }),
    /* @__PURE__ */ u$1("g", { transform: HEAD_TRANSFORM, children: /* @__PURE__ */ u$1(HairBehind, { look }) }),
    [armLeft, armRight].map((x2, index) => {
      const isProsthetic = extra("prostheticArm") && x2 === prostheticSide("arm");
      return /* @__PURE__ */ u$1("g", { children: [
        /* @__PURE__ */ u$1("rect", { x: x2, y: "98", width: "24", height: "88", rx: "10", fill: isProsthetic ? METAL : skin, stroke: OUTLINE, "stroke-width": "2" }),
        /* @__PURE__ */ u$1("rect", { x: x2, y: "98", width: "24", height: "34", rx: "10", fill: look.top, stroke: OUTLINE, "stroke-width": "2" }),
        /* @__PURE__ */ u$1("rect", { x: x2 + 1, y: "124", width: "22", height: "7", fill: topShade }),
        /* @__PURE__ */ u$1("line", { x1: x2 + 1, y1: "124", x2: x2 + 23, y2: "124", stroke: OUTLINE, "stroke-width": "1.5" }),
        isProsthetic ? /* @__PURE__ */ u$1("g", { children: [
          /* @__PURE__ */ u$1("rect", { x: x2 + 4, y: "150", width: "16", height: "6", rx: "3", fill: PLASTIC, stroke: OUTLINE, "stroke-width": "1" }),
          /* @__PURE__ */ u$1("path", { d: `M${x2 + 4} 192 q8 18 16 0`, fill: METAL, stroke: OUTLINE, "stroke-width": "2" })
        ] }) : /* @__PURE__ */ u$1("g", { children: /* @__PURE__ */ u$1("ellipse", { cx: x2 + 12, cy: "197", rx: "12", ry: "12", fill: skin, stroke: OUTLINE, "stroke-width": "2" }) }),
        extra("sensor") && !back && index === 1 && /* @__PURE__ */ u$1("circle", { cx: x2 + 12, cy: "126", r: "7", fill: "#f8fafc", stroke: OUTLINE, "stroke-width": "2" }),
        extra("sensor") && !back && index === 1 && /* @__PURE__ */ u$1("circle", { cx: x2 + 12, cy: "126", r: "2.5", fill: "#22a559" })
      ] }, x2);
    }),
    [70, 102].map((x2) => {
      const isProsthetic = extra("prostheticLeg") && x2 === prostheticSide("leg");
      return /* @__PURE__ */ u$1("g", { children: [
        /* @__PURE__ */ u$1("rect", { x: x2, y: hipBottom - 4, width: "28", height: legBottom - hipBottom + 4, rx: "10", fill: isProsthetic ? METAL : bottomOnLegs ? look.bottom : skin, stroke: OUTLINE, "stroke-width": "2" }),
        !isProsthetic && trousers && /* @__PURE__ */ u$1("g", { children: [
          /* @__PURE__ */ u$1("line", { x1: x2 + 14, y1: hipBottom + 8, x2: x2 + 14, y2: legBottom - 14, stroke: bottomShade, "stroke-width": "1.5", "stroke-linecap": "round" }),
          /* @__PURE__ */ u$1("rect", { x: x2 + 1, y: legBottom - 11, width: "26", height: "9", rx: "3", fill: bottomShade })
        ] }),
        !isProsthetic && socks && /* @__PURE__ */ u$1("g", { children: [
          /* @__PURE__ */ u$1("rect", { x: x2 + 1, y: legBottom - 26, width: "26", height: "24", rx: "5", fill: "#f8fafc", stroke: OUTLINE, "stroke-width": "1.5" }),
          /* @__PURE__ */ u$1("rect", { x: x2 + 1.5, y: legBottom - 26, width: "25", height: "5", rx: "2", fill: bottomShade })
        ] }),
        isProsthetic && /* @__PURE__ */ u$1("g", { children: [
          /* @__PURE__ */ u$1("rect", { x: x2 + 8, y: kneeY - 6, width: "12", height: "10", rx: "4", fill: PLASTIC, stroke: OUTLINE, "stroke-width": "1.5" }),
          /* @__PURE__ */ u$1("rect", { x: x2 + 10, y: kneeY + 10, width: "8", height: legBottom - kneeY - 18, fill: "#6b7280" })
        ] }),
        extra("braces") && /* @__PURE__ */ u$1("g", { fill: "none", stroke: "#f8fafc", "stroke-width": "5", children: [
          /* @__PURE__ */ u$1("rect", { x: x2 - 1, y: kneeY + 14, width: "30", height: legBottom - kneeY - 28, rx: "6", stroke: OUTLINE, "stroke-width": "2", fill: "#cbd5e1", "fill-opacity": "0.55" }),
          /* @__PURE__ */ u$1("line", { x1: x2 + 2, y1: kneeY + 30, x2: x2 + 26, y2: kneeY + 30, stroke: OUTLINE, "stroke-width": "2" }),
          /* @__PURE__ */ u$1("line", { x1: x2 + 2, y1: kneeY + 50, x2: x2 + 26, y2: kneeY + 50, stroke: OUTLINE, "stroke-width": "2" })
        ] })
      ] }, x2);
    }),
    [82, 118].map((cx) => /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("ellipse", { cx, cy: legEnd, rx: "17", ry: "10", fill: "#4b5563", stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("path", { d: `M${cx - 15} ${legEnd + 3.5} Q${cx} ${legEnd + 11} ${cx + 15} ${legEnd + 3.5}`, fill: "none", stroke: "#f8fafc", "stroke-width": "3", "stroke-linecap": "round" }),
      /* @__PURE__ */ u$1("ellipse", { cx, cy: legEnd - 3, rx: "7", ry: "3.5", fill: "#ffffff", opacity: "0.22" }),
      /* @__PURE__ */ u$1("path", { d: `M${cx - 4} ${legEnd - 7} l8 0 M${cx - 4} ${legEnd - 3} l8 0`, stroke: "#d1d5db", "stroke-width": "1.5", "stroke-linecap": "round" })
    ] }, cx)),
    look.wheelchair && /* @__PURE__ */ u$1(WheelchairFront, { frame: chairFrame }),
    /* @__PURE__ */ u$1("rect", { x: torso.x, y: "94", width: torso.w, height: "116", rx: "16", fill: look.top, stroke: OUTLINE, "stroke-width": "2" }),
    /* @__PURE__ */ u$1("line", { x1: torso.x + 8, y1: "198", x2: torso.x + torso.w - 8, y2: "198", stroke: topShade, "stroke-width": "3", "stroke-linecap": "round" }),
    dress ? /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("path", { d: `M${torso.x} ${hipTop - 16} L${torso.x + torso.w} ${hipTop - 16} L${torso.x + torso.w + 16} ${hipBottom + 36} L${torso.x - 16} ${hipBottom + 36} Z`, fill: look.bottom, stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("path", { d: `M${torso.x - 14} ${hipBottom + 30} L${torso.x + torso.w + 14} ${hipBottom + 30}`, stroke: bottomShade, "stroke-width": "5" }),
      /* @__PURE__ */ u$1("path", { d: `M${100 - 22} ${hipTop - 4} L${100 - 28} ${hipBottom + 28} M100 ${hipTop - 4} L100 ${hipBottom + 28} M${100 + 22} ${hipTop - 4} L${100 + 28} ${hipBottom + 28}`, stroke: bottomShade, "stroke-width": "1.5", "stroke-linecap": "round" })
    ] }) : skirt ? /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("path", { d: `M62 ${hipTop} L138 ${hipTop} L152 ${hipBottom + 24} L48 ${hipBottom + 24} Z`, fill: look.bottom, stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("path", { d: `M49 ${hipBottom + 18} L151 ${hipBottom + 18}`, stroke: bottomShade, "stroke-width": "5" }),
      /* @__PURE__ */ u$1("path", { d: `M${100 - 20} ${hipTop + 6} L${100 - 26} ${hipBottom + 16} M100 ${hipTop + 6} L100 ${hipBottom + 16} M${100 + 20} ${hipTop + 6} L${100 + 26} ${hipBottom + 16}`, stroke: bottomShade, "stroke-width": "1.5", "stroke-linecap": "round" })
    ] }) : /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("rect", { x: "64", y: hipTop, width: "72", height: hipBottom - hipTop + (trousers ? 8 : 4), rx: "10", fill: look.bottom, stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("rect", { x: "65", y: hipTop + 1, width: "70", height: "8", rx: "4", fill: bottomShade }),
      !back && /* @__PURE__ */ u$1("circle", { cx: "100", cy: hipTop + 5, r: "2", fill: "#f8fafc" }),
      !trousers && /* @__PURE__ */ u$1("rect", { x: "65", y: hipBottom - 6, width: "70", height: "8", rx: "4", fill: bottomShade })
    ] }),
    extra("pump") && /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("rect", { x: "118", y: "208", width: "18", height: "24", rx: "4", fill: "#f8fafc", stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("rect", { x: "122", y: "213", width: "10", height: "7", rx: "1", fill: "#22a559" }),
      /* @__PURE__ */ u$1("path", { d: "M118 220 C104 222 104 190 100 180", fill: "none", stroke: "#6b7280", "stroke-width": "1.5" })
    ] }),
    extra("feedingTube") && !back && /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("circle", { cx: "100", cy: "178", r: "7", fill: "#f8fafc", stroke: OUTLINE, "stroke-width": "2" }),
      /* @__PURE__ */ u$1("path", { d: "M100 185 C100 205 118 205 118 224", fill: "none", stroke: "#9ca3af", "stroke-width": "3" })
    ] }),
    /* @__PURE__ */ u$1("rect", { x: "89", y: "76", width: "22", height: "22", fill: skin, stroke: OUTLINE, "stroke-width": "2" }),
    /* @__PURE__ */ u$1("rect", { x: "91", y: "76", width: "18", height: "20", fill: skin }),
    !back ? /* @__PURE__ */ u$1("path", { d: "M86 94 Q100 112 114 94", fill: skin, stroke: OUTLINE, "stroke-width": "2", "stroke-linejoin": "round" }) : /* @__PURE__ */ u$1("path", { d: "M86 94 Q100 102 114 94", fill: "none", stroke: topShade, "stroke-width": "4", "stroke-linecap": "round" }),
    extra("trach") && !back && /* @__PURE__ */ u$1("g", { children: [
      /* @__PURE__ */ u$1("rect", { x: "93", y: "84", width: "14", height: "9", rx: "3", fill: "#f8fafc", stroke: OUTLINE, "stroke-width": "1.5" }),
      /* @__PURE__ */ u$1("circle", { cx: "100", cy: "88.5", r: "2", fill: OUTLINE })
    ] }),
    /* @__PURE__ */ u$1("g", { transform: HEAD_TRANSFORM, children: [
      /* @__PURE__ */ u$1(HeadArt, { look, back, helmet: extra("helmet") }),
      !back && /* @__PURE__ */ u$1(S$1, { children: [
        extra("eyePatch") && /* @__PURE__ */ u$1("g", { children: [
          /* @__PURE__ */ u$1("ellipse", { cx: "112", cy: "49", rx: "9", ry: "8", fill: "#1f2937" }),
          /* @__PURE__ */ u$1("line", { x1: "104", y1: "42", x2: "132", y2: "34", stroke: OUTLINE, "stroke-width": "2" })
        ] }),
        look.glasses && /* @__PURE__ */ u$1("g", { fill: "rgba(255,255,255,0.18)", stroke: OUTLINE, "stroke-width": "2.5", children: [
          /* @__PURE__ */ u$1("circle", { cx: "88", cy: "49", r: "10.5" }),
          /* @__PURE__ */ u$1("circle", { cx: "112", cy: "49", r: "10.5" }),
          /* @__PURE__ */ u$1("line", { x1: "98.5", y1: "48", x2: "101.5", y2: "48", fill: "none" }),
          /* @__PURE__ */ u$1("line", { x1: "77.5", y1: "47", x2: "71", y2: "45", fill: "none" }),
          /* @__PURE__ */ u$1("line", { x1: "122.5", y1: "47", x2: "129", y2: "45", fill: "none" })
        ] }),
        extra("oxygen") && /* @__PURE__ */ u$1("g", { fill: "none", stroke: "#38bdf8", "stroke-width": "2.5", "stroke-linecap": "round", children: [
          /* @__PURE__ */ u$1("path", { d: "M94 62 L94 58 M106 62 L106 58" }),
          /* @__PURE__ */ u$1("path", { d: "M94 62 C80 68 72 60 66 58" }),
          /* @__PURE__ */ u$1("path", { d: "M106 62 C120 68 128 60 134 58" }),
          /* @__PURE__ */ u$1("path", { d: "M70 60 C60 90 70 120 80 150" })
        ] })
      ] }),
      back && look.glasses && /* @__PURE__ */ u$1("line", { x1: "70", y1: "49", x2: "130", y2: "49", stroke: OUTLINE, "stroke-width": "2.5" }),
      extra("hearingAids") && /* @__PURE__ */ u$1("g", { fill: "#e8c9a0", stroke: OUTLINE, "stroke-width": "1.5", children: [
        /* @__PURE__ */ u$1("path", { d: "M66 48 q-10 8 -2 22 q6 -6 4 -22" }),
        /* @__PURE__ */ u$1("path", { d: "M134 48 q10 8 2 22 q-6 -6 -4 -22" })
      ] }),
      extra("cochlear") && /* @__PURE__ */ u$1("g", { stroke: OUTLINE, "stroke-width": "1.5", children: [
        /* @__PURE__ */ u$1("path", { d: "M134 46 q10 8 2 22 q-6 -6 -4 -22", fill: "#d1d5db" }),
        /* @__PURE__ */ u$1("circle", { cx: "142", cy: "44", r: "5", fill: "#9ca3af" }),
        /* @__PURE__ */ u$1("path", { d: "M138 44 L132 40", fill: "none" })
      ] })
    ] }),
    /* @__PURE__ */ u$1("g", { class: "body-figure__parts", children: regionsFor(view, look).map((region) => {
      const on = selected.has(region.id);
      return /* @__PURE__ */ u$1(
        "g",
        {
          class: `body-figure__part${on ? " body-figure__part--on" : ""}${onToggle ? " body-figure__part--press" : ""}`,
          "data-part": region.id,
          ...HEAD_PARTS.has(region.id) ? { transform: HEAD_TRANSFORM } : {},
          onClick: onToggle ? () => onToggle(region.id) : void 0,
          children: region.shapes.map((shape, index) => /* @__PURE__ */ u$1(ShapeEl, { shape }, index))
        },
        region.id
      );
    }) })
  ] });
}
function MyBodyScreen() {
  const view = useSignal("front");
  const selected = useSignal(/* @__PURE__ */ new Set());
  const feeling = useSignal(null);
  const amount = useSignal(null);
  const look = withDefaults(myBodySetting.signal.value);
  function toggle(id) {
    const next = new Set(selected.value);
    if (next.has(id)) next.delete(id);
    else {
      next.add(id);
      const spoken = bodySentence([id]);
      announceText(spoken);
    }
    selected.value = next;
  }
  function toggleGroup(parts) {
    const next = new Set(selected.value);
    const allOn = parts.every((part) => next.has(part));
    for (const part of parts) {
      if (allOn) next.delete(part);
      else next.add(part);
    }
    if (!allOn) announceText(bodySentence(parts));
    selected.value = next;
  }
  function sayIt() {
    const sentence = bodySentence([...selected.value], feeling.value ?? void 0, amount.value ?? void 0);
    if (sentence) announceText(sentence);
  }
  function startAgain() {
    selected.value = /* @__PURE__ */ new Set();
    feeling.value = null;
    amount.value = null;
  }
  const groups = groupsFor(view.value, look);
  const anySelected = selected.value.size > 0;
  const preview = bodySentence([...selected.value], feeling.value ?? void 0, amount.value ?? void 0);
  return /* @__PURE__ */ u$1("div", { class: "my-body", children: [
    /* @__PURE__ */ u$1("div", { class: "my-body__figure", children: [
      /* @__PURE__ */ u$1(BodyFigure, { look, view: view.value, selected: selected.value, onToggle: toggle }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "my-body__turn",
          onClick: () => view.value = view.value === "front" ? "back" : "front",
          "aria-label": view.value === "front" ? "Turn round to see the back" : "Turn round to see the front",
          children: view.value === "front" ? "See my back" : "See my front"
        }
      )
    ] }),
    /* @__PURE__ */ u$1("div", { class: "my-body__panel", children: [
      /* @__PURE__ */ u$1("p", { class: "my-body__step", children: "Where?" }),
      /* @__PURE__ */ u$1("div", { class: "my-body__parts", role: "group", "aria-label": "Parts of the body", children: groups.map((group) => {
        const on = group.parts.some((part) => selected.value.has(part));
        return /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: `my-body__part${on ? " my-body__part--on" : ""}`,
            "aria-pressed": on,
            onClick: () => toggleGroup(group.parts),
            children: group.label
          },
          group.id
        );
      }) }),
      /* @__PURE__ */ u$1("p", { class: "my-body__step", children: "What is it like?" }),
      /* @__PURE__ */ u$1("div", { class: "my-body__feelings", role: "group", "aria-label": "How it feels", children: FEELINGS.map((entry) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `my-body__feeling${feeling.value === entry.id ? " my-body__feeling--on" : ""}`,
          "aria-pressed": feeling.value === entry.id,
          onClick: () => feeling.value = feeling.value === entry.id ? null : entry.id,
          children: [
            /* @__PURE__ */ u$1("span", { "aria-hidden": "true", children: entry.icon }),
            " ",
            entry.label
          ]
        },
        entry.id
      )) }),
      /* @__PURE__ */ u$1("p", { class: "my-body__step", children: "How much?" }),
      /* @__PURE__ */ u$1("div", { class: "my-body__amounts", role: "group", "aria-label": "How much", children: AMOUNTS.map((entry) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `my-body__amount${amount.value === entry ? " my-body__amount--on" : ""}`,
          "aria-pressed": amount.value === entry,
          onClick: () => amount.value = amount.value === entry ? null : entry,
          children: entry
        },
        entry
      )) }),
      /* @__PURE__ */ u$1("p", { class: "my-body__sentence", "aria-live": "polite", children: preview || "Point to the part of your body." }),
      /* @__PURE__ */ u$1("div", { class: "my-body__actions", children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "my-body__say", disabled: !anySelected, onClick: sayIt, children: "Say it" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "my-body__again", disabled: !anySelected && !feeling.value && !amount.value, onClick: startAgain, children: "Start again" })
      ] }),
      /* @__PURE__ */ u$1("p", { class: "my-body__note", children: [
        PART_LABELS.pants,
        " means the parts a swimsuit covers. They are private."
      ] })
    ] })
  ] });
}
const INK = "#1f2937";
const SKIN = "#f4b98c";
const RED = "#ef4444";
const ORANGE = "#f59e0b";
const YELLOW = "#facc15";
const GREEN = "#22c55e";
const BLUE = "#3b82f6";
const SKY = "#93c5fd";
const PURPLE = "#a855f7";
const PINK = "#f472b6";
const BROWN = "#a16207";
const GREY = "#9ca3af";
const WHITE = "#ffffff";
const DARK = "#4b5563";
const CREAM = "#fde68a";
const c = (cx, cy, r2, fill) => `<circle cx="${cx}" cy="${cy}" r="${r2}" fill="${fill}"/>`;
const e = (cx, cy, rx, ry, fill) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const r = (x2, y2, w2, h2, rx, fill) => `<rect x="${x2}" y="${y2}" width="${w2}" height="${h2}" rx="${rx}" fill="${fill}"/>`;
const p = (d2, fill = "none") => `<path d="${d2}" fill="${fill}"/>`;
const l = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none"/>`;
const face = (cx, cy, mood = "smile") => {
  const eyes = mood === "sleep" ? `<path d="M${cx - 9} ${cy - 3}q3 3 6 0M${cx + 3} ${cy - 3}q3 3 6 0" fill="none"/>` : `${c(cx - 6, cy - 3, 1.8, INK)}${c(cx + 6, cy - 3, 1.8, INK)}`;
  const mouth = mood === "smile" ? `<path d="M${cx - 6} ${cy + 4}q6 7 12 0" fill="none"/>` : mood === "sad" ? `<path d="M${cx - 6} ${cy + 9}q6 -7 12 0" fill="none"/>` : mood === "cross" ? `<path d="M${cx - 6} ${cy + 8}l12 0M${cx - 9} ${cy - 8}l5 3M${cx + 9} ${cy - 8}l-5 3" fill="none"/>` : mood === "open" ? e(cx, cy + 7, 4, 5, INK) : mood === "sleep" ? `<path d="M${cx - 4} ${cy + 7}q4 3 8 0" fill="none"/>` : `<path d="M${cx - 5} ${cy + 7}l10 0" fill="none"/>`;
  return eyes + mouth;
};
const hand = (cx, cy) => e(cx, cy, 5, 5.5, SKIN);
const person = (shirt, hair, opts = {}) => {
  const k2 = opts.small ? 0.7 : 1;
  const y0 = opts.small ? 12 : 0;
  const body = opts.skirt ? p(`M${32 - 9 * k2} ${30 + y0} h${18 * k2} l${6 * k2} ${20 * k2} h${-30 * k2} z`, shirt) : r(32 - 9 * k2, 30 + y0, 18 * k2, 22 * k2, 6 * k2, shirt);
  const legs = opts.skirt ? "" : `${r(32 - 8 * k2, 48 + y0, 6 * k2, 12 * k2, 2, DARK)}${r(32 + 2 * k2, 48 + y0, 6 * k2, 12 * k2, 2, DARK)}`;
  const arms = opts.arms === "up" ? `${l(23, 34 + y0, 14, 20 + y0)}${l(41, 34 + y0, 50, 20 + y0)}${hand(13, 18 + y0)}${hand(51, 18 + y0)}` : opts.arms === "out" ? `${l(23, 34 + y0, 10, 40 + y0)}${l(41, 34 + y0, 54, 40 + y0)}${hand(9, 41 + y0)}${hand(55, 41 + y0)}` : `${l(23, 34 + y0, 18, 46 + y0)}${l(41, 34 + y0, 46, 46 + y0)}`;
  return legs + body + arms + circle(32, 20 + y0 * 0.6, 10 * k2 + (opts.small ? 2 : 0), SKIN) + p(`M${32 - 10 * k2 - 1} ${19 + y0 * 0.6} q${10 * k2 + 1} ${-14} ${20 * k2 + 2} 0 l-2 -2 h${-16 * k2} z`, hair);
};
const circle = c;
const SYMBOL_BODIES = {
  // ---- people and words about me and you
  "person-me": person(BLUE, BROWN, { arms: "up" }),
  "person-you": person(GREEN, BROWN, { arms: "out" }) + `<path d="M6 30 h12 m-4 -5 l5 5 l-5 5" fill="none" stroke-width="3"/>`,
  mum: person(PINK, "#7c2d12", { skirt: true }),
  dad: person(BLUE, "#374151"),
  baby: person("#fbcfe8", "#fde68a", { small: true }),
  grandma: person(PURPLE, "#e5e7eb", { skirt: true }),
  friend: person(ORANGE, BROWN) + `<g transform="translate(22 6) scale(.7)">${person(GREEN, "#374151")}</g>`,
  teacher: person(RED, "#374151") + r(42, 36, 16, 12, 2, WHITE) + l(45, 40, 55, 40) + l(45, 44, 53, 44),
  family: `<g transform="translate(-9 6) scale(.8)">${person(BLUE, "#374151")}</g><g transform="translate(15 6) scale(.8)">${person(PINK, "#7c2d12", { skirt: true })}</g><g transform="translate(5 22) scale(.7)">${person(GREEN, "#fde68a", { small: true })}</g>`,
  // ---- core little words
  "want": p("M6 52 q4 -8 14 -8 h14 q4 0 4 4 t-4 4 h-12 M34 48 h8 q6 0 10 -6 l4 -6", SKIN) + p("M44 26 l3 6 l7 1 l-5 5 l1 7 l-6 -4 l-6 4 l1 -7 l-5 -5 l7 -1 z", YELLOW),
  like: r(10, 28, 12, 26, 3, BLUE) + p("M26 54 h20 q8 0 8 -8 l-2 -14 q-1 -6 -8 -6 h-8 l2 -10 q1 -8 -6 -8 l-6 18 v28 z", YELLOW),
  more: c(32, 32, 24, GREEN) + `<path d="M32 18 v28 M18 32 h28" stroke="${WHITE}" stroke-width="7" fill="none"/>`,
  no: c(32, 32, 24, RED) + `<path d="M18 18 L46 46" stroke="${WHITE}" stroke-width="7" fill="none"/><path d="M46 18 L18 46" stroke="${WHITE}" stroke-width="7" fill="none"/>`,
  yes: c(32, 32, 24, GREEN) + `<path d="M19 33 l9 9 l18 -20" stroke="${WHITE}" stroke-width="7" fill="none"/>`,
  help: c(32, 32, 25, RED) + c(32, 32, 11, WHITE) + p("M15 15 L24 24 M49 15 L40 24 M15 49 L24 40 M49 49 L40 40", "none") + `<path d="M14 14 l10 10 M50 14 l-10 10 M14 50 l10 -10 M50 50 l-10 -10" stroke="${WHITE}" stroke-width="6" fill="none"/>` + c(32, 32, 11, "#fee2e2"),
  go: person(GREEN, BROWN) + `<path d="M46 52 h12 m-4 -4 l4 4 l-4 4" fill="none" stroke-width="3"/>`,
  my: person(BLUE, BROWN, { arms: "down" }) + p("M44 28 l8 0 l0 10", "none") + c(53, 24, 4, YELLOW),
  feel: p("M32 54 C10 40 6 24 18 16 C26 11 32 18 32 22 C32 18 38 11 46 16 C58 24 54 40 32 54 z", RED),
  stop: p("M22 6 h20 l16 16 v20 l-16 16 h-20 l-16 -16 v-20 z", RED) + `<path d="M19 32 h26" stroke="${WHITE}" stroke-width="7" fill="none"/>`,
  look: e(32, 32, 26, 16, WHITE) + c(32, 32, 11, BLUE) + c(32, 32, 5, INK) + c(35, 29, 2, WHITE),
  "all-done": r(12, 8, 6, 50, 3, GREY) + p("M18 10 h30 l-8 10 l8 10 h-30 z", GREEN) + p("M24 20 l5 5 l9 -9", "none"),
  again: p("M48 22 A18 18 0 1 0 50 38", "none") + p("M50 12 v14 h-14", "none"),
  open: r(10, 30, 44, 24, 4, BROWN) + p("M10 30 l-4 -14 h40 l8 14", CREAM),
  that: p("M10 52 L36 26", "none") + p("M36 26 l-12 2 M36 26 l-2 12", "none") + c(46, 18, 9, YELLOW),
  not: c(32, 32, 24, WHITE) + `<path d="M15 49 L49 15" stroke="${RED}" stroke-width="7" fill="none"/>` + p("M24 32 h16", "none"),
  what: c(32, 32, 24, PURPLE) + `<path d="M24 24 q0 -9 9 -9 q9 0 9 8 q0 6 -7 9 q-3 2 -3 6" stroke="${WHITE}" stroke-width="5" fill="none"/>` + c(32, 48, 3.2, WHITE),
  // ---- food and drink
  "food": c(32, 34, 20, WHITE) + c(32, 34, 12, "#e5e7eb") + l(6, 14, 6, 54) + l(2, 14, 2, 26) + l(10, 14, 10, 26) + p("M58 14 q-6 8 0 20 v20", "none"),
  apple: p("M32 20 C22 12 8 20 10 36 C12 52 24 58 32 54 C40 58 52 52 54 36 C56 20 42 12 32 20 z", RED) + p("M32 20 q0 -8 6 -12", "none") + p("M36 12 q8 -4 10 2 q-8 4 -10 -2 z", GREEN),
  banana: p("M12 18 C14 44 34 58 56 46 C44 50 32 42 26 12 z", YELLOW) + p("M12 18 l4 -6 l10 0 l0 6", "none"),
  biscuit: c(32, 32, 24, "#d9a066") + c(24, 24, 3, BROWN) + c(40, 28, 3, BROWN) + c(30, 42, 3, BROWN) + c(42, 42, 2.5, BROWN),
  bread: p("M10 28 q-4 -18 22 -18 q26 0 22 18 v24 q0 4 -4 4 h-36 q-4 0 -4 -4 z", "#e8b86d") + p("M22 22 q10 -6 20 0", "none"),
  cheese: p("M6 40 L58 24 V50 H6 z", YELLOW) + c(20, 42, 3.5, "#eab308") + c(38, 40, 3, "#eab308") + c(50, 44, 3, "#eab308"),
  "egg": e(32, 36, 24, 20, WHITE) + c(32, 36, 10, YELLOW),
  drink: p("M14 14 h36 l-5 42 h-26 z", SKY) + l(34, 4, 38, 14) + p("M16 26 h32", "none"),
  juice: r(16, 14, 32, 42, 4, ORANGE) + r(16, 14, 32, 10, 3, WHITE) + c(32, 40, 8, YELLOW),
  water: p("M32 6 C20 24 14 32 14 40 a18 18 0 0 0 36 0 C50 32 44 24 32 6 z", SKY) + p("M24 42 q2 8 10 8", "none"),
  milk: p("M20 8 h24 l6 12 v34 q0 4 -4 4 h-28 q-4 0 -4 -4 v-34 z", WHITE) + r(18, 28, 28, 14, 2, SKY),
  // ---- feelings
  happy: c(32, 32, 25, YELLOW) + face(32, 33, "smile"),
  sad: c(32, 32, 25, SKY) + face(32, 33, "sad") + p("M22 38 q-2 6 0 8", "none"),
  angry: c(32, 32, 25, "#fb923c") + face(32, 33, "cross"),
  "tired": c(32, 32, 25, "#ddd6fe") + face(32, 33, "sleep") + p("M44 14 h8 l-8 9 h8", "none") + p("M52 6 h6 l-6 7 h6", "none"),
  hungry: c(32, 32, 25, YELLOW) + face(32, 31, "open") + p("M30 46 q2 6 6 2", "none"),
  scared: c(32, 32, 25, "#e5e7eb") + c(26, 29, 4.5, WHITE) + c(38, 29, 4.5, WHITE) + c(26, 29, 1.8, INK) + c(38, 29, 1.8, INK) + e(32, 44, 5, 6, INK),
  hurts: c(32, 32, 25, "#fecaca") + face(32, 34, "sad") + r(36, 8, 18, 8, 2, WHITE) + l(41, 8, 41, 16) + l(48, 8, 48, 16),
  "body-face": c(32, 32, 25, SKIN) + face(32, 33, "smile"),
  // ---- play
  play: p("M20 14 q-6 -8 -12 0 q0 8 8 8 M44 14 q6 -8 12 0 q0 8 -8 8", BROWN) + c(32, 26, 15, BROWN) + c(32, 28, 8, CREAM) + c(27, 23, 2, INK) + c(37, 23, 2, INK) + e(32, 29, 3, 2.2, INK) + r(18, 40, 28, 18, 8, BROWN),
  ball: c(32, 32, 25, WHITE) + p("M32 21 l8 6 l-3 9 h-10 l-3 -9 z", INK) + p("M32 21 v-9 M40 27 l9 -4 M37 36 l5 9 M27 36 l-5 9 M24 27 l-9 -4", "none"),
  blocks: r(8, 36, 22, 20, 2, RED) + r(34, 36, 22, 20, 2, BLUE) + r(21, 14, 22, 20, 2, YELLOW) + `<text x="25" y="49" font-size="13" font-weight="800" fill="${WHITE}" stroke="none">A</text>`,
  book: p("M8 12 h22 q2 0 2 2 v38 q-2 -2 -6 -2 h-18 z", RED) + p("M56 12 h-22 q-2 0 -2 2 v38 q2 -2 6 -2 h18 z", BLUE),
  car: p("M6 40 h52 v8 h-52 z", RED) + p("M14 40 l6 -14 h24 l8 14 z", RED) + p("M22 28 h9 v10 h-13 z M34 28 h9 l4 10 h-13 z", SKY) + c(18, 50, 7, INK) + c(46, 50, 7, INK) + c(18, 50, 3, GREY) + c(46, 50, 3, GREY),
  teddy: c(20, 16, 8, BROWN) + c(44, 16, 8, BROWN) + c(32, 28, 16, BROWN) + c(32, 32, 7, CREAM) + c(27, 25, 2, INK) + c(37, 25, 2, INK) + e(32, 31, 3, 2.2, INK) + e(32, 50, 14, 10, BROWN) + c(14, 46, 5, BROWN) + c(50, 46, 5, BROWN),
  music: p("M22 46 V14 L50 8 V40", "none") + e(18, 46, 8, 6, PURPLE) + e(46, 40, 8, 6, PURPLE),
  tv: r(6, 14, 52, 34, 5, DARK) + r(11, 19, 42, 24, 3, SKY) + l(20, 54, 44, 54) + l(24, 6, 32, 14) + l(40, 6, 32, 14),
  animals: c(32, 34, 18, "#d9a066") + p("M16 24 q-10 -6 -6 -18 q10 4 14 14 z M48 24 q10 -6 6 -18 q-10 4 -14 14 z", BROWN) + c(26, 31, 2.4, INK) + c(38, 31, 2.4, INK) + e(32, 40, 5, 4, INK) + p("M32 44 v4 M27 48 q5 4 10 0", "none"),
  // ---- places
  places: p("M32 60 C14 40 10 30 10 24 a22 22 0 0 1 44 0 c0 6 -4 16 -22 36 z", RED) + c(32, 24, 8, WHITE),
  home: p("M6 30 L32 8 L58 30 z", RED) + r(12, 30, 40, 26, 2, CREAM) + r(26, 38, 12, 18, 2, BROWN) + r(16, 34, 8, 8, 1, SKY) + r(42, 34, 6, 8, 1, SKY),
  park: r(28, 34, 8, 22, 2, BROWN) + c(32, 24, 18, GREEN) + c(20, 32, 11, GREEN) + c(44, 32, 11, GREEN),
  shop: r(8, 22, 48, 34, 2, CREAM) + p("M6 22 l4 -12 h44 l4 12 z", RED) + r(26, 36, 12, 20, 2, BROWN) + r(12, 30, 10, 10, 1, SKY) + r(42, 30, 10, 10, 1, SKY),
  bedroom: r(6, 34, 52, 14, 3, BLUE) + r(6, 48, 6, 8, 1, BROWN) + r(52, 48, 6, 8, 1, BROWN) + r(6, 20, 8, 28, 2, BROWN) + r(14, 26, 16, 8, 4, WHITE),
  kitchen: r(14, 28, 36, 26, 4, GREY) + r(10, 22, 44, 8, 3, DARK) + c(32, 18, 3, DARK) + c(24, 40, 5, DARK) + c(40, 40, 5, DARK),
  school: p("M6 28 L32 8 L58 28 z", RED) + r(10, 28, 44, 28, 2, CREAM) + r(26, 38, 12, 18, 2, BROWN) + r(14, 34, 8, 8, 1, SKY) + r(42, 34, 8, 8, 1, SKY) + l(32, 8, 32, 2) + p("M32 2 h8 v5 h-8", RED),
  // ---- doing
  doing: person(GREEN, BROWN) + p("M44 54 l6 -8 M10 46 l8 8", "none"),
  eat: e(32, 38, 22, 6, WHITE) + p("M16 38 q16 -22 32 0", "#d9a066") + l(12, 52, 52, 52),
  sleep: r(8, 38, 48, 14, 4, BLUE) + c(18, 34, 9, SKIN) + p("M10 34 q8 -14 16 0", BROWN) + `<text x="40" y="26" font-size="14" font-weight="800" fill="${INK}" stroke="none">z</text><text x="48" y="16" font-size="10" font-weight="800" fill="${INK}" stroke="none">z</text>`,
  wash: p("M10 34 h44 q0 20 -22 20 q-22 0 -22 -20 z", SKY) + c(20, 22, 5, WHITE) + c(34, 16, 6, WHITE) + c(44, 24, 4, WHITE) + c(28, 28, 3, WHITE),
  toilet: r(24, 10, 18, 20, 3, WHITE) + p("M16 32 h34 q0 14 -17 14 q-17 0 -17 -14 z", WHITE) + r(26, 46, 14, 10, 2, WHITE),
  sit: r(18, 32, 28, 6, 2, BROWN) + r(18, 12, 6, 26, 2, BROWN) + l(20, 38, 18, 56) + l(44, 38, 46, 56),
  // ---- body
  head: c(32, 32, 24, SKIN) + p("M10 28 q22 -34 44 0 q-22 -12 -44 0 z", BROWN) + face(32, 36, "smile"),
  eyes: e(32, 32, 26, 16, WHITE) + c(32, 32, 10, BLUE) + c(32, 32, 5, INK),
  ears: p("M22 12 q22 -4 22 22 q0 14 -10 18 q-6 4 -6 10 q-2 6 -8 2", SKIN) + p("M28 22 q10 0 10 12", "none"),
  nose: p("M32 8 q-4 22 -8 30 q-4 8 8 8 q12 0 8 -8 q-4 -8 -8 -30 z", SKIN) + c(26, 44, 2, INK) + c(38, 44, 2, INK),
  mouth: p("M6 32 q26 -18 52 0 q-26 24 -52 0 z", RED) + p("M12 32 q20 6 40 0", WHITE),
  hand: p("M16 56 V30 a4 4 0 0 1 8 0 V20 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V22 a4 4 0 0 1 8 0 V44 q0 12 -12 12 z", SKIN),
  tummy: p("M18 6 h28 q8 0 8 8 v22 q0 10 -6 18 l-2 6 h-28 l-2 -6 q-6 -8 -6 -18 v-22 q0 -8 8 -8 z", SKIN) + c(32, 38, 12, "#fecaca") + `<circle cx="32" cy="38" r="12" fill="none" stroke="${RED}" stroke-width="3"/>` + c(32, 38, 2, INK) + p("M24 6 q8 8 16 0", "none"),
  leg: p("M24 4 h16 v32 l4 6 v12 h-22 v-12 l2 -6 z", SKIN) + l(24, 52, 44, 52),
  foot: p("M22 6 h14 v30 q0 8 14 12 q8 4 8 10 h-36 z", SKIN) + c(46, 52, 2, INK) + c(40, 52, 2, INK) + c(34, 52, 2, INK),
  // ---- animals
  dog: p("M10 16 q-6 14 4 24 M54 16 q6 14 -4 24", BROWN) + c(32, 30, 18, "#d9a066") + e(32, 40, 9, 7, WHITE) + c(26, 26, 2.4, INK) + c(38, 26, 2.4, INK) + e(32, 36, 3.5, 2.5, INK) + p("M32 38 v4 q-4 4 -8 0 M32 42 q4 4 8 0", "none") + e(32, 50, 6, 3, PINK),
  cat: p("M14 24 L12 4 L28 14 M50 24 L52 4 L36 14", ORANGE) + c(32, 34, 20, ORANGE) + c(25, 30, 2.4, INK) + c(39, 30, 2.4, INK) + p("M30 37 h4 l-2 3 z", PINK) + p("M32 40 q-5 4 -9 1 M32 40 q5 4 9 1 M6 36 l10 2 M6 44 l10 -2 M58 36 l-10 2 M58 44 l-10 -2", "none"),
  bird: e(30, 36, 20, 16, BLUE) + c(46, 26, 10, BLUE) + p("M54 26 l8 3 l-8 3 z", ORANGE) + c(48, 24, 2, INK) + p("M10 34 q-6 6 -6 14 q10 0 16 -8", SKY) + l(28, 52, 28, 60) + l(36, 52, 36, 60),
  fish: e(28, 32, 22, 15, ORANGE) + p("M48 32 L62 18 V46 z", ORANGE) + c(18, 28, 2.6, INK) + p("M24 20 q8 12 0 24", "none"),
  "horse": p("M18 56 V34 q0 -22 18 -26 l8 8 l6 -6 l2 14 q-2 14 -10 16 v16 z", BROWN) + c(40, 20, 2.2, INK) + p("M16 20 q-4 16 4 30", DARK) + p("M42 24 q4 4 8 2", "none"),
  cow: r(8, 28, 48, 20, 8, WHITE) + c(20, 20, 12, WHITE) + p("M12 12 l-4 -6 M28 12 l4 -6", "none") + c(16, 18, 2, INK) + c(24, 18, 2, INK) + e(20, 26, 6, 4, PINK) + c(38, 34, 6, INK) + c(48, 38, 4, INK) + l(14, 48, 14, 58) + l(50, 48, 50, 58),
  pig: c(32, 34, 22, PINK) + p("M14 20 L10 8 L24 14 M50 20 L54 8 L40 14", PINK) + e(32, 40, 9, 7, "#f9a8d4") + c(29, 40, 1.6, INK) + c(35, 40, 1.6, INK) + c(25, 28, 2.4, INK) + c(39, 28, 2.4, INK),
  duck: e(30, 40, 22, 14, YELLOW) + c(44, 22, 12, YELLOW) + p("M54 22 l9 4 l-9 4 z", ORANGE) + c(47, 20, 2, INK) + p("M20 40 q10 -10 20 0", "#eab308"),
  sheep: c(20, 32, 10, WHITE) + c(32, 26, 12, WHITE) + c(44, 32, 10, WHITE) + c(26, 42, 10, WHITE) + c(40, 42, 10, WHITE) + e(32, 36, 10, 11, "#374151") + c(28, 33, 1.8, WHITE) + c(36, 33, 1.8, WHITE) + l(26, 52, 26, 60) + l(40, 52, 40, 60),
  // ---- greetings and manners
  hello: p("M18 58 V30 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V14 a4 4 0 0 1 8 0 V20 a4 4 0 0 1 8 0 V46 q0 12 -12 12 z", SKIN) + p("M8 18 q-4 8 0 16 M2 14 q-6 12 0 24", "none"),
  goodbye: p("M18 58 V30 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V14 a4 4 0 0 1 8 0 V20 a4 4 0 0 1 8 0 V46 q0 12 -12 12 z", SKIN) + p("M56 20 q6 10 0 20 M62 14 q8 16 0 30", "none"),
  please: p("M32 56 C22 48 14 42 14 32 L22 14 L32 26 L42 14 L50 32 C50 42 42 48 32 56 z", SKIN) + l(32, 26, 32, 50),
  "thank-you": c(32, 32, 25, YELLOW) + face(32, 33, "smile") + c(20, 40, 4, "#fda4af") + c(44, 40, 4, "#fda4af"),
  sorry: c(32, 32, 25, SKY) + face(32, 34, "sad") + p("M20 24 l8 -3 M44 24 l-8 -3", "none"),
  wait: p("M18 58 V30 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V14 a4 4 0 0 1 8 0 V20 a4 4 0 0 1 8 0 V46 q0 12 -12 12 z", SKIN),
  goodnight: p("M42 8 A24 24 0 1 0 56 40 A20 20 0 0 1 42 8 z", YELLOW) + `<text x="14" y="26" font-size="12" font-weight="800" fill="${INK}" stroke="none">z</text>` + c(50, 14, 2.5, YELLOW) + c(56, 26, 2, YELLOW),
  // ---- school
  pencil: p("M12 52 L8 60 L16 56 L52 16 L44 8 z", YELLOW) + p("M44 8 l8 8 l4 -4 l-8 -8 z", PINK) + p("M12 52 L8 60 L16 56 z", CREAM),
  "school-book": p("M12 6 h38 q4 0 4 4 v44 h-38 q-4 0 -4 -4 z", BLUE) + p("M12 50 h42", "none") + r(20, 14, 24, 10, 2, WHITE),
  break: c(32, 32, 24, WHITE) + p("M32 14 v18 l12 8", "none"),
  lunch: r(8, 22, 48, 32, 5, ORANGE) + r(8, 22, 48, 8, 3, "#fb923c") + r(26, 10, 12, 8, 3, DARK) + c(32, 42, 6, YELLOW),
  "my-turn": person(BLUE, BROWN, { arms: "up" }) + p("M52 10 l4 -4 M56 14 l5 0", "none"),
  "your-turn": person(GREEN, BROWN, { arms: "out" }) + `<path d="M6 30 h12 m-4 -5 l5 5 l-5 5" fill="none" stroke-width="3"/>`,
  // ---- the home screen and the top bar
  talk: p("M8 10 h48 q4 0 4 4 v24 q0 4 -4 4 h-24 l-12 12 v-12 h-12 q-4 0 -4 -4 v-24 q0 -4 4 -4 z", BLUE) + c(22, 26, 3, WHITE) + c(32, 26, 3, WHITE) + c(42, 26, 3, WHITE),
  keyboard: r(4, 16, 56, 32, 5, GREY) + [0, 1, 2, 3, 4, 5].map((i2) => r(9 + i2 * 8, 21, 6, 6, 1, WHITE)).join("") + [0, 1, 2, 3, 4].map((i2) => r(13 + i2 * 8, 30, 6, 6, 1, WHITE)).join("") + r(18, 39, 28, 5, 1, WHITE),
  "my-day": r(8, 12, 48, 44, 4, WHITE) + r(8, 12, 48, 12, 3, RED) + l(20, 8, 20, 16) + l(44, 8, 44, 16) + [0, 1, 2].map((i2) => c(20 + i2 * 12, 34, 3, BLUE)).join("") + [0, 1, 2].map((i2) => c(20 + i2 * 12, 46, 3, BLUE)).join(""),
  favourites: p("M32 6 L39 24 L58 25 L43 37 L48 56 L32 45 L16 56 L21 37 L6 25 L25 24 z", YELLOW),
  "my-pages": p("M14 6 h26 l12 12 v40 h-38 z", WHITE) + p("M40 6 v12 h12", GREY) + l(20, 28, 46, 28) + l(20, 36, 46, 36) + l(20, 44, 38, 44),
  "home-bar": p("M6 30 L32 8 L58 30 z", RED) + r(12, 30, 40, 26, 2, CREAM) + r(26, 38, 12, 18, 2, BROWN),
  firstthen: p("M6 20 h22 v24 h-22 z", SKY) + p("M36 20 h22 v24 h-22 z", GREEN) + `<path d="M28 32 h8 m-3 -4 l4 4 l-4 4" fill="none" stroke-width="3"/>`,
  games: r(6, 20, 52, 28, 12, PURPLE) + l(18, 28, 18, 40) + l(12, 34, 24, 34) + c(42, 30, 3.2, YELLOW) + c(48, 38, 3.2, GREEN),
  draw: p("M12 52 L8 60 L16 56 L52 16 L44 8 z", RED) + p("M44 8 l8 8 l4 -4 l-8 -8 z", GREY) + c(44, 50, 7, BLUE) + c(54, 44, 5, YELLOW),
  "my-body": person(BLUE, BROWN),
  "music-note": p("M22 46 V14 L50 8 V40", "none") + e(18, 46, 8, 6, PURPLE) + e(46, 40, 8, 6, PURPLE),
  traffic: r(18, 4, 28, 56, 8, DARK) + c(32, 16, 6.5, RED) + c(32, 32, 6.5, ORANGE) + c(32, 48, 6.5, GREEN),
  question: c(32, 32, 24, PURPLE) + `<path d="M24 24 q0 -9 9 -9 q9 0 9 8 q0 6 -7 9 q-3 2 -3 6" stroke="${WHITE}" stroke-width="5" fill="none"/>` + c(32, 48, 3.2, WHITE),
  finished: r(12, 8, 6, 50, 3, GREY) + p("M18 10 h30 l-8 10 l8 10 h-30 z", GREEN),
  "say-again": p("M48 22 A18 18 0 1 0 50 38", "none") + p("M50 12 v14 h-14", "none"),
  "break-bar": c(32, 32, 24, WHITE) + p("M32 14 v18 l12 8", "none"),
  "weather-sun": c(32, 32, 12, YELLOW) + [0, 1, 2, 3, 4, 5, 6, 7].map((i2) => l(32 + Math.cos(i2 * Math.PI / 4) * 18, 32 + Math.sin(i2 * Math.PI / 4) * 18, 32 + Math.cos(i2 * Math.PI / 4) * 26, 32 + Math.sin(i2 * Math.PI / 4) * 26)).join("")
};
const SYMBOLS = SYMBOL_BODIES;
const EMOJI_TO_SYMBOL = {
  "🙋": "person-me",
  "👉": "person-you",
  "👩": "mum",
  "👨": "dad",
  "👶": "baby",
  "👵": "grandma",
  "🧑‍🤝‍🧑": "friend",
  "🧑‍🏫": "teacher",
  "👨‍👩‍👧": "family",
  "🤲": "want",
  "👍": "like",
  "➕": "more",
  "🚫": "no",
  "✅": "yes",
  "🆘": "help",
  "🚶": "go",
  "☝️": "my",
  "❤️": "feel",
  "🛑": "stop",
  "👀": "look",
  "🏁": "all-done",
  "🔁": "again",
  "📂": "open",
  "👆": "that",
  "⛔": "not",
  "❓": "what",
  "🍽️": "food",
  "🍎": "apple",
  "🍌": "banana",
  "🍪": "biscuit",
  "🍞": "bread",
  "🧀": "cheese",
  "🥚": "egg",
  "🥤": "drink",
  "🧃": "juice",
  "💧": "water",
  "🥛": "milk",
  "😊": "happy",
  "😢": "sad",
  "😠": "angry",
  "😴": "tired",
  "😋": "hungry",
  "😨": "scared",
  "🤕": "hurts",
  "🙂": "body-face",
  "🧸": "teddy",
  "⚽": "ball",
  "🧱": "blocks",
  "📖": "book",
  "🚗": "car",
  "🎵": "music",
  "📺": "tv",
  "🐶": "dog",
  "🐱": "cat",
  "🐦": "bird",
  "🐟": "fish",
  "🐴": "horse",
  "🐮": "cow",
  "🐷": "pig",
  "🦆": "duck",
  "🐑": "sheep",
  "📍": "places",
  "🏠": "home",
  "🌳": "park",
  "🏪": "shop",
  "🛏️": "bedroom",
  "🍳": "kitchen",
  "🏫": "school",
  "🏃": "doing",
  "🧼": "wash",
  "🚽": "toilet",
  "🪑": "sit",
  "👁️": "eyes",
  "👂": "ears",
  "👃": "nose",
  "👄": "mouth",
  "✋": "hand",
  "🎽": "tummy",
  "🦵": "leg",
  "🦶": "foot",
  "👋": "hello",
  "🖐️": "goodbye",
  "🙏": "please",
  "😔": "sorry",
  "🌙": "goodnight",
  "✏️": "pencil",
  "📚": "school-book",
  "🕑": "break",
  "🍱": "lunch",
  "💬": "talk",
  "⌨️": "keyboard",
  "📅": "my-day",
  "⭐": "favourites",
  "📄": "my-pages",
  "➡️": "firstthen",
  "🎮": "games",
  "🎨": "draw",
  "🧍": "my-body",
  "🚦": "traffic",
  "⏸️": "break",
  "☀️": "weather-sun"
};
function symbolSvg(name) {
  const body = SYMBOLS[name];
  if (!body) return void 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><g stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
}
function symbolDataUri(name) {
  const svg = symbolSvg(name);
  return svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : void 0;
}
function drawnFor(char) {
  const name = EMOJI_TO_SYMBOL[char];
  return name ? symbolDataUri(name) : void 0;
}
function Pic({ char, class: className }) {
  const url = symbolStyleSetting.signal.value === "drawn" ? drawnFor(char) : void 0;
  return url ? /* @__PURE__ */ u$1("img", { class: `pic pic--drawn${className ? ` ${className}` : ""}`, src: url, alt: "", "aria-hidden": "true", draggable: false }) : /* @__PURE__ */ u$1("span", { class: className, "aria-hidden": "true", children: char });
}
function FeelingsHelpScreen({ tab, onTabChange }) {
  const chosenFeeling = useSignal(null);
  h$2(() => {
    chosenFeeling.value = null;
  }, [tab]);
  function pressFeeling(item) {
    chosenFeeling.value = item;
    void recordPress(item.label);
    announceText(`I feel ${item.label}`);
  }
  function pressIntensity(intensity) {
    if (!chosenFeeling.value) return;
    announceText(`I feel ${chosenFeeling.value.label}, ${intensity}`);
  }
  function pressHelp(item) {
    void recordPress(item.label);
    void announceItem(item);
  }
  return /* @__PURE__ */ u$1("div", { class: "feelings-help-screen", children: [
    /* @__PURE__ */ u$1("div", { class: "page-tabs", children: [
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab === "feelings",
          onClick: () => onTabChange("feelings"),
          children: "Feelings"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab === "help",
          onClick: () => onTabChange("help"),
          children: "Help"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab === "calm",
          onClick: () => onTabChange("calm"),
          children: "Calm"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab === "body",
          onClick: () => onTabChange("body"),
          children: "My body"
        }
      )
    ] }),
    tab === "feelings" && /* @__PURE__ */ u$1("div", { class: "feelings-help-screen__body", children: [
      /* @__PURE__ */ u$1("div", { class: "board-grid feelings-help-screen__grid", children: FEELINGS_ITEMS.map((item) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "board-button",
          style: { backgroundColor: item.background_color },
          onClick: () => pressFeeling(item),
          "aria-pressed": chosenFeeling.value?.id === item.id,
          children: [
            item.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "board-button__emoji", char: item.image.char }),
            /* @__PURE__ */ u$1("span", { class: "board-button__label", children: item.label })
          ]
        },
        item.id
      )) }),
      /* @__PURE__ */ u$1("div", { class: "intensity-row", children: INTENSITIES.map((intensity) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "intensity-row__button",
          disabled: !chosenFeeling.value,
          onClick: () => pressIntensity(intensity),
          children: intensity
        },
        intensity
      )) })
    ] }),
    tab === "help" && /* @__PURE__ */ u$1("div", { class: "board-grid feelings-help-screen__grid feelings-help-screen__grid--help", children: HELP_ITEMS.map((item) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "board-button",
        style: { backgroundColor: item.background_color },
        onClick: () => pressHelp(item),
        children: [
          item.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "board-button__emoji", char: item.image.char }),
          /* @__PURE__ */ u$1("span", { class: "board-button__label", children: item.label })
        ]
      },
      item.id
    )) }),
    tab === "calm" && /* @__PURE__ */ u$1(CalmTab, {}),
    tab === "body" && /* @__PURE__ */ u$1(MyBodyScreen, {})
  ] });
}
function FavouritesScreen({ tab, onTabChange }) {
  const favourites = useSignal([]);
  const recentEnabled = useSignal(false);
  const recentEntries = useSignal([]);
  h$2(() => {
    void getFavourites().then((items) => {
      favourites.value = items;
    });
  }, []);
  async function refreshRecent() {
    recentEnabled.value = await isRecentEnabled();
    recentEntries.value = await getRecentEntries();
  }
  const version = recentVersion.value;
  h$2(() => {
    if (tab === "recent") void refreshRecent();
  }, [tab, version]);
  async function toggleRecentEnabled() {
    await setRecentEnabled(!recentEnabled.value);
    await refreshRecent();
  }
  async function handleClearRecent() {
    await clearRecent();
    await refreshRecent();
  }
  return /* @__PURE__ */ u$1("div", { class: "favourites-screen", children: [
    /* @__PURE__ */ u$1("div", { class: "page-tabs", children: [
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab === "favourites",
          onClick: () => onTabChange("favourites"),
          children: "Favourites"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab === "recent",
          onClick: () => onTabChange("recent"),
          children: "Recent"
        }
      )
    ] }),
    tab === "favourites" ? /* @__PURE__ */ u$1("div", { class: "board-grid favourites-screen__grid", children: favourites.value.map((item) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "board-button",
        style: { backgroundColor: item.background_color },
        onClick: () => {
          void recordPress(item.label);
          void announceItem(item);
        },
        children: [
          item.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "board-button__emoji", char: item.image.char }),
          /* @__PURE__ */ u$1("span", { class: "board-button__label", children: item.label })
        ]
      },
      item.id
    )) }) : /* @__PURE__ */ u$1("div", { class: "recent-screen", children: [
      /* @__PURE__ */ u$1("div", { class: "recent-screen__controls", children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "recent-screen__toggle", onClick: () => void toggleRecentEnabled(), children: [
          "Recent history: ",
          recentEnabled.value ? "On" : "Off"
        ] }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "recent-screen__clear",
            onClick: () => void handleClearRecent(),
            disabled: recentEntries.value.length === 0,
            children: "Clear"
          }
        )
      ] }),
      recentEnabled.value ? /* @__PURE__ */ u$1("ul", { class: "recent-screen__list", children: [
        recentEntries.value.length === 0 && /* @__PURE__ */ u$1("li", { class: "recent-screen__empty", children: "Nothing said yet." }),
        recentEntries.value.map((entry) => /* @__PURE__ */ u$1("li", { children: /* @__PURE__ */ u$1("button", { type: "button", class: "recent-screen__entry", onClick: () => announceText(entry.text), children: entry.text }) }, entry.id))
      ] }) : /* @__PURE__ */ u$1("p", { class: "recent-screen__empty", children: "Recent history is off. Turning it on remembers what's spoken here on this device only." })
    ] })
  ] });
}
function QuickAccessBar({ onNavigate }) {
  function press(id) {
    const phrase = QUICK_ACCESS_SPEECH[id];
    if (phrase) {
      announceText(phrase);
      return;
    }
    onNavigate(id);
  }
  return /* @__PURE__ */ u$1("nav", { class: "quick-access-bar", "aria-label": "Always-there buttons", children: quickAccessButtons.value.map((id) => /* @__PURE__ */ u$1("button", { type: "button", class: "quick-access-bar__button", "data-id": id, onClick: () => press(id), children: QUICK_ACCESS_LABELS[id] }, id)) });
}
function PhotoThumbnail({ blobId, alt, class: className }) {
  const url = useSignal(null);
  h$2(() => {
    let objectUrl = null;
    let cancelled = false;
    void getPhoto(blobId).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      url.value = objectUrl;
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [blobId]);
  if (!url.value) return null;
  return /* @__PURE__ */ u$1("img", { class: className, src: url.value, alt });
}
const LONG_PRESS_MS = 700;
function BoardButton({
  item,
  onPress,
  dwellMs = 0,
  scanHighlight = null,
  tabIndex,
  lowArousal = false
}) {
  const dwelling = useSignal(false);
  const timerRef = A(null);
  const longPressing = useSignal(false);
  const longPressTimerRef = A(null);
  const longPressFiredRef = A(false);
  function clearDwell() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dwelling.value = false;
  }
  function startDwell() {
    if (dwellMs <= 0) return;
    dwelling.value = true;
    timerRef.current = window.setTimeout(() => {
      dwelling.value = false;
      onPress(item);
    }, dwellMs);
  }
  function clearLongPress() {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressing.value = false;
  }
  function startLongPress() {
    clearLongPress();
    longPressFiredRef.current = false;
    longPressing.value = true;
    longPressTimerRef.current = window.setTimeout(() => {
      longPressing.value = false;
      longPressFiredRef.current = true;
      void saveFavourite(item);
      speak("Added to Favourites", {
        rate: preferredSpeechRate.value,
        pitch: preferredSpeechPitch.value,
        volume: speechVolumeSetting.signal.value,
        ...preferredVoiceURI.value ? { voiceURI: preferredVoiceURI.value } : {}
      });
    }, LONG_PRESS_MS);
  }
  function handleClick() {
    if (longPressFiredRef.current) {
      longPressFiredRef.current = false;
      return;
    }
    if (dwellMs > 0) return;
    onPress(item);
  }
  h$2(() => {
    return () => {
      clearDwell();
      clearLongPress();
    };
  }, [item.id]);
  const classes = [
    "board-button",
    scanHighlight === "row" && "board-button--scan-row",
    scanHighlight === "cell" && "board-button--scan-cell",
    dwelling.value && "board-button--dwelling",
    longPressing.value && "board-button--long-pressing",
    item.target && "board-button--target"
  ].filter(Boolean).join(" ");
  const background = resolveBackgroundColor(item.background_color, lowArousal);
  return /* @__PURE__ */ u$1(
    "button",
    {
      type: "button",
      id: `board-button-${item.id}`,
      class: classes,
      style: background ? { backgroundColor: background, color: readableOn(background) } : void 0,
      onClick: handleClick,
      onPointerEnter: startDwell,
      onPointerLeave: () => {
        clearDwell();
        clearLongPress();
      },
      onPointerDown: startLongPress,
      onPointerUp: clearLongPress,
      onFocus: startDwell,
      onBlur: clearDwell,
      ...item.load_board ? { "aria-label": `${item.label}, opens more` } : item.target ? { "aria-label": `${item.label}, focus word` } : {},
      ...tabIndex !== void 0 ? { tabIndex } : {},
      children: [
        item.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "board-button__emoji", char: item.image.char }),
        item.image?.kind === "photo" && /* @__PURE__ */ u$1(PhotoThumbnail, { class: "board-button__photo", blobId: item.image.blobId, alt: "" }),
        /* @__PURE__ */ u$1("span", { class: "board-button__label", children: item.label })
      ]
    }
  );
}
function isItemShown(item, activeStage) {
  if (item.hidden) return false;
  return activeStage === 0 || item.stage === void 0 || item.stage <= activeStage;
}
const gridScanningActive = { count: 0 };
function selectableColumnsInRow(shape, row) {
  const columns = [];
  for (let c2 = 0; c2 < shape.columns; c2 += 1) {
    if (shape.isSelectable(row, c2)) columns.push(c2);
  }
  return columns;
}
function rowsWithSelectable(shape) {
  const rows = [];
  for (let r2 = 0; r2 < shape.rows; r2 += 1) {
    if (selectableColumnsInRow(shape, r2).length > 0) rows.push(r2);
  }
  return rows;
}
function initialScanPhase(shape) {
  const rows = rowsWithSelectable(shape);
  return { kind: "row", row: rows[0] ?? 0 };
}
function advanceScan(phase, shape) {
  if (phase.kind === "row") {
    const rows = rowsWithSelectable(shape);
    if (rows.length === 0) return phase;
    const index2 = rows.indexOf(phase.row);
    const next2 = (index2 + 1 + rows.length) % rows.length;
    return { kind: "row", row: rows[next2] };
  }
  const columns = selectableColumnsInRow(shape, phase.row);
  const sequence = [...columns, "back"];
  const index = phase.column === "back" ? columns.length : columns.indexOf(phase.column);
  const next = (index + 1) % sequence.length;
  return { kind: "cell", row: phase.row, column: sequence[next] };
}
function selectScan(phase, shape) {
  if (phase.kind === "row") {
    const columns = selectableColumnsInRow(shape, phase.row);
    return { kind: "enteredRow", phase: { kind: "cell", row: phase.row, column: columns[0] ?? "back" } };
  }
  if (phase.column === "back") {
    return { kind: "backToRows", phase: initialScanPhase(shape) };
  }
  return { kind: "activate", row: phase.row, column: phase.column };
}
const DELTAS = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1]
};
function moveFocus(from, direction, shape) {
  const [dRow, dCol] = DELTAS[direction];
  let row = from.row;
  let column = from.column;
  for (; ; ) {
    row += dRow;
    column += dCol;
    if (row < 0 || row >= shape.rows || column < 0 || column >= shape.columns) {
      return from;
    }
    if (shape.isSelectable(row, column)) return { row, column };
  }
}
const ARROW_DIRECTIONS = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
};
function Grid({ board: board2, onPress, auxiliaryControls = [] }) {
  const wordStage = wordStageSetting.signal.value;
  const itemsById = new Map(board2.buttons.map((button) => [button.id, button]));
  const auxRow = board2.grid.rows;
  const hasAux = auxiliaryControls.length > 0;
  function isSelectable(row, column) {
    if (hasAux && row === auxRow) return column < auxiliaryControls.length;
    const cellId = board2.grid.order[row]?.[column];
    const item = cellId ? itemsById.get(cellId) : void 0;
    return Boolean(item) && isItemShown(item, wordStage);
  }
  function firstSelectableCell() {
    for (let r2 = 0; r2 < board2.grid.rows; r2 += 1) {
      for (let c2 = 0; c2 < board2.grid.columns; c2 += 1) {
        if (isSelectable(r2, c2)) return { row: r2, column: c2 };
      }
    }
    return { row: 0, column: 0 };
  }
  const shape = {
    rows: board2.grid.rows + (hasAux ? 1 : 0),
    columns: Math.max(board2.grid.columns, auxiliaryControls.length),
    isSelectable
  };
  const access = useSignal(DEFAULT_ACCESS_SETTINGS);
  const scanPhase = useSignal(null);
  const focusCell = useSignal(firstSelectableCell());
  const lastActivated = A(/* @__PURE__ */ new Map());
  const accessVersion = accessSettingsVersion.value;
  h$2(() => {
    void getAccessSettings().then((settings) => access.value = settings);
  }, [accessVersion]);
  function wrappedPress(item) {
    if (access.value.repeatSuppressMs > 0) {
      const now = Date.now();
      const last = lastActivated.current.get(item.id) ?? 0;
      if (now - last < access.value.repeatSuppressMs) return;
      lastActivated.current.set(item.id, now);
    }
    onPress(item);
  }
  function activateCell(row, column) {
    if (hasAux && row === auxRow) {
      auxiliaryControls[column]?.onActivate();
      return;
    }
    const cellId = board2.grid.order[row]?.[column];
    const item = cellId ? itemsById.get(cellId) : void 0;
    if (item && isItemShown(item, wordStage)) wrappedPress(item);
  }
  h$2(() => {
    if (access.value.scanningMode === "off") {
      scanPhase.value = null;
      return;
    }
    scanPhase.value = initialScanPhase(shape);
    gridScanningActive.count += 1;
    function handleSelect() {
      if (!scanPhase.value) return;
      const result = selectScan(scanPhase.value, shape);
      if (result.kind === "activate") {
        activateCell(result.row, result.column);
        scanPhase.value = initialScanPhase(shape);
      } else {
        scanPhase.value = result.phase;
      }
    }
    function handleKeyDown(event) {
      if (!scanPhase.value) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (access.value.scanningMode === "oneSwitchTimed") {
          handleSelect();
        } else {
          scanPhase.value = advanceScan(scanPhase.value, shape);
        }
      } else if (event.code === "Enter" && access.value.scanningMode === "twoSwitchStepped") {
        event.preventDefault();
        handleSelect();
      }
    }
    document.addEventListener("keydown", handleKeyDown, true);
    let interval;
    if (access.value.scanningMode === "oneSwitchTimed") {
      interval = window.setInterval(() => {
        if (scanPhase.value) scanPhase.value = advanceScan(scanPhase.value, shape);
      }, access.value.scanIntervalMs);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      if (interval !== void 0) clearInterval(interval);
      gridScanningActive.count -= 1;
    };
  }, [access.value.scanningMode, access.value.scanIntervalMs, board2]);
  h$2(() => {
    if (access.value.scanningMode !== "off") return;
    if (!isSelectable(focusCell.value.row, focusCell.value.column)) {
      focusCell.value = firstSelectableCell();
    }
  }, [access.value.scanningMode, board2]);
  h$2(() => {
    if (access.value.scanningMode !== "off") return;
    const cellId = board2.grid.order[focusCell.value.row]?.[focusCell.value.column];
    if (cellId) document.getElementById(`board-button-${cellId}`)?.focus();
  }, [focusCell.value, access.value.scanningMode, board2]);
  function handleGridKeyDown(event) {
    if (access.value.scanningMode !== "off") return;
    const direction = ARROW_DIRECTIONS[event.key];
    if (!direction) return;
    event.preventDefault();
    focusCell.value = moveFocus(focusCell.value, direction, shape);
  }
  function scanHighlightFor(row, column) {
    const phase = scanPhase.value;
    if (!phase) return null;
    if (phase.kind === "row") return phase.row === row ? "row" : null;
    return phase.row === row && phase.column === column ? "cell" : null;
  }
  function scanStatusText() {
    const phase = scanPhase.value;
    if (!phase) return "";
    if (phase.kind === "row") {
      return phase.row === auxRow ? "Scanning: more controls" : `Scanning row ${phase.row + 1}`;
    }
    if (phase.column === "back") return "Back to rows";
    if (phase.row === auxRow) {
      return `Scanning: ${auxiliaryControls[phase.column]?.label ?? ""}`;
    }
    const cellId = board2.grid.order[phase.row]?.[phase.column];
    const item = cellId ? itemsById.get(cellId) : void 0;
    return item ? `Scanning: ${item.label}` : "";
  }
  return /* @__PURE__ */ u$1("div", { class: "board-grid-wrapper", children: [
    access.value.scanningMode !== "off" && /* @__PURE__ */ u$1("p", { class: "board-grid__scan-status", role: "status", "aria-live": "polite", children: scanStatusText() }),
    /* @__PURE__ */ u$1(
      "div",
      {
        class: "board-grid",
        style: {
          gridTemplateRows: `repeat(${board2.grid.rows}, minmax(min-content, 1fr))`,
          gridTemplateColumns: `repeat(${board2.grid.columns}, 1fr)`
        },
        onKeyDown: handleGridKeyDown,
        children: board2.grid.order.map(
          (row, rowIndex) => row.map((cellId, columnIndex) => {
            const found = cellId ? itemsById.get(cellId) : void 0;
            const item = found && isItemShown(found, wordStage) ? found : void 0;
            const key = `${rowIndex}-${columnIndex}`;
            if (!item) return /* @__PURE__ */ u$1("div", { class: "board-grid__empty" }, key);
            return /* @__PURE__ */ u$1(
              BoardButton,
              {
                item,
                onPress: wrappedPress,
                dwellMs: access.value.dwellMs,
                lowArousal: access.value.lowArousalPalette,
                scanHighlight: scanHighlightFor(rowIndex, columnIndex),
                tabIndex: access.value.scanningMode !== "off" ? -1 : rowIndex === focusCell.value.row && columnIndex === focusCell.value.column ? 0 : -1
              },
              key
            );
          })
        )
      }
    )
  ] });
}
function SentenceStrip({ chips, onRemove, onClear, onSpeak, speakingChipId = null }) {
  const showPictures = sentencePicturesSetting.signal.value;
  return /* @__PURE__ */ u$1("div", { class: "sentence-strip", children: [
    /* @__PURE__ */ u$1("div", { class: "sentence-strip__chips", children: chips.map((chip) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: `sentence-strip__chip${chip.chipId === speakingChipId ? " sentence-strip__chip--speaking" : ""}`,
        onClick: () => onRemove(chip.chipId),
        "aria-label": `Remove "${chip.item.label}"`,
        children: [
          showPictures && chip.item.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "sentence-strip__picture", char: chip.item.image.char }),
          showPictures && chip.item.image?.kind === "photo" && /* @__PURE__ */ u$1(PhotoThumbnail, { class: "sentence-strip__photo", blobId: chip.item.image.blobId, alt: "" }),
          chip.item.label
        ]
      },
      chip.chipId
    )) }),
    /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "sentence-strip__clear",
        onClick: onClear,
        disabled: chips.length === 0,
        "aria-label": "Clear all",
        children: "Clear all"
      }
    ),
    /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "sentence-strip__speak",
        onClick: onSpeak,
        disabled: chips.length === 0,
        children: "Speak"
      }
    )
  ] });
}
function TalkScreen({ onExit }) {
  const speakingChipId = useSignal(null);
  const rootBoardId = useSignal(ROOT_BOARD_ID);
  const boardStack = useSignal([ROOT_BOARD_ID]);
  const currentBoard = useSignal(null);
  const sentence = useSignal([]);
  const seeded = useSignal(false);
  const exiting = useSignal(false);
  h$2(() => {
    void ensureSeeded().then(() => Promise.all([getActiveProfile(), getSessionState()])).then(([profile, session]) => {
      rootBoardId.value = profile.rootBoardId;
      if (session) {
        boardStack.value = session.boardStack;
        sentence.value = session.sentence.map((item) => ({ chipId: crypto.randomUUID(), item }));
      } else {
        boardStack.value = [profile.rootBoardId];
      }
      seeded.value = true;
    });
  }, []);
  h$2(() => {
    if (!seeded.value) return;
    const boardId = boardStack.value[boardStack.value.length - 1] ?? ROOT_BOARD_ID;
    void getBoard(boardId).then((board2) => {
      currentBoard.value = board2 ?? null;
    });
  }, [seeded.value, boardStack.value]);
  h$2(() => {
    if (!seeded.value || exiting.value) return;
    void setSessionState({ boardStack: boardStack.value, sentence: sentence.value.map((chip) => chip.item) });
  }, [seeded.value, boardStack.value, sentence.value, exiting.value]);
  function handlePress(item) {
    if (item.load_board) {
      boardStack.value = [...boardStack.value, item.load_board.id];
      return;
    }
    void recordPress(item.label);
    const mode = pressMode.value;
    if (mode !== "speak") {
      sentence.value = [...sentence.value, { chipId: crypto.randomUUID(), item }];
    }
    if (mode !== "sentence") void announceItem(item);
  }
  function handleBack() {
    if (boardStack.value.length > 1) {
      boardStack.value = boardStack.value.slice(0, -1);
    } else {
      exiting.value = true;
      void setSessionState(null);
      onExit();
    }
  }
  function handleHome() {
    exiting.value = true;
    void setSessionState(null);
    boardStack.value = [rootBoardId.value];
    onExit();
  }
  function handleRemoveChip(chipId) {
    sentence.value = sentence.value.filter((chip) => chip.chipId !== chipId);
  }
  function handleClearSentence() {
    sentence.value = [];
  }
  function handleSpeak() {
    const words = sentence.value.map((chip) => chip.item.vocalization ?? chip.item.label);
    if (words.length === 0) return;
    const chipIds = sentence.value.map((chip) => chip.chipId);
    announceSentence(words, (index) => speakingChipId.value = index === null ? null : chipIds[index] ?? null);
    if (clearAfterSpeakSetting.signal.value) sentence.value = [];
  }
  return /* @__PURE__ */ u$1("div", { class: "talk-screen", children: [
    /* @__PURE__ */ u$1(
      SentenceStrip,
      {
        chips: sentence.value,
        onRemove: handleRemoveChip,
        onClear: handleClearSentence,
        onSpeak: handleSpeak,
        speakingChipId: speakingChipId.value
      }
    ),
    /* @__PURE__ */ u$1("div", { class: "talk-screen__grid", children: currentBoard.value ? /* @__PURE__ */ u$1(
      Grid,
      {
        board: currentBoard.value,
        onPress: handlePress,
        auxiliaryControls: [
          { label: "Clear all", onActivate: handleClearSentence },
          { label: "Speak", onActivate: handleSpeak }
        ]
      }
    ) : /* @__PURE__ */ u$1("p", { class: "talk-screen__loading", children: "Loading…" }) }),
    /* @__PURE__ */ u$1("nav", { class: "talk-screen__nav", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "talk-screen__nav-button", onClick: handleHome, children: "Home" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "talk-screen__nav-button", onClick: handleBack, children: "Back" })
    ] })
  ] });
}
function MyPagesScreen({ onExit }) {
  const pages = useSignal([]);
  const loaded = useSignal(false);
  const selectedPageId = useSignal(null);
  const board2 = useSignal(null);
  const sentence = useSignal([]);
  const speakingChipId = useSignal(null);
  h$2(() => {
    void getMyPages().then((loadedPages) => {
      pages.value = loadedPages;
      if (loadedPages.length === 1) selectedPageId.value = loadedPages[0].id;
      loaded.value = true;
    });
  }, []);
  h$2(() => {
    const page = pages.value.find((candidate) => candidate.id === selectedPageId.value);
    if (!page) {
      board2.value = null;
      return;
    }
    void getBoard(page.boardId).then((loadedBoard) => board2.value = loadedBoard ?? null);
  }, [selectedPageId.value]);
  function handlePress(item) {
    void recordPress(item.label);
    const mode = pressMode.value;
    if (mode !== "speak") {
      sentence.value = [...sentence.value, { chipId: crypto.randomUUID(), item }];
    }
    if (mode !== "sentence") void announceItem(item);
  }
  function handleRemoveChip(chipId) {
    sentence.value = sentence.value.filter((chip) => chip.chipId !== chipId);
  }
  function handleClearSentence() {
    sentence.value = [];
  }
  function handleSpeak() {
    const words = sentence.value.map((chip) => chip.item.vocalization ?? chip.item.label);
    if (words.length === 0) return;
    const chipIds = sentence.value.map((chip) => chip.chipId);
    announceSentence(words, (index) => speakingChipId.value = index === null ? null : chipIds[index] ?? null);
    if (clearAfterSpeakSetting.signal.value) sentence.value = [];
  }
  function handleBack() {
    if (pages.value.length > 1 && selectedPageId.value) {
      selectedPageId.value = null;
      sentence.value = [];
      return;
    }
    onExit();
  }
  if (!loaded.value) {
    return /* @__PURE__ */ u$1("p", { class: "talk-screen__loading", children: "Loading…" });
  }
  if (pages.value.length === 0) {
    return /* @__PURE__ */ u$1("div", { class: "my-pages-screen my-pages-screen--empty", children: [
      /* @__PURE__ */ u$1("p", { class: "my-pages-screen__empty-title", children: "No pages yet" }),
      /* @__PURE__ */ u$1("p", { class: "my-pages-screen__empty-note", children: "An adult can add one in Parent Mode." }),
      /* @__PURE__ */ u$1("nav", { class: "talk-screen__nav", children: /* @__PURE__ */ u$1("button", { type: "button", class: "talk-screen__nav-button", onClick: onExit, children: "Home" }) })
    ] });
  }
  if (!selectedPageId.value) {
    return /* @__PURE__ */ u$1("div", { class: "my-pages-screen", children: [
      /* @__PURE__ */ u$1("div", { class: "my-pages-screen__picker", children: pages.value.map((page) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "my-pages-screen__picker-button",
          onClick: () => selectedPageId.value = page.id,
          children: page.name
        },
        page.id
      )) }),
      /* @__PURE__ */ u$1("nav", { class: "talk-screen__nav", children: /* @__PURE__ */ u$1("button", { type: "button", class: "talk-screen__nav-button", onClick: onExit, children: "Home" }) })
    ] });
  }
  return /* @__PURE__ */ u$1("div", { class: "talk-screen", children: [
    /* @__PURE__ */ u$1(
      SentenceStrip,
      {
        chips: sentence.value,
        onRemove: handleRemoveChip,
        onClear: handleClearSentence,
        onSpeak: handleSpeak,
        speakingChipId: speakingChipId.value
      }
    ),
    /* @__PURE__ */ u$1("div", { class: "talk-screen__grid", children: board2.value ? /* @__PURE__ */ u$1(
      Grid,
      {
        board: board2.value,
        onPress: handlePress,
        auxiliaryControls: [
          { label: "Clear all", onActivate: handleClearSentence },
          { label: "Speak", onActivate: handleSpeak }
        ]
      }
    ) : /* @__PURE__ */ u$1("p", { class: "talk-screen__loading", children: "Loading…" }) }),
    /* @__PURE__ */ u$1("nav", { class: "talk-screen__nav", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "talk-screen__nav-button", onClick: onExit, children: "Home" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "talk-screen__nav-button", onClick: handleBack, children: "Back" })
    ] })
  ] });
}
function modeName() {
  return "Parent Mode";
}
const SCHOOL_MODE_NAME = "School Mode";
function FirstThenScreen() {
  const { first, then, firstDone } = firstThenSetting.signal.value;
  if (!first.label.trim() || !then.label.trim()) {
    return /* @__PURE__ */ u$1("div", { class: "first-then-screen first-then-screen--empty", children: [
      /* @__PURE__ */ u$1("p", { class: "first-then-screen__empty-title", children: "Nothing here yet" }),
      /* @__PURE__ */ u$1("p", { class: "first-then-screen__empty-note", children: [
        "An adult can set up First and Then in ",
        modeName(),
        " (My Day)."
      ] })
    ] });
  }
  function finishFirst() {
    void firstThenSetting.set({ first, then, firstDone: true });
    announceText(`All done. Now ${then.label}`);
  }
  function startAgain() {
    void firstThenSetting.set({ first, then, firstDone: false });
  }
  function card(kind, data, state) {
    return /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: `first-then-card first-then-card--${kind} first-then-card--${state}`,
        onClick: () => announceText(kind === "first" ? `First, ${data.label}` : `Then, ${data.label}`),
        "aria-label": `${kind === "first" ? "First" : "Then"}: ${data.label}${state === "done" ? ", finished" : ""}`,
        children: [
          /* @__PURE__ */ u$1("span", { class: "first-then-card__heading", children: kind === "first" ? "First" : "Then" }),
          data.photoBlobId ? /* @__PURE__ */ u$1(PhotoThumbnail, { class: "first-then-card__photo", blobId: data.photoBlobId, alt: "" }) : data.emoji && /* @__PURE__ */ u$1("span", { class: "first-then-card__emoji", "aria-hidden": "true", children: data.emoji }),
          /* @__PURE__ */ u$1("span", { class: "first-then-card__label", children: data.label }),
          state === "done" && /* @__PURE__ */ u$1("span", { class: "first-then-card__tick", "aria-hidden": "true", children: "✓ Done" })
        ]
      }
    );
  }
  return /* @__PURE__ */ u$1("div", { class: "first-then-screen", children: [
    /* @__PURE__ */ u$1("div", { class: "first-then-screen__cards", children: [
      card("first", first, firstDone ? "done" : "now"),
      card("then", then, firstDone ? "now" : "later")
    ] }),
    /* @__PURE__ */ u$1("div", { class: "first-then-screen__actions", children: firstDone ? /* @__PURE__ */ u$1("button", { type: "button", class: "first-then-screen__button", onClick: startAgain, children: "Start again" }) : /* @__PURE__ */ u$1("button", { type: "button", class: "first-then-screen__button", onClick: finishFirst, children: "First is finished" }) })
  ] });
}
function DrawScreen() {
  const canvasRef = A(null);
  const colour = useSignal(DRAWING_COLOURS[0].value);
  const brush = useSignal(BRUSH_SIZES[1].width);
  const showKept = useSignal(false);
  const openKept = useSignal(null);
  const message = useSignal("");
  const last = A(null);
  const history = A([]);
  const undoCount = useSignal(0);
  function context2() {
    return canvasRef.current?.getContext("2d") ?? null;
  }
  function clearToWhite(ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
  function rememberForUndo() {
    const ctx = context2();
    if (!ctx) return;
    history.current.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
    if (history.current.length > UNDO_LIMIT) history.current.shift();
    undoCount.value = history.current.length;
  }
  h$2(() => {
    const ctx = context2();
    if (ctx) clearToWhite(ctx);
  }, []);
  function position(event) {
    const box = canvasRef.current.getBoundingClientRect();
    return {
      x: (event.clientX - box.left) / box.width * CANVAS_WIDTH,
      y: (event.clientY - box.top) / box.height * CANVAS_HEIGHT
    };
  }
  function strokeTo(point) {
    const ctx = context2();
    const from = last.current;
    if (!ctx || !from) return;
    ctx.strokeStyle = colour.value;
    ctx.lineWidth = brush.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(point.x + 0.01, point.y);
    ctx.stroke();
    last.current = point;
  }
  function down(event) {
    if (!context2()) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    rememberForUndo();
    message.value = "";
    last.current = position(event);
    strokeTo(last.current);
  }
  function move(event) {
    if (!last.current) return;
    event.preventDefault();
    strokeTo(position(event));
  }
  function up() {
    last.current = null;
  }
  function undo() {
    const ctx = context2();
    const previous = history.current.pop();
    if (ctx && previous) ctx.putImageData(previous, 0, 0);
    undoCount.value = history.current.length;
    message.value = "";
  }
  function startAgain() {
    const ctx = context2();
    if (!ctx) return;
    rememberForUndo();
    clearToWhite(ctx);
    openKept.value = null;
    message.value = "";
  }
  async function keep() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const kept2 = drawingsSetting.signal.value;
    if (kept2.length >= MAX_KEPT_DRAWINGS) {
      message.value = "There is no room for another picture. Open one in My pictures and throw it away first.";
      return;
    }
    await drawingsSetting.set([...kept2, canvas.toDataURL("image/png")]);
    openKept.value = kept2.length;
    message.value = "Kept.";
  }
  function open(index) {
    const ctx = context2();
    const url = drawingsSetting.signal.value[index];
    if (!ctx || !url) return;
    const image = new Image();
    image.onload = () => {
      rememberForUndo();
      clearToWhite(ctx);
      ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };
    image.src = url;
    openKept.value = index;
    showKept.value = false;
    message.value = "";
  }
  async function throwAway() {
    const index = openKept.value;
    if (index === null) return;
    await drawingsSetting.set(drawingsSetting.signal.value.filter((_2, i2) => i2 !== index));
    openKept.value = null;
    message.value = "Thrown away.";
  }
  const kept = drawingsSetting.signal.value;
  return /* @__PURE__ */ u$1("div", { class: "draw-screen", children: [
    showKept.value && /* @__PURE__ */ u$1("div", { class: "draw-screen__kept", children: [
      /* @__PURE__ */ u$1("h1", { class: "draw-screen__title", children: "My pictures" }),
      kept.length === 0 ? /* @__PURE__ */ u$1("p", { class: "draw-screen__empty", children: "No pictures kept yet." }) : /* @__PURE__ */ u$1("div", { class: "draw-screen__thumbs", children: kept.map((url, index) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "draw-screen__thumb",
          "aria-label": `Open picture ${index + 1}`,
          onClick: () => open(index),
          children: /* @__PURE__ */ u$1("img", { src: url, alt: "" })
        },
        index
      )) }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "draw-screen__button", onClick: () => showKept.value = false, children: "Back to drawing" })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "draw-screen__work", hidden: showKept.value, children: [
      /* @__PURE__ */ u$1(
        "canvas",
        {
          ref: canvasRef,
          class: "draw-screen__canvas",
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          "aria-label": "Drawing page",
          onPointerDown: down,
          onPointerMove: move,
          onPointerUp: up,
          onPointerCancel: up,
          onPointerLeave: up
        }
      ),
      /* @__PURE__ */ u$1("div", { class: "draw-screen__tools", children: [
        /* @__PURE__ */ u$1("div", { class: "draw-screen__colours", role: "group", "aria-label": "Colours", children: DRAWING_COLOURS.map((entry) => /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: `draw-screen__colour${colour.value === entry.value ? " draw-screen__colour--chosen" : ""}`,
            style: { background: entry.value },
            "aria-label": entry.name,
            "aria-pressed": colour.value === entry.value,
            onClick: () => colour.value = entry.value
          },
          entry.value
        )) }),
        /* @__PURE__ */ u$1("div", { class: "draw-screen__sizes", role: "group", "aria-label": "Brush size", children: BRUSH_SIZES.map((size) => /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: `draw-screen__size${brush.value === size.width ? " draw-screen__size--chosen" : ""}`,
            "aria-label": size.name,
            "aria-pressed": brush.value === size.width,
            onClick: () => brush.value = size.width,
            children: /* @__PURE__ */ u$1("span", { class: "draw-screen__dot", style: { width: `${size.width}px`, height: `${size.width}px` } })
          },
          size.name
        )) }),
        /* @__PURE__ */ u$1("div", { class: "draw-screen__actions", children: [
          /* @__PURE__ */ u$1("button", { type: "button", class: "draw-screen__button", onClick: undo, disabled: undoCount.value === 0, children: "Undo" }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "draw-screen__button", onClick: startAgain, children: "Start again" }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "draw-screen__button", onClick: () => void keep(), children: "Keep" }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "draw-screen__button", onClick: () => showKept.value = true, children: "My pictures" }),
          openKept.value !== null && /* @__PURE__ */ u$1("button", { type: "button", class: "draw-screen__button", onClick: () => void throwAway(), children: "Throw this one away" })
        ] })
      ] }),
      /* @__PURE__ */ u$1("p", { class: "draw-screen__message", role: "status", children: message.value })
    ] })
  ] });
}
const LEVELS = [
  { id: "two", label: "Two words", example: "want ball" },
  { id: "three", label: "Three words", example: "I want ball" },
  { id: "four", label: "Four words", example: "I want big ball" }
];
const LENGTHS = [
  { hills: 3, label: "Short ride" },
  { hills: 5, label: "Long ride" }
];
const VERBS = ["want", "like", "see"];
const DESCRIBERS = ["big", "little", "red", "blue", "green"];
const STEPS = {
  two: ["verb", "thing"],
  three: ["start", "verb", "thing"],
  four: ["start", "verb", "describer", "thing"]
};
function shuffled$1(values, random) {
  const copy = [...values];
  for (let i2 = copy.length - 1; i2 > 0; i2 -= 1) {
    const j2 = Math.floor(random() * (i2 + 1));
    [copy[i2], copy[j2]] = [copy[j2], copy[i2]];
  }
  return copy;
}
function rideThings(words) {
  const skip = /* @__PURE__ */ new Set(["i", "you", "my", "me", ...VERBS, ...DESCRIBERS]);
  return words.filter((word2) => {
    const label = word2.label.trim();
    return /^[^\s]+$/.test(label) && !skip.has(label.toLowerCase());
  });
}
function makeRide(words, hills = 5, random = Math.random) {
  const things = rideThings(words);
  if (things.length < hills + 3) return void 0;
  const targets = shuffled$1(things, random).slice(0, hills);
  return targets.map((target) => ({
    target,
    options: shuffled$1([target, ...shuffled$1(things.filter((thing) => thing.id !== target.id), random).slice(0, 3)], random),
    describers: shuffled$1([...DESCRIBERS], random).slice(0, 3)
  }));
}
function progress(hillIndex, stepsDone, stepsPerHill, hills) {
  return Math.min(1, (hillIndex * stepsPerHill + stepsDone) / (hills * stepsPerHill));
}
const HINT_AFTER = 2;
function sentenceFor(level, parts) {
  const order = level === "two" ? [parts.verb, parts.thing] : level === "three" ? [parts.started ? "I" : null, parts.verb, parts.thing] : [parts.started ? "I" : null, parts.verb, parts.describer, parts.thing];
  return order.filter(Boolean).join(" ");
}
const OPTIONS_PER_ROUND = 4;
function gameWords(boards, activeStage) {
  const seen2 = /* @__PURE__ */ new Set();
  const words = [];
  for (const board2 of boards) {
    for (const item of board2.buttons) {
      const key = item.label.trim().toLowerCase();
      if (!key || item.load_board || !item.image || item.image.kind === "symbol") continue;
      if (!isItemShown(item, activeStage) || seen2.has(key)) continue;
      seen2.add(key);
      words.push(item);
    }
  }
  return words;
}
function shuffled(values, random) {
  const copy = [...values];
  for (let i2 = copy.length - 1; i2 > 0; i2 -= 1) {
    const j2 = Math.floor(random() * (i2 + 1));
    [copy[i2], copy[j2]] = [copy[j2], copy[i2]];
  }
  return copy;
}
function makeRound(words, previousId, random = Math.random) {
  if (words.length < OPTIONS_PER_ROUND) return void 0;
  const candidates = words.filter((word2) => word2.id !== previousId);
  const target = candidates[Math.floor(random() * candidates.length)];
  const others = shuffled(
    words.filter((word2) => word2.id !== target.id),
    random
  ).slice(0, OPTIONS_PER_ROUND - 1);
  return { target, options: shuffled([target, ...others], random) };
}
function GameScreen({ fixedWords } = {}) {
  const words = useSignal(null);
  const round = useSignal(void 0);
  const tried = useSignal([]);
  const found = useSignal(false);
  const foundCount = useSignal(0);
  const picturesOnWords = useSignal(false);
  h$2(() => {
    if (fixedWords) {
      words.value = fixedWords;
      round.value = makeRound(fixedWords);
      return;
    }
    void getAllBoards().then((boards) => {
      const available = gameWords(boards, wordStageSetting.signal.value);
      words.value = available;
      round.value = makeRound(available);
    });
  }, []);
  if (words.value === null) return null;
  const current = round.value;
  if (!current) {
    return /* @__PURE__ */ u$1("div", { class: "game-screen game-screen--empty", children: [
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-title", children: "Not enough words yet" }),
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-note", children: "The game needs at least four words with pictures." })
    ] });
  }
  function say(text) {
    announceText(text, { keepInHistory: false });
  }
  function choose(option) {
    say(option.label);
    if (found.value) return;
    if (option.id === current.target.id) {
      found.value = true;
      foundCount.value += 1;
    } else if (!tried.value.includes(option.id)) {
      tried.value = [...tried.value, option.id];
    }
  }
  function nextPicture() {
    round.value = makeRound(words.value, current.target.id);
    tried.value = [];
    found.value = false;
  }
  const image = current.target.image;
  const message = found.value ? `Yes! That is ${current.target.label}.` : tried.value.length >= HINT_AFTER ? "Look at the word with the pointer." : tried.value.length > 0 ? "Not that one. Try another." : "Which word is this?";
  return /* @__PURE__ */ u$1("div", { class: "game-screen", children: [
    /* @__PURE__ */ u$1("div", { class: "game-screen__picture", role: "img", "aria-label": found.value ? current.target.label : "A picture to find the word for", children: image?.kind === "photo" ? /* @__PURE__ */ u$1(PhotoThumbnail, { class: "game-screen__photo", blobId: image.blobId, alt: "" }) : /* @__PURE__ */ u$1(Pic, { class: "game-screen__emoji", char: image?.kind === "emoji" ? image.char : "" }) }),
    /* @__PURE__ */ u$1("p", { class: "game-screen__message", role: "status", children: message }),
    /* @__PURE__ */ u$1("div", { class: "game-screen__options", children: current.options.map((option) => {
      const isRight = found.value && option.id === current.target.id;
      const wasTried = tried.value.includes(option.id);
      const pointed = !found.value && tried.value.length >= HINT_AFTER && option.id === current.target.id;
      return /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `game-option${isRight ? " game-option--right" : ""}${wasTried ? " game-option--tried" : ""}${pointed ? " game-option--hint" : ""}`,
          style: option.background_color ? { background: option.background_color } : void 0,
          onClick: () => choose(option),
          "aria-label": wasTried ? `${option.label}, tried` : option.label,
          children: [
            picturesOnWords.value && option.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "game-option__emoji", char: option.image.char }),
            pointed && /* @__PURE__ */ u$1("span", { class: "ride-screen__pointer", "aria-hidden": "true", children: "👉" }),
            /* @__PURE__ */ u$1("span", { class: "game-option__label", children: option.label })
          ]
        },
        option.id
      );
    }) }),
    /* @__PURE__ */ u$1("div", { class: "game-screen__controls", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: () => say(current.target.label), children: "Hear the word" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "game-screen__button",
          "aria-pressed": picturesOnWords.value,
          onClick: () => picturesOnWords.value = !picturesOnWords.value,
          children: picturesOnWords.value ? "Words only" : "Pictures on the words"
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button game-screen__button--next", onClick: nextPicture, children: "Next picture" })
    ] }),
    /* @__PURE__ */ u$1("p", { class: "game-screen__count", children: foundCount.value === 0 ? "No pressure. Take your time." : `Found ${foundCount.value}` })
  ] });
}
function JokesScreen() {
  const all = () => [...BASIC_JOKES, ...customJokesSetting.signal.value];
  const first = nextJokeIndex(all().length, []);
  const told = useSignal([first]);
  const current = useSignal(all()[first]);
  const silly = useSignal(false);
  const showAnswer = useSignal(false);
  function next() {
    const jokes = all();
    const index = nextJokeIndex(jokes.length, told.value);
    told.value = [...told.value, index];
    current.value = jokes[index];
    silly.value = false;
    showAnswer.value = false;
  }
  function makeSilly() {
    const mixed = sillyMix(all());
    if (!mixed) return;
    current.value = mixed;
    silly.value = true;
    showAnswer.value = false;
  }
  const say = (text) => announceText(text, { keepInHistory: false });
  return /* @__PURE__ */ u$1("div", { class: "game-screen jokes-screen", children: [
    /* @__PURE__ */ u$1("p", { class: "jokes-screen__label", children: silly.value ? "A silly one" : "Joke" }),
    /* @__PURE__ */ u$1("div", { class: "jokes-screen__card", children: [
      /* @__PURE__ */ u$1("p", { class: "jokes-screen__question", children: current.value.q }),
      showAnswer.value ? /* @__PURE__ */ u$1("p", { class: "jokes-screen__answer", children: current.value.a }) : /* @__PURE__ */ u$1("p", { class: "jokes-screen__answer jokes-screen__answer--hidden", "aria-hidden": "true", children: "…" })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "jokes-screen__controls", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: () => say(current.value.q), children: "Say the question" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: () => showAnswer.value = true, disabled: showAnswer.value, children: "Show the answer" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: () => say(current.value.a), disabled: !showAnswer.value, children: "Say the answer" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button game-screen__button--next", onClick: next, children: "Next joke" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: makeSilly, children: "Make a silly one" })
    ] })
  ] });
}
function deviceNoun() {
  return window.myWords?.platform ? "device" : "computer";
}
function MusicScreen() {
  const audioRef = A(null);
  const urlRef = A(null);
  const playing = useSignal(null);
  const paused = useSignal(false);
  const problem = useSignal("");
  const queue = A([]);
  const listId = useSignal("all");
  const allSongs = songsSetting.signal.value;
  const playlists = playlistsSetting.signal.value;
  const chosenList = playlists.find((list) => list.id === listId.value);
  const songs = chosenList ? songsInPlaylist(chosenList, allSongs) : allSongs;
  function release() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
  }
  h$2(() => release, []);
  h$2(() => {
    if (audioRef.current) audioRef.current.volume = musicVolumeSetting.signal.value;
  }, [musicVolumeSetting.signal.value]);
  async function play(song) {
    release();
    problem.value = "";
    const blob = await getVoiceClip(song.blobId);
    if (!blob) {
      problem.value = "That song could not be found.";
      playing.value = null;
      return;
    }
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    const audio = new Audio(url);
    audio.volume = musicVolumeSetting.signal.value;
    audio.addEventListener("ended", () => {
      const next = queue.current.shift();
      if (next) {
        void play(next);
        return;
      }
      playing.value = null;
      paused.value = false;
    });
    audio.addEventListener("error", () => {
      problem.value = `That song will not play on this ${deviceNoun()}.`;
      playing.value = null;
    });
    audioRef.current = audio;
    playing.value = song;
    paused.value = false;
    void audio.play().catch(() => {
      problem.value = `That song will not play on this ${deviceNoun()}.`;
      playing.value = null;
    });
  }
  function togglePause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      paused.value = false;
    } else {
      audio.pause();
      paused.value = true;
    }
  }
  function playOne(song) {
    queue.current = [];
    void play(song);
  }
  function playAll() {
    const [first, ...rest] = songs;
    if (!first) return;
    queue.current = rest;
    void play(first);
  }
  function stop() {
    queue.current = [];
    release();
    playing.value = null;
    paused.value = false;
  }
  if (allSongs.length === 0) {
    return /* @__PURE__ */ u$1("div", { class: "game-screen game-screen--empty", children: [
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-title", children: "No songs yet" }),
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-note", children: "An adult can add songs in Parent Mode (Music)." })
    ] });
  }
  return /* @__PURE__ */ u$1("div", { class: "music-screen", children: [
    playlists.length > 0 && /* @__PURE__ */ u$1("div", { class: "music-screen__lists", role: "group", "aria-label": "Playlists", children: [
      [{ id: "all", name: "Everything", emoji: "🎵" }, ...playlists].map((list) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `music-screen__list${listId.value === list.id ? " music-screen__list--chosen" : ""}`,
          "aria-pressed": listId.value === list.id,
          onClick: () => listId.value = list.id,
          children: [
            /* @__PURE__ */ u$1("span", { "aria-hidden": "true", children: list.emoji || "🎵" }),
            " ",
            list.name
          ]
        },
        list.id
      )),
      /* @__PURE__ */ u$1("button", { type: "button", class: "music-screen__list music-screen__play-all", disabled: songs.length === 0, onClick: playAll, children: "Play all" })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "music-screen__songs", children: [
      songs.length === 0 && /* @__PURE__ */ u$1("p", { class: "music-screen__none", children: "No songs in this playlist yet." }),
      songs.map((song) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `music-screen__song${playing.value?.id === song.id ? " music-screen__song--playing" : ""}`,
          "aria-pressed": playing.value?.id === song.id,
          onClick: () => playOne(song),
          children: [
            /* @__PURE__ */ u$1("span", { class: "music-screen__emoji", "aria-hidden": "true", children: song.emoji || "🎵" }),
            /* @__PURE__ */ u$1("span", { class: "music-screen__title", children: song.title })
          ]
        },
        song.id
      ))
    ] }),
    /* @__PURE__ */ u$1("div", { class: "music-screen__bar", children: [
      /* @__PURE__ */ u$1("p", { class: "music-screen__now", role: "status", children: problem.value || (playing.value ? `${paused.value ? "Paused" : "Playing"}: ${playing.value.title}` : "Press a song to play it.") }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: togglePause, disabled: !playing.value, children: paused.value ? "Carry on" : "Pause" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: stop, disabled: !playing.value, children: "Stop" })
    ] })
  ] });
}
const NOTES = [
  { name: "C", letter: "C", frequency: 261.63, colour: "#ef4444", key: "a" },
  { name: "D", letter: "D", frequency: 293.66, colour: "#f97316", key: "s" },
  { name: "E", letter: "E", frequency: 329.63, colour: "#facc15", key: "d" },
  { name: "F", letter: "F", frequency: 349.23, colour: "#22c55e", key: "f" },
  { name: "G", letter: "G", frequency: 392, colour: "#38bdf8", key: "g" },
  { name: "A", letter: "A", frequency: 440, colour: "#6366f1", key: "h" },
  { name: "B", letter: "B", frequency: 493.88, colour: "#a855f7", key: "j" },
  { name: "C", letter: "C", frequency: 523.25, colour: "#ef4444", key: "k" }
];
const TUNES = [
  { id: "hotcross", name: "Hot cross buns", notes: [2, 1, 0, 2, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 1, 0] },
  { id: "mary", name: "Mary had a little lamb", notes: [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4] },
  { id: "twinkle", name: "Twinkle twinkle", notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0] },
  { id: "ode", name: "Ode to joy", notes: [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1] },
  { id: "rowrow", name: "Row, row, row your boat", notes: [0, 0, 0, 1, 2, 2, 1, 2, 3, 4] }
];
function noteForKey(key) {
  const index = NOTES.findIndex((note) => note.key === key.toLowerCase());
  return index === -1 ? void 0 : index;
}
let context = null;
function audioContext() {
  if (context) return context;
  const Ctor = window.AudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  return context;
}
function playNote(frequency, volume, seconds = 0.9) {
  const ctx = audioContext();
  if (!ctx) return false;
  void ctx.resume?.();
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(Math.max(1e-4, volume * 0.5), now);
  gain.gain.exponentialRampToValueAtTime(1e-4, now + seconds);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + seconds + 0.05);
  return true;
}
const TUNE_STEP_MS = 650;
function PianoScreen() {
  const tune = useSignal(null);
  const step = useSignal(0);
  const sounding = useSignal(null);
  const playing = useSignal(false);
  const message = useSignal("Press the keys to make music.");
  const timers = A([]);
  const noSound = useSignal(false);
  function stopTune() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
    playing.value = false;
    sounding.value = null;
  }
  h$2(() => stopTune, []);
  function sound(position) {
    const note = NOTES[position];
    if (!playNote(note.frequency, musicVolumeSetting.signal.value)) noSound.value = true;
    sounding.value = position;
    timers.current.push(window.setTimeout(() => sounding.value === position ? sounding.value = null : void 0, 220));
  }
  function press(position) {
    if (playing.value) stopTune();
    sound(position);
    const chosen = tune.value;
    if (!chosen) return;
    if (position === chosen.notes[step.value]) {
      const next = step.value + 1;
      step.value = next;
      message.value = next >= chosen.notes.length ? "You played the whole tune!" : "Yes. Now the next key.";
    } else if (step.value < chosen.notes.length) {
      message.value = "Look for the key with the pointer.";
    }
  }
  h$2(() => {
    function onKey(event) {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      const position = noteForKey(event.key);
      if (position === void 0) return;
      event.preventDefault();
      press(position);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });
  function choose(next) {
    stopTune();
    tune.value = next;
    step.value = 0;
    message.value = next ? `${next.name}. Press the key with the pointer.` : "Press the keys to make music.";
  }
  function hear() {
    const chosen = tune.value;
    if (!chosen) return;
    stopTune();
    playing.value = true;
    chosen.notes.forEach((position, index) => {
      timers.current.push(window.setTimeout(() => sound(position), index * TUNE_STEP_MS));
    });
    timers.current.push(window.setTimeout(() => playing.value = false, chosen.notes.length * TUNE_STEP_MS));
  }
  const target = tune.value && step.value < tune.value.notes.length ? tune.value.notes[step.value] : null;
  return /* @__PURE__ */ u$1("div", { class: "piano-screen", children: [
    /* @__PURE__ */ u$1("div", { class: "piano-screen__tunes", role: "group", "aria-label": "Tunes", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: `piano-screen__tune${tune.value === null ? " piano-screen__tune--on" : ""}`, "aria-pressed": tune.value === null, onClick: () => choose(null), children: "Play freely" }),
      TUNES.map((entry) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `piano-screen__tune${tune.value?.id === entry.id ? " piano-screen__tune--on" : ""}`,
          "aria-pressed": tune.value?.id === entry.id,
          onClick: () => choose(entry),
          children: entry.name
        },
        entry.id
      ))
    ] }),
    /* @__PURE__ */ u$1("div", { class: "piano-screen__keys", role: "group", "aria-label": "Piano keys", children: NOTES.map((note, position) => /* @__PURE__ */ u$1("div", { class: "piano-screen__slot", children: [
      /* @__PURE__ */ u$1("span", { class: "piano-screen__pointer", "aria-hidden": "true", children: target === position ? "👇" : "" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `piano-key${target === position ? " piano-key--next" : ""}${sounding.value === position ? " piano-key--down" : ""}`,
          style: { "--note": note.colour },
          "aria-label": `${note.name}${position === 7 ? ", high" : ""}`,
          onClick: () => press(position),
          children: /* @__PURE__ */ u$1("span", { class: "piano-key__letter", children: note.letter })
        }
      )
    ] }, position)) }),
    /* @__PURE__ */ u$1("p", { class: "game-screen__message", role: "status", children: noSound.value ? `This ${deviceNoun()} cannot make piano sounds.` : message.value }),
    /* @__PURE__ */ u$1("div", { class: "piano-screen__controls", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", disabled: !tune.value, onClick: hear, children: "Hear it" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", disabled: !tune.value, onClick: () => choose(tune.value), children: "Start the tune again" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", disabled: !playing.value, onClick: stopTune, children: "Stop" })
    ] })
  ] });
}
const W = 600;
const H = 200;
const GROUND = 178;
const trackY = (x2, hills) => {
  const hillWidth = W / hills;
  const within = x2 % hillWidth / hillWidth * Math.PI;
  return GROUND - 22 - Math.sin(within) * 92;
};
const trackPath = (hills) => {
  const points = [];
  for (let x2 = 0; x2 <= W; x2 += 5) points.push(`${x2 === 0 ? "M" : "L"}${x2},${trackY(x2, hills).toFixed(1)}`);
  return points.join(" ");
};
const slope = (x2, hills) => {
  const a2 = trackY(Math.max(0, x2 - 3), hills);
  const b2 = trackY(Math.min(W, x2 + 3), hills);
  return Math.atan2(b2 - a2, 6) * 180 / Math.PI;
};
function Scenery({ hills, done, trainX }) {
  const supports = [];
  for (let x2 = 14; x2 < W; x2 += 22) supports.push(x2);
  const y2 = trackY(trainX, hills);
  const tilt = slope(trainX, hills);
  return /* @__PURE__ */ u$1(S$1, { children: [
    /* @__PURE__ */ u$1("rect", { width: W, height: H, fill: "#bfe6ff" }),
    /* @__PURE__ */ u$1("circle", { cx: "540", cy: "36", r: "20", fill: "#fde047" }),
    /* @__PURE__ */ u$1("g", { fill: "#ffffff", children: [
      /* @__PURE__ */ u$1("ellipse", { cx: "90", cy: "38", rx: "34", ry: "12" }),
      /* @__PURE__ */ u$1("ellipse", { cx: "116", cy: "30", rx: "22", ry: "11" }),
      /* @__PURE__ */ u$1("ellipse", { cx: "330", cy: "26", rx: "30", ry: "10" }),
      /* @__PURE__ */ u$1("ellipse", { cx: "352", cy: "20", rx: "20", ry: "9" })
    ] }),
    /* @__PURE__ */ u$1("path", { d: `M0 ${GROUND - 40} Q80 ${GROUND - 80} 170 ${GROUND - 44} T340 ${GROUND - 50} T520 ${GROUND - 46} T${W} ${GROUND - 56} V${H} H0 Z`, fill: "#a7d8a0" }),
    /* @__PURE__ */ u$1("rect", { y: GROUND, width: W, height: H - GROUND, fill: "#4ade80" }),
    supports.map((x2) => /* @__PURE__ */ u$1("line", { x1: x2, y1: trackY(x2, hills), x2, y2: GROUND, stroke: "#92400e", "stroke-width": "3" }, x2)),
    /* @__PURE__ */ u$1("path", { d: trackPath(hills), fill: "none", stroke: "#7c2d12", "stroke-width": "7", "stroke-linecap": "round" }),
    /* @__PURE__ */ u$1("path", { d: trackPath(hills), fill: "none", stroke: "#fbbf24", "stroke-width": "2", "stroke-dasharray": "6 6" }),
    Array.from({ length: hills }, (_2, i2) => {
      const cx = (i2 + 0.5) * W / hills;
      const top = trackY(cx, hills);
      return /* @__PURE__ */ u$1("g", { children: [
        /* @__PURE__ */ u$1("line", { x1: cx, y1: top, x2: cx, y2: top - 26, stroke: "#374151", "stroke-width": "2" }),
        /* @__PURE__ */ u$1("path", { d: `M${cx} ${top - 26} l16 6 l-16 6 z`, class: i2 < done ? "ride-screen__flag ride-screen__flag--done" : "ride-screen__flag" })
      ] }, i2);
    }),
    /* @__PURE__ */ u$1("rect", { x: "2", y: GROUND - 30, width: "30", height: "30", fill: "#f87171", stroke: "#7f1d1d", "stroke-width": "2" }),
    /* @__PURE__ */ u$1("path", { d: `M-2 ${GROUND - 30} L17 ${GROUND - 46} L36 ${GROUND - 30} Z`, fill: "#b91c1c" }),
    /* @__PURE__ */ u$1("g", { transform: `translate(${trainX} ${y2}) rotate(${tilt}) scale(1.35)`, children: [-34, 0, 34].map((dx) => /* @__PURE__ */ u$1("g", { transform: `translate(${dx} 0)`, children: [
      /* @__PURE__ */ u$1("rect", { x: "-15", y: "-22", width: "30", height: "16", rx: "5", fill: "#ef4444", stroke: "#7f1d1d", "stroke-width": "2" }),
      /* @__PURE__ */ u$1("circle", { cx: "-8", cy: "-3", r: "4", fill: "#374151" }),
      /* @__PURE__ */ u$1("circle", { cx: "8", cy: "-3", r: "4", fill: "#374151" }),
      /* @__PURE__ */ u$1("text", { x: "0", y: "-24", "font-size": "17", "text-anchor": "middle", children: dx === -34 ? "😀" : dx === 0 ? "😄" : "🙂" })
    ] }, dx)) })
  ] });
}
function RideScreen() {
  const words = useSignal([]);
  const loaded = useSignal(false);
  const level = useSignal("three");
  const hillCount = useSignal(5);
  const ride = useSignal(void 0);
  const riding = useSignal(false);
  const hill = useSignal(0);
  const done = useSignal([]);
  const started = useSignal(false);
  const verb = useSignal(null);
  const describer = useSignal(null);
  const thing = useSignal(null);
  const wrongTries = useSignal(0);
  const picturesOnWords = useSignal(false);
  const message = useSignal("");
  h$2(() => {
    void getAllBoards().then((boards) => {
      words.value = gameWords(boards, wordStageSetting.signal.value);
      loaded.value = true;
    });
  }, []);
  if (!loaded.value) return null;
  const steps = STEPS[level.value];
  const possible = makeRide(words.value, 3) !== void 0;
  function resetHill() {
    started.value = false;
    verb.value = null;
    describer.value = null;
    thing.value = null;
    wrongTries.value = 0;
    message.value = "";
  }
  function begin() {
    const made = makeRide(words.value, hillCount.value);
    if (!made) return;
    ride.value = made;
    hill.value = 0;
    done.value = [];
    resetHill();
    riding.value = true;
  }
  function say(text) {
    announceText(text, { keepInHistory: false });
  }
  if (!possible) {
    return /* @__PURE__ */ u$1("div", { class: "game-screen game-screen--empty", children: [
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-title", children: "Not enough words yet" }),
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-note", children: "The rollercoaster needs more words with pictures." })
    ] });
  }
  if (!riding.value) {
    return /* @__PURE__ */ u$1("div", { class: "game-screen ride-screen ride-setup", children: [
      /* @__PURE__ */ u$1("svg", { class: "ride-screen__track", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "A rollercoaster", children: /* @__PURE__ */ u$1(Scenery, { hills: 5, done: 0, trainX: 30 }) }),
      /* @__PURE__ */ u$1("p", { class: "game-screen__message", children: "How long are the sentences?" }),
      /* @__PURE__ */ u$1("div", { class: "ride-setup__row", role: "group", "aria-label": "Sentence length", children: LEVELS.map((entry) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `ride-setup__choice${level.value === entry.id ? " ride-setup__choice--on" : ""}`,
          "aria-pressed": level.value === entry.id,
          onClick: () => level.value = entry.id,
          children: [
            /* @__PURE__ */ u$1("strong", { children: entry.label }),
            /* @__PURE__ */ u$1("span", { children: entry.example })
          ]
        },
        entry.id
      )) }),
      /* @__PURE__ */ u$1("div", { class: "ride-setup__row", role: "group", "aria-label": "Ride length", children: LENGTHS.map((entry) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `ride-setup__choice${hillCount.value === entry.hills ? " ride-setup__choice--on" : ""}`,
          "aria-pressed": hillCount.value === entry.hills,
          onClick: () => hillCount.value = entry.hills,
          children: [
            /* @__PURE__ */ u$1("strong", { children: entry.label }),
            /* @__PURE__ */ u$1("span", { children: [
              entry.hills,
              " hills"
            ] })
          ]
        },
        entry.hills
      )) }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "snap-screen__turn ride-setup__go", onClick: begin, children: "Start the ride" })
    ] });
  }
  const hills = ride.value;
  const total = hills.length;
  const finishedRide = hill.value >= total;
  const current = finishedRide ? void 0 : hills[hill.value];
  const isDone = (kind) => kind === "start" ? started.value : kind === "verb" ? Boolean(verb.value) : kind === "describer" ? Boolean(describer.value) : Boolean(thing.value);
  const nowIndex = steps.findIndex((kind) => !isDone(kind));
  const nowStep = nowIndex === -1 ? "ready" : steps[nowIndex];
  const stepsDone = steps.filter(isDone).length;
  const along = finishedRide ? 1 : progress(hill.value, stepsDone, steps.length, total);
  const trainX = Math.round(55 + along * (W - 110));
  const sentence = sentenceFor(level.value, { verb: verb.value, describer: describer.value, thing: thing.value?.label ?? null, started: started.value });
  const hint = wrongTries.value >= HINT_AFTER;
  function pressStart() {
    say("I");
    if (nowStep === "start") started.value = true;
  }
  function chooseVerb(word2) {
    say(word2);
    if (nowStep === "verb") verb.value = word2;
  }
  function chooseDescriber(word2) {
    say(word2);
    if (nowStep === "describer") describer.value = word2;
  }
  function chooseThing(option) {
    say(option.label);
    if (nowStep !== "thing") return;
    if (option.id === current.target.id) {
      thing.value = option;
      wrongTries.value = 0;
      message.value = "";
    } else {
      wrongTries.value += 1;
      message.value = wrongTries.value >= HINT_AFTER ? "Look at the word with the pointer." : "Not that one. Try another.";
    }
  }
  function nextHill() {
    done.value = [...done.value, sentence];
    hill.value += 1;
    resetHill();
  }
  function sayAll() {
    announceSentence(done.value);
  }
  const image = current?.target.image;
  const prompts = {
    start: "Press “I” to start the hill.",
    verb: "What do you do? Choose a word.",
    describer: "Choose a describing word.",
    thing: "Which word is the picture?",
    ready: "Up the hill! Say it all, then go on."
  };
  return /* @__PURE__ */ u$1("div", { class: "game-screen ride-screen", children: [
    /* @__PURE__ */ u$1("svg", { class: "ride-screen__track", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `Rollercoaster: hill ${Math.min(hill.value + 1, total)} of ${total}`, children: /* @__PURE__ */ u$1(Scenery, { hills: total, done: hill.value, trainX }) }),
    finishedRide ? /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("p", { class: "game-screen__message", role: "status", children: "You have been all the way round the track." }),
      /* @__PURE__ */ u$1("ol", { class: "ride-screen__tickets", "aria-label": "Your sentences", children: done.value.map((text, index) => /* @__PURE__ */ u$1("li", { class: "ride-screen__ticket", children: [
        "🎟️ ",
        text
      ] }, index)) }),
      /* @__PURE__ */ u$1("div", { class: "snap-screen__controls", children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "snap-screen__turn", onClick: sayAll, children: "Say my sentences" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "snap-screen__turn", onClick: begin, children: "Ride again" })
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: () => riding.value = false, children: "Change the ride" })
    ] }) : /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("div", { class: "ride-screen__row", children: [
        /* @__PURE__ */ u$1("div", { class: "ride-screen__picture", "aria-label": "Find the word for this picture", role: "img", children: image?.kind === "photo" ? /* @__PURE__ */ u$1(PhotoThumbnail, { class: "game-screen__photo", blobId: image.blobId, alt: "" }) : /* @__PURE__ */ u$1(Pic, { class: "game-screen__emoji", char: image?.kind === "emoji" ? image.char : "" }) }),
        /* @__PURE__ */ u$1("ol", { class: "ride-screen__tickets ride-screen__tickets--side", "aria-label": "Sentences so far", children: done.value.map((text, index) => /* @__PURE__ */ u$1("li", { class: "ride-screen__ticket", children: [
          "🎟️ ",
          text
        ] }, index)) })
      ] }),
      /* @__PURE__ */ u$1("p", { class: "ride-screen__sentence", "aria-live": "polite", children: sentence || " " }),
      /* @__PURE__ */ u$1("p", { class: "game-screen__message", role: "status", children: message.value || prompts[nowStep] }),
      /* @__PURE__ */ u$1("div", { class: "ride-screen__choices", children: [
        nowStep === "start" && /* @__PURE__ */ u$1("button", { type: "button", class: "game-option ride-screen__choice", onClick: pressStart, children: "I" }),
        nowStep === "verb" && VERBS.map((word2) => /* @__PURE__ */ u$1("button", { type: "button", class: "game-option ride-screen__choice", onClick: () => chooseVerb(word2), children: word2 }, word2)),
        nowStep === "describer" && current.describers.map((word2) => /* @__PURE__ */ u$1("button", { type: "button", class: "game-option ride-screen__choice", onClick: () => chooseDescriber(word2), children: word2 }, word2)),
        nowStep === "thing" && current.options.map((option) => {
          const pointed = hint && option.id === current.target.id;
          return /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: `game-option ride-screen__choice${pointed ? " ride-screen__choice--hint" : ""}`,
              onClick: () => chooseThing(option),
              children: [
                pointed && /* @__PURE__ */ u$1("span", { class: "ride-screen__pointer", "aria-hidden": "true", children: "👉" }),
                picturesOnWords.value && option.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "game-option__emoji", char: option.image.char }),
                option.label
              ]
            },
            option.id
          );
        }),
        nowStep === "ready" && /* @__PURE__ */ u$1(S$1, { children: [
          /* @__PURE__ */ u$1("button", { type: "button", class: "game-option ride-screen__choice", onClick: () => say(sentence), children: "Say it all" }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "game-option ride-screen__choice", onClick: nextHill, children: hill.value === total - 1 ? "To the end" : "Next hill" })
        ] })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "ride-screen__foot", children: [
        /* @__PURE__ */ u$1("p", { class: "game-screen__count", children: [
          "Hill ",
          hill.value + 1,
          " of ",
          total,
          "."
        ] }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "game-screen__button",
            "aria-pressed": picturesOnWords.value,
            onClick: () => picturesOnWords.value = !picturesOnWords.value,
            children: picturesOnWords.value ? "Words only" : "Pictures on the words"
          }
        ),
        /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", onClick: () => riding.value = false, children: "Change the ride" })
      ] })
    ] })
  ] });
}
const DECK_LENGTH = 12;
function makeSnapDeck(words, length = DECK_LENGTH, random = Math.random) {
  if (words.length < 4) return void 0;
  const cards = [];
  let snaps = 0;
  for (let i2 = 0; i2 < length; i2 += 1) {
    const previous = cards[i2 - 1];
    const repeatsBefore = previous && cards[i2 - 2]?.id === previous.id;
    if (previous && !repeatsBefore && random() < 0.35) {
      cards.push(previous);
      snaps += 1;
      continue;
    }
    const others = words.filter((word2) => word2.id !== previous?.id);
    cards.push(others[Math.floor(random() * others.length)]);
  }
  return { cards, snaps };
}
function Card({ item, label, empty }) {
  const image = item?.image;
  return /* @__PURE__ */ u$1(
    "button",
    {
      type: "button",
      class: "snap-card",
      disabled: !item,
      "aria-label": item ? `${label}: ${item.label}` : label,
      onClick: () => item && announceText(item.label, { keepInHistory: false }),
      children: item ? /* @__PURE__ */ u$1(S$1, { children: [
        image?.kind === "photo" ? /* @__PURE__ */ u$1(PhotoThumbnail, { class: "snap-card__photo", blobId: image.blobId, alt: "" }) : /* @__PURE__ */ u$1(Pic, { class: "snap-card__emoji", char: image?.kind === "emoji" ? image.char : "" }),
        /* @__PURE__ */ u$1("span", { class: "snap-card__label", children: item.label })
      ] }) : /* @__PURE__ */ u$1("span", { class: "snap-card__empty", children: empty })
    }
  );
}
function SnapScreen({ fixedWords } = {}) {
  const deck = useSignal(null);
  const turn = useSignal(-1);
  const found = useSignal(0);
  const called = useSignal(false);
  const message = useSignal("Turn a card to start.");
  const words = useSignal([]);
  function deal(available) {
    deck.value = makeSnapDeck(available);
    turn.value = -1;
    found.value = 0;
    called.value = false;
    message.value = "Turn a card to start.";
  }
  h$2(() => {
    if (fixedWords) {
      words.value = fixedWords;
      deal(fixedWords);
      return;
    }
    void getAllBoards().then((boards) => {
      words.value = gameWords(boards, wordStageSetting.signal.value);
      deal(words.value);
    });
  }, []);
  if (deck.value === null) return null;
  const current = deck.value;
  if (!current) {
    return /* @__PURE__ */ u$1("div", { class: "game-screen game-screen--empty", children: [
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-title", children: "Not enough words yet" }),
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-note", children: "Snap needs at least four words with pictures." })
    ] });
  }
  const live = current;
  const right = turn.value >= 0 ? current.cards[turn.value] : void 0;
  const left = turn.value >= 1 ? current.cards[turn.value - 1] : void 0;
  const isSnap = Boolean(left && right && left.id === right.id);
  const finished = turn.value === current.cards.length - 1;
  function turnCard() {
    const missed = isSnap && !called.value;
    turn.value += 1;
    called.value = false;
    message.value = missed ? "Those two were the same, so that was a snap." : "";
    const next = live.cards[turn.value];
    const before = live.cards[turn.value - 1];
    if (next && before && next.id === before.id) message.value = missed ? "That was a snap. And here are two the same again." : "";
  }
  function callSnap() {
    announceText("Snap!", { keepInHistory: false });
    if (turn.value < 0) return;
    if (isSnap && !called.value) {
      called.value = true;
      found.value += 1;
      message.value = `Snap! Two ${right.label}.`;
    } else if (isSnap) {
      message.value = "You have already called that one.";
    } else {
      message.value = "Not the same this time. Keep looking.";
    }
  }
  return /* @__PURE__ */ u$1("div", { class: "game-screen snap-screen", children: [
    /* @__PURE__ */ u$1("div", { class: "snap-screen__cards", children: [
      /* @__PURE__ */ u$1(Card, { item: left, label: "Card before", empty: turn.value < 0 ? "" : "First card" }),
      /* @__PURE__ */ u$1(Card, { item: right, label: "New card", empty: "" })
    ] }),
    /* @__PURE__ */ u$1("p", { class: "game-screen__message", role: "status", children: finished ? `${message.value} All done. Snaps found: ${found.value} of ${current.snaps}.` : message.value }),
    /* @__PURE__ */ u$1("div", { class: "snap-screen__controls", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "snap-screen__snap", onClick: callSnap, disabled: turn.value < 0, children: "SNAP!" }),
      finished ? /* @__PURE__ */ u$1("button", { type: "button", class: "snap-screen__turn", onClick: () => deal(words.value), children: "Play again" }) : /* @__PURE__ */ u$1("button", { type: "button", class: "snap-screen__turn", onClick: turnCard, children: turn.value < 0 ? "Turn a card" : "Turn the next card" })
    ] }),
    /* @__PURE__ */ u$1("p", { class: "game-screen__count", children: turn.value < 0 ? "No pressure. Take your time." : `Card ${turn.value + 1} of ${current.cards.length}. Snaps found: ${found.value}` })
  ] });
}
const MODES = [
  { id: "words", label: "Words" },
  { id: "find", label: "Find the word" },
  { id: "snap", label: "Snap" }
];
function SeasonsScreen() {
  const config = seasonsSetting.signal.value;
  const all = effectiveSeasons(config);
  const shown = all.filter((entry) => isSeasonShown(config, entry.id));
  const now = suggestedSeason(/* @__PURE__ */ new Date());
  const first = shown.find((entry) => entry.id === now) ?? shown[0];
  const chosenId = useSignal(null);
  const mode = useSignal("words");
  const season = shown.find((entry) => entry.id === chosenId.value) ?? first;
  if (!season) {
    return /* @__PURE__ */ u$1("div", { class: "game-screen game-screen--empty", children: [
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-title", children: "No seasons are turned on" }),
      /* @__PURE__ */ u$1("p", { class: "game-screen__empty-note", children: "An adult can turn some on in Parent Mode (Seasons)." })
    ] });
  }
  const items = seasonItems(season);
  return /* @__PURE__ */ u$1("div", { class: "seasons-screen", children: [
    /* @__PURE__ */ u$1("div", { class: "seasons-screen__choices", role: "group", "aria-label": "Season or celebration", children: all.map((entry) => {
      const visible = isSeasonShown(config, entry.id);
      return /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `seasons-screen__choice${season.id === entry.id ? " seasons-screen__choice--chosen" : ""}${visible ? "" : " seasons-screen__choice--gap"}`,
          "aria-pressed": season.id === entry.id,
          "aria-hidden": visible ? void 0 : "true",
          tabIndex: visible ? void 0 : -1,
          disabled: !visible,
          onClick: () => chosenId.value = entry.id,
          children: [
            /* @__PURE__ */ u$1(Pic, { class: "seasons-screen__choice-emoji", char: entry.emoji }),
            /* @__PURE__ */ u$1("span", { children: entry.name }),
            entry.id === now && /* @__PURE__ */ u$1("span", { class: "seasons-screen__now", children: "Now" })
          ]
        },
        entry.id
      );
    }) }),
    /* @__PURE__ */ u$1("div", { class: "seasons-screen__modes", role: "group", "aria-label": "What to do", children: MODES.map((entry) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: `seasons-screen__mode${mode.value === entry.id ? " seasons-screen__mode--chosen" : ""}`,
        "aria-pressed": mode.value === entry.id,
        onClick: () => mode.value = entry.id,
        children: entry.label
      },
      entry.id
    )) }),
    /* @__PURE__ */ u$1("div", { class: "seasons-screen__body", children: [
      items.length === 0 && /* @__PURE__ */ u$1("p", { class: "seasons-screen__none", children: "There are no words here yet. An adult can add some in Parent Mode (Seasons)." }),
      items.length > 0 && mode.value === "words" && /* @__PURE__ */ u$1("div", { class: "seasons-screen__words", children: items.map((item) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "seasons-screen__word",
          style: { background: item.background_color },
          onClick: () => announceText(item.vocalization ?? item.label, { keepInHistory: false }),
          children: [
            item.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "seasons-screen__word-emoji", char: item.image.char }),
            /* @__PURE__ */ u$1("span", { class: "seasons-screen__word-label", children: item.label })
          ]
        },
        item.id
      )) }),
      items.length > 0 && mode.value === "find" && /* @__PURE__ */ u$1(GameScreen, { fixedWords: items }, season.id),
      items.length > 0 && mode.value === "snap" && /* @__PURE__ */ u$1(SnapScreen, { fixedWords: items }, season.id)
    ] })
  ] });
}
function Hung({ tool }) {
  const item = toolById(tool);
  if (item.colour && !item.emoji) return /* @__PURE__ */ u$1("span", { class: "tree-screen__bauble", style: { background: item.colour }, "aria-hidden": "true" });
  return /* @__PURE__ */ u$1("span", { class: "tree-screen__emoji", "aria-hidden": "true", children: item.emoji ? /* @__PURE__ */ u$1(Pic, { char: item.emoji, class: "tree-screen__pic" }) : null });
}
const slotName = (slot) => slot.kind === "top" ? "the top of the tree" : slot.kind === "floor" ? "a place under the tree" : "a place on the tree";
function TreeScreen() {
  const tool = useSignal("red");
  const message = useSignal("Choose a decoration, then press a place on the tree.");
  const history = useSignal([]);
  const design = treeDesignSetting.signal.value;
  function commit(next, said) {
    if (next !== design) {
      history.value = [...history.value.slice(-30), design];
      void treeDesignSetting.set(next);
    }
    message.value = said;
  }
  function press(slot) {
    const result = place(design, slot, tool.value);
    commit(result.design, result.message);
  }
  function undo() {
    const previous = history.value[history.value.length - 1];
    if (!previous) return;
    history.value = history.value.slice(0, -1);
    void treeDesignSetting.set(previous);
    message.value = "Undone.";
  }
  function startAgain() {
    if (hungCount(design) === 0) return;
    commit({}, "The tree is bare again. Undo brings it back.");
  }
  return /* @__PURE__ */ u$1("div", { class: "tree-screen", children: [
    /* @__PURE__ */ u$1("div", { class: "tree-screen__stage", children: /* @__PURE__ */ u$1("div", { class: "tree-screen__picture", children: [
      /* @__PURE__ */ u$1("svg", { class: "tree-screen__svg", viewBox: "0 0 300 360", role: "img", "aria-label": "A Christmas tree to decorate", children: [
        /* @__PURE__ */ u$1("rect", { x: "0", y: "0", width: "300", height: "360", fill: "#e0f2fe" }),
        /* @__PURE__ */ u$1("rect", { x: "0", y: "318", width: "300", height: "42", fill: "#f8fafc" }),
        /* @__PURE__ */ u$1("rect", { x: "133", y: "282", width: "34", height: "40", fill: "#92400e", stroke: "#1a1a1a", "stroke-width": "2" }),
        /* @__PURE__ */ u$1("polygon", { points: "150,168 36,288 264,288", fill: "#15803d", stroke: "#1a1a1a", "stroke-width": "2.5" }),
        /* @__PURE__ */ u$1("polygon", { points: "150,100 66,200 234,200", fill: "#16a34a", stroke: "#1a1a1a", "stroke-width": "2.5" }),
        /* @__PURE__ */ u$1("polygon", { points: "150,46 96,132 204,132", fill: "#22c55e", stroke: "#1a1a1a", "stroke-width": "2.5" })
      ] }),
      TREE_SLOTS.map((slot) => {
        const hung = design[slot.id];
        return /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: `tree-screen__slot tree-screen__slot--${slot.kind}${hung ? " tree-screen__slot--full" : ""}`,
            style: { left: `${slot.x}%`, top: `${slot.y}%` },
            "aria-label": hung ? `${toolById(hung).label} on ${slotName(slot)}` : `Empty place on ${slotName(slot)}`,
            onClick: () => press(slot),
            children: hung && /* @__PURE__ */ u$1(Hung, { tool: hung })
          },
          slot.id
        );
      })
    ] }) }),
    /* @__PURE__ */ u$1("div", { class: "tree-screen__side", children: [
      /* @__PURE__ */ u$1("p", { class: "game-screen__message", role: "status", children: message.value }),
      /* @__PURE__ */ u$1("div", { class: "tree-screen__tools", role: "group", "aria-label": "Decorations", children: TREE_TOOLS.map((item) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `tree-screen__tool${tool.value === item.id ? " tree-screen__tool--chosen" : ""}`,
          "aria-pressed": tool.value === item.id,
          onClick: () => tool.value = item.id,
          children: [
            /* @__PURE__ */ u$1("span", { class: "tree-screen__tool-sample", "aria-hidden": "true", children: item.colour && !item.emoji ? /* @__PURE__ */ u$1("span", { class: "tree-screen__bauble", style: { background: item.colour } }) : /* @__PURE__ */ u$1(Pic, { char: item.emoji ?? "", class: "tree-screen__pic" }) }),
            /* @__PURE__ */ u$1("span", { class: "tree-screen__tool-label", children: item.label })
          ]
        },
        item.id
      )) }),
      /* @__PURE__ */ u$1("div", { class: "tree-screen__controls", children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", disabled: history.value.length === 0, onClick: undo, children: "Undo" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", disabled: hungCount(design) === 0, onClick: startAgain, children: "Start again" })
      ] })
    ] })
  ] });
}
const GAMES = [
  { id: "find", label: "Find the word", icon: "🔎", hint: "Match the word to the picture." },
  { id: "snap", label: "Snap", icon: "🃏", hint: "Turn the cards. Press SNAP for two the same." },
  { id: "ride", label: "Rollercoaster", icon: "🎢", hint: "Build a sentence to climb each hill." },
  { id: "draw", label: "Draw", icon: "🎨", hint: "Make a picture." },
  { id: "jokes", label: "Jokes", icon: "😄", hint: "Questions and answers to make you laugh." },
  { id: "music", label: "Music", icon: "🎵", hint: "Songs to listen to." },
  { id: "piano", label: "Piano", icon: "🎹", hint: "Play the keys." },
  { id: "seasons", label: "Seasons", icon: "🍂", hint: "Words and games for times of the year." },
  { id: "tree", label: "Make a tree", icon: "🎄", hint: "Hang decorations on a Christmas tree." }
];
function GamesScreen() {
  const which = useSignal(null);
  if (which.value === null) {
    return /* @__PURE__ */ u$1("div", { class: "games-menu", children: GAMES.map((game) => /* @__PURE__ */ u$1("button", { type: "button", class: "games-menu__tile", onClick: () => which.value = game.id, children: [
      /* @__PURE__ */ u$1("span", { class: "games-menu__icon", "aria-hidden": "true", children: game.icon }),
      /* @__PURE__ */ u$1("span", { class: "games-menu__label", children: game.label }),
      /* @__PURE__ */ u$1("span", { class: "games-menu__hint", children: game.hint })
    ] }, game.id)) });
  }
  return /* @__PURE__ */ u$1("div", { class: "games-shell", children: [
    /* @__PURE__ */ u$1("button", { type: "button", class: "games-shell__back", onClick: () => which.value = null, children: "All games" }),
    /* @__PURE__ */ u$1("div", { class: "games-shell__game", children: [
      which.value === "find" && /* @__PURE__ */ u$1(GameScreen, {}),
      which.value === "snap" && /* @__PURE__ */ u$1(SnapScreen, {}),
      which.value === "ride" && /* @__PURE__ */ u$1(RideScreen, {}),
      which.value === "draw" && /* @__PURE__ */ u$1(DrawScreen, {}),
      which.value === "jokes" && /* @__PURE__ */ u$1(JokesScreen, {}),
      which.value === "music" && /* @__PURE__ */ u$1(MusicScreen, {}),
      which.value === "piano" && /* @__PURE__ */ u$1(PianoScreen, {}),
      which.value === "seasons" && /* @__PURE__ */ u$1(SeasonsScreen, {}),
      which.value === "tree" && /* @__PURE__ */ u$1(TreeScreen, {})
    ] })
  ] });
}
function TrafficScreen() {
  const full = useSignal(false);
  const { status, phrases } = trafficSetting.signal.value;
  function choose(id) {
    void trafficSetting.set({ ...trafficSetting.signal.value, status: status === id ? "off" : id });
  }
  if (full.value && status !== "off") {
    const light = trafficLight(status);
    return /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "traffic-full",
        style: { background: light.colour },
        onClick: () => full.value = false,
        "aria-label": `${phrases[status]} Press to go back.`,
        children: /* @__PURE__ */ u$1("span", { class: "traffic-full__text", children: phrases[status] })
      }
    );
  }
  return /* @__PURE__ */ u$1("div", { class: "traffic-screen", children: [
    /* @__PURE__ */ u$1("p", { class: "traffic-screen__title", children: "How much do you want people to talk to you?" }),
    /* @__PURE__ */ u$1("div", { class: "traffic-screen__lights", role: "group", "aria-label": "Traffic light", children: TRAFFIC_LIGHTS.map((light) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: `traffic-light${status === light.id ? " traffic-light--on" : ""}`,
        style: { "--light": light.colour },
        "aria-pressed": status === light.id,
        onClick: () => choose(light.id),
        children: [
          /* @__PURE__ */ u$1("span", { class: "traffic-light__lamp", "aria-hidden": "true" }),
          /* @__PURE__ */ u$1("span", { class: "traffic-light__label", children: light.short })
        ]
      },
      light.id
    )) }),
    /* @__PURE__ */ u$1("p", { class: "traffic-screen__phrase", "aria-live": "polite", children: status === "off" ? "Choose a colour to show people." : phrases[status] }),
    /* @__PURE__ */ u$1("div", { class: "traffic-screen__actions", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", disabled: status === "off", onClick: () => announceText(phrases[status]), children: "Say it" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", disabled: status === "off", onClick: () => full.value = true, children: "Show everyone" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "game-screen__button", disabled: status === "off", onClick: () => void trafficSetting.set({ ...trafficSetting.signal.value, status: "off" }), children: "Turn off" })
    ] })
  ] });
}
function TrafficChip() {
  const { status } = trafficSetting.signal.value;
  if (status === "off") return null;
  const light = trafficLight(status);
  return /* @__PURE__ */ u$1("span", { class: "traffic-chip", style: { "--light": light.colour }, children: [
    /* @__PURE__ */ u$1("span", { class: "traffic-chip__lamp", "aria-hidden": "true" }),
    light.short
  ] });
}
const WORDS = [
  "anchor",
  "meadow",
  "violet",
  "cobalt",
  "summit",
  "harbour",
  "lantern",
  "willow",
  "granite",
  "copper",
  "ember",
  "thistle",
  "river",
  "maple",
  "pebble",
  "sparrow",
  "orchard",
  "velvet",
  "bramble",
  "cedar",
  "dolphin",
  "falcon",
  "glacier",
  "hazel",
  "indigo",
  "juniper",
  "kestrel",
  "lagoon",
  "marble",
  "nutmeg",
  "otter",
  "prairie",
  "quartz",
  "rowan",
  "saffron",
  "tulip",
  "umber",
  "valley",
  "walnut",
  "yarrow",
  "zephyr",
  "acorn",
  "beacon",
  "clover",
  "daisy",
  "elm",
  "fern",
  "garnet",
  "heather",
  "ivory",
  "jasmine",
  "kettle",
  "lilac",
  "mosaic",
  "nectar",
  "olive",
  "plum",
  "quill",
  "raven",
  "sorrel",
  "thyme",
  "urchin",
  "violin",
  "wren"
];
function pickIndex(count, fill) {
  const limit = Math.floor(256 / count) * count;
  const byte = new Uint8Array(1);
  do {
    fill(byte);
  } while (byte[0] >= limit);
  return byte[0] % count;
}
function generateRecoveryCode(fill = (bytes) => void crypto.getRandomValues(bytes)) {
  return Array.from({ length: 4 }, () => WORDS[pickIndex(WORDS.length, fill)]).join("-");
}
const PIN_LENGTH = 4;
function PinGate({ onUnlock, onCancel, showCancel = true, changePin = false, kind = "parent" }) {
  const school = kind === "school";
  const mode = school ? SCHOOL_MODE_NAME : modeName();
  const step = useSignal({ kind: "loading" });
  const entry = useSignal("");
  const recoveryEntry = useSignal("");
  const checking = useSignal(false);
  const waitSeconds = useSignal(Math.ceil(waitRemaining(Date.now(), kind) / 1e3));
  h$2(() => {
    if (changePin) {
      step.value = { kind: "set-new-pin-enter" };
      return;
    }
    void (school ? hasSchoolPin() : hasParentPin()).then((exists) => {
      step.value = exists ? { kind: "enter-pin" } : { kind: "setup-enter" };
    });
  }, []);
  h$2(() => {
    if (waitSeconds.value <= 0) return;
    const timer = setInterval(() => {
      waitSeconds.value = Math.ceil(waitRemaining(Date.now(), kind) / 1e3);
      if (waitSeconds.value <= 0) clearInterval(timer);
    }, 1e3);
    return () => clearInterval(timer);
  }, [waitSeconds.value > 0]);
  function pressDigit(digit) {
    if (entry.value.length < PIN_LENGTH) entry.value += digit;
  }
  function pressBackspace() {
    entry.value = entry.value.slice(0, -1);
  }
  async function completeSetupWithRecovery(pin) {
    if (school) {
      await setSchoolPin(pin);
      entry.value = "";
      onUnlock();
      return;
    }
    const recoveryCode = generateRecoveryCode();
    await setParentPinState({ pin, recoveryCode });
    entry.value = "";
    step.value = { kind: "setup-recovery-shown", recoveryCode };
  }
  async function checkPin(value) {
    if (waitRemaining(Date.now(), kind) > 0) {
      waitSeconds.value = Math.ceil(waitRemaining(Date.now(), kind) / 1e3);
      entry.value = "";
      return;
    }
    checking.value = true;
    const right = await (school ? verifySchoolPin(value) : verifyParentPin(value));
    checking.value = false;
    if (right) {
      recordRightPin(kind);
      onUnlock();
      return;
    }
    recordWrongPin(Date.now(), kind);
    waitSeconds.value = Math.ceil(waitRemaining(Date.now(), kind) / 1e3);
    entry.value = "";
    step.value = { kind: "enter-pin", error: "Wrong PIN." };
  }
  function submitPin() {
    const value = entry.value;
    if (value.length !== PIN_LENGTH || checking.value) return;
    switch (step.value.kind) {
      case "setup-enter":
        entry.value = "";
        step.value = { kind: "setup-confirm", firstPin: value };
        return;
      case "setup-confirm":
        if (value !== step.value.firstPin) {
          entry.value = "";
          step.value = { kind: "setup-enter", error: "Those didn't match. Let's try again." };
          return;
        }
        void completeSetupWithRecovery(value);
        return;
      case "enter-pin":
        void checkPin(value);
        return;
      case "set-new-pin-enter":
        entry.value = "";
        step.value = { kind: "set-new-pin-confirm", firstPin: value };
        return;
      case "set-new-pin-confirm":
        if (value !== step.value.firstPin) {
          entry.value = "";
          step.value = { kind: "set-new-pin-enter", error: "Those didn't match. Let's try again." };
          return;
        }
        void completeSetupWithRecovery(value);
        return;
      default:
        return;
    }
  }
  async function submitRecovery() {
    if (waitRemaining(Date.now(), kind) > 0) {
      waitSeconds.value = Math.ceil(waitRemaining(Date.now(), kind) / 1e3);
      return;
    }
    if (await verifyRecoveryCode(recoveryEntry.value)) {
      recordRightPin();
      recoveryEntry.value = "";
      entry.value = "";
      step.value = { kind: "set-new-pin-enter" };
    } else {
      recordWrongPin();
      waitSeconds.value = Math.ceil(waitRemaining(Date.now(), kind) / 1e3);
      step.value = { kind: "enter-recovery", error: "That code doesn't match." };
    }
  }
  const prompts = {
    "setup-enter": school ? "Choose a School PIN: 4 digits" : `Set up ${modeName()}: choose a 4-digit PIN`,
    "setup-confirm": "Enter the same PIN again",
    "enter-pin": `Enter the ${mode} PIN`,
    "set-new-pin-enter": school ? "Choose a new School PIN: 4 digits" : "Choose a new 4-digit PIN",
    "set-new-pin-confirm": "Enter the same PIN again"
  };
  return /* @__PURE__ */ u$1("div", { class: "pin-gate", children: [
    step.value.kind === "loading" && /* @__PURE__ */ u$1("p", { children: "Loading…" }),
    step.value.kind === "setup-recovery-shown" && /* @__PURE__ */ u$1("div", { class: "pin-gate__recovery-shown", children: [
      /* @__PURE__ */ u$1("p", { class: "pin-gate__prompt", children: [
        modeName(),
        " is set up. Write this recovery code down:"
      ] }),
      /* @__PURE__ */ u$1("p", { class: "pin-gate__recovery-code", children: step.value.recoveryCode }),
      /* @__PURE__ */ u$1("p", { class: "pin-gate__note", children: "This is the only way back in if the PIN is forgotten. It isn't sent anywhere and can't be recovered otherwise." }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "pin-gate__button", onClick: onUnlock, children: "I've written it down" })
    ] }),
    (step.value.kind === "setup-enter" || step.value.kind === "setup-confirm" || step.value.kind === "enter-pin" || step.value.kind === "set-new-pin-enter" || step.value.kind === "set-new-pin-confirm") && /* @__PURE__ */ u$1("div", { class: "pin-gate__entry", children: [
      /* @__PURE__ */ u$1("p", { class: "pin-gate__prompt", children: prompts[step.value.kind] }),
      "error" in step.value && step.value.error && /* @__PURE__ */ u$1("p", { class: "pin-gate__error", children: step.value.error }),
      waitSeconds.value > 0 && step.value.kind === "enter-pin" && /* @__PURE__ */ u$1("p", { class: "pin-gate__error pin-gate__wait", role: "status", children: [
        "Too many wrong tries. Please wait ",
        waitSeconds.value,
        " seconds, then try again."
      ] }),
      /* @__PURE__ */ u$1("div", { class: "pin-gate__dots", "aria-label": `${entry.value.length} of ${PIN_LENGTH} digits entered`, children: Array.from({ length: PIN_LENGTH }, (_2, i2) => /* @__PURE__ */ u$1("span", { class: `pin-gate__dot${i2 < entry.value.length ? " pin-gate__dot--filled" : ""}` }, i2)) }),
      /* @__PURE__ */ u$1("div", { class: "pin-gate__keypad", children: [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => /* @__PURE__ */ u$1("button", { type: "button", class: "pin-gate__key", onClick: () => pressDigit(digit), children: digit }, digit)),
        /* @__PURE__ */ u$1("button", { type: "button", class: "pin-gate__key", onClick: pressBackspace, "aria-label": "Backspace", children: "⌫" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "pin-gate__key", onClick: () => pressDigit("0"), children: "0" }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "pin-gate__key pin-gate__key--submit",
            disabled: entry.value.length !== PIN_LENGTH,
            onClick: submitPin,
            children: "OK"
          }
        )
      ] }),
      step.value.kind === "enter-pin" && !school && /* @__PURE__ */ u$1("button", { type: "button", class: "pin-gate__link", onClick: () => step.value = { kind: "enter-recovery" }, children: "Forgotten your PIN?" }),
      step.value.kind === "enter-pin" && school && /* @__PURE__ */ u$1("p", { class: "pin-gate__note", children: "Forgotten the School PIN? Whoever has the Parent PIN can choose a new one in Parent Mode." })
    ] }),
    step.value.kind === "enter-recovery" && /* @__PURE__ */ u$1("div", { class: "pin-gate__entry", children: [
      /* @__PURE__ */ u$1("p", { class: "pin-gate__prompt", children: "Enter your recovery code" }),
      step.value.error && /* @__PURE__ */ u$1("p", { class: "pin-gate__error", children: step.value.error }),
      waitSeconds.value > 0 && /* @__PURE__ */ u$1("p", { class: "pin-gate__error pin-gate__wait", role: "status", children: [
        "Too many wrong tries. Please wait ",
        waitSeconds.value,
        " seconds, then try again."
      ] }),
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "pin-gate__recovery-input",
          type: "text",
          value: recoveryEntry.value,
          onInput: (event) => {
            recoveryEntry.value = event.target.value;
          },
          "aria-label": "Recovery code"
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "button", class: "pin-gate__button", onClick: () => void submitRecovery(), children: "Continue" })
    ] }),
    showCancel && /* @__PURE__ */ u$1("button", { type: "button", class: "pin-gate__cancel", onClick: onCancel, children: "Cancel" })
  ] });
}
const APP_NAME = "Rugged Speech";
function possessive(name) {
  return `${name.trim()}'s`;
}
function deviceTitle(profile) {
  const device = profile.deviceName.trim();
  if (device) return device;
  const name = profile.name.trim();
  return name ? `${possessive(name)} device` : APP_NAME;
}
function ageYears(profile) {
  const text = profile.age.trim();
  if (!/^\d{1,2}$/.test(text)) return void 0;
  return Number(text);
}
function LostModeScreen() {
  const askingForPin = useSignal(false);
  const lost = lostModeSetting.signal.value;
  const profile = userProfileSetting.signal.value;
  const named = profile.deviceName.trim() || profile.name.trim() ? deviceTitle(profile) : "";
  const message = lostMessage(lost, named);
  if (askingForPin.value) {
    return /* @__PURE__ */ u$1("div", { class: "lost-mode lost-mode--pin", children: /* @__PURE__ */ u$1(
      PinGate,
      {
        onUnlock: () => {
          void lostModeSetting.set({ ...lostModeSetting.signal.value, on: false });
          askingForPin.value = false;
        },
        onCancel: () => askingForPin.value = false
      }
    ) });
  }
  return /* @__PURE__ */ u$1("div", { class: "lost-mode", role: "alertdialog", "aria-label": "Lost device", "aria-describedby": "lost-mode-message", children: [
    /* @__PURE__ */ u$1("p", { class: "lost-mode__heading", children: "This device is lost" }),
    /* @__PURE__ */ u$1("p", { class: "lost-mode__big", children: "This is a critical communication device." }),
    named && /* @__PURE__ */ u$1("p", { class: "lost-mode__name", children: named }),
    /* @__PURE__ */ u$1("div", { id: "lost-mode-message", class: "lost-mode__details", children: [
      /* @__PURE__ */ u$1("p", { children: "Please return it to:" }),
      lost.returnTo.trim() && /* @__PURE__ */ u$1("p", { class: "lost-mode__line", children: lost.returnTo.trim() }),
      lost.address.trim() && /* @__PURE__ */ u$1("p", { class: "lost-mode__line", children: lost.address.trim() }),
      lost.phone.trim() && /* @__PURE__ */ u$1("p", { class: "lost-mode__line", children: [
        "Phone: ",
        lost.phone.trim()
      ] }),
      lost.note.trim() && /* @__PURE__ */ u$1("p", { class: "lost-mode__note", children: lost.note.trim() })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "lost-mode__actions", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "lost-mode__button", onClick: () => announceText(message, { keepInHistory: false }), children: "Read this out" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "lost-mode__button", onClick: () => askingForPin.value = true, children: "Owner: turn off" })
    ] })
  ] });
}
const CORE_WORD_BIGRAMS = {
  i: ["want", "like", "feel", "am", "need"],
  want: ["a drink", "more", "to", "help"],
  like: ["it", "more", "to"],
  more: ["please", "food", "juice"],
  no: ["thank you"],
  yes: ["please"],
  help: ["me", "please"],
  go: ["home", "to", "outside"],
  my: ["turn", "name is"],
  feel: ["happy", "sad", "tired", "worried"]
};
function splitWords(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}
function getSuggestions(currentText, vocabulary, frequency, maxSuggestions = 5) {
  const endsWithSpace = currentText.length > 0 && /\s$/.test(currentText);
  const words = splitWords(currentText);
  const currentWord = endsWithSpace ? "" : words[words.length - 1] ?? "";
  const previousWord = endsWithSpace ? words[words.length - 1] : words[words.length - 2];
  let candidates;
  if (currentWord) {
    const prefix = currentWord.toLowerCase();
    candidates = vocabulary.filter(
      (word2) => word2.toLowerCase().startsWith(prefix) && word2.toLowerCase() !== prefix
    );
  } else if (previousWord && CORE_WORD_BIGRAMS[previousWord.toLowerCase()]) {
    candidates = CORE_WORD_BIGRAMS[previousWord.toLowerCase()];
  } else {
    candidates = [];
  }
  return [...candidates].sort(
    (a2, b2) => (frequency[b2.toLowerCase()] ?? 0) - (frequency[a2.toLowerCase()] ?? 0) || a2.localeCompare(b2)
  ).slice(0, maxSuggestions);
}
function applySuggestion(currentText, suggestion) {
  const endsWithSpace = currentText.length > 0 && /\s$/.test(currentText);
  if (endsWithSpace || currentText.length === 0) {
    return `${currentText}${suggestion} `;
  }
  const words = currentText.split(/(\s+)/);
  words[words.length - 1] = suggestion;
  return `${words.join("")} `;
}
const WORD = /[\p{L}][\p{L}'’-]*/gu;
function wordsFromText(text) {
  return (text.match(WORD) ?? []).map((word2) => word2.replace(/['’-]+$/u, "")).filter((word2) => word2.length >= 2);
}
function collectPersonalWords(sources) {
  const seen2 = /* @__PURE__ */ new Map();
  const add = (text) => {
    for (const word2 of wordsFromText(text)) {
      if (!seen2.has(word2.toLowerCase())) seen2.set(word2.toLowerCase(), word2);
    }
  };
  for (const board2 of sources.boards) {
    for (const button of board2.buttons) {
      if (!button.hidden) add(button.label);
    }
  }
  for (const record of [...sources.people, ...sources.places]) add(record.name);
  for (const phrase of sources.customPhrases) add(phrase);
  for (const phrase of Object.values(sources.phraseBank)) add(phrase);
  return [...seen2.values()];
}
function mergeVocabulary(builtIn, personal) {
  const seen2 = new Set(builtIn.map((word2) => word2.toLowerCase()));
  return [...builtIn, ...personal.filter((word2) => !seen2.has(word2.toLowerCase()))];
}
const ROWS = {
  qwerty: ["1234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm"],
  // For people who have learned the alphabet in order rather than the
  // typewriter's: the same letters, in the order of the alphabet song.
  alphabetical: ["1234567890", "abcdefghi", "jklmnopqr", "stuvwxyz"]
};
function OnScreenKeyboard({ onKey, onSpace, onBackspace }) {
  return /* @__PURE__ */ u$1("div", { class: "on-screen-keyboard", children: [
    ROWS[keyboardLayoutSetting.signal.value].map((row, rowIndex) => /* @__PURE__ */ u$1("div", { class: "on-screen-keyboard__row", children: row.split("").map((char) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "on-screen-keyboard__key",
        onClick: () => onKey(char),
        children: char
      },
      char
    )) }, rowIndex)),
    /* @__PURE__ */ u$1("div", { class: "on-screen-keyboard__row", children: [
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "on-screen-keyboard__key on-screen-keyboard__key--space",
          onClick: onSpace,
          children: "space"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "on-screen-keyboard__key on-screen-keyboard__key--backspace",
          onClick: onBackspace,
          "aria-label": "Backspace",
          children: "⌫"
        }
      )
    ] })
  ] });
}
const SLOTS = [
  { id: "name", label: "Name" },
  { id: "address", label: "Address" },
  { id: "usualOrder", label: "Usual order" },
  { id: "registerAnswer", label: "Register answer" }
];
const EMPTY$1 = { name: "", address: "", usualOrder: "", registerAnswer: "" };
function PhraseBankTab() {
  const bank = useSignal(EMPTY$1);
  h$2(() => {
    void getPhraseBank().then((stored) => {
      bank.value = stored;
    });
  }, []);
  function handleInput(slot, value) {
    bank.value = { ...bank.value, [slot]: value };
    void setPhraseBankSlot(slot, value);
  }
  function handleSpeak(slot) {
    const text = bank.value[slot];
    if (!text) return;
    announceText(text);
  }
  const extra = customPhrasesSetting.signal.value;
  const draft = useSignal("");
  function addPhrase(event) {
    event.preventDefault();
    const text = draft.value.trim();
    if (!text) return;
    draft.value = "";
    void customPhrasesSetting.set([...customPhrasesSetting.signal.value, text]);
  }
  function removePhrase(index) {
    void customPhrasesSetting.set(customPhrasesSetting.signal.value.filter((_2, i2) => i2 !== index));
  }
  return /* @__PURE__ */ u$1("div", { class: "phrase-bank-tab", children: [
    SLOTS.map((slot) => /* @__PURE__ */ u$1("div", { class: "phrase-bank-tab__row", children: [
      /* @__PURE__ */ u$1("label", { class: "phrase-bank-tab__label", htmlFor: `phrase-${slot.id}`, children: slot.label }),
      /* @__PURE__ */ u$1(
        "input",
        {
          id: `phrase-${slot.id}`,
          class: "phrase-bank-tab__input",
          type: "text",
          value: bank.value[slot.id],
          onInput: (event) => handleInput(slot.id, event.target.value)
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "phrase-bank-tab__speak",
          disabled: !bank.value[slot.id],
          onClick: () => handleSpeak(slot.id),
          children: "Speak"
        }
      )
    ] }, slot.id)),
    /* @__PURE__ */ u$1("h2", { class: "phrase-bank-tab__heading", children: "More phrases" }),
    extra.map((phrase, index) => /* @__PURE__ */ u$1("div", { class: "phrase-bank-tab__row phrase-bank-tab__row--custom", children: [
      /* @__PURE__ */ u$1("span", { class: "phrase-bank-tab__phrase", children: phrase }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "phrase-bank-tab__speak", onClick: () => announceText(phrase), children: "Speak" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "phrase-bank-tab__remove",
          "aria-label": `Remove "${phrase}"`,
          onClick: () => removePhrase(index),
          children: "Remove"
        }
      )
    ] }, `${index}-${phrase}`)),
    /* @__PURE__ */ u$1("form", { class: "phrase-bank-tab__row", onSubmit: addPhrase, children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "phrase-bank-tab__input",
          type: "text",
          placeholder: "Add a phrase",
          "aria-label": "Add a phrase",
          value: draft.value,
          onInput: (event) => draft.value = event.target.value
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "submit", class: "phrase-bank-tab__speak", disabled: !draft.value.trim(), children: "Add" })
    ] })
  ] });
}
const CONVERSATION_STARTERS = [
  {
    id: "phone",
    label: "Phone",
    phrases: [
      "Hello, this is me speaking.",
      "Can you repeat that please?",
      "I'll call back later.",
      "Thank you, goodbye."
    ]
  },
  {
    id: "counter",
    label: "Counter",
    phrases: [
      "One please.",
      "Can I pay by card?",
      "Can I have a bag please?",
      "Thank you."
    ]
  },
  {
    id: "school",
    label: "School",
    phrases: [
      "Can you repeat that please?",
      "I don't understand.",
      "Can I go to the toilet?",
      "I've finished."
    ]
  },
  {
    id: "meeting-people",
    label: "Meeting people",
    phrases: [
      "Hello, nice to meet you.",
      "How are you?",
      "I'm well, thank you.",
      "Goodbye."
    ]
  }
];
function StartersTab() {
  return /* @__PURE__ */ u$1("div", { class: "starters-tab", children: CONVERSATION_STARTERS.map((category) => /* @__PURE__ */ u$1("section", { class: "starters-tab__category", children: [
    /* @__PURE__ */ u$1("h2", { class: "starters-tab__category-title", children: category.label }),
    /* @__PURE__ */ u$1("div", { class: "starters-tab__phrases", children: category.phrases.map((phrase) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "starters-tab__phrase",
        onClick: () => announceText(phrase),
        children: phrase
      },
      phrase
    )) })
  ] }, category.id)) });
}
const VOCABULARY = collectVocabularyWords();
function KeyboardScreen() {
  const tab = useSignal("keyboard");
  const text = useSignal("");
  const frequency = useSignal({});
  const noPressure = useSignal(false);
  const showing = useSignal(false);
  const vocabulary = useSignal(VOCABULARY);
  h$2(() => {
    void Promise.all([getAllBoards(), getPeople(), getPlaces(), getPhraseBank()]).then(
      ([boards, people, places, phraseBank]) => {
        const personal = collectPersonalWords({
          boards,
          people,
          places,
          customPhrases: customPhrasesSetting.signal.value,
          phraseBank
        });
        vocabulary.value = mergeVocabulary(VOCABULARY, personal);
      }
    );
  }, []);
  h$2(() => {
    void getWordFrequencies().then((loaded) => {
      frequency.value = loaded;
    });
  }, []);
  function pressKey(char) {
    text.value += char;
  }
  function pressSpace() {
    text.value += " ";
  }
  function pressBackspace() {
    text.value = text.value.slice(0, -1);
  }
  function pressSuggestion(word2) {
    text.value = applySuggestion(text.value, word2);
    void incrementWordFrequency(word2).then(() => getWordFrequencies()).then((updated) => {
      frequency.value = updated;
    });
  }
  function pressSpeak() {
    const trimmed = text.value.trim();
    if (!trimmed) return;
    announceText(trimmed);
  }
  const suggestions = getSuggestions(text.value, vocabulary.value, frequency.value);
  const showBody = noPressure.value || tab.value === "keyboard";
  return /* @__PURE__ */ u$1("div", { class: "keyboard-screen", children: [
    !noPressure.value && /* @__PURE__ */ u$1("div", { class: "page-tabs", children: [
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab.value === "keyboard",
          onClick: () => tab.value = "keyboard",
          children: "Keyboard"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab.value === "phrases",
          onClick: () => tab.value = "phrases",
          children: "Phrases"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "page-tabs__tab",
          "aria-pressed": tab.value === "starters",
          onClick: () => tab.value = "starters",
          children: "Starters"
        }
      )
    ] }),
    showBody && /* @__PURE__ */ u$1("div", { class: "keyboard-screen__body", children: [
      /* @__PURE__ */ u$1("div", { class: "keyboard-screen__toprow", children: [
        /* @__PURE__ */ u$1("div", { class: "keyboard-screen__textbox", children: text.value || " " }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "keyboard-screen__no-pressure-toggle",
            onClick: () => noPressure.value = !noPressure.value,
            children: noPressure.value ? "Exit no-pressure mode" : "No-pressure mode"
          }
        )
      ] }),
      !noPressure.value && /* @__PURE__ */ u$1("div", { class: "prediction-bar", children: [
        suggestions.length === 0 && /* @__PURE__ */ u$1("span", { class: "prediction-bar__empty", children: "…" }),
        suggestions.map((word2) => /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "prediction-bar__suggestion",
            onClick: () => pressSuggestion(word2),
            children: word2
          },
          word2
        ))
      ] }),
      /* @__PURE__ */ u$1(OnScreenKeyboard, { onKey: pressKey, onSpace: pressSpace, onBackspace: pressBackspace }),
      /* @__PURE__ */ u$1("div", { class: "keyboard-screen__actions", children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "sentence-strip__speak",
            disabled: !text.value.trim(),
            onClick: pressSpeak,
            children: "Speak"
          }
        ),
        !noPressure.value && /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "keyboard-screen__show",
            disabled: !text.value.trim(),
            onClick: () => showing.value = true,
            children: "Show"
          }
        )
      ] })
    ] }),
    !noPressure.value && tab.value === "phrases" && /* @__PURE__ */ u$1(PhraseBankTab, {}),
    !noPressure.value && tab.value === "starters" && /* @__PURE__ */ u$1(StartersTab, {}),
    showing.value && /* @__PURE__ */ u$1("button", { type: "button", class: "show-overlay", onClick: () => showing.value = false, children: /* @__PURE__ */ u$1("span", { class: "show-overlay__text", children: text.value.trim() }) })
  ] });
}
function addActivity(activities, activity) {
  return [...activities, activity];
}
function removeActivity(activities, id) {
  return activities.filter((activity) => activity.id !== id);
}
function moveActivity(activities, id, direction) {
  const index = activities.findIndex((activity) => activity.id === id);
  if (index === -1) return activities;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= activities.length) return activities;
  const next = [...activities];
  const a2 = next[index];
  const b2 = next[swapWith];
  next[index] = b2;
  next[swapWith] = a2;
  return next;
}
function updateActivity(activities, id, updates) {
  return activities.map((activity) => {
    if (activity.id !== id) return activity;
    const next = { ...activity, ...updates };
    if (updates.name === void 0 || updates.name === activity.name) return next;
    const original = activity.changedFrom ?? activity.name;
    if (updates.name === original) {
      delete next.changedFrom;
      return next;
    }
    return { ...next, changedFrom: original };
  });
}
function acknowledgeChange(activities, id) {
  return activities.map((activity) => {
    if (activity.id !== id) return activity;
    const copy = { ...activity };
    delete copy.changedFrom;
    return copy;
  });
}
function minutesUntil(activity, now) {
  if (!activity.time) return null;
  const parts = activity.time.split(":").map(Number);
  const hours = parts[0] ?? 0;
  const mins = parts[1] ?? 0;
  const target = new Date(now);
  target.setHours(hours, mins, 0, 0);
  return (target.getTime() - now.getTime()) / 6e4;
}
function getDueWarning(activity, now) {
  if (!activity.time || !activity.countdownMinutes || activity.finished) return null;
  const remaining = minutesUntil(activity, now);
  if (remaining === null || remaining > activity.countdownMinutes) return null;
  if (remaining <= 1 && remaining > 0) return "oneMinute";
  if (remaining <= 2 && remaining > 1) return "twoMinutes";
  return null;
}
const DEFAULT_SETTINGS$1 = { view: "today", countdownEnabled: false };
function MyDayScreen() {
  const dateString = useSignal(getDateString(/* @__PURE__ */ new Date()));
  const activities = useSignal([]);
  const settings = useSignal(DEFAULT_SETTINGS$1);
  const askingActivity = useSignal(null);
  const recentChange = useSignal(null);
  const warnedRef = A(/* @__PURE__ */ new Set());
  const announcedRef = A(/* @__PURE__ */ new Set());
  const loadingRef = A(false);
  const pendingDateRef = A(null);
  const version = dayPlanVersion.value;
  async function load(forDate) {
    const [{ plan }, daySettings] = await Promise.all([getEffectiveDayPlan(forDate), getDaySettings()]);
    settings.value = daySettings;
    activities.value = plan.activities;
    const changed = plan.activities.find(
      (activity) => activity.changedFrom && !announcedRef.current.has(activity.id)
    );
    if (changed) {
      announcedRef.current.add(changed.id);
      recentChange.value = { id: changed.id, oldName: changed.changedFrom };
      announceText(`The plan has changed. We are going to ${changed.name} instead.`);
      void saveDayPlan({ date: forDate, activities: acknowledgeChange(plan.activities, changed.id) });
      setTimeout(() => {
        if (recentChange.value?.id === changed.id) recentChange.value = null;
      }, 8e3);
    }
  }
  async function runLoad(forDate) {
    if (loadingRef.current) {
      pendingDateRef.current = forDate;
      return;
    }
    loadingRef.current = true;
    try {
      await load(forDate);
    } finally {
      loadingRef.current = false;
      if (pendingDateRef.current !== null) {
        const next = pendingDateRef.current;
        pendingDateRef.current = null;
        void runLoad(next);
      }
    }
  }
  h$2(() => {
    void runLoad(dateString.value);
  }, [dateString.value, version]);
  h$2(() => {
    const interval = setInterval(() => {
      const today2 = getDateString(/* @__PURE__ */ new Date());
      if (today2 !== dateString.value) dateString.value = today2;
    }, 6e4);
    return () => clearInterval(interval);
  }, []);
  h$2(() => {
    if (!settings.value.countdownEnabled) return;
    const interval = setInterval(() => {
      const now = /* @__PURE__ */ new Date();
      for (const activity of activities.value) {
        const level = getDueWarning(activity, now);
        if (!level) continue;
        const key = `${activity.id}:${level}`;
        if (warnedRef.current.has(key)) continue;
        warnedRef.current.add(key);
        announceCountdown(activity, level);
      }
    }, 15e3);
    return () => clearInterval(interval);
  }, [settings.value.countdownEnabled, activities.value]);
  function announceCountdown(activity, level) {
    const minutes = level === "twoMinutes" ? "2 minutes" : "1 minute";
    announceText(`${minutes} until ${activity.name}`);
  }
  function finishActivity(activity) {
    const updated = markFinished(activities.value, activity.id);
    activities.value = updated;
    void saveDayPlan({ date: dateString.value, activities: updated });
    askingActivity.value = null;
  }
  function askWhatsNext() {
    const { next } = classifyNowNextLater(activities.value);
    announceText(next ? `Next is ${next.name}` : "That's everything for today");
  }
  function askWhen(activity) {
    announceText(activity.time ? `${activity.name} at ${formatTime(activity.time)}` : `No time set for ${activity.name}`);
  }
  function askWhere(activity) {
    announceText(
      activity.location ? `${activity.name} is at ${activity.location}` : `No place set for ${activity.name}`
    );
  }
  function askWhoWith(activity) {
    announceText(
      activity.person ? `${activity.name} with ${activity.person}` : `No one set for ${activity.name}`
    );
  }
  function renderActivityCard(activity, current) {
    const struckName = activity.changedFrom ?? (recentChange.value?.id === activity.id ? recentChange.value.oldName : void 0);
    return /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: `day-activity${current ? " day-activity--current" : ""}${activity.finished ? " day-activity--finished" : ""}`,
        onClick: () => askingActivity.value = activity,
        children: [
          activity.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "day-activity__emoji", char: activity.image.char }),
          activity.image?.kind === "photo" && /* @__PURE__ */ u$1(PhotoThumbnail, { class: "day-activity__photo", blobId: activity.image.blobId, alt: "" }),
          /* @__PURE__ */ u$1("span", { class: "day-activity__name", children: [
            struckName && /* @__PURE__ */ u$1("span", { class: "day-activity__struck", children: struckName }),
            activity.name
          ] }),
          activity.time && /* @__PURE__ */ u$1("span", { class: "day-activity__time", children: formatTime(activity.time) })
        ]
      },
      activity.id
    );
  }
  const nowNextLater = classifyNowNextLater(activities.value);
  const finished = activities.value.filter((activity) => activity.finished);
  return /* @__PURE__ */ u$1("div", { class: "my-day-screen", children: [
    activities.value.length === 0 ? /* @__PURE__ */ u$1("p", { class: "my-day-screen__empty", children: "No plan for today yet." }) : settings.value.view === "nowNextLater" ? /* @__PURE__ */ u$1("div", { class: "my-day-screen__now-next-later", children: [
      /* @__PURE__ */ u$1("section", { class: "day-section", children: [
        /* @__PURE__ */ u$1("h2", { class: "day-section__title", children: "Now" }),
        nowNextLater.now ? renderActivityCard(nowNextLater.now, true) : /* @__PURE__ */ u$1("p", { children: "Nothing right now." })
      ] }),
      /* @__PURE__ */ u$1("section", { class: "day-section", children: [
        /* @__PURE__ */ u$1("h2", { class: "day-section__title", children: "Next" }),
        nowNextLater.next ? renderActivityCard(nowNextLater.next, false) : /* @__PURE__ */ u$1("p", { children: "Nothing next." })
      ] }),
      /* @__PURE__ */ u$1("section", { class: "day-section", children: [
        /* @__PURE__ */ u$1("h2", { class: "day-section__title", children: "Later" }),
        /* @__PURE__ */ u$1("div", { class: "day-section__list", children: nowNextLater.later.map((activity) => renderActivityCard(activity, false)) })
      ] })
    ] }) : /* @__PURE__ */ u$1("div", { class: "my-day-screen__today", children: [
      /* @__PURE__ */ u$1("div", { class: "day-section__list", children: activities.value.filter((activity) => !activity.finished).map((activity, index) => renderActivityCard(activity, index === 0)) }),
      finished.length > 0 && /* @__PURE__ */ u$1("section", { class: "day-section day-section--finished", children: [
        /* @__PURE__ */ u$1("h2", { class: "day-section__title", children: "Finished" }),
        /* @__PURE__ */ u$1("div", { class: "day-section__list", children: finished.map((activity) => renderActivityCard(activity, false)) })
      ] })
    ] }),
    askingActivity.value && /* @__PURE__ */ u$1("div", { class: "day-ask-overlay", children: [
      /* @__PURE__ */ u$1("p", { class: "day-ask-overlay__title", children: askingActivity.value.name }),
      /* @__PURE__ */ u$1("div", { class: "day-ask-overlay__questions", children: [
        /* @__PURE__ */ u$1("button", { type: "button", onClick: askWhatsNext, children: "What's next?" }),
        /* @__PURE__ */ u$1("button", { type: "button", onClick: () => askWhen(askingActivity.value), children: "When?" }),
        /* @__PURE__ */ u$1("button", { type: "button", onClick: () => askWhere(askingActivity.value), children: "Where?" }),
        /* @__PURE__ */ u$1("button", { type: "button", onClick: () => askWhoWith(askingActivity.value), children: "Who with?" }),
        /* @__PURE__ */ u$1("button", { type: "button", onClick: () => finishActivity(askingActivity.value), children: "Finished" })
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "day-ask-overlay__close", onClick: () => askingActivity.value = null, children: "Close" })
    ] })
  ] });
}
function slugify(label) {
  const base = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${base || "button"}-${Math.random().toString(36).slice(2, 7)}`;
}
function toggleButtonHidden(board2, buttonId) {
  return {
    ...board2,
    buttons: board2.buttons.map(
      (button) => button.id === buttonId ? { ...button, hidden: !button.hidden } : button
    )
  };
}
function updateButtonLabel(board2, buttonId, label) {
  return {
    ...board2,
    buttons: board2.buttons.map((button) => button.id === buttonId ? { ...button, label } : button)
  };
}
function flattenOrder(board2) {
  return board2.grid.order.flat();
}
function reshapeOrder(flat, rows, columns) {
  const padded = [...flat];
  while (padded.length < rows * columns) padded.push(null);
  const order = [];
  for (let r2 = 0; r2 < rows; r2 += 1) {
    order.push(padded.slice(r2 * columns, (r2 + 1) * columns));
  }
  return order;
}
function moveButton(board2, buttonId, direction) {
  const flat = flattenOrder(board2);
  const index = flat.indexOf(buttonId);
  if (index === -1) return board2;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= flat.length) return board2;
  const next = [...flat];
  const a2 = next[index];
  const b2 = next[swapWith];
  next[index] = b2;
  next[swapWith] = a2;
  return { ...board2, grid: { ...board2.grid, order: reshapeOrder(next, board2.grid.rows, board2.grid.columns) } };
}
function swapButtons(board2, firstId, secondId) {
  const flat = flattenOrder(board2);
  const first = flat.indexOf(firstId);
  const second = flat.indexOf(secondId);
  if (first === -1 || second === -1 || first === second) return board2;
  const next = [...flat];
  next[first] = secondId;
  next[second] = firstId;
  return { ...board2, grid: { ...board2.grid, order: reshapeOrder(next, board2.grid.rows, board2.grid.columns) } };
}
function hasEmptySlot(board2) {
  return flattenOrder(board2).includes(null);
}
function addButton(board2, item) {
  const flat = flattenOrder(board2);
  const emptyIndex = flat.indexOf(null);
  if (emptyIndex === -1) {
    throw new Error("No empty slot on this board. Resize the grid or remove a button first.");
  }
  const next = [...flat];
  next[emptyIndex] = item.id;
  return {
    ...board2,
    buttons: [...board2.buttons, item],
    grid: { ...board2.grid, order: reshapeOrder(next, board2.grid.rows, board2.grid.columns) }
  };
}
function resizeGrid(board2, rows, columns) {
  const placed = flattenOrder(board2).filter((id) => id !== null);
  if (placed.length > rows * columns) {
    throw new Error("Too many buttons for that grid size. Hide or remove some first.");
  }
  return { ...board2, grid: { rows, columns, order: reshapeOrder(placed, rows, columns) } };
}
function updateButton(board2, buttonId, changes) {
  return {
    ...board2,
    buttons: board2.buttons.map((button) => {
      if (button.id !== buttonId) return button;
      const next = { ...button };
      for (const [field, value] of Object.entries(changes)) {
        if (value === null) delete next[field];
        else if (value !== void 0) next[field] = value;
      }
      return next;
    })
  };
}
function removeButton(board2, buttonId) {
  return {
    ...board2,
    buttons: board2.buttons.filter((button) => button.id !== buttonId),
    grid: {
      ...board2.grid,
      order: board2.grid.order.map((row) => row.map((cell) => cell === buttonId ? null : cell))
    }
  };
}
function computeDownscaledSize(width, height, maxLongEdge = 800) {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdge) return { width, height };
  const scale = maxLongEdge / longEdge;
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}
function downscaleToBlob(source, sourceWidth, sourceHeight, maxLongEdge = 800) {
  const { width, height } = computeDownscaledSize(sourceWidth, sourceHeight, maxLongEdge);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("2D canvas context unavailable"));
  ctx.drawImage(source, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("canvas.toBlob produced no blob")),
      "image/jpeg",
      0.85
    );
  });
}
function PhotoCapture({ onCapture }) {
  const stream = useSignal(null);
  const error = useSignal(null);
  const videoRef = A(null);
  const fileInputRef = A(null);
  h$2(() => {
    const video = videoRef.current;
    if (!stream.value || !video) return;
    video.srcObject = stream.value;
    void video.play();
  }, [stream.value]);
  async function startCamera() {
    error.value = null;
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Camera unavailable";
    }
  }
  function stopCamera() {
    for (const track of stream.value?.getTracks() ?? []) track.stop();
    stream.value = null;
  }
  async function capture() {
    const video = videoRef.current;
    if (!video) return;
    const start = Date.now();
    while (video.videoWidth === 0 && Date.now() - start < 2e3) {
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    if (video.videoWidth === 0) {
      error.value = "Camera not ready yet. Try again.";
      return;
    }
    try {
      const blob = await downscaleToBlob(video, video.videoWidth, video.videoHeight);
      stopCamera();
      onCapture(blob);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Could not capture that photo";
    }
  }
  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    error.value = null;
    try {
      const bitmap = await createImageBitmap(file);
      const blob = await downscaleToBlob(bitmap, bitmap.width, bitmap.height);
      bitmap.close();
      onCapture(blob);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Could not read that image";
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }
  return /* @__PURE__ */ u$1("div", { class: "photo-capture", children: [
    stream.value ? /* @__PURE__ */ u$1("div", { class: "photo-capture__camera", children: [
      /* @__PURE__ */ u$1("video", { ref: videoRef, class: "photo-capture__video", muted: true, playsInline: true }),
      /* @__PURE__ */ u$1("div", { class: "photo-capture__row", children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "photo-capture__button", onClick: () => void capture(), children: "Take photo" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "photo-capture__button", onClick: stopCamera, children: "Cancel" })
      ] })
    ] }) : /* @__PURE__ */ u$1("div", { class: "photo-capture__row", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "photo-capture__button", onClick: () => void startCamera(), children: "Use camera" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "photo-capture__button", onClick: () => fileInputRef.current?.click(), children: "Import photo" }),
      /* @__PURE__ */ u$1(
        "input",
        {
          ref: fileInputRef,
          class: "photo-capture__file-input",
          type: "file",
          accept: "image/*",
          onChange: (event) => void handleFileChange(event)
        }
      )
    ] }),
    error.value && /* @__PURE__ */ u$1("p", { class: "photo-capture__error", children: error.value })
  ] });
}
function AddButtonForm({ board: board2, onChange, onError }) {
  const label = useSignal("");
  const emoji = useSignal("⭐");
  const colour = useSignal("things");
  const photo = useSignal(null);
  const saving = useSignal(false);
  async function handleSubmit(event) {
    event.preventDefault();
    const text = label.value.trim();
    if (!text || saving.value) return;
    saving.value = true;
    try {
      const photoId = photo.value ? await savePhoto(photo.value) : void 0;
      const item = {
        id: slugify(text),
        label: text,
        image: photoId ? { kind: "photo", blobId: photoId } : { kind: "emoji", char: emoji.value || "⭐" },
        background_color: FITZGERALD_COLORS[colour.value]
      };
      onChange(addButton(board2, item));
      label.value = "";
      photo.value = null;
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      saving.value = false;
    }
  }
  return /* @__PURE__ */ u$1("form", { class: "parent-mode-screen__add-form parent-mode-screen__add-button-form", onSubmit: (event) => void handleSubmit(event), children: [
    /* @__PURE__ */ u$1(
      "input",
      {
        class: "parent-mode-screen__label-input",
        type: "text",
        placeholder: "New button label",
        value: label.value,
        onInput: (event) => label.value = event.target.value
      }
    ),
    /* @__PURE__ */ u$1(
      "input",
      {
        class: "parent-mode-screen__emoji-input",
        type: "text",
        value: emoji.value,
        onInput: (event) => emoji.value = event.target.value,
        "aria-label": "Emoji"
      }
    ),
    /* @__PURE__ */ u$1(
      "select",
      {
        value: colour.value,
        "aria-label": "Colour",
        onChange: (event) => colour.value = event.target.value,
        children: FITZGERALD_CLASSES.map((cls) => /* @__PURE__ */ u$1("option", { value: cls, children: FITZGERALD_LABELS[cls] }, cls))
      }
    ),
    /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: saving.value, children: "Add button" }),
    /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__add-form-photo", children: [
      /* @__PURE__ */ u$1(PhotoCapture, { onCapture: (blob) => photo.value = blob }),
      photo.value && /* @__PURE__ */ u$1("p", { class: "people-places-tab__ready", children: "Photo ready: it will be used instead of the emoji." })
    ] })
  ] });
}
function VoiceClipRecorder({ onRecorded }) {
  const recording = useSignal(false);
  const error = useSignal(null);
  const recorderRef = A(null);
  const chunksRef = A([]);
  async function startRecording() {
    error.value = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        for (const track of stream.getTracks()) track.stop();
        onRecorded(blob);
      };
      recorder.start();
      recorderRef.current = recorder;
      recording.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Microphone unavailable";
    }
  }
  function stopRecording() {
    recorderRef.current?.stop();
    recording.value = false;
  }
  return /* @__PURE__ */ u$1("div", { class: "voice-clip-recorder", children: [
    recording.value ? /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "voice-clip-recorder__button voice-clip-recorder__button--recording",
        onClick: stopRecording,
        children: "Stop recording"
      }
    ) : /* @__PURE__ */ u$1("button", { type: "button", class: "voice-clip-recorder__button", onClick: () => void startRecording(), children: "Record voice clip" }),
    error.value && /* @__PURE__ */ u$1("p", { class: "voice-clip-recorder__error", children: error.value })
  ] });
}
function useRowDragDrop(onSwap) {
  const draggingId = useSignal(null);
  const overId = useSignal(null);
  return {
    draggingId,
    overId,
    start(event, id) {
      draggingId.value = id;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      }
    },
    end() {
      draggingId.value = null;
      overId.value = null;
    },
    over(event, id) {
      if (draggingId.value === null || draggingId.value === id) return;
      event.preventDefault();
      if (overId.value !== id) overId.value = id;
    },
    drop(event, id) {
      event.preventDefault();
      const dragged = draggingId.value;
      draggingId.value = null;
      overId.value = null;
      if (dragged !== null && dragged !== id) onSwap(dragged, id);
    }
  };
}
function ButtonList({ board: board2, onChange }) {
  const openId = useSignal(null);
  const confirmRemoveId = useSignal(null);
  const drag = useRowDragDrop((draggedId, targetId) => onChange(swapButtons(board2, draggedId, targetId)));
  const change = (id, changes) => onChange(updateButton(board2, id, changes));
  async function handlePhoto(item, blob) {
    const blobId = await savePhoto(blob);
    change(item.id, { image: { kind: "photo", blobId } });
  }
  async function handleVoiceClip(item, blob) {
    const blobId = await saveVoiceClip(blob);
    change(item.id, { voiceClipBlobId: blobId });
  }
  return /* @__PURE__ */ u$1("ul", { class: "parent-mode-screen__button-list", children: board2.buttons.map((button) => {
    const open = openId.value === button.id;
    const emoji = button.image?.kind === "emoji" ? button.image.char : "";
    return /* @__PURE__ */ u$1(
      "li",
      {
        class: `parent-mode-screen__button-row${drag.overId.value === button.id ? " parent-mode-screen__button-row--drop-target" : ""}${open ? " parent-mode-screen__button-row--open" : ""}`,
        onDragOver: (event) => drag.over(event, button.id),
        onDrop: (event) => drag.drop(event, button.id),
        children: [
          /* @__PURE__ */ u$1(
            "span",
            {
              class: "parent-mode-screen__drag-handle",
              draggable: true,
              role: "img",
              "aria-label": `Drag ${button.label} to swap places with another button`,
              onDragStart: (event) => drag.start(event, button.id),
              onDragEnd: () => drag.end(),
              children: "⠿"
            }
          ),
          /* @__PURE__ */ u$1(
            "input",
            {
              class: "parent-mode-screen__label-input",
              type: "text",
              value: button.label,
              onInput: (event) => onChange(updateButtonLabel(board2, button.id, event.target.value))
            }
          ),
          /* @__PURE__ */ u$1("label", { class: "parent-mode-screen__hidden-toggle", children: [
            /* @__PURE__ */ u$1(
              "input",
              {
                type: "checkbox",
                checked: Boolean(button.hidden),
                onChange: () => onChange(toggleButtonHidden(board2, button.id))
              }
            ),
            "Hidden"
          ] }),
          /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__move-button",
              onClick: () => onChange(moveButton(board2, button.id, "up")),
              "aria-label": `Move ${button.label} earlier`,
              children: "▲"
            }
          ),
          /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__move-button",
              onClick: () => onChange(moveButton(board2, button.id, "down")),
              "aria-label": `Move ${button.label} later`,
              children: "▼"
            }
          ),
          /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__details-toggle",
              "aria-expanded": open,
              "aria-label": `Details for ${button.label}`,
              onClick: () => {
                openId.value = open ? null : button.id;
                confirmRemoveId.value = null;
              },
              children: "Details"
            }
          ),
          open && /* @__PURE__ */ u$1("div", { class: "button-details", children: [
            /* @__PURE__ */ u$1("label", { class: "button-details__field", children: [
              "What it says, if different from the label",
              /* @__PURE__ */ u$1(
                "input",
                {
                  class: "button-details__input",
                  type: "text",
                  placeholder: button.label,
                  value: button.vocalization ?? "",
                  onInput: (event) => change(button.id, { vocalization: event.target.value || null })
                }
              )
            ] }),
            /* @__PURE__ */ u$1("label", { class: "button-details__field", children: [
              "Colour (the kind of word)",
              /* @__PURE__ */ u$1(
                "select",
                {
                  class: "button-details__input",
                  value: classOfColor(button.background_color) ?? "",
                  onChange: (event) => {
                    const cls = event.target.value;
                    if (cls) change(button.id, { background_color: FITZGERALD_COLORS[cls] });
                  },
                  children: [
                    !classOfColor(button.background_color) && /* @__PURE__ */ u$1("option", { value: "", children: "Not set" }),
                    FITZGERALD_CLASSES.map((cls) => /* @__PURE__ */ u$1("option", { value: cls, children: FITZGERALD_LABELS[cls] }, cls))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u$1("div", { class: "button-details__field", children: [
              "Picture",
              button.image?.kind === "photo" ? /* @__PURE__ */ u$1("div", { class: "button-details__picture", children: [
                /* @__PURE__ */ u$1(PhotoThumbnail, { class: "button-details__thumb", blobId: button.image.blobId, alt: "" }),
                /* @__PURE__ */ u$1(
                  "button",
                  {
                    type: "button",
                    class: "parent-mode-screen__button",
                    onClick: () => change(button.id, { image: { kind: "emoji", char: "⭐" } }),
                    children: "Use an emoji instead"
                  }
                )
              ] }) : /* @__PURE__ */ u$1("label", { class: "button-details__inline", children: [
                "Emoji",
                /* @__PURE__ */ u$1(
                  "input",
                  {
                    class: "parent-mode-screen__emoji-input",
                    type: "text",
                    value: emoji,
                    "aria-label": `Emoji for ${button.label}`,
                    onInput: (event) => change(button.id, {
                      image: { kind: "emoji", char: event.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ u$1(PhotoCapture, { onCapture: (blob) => void handlePhoto(button, blob) })
            ] }),
            /* @__PURE__ */ u$1("div", { class: "button-details__field", children: [
              "Recorded voice",
              button.voiceClipBlobId ? /* @__PURE__ */ u$1("div", { class: "button-details__inline", children: [
                /* @__PURE__ */ u$1("span", { children: "A recorded voice is set." }),
                /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void announceItem(button), children: "Hear it" }),
                /* @__PURE__ */ u$1(
                  "button",
                  {
                    type: "button",
                    class: "parent-mode-screen__button",
                    onClick: () => change(button.id, { voiceClipBlobId: null }),
                    children: "Remove the recording"
                  }
                )
              ] }) : /* @__PURE__ */ u$1(VoiceClipRecorder, { onRecorded: (blob) => void handleVoiceClip(button, blob) })
            ] }),
            /* @__PURE__ */ u$1("label", { class: "button-details__field", children: [
              "Word stage",
              /* @__PURE__ */ u$1(
                "select",
                {
                  class: "button-details__input",
                  value: button.stage ?? "",
                  onChange: (event) => {
                    const value = event.target.value;
                    change(button.id, { stage: value ? Number(value) : null });
                  },
                  children: [
                    /* @__PURE__ */ u$1("option", { value: "", children: "Always shown" }),
                    WORD_STAGES.map((stage) => /* @__PURE__ */ u$1("option", { value: stage, children: [
                      "Stage ",
                      stage,
                      wordStageSetting.signal.value !== 0 && stage > wordStageSetting.signal.value ? " (not shown yet)" : ""
                    ] }, stage))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u$1("label", { class: "button-details__check", children: [
              /* @__PURE__ */ u$1(
                "input",
                {
                  type: "checkbox",
                  checked: Boolean(button.target),
                  onChange: () => change(button.id, { target: button.target ? null : true })
                }
              ),
              "Focus word (shown with a blue outline)"
            ] }),
            confirmRemoveId.value === button.id ? /* @__PURE__ */ u$1("div", { class: "button-details__inline", children: [
              /* @__PURE__ */ u$1("span", { children: [
                "Remove “",
                button.label,
                "” from this board?"
              ] }),
              /* @__PURE__ */ u$1(
                "button",
                {
                  type: "button",
                  class: "parent-mode-screen__button button-details__danger",
                  onClick: () => {
                    confirmRemoveId.value = null;
                    openId.value = null;
                    onChange(removeButton(board2, button.id));
                  },
                  children: "Yes, remove it"
                }
              ),
              /* @__PURE__ */ u$1(
                "button",
                {
                  type: "button",
                  class: "parent-mode-screen__button",
                  onClick: () => confirmRemoveId.value = null,
                  children: "Keep it"
                }
              )
            ] }) : /* @__PURE__ */ u$1(
              "button",
              {
                type: "button",
                class: "parent-mode-screen__button button-details__danger",
                onClick: () => confirmRemoveId.value = button.id,
                children: "Remove this button"
              }
            )
          ] })
        ]
      },
      button.id
    );
  }) });
}
function newStarterWordsAvailable(boards) {
  const have = new Set(boards.map((board2) => board2.id));
  return STARTER_BOARDS.some((starter) => !have.has(starter.id));
}
function atLeast(size, wanted) {
  return VALID_GRID_SIZES.find((candidate) => candidate >= Math.max(size, wanted)) ?? 5;
}
function mergeStarterBoards(existing) {
  const byId = new Map(existing.map((board2) => [board2.id, board2]));
  const changed = [];
  for (const starter of STARTER_BOARDS) {
    const current = byId.get(starter.id);
    if (!current) {
      changed.push(structuredClone(starter));
      continue;
    }
    const rows = atLeast(current.grid.rows, starter.grid.rows);
    const columns = atLeast(current.grid.columns, starter.grid.columns);
    const order = Array.from(
      { length: rows },
      (_2, r2) => Array.from({ length: columns }, (_22, c2) => current.grid.order[r2]?.[c2] ?? null)
    );
    const haveIds = new Set(current.buttons.map((button) => button.id));
    const added = [];
    for (const button of starter.buttons) {
      if (haveIds.has(button.id)) continue;
      const wanted = starter.grid.order.flatMap((row, r2) => row.map((id, c2) => ({ id, r: r2, c: c2 }))).find((cell) => cell.id === button.id);
      let slot = wanted && order[wanted.r]?.[wanted.c] === null ? { r: wanted.r, c: wanted.c } : void 0;
      for (let r2 = 0; r2 < rows && !slot; r2 += 1) {
        for (let c2 = 0; c2 < columns && !slot; c2 += 1) {
          if (order[r2][c2] === null) slot = { r: r2, c: c2 };
        }
      }
      if (!slot) continue;
      order[slot.r][slot.c] = button.id;
      added.push(structuredClone(button));
    }
    const grew = rows !== current.grid.rows || columns !== current.grid.columns;
    if (added.length > 0 || grew) {
      changed.push({ ...current, grid: { rows, columns, order }, buttons: [...current.buttons, ...added] });
    }
  }
  return changed;
}
function BoardsTab() {
  const boards = useSignal([]);
  const selectedBoardId = useSignal(null);
  const newFolderName = useSignal("");
  const newFolderEmoji = useSignal("📁");
  const newFolderClass = useSignal("things");
  const confirmRestore = useSignal(false);
  const confirmNewWords = useSignal(false);
  const addedNewWords = useSignal(false);
  const error = useSignal(null);
  h$2(() => {
    void getAllBoards().then((loaded) => {
      const sorted = [...loaded].sort(
        (a2, b2) => a2.id === ROOT_BOARD_ID ? -1 : b2.id === ROOT_BOARD_ID ? 1 : a2.name.localeCompare(b2.name)
      );
      boards.value = sorted;
      selectedBoardId.value = sorted[0]?.id ?? null;
    });
  }, []);
  const selectedBoard = boards.value.find((board2) => board2.id === selectedBoardId.value) ?? null;
  const starterVersion = STARTER_BOARDS.find((board2) => board2.id === selectedBoardId.value);
  async function persist(next) {
    error.value = null;
    boards.value = boards.value.map((board2) => board2.id === next.id ? next : board2);
    await updateBoard(next);
  }
  function resize(rows, columns) {
    if (!selectedBoard) return;
    try {
      void persist(resizeGrid(selectedBoard, rows, columns));
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    }
  }
  async function addNewStarterWords() {
    confirmNewWords.value = false;
    const changed = mergeStarterBoards(boards.value);
    for (const board2 of changed) await updateBoard(board2);
    const byId = new Map(changed.map((board2) => [board2.id, board2]));
    const merged = boards.value.map((board2) => byId.get(board2.id) ?? board2);
    const fresh = changed.filter((board2) => !boards.value.some((b2) => b2.id === board2.id));
    boards.value = [...merged, ...fresh].sort(
      (a2, b2) => a2.id === ROOT_BOARD_ID ? -1 : b2.id === ROOT_BOARD_ID ? 1 : a2.name.localeCompare(b2.name)
    );
    addedNewWords.value = true;
  }
  async function restoreStarter() {
    if (!starterVersion) return;
    confirmRestore.value = false;
    await persist(structuredClone(starterVersion));
  }
  async function handleAddFolder(event) {
    event.preventDefault();
    const name = newFolderName.value.trim();
    if (!selectedBoard || !name) return;
    if (!hasEmptySlot(selectedBoard)) {
      error.value = "No empty slot on this board. Resize the grid or remove a button first.";
      return;
    }
    const folder2 = await createBoard(name);
    const item = {
      id: slugify(name),
      label: name,
      image: { kind: "emoji", char: newFolderEmoji.value || "📁" },
      background_color: FITZGERALD_COLORS[newFolderClass.value],
      load_board: { id: folder2.id }
    };
    boards.value = [...boards.value, folder2];
    await persist(addButton(selectedBoard, item));
    newFolderName.value = "";
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body", children: [
    newStarterWordsAvailable(boards.value) && /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__restore boards-tab__new-words", children: confirmNewWords.value ? /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("span", { children: "Add the newer starter words (animals, body, clothes, doing words, greetings, colours, numbers and weather, and more words on the pages you have)? Every button you have stays exactly where it is. The Talk page gets bigger, so its buttons get a little smaller." }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void addNewStarterWords(), children: "Yes, add them" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmNewWords.value = false, children: "Not now" })
    ] }) : /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmNewWords.value = true, children: "Add the newer starter words" }) }),
    addedNewWords.value && /* @__PURE__ */ u$1("p", { role: "status", children: "The newer starter words are added." }),
    /* @__PURE__ */ u$1("label", { class: "parent-mode-screen__board-picker", children: [
      "Board",
      /* @__PURE__ */ u$1(
        "select",
        {
          value: selectedBoardId.value ?? "",
          onChange: (event) => {
            selectedBoardId.value = event.target.value;
            confirmRestore.value = false;
          },
          children: boards.value.map((board2) => /* @__PURE__ */ u$1("option", { value: board2.id, children: board2.name }, board2.id))
        }
      )
    ] }),
    error.value && /* @__PURE__ */ u$1("p", { class: "parent-mode-screen__error", children: error.value }),
    selectedBoard && /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__grid-size", children: [
        /* @__PURE__ */ u$1("span", { children: "Grid size" }),
        /* @__PURE__ */ u$1("label", { children: [
          "rows",
          /* @__PURE__ */ u$1(
            "select",
            {
              value: selectedBoard.grid.rows,
              onChange: (event) => resize(Number(event.target.value), selectedBoard.grid.columns),
              children: VALID_GRID_SIZES.map((size) => /* @__PURE__ */ u$1("option", { value: size, children: size }, size))
            }
          )
        ] }),
        /* @__PURE__ */ u$1("label", { children: [
          "columns",
          /* @__PURE__ */ u$1(
            "select",
            {
              value: selectedBoard.grid.columns,
              onChange: (event) => resize(selectedBoard.grid.rows, Number(event.target.value)),
              children: VALID_GRID_SIZES.map((size) => /* @__PURE__ */ u$1("option", { value: size, children: size }, size))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u$1(ButtonList, { board: selectedBoard, onChange: (next) => void persist(next) }),
      /* @__PURE__ */ u$1(
        AddButtonForm,
        {
          board: selectedBoard,
          onChange: (next) => void persist(next),
          onError: (message) => error.value = message
        }
      ),
      !selectedBoard.id.startsWith("mypage-") && /* @__PURE__ */ u$1(
        "form",
        {
          class: "parent-mode-screen__add-form parent-mode-screen__add-folder",
          onSubmit: (event) => void handleAddFolder(event),
          children: [
            /* @__PURE__ */ u$1(
              "input",
              {
                class: "parent-mode-screen__label-input",
                type: "text",
                placeholder: "New folder name",
                "aria-label": "New folder name",
                value: newFolderName.value,
                onInput: (event) => newFolderName.value = event.target.value
              }
            ),
            /* @__PURE__ */ u$1(
              "input",
              {
                class: "parent-mode-screen__emoji-input",
                type: "text",
                value: newFolderEmoji.value,
                onInput: (event) => newFolderEmoji.value = event.target.value,
                "aria-label": "Folder emoji"
              }
            ),
            /* @__PURE__ */ u$1(
              "select",
              {
                value: newFolderClass.value,
                "aria-label": "Folder colour",
                onChange: (event) => newFolderClass.value = event.target.value,
                children: FITZGERALD_CLASSES.map((cls) => /* @__PURE__ */ u$1("option", { value: cls, children: FITZGERALD_LABELS[cls] }, cls))
              }
            ),
            /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", children: "Add folder" })
          ]
        }
      ),
      starterVersion && /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__restore", children: confirmRestore.value ? /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1("span", { children: [
          "Put “",
          selectedBoard.name,
          "” back exactly as it came, losing any changes you made to its words, positions and colours?"
        ] }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void restoreStarter(), children: "Yes, put it back" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmRestore.value = false, children: "Keep my changes" })
      ] }) : /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmRestore.value = true, children: "Put this board back to the starter version" }) })
    ] })
  ] });
}
const MAX_OBF_CHARACTERS = 6e7;
async function blobToDataUri(blob) {
  if (typeof blob.arrayBuffer === "function") {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (let i2 = 0; i2 < bytes.length; i2 += 32768) {
      binary += String.fromCharCode(...bytes.subarray(i2, i2 + 32768));
    }
    return `data:${blob.type || "application/octet-stream"};base64,${btoa(binary)}`;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
async function dataUriToBlob(uri) {
  return (await fetch(uri)).blob();
}
async function boardToObf(board2, sources) {
  const images = [];
  const sounds = [];
  const buttons = [];
  for (const item of board2.buttons) {
    const button = { id: item.id, label: item.label };
    if (item.vocalization) button.vocalization = item.vocalization;
    if (item.background_color) button.background_color = item.background_color;
    if (item.hidden) button.hidden = true;
    if (item.stage) button.ext_my_speech_stage = item.stage;
    if (item.target) button.ext_my_speech_target = true;
    if (item.image?.kind === "emoji") {
      button.ext_my_speech_emoji = item.image.char;
    } else if (item.image?.kind === "photo") {
      const blob = await sources.getPhoto(item.image.blobId);
      if (blob) {
        const id = `image-${images.length + 1}`;
        images.push({ id, content_type: blob.type || "image/jpeg", data: await blobToDataUri(blob) });
        button.image_id = id;
      }
    }
    if (item.voiceClipBlobId) {
      const blob = await sources.getClip(item.voiceClipBlobId);
      if (blob) {
        const id = `sound-${sounds.length + 1}`;
        sounds.push({ id, content_type: blob.type || "audio/webm", data: await blobToDataUri(blob) });
        button.sound_id = id;
      }
    }
    buttons.push(button);
  }
  return {
    format: "open-board-0.1",
    id: board2.id,
    locale: "en",
    name: board2.name,
    grid: { rows: board2.grid.rows, columns: board2.grid.columns, order: board2.grid.order },
    buttons,
    images,
    sounds
  };
}
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const NOT_A_PAGE = "This file isn't a page this app can read.";
const COLOUR_VALUES = new Set(Object.values(FITZGERALD_COLORS));
const MAX_SIZE = VALID_GRID_SIZES[VALID_GRID_SIZES.length - 1];
const MIN_SIZE = VALID_GRID_SIZES[0];
async function obfToPage(text, storage) {
  if (text.length > MAX_OBF_CHARACTERS) return { ok: false, error: "That file is too big to be a page." };
  let parsed2;
  try {
    parsed2 = JSON.parse(text);
  } catch {
    return { ok: false, error: NOT_A_PAGE };
  }
  if (!isRecord(parsed2) || typeof parsed2["format"] !== "string" || !parsed2["format"].startsWith("open-board-")) {
    return { ok: false, error: NOT_A_PAGE };
  }
  const gridIn = parsed2["grid"];
  if (!isRecord(gridIn) || !Array.isArray(parsed2["buttons"])) return { ok: false, error: NOT_A_PAGE };
  const orderIn = Array.isArray(gridIn["order"]) ? gridIn["order"] : [];
  const rowsIn = Number(gridIn["rows"] ?? orderIn.length);
  const columnsIn = Number(gridIn["columns"] ?? (Array.isArray(orderIn[0]) ? orderIn[0].length : 0));
  if (!Number.isInteger(rowsIn) || !Number.isInteger(columnsIn) || rowsIn < 1 || columnsIn < 1) {
    return { ok: false, error: NOT_A_PAGE };
  }
  if (rowsIn > MAX_SIZE || columnsIn > MAX_SIZE) {
    return {
      ok: false,
      error: `This page is ${columnsIn} by ${rowsIn}. This app's pages go up to ${MAX_SIZE} by ${MAX_SIZE}.`
    };
  }
  const rows = Math.max(rowsIn, MIN_SIZE);
  const columns = Math.max(columnsIn, MIN_SIZE);
  const imagesById = /* @__PURE__ */ new Map();
  for (const image of Array.isArray(parsed2["images"]) ? parsed2["images"] : []) {
    if (isRecord(image) && typeof image["id"] === "string" && typeof image["data"] === "string") {
      const type = String(image["content_type"] ?? "");
      if (type.startsWith("image/") && image["data"].startsWith("data:")) {
        imagesById.set(image["id"], { content_type: type, data: image["data"] });
      }
    }
  }
  const soundsById = /* @__PURE__ */ new Map();
  for (const sound of Array.isArray(parsed2["sounds"]) ? parsed2["sounds"] : []) {
    if (isRecord(sound) && typeof sound["id"] === "string" && typeof sound["data"] === "string") {
      const type = String(sound["content_type"] ?? "");
      if (type.startsWith("audio/") && sound["data"].startsWith("data:")) {
        soundsById.set(sound["id"], { content_type: type, data: sound["data"] });
      }
    }
  }
  const notes = [];
  let foldersFlattened = 0;
  let coloursDropped = 0;
  const used = /* @__PURE__ */ new Set();
  const items = /* @__PURE__ */ new Map();
  for (const [index, raw] of parsed2["buttons"].entries()) {
    if (!isRecord(raw)) continue;
    const label = typeof raw["label"] === "string" ? raw["label"] : "";
    let id = typeof raw["id"] === "string" && raw["id"] ? raw["id"] : `button-${index + 1}`;
    while (used.has(id)) id = `${id}-${index + 1}`;
    used.add(id);
    const item = { id, label };
    if (typeof raw["vocalization"] === "string" && raw["vocalization"]) item.vocalization = raw["vocalization"];
    if (raw["hidden"] === true) item.hidden = true;
    if (raw["load_board"]) foldersFlattened += 1;
    const colour = typeof raw["background_color"] === "string" ? raw["background_color"].toLowerCase() : void 0;
    if (colour && COLOUR_VALUES.has(colour)) item.background_color = colour;
    else if (colour) coloursDropped += 1;
    const stage = raw["ext_my_speech_stage"];
    if (typeof stage === "number" && WORD_STAGES.includes(stage)) item.stage = stage;
    if (raw["ext_my_speech_target"] === true) item.target = true;
    const emoji = raw["ext_my_speech_emoji"];
    const image = typeof raw["image_id"] === "string" ? imagesById.get(raw["image_id"]) : void 0;
    if (typeof emoji === "string" && emoji) {
      item.image = { kind: "emoji", char: emoji };
    } else if (image) {
      try {
        item.image = { kind: "photo", blobId: await storage.savePhoto(await dataUriToBlob(image.data)) };
      } catch {
      }
    }
    const sound = typeof raw["sound_id"] === "string" ? soundsById.get(raw["sound_id"]) : void 0;
    if (sound) {
      try {
        item.voiceClipBlobId = await storage.saveClip(await dataUriToBlob(sound.data));
      } catch {
      }
    }
    items.set(id, item);
  }
  const order = Array.from({ length: rows }, () => Array.from({ length: columns }, () => null));
  const placed = /* @__PURE__ */ new Set();
  orderIn.forEach((row, r2) => {
    if (!Array.isArray(row) || r2 >= rows) return;
    row.forEach((cell, c2) => {
      if (c2 < columns && typeof cell === "string" && items.has(cell) && !placed.has(cell)) {
        order[r2][c2] = cell;
        placed.add(cell);
      }
    });
  });
  let skipped = 0;
  for (const id of items.keys()) {
    if (placed.has(id)) continue;
    const free = order.flatMap((row, r2) => row.map((cell, c2) => ({ r: r2, c: c2, cell }))).find((slot) => slot.cell === null);
    if (!free) {
      skipped += 1;
      items.delete(id);
      continue;
    }
    order[free.r][free.c] = id;
    placed.add(id);
  }
  if (foldersFlattened > 0) {
    notes.push(
      `${foldersFlattened} button${foldersFlattened === 1 ? "" : "s"} opened other boards in the original. They are ordinary buttons here.`
    );
  }
  if (coloursDropped > 0) {
    notes.push("Colours from the other app were not kept, because colour here shows the kind of word. Set them in Details.");
  }
  if (skipped > 0) notes.push(`${skipped} button${skipped === 1 ? "" : "s"} did not fit and were left out.`);
  const name = typeof parsed2["name"] === "string" && parsed2["name"].trim() ? parsed2["name"].trim() : "Shared page";
  return { ok: true, name, grid: { rows, columns, order }, buttons: [...items.values()], notes };
}
function obfToText(obf) {
  return JSON.stringify(obf, null, 2);
}
async function exportMyPageText(page) {
  const board2 = await getBoard(page.boardId);
  if (!board2) return null;
  return obfToText(await boardToObf({ ...board2, name: page.name }, { getPhoto, getClip: getVoiceClip }));
}
async function importMyPageFromText(text) {
  const result = await obfToPage(text, { savePhoto, saveClip: saveVoiceClip });
  if (!result.ok) return result;
  const page = await createMyPage(result.name);
  const board2 = await getBoard(page.boardId);
  if (board2) await updateBoard({ ...board2, grid: result.grid, buttons: result.buttons });
  return { ok: true, page, notes: result.notes };
}
function suggestedPageFileName(page) {
  const slug2 = page.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug2 || "page"}.obf`;
}
const MAX_PAGE_BUTTONS = 25;
function gridSizeFor(count) {
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  if (count <= 16) return 4;
  return 5;
}
async function createPageWithButtons(name, specs) {
  const chosen = specs.slice(0, MAX_PAGE_BUTTONS);
  const size = gridSizeFor(chosen.length);
  const page = await createMyPage(name);
  const buttons = chosen.map((spec, index) => ({
    id: `button-${index + 1}`,
    label: spec.label,
    ...spec.says && spec.says !== spec.label ? { vocalization: spec.says } : {},
    ...spec.emoji ? { image: { kind: "emoji", char: spec.emoji } } : {},
    background_color: FITZGERALD_COLORS[spec.colour ?? "things"]
  }));
  const order = Array.from(
    { length: size },
    (_2, row) => Array.from({ length: size }, (_22, column) => buttons[row * size + column]?.id ?? null)
  );
  const board2 = await getBoard(page.boardId);
  if (board2) await updateBoard({ ...board2, grid: { rows: size, columns: size, order }, buttons });
  return page;
}
const PAGE_TEMPLATES = [
  {
    id: "snacks",
    name: "Snack choices",
    description: "Pick a snack. Replace these with the ones that are really on offer.",
    buttons: [
      { label: "apple", emoji: "🍎", says: "I want an apple" },
      { label: "banana", emoji: "🍌", says: "I want a banana" },
      { label: "biscuit", emoji: "🍪", says: "I want a biscuit" },
      { label: "cheese", emoji: "🧀", says: "I want cheese" },
      { label: "grapes", emoji: "🍇", says: "I want grapes" },
      { label: "carrot", emoji: "🥕", says: "I want a carrot" },
      { label: "nothing", emoji: "🚫", says: "I do not want a snack", colour: "noStop" }
    ]
  },
  {
    id: "drinks",
    name: "Drink choices",
    description: "A few drinks to choose between.",
    buttons: [
      { label: "water", emoji: "💧", says: "I want water" },
      { label: "milk", emoji: "🥛", says: "I want milk" },
      { label: "juice", emoji: "🧃", says: "I want juice" },
      { label: "squash", emoji: "🥤", says: "I want squash" }
    ]
  },
  {
    id: "playground",
    name: "Playground",
    description: "Things to ask for or say outside.",
    buttons: [
      { label: "ball", emoji: "⚽", colour: "things", says: "I want the ball" },
      { label: "bike", emoji: "🚲", colour: "things", says: "I want the bike" },
      { label: "run", emoji: "🏃", colour: "doing", says: "I want to run" },
      { label: "climb", emoji: "🤸", colour: "doing", says: "I want to climb" },
      { label: "roundabout", emoji: "🎠", colour: "things", says: "I want the roundabout" },
      { label: "my turn", emoji: "👆", colour: "social", says: "It is my turn" },
      { label: "your turn", emoji: "🤝", colour: "social", says: "It is your turn" },
      { label: "stop", emoji: "✋", colour: "noStop", says: "Stop, please" },
      { label: "inside", emoji: "🏠", colour: "places", says: "I want to go inside" }
    ]
  },
  {
    id: "classroom",
    name: "Classroom requests",
    description: "Things to ask for in a lesson.",
    buttons: [
      { label: "help", emoji: "🙋", colour: "social", says: "I need help" },
      { label: "question", emoji: "❓", colour: "social", says: "I have a question" },
      { label: "break", emoji: "⏸️", colour: "social", says: "I need a break" },
      { label: "toilet", emoji: "🚻", colour: "places", says: "I need the toilet" },
      { label: "drink", emoji: "💧", colour: "things", says: "Can I have a drink?" },
      { label: "pencil", emoji: "✏️", colour: "things", says: "I need a pencil" },
      { label: "say again", emoji: "🔁", colour: "social", says: "Can you say that again, please?" },
      { label: "finished", emoji: "✅", colour: "social", says: "I've finished" },
      { label: "don't understand", emoji: "🤔", colour: "social", says: "I don't understand" }
    ]
  },
  {
    id: "manners",
    name: "Hello and thank you",
    description: "Greetings and manners.",
    buttons: [
      { label: "hello", emoji: "👋", colour: "social", says: "Hello" },
      { label: "goodbye", emoji: "👋", colour: "social", says: "Goodbye" },
      { label: "please", emoji: "🙏", colour: "social", says: "Please" },
      { label: "thank you", emoji: "😊", colour: "social", says: "Thank you" },
      { label: "sorry", emoji: "😔", colour: "social", says: "Sorry" },
      { label: "excuse me", emoji: "🙇", colour: "social", says: "Excuse me" },
      { label: "how are you?", emoji: "💬", colour: "social", says: "How are you?" },
      { label: "I'm fine", emoji: "👍", colour: "social", says: "I'm fine, thank you" },
      { label: "well done", emoji: "👏", colour: "social", says: "Well done" }
    ]
  },
  {
    id: "dressing",
    name: "Getting dressed",
    description: "What to put on, in the order of the morning.",
    buttons: [
      { label: "top", emoji: "👕", says: "Put my top on" },
      { label: "trousers", emoji: "👖", says: "Put my trousers on" },
      { label: "socks", emoji: "🧦", says: "Put my socks on" },
      { label: "shoes", emoji: "👟", says: "Put my shoes on" },
      { label: "coat", emoji: "🧥", says: "Put my coat on" },
      { label: "hat", emoji: "🧢", says: "Put my hat on" },
      { label: "help", emoji: "🙋", colour: "social", says: "Please help me" },
      { label: "all done", emoji: "✅", colour: "social", says: "I'm all dressed" }
    ]
  },
  {
    id: "bedtime",
    name: "Bedtime",
    description: "The steps before sleep.",
    buttons: [
      { label: "bath", emoji: "🛁", says: "I want a bath" },
      { label: "teeth", emoji: "🪥", says: "I am brushing my teeth" },
      { label: "story", emoji: "📖", says: "I want a story" },
      { label: "teddy", emoji: "🧸", says: "I want my teddy" },
      { label: "drink", emoji: "🥛", says: "I want a drink" },
      { label: "light", emoji: "💡", says: "Can I have the light on?" },
      { label: "cuddle", emoji: "🤗", colour: "social", says: "I want a cuddle" },
      { label: "goodnight", emoji: "😴", colour: "social", says: "Goodnight" }
    ]
  },
  {
    id: "cafe",
    name: "Café or shop",
    description: "Ordering and paying.",
    buttons: [
      { label: "I'd like…", emoji: "👉", colour: "doing", says: "I'd like" },
      { label: "menu", emoji: "📋", colour: "things", says: "Can I see the menu?" },
      { label: "water", emoji: "💧", colour: "things", says: "Can I have some water?" },
      { label: "the bill", emoji: "🧾", colour: "things", says: "Can I have the bill, please?" },
      { label: "pay by card", emoji: "💳", colour: "doing", says: "I would like to pay by card" },
      { label: "toilet", emoji: "🚻", colour: "places", says: "Where is the toilet?" },
      { label: "thank you", emoji: "😊", colour: "social", says: "Thank you" },
      { label: "too loud", emoji: "🔊", colour: "describing", says: "It's too loud in here" }
    ]
  },
  {
    id: "appointment",
    name: "Doctor or dentist",
    description: "Telling someone how you feel during a visit.",
    buttons: [
      { label: "it hurts", emoji: "🤕", colour: "describing", says: "It hurts" },
      { label: "I'm scared", emoji: "😨", colour: "describing", says: "I'm feeling scared" },
      { label: "stop", emoji: "✋", colour: "noStop", says: "Please stop" },
      { label: "break", emoji: "⏸️", colour: "social", says: "I need a break" },
      { label: "ready", emoji: "✅", colour: "social", says: "I'm ready" },
      { label: "tell me first", emoji: "🗣️", colour: "social", says: "Please tell me what you are going to do" },
      { label: "one more", emoji: "☝️", colour: "social", says: "One more, please" },
      { label: "all done", emoji: "🎉", colour: "social", says: "All done" }
    ]
  },
  {
    id: "maths",
    name: "Maths lesson",
    description: "Words for number work.",
    buttons: [
      { label: "add", emoji: "➕", colour: "doing", says: "Add" },
      { label: "take away", emoji: "➖", colour: "doing", says: "Take away" },
      { label: "more", emoji: "⬆️", colour: "describing", says: "More" },
      { label: "less", emoji: "⬇️", colour: "describing", says: "Less" },
      { label: "the same", emoji: "🟰", colour: "describing", says: "The same" },
      { label: "count", emoji: "🔢", colour: "doing", says: "Count" },
      { label: "big", emoji: "🐘", colour: "describing", says: "Big" },
      { label: "small", emoji: "🐭", colour: "describing", says: "Small" },
      { label: "I know", emoji: "💡", colour: "social", says: "I know the answer" }
    ]
  },
  {
    id: "science",
    name: "Science and nature",
    description: "Looking, finding out and talking about what happens.",
    buttons: [
      { label: "look", emoji: "👀", colour: "doing", says: "Look" },
      { label: "plant", emoji: "🌱", colour: "things", says: "Plant" },
      { label: "water", emoji: "💧", colour: "things", says: "Water" },
      { label: "hot", emoji: "🥵", colour: "describing", says: "Hot" },
      { label: "cold", emoji: "🥶", colour: "describing", says: "Cold" },
      { label: "sink", emoji: "⬇️", colour: "doing", says: "It sinks" },
      { label: "float", emoji: "🛶", colour: "doing", says: "It floats" },
      { label: "what happens?", emoji: "❓", colour: "social", says: "What happens next?" },
      { label: "it grew", emoji: "🌻", colour: "describing", says: "It grew" }
    ]
  },
  {
    id: "story",
    name: "Story time",
    description: "Joining in with a book.",
    buttons: [
      { label: "again", emoji: "🔁", colour: "social", says: "Read it again" },
      { label: "turn the page", emoji: "📖", colour: "doing", says: "Turn the page" },
      { label: "who?", emoji: "🧑", colour: "social", says: "Who is that?" },
      { label: "what next?", emoji: "❓", colour: "social", says: "What happens next?" },
      { label: "I like it", emoji: "😊", colour: "social", says: "I like this story" },
      { label: "funny", emoji: "😄", colour: "describing", says: "That is funny" },
      { label: "scary", emoji: "😨", colour: "describing", says: "That is scary" },
      { label: "the end", emoji: "🏁", colour: "social", says: "The end" }
    ]
  },
  {
    id: "pe",
    name: "PE and movement",
    description: "Getting ready and joining in.",
    buttons: [
      { label: "run", emoji: "🏃", colour: "doing", says: "Run" },
      { label: "jump", emoji: "🦘", colour: "doing", says: "Jump" },
      { label: "throw", emoji: "🤾", colour: "doing", says: "Throw" },
      { label: "catch", emoji: "🥎", colour: "doing", says: "Catch" },
      { label: "my turn", emoji: "🙋", colour: "social", says: "It is my turn" },
      { label: "tired", emoji: "😴", colour: "describing", says: "I am tired" },
      { label: "drink", emoji: "💧", colour: "things", says: "I need a drink" },
      { label: "shoes", emoji: "👟", colour: "things", says: "I need my shoes" },
      { label: "rest", emoji: "🪑", colour: "doing", says: "I need a rest" }
    ]
  },
  {
    id: "art",
    name: "Art and making",
    description: "Things to use and say while making something.",
    buttons: [
      { label: "paint", emoji: "🎨", colour: "things", says: "I want paint" },
      { label: "pencil", emoji: "✏️", colour: "things", says: "I want a pencil" },
      { label: "scissors", emoji: "✂️", colour: "things", says: "I need scissors" },
      { label: "glue", emoji: "🧴", colour: "things", says: "I need glue" },
      { label: "paper", emoji: "📄", colour: "things", says: "I need paper" },
      { label: "colour", emoji: "🌈", colour: "describing", says: "What colour?" },
      { label: "messy", emoji: "🖐️", colour: "describing", says: "My hands are messy" },
      { label: "wash hands", emoji: "🧼", colour: "doing", says: "I need to wash my hands" },
      { label: "finished", emoji: "✅", colour: "social", says: "I've finished" }
    ]
  },
  {
    id: "lunch",
    name: "Lunchtime",
    description: "Choosing, asking and saying when you have had enough.",
    buttons: [
      { label: "hungry", emoji: "😋", colour: "describing", says: "I am hungry" },
      { label: "thirsty", emoji: "🥤", colour: "describing", says: "I am thirsty" },
      { label: "more", emoji: "➕", colour: "littleWords", says: "More, please" },
      { label: "no thank you", emoji: "🚫", colour: "noStop", says: "No thank you" },
      { label: "all done", emoji: "🏁", colour: "social", says: "I have finished" },
      { label: "I like it", emoji: "😊", colour: "social", says: "I like this" },
      { label: "I don't like it", emoji: "😖", colour: "describing", says: "I don't like this" },
      { label: "hot", emoji: "🥵", colour: "describing", says: "It is too hot" },
      { label: "help", emoji: "🆘", colour: "social", says: "Can you help me, please?" }
    ]
  },
  {
    id: "assembly",
    name: "Assembly and quiet times",
    description: "Things to say when it is busy, loud or long.",
    buttons: [
      { label: "too loud", emoji: "🔊", colour: "describing", says: "It is too loud" },
      { label: "quiet please", emoji: "🤫", colour: "social", says: "I need quiet" },
      { label: "headphones", emoji: "🎧", colour: "things", says: "I need my headphones" },
      { label: "leave", emoji: "🚪", colour: "doing", says: "I need to leave for a bit" },
      { label: "sit near", emoji: "🪑", colour: "places", says: "Can I sit near the door?" },
      { label: "how long?", emoji: "⏱️", colour: "social", says: "How long is left?" },
      { label: "nearly done", emoji: "🔜", colour: "social", says: "Is it nearly finished?" },
      { label: "I can do it", emoji: "💪", colour: "social", says: "I can stay" }
    ]
  },
  {
    id: "computing",
    name: "Computers and tablets",
    description: "Using a screen in a lesson.",
    buttons: [
      { label: "my turn", emoji: "🙋", colour: "social", says: "Can I have a turn?" },
      { label: "click", emoji: "🖱️", colour: "doing", says: "Click" },
      { label: "type", emoji: "⌨️", colour: "doing", says: "Type" },
      { label: "save", emoji: "💾", colour: "doing", says: "Save it" },
      { label: "print", emoji: "🖨️", colour: "doing", says: "Print it" },
      { label: "stuck", emoji: "🤔", colour: "social", says: "I'm stuck" },
      { label: "it has frozen", emoji: "🧊", colour: "describing", says: "It has frozen" },
      { label: "help", emoji: "🆘", colour: "social", says: "I need help" }
    ]
  },
  {
    id: "working-together",
    name: "Working with a friend",
    description: "Sharing, asking and taking turns.",
    buttons: [
      { label: "share", emoji: "🤝", colour: "social", says: "Can we share?" },
      { label: "my turn", emoji: "🙋", colour: "social", says: "It is my turn" },
      { label: "your turn", emoji: "👉", colour: "social", says: "It is your turn" },
      { label: "together", emoji: "👫", colour: "social", says: "Let us do it together" },
      { label: "good idea", emoji: "💡", colour: "social", says: "That is a good idea" },
      { label: "can I help?", emoji: "🙌", colour: "social", says: "Can I help?" },
      { label: "wait", emoji: "✋", colour: "noStop", says: "Please wait" },
      { label: "sorry", emoji: "😔", colour: "social", says: "Sorry" }
    ]
  },
  {
    id: "calm-down",
    name: "Feeling too much",
    description: "What a child might need to say when things are a lot.",
    buttons: [
      { label: "break", emoji: "⏸️", colour: "social", says: "I need a break" },
      { label: "quiet space", emoji: "🛋️", colour: "places", says: "I need a quiet space" },
      { label: "too much", emoji: "🌊", colour: "describing", says: "It is too much" },
      { label: "need a hug", emoji: "🤗", colour: "social", says: "I need a hug" },
      { label: "need space", emoji: "↔️", colour: "social", says: "I need some space" },
      { label: "breathe", emoji: "🌬️", colour: "doing", says: "I want to breathe slowly" },
      { label: "tell someone", emoji: "🗣️", colour: "social", says: "I want to tell someone" },
      { label: "ready now", emoji: "✅", colour: "social", says: "I am ready now" }
    ]
  },
  ...SEASONS.map(seasonTemplate)
];
function MyPagesTab() {
  const pages = useSignal([]);
  const selectedPageId = useSignal(null);
  const board2 = useSignal(null);
  const newPageName = useSignal("");
  const renameValue = useSignal("");
  const error = useSignal(null);
  const shareMessage = useSignal(null);
  const templateId = useSignal(PAGE_TEMPLATES[0].id);
  h$2(() => {
    void getMyPages().then((loaded) => {
      pages.value = loaded;
      selectedPageId.value = loaded[0]?.id ?? null;
    });
  }, []);
  const selectedPage = pages.value.find((page) => page.id === selectedPageId.value) ?? null;
  h$2(() => {
    if (!selectedPage) {
      board2.value = null;
      return;
    }
    renameValue.value = selectedPage.name;
    void getBoard(selectedPage.boardId).then((loaded) => board2.value = loaded ?? null);
  }, [selectedPage?.id]);
  async function handleAddPage(event) {
    event.preventDefault();
    if (!newPageName.value.trim()) return;
    error.value = null;
    const page = await createMyPage(newPageName.value.trim());
    newPageName.value = "";
    pages.value = [...pages.value, page];
    selectedPageId.value = page.id;
  }
  async function handleRenamePage(event) {
    event.preventDefault();
    if (!selectedPage || !renameValue.value.trim()) return;
    const name = renameValue.value.trim();
    await renameMyPage(selectedPage.id, name);
    pages.value = pages.value.map((page) => page.id === selectedPage.id ? { ...page, name } : page);
  }
  async function handleDeletePage(page) {
    await deleteMyPage(page.id);
    const remaining = pages.value.filter((candidate) => candidate.id !== page.id);
    pages.value = remaining;
    if (selectedPageId.value === page.id) {
      selectedPageId.value = remaining[0]?.id ?? null;
    }
  }
  async function handleShare(page) {
    shareMessage.value = null;
    const text = await exportMyPageText(page);
    if (text === null) return;
    const result = await window.myWords.files.save(text, {
      suggestedName: suggestedPageFileName(page),
      filterName: "Shared page (Open Board Format)",
      extensions: ["obf"]
    });
    shareMessage.value = result.ok ? `Saved “${page.name}” as a file you can give to another device.` : null;
  }
  async function handleUseTemplate() {
    const template = PAGE_TEMPLATES.find((candidate) => candidate.id === templateId.value);
    if (!template) return;
    error.value = null;
    const page = await createPageWithButtons(template.name, template.buttons);
    pages.value = [...pages.value, page];
    selectedPageId.value = page.id;
    shareMessage.value = `Made the page “${template.name}”. Change anything to suit.`;
  }
  async function handleAddShared() {
    shareMessage.value = null;
    error.value = null;
    const file = await window.myWords.files.open({
      filterName: "Shared page (Open Board Format)",
      extensions: ["obf"]
    });
    if (!file.ok) return;
    const result = await importMyPageFromText(file.data);
    if (!result.ok) {
      error.value = result.error;
      return;
    }
    pages.value = [...pages.value, result.page];
    selectedPageId.value = result.page.id;
    shareMessage.value = `Added “${result.page.name}” as a new page.${result.notes.length ? " " + result.notes.join(" ") : ""}`;
  }
  async function persistBoard(next) {
    error.value = null;
    board2.value = next;
    await updateBoard(next);
  }
  function resize(rows, columns) {
    if (!board2.value) return;
    try {
      void persistBoard(resizeGrid(board2.value, rows, columns));
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    }
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body my-pages-tab", children: [
    /* @__PURE__ */ u$1("form", { class: "my-pages-tab__add-page", onSubmit: (event) => void handleAddPage(event), children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "parent-mode-screen__label-input",
          type: "text",
          placeholder: "New page name",
          value: newPageName.value,
          onInput: (event) => newPageName.value = event.target.value
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", children: "Add page" })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "my-pages-tab__template", children: [
      /* @__PURE__ */ u$1("label", { children: [
        "Start from a ready-made page",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: templateId.value,
            onChange: (event) => templateId.value = event.target.value,
            children: PAGE_TEMPLATES.map((template) => /* @__PURE__ */ u$1("option", { value: template.id, children: template.name }, template.id))
          }
        )
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void handleUseTemplate(), children: "Make this page" }),
      /* @__PURE__ */ u$1("span", { class: "my-pages-tab__share-hint", children: [
        PAGE_TEMPLATES.find((template) => template.id === templateId.value)?.description,
        " It becomes an ordinary page you can change."
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "my-pages-tab__share", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void handleAddShared(), children: "Add a shared page…" }),
      /* @__PURE__ */ u$1("span", { class: "my-pages-tab__share-hint", children: "Opens a page someone saved from this app or another that uses Open Board Format. It is always added as a new page." })
    ] }),
    shareMessage.value && /* @__PURE__ */ u$1("p", { class: "my-pages-tab__share-message", role: "status", children: shareMessage.value }),
    pages.value.length === 0 ? /* @__PURE__ */ u$1("p", { class: "my-pages-tab__empty", children: "No pages yet. Add one above to get started." }) : /* @__PURE__ */ u$1("ul", { class: "my-pages-tab__list", children: pages.value.map((page) => /* @__PURE__ */ u$1("li", { class: "my-pages-tab__list-row", children: [
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "my-pages-tab__page-button",
          "aria-pressed": page.id === selectedPageId.value,
          onClick: () => selectedPageId.value = page.id,
          children: page.name
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "my-pages-tab__delete-button",
          onClick: () => void handleDeletePage(page),
          "aria-label": `Delete ${page.name}`,
          children: "Delete"
        }
      )
    ] }, page.id)) }),
    error.value && /* @__PURE__ */ u$1("p", { class: "parent-mode-screen__error", children: error.value }),
    selectedPage && board2.value && /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("form", { class: "my-pages-tab__rename-form", onSubmit: (event) => void handleRenamePage(event), children: [
        /* @__PURE__ */ u$1("label", { children: [
          "Page name",
          /* @__PURE__ */ u$1(
            "input",
            {
              class: "parent-mode-screen__label-input",
              type: "text",
              value: renameValue.value,
              onInput: (event) => renameValue.value = event.target.value
            }
          )
        ] }),
        /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", children: "Rename" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void handleShare(selectedPage), children: "Share this page…" })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__grid-size", children: [
        /* @__PURE__ */ u$1("span", { children: "Grid size" }),
        /* @__PURE__ */ u$1("label", { children: [
          "rows",
          /* @__PURE__ */ u$1(
            "select",
            {
              value: board2.value.grid.rows,
              onChange: (event) => resize(Number(event.target.value), board2.value.grid.columns),
              children: VALID_GRID_SIZES.map((size) => /* @__PURE__ */ u$1("option", { value: size, children: size }, size))
            }
          )
        ] }),
        /* @__PURE__ */ u$1("label", { children: [
          "columns",
          /* @__PURE__ */ u$1(
            "select",
            {
              value: board2.value.grid.columns,
              onChange: (event) => resize(board2.value.grid.rows, Number(event.target.value)),
              children: VALID_GRID_SIZES.map((size) => /* @__PURE__ */ u$1("option", { value: size, children: size }, size))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u$1(ButtonList, { board: board2.value, onChange: (next) => void persistBoard(next) }),
      /* @__PURE__ */ u$1(
        AddButtonForm,
        {
          board: board2.value,
          onChange: (next) => void persistBoard(next),
          onError: (message) => error.value = message
        }
      )
    ] })
  ] });
}
function PeoplePlacesTab({ kind }) {
  const records = useSignal([]);
  const name = useSignal("");
  const relationship = useSignal("");
  const phrasesInput = useSignal("");
  const photoBlob = useSignal(null);
  const voiceClipBlob = useSignal(null);
  const error = useSignal(null);
  const saving = useSignal(false);
  const confirmRemoveId = useSignal(null);
  const pageMessage = useSignal(null);
  async function handleMakePage(record) {
    pageMessage.value = null;
    const page = await createPageWithButtons(
      record.name,
      record.phrases.map((phrase) => ({ label: phrase }))
    );
    pageMessage.value = `Made a page called “${page.name}” in My Pages, with a button for each phrase.`;
  }
  async function handleRemove(record) {
    confirmRemoveId.value = null;
    if (kind === "people") await deletePerson(record.id);
    else await deletePlace(record.id);
    const board2 = await getBoard(kind);
    if (board2) await updateBoard(removeButton(board2, record.id));
    await refresh();
  }
  async function refresh() {
    records.value = kind === "people" ? await getPeople() : await getPlaces();
  }
  h$2(() => {
    void refresh();
  }, [kind]);
  async function handleSave(event) {
    event.preventDefault();
    if (!name.value.trim() || saving.value) return;
    saving.value = true;
    error.value = null;
    try {
      const id = slugify(name.value);
      const photoBlobId = photoBlob.value ? await savePhoto(photoBlob.value) : void 0;
      const voiceClipBlobId = voiceClipBlob.value ? await saveVoiceClip(voiceClipBlob.value) : void 0;
      const phrases = phrasesInput.value.split(",").map((phrase) => phrase.trim()).filter(Boolean);
      if (kind === "people") {
        const record = {
          id,
          name: name.value.trim(),
          phrases,
          ...relationship.value.trim() ? { relationship: relationship.value.trim() } : {},
          ...photoBlobId ? { photoBlobId } : {},
          ...voiceClipBlobId ? { voiceClipBlobId } : {}
        };
        await savePerson(record);
      } else {
        const record = {
          id,
          name: name.value.trim(),
          phrases,
          ...photoBlobId ? { photoBlobId } : {},
          ...voiceClipBlobId ? { voiceClipBlobId } : {}
        };
        await savePlace(record);
      }
      const board2 = await getBoard(kind);
      if (board2) {
        const item = {
          id,
          label: name.value.trim(),
          background_color: FITZGERALD_COLORS[kind === "people" ? "people" : "places"],
          image: photoBlobId ? { kind: "photo", blobId: photoBlobId } : { kind: "emoji", char: "⭐" },
          ...voiceClipBlobId ? { voiceClipBlobId } : {}
        };
        await updateBoard(addButton(board2, item));
      }
      name.value = "";
      relationship.value = "";
      phrasesInput.value = "";
      photoBlob.value = null;
      voiceClipBlob.value = null;
      await refresh();
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      saving.value = false;
    }
  }
  const title = kind === "people" ? "Person" : "Place";
  return /* @__PURE__ */ u$1("div", { class: "people-places-tab", children: [
    /* @__PURE__ */ u$1("ul", { class: "people-places-tab__list", children: [
      records.value.map((record) => /* @__PURE__ */ u$1("li", { class: "people-places-tab__record", children: [
        record.photoBlobId && /* @__PURE__ */ u$1(PhotoThumbnail, { class: "people-places-tab__thumb", blobId: record.photoBlobId, alt: "" }),
        /* @__PURE__ */ u$1("div", { class: "people-places-tab__record-info", children: [
          /* @__PURE__ */ u$1("span", { class: "people-places-tab__record-name", children: record.name }),
          "relationship" in record && record.relationship && /* @__PURE__ */ u$1("span", { class: "people-places-tab__record-relationship", children: record.relationship })
        ] }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "people-places-tab__preview",
            onClick: () => void announceItem({
              id: record.id,
              label: record.name,
              ...record.voiceClipBlobId ? { voiceClipBlobId: record.voiceClipBlobId } : {}
            }),
            children: "Hear name"
          }
        ),
        record.phrases.length > 0 && /* @__PURE__ */ u$1("button", { type: "button", class: "people-places-tab__preview", onClick: () => void handleMakePage(record), children: "Make a page of these phrases" }),
        confirmRemoveId.value === record.id ? /* @__PURE__ */ u$1("span", { class: "people-places-tab__confirm", children: [
          "Remove ",
          record.name,
          "?",
          /* @__PURE__ */ u$1("button", { type: "button", class: "people-places-tab__remove", onClick: () => void handleRemove(record), children: "Yes, remove" }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "people-places-tab__preview", onClick: () => confirmRemoveId.value = null, children: "Keep" })
        ] }) : /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "people-places-tab__remove",
            "aria-label": `Remove ${record.name}`,
            onClick: () => confirmRemoveId.value = record.id,
            children: "Remove"
          }
        )
      ] }, record.id)),
      records.value.length === 0 && /* @__PURE__ */ u$1("li", { class: "people-places-tab__empty", children: [
        "No ",
        kind,
        " added yet."
      ] })
    ] }),
    error.value && /* @__PURE__ */ u$1("p", { class: "people-places-tab__error", children: error.value }),
    pageMessage.value && /* @__PURE__ */ u$1("p", { class: "people-places-tab__ready", role: "status", children: pageMessage.value }),
    /* @__PURE__ */ u$1("form", { class: "people-places-tab__form", onSubmit: (event) => void handleSave(event), children: [
      /* @__PURE__ */ u$1("h2", { class: "people-places-tab__form-title", children: [
        "Add a ",
        title.toLowerCase()
      ] }),
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "parent-mode-screen__label-input",
          type: "text",
          placeholder: `${title} name`,
          value: name.value,
          onInput: (event) => name.value = event.target.value
        }
      ),
      kind === "people" && /* @__PURE__ */ u$1(
        "input",
        {
          class: "parent-mode-screen__label-input",
          type: "text",
          placeholder: "Relationship (e.g. Mum, teacher)",
          value: relationship.value,
          onInput: (event) => relationship.value = event.target.value
        }
      ),
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "parent-mode-screen__label-input",
          type: "text",
          placeholder: "Phrases (comma separated)",
          value: phrasesInput.value,
          onInput: (event) => phrasesInput.value = event.target.value
        }
      ),
      /* @__PURE__ */ u$1(PhotoCapture, { onCapture: (blob) => photoBlob.value = blob }),
      photoBlob.value && /* @__PURE__ */ u$1("p", { class: "people-places-tab__ready", children: "Photo ready." }),
      /* @__PURE__ */ u$1(VoiceClipRecorder, { onRecorded: (blob) => voiceClipBlob.value = blob }),
      voiceClipBlob.value && /* @__PURE__ */ u$1("p", { class: "people-places-tab__ready", children: "Voice clip ready." }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "submit",
          class: "parent-mode-screen__button",
          disabled: !name.value.trim() || saving.value,
          children: [
            "Save ",
            title.toLowerCase()
          ]
        }
      )
    ] })
  ] });
}
function ProfilesTab() {
  const profiles = useSignal([]);
  const boards = useSignal([]);
  const activeProfileId = useSignal(null);
  h$2(() => {
    void Promise.all([getProfiles(), getAllBoards(), getActiveProfileId()]).then(
      ([loadedProfiles, loadedBoards, activeId]) => {
        profiles.value = [...loadedProfiles].sort((a2, b2) => a2.name.localeCompare(b2.name));
        boards.value = [...loadedBoards].sort(
          (a2, b2) => a2.id === ROOT_BOARD_ID ? -1 : b2.id === ROOT_BOARD_ID ? 1 : a2.name.localeCompare(b2.name)
        );
        activeProfileId.value = activeId;
      }
    );
  }, []);
  async function handleRootBoardChange(profile, rootBoardId) {
    const next = { ...profile, rootBoardId };
    profiles.value = profiles.value.map((p2) => p2.id === profile.id ? next : p2);
    await saveProfile(next);
  }
  async function handleActivate(profileId) {
    activeProfileId.value = profileId;
    await setActiveProfileId(profileId);
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body", children: [
    /* @__PURE__ */ u$1("p", { class: "profiles-tab__hint", children: "Same vocabulary everywhere. This only chooses which page Talk opens to first, for wherever the device is being used right now." }),
    /* @__PURE__ */ u$1("ul", { class: "profiles-tab__list", children: profiles.value.map((profile) => /* @__PURE__ */ u$1("li", { class: "profiles-tab__row", children: [
      /* @__PURE__ */ u$1("span", { class: "profiles-tab__name", children: profile.name }),
      /* @__PURE__ */ u$1("label", { class: "profiles-tab__board-picker", children: [
        "Opens to",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: profile.rootBoardId,
            onChange: (event) => void handleRootBoardChange(profile, event.target.value),
            children: boards.value.map((board2) => /* @__PURE__ */ u$1("option", { value: board2.id, children: board2.name }, board2.id))
          }
        )
      ] }),
      activeProfileId.value === profile.id ? /* @__PURE__ */ u$1("span", { class: "profiles-tab__active", children: "Active now" }) : /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          onClick: () => void handleActivate(profile.id),
          children: "Use this profile"
        }
      )
    ] }, profile.id)) })
  ] });
}
function QuickAccessTab() {
  const buttons = useSignal(DEFAULT_QUICK_ACCESS);
  const message = useSignal(null);
  const loaded = useSignal(false);
  h$2(() => {
    void getQuickAccess().then((stored) => {
      buttons.value = stored;
      loaded.value = true;
    });
  }, []);
  async function choose(slot, id) {
    const result = setQuickAccessSlot(buttons.value, slot, id);
    if (!result.ok) {
      message.value = result.reason;
      buttons.value = [...buttons.value];
      return;
    }
    message.value = null;
    buttons.value = result.buttons;
    await setQuickAccess(result.buttons);
  }
  async function reset() {
    message.value = null;
    buttons.value = [...DEFAULT_QUICK_ACCESS];
    await setQuickAccess([...DEFAULT_QUICK_ACCESS]);
  }
  if (!loaded.value) return null;
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body quick-access-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "quick-access-tab__hint", children: "These six buttons sit along the top of every screen, left to right. Pick what each one should be." }),
    /* @__PURE__ */ u$1("ol", { class: "quick-access-tab__slots", children: buttons.value.map((id, slot) => /* @__PURE__ */ u$1("li", { class: "quick-access-tab__slot", children: /* @__PURE__ */ u$1("label", { children: [
      "Button ",
      slot + 1,
      /* @__PURE__ */ u$1(
        "select",
        {
          value: id,
          onChange: (event) => void choose(slot, event.target.value),
          children: QUICK_ACCESS_IDS.map((option) => /* @__PURE__ */ u$1("option", { value: option, children: QUICK_ACCESS_LABELS[option] }, option))
        }
      )
    ] }) }, slot)) }),
    message.value && /* @__PURE__ */ u$1("p", { class: "parent-mode-screen__error", children: message.value }),
    /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void reset(), children: "Put back the usual six" })
  ] });
}
const VOICE_PRESETS = [
  { id: "usual", name: "Usual", hint: "The voice as it comes.", rate: 1, pitch: 1 },
  { id: "gentle", name: "Gentle", hint: "A little slower and softer.", rate: 0.85, pitch: 0.95 },
  { id: "clear", name: "Slow and clear", hint: "Slower, so each word stands out.", rate: 0.7, pitch: 1 },
  { id: "bright", name: "Bright", hint: "A little quicker, and higher.", rate: 1.1, pitch: 1.2 },
  { id: "young", name: "Young", hint: "Higher, for a younger sound.", rate: 1, pitch: 1.35 }
];
function matchingPreset(rate, pitch) {
  return VOICE_PRESETS.find((p2) => Math.abs(p2.rate - rate) < 1e-3 && Math.abs(p2.pitch - pitch) < 1e-3);
}
const SAMPLE = "This is what I sound like.";
function VoiceSettings() {
  const voices = useSignal([]);
  h$2(() => watchVoices((found) => voices.value = found), []);
  const rate = preferredSpeechRate.value;
  const pitch = preferredSpeechPitch.value;
  const current = matchingPreset(rate, pitch);
  const chosenVoice = preferredVoiceURI.value ?? voices.value[0]?.voiceURI ?? "";
  async function choosePreset(id) {
    const preset = VOICE_PRESETS.find((p2) => p2.id === id);
    if (!preset) return;
    await Promise.all([setPreferredSpeechRate(preset.rate), setPreferredSpeechPitch(preset.pitch)]);
    announceText(SAMPLE, { keepInHistory: false });
  }
  async function chooseVoice(uri) {
    await setPreferredVoiceURI(uri || void 0);
    announceText(SAMPLE, { keepInHistory: false });
  }
  return /* @__PURE__ */ u$1(S$1, { children: [
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Voice" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Which voice speaks. Only voices that work without the internet are listed. Try a few: children often prefer one over another, and a voice that sounds friendly to an adult may not to a child." }),
      voices.value.length === 0 ? /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        "No voices that work without the internet were found on this ",
        deviceNoun(),
        "."
      ] }) : /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Voice",
        /* @__PURE__ */ u$1("select", { value: chosenVoice, onChange: (event) => void chooseVoice(event.target.value), children: voices.value.map((voice) => /* @__PURE__ */ u$1("option", { value: voice.voiceURI, children: voice.name }, voice.voiceURI)) })
      ] }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button access-tab__add",
          onClick: () => announceText(SAMPLE, { keepInHistory: false }),
          children: "Hear this voice"
        }
      )
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "How it sounds" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "A quick way to set the speed and pitch together. Pick one, listen, then fine-tune with the sliders if you like." }),
      /* @__PURE__ */ u$1("div", { class: "access-tab__presets", role: "group", "aria-label": "How it sounds", children: VOICE_PRESETS.map((preset) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `access-tab__preset${current?.id === preset.id ? " access-tab__preset--chosen" : ""}`,
          "aria-pressed": current?.id === preset.id,
          onClick: () => void choosePreset(preset.id),
          children: [
            /* @__PURE__ */ u$1("span", { class: "access-tab__preset-name", children: preset.name }),
            /* @__PURE__ */ u$1("span", { class: "access-tab__preset-hint", children: preset.hint })
          ]
        },
        preset.id
      )) })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Reading a sentence out" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "How Speak reads out the words in the sentence. Word by word lights each word as it is said, so a child can see which word they are hearing." }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Speak",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: speakStyleSetting.signal.value,
            onChange: (event) => void speakStyleSetting.set(event.target.value),
            children: [
              /* @__PURE__ */ u$1("option", { value: "normal", children: "All together, like a sentence" }),
              /* @__PURE__ */ u$1("option", { value: "clear", children: "With small gaps between the words, a little slower" }),
              /* @__PURE__ */ u$1("option", { value: "wordByWord", children: "One word at a time, lighting each word" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
const NO_DEVICE_ACCESSIBILITY = {
  reduceMotion: false,
  increaseContrast: false,
  boldText: false,
  textScale: 1,
  voiceOver: false,
  switchControl: false,
  guidedAccess: false
};
const deviceAccessibility = y(NO_DEVICE_ACCESSIBILITY);
const MAX_TEXT_SCALE = 2;
function followDevice(settings, device) {
  const deviceScale = Number.isFinite(device.textScale) ? Math.min(MAX_TEXT_SCALE, Math.max(1, device.textScale)) : 1;
  return {
    ...settings,
    reduceMotion: settings.reduceMotion || device.reduceMotion,
    highContrast: settings.highContrast === "off" && device.increaseContrast ? "light" : settings.highContrast,
    textScale: Math.max(settings.textScale, deviceScale)
  };
}
const POLL_MS$1 = 4e3;
function watchDeviceAccessibility() {
  const ask = window.myWords?.deviceAccessibility;
  if (!ask) return () => void 0;
  let stopped = false;
  const refresh = () => {
    if (document.visibilityState === "hidden") return;
    void ask().then((value) => {
      if (!stopped) deviceAccessibility.value = { ...NO_DEVICE_ACCESSIBILITY, ...value };
    }).catch(() => void 0);
  };
  refresh();
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener("pageshow", refresh);
  const timer = window.setInterval(refresh, POLL_MS$1);
  return () => {
    stopped = true;
    document.removeEventListener("visibilitychange", refresh);
    window.removeEventListener("focus", refresh);
    window.removeEventListener("pageshow", refresh);
    window.clearInterval(timer);
  };
}
function buzzOnPress() {
  const buzz = window.myWords?.haptic;
  if (!buzz) return () => void 0;
  const onClick = (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('button, [role="button"]')) void buzz().catch(() => void 0);
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
function deviceAsking(device) {
  const asking = [];
  if (device.reduceMotion) asking.push("Reduce Motion");
  if (device.increaseContrast) asking.push("Increase Contrast");
  if (device.boldText) asking.push("Bold Text");
  if (device.textScale > 1) asking.push(`larger text (×${device.textScale})`);
  return asking;
}
function AppleAccessibilitySection() {
  const capabilities = window.myWords?.capabilities;
  if (!capabilities?.deviceAccessibility) return null;
  const device = deviceAccessibility.value;
  const asking = deviceAsking(device);
  return /* @__PURE__ */ u$1(S$1, { children: [
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", "data-section": "device-accessibility", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "This device's accessibility settings" }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: followDeviceAccessibilitySetting.signal.value,
            onChange: (event) => void followDeviceAccessibilitySetting.set(event.target.checked)
          }
        ),
        "Follow this device's accessibility settings"
      ] }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Reduce Motion, Increase Contrast, Bold Text and the text size, set once in Settings, Accessibility, are used here too. The choices made below are never made weaker: the device can only ask for more." }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", role: "status", children: asking.length > 0 ? `Right now this device is asking for: ${asking.join(", ")}.` : "Right now none of these are switched on." }),
      capabilities.haptics && /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "checkbox",
              checked: pressBuzzSetting.signal.value,
              onChange: (event) => void pressBuzzSetting.set(event.target.checked)
            }
          ),
          "Buzz when a button is pressed"
        ] }),
        /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "A short buzz from the device, so a press can be felt as well as heard. Off unless you turn it on, and only when the screen is touched." })
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", "data-section": "apple-ways-of-pressing", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Eye tracking and other ways of pressing" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        /* @__PURE__ */ u$1("strong", { children: "Eye Tracking" }),
        " is built into iPadOS and iOS 18 and later, on recent iPads and iPhones. Turn it on in Settings, Accessibility, Eye Tracking, then follow the dots. It uses the front camera and then works in this app as it does everywhere else: resting the gaze on a button presses it. The gaze stays with the device. This app cannot see where anyone is looking, and cannot switch Eye Tracking on for you."
      ] }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        "If you use Eye Tracking's own dwell, leave ",
        /* @__PURE__ */ u$1("em", { children: "Hold-to-select" }),
        " above at 0, so a button is not asked to wait twice."
      ] }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        /* @__PURE__ */ u$1("strong", { children: "Switch Control" }),
        " (Settings, Accessibility) reaches every button. For switches that press Space and Enter, the ",
        /* @__PURE__ */ u$1("em", { children: "Switch scanning" }),
        " above is simpler, and keeps the order of the buttons."
      ] }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        /* @__PURE__ */ u$1("strong", { children: "Voice Control" }),
        " can press any button by saying its name, and ",
        /* @__PURE__ */ u$1("strong", { children: "VoiceOver" }),
        " ",
        "reads each one out.",
        device.voiceOver ? " VoiceOver is on now." : "",
        device.switchControl ? " Switch Control is on now." : ""
      ] }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        /* @__PURE__ */ u$1("strong", { children: "Guided Access" }),
        " keeps a child inside this app.",
        " ",
        device.guidedAccess ? "It is on now: the child cannot leave the app." : "It is off now. Turn it on in Settings, Accessibility, Guided Access, then triple-press the side or Home button inside the app.",
        " ",
        /* @__PURE__ */ u$1("strong", { children: "Assistive Access" }),
        " (Settings, Accessibility) fills the whole screen with this app."
      ] })
    ] })
  ] });
}
const linkPeers = y(0);
function AppleLinkSection() {
  const capabilities = window.myWords?.capabilities;
  if (!capabilities?.link) return null;
  const setting = appleLinkSetting.signal.value;
  const draft = useSignal(setting.code);
  const codeOk = /^\d{4}$/.test(draft.value);
  const peers = linkPeers.value;
  async function turnOn() {
    if (!codeOk) return;
    await appleLinkSetting.set({ enabled: true, code: draft.value });
  }
  async function turnOff() {
    await appleLinkSetting.set({ enabled: false, code: "" });
    draft.value = "";
  }
  return /* @__PURE__ */ u$1("section", { class: "access-tab__section", "data-section": "apple-link", children: [
    /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Link with the Apple Watch and Apple TV" }),
    /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Lets this family's own Apple Watch and Apple TV show the Favourites and today's plan, share the traffic light, and open pages here, such as Games or Draw. It works over Bluetooth to the watch and over the home wifi to the television, never the internet, and nothing the child says or types is sent. Off unless you turn it on." }),
    setting.enabled ? /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", role: "status", children: [
        "On. ",
        peers === 0 ? "Nothing is connected yet." : `${peers} connected.`,
        " The code is ",
        setting.code,
        "."
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void turnOff(), children: "Turn the link off" })
    ] }) : /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "For the Apple TV: open the Rugged Speech app on it, go to the iPad tab, and type the four-digit code it shows here. The Apple Watch needs no code, only to be paired with this iPhone." }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Code from the Apple TV",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            inputMode: "numeric",
            maxLength: 4,
            value: draft.value,
            onInput: (event) => draft.value = event.target.value.replace(/\D/g, "").slice(0, 4)
          }
        )
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", disabled: !codeOk, onClick: () => void turnOn(), children: "Turn the link on" })
    ] })
  ] });
}
function AccessTab() {
  const settings = useSignal(DEFAULT_ACCESS_SETTINGS);
  const speechRate = useSignal(DEFAULT_SPEECH_RATE);
  const speechPitch = useSignal(DEFAULT_SPEECH_PITCH);
  const press = useSignal(DEFAULT_PRESS_MODE);
  const loaded = useSignal(false);
  h$2(() => {
    void Promise.all([
      getAccessSettings(),
      getPreferredSpeechRate(),
      getPreferredSpeechPitch(),
      getPressMode()
    ]).then(([loadedSettings, loadedRate, loadedPitch, loadedPress]) => {
      settings.value = loadedSettings;
      speechRate.value = loadedRate;
      speechPitch.value = loadedPitch;
      press.value = loadedPress;
      loaded.value = true;
    });
  }, []);
  async function update(next) {
    settings.value = next;
    await setAccessSettings(next);
  }
  async function updateSpeechRate(rate) {
    speechRate.value = rate;
    await setPreferredSpeechRate(rate);
  }
  async function updateSpeechPitch(pitch) {
    speechPitch.value = pitch;
    await setPreferredSpeechPitch(pitch);
  }
  function updatePronunciation(index, changes) {
    const next = pronunciationsSetting.signal.value.map((entry, i2) => i2 === index ? { ...entry, ...changes } : entry);
    void pronunciationsSetting.set(next);
  }
  function addPronunciation() {
    void pronunciationsSetting.set([...pronunciationsSetting.signal.value, { written: "", spoken: "" }]);
  }
  function removePronunciation(index) {
    void pronunciationsSetting.set(pronunciationsSetting.signal.value.filter((_2, i2) => i2 !== index));
  }
  async function updatePressMode(mode) {
    press.value = mode;
    await setPressMode(mode);
  }
  if (!loaded.value) return null;
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body access-tab", children: [
    /* @__PURE__ */ u$1(VoiceSettings, {}),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Speech rate" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "How fast spoken output is read out. Some people follow speech better when it's slower." }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__slider-row", children: [
        "×",
        speechRate.value.toFixed(2),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "range",
            min: 0.5,
            max: 1.5,
            step: 0.05,
            value: speechRate.value,
            onInput: (event) => void updateSpeechRate(Number(event.target.value))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Voice pitch" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "How high or low the voice sounds. Lower can feel calmer; higher can sound younger." }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__slider-row", children: [
        "Pitch ×",
        speechPitch.value.toFixed(2),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "range",
            min: 0.5,
            max: 1.5,
            step: 0.05,
            value: speechPitch.value,
            onInput: (event) => void updateSpeechPitch(Number(event.target.value))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Voice volume" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        "How loud the app speaks, on top of the ",
        deviceNoun(),
        "'s own volume. Turn it down for a quiet room."
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__slider-row", children: [
        "Volume ",
        Math.round(speechVolumeSetting.signal.value * 100),
        "%",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "range",
            min: 0.1,
            max: 1,
            step: 0.05,
            value: speechVolumeSetting.signal.value,
            onInput: (event) => void speechVolumeSetting.set(Number(event.target.value))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Say it like this" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "For a name or word the voice gets wrong. Write it as it appears, and as it should sound. Only the sound changes: the words on screen stay as written." }),
      pronunciationsSetting.signal.value.map((entry, index) => /* @__PURE__ */ u$1("div", { class: "access-tab__pronunciation", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            "aria-label": "Written as",
            placeholder: "Written as",
            value: entry.written,
            onInput: (event) => updatePronunciation(index, { written: event.target.value })
          }
        ),
        /* @__PURE__ */ u$1("span", { "aria-hidden": "true", children: "→" }),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            "aria-label": "Say it as",
            placeholder: "Say it as",
            value: entry.spoken,
            onInput: (event) => updatePronunciation(index, { spoken: event.target.value })
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            disabled: !entry.written.trim() || !entry.spoken.trim(),
            onClick: () => announceText(entry.written),
            children: "Hear it"
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            "aria-label": `Remove ${entry.written || "this entry"}`,
            onClick: () => removePronunciation(index),
            children: "Remove"
          }
        )
      ] }, index)),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button access-tab__add", onClick: addPronunciation, children: "Add a word" })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "When a button is pressed" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "On the Talk board and My Pages. Words are only ever spoken because someone pressed something. This just chooses what that press does." }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "A press",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: press.value,
            onChange: (event) => void updatePressMode(event.target.value),
            children: [
              /* @__PURE__ */ u$1("option", { value: "sentence", children: "Adds the word to the sentence (speak with Speak)" }),
              /* @__PURE__ */ u$1("option", { value: "speak", children: "Speaks the word straight away" }),
              /* @__PURE__ */ u$1("option", { value: "both", children: "Does both" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Hold-to-select" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "For eye gaze or a head pointer: a button activates once the pointer or focus has rested on it this long, instead of on tap. 0 turns this off." }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__slider-row", children: [
        settings.value.dwellMs,
        "ms",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "range",
            min: 0,
            max: 1500,
            step: 50,
            value: settings.value.dwellMs,
            onInput: (event) => void update({ ...settings.value, dwellMs: Number(event.target.value) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Repeat-press suppression" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Ignores a second press of the same button within this long of the first, for a switch or finger that sometimes double-fires. 0 turns this off." }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__slider-row", children: [
        settings.value.repeatSuppressMs,
        "ms",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "range",
            min: 0,
            max: 2e3,
            step: 100,
            value: settings.value.repeatSuppressMs,
            onInput: (event) => void update({
              ...settings.value,
              repeatSuppressMs: Number(event.target.value)
            })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Switch scanning" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Row/column scanning driven by Space and Enter, so any keyboard-emulating switch interface works. While this is on, buttons in Talk, Feelings and Favourites are reached only by scanning, not by touch or tab." }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Mode",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: settings.value.scanningMode,
            onChange: (event) => void update({
              ...settings.value,
              scanningMode: event.target.value
            }),
            children: [
              /* @__PURE__ */ u$1("option", { value: "off", children: "Off" }),
              /* @__PURE__ */ u$1("option", { value: "twoSwitchStepped", children: "Two switches (Space advances, Enter selects)" }),
              /* @__PURE__ */ u$1("option", { value: "oneSwitchTimed", children: "One switch (Space selects; auto-advances on its own)" })
            ]
          }
        )
      ] }),
      settings.value.scanningMode === "oneSwitchTimed" && /* @__PURE__ */ u$1("label", { class: "access-tab__slider-row", children: [
        "Auto-advance every ",
        settings.value.scanIntervalMs,
        "ms",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "range",
            min: 500,
            max: 4e3,
            step: 100,
            value: settings.value.scanIntervalMs,
            onInput: (event) => void update({
              ...settings.value,
              scanIntervalMs: Number(event.target.value)
            })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u$1(AppleAccessibilitySection, {}),
    /* @__PURE__ */ u$1(AppleLinkSection, {}),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Keyboard and sentence" }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Keyboard letters",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: keyboardLayoutSetting.signal.value,
            onChange: (event) => void keyboardLayoutSetting.set(event.target.value),
            children: [
              /* @__PURE__ */ u$1("option", { value: "qwerty", children: "Usual keyboard order (QWERTY)" }),
              /* @__PURE__ */ u$1("option", { value: "alphabetical", children: "Alphabetical order (A, B, C…)" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: sentencePicturesSetting.signal.value,
            onChange: (event) => void sentencePicturesSetting.set(event.target.checked)
          }
        ),
        "Show each word's picture in the sentence"
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Visual" }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "High contrast",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: settings.value.highContrast,
            onChange: (event) => void update({
              ...settings.value,
              highContrast: event.target.value
            }),
            children: [
              /* @__PURE__ */ u$1("option", { value: "off", children: "Off" }),
              /* @__PURE__ */ u$1("option", { value: "light", children: "Light" }),
              /* @__PURE__ */ u$1("option", { value: "dark", children: "Dark" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__slider-row", children: [
        "Text size ×",
        settings.value.textScale,
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "range",
            min: 1,
            max: 2,
            step: 0.25,
            value: settings.value.textScale,
            onInput: (event) => void update({ ...settings.value, textScale: Number(event.target.value) })
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: settings.value.reduceMotion,
            onChange: (event) => void update({ ...settings.value, reduceMotion: event.target.checked })
          }
        ),
        "Reduce motion"
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: settings.value.lowArousalPalette,
            onChange: (event) => void update({
              ...settings.value,
              lowArousalPalette: event.target.checked
            })
          }
        ),
        "Low-arousal colours (same word classes, muted)"
      ] })
    ] })
  ] });
}
const STYLES = [
  { id: "drawn", label: "Drawn symbols", hint: "Simple, bold pictures made for this app." },
  { id: "emoji", label: "Emoji", hint: "The pictures this device already has." }
];
const LABELS = [
  { id: "both", label: "Picture and word", hint: "Both on every button." },
  { id: "pictures", label: "Pictures only", hint: "For someone who does not read yet." },
  { id: "words", label: "Words only", hint: "For someone who reads." }
];
const SAMPLES = [
  { char: "🍎", label: "apple", colour: "#fed7aa" },
  { char: "🐶", label: "dog", colour: "#fed7aa" },
  { char: "😊", label: "happy", colour: "#bfdbfe" },
  { char: "🏠", label: "home", colour: "#99f6e4" }
];
function PicturePreview() {
  const labels = labelStyleSetting.signal.value;
  return /* @__PURE__ */ u$1("div", { class: "picture-preview", "aria-label": "How buttons will look", children: SAMPLES.map((sample) => /* @__PURE__ */ u$1("div", { class: "picture-preview__button", style: { background: sample.colour }, children: [
    labels !== "words" && /* @__PURE__ */ u$1(Pic, { class: "picture-preview__pic", char: sample.char }),
    labels !== "pictures" && /* @__PURE__ */ u$1("span", { class: "picture-preview__label", children: sample.label })
  ] }, sample.label)) });
}
function PictureChoices() {
  const style = symbolStyleSetting.signal.value;
  const labels = labelStyleSetting.signal.value;
  return /* @__PURE__ */ u$1(S$1, { children: [
    /* @__PURE__ */ u$1("div", { class: "picture-choices", role: "group", "aria-label": "Pictures", children: STYLES.map((choice) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: `picture-choices__option${style === choice.id ? " picture-choices__option--on" : ""}`,
        "aria-pressed": style === choice.id,
        onClick: () => void symbolStyleSetting.set(choice.id),
        children: [
          /* @__PURE__ */ u$1("strong", { children: choice.label }),
          /* @__PURE__ */ u$1("span", { children: choice.hint })
        ]
      },
      choice.id
    )) }),
    /* @__PURE__ */ u$1("div", { class: "picture-choices", role: "group", "aria-label": "Pictures and words", children: LABELS.map((choice) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: `picture-choices__option${labels === choice.id ? " picture-choices__option--on" : ""}`,
        "aria-pressed": labels === choice.id,
        onClick: () => void labelStyleSetting.set(choice.id),
        children: [
          /* @__PURE__ */ u$1("strong", { children: choice.label }),
          /* @__PURE__ */ u$1("span", { children: choice.hint })
        ]
      },
      choice.id
    )) }),
    /* @__PURE__ */ u$1(PicturePreview, {})
  ] });
}
const CUSTOM_FIELDS = [
  { key: "background", label: "Background", hint: "Behind everything." },
  { key: "text", label: "Writing", hint: "Words and numbers." },
  { key: "border", label: "Outlines", hint: "Round buttons and boxes." },
  { key: "bars", label: "Bars", hint: "The top bar and tabs." },
  { key: "accent", label: "Highlight", hint: "What is selected or being said." }
];
const ALIKE_BELOW = 25;
function alikePairs(chosen) {
  const pairs = [];
  for (let i2 = 0; i2 < FITZGERALD_CLASSES.length; i2 += 1) {
    for (let j2 = i2 + 1; j2 < FITZGERALD_CLASSES.length; j2 += 1) {
      const a2 = FITZGERALD_CLASSES[i2];
      const b2 = FITZGERALD_CLASSES[j2];
      if (colourDistance(chosen[a2], chosen[b2]) < ALIKE_BELOW) pairs.push([a2, b2]);
    }
  }
  return pairs;
}
function LookTab() {
  const theme = themeSetting.signal.value;
  const colours = coloursFor(theme);
  const readable = contrastRatio(colours.background, colours.text);
  function save(next) {
    void themeSetting.set(next);
  }
  function choosePreset(preset) {
    save({ ...theme, preset });
  }
  function setCustom(key, value) {
    save({ ...theme, preset: "custom", custom: { ...colours, [key]: value } });
  }
  function setWordColour(cls, value) {
    save({ ...theme, wordColours: { ...theme.wordColours, [cls]: value } });
  }
  function resetWordColour(cls) {
    const rest = { ...theme.wordColours };
    delete rest[cls];
    save({ ...theme, wordColours: rest });
  }
  const chosenWords = Object.fromEntries(
    FITZGERALD_CLASSES.map((cls) => [cls, theme.wordColours[cls] ?? FITZGERALD_COLORS[cls]])
  );
  const alike = alikePairs(chosenWords);
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body look-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Favourite colour" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Pick a colour and the whole app is washed with it: the background, the bars and the highlight. Writing stays dark, so it is still easy to read. Word colours do not change. If High contrast is on in Access, that is used instead." }),
      /* @__PURE__ */ u$1("div", { class: "look-tab__funs", role: "group", "aria-label": "Favourite colour", children: FUN_COLOUR_IDS.map((id) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `look-tab__fun${theme.preset === id ? " look-tab__fun--chosen" : ""}`,
          "aria-pressed": theme.preset === id,
          onClick: () => choosePreset(id),
          children: [
            /* @__PURE__ */ u$1("span", { class: "look-tab__fun-dot", style: { background: FUN_COLOURS[id].swatch }, "aria-hidden": "true" }),
            FUN_COLOURS[id].name
          ]
        },
        id
      )) })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Other looks" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Plain, soft, dark and strong contrast looks." }),
      /* @__PURE__ */ u$1("div", { class: "look-tab__presets", role: "group", "aria-label": "Colour scheme", children: SCHEME_IDS.map((id) => {
        const preset = THEME_PRESETS[id];
        return /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: `look-tab__preset${theme.preset === id ? " look-tab__preset--chosen" : ""}`,
            "aria-pressed": theme.preset === id,
            onClick: () => choosePreset(id),
            children: [
              /* @__PURE__ */ u$1(
                "span",
                {
                  class: "look-tab__swatch",
                  style: { background: preset.colours.background, color: preset.colours.text, borderColor: preset.colours.border },
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ u$1("span", { class: "look-tab__swatch-dot", style: { background: preset.colours.accent } }),
                    "Aa"
                  ]
                }
              ),
              /* @__PURE__ */ u$1("span", { class: "access-tab__preset-name", children: preset.name }),
              /* @__PURE__ */ u$1("span", { class: "access-tab__preset-hint", children: preset.hint })
            ]
          },
          id
        );
      }) })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Make your own" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Choose each colour. It starts from the scheme you are using now." }),
      /* @__PURE__ */ u$1("div", { class: "look-tab__custom", children: CUSTOM_FIELDS.map((field) => /* @__PURE__ */ u$1("label", { class: "look-tab__colour-row", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "color",
            value: colours[field.key],
            "aria-label": field.label,
            onInput: (event) => setCustom(field.key, event.target.value)
          }
        ),
        /* @__PURE__ */ u$1("span", { children: [
          /* @__PURE__ */ u$1("strong", { children: field.label }),
          /* @__PURE__ */ u$1("span", { class: "access-tab__preset-hint", children: [
            " ",
            field.hint
          ] })
        ] })
      ] }, field.key)) }),
      /* @__PURE__ */ u$1("p", { class: "look-tab__readability", role: "status", "data-readable": readable >= 4.5, children: readable >= 4.5 ? "The writing is easy to read on this background." : "The writing is hard to read on this background. Choose colours that are further apart, one light and one dark." }),
      theme.preset === "custom" && /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Using your own colours." })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Colours of the words" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Each kind of word has a colour, so a child can learn to look for it: people, doing words, describing words and so on. You can change any of them. Keep each one different from the others so the colour still means something." }),
      /* @__PURE__ */ u$1("div", { class: "look-tab__custom", children: FITZGERALD_CLASSES.map((cls) => /* @__PURE__ */ u$1("div", { class: "look-tab__colour-row", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "color",
            value: chosenWords[cls],
            "aria-label": FITZGERALD_LABELS[cls],
            onInput: (event) => setWordColour(cls, event.target.value)
          }
        ),
        /* @__PURE__ */ u$1(
          "span",
          {
            class: "look-tab__word-sample",
            style: { background: chosenWords[cls], color: readableOn(chosenWords[cls]) },
            "aria-hidden": "true",
            children: "word"
          }
        ),
        /* @__PURE__ */ u$1("span", { children: FITZGERALD_LABELS[cls] }),
        theme.wordColours[cls] && /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            "aria-label": `Put back the usual colour for ${FITZGERALD_LABELS[cls]}`,
            onClick: () => resetWordColour(cls),
            children: "Usual colour"
          }
        )
      ] }, cls)) }),
      alike.length > 0 && /* @__PURE__ */ u$1("p", { class: "look-tab__readability", role: "status", "data-readable": "false", children: [
        alike.map(([a2, b2]) => `${FITZGERALD_LABELS[a2]} and ${FITZGERALD_LABELS[b2]}`).join("; "),
        " ",
        "look very alike. Choose colours that are easier to tell apart."
      ] }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          disabled: Object.keys(theme.wordColours).length === 0,
          onClick: () => save({ ...theme, wordColours: {} }),
          children: "Put all the word colours back"
        }
      )
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Pictures" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "The pictures on the buttons: drawn symbols made for this app, or emoji. And whether each button shows a picture, a word or both. Words and pictures you add yourself are never changed. Some emoji have no drawing yet, and those still show as emoji." }),
      /* @__PURE__ */ u$1(PictureChoices, {})
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Start again" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          disabled: theme.preset === "standard" && Object.keys(theme.wordColours).length === 0,
          onClick: () => save({ preset: "standard", custom: { ...THEME_PRESETS.standard.colours }, wordColours: {} }),
          children: "Put everything back to the usual look"
        }
      )
    ] })
  ] });
}
function Swatches({ label, colours, value, onChoose }) {
  return /* @__PURE__ */ u$1("div", { class: "body-tab__swatches", role: "group", "aria-label": label, children: colours.map((hex) => /* @__PURE__ */ u$1(
    "button",
    {
      type: "button",
      class: `body-tab__swatch${value === hex ? " body-tab__swatch--on" : ""}`,
      style: { background: hex },
      "aria-label": `${label} ${hex}`,
      "aria-pressed": value === hex,
      onClick: () => onChoose(hex)
    },
    hex
  )) });
}
function BodyTab() {
  const look = withDefaults(myBodySetting.signal.value);
  function update(changes) {
    void myBodySetting.set({ ...withDefaults(myBodySetting.signal.value), ...changes });
  }
  function toggleExtra(id, on) {
    const current = withDefaults(myBodySetting.signal.value).extras;
    update({ extras: on ? [...current.filter((e2) => e2 !== id), id] : current.filter((e2) => e2 !== id) });
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body body-tab", children: [
    /* @__PURE__ */ u$1("div", { class: "body-tab__controls", children: [
      /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
        "Make the figure on ",
        /* @__PURE__ */ u$1("strong", { children: "My body" }),
        " look like the child, so it is easier for them to point to themselves. The child finds it in ",
        /* @__PURE__ */ u$1("strong", { children: "Feelings & Help" }),
        " on the Home screen, under ",
        /* @__PURE__ */ u$1("strong", { children: "My body" }),
        ", and you can also put it on the top bar in Quick Access. The figure is always dressed. The private area is only ever called ",
        /* @__PURE__ */ u$1("strong", { children: "Under my pants" }),
        ", and nothing the child points to is saved, flagged or sent anywhere. If a child tells you something that worries you, follow your safeguarding procedure."
      ] }),
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Figure" }),
      /* @__PURE__ */ u$1("div", { class: "body-tab__choices", role: "group", "aria-label": "Figure", children: Object.keys(FIGURE_STARTS).map((figure) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `body-tab__choice${look.figure === figure ? " body-tab__choice--on" : ""}`,
          "aria-pressed": look.figure === figure,
          onClick: () => update(FIGURE_STARTS[figure].changes),
          children: [
            /* @__PURE__ */ u$1(HeadPreview, { look: { ...look, ...FIGURE_STARTS[figure].changes } }),
            FIGURE_STARTS[figure].label
          ]
        },
        figure
      )) }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Choosing a figure also picks hair and clothes to start from. Change any of them below." }),
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Skin" }),
      /* @__PURE__ */ u$1(Swatches, { label: "Skin", colours: SKIN_TONES, value: look.skin, onChoose: (skin) => update({ skin }) }),
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Hair" }),
      /* @__PURE__ */ u$1(Swatches, { label: "Hair", colours: HAIR_COLOURS, value: look.hair, onChoose: (hair) => update({ hair }) }),
      /* @__PURE__ */ u$1("div", { class: "body-tab__choices", role: "group", "aria-label": "Hair style", children: HAIR_STYLES.map((style) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `body-tab__choice${look.hairStyle === style.id ? " body-tab__choice--on" : ""}`,
          "aria-pressed": look.hairStyle === style.id,
          onClick: () => update({ hairStyle: style.id }),
          children: [
            /* @__PURE__ */ u$1(HeadPreview, { look: { ...look, hairStyle: style.id, headwear: "none" } }),
            style.label
          ]
        },
        style.id
      )) }),
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Head covering" }),
      /* @__PURE__ */ u$1("div", { class: "body-tab__choices", role: "group", "aria-label": "Head covering", children: HEADWEAR.map((item) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `body-tab__choice${look.headwear === item.id ? " body-tab__choice--on" : ""}`,
          "aria-pressed": look.headwear === item.id,
          onClick: () => update({ headwear: item.id }),
          children: [
            /* @__PURE__ */ u$1(HeadPreview, { look: { ...look, headwear: item.id } }),
            item.label
          ]
        },
        item.id
      )) }),
      look.headwear !== "none" && /* @__PURE__ */ u$1(Swatches, { label: "Head covering colour", colours: CLOTHES_COLOURS, value: look.headwearColour, onChoose: (headwearColour) => update({ headwearColour }) }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: HEADWEAR.find((item) => item.id === look.headwear)?.hint || "Only if the child wears one. A hijab, a turban or a kippah can be shown." }),
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Clothes" }),
      /* @__PURE__ */ u$1("div", { class: "body-tab__choices", role: "group", "aria-label": "Bottoms", children: OUTFITS.map((outfit) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `body-tab__choice${look.outfit === outfit.id ? " body-tab__choice--on" : ""}`,
          "aria-pressed": look.outfit === outfit.id,
          onClick: () => update({ outfit: outfit.id }),
          children: outfit.label
        },
        outfit.id
      )) }),
      /* @__PURE__ */ u$1(Swatches, { label: "Top", colours: CLOTHES_COLOURS, value: look.top, onChoose: (top) => update({ top }) }),
      /* @__PURE__ */ u$1(Swatches, { label: "Bottoms", colours: CLOTHES_COLOURS, value: look.bottom, onChoose: (bottom) => update({ bottom }) }),
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Wheelchair and glasses" }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
        /* @__PURE__ */ u$1("input", { type: "checkbox", checked: look.wheelchair, onChange: (event) => update({ wheelchair: event.target.checked }) }),
        "Uses a wheelchair"
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
        /* @__PURE__ */ u$1("input", { type: "checkbox", checked: look.glasses, onChange: (event) => update({ glasses: event.target.checked }) }),
        "Wears glasses"
      ] }),
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Equipment and aids" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Show what the child uses. Each one can then be pointed to on My body, to say it hurts, is too tight or is not working." }),
      EQUIPMENT.map((item) => {
        const unavailable = Boolean(item.notWithChair) && look.wheelchair;
        return /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "checkbox",
              checked: look.extras.includes(item.id) && !unavailable,
              disabled: unavailable,
              onChange: (event) => toggleExtra(item.id, event.target.checked)
            }
          ),
          item.label,
          " ",
          /* @__PURE__ */ u$1("span", { class: "access-tab__preset-hint", children: item.hint })
        ] }, item.id);
      }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void myBodySetting.set({ ...DEFAULT_BODY_LOOK }), children: "Put the figure back to how it started" })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "body-tab__preview", "aria-label": "How the figure looks", children: /* @__PURE__ */ u$1(BodyFigure, { look, view: "front" }) })
  ] });
}
const EMOJIS = ["🎵", "🎶", "🎤", "🎸", "🥁", "🎹", "🎺", "🐑", "⭐", "🌙", "🚌", "🐸", "🦆", "🌈", "🎄", "💤"];
function MusicTab() {
  const message = useSignal("");
  const adding = useSignal(false);
  const songs = songsSetting.signal.value;
  const playlists = playlistsSetting.signal.value;
  const newListName = useSignal("");
  const total = songs.reduce((sum, song) => sum + song.bytes, 0);
  async function addFiles(files) {
    if (!files || files.length === 0) return;
    adding.value = true;
    const notes = [];
    let list = [...songsSetting.signal.value];
    for (const file of Array.from(files)) {
      if (!isAudioFile(file)) {
        notes.push(`${file.name} is not a sound file.`);
        continue;
      }
      if (file.size > MAX_SONG_BYTES) {
        notes.push(`${file.name} is bigger than ${formatSize(MAX_SONG_BYTES)}.`);
        continue;
      }
      if (list.length >= MAX_SONGS) {
        notes.push(`There is room for ${MAX_SONGS} songs. ${file.name} was not added.`);
        continue;
      }
      const blobId = await saveVoiceClip(file);
      const song = {
        id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: titleFromFile(file.name) || "Song",
        emoji: "🎵",
        blobId,
        bytes: file.size
      };
      list = [...list, song];
      await songsSetting.set(list);
    }
    adding.value = false;
    message.value = notes.length > 0 ? notes.join(" ") : `Added ${files.length === 1 ? "the song" : `${files.length} songs`}.`;
  }
  function update(id, changes) {
    void songsSetting.set(songsSetting.signal.value.map((song) => song.id === id ? { ...song, ...changes } : song));
  }
  function move(index, by) {
    const list = [...songsSetting.signal.value];
    const target = index + by;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    void songsSetting.set(list);
  }
  async function remove(song) {
    await songsSetting.set(songsSetting.signal.value.filter((s2) => s2.id !== song.id));
    await playlistsSetting.set(
      playlistsSetting.signal.value.map((list) => ({ ...list, songIds: list.songIds.filter((id) => id !== song.id) }))
    );
    await deleteVoiceClip(song.blobId);
  }
  function addPlaylist() {
    const name = newListName.value.trim();
    if (!name || playlistsSetting.signal.value.length >= MAX_PLAYLISTS) return;
    const list = { id: `list-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, emoji: "🎶", songIds: [] };
    void playlistsSetting.set([...playlistsSetting.signal.value, list]);
    newListName.value = "";
  }
  function updatePlaylist(id, changes) {
    void playlistsSetting.set(playlistsSetting.signal.value.map((list) => list.id === id ? { ...list, ...changes } : list));
  }
  function movePlaylistSong(list, index, by) {
    const ids = [...list.songIds];
    const target = index + by;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    updatePlaylist(list.id, { songIds: ids });
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body music-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "Add songs from files on this ",
      deviceNoun(),
      ", such as MP3s. They stay on this ",
      deviceNoun(),
      " and play with no internet. There is no Spotify or Apple Music: those need an account and an internet connection, which this app never uses. Songs you have bought as ordinary files, songs copied from a CD, and recordings of someone singing all work. Songs that are locked to a streaming app cannot be added."
    ] }),
    /* @__PURE__ */ u$1("label", { class: "parent-mode-screen__button music-tab__add", children: [
      adding.value ? "Adding…" : `Add songs from this ${deviceNoun()}`,
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "file",
          accept: "audio/*,.mp3,.m4a,.wav,.ogg,.opus,.flac",
          multiple: true,
          class: "music-tab__file",
          onChange: (event) => {
            const input = event.target;
            void addFiles(input.files).then(() => input.value = "");
          }
        }
      )
    ] }),
    /* @__PURE__ */ u$1("p", { role: "status", class: "music-tab__message", children: message.value }),
    /* @__PURE__ */ u$1("label", { class: "access-tab__slider-row", children: [
      "Music volume ",
      Math.round(musicVolumeSetting.signal.value * 100),
      "%",
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "range",
          min: 0.1,
          max: 1,
          step: 0.05,
          value: musicVolumeSetting.signal.value,
          onInput: (event) => void musicVolumeSetting.set(Number(event.target.value))
        }
      )
    ] }),
    songs.length === 0 ? /* @__PURE__ */ u$1("p", { children: "No songs yet." }) : /* @__PURE__ */ u$1("ul", { class: "music-tab__list", children: songs.map((song, index) => /* @__PURE__ */ u$1("li", { class: "music-tab__song", children: [
      /* @__PURE__ */ u$1(
        "select",
        {
          class: "music-tab__emoji",
          "aria-label": `Picture for ${song.title}`,
          value: song.emoji,
          onChange: (event) => update(song.id, { emoji: event.target.value }),
          children: EMOJIS.map((emoji) => /* @__PURE__ */ u$1("option", { value: emoji, children: emoji }, emoji))
        }
      ),
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "text",
          class: "parent-mode-screen__label-input",
          "aria-label": `Name of ${song.title}`,
          value: song.title,
          onInput: (event) => update(song.id, { title: event.target.value })
        }
      ),
      /* @__PURE__ */ u$1("span", { class: "music-tab__size", children: formatSize(song.bytes) }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", "aria-label": `Move ${song.title} up`, disabled: index === 0, onClick: () => move(index, -1), children: "▲" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", "aria-label": `Move ${song.title} down`, disabled: index === songs.length - 1, onClick: () => move(index, 1), children: "▼" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", "aria-label": `Remove ${song.title}`, onClick: () => void remove(song), children: "Remove" })
    ] }, song.id)) }),
    /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
      songs.length,
      " of ",
      MAX_SONGS,
      " songs, ",
      formatSize(total),
      " in all.",
      total > BIG_LIBRARY_BYTES && " This is a lot of music: a backup will be large, and slow to save."
    ] }),
    /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Playlists" }),
    /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "A playlist is a named list of songs, such as bedtime or car journey. On the Music screen each one is a choice along the top, with a Play all button that plays it through once when pressed. Nothing plays by itself." }),
    /* @__PURE__ */ u$1(
      "form",
      {
        class: "music-tab__playlist-head",
        onSubmit: (event) => {
          event.preventDefault();
          addPlaylist();
        },
        children: [
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "text",
              class: "parent-mode-screen__label-input",
              "aria-label": "Name of the new playlist",
              placeholder: "Name of a playlist",
              value: newListName.value,
              onInput: (event) => newListName.value = event.target.value
            }
          ),
          /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: !newListName.value.trim() || playlists.length >= MAX_PLAYLISTS || songs.length === 0, children: "Add playlist" })
        ]
      }
    ),
    songs.length === 0 && /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Add some songs first." }),
    playlists.map((list) => {
      const inList = songsInPlaylist(list, songs);
      const available = songs.filter((song) => !list.songIds.includes(song.id));
      return /* @__PURE__ */ u$1("div", { class: "music-tab__playlist", children: [
        /* @__PURE__ */ u$1("div", { class: "music-tab__playlist-head", children: [
          /* @__PURE__ */ u$1(
            "select",
            {
              class: "music-tab__emoji",
              "aria-label": `Picture for ${list.name}`,
              value: list.emoji,
              onChange: (event) => updatePlaylist(list.id, { emoji: event.target.value }),
              children: EMOJIS.map((emoji) => /* @__PURE__ */ u$1("option", { value: emoji, children: emoji }, emoji))
            }
          ),
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "text",
              class: "parent-mode-screen__label-input",
              "aria-label": `Name of playlist ${list.name}`,
              value: list.name,
              onInput: (event) => updatePlaylist(list.id, { name: event.target.value })
            }
          ),
          /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__button",
              "aria-label": `Delete the playlist ${list.name}`,
              onClick: () => void playlistsSetting.set(playlistsSetting.signal.value.filter((l2) => l2.id !== list.id)),
              children: "Delete playlist"
            }
          )
        ] }),
        inList.length === 0 ? /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "No songs in it yet." }) : /* @__PURE__ */ u$1("ol", { class: "music-tab__list", children: inList.map((song, index) => /* @__PURE__ */ u$1("li", { class: "music-tab__song", children: [
          /* @__PURE__ */ u$1("span", { "aria-hidden": "true", children: song.emoji }),
          /* @__PURE__ */ u$1("span", { class: "music-tab__pick", children: song.title }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", "aria-label": `Move ${song.title} up in ${list.name}`, disabled: index === 0, onClick: () => movePlaylistSong(list, index, -1), children: "▲" }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", "aria-label": `Move ${song.title} down in ${list.name}`, disabled: index === inList.length - 1, onClick: () => movePlaylistSong(list, index, 1), children: "▼" }),
          /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__button",
              "aria-label": `Take ${song.title} out of ${list.name}`,
              onClick: () => updatePlaylist(list.id, { songIds: list.songIds.filter((id) => id !== song.id) }),
              children: "Take out"
            }
          )
        ] }, song.id)) }),
        available.length > 0 && /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
          "Add a song to ",
          list.name,
          /* @__PURE__ */ u$1(
            "select",
            {
              "aria-label": `Add a song to ${list.name}`,
              value: "",
              onChange: (event) => {
                const id = event.target.value;
                if (id) updatePlaylist(list.id, { songIds: [...list.songIds, id] });
              },
              children: [
                /* @__PURE__ */ u$1("option", { value: "", children: "Choose a song" }),
                available.map((song) => /* @__PURE__ */ u$1("option", { value: song.id, children: song.title }, song.id))
              ]
            }
          )
        ] })
      ] }, list.id);
    })
  ] });
}
function JokesTab() {
  const question = useSignal("");
  const answer = useSignal("");
  const jokes = customJokesSetting.signal.value;
  function add(event) {
    event.preventDefault();
    const q2 = question.value.trim();
    const a2 = answer.value.trim();
    if (!q2 || !a2) return;
    void customJokesSetting.set([...customJokesSetting.signal.value, { q: q2, a: a2 }]);
    question.value = "";
    answer.value = "";
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body jokes-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "Jokes are in Games. There are ",
      BASIC_JOKES.length,
      " very simple ones already. Add your own here: a question, and its answer."
    ] }),
    /* @__PURE__ */ u$1("form", { class: "jokes-tab__form", onSubmit: add, children: [
      /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
        "Question",
        /* @__PURE__ */ u$1("input", { class: "about-tab__input", type: "text", value: question.value, onInput: (e2) => question.value = e2.target.value })
      ] }),
      /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
        "Answer",
        /* @__PURE__ */ u$1("input", { class: "about-tab__input", type: "text", value: answer.value, onInput: (e2) => answer.value = e2.target.value })
      ] }),
      /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: !question.value.trim() || !answer.value.trim(), children: "Add joke" })
    ] }),
    jokes.length === 0 ? /* @__PURE__ */ u$1("p", { children: "No jokes of your own yet." }) : /* @__PURE__ */ u$1("ul", { class: "jokes-tab__list", children: jokes.map((joke, index) => /* @__PURE__ */ u$1("li", { class: "jokes-tab__joke", children: [
      /* @__PURE__ */ u$1("span", { children: [
        /* @__PURE__ */ u$1("strong", { children: joke.q }),
        " ",
        joke.a
      ] }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          "aria-label": `Remove the joke: ${joke.q}`,
          onClick: () => void customJokesSetting.set(customJokesSetting.signal.value.filter((_2, i2) => i2 !== index)),
          children: "Remove"
        }
      )
    ] }, index)) })
  ] });
}
const isMac = () => typeof navigator !== "undefined" && /Mac/i.test(navigator.platform || navigator.userAgent);
const emojiPickerHint = (mac = isMac()) => mac ? "press Control, Command and Space together" : "press the Windows key and the full stop together";
const usual = (id) => SEASONS.find((s2) => s2.id === id) ?? MORE_SEASONS.find((s2) => s2.id === id);
function SeasonsTab() {
  const config = seasonsSetting.signal.value;
  const all = effectiveSeasons(config);
  const open = useSignal(null);
  const message = useSignal("");
  const newName = useSignal("");
  const newEmoji = useSignal("🎉");
  const library = useSignal("");
  const wordLabel = useSignal("");
  const wordEmoji = useSignal("⭐");
  const wordKind = useSignal("things");
  const available = MORE_SEASONS.filter((entry) => !config.custom.some((c2) => c2.id === entry.id));
  function save(next) {
    void seasonsSetting.set(next);
  }
  function toggle(id, on) {
    save({ ...config, hidden: on ? config.hidden.filter((h2) => h2 !== id) : [...config.hidden.filter((h2) => h2 !== id), id] });
  }
  function setWords(id, words) {
    save({ ...config, words: { ...config.words, [id]: words } });
  }
  function putBack(id) {
    const rest = { ...config.words };
    delete rest[id];
    const original = usual(id);
    save({ ...config, words: original && config.custom.some((c2) => c2.id === id) ? { ...rest, [id]: original.words } : rest });
    message.value = "Put back the usual words.";
  }
  function changeWord(season, index, patch) {
    const words = season.words.map((word2, i2) => i2 === index ? { ...word2, ...patch } : word2);
    setWords(season.id, words);
  }
  function addWord(season) {
    const label = wordLabel.value.trim();
    if (!label || season.words.length >= MAX_SEASON_WORDS) return;
    setWords(season.id, [...season.words, { label, emoji: wordEmoji.value.trim() || "⭐", colour: wordKind.value }]);
    wordLabel.value = "";
  }
  function addOwn(event) {
    event.preventDefault();
    const name = newName.value.trim();
    if (!name || config.custom.length >= MAX_CUSTOM_SEASONS) return;
    const id = `own-${Date.now().toString(36)}`;
    save({ ...config, custom: [...config.custom, { id, name, emoji: newEmoji.value.trim() || "🎉", tradition: "Your own" }], words: { ...config.words, [id]: [] } });
    newName.value = "";
    open.value = id;
    message.value = `Added ${name}. Add its words below.`;
  }
  function addFromList() {
    const entry = MORE_SEASONS.find((candidate) => candidate.id === library.value);
    if (!entry || config.custom.length >= MAX_CUSTOM_SEASONS) return;
    save({
      ...config,
      custom: [...config.custom, { id: entry.id, name: entry.name, emoji: entry.emoji, tradition: entry.tradition }],
      words: { ...config.words, [entry.id]: entry.words }
    });
    library.value = "";
    open.value = entry.id;
    message.value = `Added ${entry.name}. Check the words suit your family.`;
  }
  function removeOwn(id) {
    const words = { ...config.words };
    delete words[id];
    save({ hidden: config.hidden.filter((h2) => h2 !== id), words, custom: config.custom.filter((c2) => c2.id !== id) });
    if (open.value === id) open.value = null;
  }
  const groups = TRADITIONS.map((tradition) => ({ tradition, seasons: all.filter((season) => season.tradition === tradition) })).filter(
    (group) => group.seasons.length > 0
  );
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body seasons-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: "These are the times of the year and celebrations in Games, Seasons. Leave out any that are not part of your family’s life. A season you leave out leaves its place empty on the child’s screen, so nothing else moves. You can change the words in any of them, and add others." }),
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: "The words are a starting point. Only you know how your family keeps a celebration, so please read them and change anything that is not right for you." }),
    /* @__PURE__ */ u$1("p", { role: "status", class: "music-tab__message", children: message.value }),
    groups.map((group) => /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: group.tradition }),
      group.seasons.map((season) => {
        const shown = isSeasonShown(config, season.id);
        const isOpen = open.value === season.id;
        const addedByAdult = config.custom.some((c2) => c2.id === season.id);
        return /* @__PURE__ */ u$1("div", { class: "seasons-tab__season", children: [
          /* @__PURE__ */ u$1("div", { class: "seasons-tab__row", children: [
            /* @__PURE__ */ u$1("label", { class: "seasons-tab__show", children: [
              /* @__PURE__ */ u$1("input", { type: "checkbox", checked: shown, onChange: (event) => toggle(season.id, event.target.checked) }),
              /* @__PURE__ */ u$1(Pic, { class: "seasons-tab__emoji", char: season.emoji }),
              /* @__PURE__ */ u$1("span", { children: [
                /* @__PURE__ */ u$1("strong", { children: season.name }),
                season.note && /* @__PURE__ */ u$1("span", { class: "access-tab__preset-hint", children: [
                  " ",
                  season.note
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u$1(
              "button",
              {
                type: "button",
                class: "parent-mode-screen__button",
                "aria-expanded": isOpen,
                "aria-label": `${isOpen ? "Close the words for" : "Change the words for"} ${season.name}`,
                onClick: () => open.value = isOpen ? null : season.id,
                children: isOpen ? "Close" : "Change the words"
              }
            ),
            addedByAdult && /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", "aria-label": `Remove ${season.name}`, onClick: () => removeOwn(season.id), children: "Remove" })
          ] }),
          isOpen && /* @__PURE__ */ u$1("div", { class: "seasons-tab__words", children: [
            season.words.length === 0 && /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "No words yet. Add some below." }),
            season.words.map((word2, index) => /* @__PURE__ */ u$1("div", { class: "seasons-tab__word", children: [
              /* @__PURE__ */ u$1(
                "input",
                {
                  type: "text",
                  class: "seasons-tab__emoji-input",
                  "aria-label": `Picture for ${word2.label || "this word"}`,
                  maxLength: 16,
                  value: word2.emoji,
                  onInput: (event) => changeWord(season, index, { emoji: event.target.value })
                }
              ),
              /* @__PURE__ */ u$1(
                "input",
                {
                  type: "text",
                  class: "parent-mode-screen__label-input",
                  "aria-label": `Word ${index + 1} of ${season.name}`,
                  maxLength: 40,
                  value: word2.label,
                  onInput: (event) => changeWord(season, index, { label: event.target.value })
                }
              ),
              /* @__PURE__ */ u$1(
                "input",
                {
                  type: "text",
                  class: "parent-mode-screen__label-input",
                  "aria-label": `What ${word2.label || "this word"} says, if different`,
                  placeholder: "What it says, if different",
                  maxLength: 80,
                  value: word2.says ?? "",
                  onInput: (event) => {
                    const says = event.target.value;
                    const next = { label: word2.label, emoji: word2.emoji, colour: word2.colour };
                    if (says) next.says = says;
                    setWords(season.id, season.words.map((w2, i2) => i2 === index ? next : w2));
                  }
                }
              ),
              /* @__PURE__ */ u$1(
                "select",
                {
                  "aria-label": `Kind of word for ${word2.label || "this word"}`,
                  value: word2.colour,
                  onChange: (event) => changeWord(season, index, { colour: event.target.value }),
                  children: FITZGERALD_CLASSES.map((kind) => /* @__PURE__ */ u$1("option", { value: kind, children: FITZGERALD_LABELS[kind] }, kind))
                }
              ),
              /* @__PURE__ */ u$1(
                "button",
                {
                  type: "button",
                  class: "parent-mode-screen__button",
                  "aria-label": `Remove the word ${word2.label || "this word"} from ${season.name}`,
                  onClick: () => setWords(season.id, season.words.filter((_2, i2) => i2 !== index)),
                  children: "Remove"
                }
              )
            ] }, index)),
            season.words.length < MAX_SEASON_WORDS ? /* @__PURE__ */ u$1(
              "form",
              {
                class: "seasons-tab__word seasons-tab__add",
                onSubmit: (event) => {
                  event.preventDefault();
                  addWord(season);
                },
                children: [
                  /* @__PURE__ */ u$1(
                    "input",
                    {
                      type: "text",
                      class: "seasons-tab__emoji-input",
                      "aria-label": "Picture for the new word",
                      maxLength: 16,
                      value: wordEmoji.value,
                      onInput: (event) => wordEmoji.value = event.target.value
                    }
                  ),
                  /* @__PURE__ */ u$1(
                    "input",
                    {
                      type: "text",
                      class: "parent-mode-screen__label-input",
                      "aria-label": "The new word",
                      placeholder: "A new word",
                      maxLength: 40,
                      value: wordLabel.value,
                      onInput: (event) => wordLabel.value = event.target.value
                    }
                  ),
                  /* @__PURE__ */ u$1(
                    "select",
                    {
                      "aria-label": "Kind of word for the new word",
                      value: wordKind.value,
                      onChange: (event) => wordKind.value = event.target.value,
                      children: FITZGERALD_CLASSES.map((kind) => /* @__PURE__ */ u$1("option", { value: kind, children: FITZGERALD_LABELS[kind] }, kind))
                    }
                  ),
                  /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: !wordLabel.value.trim(), children: "Add word" })
                ]
              }
            ) : /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
              "That is the most words for one season (",
              MAX_SEASON_WORDS,
              ")."
            ] }),
            /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
              "To choose a picture, ",
              emojiPickerHint(),
              ", then pick an emoji. The kind of word sets the colour of its button."
            ] }),
            (config.words[season.id] !== void 0 || addedByAdult) && (usual(season.id) || config.words[season.id]) && /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => putBack(season.id), children: "Put back the usual words" })
          ] })
        ] }, season.id);
      })
    ] }, group.tradition)),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Add a celebration" }),
      available.length > 0 && /* @__PURE__ */ u$1("div", { class: "seasons-tab__row", children: [
        /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
          "From a list",
          /* @__PURE__ */ u$1("select", { "aria-label": "Add a celebration from the list", value: library.value, onChange: (event) => library.value = event.target.value, children: [
            /* @__PURE__ */ u$1("option", { value: "", children: "Choose one" }),
            available.map((entry) => /* @__PURE__ */ u$1("option", { value: entry.id, children: [
              entry.name,
              " (",
              entry.tradition === "Other celebrations" ? "any family" : entry.tradition,
              ")"
            ] }, entry.id))
          ] })
        ] }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", disabled: !library.value || config.custom.length >= MAX_CUSTOM_SEASONS, onClick: addFromList, children: "Add it" })
      ] }),
      /* @__PURE__ */ u$1("form", { class: "seasons-tab__row", onSubmit: addOwn, children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            class: "seasons-tab__emoji-input",
            "aria-label": "Picture for your own celebration",
            maxLength: 16,
            value: newEmoji.value,
            onInput: (event) => newEmoji.value = event.target.value
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            class: "parent-mode-screen__label-input",
            "aria-label": "Name of your own celebration",
            placeholder: "Or name your own",
            maxLength: 40,
            value: newName.value,
            onInput: (event) => newName.value = event.target.value
          }
        ),
        /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: !newName.value.trim() || config.custom.length >= MAX_CUSTOM_SEASONS, children: "Add" })
      ] }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        "Up to ",
        MAX_CUSTOM_SEASONS,
        " of your own."
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Start again" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          disabled: config.hidden.length === 0 && Object.keys(config.words).length === 0 && config.custom.length === 0,
          onClick: () => {
            save({ hidden: [], words: {}, custom: [] });
            open.value = null;
            message.value = "Everything is back to the usual seasons and words.";
          },
          children: "Put everything back to the usual"
        }
      )
    ] })
  ] });
}
function LostModeTab() {
  const lost = lostModeSetting.signal.value;
  const profile = userProfileSetting.signal.value;
  const named = profile.deviceName.trim() || profile.name.trim() ? deviceTitle(profile) : "";
  function update(changes) {
    void lostModeSetting.set({ ...lostModeSetting.signal.value, ...changes });
  }
  const ready = canTurnOn(lost);
  const school = suggestedReturnTo(schoolInfoSetting.signal.value);
  const schoolPhone = schoolInfoSetting.signal.value.phone.trim();
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body lost-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "If the device goes missing, turn Lost mode on and the screen asks whoever has it to return it, with the details you type here. These details are shown on the screen to anyone while Lost mode is on, and at no other time. Only the Parent PIN turns it off. This is a note on the screen: the app has no internet, so it cannot find a device or lock it from somewhere else. Turn it on ",
      /* @__PURE__ */ u$1("strong", { children: "before" }),
      " the device is lost if you can, for example when it is left somewhere."
    ] }),
    /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      "Return it to (a name, a school or a place)",
      /* @__PURE__ */ u$1("input", { class: "about-tab__input", type: "text", value: lost.returnTo, onInput: (e2) => update({ returnTo: e2.target.value }) })
    ] }),
    school && lost.returnTo.trim() !== school && /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "parent-mode-screen__button",
        onClick: () => update({ returnTo: school, phone: lost.phone.trim() || schoolPhone }),
        children: [
          "Use the school: ",
          school
        ]
      }
    ),
    /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      "Phone number",
      /* @__PURE__ */ u$1("input", { class: "about-tab__input", type: "tel", value: lost.phone, onInput: (e2) => update({ phone: e2.target.value }) })
    ] }),
    /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      "Address (optional)",
      /* @__PURE__ */ u$1("input", { class: "about-tab__input", type: "text", value: lost.address, onInput: (e2) => update({ address: e2.target.value }) })
    ] }),
    /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      "Anything else to say (optional)",
      /* @__PURE__ */ u$1("textarea", { class: "about-tab__input about-tab__textarea", value: lost.note, onInput: (e2) => update({ note: e2.target.value }) })
    ] }),
    /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "What it will say" }),
    /* @__PURE__ */ u$1("p", { class: "lost-tab__preview", children: lostMessage(lost, named) }),
    lost.on ? /* @__PURE__ */ u$1("p", { role: "status", class: "lost-tab__on", children: "Lost mode is on. The screen is covered until the PIN is entered." }) : /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", disabled: !ready, onClick: () => update({ on: true }), children: "Turn Lost mode on" }),
      !ready && /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Type a name, a phone number or an address first." })
    ] })
  ] });
}
const __vite_glob_0_0 = "" + new URL("body-back-De5gWeiR.png", import.meta.url).href;
const __vite_glob_0_1 = "" + new URL("body-pointing-MFiRqWX6.png", import.meta.url).href;
const __vite_glob_0_2 = "" + new URL("calm-CcF52s7L.png", import.meta.url).href;
const __vite_glob_0_3 = "" + new URL("feelings-ouEJyuv2.png", import.meta.url).href;
const __vite_glob_0_4 = "" + new URL("game-draw-CMHejC9w.png", import.meta.url).href;
const __vite_glob_0_5 = "" + new URL("game-find-BLxu7z81.png", import.meta.url).href;
const __vite_glob_0_6 = "" + new URL("game-jokes-DUsBsXmi.png", import.meta.url).href;
const __vite_glob_0_7 = "" + new URL("game-piano-f1Jez8dm.png", import.meta.url).href;
const __vite_glob_0_8 = "" + new URL("game-rollercoaster-DU2mOSl_.png", import.meta.url).href;
const __vite_glob_0_9 = "" + new URL("game-seasons-BwU1Fixe.png", import.meta.url).href;
const __vite_glob_0_10 = "" + new URL("game-snap-BnNRKEW1.png", import.meta.url).href;
const __vite_glob_0_11 = "" + new URL("game-tree-ASRzFvE9.png", import.meta.url).href;
const __vite_glob_0_12 = "" + new URL("games-Dsi3HjlK.png", import.meta.url).href;
const __vite_glob_0_13 = "" + new URL("help-BXoIkAkM.png", import.meta.url).href;
const __vite_glob_0_14 = "" + new URL("home-night-Bt6_OXu0.png", import.meta.url).href;
const __vite_glob_0_15 = "" + new URL("home-C4FoLuHg.png", import.meta.url).href;
const __vite_glob_0_16 = "" + new URL("keyboard-BjL7SiY-.png", import.meta.url).href;
const __vite_glob_0_17 = "" + new URL("lost-mode-B9B_y6Jo.png", import.meta.url).href;
const __vite_glob_0_18 = "" + new URL("medical-info-CvFcZw1j.png", import.meta.url).href;
const __vite_glob_0_19 = "" + new URL("parent-about-me-DrVeguP4.png", import.meta.url).href;
const __vite_glob_0_20 = "" + new URL("parent-access-DpXvH_y3.png", import.meta.url).href;
const __vite_glob_0_21 = "" + new URL("parent-backup-htgvS-b_.png", import.meta.url).href;
const __vite_glob_0_22 = "" + new URL("parent-boards-CVQ0fip7.png", import.meta.url).href;
const __vite_glob_0_23 = "" + new URL("parent-guide-CyWsKuHr.png", import.meta.url).href;
const __vite_glob_0_24 = "" + new URL("parent-learning-Q5aEhZ6C.png", import.meta.url).href;
const __vite_glob_0_25 = "" + new URL("parent-look-pink-Dboi5lLU.png", import.meta.url).href;
const __vite_glob_0_26 = "" + new URL("parent-look-BeYw1oVp.png", import.meta.url).href;
const __vite_glob_0_27 = "" + new URL("parent-lost-mode-Cs1znMGk.png", import.meta.url).href;
const __vite_glob_0_28 = "" + new URL("parent-medical-DCxjzZxg.png", import.meta.url).href;
const __vite_glob_0_29 = "" + new URL("parent-music--D0b15a_.png", import.meta.url).href;
const __vite_glob_0_30 = "" + new URL("parent-my-body-DCNNoL5U.png", import.meta.url).href;
const __vite_glob_0_31 = "" + new URL("parent-my-day-CQkgzy1V.png", import.meta.url).href;
const __vite_glob_0_32 = "" + new URL("parent-my-pages--WBCuh_T.png", import.meta.url).href;
const __vite_glob_0_33 = "" + new URL("parent-quick-access-CkdVNf8x.png", import.meta.url).href;
const __vite_glob_0_34 = "" + new URL("parent-school-CAy16wfx.png", import.meta.url).href;
const __vite_glob_0_35 = "" + new URL("parent-seasons-DCGIhTTD.png", import.meta.url).href;
const __vite_glob_0_36 = "" + new URL("parent-user-QYGjYEkz.png", import.meta.url).href;
const __vite_glob_0_37 = "" + new URL("school-button-CbyZdKE-.png", import.meta.url).href;
const __vite_glob_0_38 = "" + new URL("school-classroom-D59cMDRR.png", import.meta.url).href;
const __vite_glob_0_39 = "" + new URL("school-guide-Do9WEie2.png", import.meta.url).href;
const __vite_glob_0_40 = "" + new URL("school-lessons-lsQosgBm.png", import.meta.url).href;
const __vite_glob_0_41 = "" + new URL("school-pin-entry-BLyDLCx1.png", import.meta.url).href;
const __vite_glob_0_42 = "" + new URL("school-pupil-DIARZbYo.png", import.meta.url).href;
const __vite_glob_0_43 = "" + new URL("school-safeguarding-Rbxi48Iu.png", import.meta.url).href;
const __vite_glob_0_44 = "" + new URL("school-timetable-F4iGA7-e.png", import.meta.url).href;
const __vite_glob_0_45 = "" + new URL("school-today-DxTFmCDd.png", import.meta.url).href;
const __vite_glob_0_46 = "" + new URL("school-vocabulary-DKRkuZVO.png", import.meta.url).href;
const __vite_glob_0_47 = "" + new URL("setup-1-welcome-CCTLC3tU.png", import.meta.url).href;
const __vite_glob_0_48 = "" + new URL("setup-2-whose-device-Ct9EqrNy.png", import.meta.url).href;
const __vite_glob_0_49 = "" + new URL("setup-3-voice-NCYtvLvg.png", import.meta.url).href;
const __vite_glob_0_50 = "" + new URL("setup-4-grid-jF6K-lWB.png", import.meta.url).href;
const __vite_glob_0_51 = "" + new URL("setup-5-pictures-CoyYziVH.png", import.meta.url).href;
const __vite_glob_0_52 = "" + new URL("setup-6-press-qnL35xxR.png", import.meta.url).href;
const __vite_glob_0_53 = "" + new URL("setup-7-colours-CM7DzL1H.png", import.meta.url).href;
const __vite_glob_0_54 = "" + new URL("setup-8-pin-and-code-6LAgF1yB.png", import.meta.url).href;
const __vite_glob_0_55 = "" + new URL("setup-9-ready-Dk-KZV5t.png", import.meta.url).href;
const __vite_glob_0_56 = "" + new URL("staff-activity-Dr87N3o7.png", import.meta.url).href;
const __vite_glob_0_57 = "" + new URL("staff-handover-CYNfAnfj.png", import.meta.url).href;
const __vite_glob_0_58 = "" + new URL("staff-notes-B6qv_UYy.png", import.meta.url).href;
const __vite_glob_0_59 = "" + new URL("staff-review-BBHxDQKK.png", import.meta.url).href;
const __vite_glob_0_60 = "" + new URL("staff-targets-CmsgAYLO.png", import.meta.url).href;
const __vite_glob_0_61 = "" + new URL("talk-emoji-BLvfxp4O.png", import.meta.url).href;
const __vite_glob_0_62 = "" + new URL("talk-pink-utgKcgXU.png", import.meta.url).href;
const __vite_glob_0_63 = "" + new URL("talk-sentence-zO-5F2Rl.png", import.meta.url).href;
const __vite_glob_0_64 = "" + new URL("talk-CqhUzwo7.png", import.meta.url).href;
const __vite_glob_0_65 = "" + new URL("traffic-light-GflB_Ka-.png", import.meta.url).href;
const parentsGuide = `# Getting started: parents and carers

Rugged Speech is a communication companion for a child who finds speaking difficult. It has big buttons with pictures and words. When your child presses them, the app says the words out loud.

This guide takes you from nothing to a child using it, in about twenty minutes. You do not need to be good with computers.

![The Talk page: big, coloured buttons with a picture and a word on each](images/talk.png)

> Everything stays on your computer. There is no account, no internet connection needed and nothing is sent anywhere. It works exactly the same with the wifi off.

## What you need

- A **Windows 10 or Windows 11** computer or tablet (64-bit), or a **Mac**. A touchscreen is ideal, but a mouse works.
- The installer: a single file called **Rugged Speech Setup 0.0.1.exe** (the number may be newer).
- About 10 minutes for set-up, and a quiet moment to choose a voice with your child if you can.

You do **not** need an internet connection, an account or an administrator password.

## 1. Install it

**On a Mac**, skip to [Installing on a Mac](#installing-on-a-mac) below. The rest of this guide is the same on both.

**On Windows:**

1. Copy the installer file onto the computer (from a USB stick, an email, or wherever you were given it).
2. Double-click it.
3. Windows may show a blue box saying **Windows protected your PC**. This is normal for new software that has not paid for a signing certificate. Press **More info**, then **Run anyway**.
4. Follow the steps. It installs just for you and does not ask for an administrator password.
5. When it finishes, **Rugged Speech** opens by itself. There is also a shortcut on the desktop and in the Start menu.

If you want to be sure the file is exactly the one that was sent to you, ask whoever gave it to you for its "SHA-256" code, then open a Command Prompt and type \`certutil -hashfile "Rugged Speech Setup 0.0.1.exe" SHA256\`. The two codes should match.

### Installing on a Mac

1. Get the disk image for your Mac: **Rugged-Speech-0.0.1-mac-arm64.dmg** for a Mac with Apple silicon (M1 or later), or **-mac-x64.dmg** for an Intel Mac. The Apple menu, then **About This Mac**, says which you have.
2. Double-click it, and drag **Rugged Speech** onto **Applications**.
3. Open it from Applications. The first time, the Mac says it cannot be opened, because the app is not yet signed with an Apple Developer ID. This is normal for new software and does not mean anything is wrong. Open **System Settings**, then **Privacy & Security**, scroll down and press **Open Anyway**, and enter your Mac password. (On macOS 14 or earlier, Control-click the app and choose **Open** instead.) After this once, it opens normally.

On a Mac, your child's saved pages, photos and settings are in **Library/Application Support/Rugged Speech** in your home folder. To remove the app, drag it to the Bin (and that folder too, if you want the saved things gone).

## 2. The first-run set-up

The first time it opens, a short set-up asks a few questions, one at a time. Every question can be changed later, so do not worry about getting it perfect. There is a **Back** button on each step.

![The welcome screen](images/setup-1-welcome.png)

**Welcome.** It tells you what the app is and that nothing leaves the computer. Press **Get started**.

**Whose device is this?** Type your child's name if you like (for example *Lucy*). The device is then called *Lucy's device* and the name shows along the top of the screen, so if the device is ever found by someone else it is clear whose it is. You can add an age, or leave everything blank and press **Skip**.

![Whose device is this](images/setup-2-whose-device.png)

**Choose a voice.** Press each voice and **Try it** to hear it. Only voices that work without the internet are shown. Pick the one that sounds clearest, or friendliest, or the one your child reacts to best. You can change the speed and pitch later.

![Choose a voice](images/setup-3-voice.png)

**Choose a grid size.** This is how big the buttons are on the Talk page. Fewer, bigger buttons are easier to press; smaller buttons show more at once. Once your child has learned where things are, try not to change it often, because **buttons always stay in the same place** and that is how a child learns them.

![Choose a grid size](images/setup-4-grid.png)

**Pictures and words.** Choose what the buttons show:

- **Drawn symbols** (simple, bold pictures made for this app) or **Emoji**.
- **Picture and word**, **Pictures only** (for a child who does not read yet) or **Words only**.
- How big the writing is.

You can see a few sample buttons change as you choose.

![Pictures and words](images/setup-5-pictures.png)

**What should pressing a word do?** This matters for how your child learns the app.

- **Say the word straight away** is usually best for someone just starting. They press a button, they hear the word at once, and they learn that pressing makes sound.
- **Say it, and add it to the sentence** hears each word and also builds a sentence at the top.
- **Only add it to the sentence** means pressing **Speak** says the whole sentence.

If you are not sure, a speech and language therapist can advise. You can change it at any time under **Access**.

![What a press does](images/setup-6-press.png)

**Choose the colours.** Pick a favourite colour (pink, orange, green, turquoise, blue or purple), or whatever is easiest on the eyes. There are more favourites, other looks and your own colours, later, in **Look**.

![Choose the colours](images/setup-7-colours.png)

**Set a Parent PIN.** Choose four numbers and enter them twice. This protects the settings from being changed by accident. It is not a lock on the computer. The app then shows you a **recovery code** of four words.

![PIN and recovery code](images/setup-8-pin-and-code.png)

> **Write the recovery code down now**, and keep it somewhere safe. It is the only way back in if you forget the PIN. Nobody, including the people who made the app, can find it for you.

**You are ready.** A short reminder of where things are. You can tick **Put Games and Draw on the top bar**. Press **Start**.

![Ready](images/setup-9-ready.png)

## 3. Look around the child's screen

![The Home screen](images/home.png)

- Along the **top** are six buttons that are always there: by default **Home, Help, Yes, No, Favourites, Keyboard**. **Help** can never be taken away, so it is always one press away.
- **Give me time** speaks "I know what I want to say. Please give me a moment." It is for a child who needs time. Nothing is ever said unless someone presses something.
- The big tiles on Home are **Talk**, **Keyboard**, **My Day**, **Favourites**, **My Pages** and **Feelings & Help**. They never move.
- On every screen except Home there is a **Home** button at the top left, in the same place.
- **Medical Info** and **Parent Mode** are at the top right.

Try **Talk** now. Press a few words and listen. Press a folder (like **Food**) to see more words, then **Back** or **Home** to return.

![Building a sentence in Talk](images/talk-sentence.png)

## 4. Make it theirs (ten minutes in Parent Mode)

Press **Parent Mode** at the top right and enter your PIN. A menu down the left has everything, grouped by what it is for. The first item, **User guide**, is the whole of this guide inside the app, so you never need to look anywhere else.

![Parent Mode with the User guide](images/parent-guide.png)

The most useful things to do first:

1. **People** and **Places**. Add the people and places that matter: Mum, Grandad, nursery, the park. You can add a **photo** (from the camera or a file) and even **record a voice** (your own voice, saying the name). A button appears on the Talk page, and when pressed it says the name in your voice. This is often the thing a child loves most.
2. **My body**. Make the figure look like your child (boy, girl or non-binary; skin and hair; clothes; a wheelchair; equipment such as hearing aids or a feeding tube). A child can then point to where it hurts. See [My body](#my-body-where-it-hurts) below.
3. **About me** and **Medical**. Write a short page for anyone who looks after your child, and the medical details that matter in an emergency. Anyone can read these from the child's screen with one press, so write only what you are happy for them to read.
4. **Quick Access**. Choose which six buttons are along the top. Break, Question, Toilet, Finished and Say again speak straight away. You can also add **Games**, **Draw**, **Music**, **Traffic light** and **My body**.
5. **Look**. Colours, and drawn symbols or emoji.
6. **School** (only if a school will use it). Turn on **School Mode** and choose a separate **School PIN** for the staff. See [Getting started: teachers and staff](getting-started-staff.md).
7. **Access**. The voice (speed, pitch, volume), how a sentence is read out, and ways to help with pressing (a longer hold, ignoring accidental double presses, switch scanning).

![Quick Access](images/parent-quick-access.png)

### My body: where it hurts

On the child's screen, **Feelings & Help** has a **My body** tab. A child presses the part that hurts (on the picture or in the list), then how it feels (hurts, sore, itchy, too tight, not working) and how much, then **Say it**: *"My tummy hurts a lot."*

![Pointing to where it hurts](images/body-pointing.png)

It is safe for young children. The figure is always dressed, and the private area is only ever called **Under my pants**, with no pictures of bodies. Nothing the child points to is saved.

![Making the figure look like the child](images/parent-my-body.png)

If you add equipment (hearing aids, a pump, a feeding tube, leg braces and others), each one appears on the figure and can be pointed to: *"My pump is not working."*

> If a child tells you something that worries you, follow your own safeguarding steps. The app does not tell anyone anything, and does not record these words any differently from any others.

## 5. Things to enjoy together

**Games** (add it to the top bar in Quick Access, or tick it at the end of set-up):

![Games](images/games.png)

- **Find the word**: match a word to a picture. There is no clock and no score. After two wrong tries the right word is pointed to.
- **Snap**: turn the cards and press SNAP for two the same.
- **Rollercoaster**: build short sentences to climb each hill. Choose two, three or four words.
- **Draw**: colours, three brush sizes, Undo, and you can keep your pictures.
- **Jokes**: very simple jokes you can say, and you can add your own.
- **Music**: songs you add from files on the computer (MP3s and similar).
- **Piano**: eight big coloured keys, and tunes to follow.
- **Seasons**: words and games for spring, summer, autumn, winter, Christmas, Easter, Halloween, Bonfire Night, Diwali, Eid and Hanukkah.
- **Make a tree**: hang baubles, lights and presents on a Christmas tree.

Nothing in a game speaks or plays unless your child presses something.

![The rollercoaster](images/game-rollercoaster.png)

**Traffic light** lets your child show people, without a word, how much they want to be spoken to: red, amber or green. You can change the words it says.

![Traffic light](images/traffic-light.png)

## 6. Keep it safe

- **Back it up.** In Parent Mode, **Backup** saves one file with everything in it (photos, pages, settings). Save it somewhere safe, such as a USB stick. You can protect it with a passphrase. Do this after setting up, and again from time to time. The app reminds you if it has been a month.
- **Lost mode.** If the device goes missing, **Lost mode** covers the screen with who to return it to. Type the details in advance, in Parent Mode, under **Lost mode**.
- **Medical Info.** Fill it in, so anyone who finds your child can press **Medical Info** and see what they need, including a code a phone camera can read.
- **The PIN is not a lock.** A child can still switch to other programs. The PIN only keeps the settings safe.

## 7. A few good habits

- **Wait.** After you ask something, give plenty of time before asking again.
- **Show, do not test.** Press the buttons yourself as you talk ("I **want** a **drink**") so your child sees how it is used. Speech and language therapists call this modelling, and it is one of the best things you can do.
- **Keep buttons where they are.** Learning where a button is is how a child gets fast.
- **Start small.** A few words your child really wants (more, drink, help, stop) beat a page full of words.
- **Ask for help.** A speech and language therapist can look at the vocabulary and settings with you. The starter words are a sensible beginning, not a prescription.

## If something goes wrong

| What happened | What to do |
| --- | --- |
| I forgot the PIN | On the PIN screen press **Forgotten your PIN?** and type the recovery code you wrote down. |
| The app closed by itself | Open it again. The sentence being built and the page you were on come back. |
| There is no sound | Turn up the computer's volume, then check **Access → Voice volume** and **Voice**. Press **Hear this voice**. |
| A button is in the wrong place | In Parent Mode, **Boards**, drag the button, or use the up and down arrows. |
| I want to start again | **Boards** has **Put this board back to the starter version** for each page. |
| I want to remove it | On Windows, use **Add or remove programs**. It asks whether to keep or delete your child's saved pages, photos and settings. On a Mac, drag the app to the Bin. |

More detail on everything is in [the whole guide](user-guide.md). For teachers and staff, see [Getting started: teachers and staff](getting-started-staff.md).
`;
const staffGuide = `# Getting started: teachers and staff

This guide is for teachers, teaching assistants, key workers, SENCos and speech and language therapists who support a child who uses Rugged Speech in a school or setting.

The app is built for **one device and one pupil**. There are no pupil accounts and no class lists, and nothing is sent anywhere. Each child has their own device, with their own words, pictures, voice and settings.

**School Mode** is the part of the app made for you. It has its own button next to Parent Mode on the child's screen, its own **School PIN**, its own look, and its own menu. Parents keep the Parent PIN and never need the School PIN. You never need the Parent PIN.

![School Mode, next to Parent Mode on the child's screen](images/school-button.png)

## Before you start

- **School Mode has to be switched on once, by a parent or by whoever has the Parent PIN.** They do it in Parent Mode, under **School**, and choose the School PIN there and then. It is not part of the first set-up. If you are setting up the device yourself, you have the Parent PIN, so you can do it.
- Nothing needs the internet. It works in a classroom with the wifi off.
- If this is a new device, a short set-up runs the first time it opens. See [Getting started: parents and carers](getting-started-parents.md). In a school it is usually done together with the family or the speech and language therapist.

> The starter vocabulary is a sensible beginning, **not a clinical prescription**. Choosing words for a child is a professional decision. Please review the words with the child's speech and language therapist.

## Turning School Mode on (once)

1. Press **Parent Mode** and enter the Parent PIN.
2. Open **School** in the menu, and press **Turn School Mode on…**.
3. Choose a **four-digit School PIN**, and enter it again to confirm. Tell it only to the staff who need it.
4. A **School Mode** button now appears next to **Parent Mode**, on every screen. Nothing on the child's screen moves.

![The School tab in Parent Mode](images/parent-school.png)

If the School PIN is forgotten, whoever has the Parent PIN can choose a new one (Parent Mode, **School**, **Choose a new School PIN**). Nobody is ever locked out. **Turn School Mode off** hides the button again and keeps everything you wrote.

## Opening School Mode

Press **School Mode** and enter the School PIN. (After five wrong tries in a row, the keypad makes you wait.)

![The School Mode PIN](images/school-pin-entry.png)

School Mode closes itself after 10 minutes without use, so a device left on a desk is not left open. You can change that in **Classroom set-up**.

## Your first ten minutes

### 1. Look at Today

**Today** is the first page. It shows the date, today's timetable, how many targets are being worked on and which are due for review, how much the device has been used today (if the activity log is on), what the child is showing on the traffic light, and the latest notes. There is a box for a **quick note**, and buttons to jump to the handover sheet, lesson pages, safeguarding and set-up.

![Today](images/school-today.png)

### 2. Say who is who

**Pupil and school** shows the child (their name and age come from Parent Mode, under **User**) and holds who the child works with: the school, class, class teacher, key adult, SENCo, speech and language therapist and the school phone. It is for adults only and is never shown on the child's screen. It fills the **handover sheet** and can fill in **Lost mode**.

![Pupil and school](images/school-pupil.png)

### 3. Find the safeguarding page

**Safeguarding** has the steps to follow if a child tells you something that worries you, the **designated safeguarding lead** (type their name and phone number in once, so they are here when needed), and a plain account of what the device does and does not do. Read it before the child uses the Help section or My body.

![Safeguarding](images/school-safeguarding.png)

### 4. Set up the classroom (only if you want to)

**Classroom set-up** holds the choices that suit a school. Each is made on purpose, because each can move buttons a child already knows:

- **Use the school top bar** makes the child's top bar *Home, Help, Yes, No, Break, Question* and opens Talk to the School page. It asks first.
- **Start from a typical school day** adds a Monday to Friday timetable. It never replaces one that is already there.
- **Close School Mode after** 5, 10, 15, 30 or 60 minutes, or never.
- **Choose a new School PIN.**

![Classroom set-up](images/school-classroom.png)

### 5. Give the day a shape

**Timetable** is where the day is built. Enter a timetable once and it appears every week. A **change of plan** is announced once, when an adult saves it. Countdown warnings ("2 minutes until lunch") are off unless you turn them on, because for some children a countdown raises anxiety. **First / Then** is here too.

![Timetable](images/school-timetable.png)

### 6. Add the pages for lessons

**Lesson pages** is My Pages. Choose a ready-made start and press **Make this page**:

- **Maths lesson**, **Science and nature**, **Story time**, **PE and movement**, **Art and making**, **Computers and tablets**
- **Lunchtime**, **Assembly and quiet times**, **Working with a friend**, **Feeling too much**
- **Classroom requests**, **Hello and thank you**, and more

Each is an ordinary page once made, so you can change the words and pictures to match the real lesson. A page can be shared with another device as a file.

![Lesson pages](images/school-lessons.png)

### 7. Choose the vocabulary

**Vocabulary** is for working with the speech and language therapist. **Word stages** bring words in gradually, **focus words** get an outline, and you can have the sentence clear itself after it is spoken. Nothing moves when a word is held back: it leaves an empty place.

![Vocabulary](images/school-vocabulary.png)

### 8. Set a first target

**Targets** holds what you are working towards, in plain words ("Uses *I want* and a word to ask for what they need, four times a day"). Set a review date and a status (working on it, achieved, paused). A target that is due is marked.

![Targets](images/staff-targets.png)

### 9. Agree who writes notes

**Notes** is a place for a few kind, factual lines after a session or a day: what was tried, what happened, what to try next. Each note has a kind (*something I noticed, something that went well, an idea to try, something to follow up*), and you can show just one kind.

![Notes](images/staff-notes.png)

### 10. Print a handover sheet

**Reports → Handover sheet** puts everything someone new needs on one page: who and where, how the child communicates, what helps, how the device is set up for them, words being practised, current targets, what the traffic light means, and what is good to know. Print it, or save it as a PDF from the print window, for supply staff.

![The handover sheet](images/staff-handover.png)

## Seeing how it is being used

**Activity** is an optional log of what was said and which parts of the app were opened, with the time. It is **off until you turn it on**.

![Activity](images/staff-activity.png)

- Totals for the last hour, today, the last 7 days and the last 30 days.
- Bars by the **hour**, **day**, **week** and **month**.
- What was said most, and the log itself.
- **Save as a spreadsheet** is the only way it leaves the device, and only when you choose.
- Choose how long it is kept (7, 30, 90 days or a year). **Clear the log** empties it.

Every phrase is logged in the same way. The Help phrases are not singled out and nobody is notified. See [Safeguarding](#safeguarding) below. More use is not better communication: please do not use these numbers to judge a child or a family.

For a review meeting, **Reports → Review report** gathers the targets, the use of the device, the words most pressed and the notes over the last 30, 90, 180 or 365 days.

![The review report](images/staff-review.png)

## Supporting communication

### Model it

The most effective thing you can do is **model**: press the buttons yourself as you talk ("Let's get your **coat** on. **Coat**.") so the child sees the words and hears them. Speech and language therapists call this aided language input. You do not need to ask the child to press anything. Pressing a button on the Talk page speaks it, using the same voice.

### Wait

After you speak, count silently to ten before you say anything else. **Give me time** is a button the child can press to say they are thinking.

### Choose what pressing does

In Parent Mode, under **Access**, **When a button is pressed**: say the word straight away (often best for a child just starting), say it and add it to the sentence, or only add it. A sentence can be read out all together, with small gaps, or **one word at a time with each word lit**, so the child can see which word they are hearing. (Ask the family, or whoever has the Parent PIN, to change this with you.)

### The traffic light

A child can show, without speaking, whether they want to be spoken to. **Red**: *please leave me*. **Amber**: *talk gently and wait for me*. **Green**: *happy to talk*. It shows as a small marker along the top of every screen. Please respect it.

![Traffic light](images/traffic-light.png)

### Feeling too much

On **Feelings & Help**, **Calm** has a breathing guide and a quiet-time timer, and the **Feelings** page lets a child say how they feel and how much. **Break** on the top bar says "I need a break" in one press. Please treat a break as a communication, not as avoiding work.

### Pointing to where it hurts

**My body** (in **Feelings & Help**) lets a child point to a part of a figure that looks like them, then say how it feels and how much. If the child has equipment, such as a pump, hearing aids or a feeding tube, it can be pointed to as well ("My pump is not working").

![My body](images/body-pointing.png)

The figure is always dressed, and the private area is only ever called **Under my pants**. Pointing is spoken, but never recorded as anything special.

## Safeguarding

The device is **not a safeguarding record**. The Help section has phrases such as "Someone hurt me" and "I feel unsafe", because a child needs the words. The app speaks the phrase and stops. It does not log it differently, flag it, or tell anyone. A disclosure is handled by a person following your setting's safeguarding procedure.

- If a child says something that worries you, **follow your usual safeguarding procedure**. Do not rely on the device to pass it on.
- If you keep the **Activity** log on, every phrase is logged in the same way as any other. Treat the log as sensitive.
- Emergency contact details are shown only when someone presses **Medical Info**, never on an idle screen.

## When the device goes missing

**Lost mode** (set up in Parent Mode) covers the screen with *"This is a critical communication device. Please return it to …"*, with the details typed in. In **Pupil and school** you can fill in the school's details, and Parent Mode's **Lost mode** tab can use them. Only the Parent PIN turns it off. It cannot find or lock a device from afar, because the app has no internet.

## Looking after the device

- **Backup.** Ask the family, or whoever has the Parent PIN, to save a backup file regularly, to somewhere the school controls. It holds the child's photos, pages, settings and the School Mode details, but not the activity log.
- **Sharing a page.** In **Lesson pages**, **Share this page…** saves a page as a file you can give to another device. It is never uploaded anywhere.
- **Two people, one device.** If more than one adult uses it, agree who changes the words, so buttons do not move without warning.
- **The PINs are not a lock.** A child can switch to other programs on a Windows computer or a Mac. If you need the computer locked down, that is a separate arrangement with your IT team.

## Questions staff often ask

| Question | Answer |
| --- | --- |
| Can I set it up for a whole class? | No. It is one device and one child. Make a backup of a good set-up, and a page can be shared as a file. |
| Does it need wifi? | No. It never uses the internet. |
| Where is the data? | On this computer only, in the app's own storage. |
| Can I see what the child said? | Only if the **Activity** log or **Recent** is turned on. Both are off to begin with. |
| Can the child get into School Mode? | Only with the School PIN. After five wrong tries the keypad makes you wait. |
| Can parents see what staff wrote? | Parent Mode also has Targets, Notes, Activity and Reports. The Parent PIN holder can see them. Agree with the family what will be written. |
| I forgot the School PIN | Ask whoever has the Parent PIN to choose a new one in Parent Mode, under **School**. |
| Who do I ask about the words? | The child's speech and language therapist. |

The full reference for every feature is in [the whole guide](user-guide.md).
`;
const fullGuide = `# Rugged Speech: the whole guide

A guide for the parents, carers, teachers and therapists who set up and use Rugged Speech with a child or young person. It describes every part of the app. If you are new, start with the shorter guides:

- [Getting started: parents and carers](getting-started-parents.md)
- [Getting started: teachers and staff](getting-started-staff.md)
- A one-page printable [setup sheet](setup-sheet.md)

Rugged Speech is a communication companion for when speaking is difficult, unreliable or tiring. It helps someone say what they want to say by pressing large buttons, typing, pointing, or showing their words. It is made for young children and for children with limited speech, and it works for people who rarely speak and for people who speak most of the time but sometimes get stuck, including those who stammer.

![The Home screen](images/home.png)

## Contents

1. [Before you start](#1-before-you-start)
2. [Installing](#2-installing)
3. [First run](#3-first-run)
4. [Finding your way around](#4-finding-your-way-around)
5. [Using each part](#5-using-each-part)
6. [Parent Mode](#6-parent-mode)
7. [School Mode](#7-school-mode)
8. [Setting it up well](#8-setting-it-up-well)
9. [Privacy, safety and security](#9-privacy-safety-and-security)
10. [If something goes wrong](#10-if-something-goes-wrong)
11. [Quick reference](#11-quick-reference)

---

## 1. Before you start

**Four things worth knowing from the start:**

- **Nothing is ever spoken unless someone presses something.** The app never guesses, never finishes a sentence for anyone, and never speaks over them. (There are three small, clearly described exceptions in Calm and My Day, listed in [section 5](#the-three-things-that-speak-without-a-fresh-press).)
- **Buttons stay where they are.** A child learns where things are, and that matters more than almost anything. Nothing moves on its own: not when the window changes size, not when you hide a button. Only an adult, deliberately, in Parent Mode.
- **Everything stays on the computer.** There is no account, no cloud, no internet connection used and nothing sent anywhere, ever. It works exactly the same with the network cable pulled out.
- **The Parent PIN does not lock the computer.** It protects the settings and editing screens from being changed by accident. Anyone can still switch to another program with Alt+Tab or the Windows key (Command+Tab on a Mac). If you need the computer itself locked down, that is a separate kind of set-up.

**What you need:** a Windows 10 or Windows 11 computer or tablet (64-bit), or a Mac. A touch screen is helpful but not required; a mouse or keyboard works too, and so do switches (see [Access](#access)).

**A word about the words.** The starter vocabulary is a small set of the first words a young child uses. It is a sensible beginning, **not a clinical prescription**. Which words matter for a child is a professional decision, so please review them with a speech and language therapist.

---

## 2. Installing

1. Copy the **Rugged Speech Setup** file (for example *Rugged Speech Setup 0.0.1.exe*) onto the computer, from a USB stick, a shared drive, or wherever it was given to you.
2. Double-click it. Windows may show a blue **"Windows protected your PC"** screen. Click **More info**, then **Run anyway**. This is normal for new software that has not been through Windows' paid signing process. It does not mean anything is wrong.
3. Follow the installer. It does **not** need an administrator password. It installs just for the person who is signed in, and lets you choose the folder.
4. When it finishes, Rugged Speech opens on its own. A shortcut is added to the desktop and the Start menu.

**Checking the file.** If you want to be sure the file is exactly the one you were sent, ask for its SHA-256 code and compare it with the one from a Command Prompt: \`certutil -hashfile "Rugged Speech Setup 0.0.1.exe" SHA256\`.

**On a Mac.** Copy the disk image for your Mac (**Rugged-Speech-0.0.1-mac-arm64.dmg** for Apple silicon, **-mac-x64.dmg** for an Intel Mac), open it, and drag **Rugged Speech** onto **Applications**. The first time, the Mac will say it cannot be opened, because the app is not yet signed with an Apple Developer ID. Go to **System Settings**, **Privacy & Security**, and press **Open Anyway** (on macOS 14 or earlier, Control-click the app and choose **Open**). After that it opens normally. Checking the file: \`shasum -a 256\` on the disk image, compared with the code you were given.

**Updating.** There is no automatic update, by design, because the app never goes online. A new version arrives as a new installer file. Run it over the old one and your child's saved pages, photos and settings stay.

**Where your data is.** On Windows, in the folder **Rugged Speech** inside your **AppData\\Roaming** folder, for the person who is signed in. On a Mac, in **Library/Application Support/Rugged Speech** in your home folder. A backup file is the safe way to move or keep it.

**Removing it:** on a Mac, drag the app to the Bin (and delete the data folder above if you want the saved things gone). On Windows, use the usual **Add or remove programs**. It will ask whether to **keep** or **delete** the saved boards, photos and settings. Choose keep if the computer might be used again, or delete if you are finished with it.

---

## 3. First run

Each time it opens, a still "Getting ready" screen shows for a moment while the saved settings load. There is no spinner, because the app has no movement.

The first time it opens, a short set-up asks one question at a time. Every answer can be changed later, and every step after the first has a **Back** button. It takes about two minutes.

| Step | What you choose |
| --- | --- |
| **Welcome** | Nothing: it says what the app is and that nothing leaves the computer. |
| **Whose device is this?** | A name, a device name and an age, all optional. A name makes the device "Lucy's device" and shows it along the top of the screen. |
| **Choose a voice** | Which voice speaks. Only voices that work without the internet are listed. Press **Try it**. |
| **Choose a grid size** | How big the buttons are on the Talk page (fewer, bigger buttons or more, smaller ones). |
| **Pictures and words** | **Drawn symbols** or **emoji**; **picture and word**, **pictures only** or **words only**; and the size of the writing. Drawn symbols are chosen to begin with. |
| **What should pressing a word do?** | Say the word straight away, say it and add it to the sentence, or only add it. |
| **Choose the colours** | A favourite colour (pink, orange, green, turquoise, blue or purple), the standard look, or the dark one. More are in Look later. |
| **Set a Parent PIN** | Four numbers, entered twice. |
| **You are ready** | A short reminder of where things are, and a tick-box to put **Games and Draw** on the top bar. |

![Pictures and words](images/setup-5-pictures.png)

After the PIN you are shown a **recovery code** of **four words** joined by dashes, for example \`copper-meadow-ember-lantern\`. **Write it down and keep it safe.** It is the only way back in if the PIN is forgotten, and nobody, including the people who made this app, can recover it any other way.

![The PIN and recovery code](images/setup-8-pin-and-code.png)

---

## 4. Finding your way around

### The top of every screen

The same controls are always there, in the same places, whatever the child is doing.

| Control | What it does |
| --- | --- |
| **Quick Access bar** (six buttons) | Starts as **Home, Help, Yes, No, Favourites, Keyboard**. Yes and No speak straight away; the others take you there. An adult can choose different buttons ([Quick Access](#quick-access)), including ones that speak straight away (**Break, Question, Toilet, Finished, Say again**) and ones that open **Games, Draw, Music, Traffic light** and **My body**. **Help always stays on the bar.** |
| **Give me time** | Speaks: "I know what I want to say. Please give me a moment." It works from every screen, including in the middle of typing, and does not disturb anything on screen. |
| **Home** (top left, on every screen except Home) | Goes back to the Home screen. It is in the same place on every screen. |
| **The device's name** (for example *Lucy's device*) | Shows whose device it is. An adult can turn it off ([User](#user)). |
| **Traffic light marker** | A small coloured marker, when the child has chosen one. See [Traffic light](#traffic-light). |
| **Medical Info** | Shows the child's name, allergies, conditions, medicines, emergency plan and contacts, as text and as a QR code. No PIN needed. See [Medical Info](#medical-info). |
| **About me** (when there is something to show) | A short page for anyone new to supporting this person. No PIN. See [About me](#about-me). |
| **Parent Mode** | One press, then the PIN. See [section 6](#6-parent-mode). Next to it, once switched on, is a separate [**School Mode**](#7-school-mode) button with its own PIN. |

### The Home screen

Six large tiles, always in this order:

| | | |
| --- | --- | --- |
| **Talk** | **Keyboard** | **My Day** |
| **Favourites** | **My Pages** | **Feelings & Help** |

Each has a picture beside its name, so a child who does not read yet can tell them apart. The picture follows the choice of drawn symbols or emoji.

---

## 5. Using each part

### Talk

The main board: a four-by-four grid of large, colour-coded word buttons, with folders for **Food, Feelings, Play, People, Places** and **Doing**.

![The Talk page](images/talk.png)

- **Press a word.** What happens depends on a setting an adult chose: it is **added to the sentence strip** along the top, or **said straight away**, or both ([Access](#access)).
- **Press Speak** to say the whole sentence. A sentence can be read out all together, with small gaps, or **one word at a time, lighting each word as it is said**.
- **Press a word in the strip** to take it out. **Clear all** empties the strip.
- **Press a folder** (a button such as **Food** that opens another board) to go into it. It is not added to the sentence. **Back** goes up one level; **Home** returns to the Home screen.
- **Hold a button down for a moment** until you hear "Added to Favourites" to save it as a favourite. (The word is not added to the sentence when you do this.)
- A word with a **blue outline** is a **focus word**: one an adult or therapist is currently working on.
- A space with no button is not an error. A word may be hidden, or held back until a later [word stage](#learning). Every other button stays exactly where it was.

![A sentence being built](images/talk-sentence.png)

Each folder holds nine things or fewer, in large buttons, so there is never a crowd to search. **Doing** holds the few words that go with everything (*stop, look, all done, again, open, that, not*) and a few everyday actions (*eat, drink, sleep, wash, toilet, sit*).

**Colours mean something.** Button colour shows the kind of word, which helps a child learn where to look: people yellow, doing green, describing blue, things orange, places teal, social pink, little words purple, no/stop red. An adult can change each colour in [Look](#look).

**Picking up where you left off.** If the app closes unexpectedly, the sentence in progress and the page you were on are restored when it reopens. Pressing **Home** on the Talk screen itself is a deliberate "finish", so it starts fresh next time.

### Keyboard

For typing what someone wants to say. It has three tabs:

- **Keyboard**: a large on-screen keyboard (numbers too), with a **suggestion bar** above it. Suggestions are only ever suggestions: they never change the text unless you press one, and they never speak. They are based on the words in the app and on the suggestions that have actually been chosen before. The keyboard also learns the **names of the people and places** an adult has added. An adult can put the letters in **alphabetical order** ([Access](#access)).
- **Phrases**: four saved phrases that are often hard to say out loud: **Name, Address, Usual order** and **Register answer**. Type each in once; after that **Speak** says it with one press. Under **More phrases** you can add as many others as you need, each with its own **Speak** and **Remove**.
- **Starters**: ready-made phrases for **Phone, Counter, School** and **Meeting people** ("Can I pay by card?", "Can you repeat that please?"). Press one to say it.

![The keyboard](images/keyboard.png)

Two buttons help when speaking is the hard part:

- **Show** puts the text on the screen in very large letters, silently, so it can be held up for someone to read. Press the screen to put it away.
- **No-pressure mode** strips the screen down to just the text box, the keyboard and **Speak**: no suggestions, no tabs, nothing to rush you. Press **Exit no-pressure mode** to come back.

### My Day

A picture of the day, built ahead by an adult ([My Day](#my-day-1)).

- **Today** shows the activities in order, with the current one clearly marked and finished ones moved to a **Finished** list. An adult can instead choose **Now / Next / Later**, a simpler three-part view.
- **Press an activity** to ask about it: **What's next? · When? · Where? · Who with? · Finished.** The answers are spoken ("Swimming at 2:00pm"). **Finished** moves the activity down.
- An activity can have a **picture**.
- **Change of plan.** When an adult edits an activity's name, the child's screen shows the old name crossed out beside the new one and says, once, "The plan has changed. We are going to Grandma's instead."
- **Countdown warnings** (off unless an adult turns them on) say "2 minutes until swimming" and "1 minute until swimming". They are off by default because, for some children, a countdown raises anxiety rather than lowering it.
- The day rolls over at midnight on its own.
- If an adult has entered a **weekly routine** (a timetable), any day without its own plan already has it filled in.

### First / Then

A two-card screen: **First** this, **Then** that ("First brush teeth, then tablet time"). An adult sets it up in **My Day** and puts it on the top bar ([Quick Access](#quick-access)). The card to do now is outlined. When the child presses **First is finished**, the first card is marked done, the second becomes the one to do, and it says "All done. Now …" once, because a person pressed the button. **Start again** puts it back to the beginning. It is remembered if the app is closed.

### Favourites and Recent

- **Favourites** are one-press buttons that speak straight away. It starts with a handful of common words (I, want, like, more, help, yes, no). Add more by holding a button on the Talk board or in My Pages. An adult can take any away under **General**.
- **Recent** is a list of what has been said, and **it is off by default.** An adult can turn it on ("Recent history: On"), and it then remembers the last 50 things said, for up to 7 days, on this device only. **Clear** empties it. Press an entry to say it again.

### My Pages

Pages an adult builds from scratch for anything the starter words do not cover: a special interest, a trip, a person's name, a school topic. Press a word to add it to the sentence, then **Speak**, exactly as in Talk.

- With **one** page, the My Pages tile opens it directly.
- With **several**, you first pick a page. **Back** returns to the list.
- Until an adult makes one, it says **"No pages yet"**.

### Feelings & Help

Four tabs: **Feelings**, **Help**, **Calm** and **My body**.

![Feelings](images/feelings.png)

- **Feelings**: emotions, and things the body or senses need (**too loud, too bright, need quiet, need space, need to move, itchy, hungry, thirsty, hurts, hot, cold, need toilet**). Press one and it says "I feel worried". Then press **a little**, **medium** or **a lot** to say "I feel worried, a lot".
- **Help**: nine phrases a child may urgently need: **I'm lost · I feel unsafe · I'm hurt · I feel unwell · Call my parent · I need the toilet · Someone hurt me · Don't touch me · I don't know where I am.** Each one speaks straight away. **Help is always one press away from every screen** via the Quick Access bar.
- **Calm**: a **breathing guide** (press **Start** and it says "Breathe in", "Hold", "Breathe out" at an even pace, and keeps going until you press **Stop**) and **quiet time** (choose **1, 2 or 5 min**; it counts down and says "The timer's finished. Take your time." when done).
- **My body**: see below.

![Help](images/help.png)

![Calm](images/calm.png)

> "Call my parent" **only speaks those words.** It does not place a call or send a message to anyone. See [Privacy, safety and security](#9-privacy-safety-and-security).

### My body

Point to where it hurts. The child sees a figure that looks like them, presses the part of the body, says how it feels, and says how much.

![Pointing to where it hurts](images/body-pointing.png)

1. **Where?** Press a part of the body, on the picture or in the list: head, eyes, ears, nose, mouth, throat, chest, tummy, arms, hands, **under my pants**, legs, knees, feet. **Turn round** (**See my back**) shows the back: neck, back, lower back and the rest. Each part you press is said ("My tummy.") and lit.
2. **What is it like?** Press how it feels: *hurts, sore, itchy, feels funny, hot, cold, too tight, not working*.
3. **How much?** Press how much: *a little, medium, a lot*.
4. **Say it**: "My tummy hurts a lot." Several parts make one sentence ("My head and my tummy hurt."). **Start again** clears it.

If the child uses **equipment** (hearing aids, a cochlear implant, an oxygen tube, a neck tube, a tummy tube, a pump, a sensor, leg braces), each appears on the figure and can be pointed to: "My pump is not working." The adult chooses these in [My body (tab)](#my-body-tab).

![The back of the figure](images/body-back.png)

**It is made safe for young children.** The figure is always dressed. The private area is only ever called **Under my pants**, and there are no pictures of bodies. Nothing that is pointed to is saved, and what is said is kept like anything else that is said (and not at all unless Recent or Activity are on), not marked out in any way. The app does not tell anyone anything, so if a child tells you something that worries you, follow your own safeguarding procedure.

### Games

![The games menu](images/games.png)

Games are for fun and for practice. None keeps a score against anyone, none has a clock, none moves or flashes, and none speaks unless a button is pressed. Put **Games** on the top bar in [Quick Access](#quick-access), or tick it at the end of set-up. **All games** (top left) always goes back to the menu.

![Find the word](images/game-find.png)

- **Find the word.** A picture and four words. Press the word that goes with the picture. A word that is not right is marked as tried; after two wrong tries, the right word is pointed to. **Hear the word** says it. **Pictures on the words** helps.
- **Snap.** Turn a card; if it is the same as the one before, press **SNAP!** Pressing a card says its word. There is no other player to beat.

  ![Snap](images/game-snap.png)

- **Rollercoaster.** Build a short sentence for each hill of the ride. Choose **two words** (*want ball*), **three** (*I want ball*) or **four** (*I want big ball*), and a **short** or **long** ride. Press the words; each moves the train along the track. Every word is said as it is pressed, and **Say it all** says the sentence. Each finished sentence becomes a ticket, and at the end **Say my sentences** says them all.

  ![The rollercoaster](images/game-rollercoaster.png)

- **Draw.** A blank page, twelve colours, three brush sizes, **Undo**, and **Start again** (which can itself be undone). **Keep** saves a picture, and **My pictures** shows the ones you kept (up to twelve; **Throw this one away** makes room). Pictures stay on this computer.

  ![Draw](images/game-draw.png)

- **Jokes.** A very simple question, then the answer when you ask for it, from a list of short, kind jokes. **Make a silly one** mixes a question with a different answer. An adult can add jokes ([Jokes](#jokes)).

  ![Jokes](images/game-jokes.png)

- **Music.** A tile for each song an adult has added ([Music](#music)). Press one to play; **Pause** and **Stop** are always in the same place. Songs never play by themselves, and leaving the screen stops the music. If an adult has made **playlists**, they are choices along the top (**Everything** first). Choose one to see just its songs, and press **Play all** to play it through once, in order. It stops at the end.
- **Piano.** Eight big coloured keys, C to the C above. Press a key and it plays. Choose a tune (*Hot cross buns, Mary had a little lamb, Twinkle twinkle, Ode to joy, Row row row your boat*) and the next key to press is outlined and pointed to. Pressing a wrong key just plays that note. **Hear it** plays the tune slowly. A computer keyboard's **A S D F G H J K** keys play too.

  ![The piano](images/game-piano.png)

- **Seasons.** Words and games for times of the year and celebrations: **Spring, Summer, Autumn, Winter, Christmas, Easter, Halloween, Bonfire Night, Diwali, Eid** and **Hanukkah**. They stay in this order. The one that suits today's date is only marked **Now**; Diwali, Eid and Hanukkah follow the moon, so they are never marked, and a family chooses them. An adult chooses which ones show, and can change the words, in [Seasons](#seasons-tab) in Parent Mode. One that is left out leaves its place empty, so nothing else moves. For each, choose **Words** (big buttons that say the word when pressed), **Find the word**, or **Snap**, played with that season's words. Bonfire Night includes **ear defenders** and **too loud**.

  ![Seasons](images/game-seasons.png)

- **Make a tree.** A Christmas tree to decorate. Choose a decoration (a star, five colours of bauble, a light, a bell, a sweet, or a present), then press a place to hang it. The star goes on the top and presents go under the tree. **Take off** removes one, **Undo** takes back the last thing, and **Start again** clears the tree (and can be undone). The places never move, and the tree is still there next time. Nothing is scored.

  ![Make a tree](images/game-tree.png)

### Traffic light

A way to show other people, without a word, how much you want to be spoken to. Add **Traffic light** to the top bar in [Quick Access](#quick-access).

![Traffic light](images/traffic-light.png)

- **Red**: "Please don't talk to me right now."
- **Amber**: "You can talk to me, but please be gentle and give me time."
- **Green**: "I'm happy to talk to you."

Press a colour to show it. It stays until it is changed, and a small marker shows along the top of every screen. **Say it** speaks the words (only when pressed), **Show everyone** fills the whole screen with the colour and the words so others can read it, and **Turn off** clears it. An adult can change the words ([User](#user)).

### Medical Info

The red **Medical Info** button is on every screen and needs no PIN, so a stranger who has found a child who is lost can read it straight away. It shows the details an adult entered ([Medical](#medical)) as text and as a **QR code** that a phone camera can read. The QR code holds the information itself; no internet is used, and nothing is looked up. If nothing has been entered, it says so.

![Medical Info](images/medical-info.png)

**Scanning it.** Open the phone's camera and hold it steady about 20 to 30 centimetres from the screen, with the whole code in view. The text appears on the phone as plain words, including accented letters, with no app needed. The code is always black on white whatever colour setting the app is on. A long record is shortened in the code to what matters most (name, allergies, conditions, medicines, equipment, how the child communicates, the emergency plan, NHS number and contacts); the screen always shows everything.

### About me

A short page for anyone new to supporting this person: a new teacher, supply staff, a relative or a respite carer. It appears as an **About me** button once an adult has written something (and once School Mode is on, in School Mode too). Press it to read: what the person likes to be called, **how they communicate, what helps, what they find hard, what they like and don't like.** No PIN is needed, and sections that were left empty are not shown.

### Lost mode

![Lost mode](images/lost-mode.png)

If an adult has turned **Lost mode** on, the whole screen is covered by a message: **"This is a critical communication device."** and who to return it to, with a phone number and address if they were typed in. **Read this out** says it aloud. **Owner: turn off** asks for the Parent PIN. Nothing else can be reached until then. See [Lost mode (tab)](#lost-mode-tab).

### The three things that speak without a fresh press

Everything above speaks only when someone presses something, with these exceptions, each of which follows a deliberate action:

1. **Breathing** and **quiet time** in Calm keep speaking their steps after someone has pressed **Start**.
2. **My Day's "plan has changed" announcement**, once, after an adult has edited an activity.
3. **My Day's countdown warnings**, only if an adult has turned them on.

---

## 6. Parent Mode

Parent Mode is where an adult sets everything up. The child's screen stays simple; all the settings live here, behind the PIN.

**To open it:** press **Parent Mode** (top right on every screen), then enter your 4-digit PIN. After five wrong tries in a row, the keypad makes you wait (30 seconds, then longer) before another try.

**To leave it:** press **Exit Parent Mode** (top right). You return to the child's screen. **Fullscreen: Off/On** is also there at the top; the app normally opens in a maximised window, and fullscreen is an adult's choice. It can also close itself after some minutes without use ([General](#general)).

**The menu.** A menu down the left holds every section, in groups:

| Group | Sections |
| --- | --- |
| **Start here** | User guide |
| **About the child** | User · About me · Medical · My body |
| **Words and pages** | Boards · People · Places · My Pages · Quick Access · Profiles |
| **Day and fun** | My Day · Music · Jokes · Seasons |
| **How it looks and works** | Access · Look |
| **Learning and school** | Learning · Targets · Notes · Activity · Reports · School |
| **Safety and data** | Lost mode · Backup · Print · General |

If it has been a while since the last backup and there is something worth protecting (photographs, people, pages), a note appears at the top with a button to take you to **Backup**.

**Forgotten the PIN?** On the PIN screen press **Forgotten your PIN?** and enter the recovery code you wrote down. You will then choose a new PIN, and a new recovery code is shown.

### User guide

This guide, inside the app, with every picture, working with no internet. Choose **parents and carers**, **teachers and staff** or **the whole guide**, search it, and jump to a part from the list on the left.

![The User guide in Parent Mode](images/parent-guide.png)

### User

Whose device this is. All of it is optional and stays on this computer.

![User](images/parent-user.png)

- **Name**, **Device name** (left blank, it becomes *Lucy's device* from the name) and **Age** (printed on the About me sheet; never used to decide anything).
- A **picture** (an emoji) for the device.
- **Show the device name along the top of the child's screen.** The name is also the window's title.
- **Traffic light words**: what each colour says.

### About me (tab)

Write the **About me** page: what the person likes to be called, how they communicate, what helps, what they find hard, what they like and don't like. A **preview** shows exactly what will appear, and **Print this page** prints it on one sheet. Only write what you are happy for a new member of staff or a relative to read, because anyone can open it from the child's screen without the PIN.

![About me](images/parent-about-me.png)

### Medical

Fill in the **child's name**, **allergies**, **conditions** and **emergency contacts** (a name and phone number each; add as many as you need), and then, if you like, more about their health: **medicines, equipment and aids, eating and drinking, moving about, hearing and sight, how they communicate, how they show pain or being unwell, what to do in an emergency, doctor or surgery, hospital and consultant, and NHS number.**

![Medical](images/parent-medical.png)

A **preview** shows exactly what the Medical Info button and its QR code will show. Entries save as you type. Everything here is visible, without the PIN, to anyone who presses **Medical Info**, so only enter what you are comfortable with a stranger who has found the child reading.

### My body (tab)

Make the figure on [My body](#my-body) look like the child. The child finds it in **Feelings & Help**, and you can also put it on the top bar in Quick Access.

![The My body settings](images/parent-my-body.png)

- **Figure**: **Boy**, **Girl** or **Non-binary**. Choosing one picks hair and clothes to start from; change any of them. The hair styles and head coverings are shown as small heads, so you can see what you are choosing.
- **Skin** (eight tones), **hair** (ten colours, and short, long, tied up, curly or none), **clothes** (trousers, shorts, skirt or dress, and colours for the top and the bottom).
- **Head covering.** None, a **hijab** (a headscarf worn by many Muslim women and girls), a **turban** (worn by many Sikh men and boys, and by others) or a **kippah** (a small cap worn by many Jewish men and boys, also called a yarmulke), in any of the clothes colours. A hijab or a turban covers the hair; a kippah sits on top of it. The face is always left clear.
- **Wheelchair and glasses.** The figure sits in a wheelchair, drawn with its big wheels, push rims, seat, handles, arm pads, footplates and small front wheels.
- **Equipment and aids**: hearing aids, cochlear implant, eye patch, helmet, oxygen tube, neck tube (tracheostomy), tummy tube (feeding tube), insulin pump, glucose sensor, leg braces, crutches, walking frame (only when standing), artificial arm, artificial leg. Each one that is shown can be pointed to on My body.

A live picture shows how it will look. It is always dressed. **Put the figure back to how it started** resets it.

### Boards

Edits the Talk board and its folders.

![Boards](images/parent-boards.png)

- **Board** (drop-down) chooses which board to edit: Talk, Food, Drinks, Feelings, and so on, plus any folders you add.
- **Grid size** (rows and columns, 2 to 5). It will not shrink below the number of buttons already placed, and says so; hide or move some first. Changing it re-packs buttons, so do it rarely.
- **Each button** is a row. Edit its **label**; tick **Hidden** to remove it from the child's board; reorder with the **drag handle** (the dotted square on the left) or the **▲ ▼** buttons; press **Details** for everything else (below).
- **Add button**: type a label, choose an emoji and a colour (by the kind of word: *people, doing words, describing words, things, places, social words, little words, no and stop*), or add a **photo** instead of an emoji (**Use camera** or **Import photo**). It goes in the first empty slot. If the board is full, it tells you to resize or hide something.
- **Add folder** (categories): type a name, choose an emoji and colour. This creates a new, empty board *and* a button that opens it. Pick the new folder in the **Board** drop-down to fill it with words.
- **Put this board back to the starter version** puts a built-in board back exactly as it came, after asking.
- **Add the newer starter words** appears on a device that has older starter pages. It adds the newer pages and words without moving anything you already have, and makes a page bigger only by adding empty places on the right and below.

**Details** (open it on any button) lets you set:

| Detail | What it does |
| --- | --- |
| **What it says** | If the button should say something different from its label: the label "Mum" can say "Mum, please". Empty means it says its label. |
| **Colour** | The kind of word, which sets the button colour. |
| **Picture** | An emoji, or a real **photo** of the real thing: the actual cup, the actual teacher. **Use an emoji instead** switches back. |
| **Recorded voice** | Record a familiar person saying it; their voice then speaks instead of the computer's. **Hear it** to check, **Remove the recording** to go back. |
| **Word stage** | **Always shown**, or stage 1 to 4. See [Learning](#learning). |
| **Focus word** | Gives the button a blue outline on the child's board. |
| **Remove this button** | Takes it off the board entirely (after asking). Its space stays empty, so nothing else moves. |

**Reordering by dragging.** Drag the handle of one button onto another and the two **swap places**. Nothing else moves. Use the **▲ ▼** buttons if you cannot drag (they work from a keyboard).

**Hiding or removing.** A hidden button disappears from the child's board but keeps its settings, and **Hidden** brings it back. Remove deletes it. Either way its slot stays empty so nothing else shifts.

### People and Places

Add the people and places that matter, as real, working buttons.

1. Open **People** (or **Places**) and fill in the name (and, for people, the relationship, such as "Mum" or "teacher").
2. Add a **photo** with **Use camera** and **Take photo**, or with **Import photo** to pick a picture from the computer. Big pictures are automatically made smaller. Real photos of the real person or place work best.
3. Optionally **Record voice clip** and speak the name: **a familiar voice will then say it instead of the computer voice.** Press **Stop recording** when done.
4. **Save person** (or **Save place**). A button appears on the **People** or **Places** board in Talk. **Hear name** lets you check it. **Remove** (after asking) takes the person or place and their button away together.
5. If you typed **phrases** for someone, **Make a page of these phrases** turns them into a My Pages page, ready to edit.

The first time you use the camera or microphone, the computer may ask permission; allow it.

### My Day

The day builder. Pick the **Date**, so you can plan ahead, and choose the **View** (Today, or Now / Next / Later).

![My Day](images/parent-my-day.png)

For each **activity** you can set a **name**, **time**, **location** and **who with**, and a **countdown** (none, 5 min, 30 min, or 1 hour). Open an activity's **picture** to give it an emoji. Reorder with **▲ ▼**, or **Remove** it. **Add activity** adds a new one.

- **Change of plan:** simply edit an activity's name. The child's screen shows the old name crossed out and speaks the change once.
- **Countdown warnings** is a checkbox, **off by default**. Turn it on only if a countdown helps this child.

**First / Then** (also on this tab) sets the two cards: what comes first, what comes then, each with an optional emoji. Put **First / Then** on the top bar from Quick Access for the child to use it.

**Weekly routine** (at the bottom of this tab). Enter a school timetable or a home routine **once**: choose a weekday, add its activities (name, time, location, who with), and **Copy Monday to every weekday** if the days are alike. Any day with no plan of its own then uses it, so the child's My Day is already filled in each week. Days you have already planned are never touched, and finishing an activity on the child's screen never alters the routine.

### My Pages (tab)

![My Pages](images/parent-my-pages.png)

- **Start from a ready-made page**: choose a template and press **Make this page**. There are about thirty: *snacks, drinks, playground, classroom requests, hello and thank you, getting dressed, bedtime, café or shop, doctor or dentist, maths, science and nature, story time, PE and movement, art and making, lunchtime, assembly and quiet times, computers and tablets, working with a friend, feeling too much,* and one for each season and celebration (*Spring, Summer, Autumn, Winter, Christmas, Easter, Halloween, Bonfire Night, Diwali, Eid, Hanukkah*). It is added as a new page you can edit freely; check the words suit this child first.
- **Add page**: type a name. Pages appear in a list; pick one to edit it, **Rename** it, or **Delete** it (which deletes its buttons too).
- Each page works like a board: set the **grid size** (starts at 3 × 3), **add buttons** (emoji or photo), edit labels, open **Details**, **hide**, and reorder by dragging or with **▲ ▼**.
- **Share this page…** saves the page as a file (an **.obf** file, the open standard other communication software can read too). Photos and recordings are inside it. Give the file to another device on a USB stick or by email.
- **Add a shared page…** opens such a file. It is **always added as a new page**, never over one you have, and it says plainly if the file is not a page. A page bigger than 5 × 5 is refused. From other software, colours are not kept (colour here means the kind of word) and buttons that opened other boards become ordinary buttons.

### Quick Access

Choose what each of the six top-bar buttons does, from **Button 1** to **Button 6**:

- go to a screen: **Home, Help, Favourites, Keyboard, Talk, My Day, My Pages, Feelings, First / Then, Games, Draw, My body, Music** or **Traffic light**;
- speak straight away: **Yes, No, Break** ("I need a break"), **Question** ("I have a question"), **Toilet** ("I need the toilet"), **Finished** ("I've finished") or **Say again** ("Can you say that again, please?").

![Quick Access](images/parent-quick-access.png)

- Picking a button that is already on the bar **swaps** the two, so nothing appears twice.
- **Help can move, but cannot leave**, so it is always one press away. If you try to replace it, you are told why.
- **Put back the usual six** restores Home, Help, Yes, No, Favourites, Keyboard.

### Profiles

For using one device in different places: **Home, School, Grandparents, Hospital.** A profile only chooses **which page Talk opens to first** ("Opens to"). The vocabulary is the same everywhere, and the Home screen never changes. Press **Use this profile** to switch; the active one is marked **Active now**.

### Music

Add songs from files on this computer, such as **MP3**s (and M4A, WAV, OGG, FLAC and similar).

![Music](images/parent-music.png)

- **Add songs from this computer** opens the Windows file window. Each song keeps its file name as its name (tidied up); rename it, give it a picture, move it up or down, or **Remove** it.
- Up to **60 songs**, each up to **30 MB**. The page shows the total, and a reminder if the library is large, because a backup holds every song.
- **Music volume** is separate from the voice.
- **Playlists.** Below the songs, name a playlist (such as *Bedtime* or *Car journey*), choose a picture, and add songs to it from a list. Put them in order with **▲ ▼**, or **Take out** a song. Up to 12 playlists. On the child's Music screen each is a choice along the top, with a **Play all** button. Removing a song also takes it out of every playlist.
- Songs stay on this computer and play with no internet.

**There is no Spotify or Apple Music.** Those need an account and an internet connection, and this app never uses either. Songs you have bought as ordinary files, songs copied from a CD, and recordings of someone singing all work. Songs that are locked to a streaming app cannot be added.

### Jokes

The built-in jokes are in Games. Add your own here: a question and its answer. They are mixed in with the others and can be removed.

### Seasons (tab)

Which times of the year and celebrations the child sees in Games, Seasons, and the words in each. Everything starts as the usual set, and nothing changes until you change it.

![Seasons settings](images/parent-seasons.png)

- **Choices grouped by tradition.** **The year**, **Christian**, **Muslim**, **Jewish**, **Hindu**, **Other celebrations** and **Your own**. Untick any that are not part of your family's life. A season that is left out leaves its place empty on the child's screen, so nothing else moves.
- **Change the words.** For any of them: change the word, the picture, what it says if that is different, and the kind of word (which sets its colour). Add a word, remove one, or **Put back the usual words**. Up to 12 words each. To choose a picture, open the computer's own emoji picker (on Windows press the Windows key and the full stop together; on a Mac press Control, Command and Space), then pick an emoji.
- **Add a celebration.** Choose one **from a list** (Ramadan, Vaisakhi, Holi, Passover, Chinese New Year, Birthday) or **name your own**. Up to 12. Remove one you added with **Remove**.
- **Put everything back to the usual.**

**A note on the words.** Eid covers Eid al-Fitr and Eid al-Adha; Diwali is also called Deepavali, and is kept by Hindus, Sikhs and Jains; Hanukkah is also spelled Chanukah. The words are a starting point. Only you know how your family keeps a celebration, so please read them and change anything that is not right. The ready-made My Pages pages for each season use the usual words, and are an ordinary page once made.

### Access

Settings for different ways of pressing buttons, and for how things sound and are read out. Everything starts off or neutral, and nothing changes until an adult changes it.

![Access](images/parent-access.png)

| Setting | What it does |
| --- | --- |
| **Voice** | Which voice speaks (offline voices only). **Hear this voice**. |
| **How it sounds** | One press sets speed and pitch together: **Usual, Gentle, Slow and clear, Bright, Young**. Then fine-tune with the sliders. |
| **Reading a sentence out** | **All together**, **with small gaps and a little slower**, or **one word at a time, lighting each word**. |
| **Speech rate** | How fast it speaks (0.5× to 1.5×). Some people follow slower speech better. |
| **Voice pitch** | How high or low the voice sounds (0.5× to 1.5×). |
| **Voice volume** | How loud the app speaks, on top of the computer's own volume (10% to 100%). |
| **Say it like this** | For a name or word the voice gets wrong: write it as it appears and as it should sound. Only the sound changes; the screen keeps the written spelling. **Hear it** lets you check. |
| **When a button is pressed** | On Talk and My Pages: **adds the word to the sentence**, **speaks the word straight away**, or **does both**. Opening a folder never speaks. |
| **Hold-to-select** | For eye gaze or a head pointer: a button activates once the pointer or focus has rested on it for this long (0 to 1.5 seconds), instead of on tap. **0 turns it off.** |
| **Repeat-press suppression** | Ignores a second press of the same button within this time (0 to 2 seconds), for a switch or a finger that sometimes double-fires. **0 turns it off.** |
| **Switch scanning** | Row-and-column scanning driven by **Space** and **Enter**, so any switch that acts like a keyboard works. **Two switches:** Space moves the highlight, Enter selects. **One switch:** Space selects, and the highlight moves on by itself (you choose how fast, 0.5 to 4 seconds). While scanning is on, buttons are reached by scanning rather than by touch. |
| **Keyboard letters** | Usual keyboard order, or alphabetical order (A, B, C…). |
| **Show each word's picture in the sentence** | Puts the button's picture beside each word in the sentence strip. |
| **High contrast** | Off, Light or Dark. When on, it is used instead of a colour scheme from Look. |
| **Text size** | 1× to 2×. At the larger sizes the buttons grow, so a board that no longer fits on the screen **scrolls**, and nothing is hidden. Buttons stay in the same order and place. |
| **Reduce motion** | For people who find movement difficult. (The app already avoids animation.) |
| **Low-arousal colours** | The same word-class colours, but muted, for a child overwhelmed by bright colour. |

With a **physical keyboard**, the arrow keys move around a board and **Enter** presses a button.

#### On an iPhone or iPad

Two more groups appear in **Access** in the iPhone and iPad app. They are not in the Windows and Mac apps.

| Setting | What it does |
| --- | --- |
| **Follow this device's accessibility settings** | On to begin with. The device's own **Reduce Motion**, **Increase Contrast**, **Bold Text** and text size (set in Settings, Accessibility) are used in the app too. What you chose in the app is never made weaker: the device can only ask for more. It says what the device is asking for right now. |
| **Buzz when a button is pressed** | A short buzz from the device so a press can be felt. Off to begin with. |

The same place explains how the iPhone and iPad's own ways of pressing work with the app:

- **Eye Tracking** (iPadOS and iOS 18 or later, on recent devices) is switched on in Settings, Accessibility, Eye Tracking. It works in this app as it does everywhere else. The app cannot see where anyone is looking and cannot switch it on. If you use Eye Tracking's own dwell, leave **Hold-to-select** at 0.
- **Switch Control** and **Voice Control** reach every button, and **VoiceOver** reads each one.
- **Guided Access** keeps a child inside the app. The app tells you whether it is on.
- **Assistive Access** fills the whole screen with the app.

### Look

The pictures and colours of the whole app. Changes show straight away.

![Look](images/parent-look.png)

- **Pictures.** **Drawn symbols** (original, bold, simple pictures made for this app) or **Emoji**; and **picture and word**, **pictures only** or **words only**. A few sample buttons show the result. Words and pictures you add yourself are never changed, and an emoji with no drawing yet still shows as an emoji.

  ![Emoji instead of drawn symbols](images/talk-emoji.png)

- **Favourite colour.** Pick **Pink, Orange, Red, Yellow, Green, Turquoise, Blue** or **Purple** and the whole app is washed with it (background, bars and highlight). Writing stays dark so it is easy to read, and word colours do not change.

  ![A favourite colour: pink](images/parent-look-pink.png)

  ![Talk in pink](images/talk-pink.png)

- **Other looks.** **Standard, Calm, Sunny, Forest, Cream, Night** (dark) and **Yellow on black**.
- **Make your own.** Choose the background, writing, outlines, bars and highlight. It says plainly if the writing would be hard to read.
- **Colours of the words.** Change the colour of any kind of word. It warns you when two look alike, because the colour is how a child learns what sort of word a button is.
- **Put everything back to the usual look.**

![The Night scheme](images/home-night.png)

### Learning

For working with a speech and language therapist, or following their advice.

![Learning](images/parent-learning.png)

- **Word stage.** Bring words in gradually. Give a word a stage (1 to 4) in its **Details**; here choose **Show words up to** a stage. Words above it are **held back** (it tells you how many), their space stays empty, and they come back in exactly the same place when you move up. Words with no stage are always shown, and no word comes with a stage already set: which words belong in which stage is for you or a therapist to decide.
- **Focus words.** A list of the words marked as focus words, and the board each is on. They show with a blue outline on the child's board. Mark or unmark them in **Details**.
- **After speaking.** *Clear the sentence once it has been spoken* is for people who start each sentence afresh. Off, the sentence stays so it can be said again.
- **Word counts** (off by default). Counts how many times each word is pressed each day, **and nothing else**: no sentences and no times of day. Every word button is counted the same way, the Help phrases included. Counts stay on the device and are kept for 90 days. Switch it on, choose the last **7, 30 or 90 days**, and see the total, the most-pressed words, and the **words that were not pressed at all**, which is often the useful part. **Save the counts as a spreadsheet…** writes a \`.csv\` file you choose where to keep; **Clear the counts** deletes them (after asking); unticking the box stops counting at once. They are included in a backup.

### Backup

Save everything, or restore it, in **one file** that you control. Nothing is ever backed up automatically, anywhere.

![Backup](images/parent-backup.png)

- It shows **when the last backup was made on this computer**, and Parent Mode reminds you if there has been none for a month and there is something worth protecting.
- **Save a backup** saves boards, photos, recorded voices, songs, people, places, My Day, the weekly routine, About me, Medical, targets, notes, drawings, settings and more as a \`.mwbackup\` file. The **activity log is not included**. **Tick "Protect with a passphrase"** and enter it twice. **This is strongly recommended**: the file contains the child's photographs and contact details. **A lost passphrase cannot be recovered.**
- **Restore from a backup** replaces **everything** on the device with the backup's contents, including the PIN. It asks you to confirm, and **cannot be undone**. Restoring on a different computer gives you an identical copy.

Keep backups somewhere safe, and do one after you have set things up and whenever you add photos.

### Print

For laminated cards that still work when the computer is broken, charging, or somewhere else. Choose **Board cards** (pick the board and a size: **20, 30, 50 or 70 mm**), a **Sentence strip template** (blank boxes to put cards in), or a **Visual schedule for a day** (the day's activities as numbered cards with times). Press **Print**; the computer's own print window opens with a preview first. Hidden buttons are left out. Printed cards come out at the stated size, so you can check one with a ruler, and show drawn symbols or emoji to match the choice in Look.

### General

- **Start when the computer starts.** Off by default. When on, the app opens automatically after sign-in (a Mac's login items, or Windows' start-up).
- **Close Parent Mode after…** Never, or 5, 10, 15, 30 or 60 minutes without use, so a shared or unattended device is not left open. Any press, key or typing counts as use, and the PIN is needed again to get back in.
- **Change the PIN.** Choose a new 4-digit PIN (twice). You get a **new recovery code, and the old one stops working**, so write it down.
- **Favourites.** The words saved to Favourites, each with a **Remove** button.

### Lost mode (tab)

For when the device goes missing.

![Lost mode](images/parent-lost-mode.png)

1. Type who to return it to (a name, a school or a place), a **phone number**, and an **address** if you wish, and anything else to say. If you have filled in the school ([School](#school)), **Use the school** fills these in.
2. Check **What it will say**.
3. Press **Turn Lost mode on**. It needs at least a name, a number or an address.

The screen is then covered until the **Parent PIN** is entered. The details are shown to anyone while Lost mode is on, and at no other time. **This is a note on the screen, not a tracker.** The app has no internet, so it cannot find a device or lock it from somewhere else. Turn it on **before** the device is lost if you can, for example when it is left somewhere.

---

## 7. School Mode

**School Mode** is a second, separate side of the app for the adults at school: its own button, its own **School PIN**, its own menu and its own look. It sits next to **Parent Mode** on the child's screen once it has been switched on. It is still one device and one pupil, with no pupil accounts and no class lists.

![School Mode, next to Parent Mode](images/school-button.png)

### Switching it on (Parent Mode, School)

School Mode is **not** part of the first set-up. Whoever has the Parent PIN switches it on afterwards:

1. In **Parent Mode**, open **School** and press **Turn School Mode on…**
2. Choose a **four-digit School PIN** and enter it twice. It is **not** the Parent PIN, and it has no recovery code.
3. A **School Mode** button now appears beside **Parent Mode** on every screen. Nothing on the child's screen moves.

![School, in Parent Mode](images/parent-school.png)

- **Choose a new School PIN** replaces it. This is also the way back in if staff forget it.
- **Turn School Mode off** hides the button. The School PIN and everything written is kept.
- **Forget the School PIN** (only while School Mode is off) removes the PIN as well, after asking.

Five wrong School PINs in a row make the keypad wait, exactly as the Parent PIN does, and the two are counted separately.

![The School PIN](images/school-pin-entry.png)

School Mode closes itself after **10 minutes** without use (change it in Classroom set-up).

### What is in School Mode

A menu down the left, in groups:

- **Today**: the date, today's timetable, targets being worked on and any due for review, use of the device today (if the activity log is on), the traffic light, the latest notes, and a **quick note** box.

  ![Today](images/school-today.png)

- **Pupil and school**: the school, class, class teacher, key adult, SENCo, speech and language therapist and school phone. For adults only. It fills the handover sheet and can fill in Lost mode.

  ![Pupil and school](images/school-pupil.png)

- **About me**: the one-page communication passport.
- **Safeguarding**: what to do if a child tells you something, the **designated safeguarding lead** and their phone number, and a plain account that the device does not record or report anything.

  ![Safeguarding](images/school-safeguarding.png)

- **Timetable**: the week, changes of plan, and First / Then.

  ![Timetable](images/school-timetable.png)

- **Lesson pages**: ready-made pages for lessons (maths, science, story time, PE, art, computers, lunchtime, assembly, working with a friend, feeling too much, classroom requests and more), plus all of My Pages. Pages can be shared as a file.

  ![Lesson pages](images/school-lessons.png)

- **Vocabulary**: word stages and focus words, for working with the speech and language therapist.

  ![Vocabulary](images/school-vocabulary.png)

- **Targets**, **Notes**, **Activity** and **Reports**: described below. Parent Mode has these too.
- **Classroom set-up**: **Use the school top bar** (Home, Help, Yes, No, Break, Question, and Talk opens to the School page; it asks first because it moves buttons), **Start from a typical school day** (a Monday to Friday timetable, never replacing one you have), **Close School Mode after**, and **Choose a new School PIN**.

  ![Classroom set-up](images/school-classroom.png)

- **School guide**: this guide, inside School Mode, opening at the staff pages.

  ![The School guide](images/school-guide.png)

### Targets

![Targets](images/staff-targets.png)

What is being worked on, in plain words. For each: what it is about (*saying things, understanding, talking with others, using the device, something else*), a **status** (working on it, achieved, paused), a review date and notes on how it is going. A target that is due is marked. Working targets come first. Adults only.

### Notes

![Notes](images/staff-notes.png)

A few kind, factual lines after a session or a day, with who wrote them and when. Each has a kind (*something I noticed, something that went well, an idea to try, something to follow up*), and you can show just one kind. Newest first. Removing one asks first. Adults only.

### Activity

An optional log of what was said and which parts of the app were opened, with the time. **Off until you turn it on.**

![Activity](images/staff-activity.png)

- **Keep an activity log** and **Keep it for** 7, 30, 90 days or a year. The oldest is forgotten first, and never more than 20,000 entries.
- **How much it is used**: totals for the **last hour, today, the last 7 days and the last 30 days**, and bars by the **hour, day, week and month**. Show **everything**, **what was said**, **what was opened** or **adult actions**.
- **Said most, last 30 days.** And **the log** itself, newest first.
- **Save as a spreadsheet** is the only way it leaves the device. **Clear the log** empties it, after asking.
- Every phrase is logged the same way, **the Help phrases included**. Nothing is flagged and nobody is told. What is said in games (practice) is not logged. The log is not part of a backup.

### Reports

Two sheets to print, or to save as a PDF from the print window. Nothing is sent anywhere.

![The handover sheet](images/staff-handover.png)

- **Handover sheet**: who and where, how the child communicates, what helps, how the device works for them, words being practised, current targets, what the traffic light means, and what is good to know. For supply staff and new staff.
- **Review report**: for a review meeting. Targets, how the device was used, the words most said, and the notes, over the last 30, 90, 180 or 365 days.

![The review report](images/staff-review.png)

---

## 8. Setting it up well

A sensible order for a new child:

1. **Install and do the first-run steps.** Write the recovery code down.
2. **Fill in User and Medical**, and, if you want, **People** and **Places** with real photos of the people and places that matter.
3. **Make My body look like the child**, with any equipment they use.
4. **Hide** the words the child does not need yet. A smaller, calmer board is often easier. You can bring words back any time.
5. **Add folders and words** the child reaches for that are not there, in **Boards** or **My Pages**, using real photos where they help. Use **Details → What it says** where a label should say more.
6. **Choose Quick Access** buttons to suit how this child uses it.
7. **Build tomorrow in My Day** if routine helps. Leave **Countdown warnings** off unless you know they help.
8. **Check Access settings** with the child: what a press does, voice, speed and pitch, dwell or scanning.
9. **If a school will use it,** turn on **School Mode** under **School**, and choose a separate **School PIN** for the staff. Do this after the family has set things up, not during the first-run steps.
10. **If you are working with a therapist,** set **word stages** and **focus words** under Learning, and switch on **word counts** or the **Activity** log if it will help your review.
11. **Save a backup**, with a passphrase.
12. **Print a set of cards**, and the **About me** page, for when the computer is not available.

**Change things slowly.** Once a child has learned where a button is, that is hard-won. Add and hide rather than rearranging, and avoid resizing the grid once it works.

**Model it.** Press the buttons yourself as you talk, so the child sees how it is used. **Wait** after you speak.

**A speech and language therapist** should review the starter words and the phrases before a child relies on them. Which words matter is a clinical decision, and this app does not make it for you.

---

## 9. Privacy, safety and security

- **Nothing leaves the device.** There is no account, no cloud and no internet connection used. The only way anything leaves is a file an adult chooses to save: a backup, a shared page, a spreadsheet, a report.
- **Recent history is off by default**, is limited to the last 50 things said for at most 7 days, and can be cleared or switched off by an adult at any time. **The activity log** and **word counts** are also off by default, and have their own retention, clear button and off switch.
- **About me and Medical Info are visible without the PIN** on purpose, so a stranger or a new member of staff can read them. Only write what you are comfortable with them reading.
- **Help is not a safeguarding record.** Phrases such as "Someone hurt me" and "I feel unsafe" exist because a child needs the words. The app speaks the phrase and stops. It does not log it differently, flag it, or tell anyone, and nobody is notified. **A disclosure is handled by an adult following their setting's safeguarding procedure.** If you are in a school or similar setting, agree your approach in writing *before* the Help section is used. The same is true of **My body**.
- **"Call my parent" does not call anyone.** It speaks those words so a nearby adult can act.
- **If you deploy this in a school,** the app holds photographs of a child and their family, an emergency contact, medical details and potentially a record of what they said. You will probably need a **Data Protection Impact Assessment (DPIA)**.
- **Security.** The app is built so that nothing can reach the internet: every request outside the app is refused, the page is allowed to load only the app's own files, and it has no access to the computer beyond a few fixed, checked actions. The Parent PIN and recovery code are stored scrambled (salted hashes), not as typed. The full account, including what has been checked and what has not, is in [the security notes](security.md).
- **The PIN is not device security.** A four-digit PIN keeps a child out of the settings. It cannot stop someone who can copy the computer's files. Use Windows sign-in, and disk encryption such as BitLocker where it is available, to protect the device itself.

---

## 10. If something goes wrong

| Problem | What to do |
| --- | --- |
| **Windows says "Windows protected your PC"** when installing | Click **More info**, then **Run anyway**. It appears because the installer is not yet signed with a paid certificate. |
| **I've forgotten the PIN** | On the PIN screen press **Forgotten your PIN?** and enter the recovery code. |
| **I've lost the PIN *and* the recovery code** | There is no way back in, and no one can recover it. You would need to uninstall (choosing to delete the data) and set up again, so keep that code safe. |
| **The keypad says to wait** | Too many wrong PINs in a row. Wait for the time shown, then try again. It also stops a child pressing numbers at random. |
| **The app closed unexpectedly** | Reopen it. The sentence in progress and the page you were on are restored. |
| **No voices to choose in the first-run step** | Only voices that work offline are offered. Install a Windows speech voice (Settings → Time & Language → Speech), then reopen the app. |
| **There is no sound** | Turn up the computer's volume, then **Access → Voice volume** and **Voice**. Press **Hear this voice**. |
| **The voice is too fast, slow, high or low** | Parent Mode → **Access → How it sounds**, or the speed and pitch sliders. |
| **A button seems to do nothing** | If **Hold-to-select** is on, a button needs the pointer to rest on it, not a tap. If **Switch scanning** is on, buttons are reached by scanning. Check **Access**. |
| **A button has disappeared** | It may be hidden. Parent Mode → **Boards** → untick **Hidden**. |
| **A word has gone from the board, leaving a gap** | It is hidden, or held back by a **word stage**. Check **Boards → Details** and **Learning**. Everything else stays where it was. |
| **The pictures look like emoji (or like drawings) and I want the other** | Parent Mode → **Look → Pictures**. |
| **The camera does not work** | Allow camera access if Windows asks. Otherwise use **Import photo**. |
| **A song will not play** | It may not be a sound file this computer can play, or it was locked to a streaming app. Try an MP3. |
| **The piano makes no sound** | Check the computer's volume and **Music volume**. |
| **Can't add a button: "No empty slot"** | The board is full. Resize the grid or hide a button first. |
| **I can't shrink the grid** | It will not shrink below the number of buttons already placed. Hide or move some first. |
| **Parent Mode closed by itself** | It closes after the time set in **General** without use. Enter the PIN to come back in. |
| **Everything is covered by a red message** | Lost mode is on. Press **Owner: turn off** and enter the PIN. |
| **The QR code will not scan** | Hold the phone 20 to 30 centimetres away, steady, with the whole code in view, and turn the screen brightness up. |
| **Restoring a backup said the passphrase was wrong** | Check the passphrase exactly (it is case-sensitive). There is no recovery for a lost passphrase. |
| **The computer sleeps in the middle of use** | The app keeps the screen awake while it is the active window. Check Windows' own power settings if it is still sleeping. |

---

## 11. Quick reference

**Top of every screen:** Quick Access bar (Help always there) · Give me time · Home · Medical Info · Parent Mode.

**Home tiles:** Talk · Keyboard · My Day · Favourites · My Pages · Feelings & Help.

**Feelings & Help tabs:** Feelings · Help · Calm · My body.

**Games:** Find the word · Snap · Rollercoaster · Draw · Jokes · Music · Piano · Seasons · Make a tree.

**School Mode** (once switched on, next to Parent Mode, with its own PIN): Today · Pupil and school · About me · Safeguarding · Timetable · Lesson pages · Vocabulary · Targets · Notes · Activity · Reports · Classroom set-up · School guide.

**Parent Mode:** User guide · User · About me · Medical · My body · Boards · People · Places · My Pages · Quick Access · Profiles · My Day · Music · Jokes · Seasons · Access · Look · Learning · Targets · Notes · Activity · Reports · School · Lost mode · Backup · Print · General.

**Gestures**

| To… | Do this |
| --- | --- |
| Add a word to the sentence | Press it (when pressing adds to the sentence) |
| Say the sentence | Press **Speak** |
| Remove one word | Press it in the sentence strip |
| Add a button to Favourites | Hold it down until you hear "Added to Favourites" |
| Swap two buttons (adult) | Drag one handle onto the other, in Parent Mode |
| Play the piano from a keyboard | **A S D F G H J K** |

**Favourite colours:** Pink · Orange · Red · Yellow · Green · Turquoise · Blue · Purple (Parent Mode, Look).

**Colours of the words**

| Kind of word | Colour |
| --- | --- |
| People | Yellow |
| Doing | Green |
| Describing | Blue |
| Things | Orange |
| Places | Teal |
| Social | Pink |
| Little words | Purple |
| No and stop | Red |

#### Linking an Apple Watch and Apple TV

In the iPhone and iPad app, **Access** has **Link with the Apple Watch and Apple TV**. It is off to begin with.

- **Apple Watch:** pair it with the iPhone as usual, then turn the link on. The watch shows the Favourites and today's plan, shares the traffic light, and its **On iPhone** page opens Games, Draw, Music and the rest on the iPhone.
- **Apple TV:** open Rugged Speech on the television, go to its **iPad** tab, and type the four-digit code it shows into the box in Access, then **Turn the link on**. The iPad and the television must be on the same home wifi. **New code** on the television changes the code.
- Only the Favourites, today's plan, the traffic light and the page that is open are shared. Nothing the child has said or typed is. Another device can open a page or change the traffic light, and cannot make the iPad speak.
`;
function slug(text) {
  return text.toLowerCase().replace(/[`*_]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const splitRow = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
function parseMarkdown(source) {
  const lines2 = source.replace(/\r\n/g, "\n").replace(/<!--[\s\S]*?-->/g, "").split("\n");
  const blocks = [];
  let i2 = 0;
  const seen2 = /* @__PURE__ */ new Map();
  const uniqueId = (text) => {
    const base = slug(text) || "section";
    const count = seen2.get(base) ?? 0;
    seen2.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
  while (i2 < lines2.length) {
    const line = lines2[i2];
    if (line.trim() === "" || /^\s*(---|\*\*\*)\s*$/.test(line)) {
      i2 += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const body = [];
      i2 += 1;
      while (i2 < lines2.length && !lines2[i2].startsWith("```")) body.push(lines2[i2++]);
      i2 += 1;
      blocks.push({ kind: "code", text: body.join("\n") });
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const text = heading[2].trim();
      blocks.push({ kind: "heading", level: heading[1].length, text, id: uniqueId(text) });
      i2 += 1;
      continue;
    }
    const image = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(line.trim());
    if (image) {
      blocks.push({ kind: "image", alt: image[1], src: image[2] });
      i2 += 1;
      continue;
    }
    if (line.trim().startsWith("|") && /^\s*\|?\s*:?-{2,}/.test(lines2[i2 + 1] ?? "")) {
      const header = splitRow(line);
      i2 += 2;
      const rows = [];
      while (i2 < lines2.length && lines2[i2].trim().startsWith("|")) rows.push(splitRow(lines2[i2++]));
      blocks.push({ kind: "table", header, rows });
      continue;
    }
    if (line.startsWith(">")) {
      const body = [];
      while (i2 < lines2.length && lines2[i2].startsWith(">")) body.push(lines2[i2++].replace(/^>\s?/, ""));
      blocks.push({ kind: "quote", text: body.join(" ") });
      continue;
    }
    const listMatch = /^\s*([-*]|\d+\.)\s+(.*)$/.exec(line);
    if (listMatch) {
      const ordered = /\d+\./.test(listMatch[1]);
      const items = [];
      while (i2 < lines2.length) {
        const m2 = /^\s*([-*]|\d+\.)\s+(.*)$/.exec(lines2[i2]);
        if (m2) {
          items.push(m2[2]);
          i2 += 1;
        } else if (/^\s{2,}\S/.test(lines2[i2]) && items.length > 0) {
          items[items.length - 1] += ` ${lines2[i2].trim()}`;
          i2 += 1;
        } else break;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }
    const paragraph = [];
    while (i2 < lines2.length && lines2[i2].trim() !== "" && !/^(#{1,3}\s|>|```|\s*([-*]|\d+\.)\s|\|)/.test(lines2[i2]) && !/^!\[/.test(lines2[i2].trim())) {
      paragraph.push(lines2[i2++].trim());
    }
    if (paragraph.length === 0) {
      i2 += 1;
      continue;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }
  return blocks;
}
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g;
function renderInline(text, onLink) {
  const out = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    const token = match[0];
    if (token.startsWith("**")) out.push(/* @__PURE__ */ u$1("strong", { children: renderInline(token.slice(2, -2), onLink) }, key++));
    else if (token.startsWith("`")) out.push(/* @__PURE__ */ u$1("code", { children: token.slice(1, -1) }, key++));
    else if (token.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      const label = link[1];
      const target = link[2];
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
        out.push(
          /* @__PURE__ */ u$1("span", { children: [
            label,
            " ",
            /* @__PURE__ */ u$1("span", { class: "guide__address", children: [
              "(",
              target.replace(/^mailto:/, ""),
              ")"
            ] })
          ] }, key++)
        );
      } else {
        out.push(
          /* @__PURE__ */ u$1(
            "a",
            {
              href: target,
              onClick: (event) => {
                event.preventDefault();
                onLink?.(target);
              },
              children: label
            },
            key++
          )
        );
      }
    } else out.push(/* @__PURE__ */ u$1("em", { children: token.slice(1, -1) }, key++));
    last = index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
function Markdown({
  blocks,
  images,
  onLink
}) {
  return /* @__PURE__ */ u$1("div", { class: "guide__page", children: blocks.map((block, index) => {
    switch (block.kind) {
      case "heading": {
        const Tag = `h${block.level}`;
        return /* @__PURE__ */ u$1(Tag, { id: `guide-${block.id}`, class: `guide__h${block.level}`, children: renderInline(block.text, onLink) }, index);
      }
      case "paragraph":
        return /* @__PURE__ */ u$1("p", { children: renderInline(block.text, onLink) }, index);
      case "list": {
        const items = block.items.map((item, i2) => /* @__PURE__ */ u$1("li", { children: renderInline(item, onLink) }, i2));
        return block.ordered ? /* @__PURE__ */ u$1("ol", { children: items }, index) : /* @__PURE__ */ u$1("ul", { children: items }, index);
      }
      case "quote":
        return /* @__PURE__ */ u$1("blockquote", { class: "guide__quote", children: renderInline(block.text, onLink) }, index);
      case "table":
        return /* @__PURE__ */ u$1("table", { class: "guide__table", children: [
          /* @__PURE__ */ u$1("thead", { children: /* @__PURE__ */ u$1("tr", { children: block.header.map((cell, i2) => /* @__PURE__ */ u$1("th", { children: renderInline(cell, onLink) }, i2)) }) }),
          /* @__PURE__ */ u$1("tbody", { children: block.rows.map((row, r2) => /* @__PURE__ */ u$1("tr", { children: row.map((cell, c2) => /* @__PURE__ */ u$1("td", { children: renderInline(cell, onLink) }, c2)) }, r2)) })
        ] }, index);
      case "image": {
        const file = block.src.split("/").pop() ?? "";
        const url = images[file];
        return url ? /* @__PURE__ */ u$1("figure", { class: "guide__figure", children: [
          /* @__PURE__ */ u$1("img", { src: url, alt: block.alt, loading: "lazy" }),
          block.alt && /* @__PURE__ */ u$1("figcaption", { children: block.alt })
        ] }, index) : null;
      }
      case "code":
        return /* @__PURE__ */ u$1("pre", { class: "guide__code", children: block.text }, index);
    }
  }) });
}
const IMAGES = /* @__PURE__ */ Object.assign({ "../../../docs/images/body-back.png": __vite_glob_0_0, "../../../docs/images/body-pointing.png": __vite_glob_0_1, "../../../docs/images/calm.png": __vite_glob_0_2, "../../../docs/images/feelings.png": __vite_glob_0_3, "../../../docs/images/game-draw.png": __vite_glob_0_4, "../../../docs/images/game-find.png": __vite_glob_0_5, "../../../docs/images/game-jokes.png": __vite_glob_0_6, "../../../docs/images/game-piano.png": __vite_glob_0_7, "../../../docs/images/game-rollercoaster.png": __vite_glob_0_8, "../../../docs/images/game-seasons.png": __vite_glob_0_9, "../../../docs/images/game-snap.png": __vite_glob_0_10, "../../../docs/images/game-tree.png": __vite_glob_0_11, "../../../docs/images/games.png": __vite_glob_0_12, "../../../docs/images/help.png": __vite_glob_0_13, "../../../docs/images/home-night.png": __vite_glob_0_14, "../../../docs/images/home.png": __vite_glob_0_15, "../../../docs/images/keyboard.png": __vite_glob_0_16, "../../../docs/images/lost-mode.png": __vite_glob_0_17, "../../../docs/images/medical-info.png": __vite_glob_0_18, "../../../docs/images/parent-about-me.png": __vite_glob_0_19, "../../../docs/images/parent-access.png": __vite_glob_0_20, "../../../docs/images/parent-backup.png": __vite_glob_0_21, "../../../docs/images/parent-boards.png": __vite_glob_0_22, "../../../docs/images/parent-guide.png": __vite_glob_0_23, "../../../docs/images/parent-learning.png": __vite_glob_0_24, "../../../docs/images/parent-look-pink.png": __vite_glob_0_25, "../../../docs/images/parent-look.png": __vite_glob_0_26, "../../../docs/images/parent-lost-mode.png": __vite_glob_0_27, "../../../docs/images/parent-medical.png": __vite_glob_0_28, "../../../docs/images/parent-music.png": __vite_glob_0_29, "../../../docs/images/parent-my-body.png": __vite_glob_0_30, "../../../docs/images/parent-my-day.png": __vite_glob_0_31, "../../../docs/images/parent-my-pages.png": __vite_glob_0_32, "../../../docs/images/parent-quick-access.png": __vite_glob_0_33, "../../../docs/images/parent-school.png": __vite_glob_0_34, "../../../docs/images/parent-seasons.png": __vite_glob_0_35, "../../../docs/images/parent-user.png": __vite_glob_0_36, "../../../docs/images/school-button.png": __vite_glob_0_37, "../../../docs/images/school-classroom.png": __vite_glob_0_38, "../../../docs/images/school-guide.png": __vite_glob_0_39, "../../../docs/images/school-lessons.png": __vite_glob_0_40, "../../../docs/images/school-pin-entry.png": __vite_glob_0_41, "../../../docs/images/school-pupil.png": __vite_glob_0_42, "../../../docs/images/school-safeguarding.png": __vite_glob_0_43, "../../../docs/images/school-timetable.png": __vite_glob_0_44, "../../../docs/images/school-today.png": __vite_glob_0_45, "../../../docs/images/school-vocabulary.png": __vite_glob_0_46, "../../../docs/images/setup-1-welcome.png": __vite_glob_0_47, "../../../docs/images/setup-2-whose-device.png": __vite_glob_0_48, "../../../docs/images/setup-3-voice.png": __vite_glob_0_49, "../../../docs/images/setup-4-grid.png": __vite_glob_0_50, "../../../docs/images/setup-5-pictures.png": __vite_glob_0_51, "../../../docs/images/setup-6-press.png": __vite_glob_0_52, "../../../docs/images/setup-7-colours.png": __vite_glob_0_53, "../../../docs/images/setup-8-pin-and-code.png": __vite_glob_0_54, "../../../docs/images/setup-9-ready.png": __vite_glob_0_55, "../../../docs/images/staff-activity.png": __vite_glob_0_56, "../../../docs/images/staff-handover.png": __vite_glob_0_57, "../../../docs/images/staff-notes.png": __vite_glob_0_58, "../../../docs/images/staff-review.png": __vite_glob_0_59, "../../../docs/images/staff-targets.png": __vite_glob_0_60, "../../../docs/images/talk-emoji.png": __vite_glob_0_61, "../../../docs/images/talk-pink.png": __vite_glob_0_62, "../../../docs/images/talk-sentence.png": __vite_glob_0_63, "../../../docs/images/talk.png": __vite_glob_0_64, "../../../docs/images/traffic-light.png": __vite_glob_0_65 });
const IMAGE_BY_FILE = Object.fromEntries(
  Object.entries(IMAGES).map(([path, url]) => [path.split("/").pop() ?? path, url])
);
const GUIDES = [
  { id: "parents", label: "Start here: parents and carers", source: parentsGuide },
  { id: "staff", label: "Start here: teachers and staff", source: staffGuide },
  { id: "full", label: "The whole guide", source: fullGuide }
];
const parsed = {
  parents: parseMarkdown(parentsGuide),
  staff: parseMarkdown(staffGuide),
  full: parseMarkdown(fullGuide)
};
function outline(blocks) {
  return blocks.filter((b2) => b2.kind === "heading" && b2.level === 2).map((b2) => ({ id: b2.id, text: b2.text.replace(/[`*_]/g, ""), level: b2.level }));
}
function filterBlocks(blocks, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return blocks;
  const sections = [];
  for (const block of blocks) {
    if (block.kind === "heading" && block.level <= 2) sections.push([block]);
    else if (sections.length > 0) sections[sections.length - 1].push(block);
    else sections.push([block]);
  }
  const text = (section) => section.map((b2) => b2.kind === "list" ? b2.items.join(" ") : b2.kind === "table" ? [...b2.header, ...b2.rows.flat()].join(" ") : "text" in b2 ? b2.text : "").join(" ").toLowerCase();
  return sections.filter((section) => words.every((word2) => text(section).includes(word2))).flat();
}
function GuideTab({ start = "parents" } = {}) {
  const which = useSignal(start);
  const search = useSignal("");
  const blocks = filterBlocks(parsed[which.value], search.value);
  const headings = outline(parsed[which.value]);
  function jump(id) {
    document.getElementById(`guide-${id}`)?.scrollIntoView?.({ block: "start" });
  }
  function follow(target) {
    if (target.startsWith("#")) {
      jump(slug(target.slice(1)));
      return;
    }
    const file = target.split("#")[0].split("/").pop() ?? "";
    const next = file.includes("parents") ? "parents" : file.includes("staff") ? "staff" : file.includes("user-guide") ? "full" : null;
    if (next) {
      search.value = "";
      which.value = next;
      const anchor = target.split("#")[1];
      if (anchor) setTimeout(() => jump(slug(anchor)), 0);
    }
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body guide", children: [
    /* @__PURE__ */ u$1("div", { class: "guide__top", children: [
      /* @__PURE__ */ u$1("div", { class: "activity-tab__what", role: "group", "aria-label": "Which guide", children: GUIDES.map((guide) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `activity-tab__chip${which.value === guide.id ? " activity-tab__chip--on" : ""}`,
          "aria-pressed": which.value === guide.id,
          onClick: () => {
            which.value = guide.id;
            search.value = "";
          },
          children: guide.label
        },
        guide.id
      )) }),
      /* @__PURE__ */ u$1("label", { class: "guide__search", children: [
        "Search the guide",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "search",
            autocomplete: "off",
            placeholder: "for example: backup, wheelchair, PIN",
            value: search.value,
            onInput: (event) => search.value = event.target.value
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "guide__layout", children: [
      /* @__PURE__ */ u$1("nav", { class: "guide__outline", "aria-label": "In this guide", children: [
        /* @__PURE__ */ u$1("p", { class: "guide__outline-title", children: "In this guide" }),
        /* @__PURE__ */ u$1("ul", { children: headings.map((heading) => /* @__PURE__ */ u$1("li", { children: /* @__PURE__ */ u$1(
          "a",
          {
            href: `#${heading.id}`,
            onClick: (event) => {
              event.preventDefault();
              search.value = "";
              setTimeout(() => jump(heading.id), 0);
            },
            children: heading.text
          }
        ) }, heading.id)) })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "guide__content", children: blocks.length === 0 ? /* @__PURE__ */ u$1("p", { class: "guide__none", children: [
        "Nothing in this guide matches “",
        search.value,
        "”. Try another word, or look in the whole guide."
      ] }) : /* @__PURE__ */ u$1(Markdown, { blocks, images: IMAGE_BY_FILE, onLink: follow }) })
    ] })
  ] });
}
const PERIODS$1 = [
  { id: "hour", label: "Hours", heading: "Each hour, over the last day" },
  { id: "day", label: "Days", heading: "Each day, over the last two weeks" },
  { id: "week", label: "Weeks", heading: "Each week, over the last two months" },
  { id: "month", label: "Months", heading: "Each month, over the last six months" }
];
const WHAT = [
  { id: "all", label: "Everything" },
  { id: "speech", label: "What was said" },
  { id: "screen", label: "What was opened" },
  { id: "adult", label: "Adult actions" }
];
function ActivityTab() {
  const entries = useSignal([]);
  const period = useSignal("day");
  const what = useSignal("all");
  const confirmClear = useSignal(false);
  const message = useSignal("");
  const enabled = activityEnabledSetting.signal.value;
  const version = activityVersion.value;
  h$2(() => {
    void getActivity().then((loaded) => entries.value = loaded);
  }, [version, enabled, activityRetentionSetting.signal.value]);
  const now = Date.now();
  const kinds = what.value === "all" ? void 0 : [what.value];
  const bars = buckets(entries.value, period.value, now, kinds);
  const tallest = Math.max(1, ...bars.map((bar) => bar.count));
  const sums = totals(entries.value, now, kinds);
  const top = topSpoken(entries.value, now, 30);
  const recent = [...entries.value].filter((e2) => !kinds || kinds.includes(e2.kind)).sort((a2, b2) => b2.at - a2.at).slice(0, 100);
  async function exportCsv() {
    const result = await window.myWords.files.save(entriesToCsv(entries.value), {
      suggestedName: "rugged-speech-activity.csv",
      filterName: "Spreadsheet (CSV)",
      extensions: ["csv"]
    });
    message.value = result.ok ? "Saved." : "Not saved.";
  }
  async function clearAll() {
    confirmClear.value = false;
    await clearActivity();
    entries.value = [];
    message.value = "The activity log is empty.";
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body activity-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Activity log" }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        "Keeps a note of what is said and which parts of the app are opened, with the time, so you can see how the device is used through the day and over the weeks. It is ",
        /* @__PURE__ */ u$1("strong", { children: "off" }),
        " until you turn it on. It stays on this ",
        deviceNoun(),
        " and is kept only for the days you choose. Every phrase is noted the same way, including the Help phrases: nothing is flagged and nobody is told. If someone says something that worries you, follow your safeguarding procedure."
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: enabled,
            onChange: (event) => void activityEnabledSetting.set(event.target.checked)
          }
        ),
        "Keep an activity log"
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Keep it for",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: String(activityRetentionSetting.signal.value),
            onChange: (event) => void activityRetentionSetting.set(Number(event.target.value)),
            children: RETENTION_CHOICES.map((days) => /* @__PURE__ */ u$1("option", { value: String(days), children: days === 365 ? "a year" : `${days} days` }, days))
          }
        )
      ] }),
      !enabled && /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: "Nothing is being kept." })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "How much it is used" }),
      /* @__PURE__ */ u$1("div", { class: "activity-tab__what", role: "group", "aria-label": "Show", children: WHAT.map((choice) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `activity-tab__chip${what.value === choice.id ? " activity-tab__chip--on" : ""}`,
          "aria-pressed": what.value === choice.id,
          onClick: () => what.value = choice.id,
          children: choice.label
        },
        choice.id
      )) }),
      /* @__PURE__ */ u$1("dl", { class: "activity-tab__totals", children: [
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("dt", { children: "Last hour" }),
          /* @__PURE__ */ u$1("dd", { children: sums.lastHour })
        ] }),
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("dt", { children: "Today" }),
          /* @__PURE__ */ u$1("dd", { children: sums.today })
        ] }),
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("dt", { children: "Last 7 days" }),
          /* @__PURE__ */ u$1("dd", { children: sums.week })
        ] }),
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("dt", { children: "Last 30 days" }),
          /* @__PURE__ */ u$1("dd", { children: sums.month })
        ] })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "activity-tab__what", role: "group", "aria-label": "Group by", children: PERIODS$1.map((choice) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `activity-tab__chip${period.value === choice.id ? " activity-tab__chip--on" : ""}`,
          "aria-pressed": period.value === choice.id,
          onClick: () => period.value = choice.id,
          children: choice.label
        },
        choice.id
      )) }),
      /* @__PURE__ */ u$1("p", { class: "activity-tab__chart-title", children: PERIODS$1.find((p2) => p2.id === period.value).heading }),
      /* @__PURE__ */ u$1("ol", { class: "activity-tab__chart", "aria-label": "Counts", children: bars.map((bar) => /* @__PURE__ */ u$1("li", { class: "activity-tab__bar", children: [
        /* @__PURE__ */ u$1("span", { class: "activity-tab__count", children: bar.count }),
        /* @__PURE__ */ u$1("span", { class: "activity-tab__fill", style: { height: `${Math.round(bar.count / tallest * 100)}%` } }),
        /* @__PURE__ */ u$1("span", { class: "activity-tab__label", children: bar.label })
      ] }, bar.start)) })
    ] }),
    top.length > 0 && /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Said most, last 30 days" }),
      /* @__PURE__ */ u$1("ol", { class: "activity-tab__top", children: top.map((row) => /* @__PURE__ */ u$1("li", { children: [
        row.label,
        " ",
        /* @__PURE__ */ u$1("strong", { children: row.count })
      ] }, row.label)) })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "access-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "The log" }),
      recent.length === 0 ? /* @__PURE__ */ u$1("p", { children: enabled ? "Nothing noted yet." : "Nothing is being kept." }) : /* @__PURE__ */ u$1("table", { class: "activity-tab__table", children: [
        /* @__PURE__ */ u$1("thead", { children: /* @__PURE__ */ u$1("tr", { children: [
          /* @__PURE__ */ u$1("th", { children: "When" }),
          /* @__PURE__ */ u$1("th", { children: "What" }),
          /* @__PURE__ */ u$1("th", { children: "Detail" })
        ] }) }),
        /* @__PURE__ */ u$1("tbody", { children: recent.map((entry) => /* @__PURE__ */ u$1("tr", { children: [
          /* @__PURE__ */ u$1("td", { children: formatTime$1(entry.at) }),
          /* @__PURE__ */ u$1("td", { children: KIND_LABELS[entry.kind] }),
          /* @__PURE__ */ u$1("td", { children: entry.label })
        ] }, entry.id)) })
      ] }),
      /* @__PURE__ */ u$1("p", { class: "access-tab__hint", children: [
        "Showing the latest ",
        recent.length,
        ". The spreadsheet has all of it."
      ] }),
      /* @__PURE__ */ u$1("div", { class: "activity-tab__buttons", children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", disabled: entries.value.length === 0, onClick: () => void exportCsv(), children: "Save as a spreadsheet" }),
        confirmClear.value ? /* @__PURE__ */ u$1(S$1, { children: [
          /* @__PURE__ */ u$1("span", { children: "Empty the whole log?" }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void clearAll(), children: "Yes, empty it" }),
          /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmClear.value = false, children: "Keep it" })
        ] }) : /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", disabled: entries.value.length === 0, onClick: () => confirmClear.value = true, children: "Clear the log" })
      ] }),
      /* @__PURE__ */ u$1("p", { role: "status", children: message.value })
    ] })
  ] });
}
function TargetsTab() {
  const text = useSignal("");
  const area = useSignal("express");
  const review = useSignal("");
  const targets = sortedTargets(targetsSetting.signal.value);
  const today2 = getDateString(/* @__PURE__ */ new Date());
  const example = TARGET_AREAS.find((a2) => a2.id === area.value).example;
  function add(event) {
    event.preventDefault();
    const trimmed = text.value.trim();
    if (!trimmed || targetsSetting.signal.value.length >= MAX_TARGETS) return;
    const target = {
      id: `target-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
      area: area.value,
      status: "working",
      set: today2,
      review: review.value,
      notes: ""
    };
    void targetsSetting.set([...targetsSetting.signal.value, target]);
    text.value = "";
    review.value = "";
  }
  function update(id, changes) {
    void targetsSetting.set(targetsSetting.signal.value.map((t2) => t2.id === id ? { ...t2, ...changes } : t2));
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body targets-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "What is being worked on, in plain words. Write them as the child would hope to hear them, for example “Uses",
      /* @__PURE__ */ u$1("em", { children: " I want" }),
      " and a word to ask for what they need.” They are for adults only and never shown on the child's screen. They appear on the Reports sheets."
    ] }),
    /* @__PURE__ */ u$1("form", { class: "targets-tab__form", onSubmit: add, children: [
      /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
        "New target",
        /* @__PURE__ */ u$1(
          "input",
          {
            class: "about-tab__input",
            type: "text",
            placeholder: example,
            value: text.value,
            onInput: (event) => text.value = event.target.value
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "About",
        /* @__PURE__ */ u$1("select", { value: area.value, onChange: (event) => area.value = event.target.value, children: TARGET_AREAS.map((a2) => /* @__PURE__ */ u$1("option", { value: a2.id, children: a2.label }, a2.id)) })
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Look at it again on",
        /* @__PURE__ */ u$1("input", { type: "date", value: review.value, onInput: (event) => review.value = event.target.value })
      ] }),
      /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: !text.value.trim(), children: "Add target" })
    ] }),
    targets.length === 0 ? /* @__PURE__ */ u$1("p", { children: "No targets yet." }) : /* @__PURE__ */ u$1("ul", { class: "targets-tab__list", children: targets.map((target) => /* @__PURE__ */ u$1("li", { class: `targets-tab__target targets-tab__target--${target.status}`, children: [
      /* @__PURE__ */ u$1("div", { class: "targets-tab__head", children: [
        /* @__PURE__ */ u$1("strong", { children: target.text }),
        /* @__PURE__ */ u$1("span", { class: "targets-tab__area", children: TARGET_AREAS.find((a2) => a2.id === target.area).label }),
        reviewDue(target, today2) && /* @__PURE__ */ u$1("span", { class: "targets-tab__due", children: "Time to look at this again" })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "targets-tab__row", children: [
        /* @__PURE__ */ u$1("label", { children: [
          /* @__PURE__ */ u$1("span", { class: "targets-tab__small", children: "Status" }),
          /* @__PURE__ */ u$1(
            "select",
            {
              "aria-label": `Status of ${target.text}`,
              value: target.status,
              onChange: (event) => update(target.id, { status: event.target.value }),
              children: Object.keys(TARGET_STATUS_LABELS).map((status) => /* @__PURE__ */ u$1("option", { value: status, children: TARGET_STATUS_LABELS[status] }, status))
            }
          )
        ] }),
        /* @__PURE__ */ u$1("label", { children: [
          /* @__PURE__ */ u$1("span", { class: "targets-tab__small", children: "Look again on" }),
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "date",
              "aria-label": `Review date for ${target.text}`,
              value: target.review,
              onInput: (event) => update(target.id, { review: event.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            "aria-label": `Remove target: ${target.text}`,
            onClick: () => void targetsSetting.set(targetsSetting.signal.value.filter((t2) => t2.id !== target.id)),
            children: "Remove"
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
        "How it is going",
        /* @__PURE__ */ u$1(
          "textarea",
          {
            class: "about-tab__input about-tab__textarea targets-tab__notes",
            "aria-label": `Notes on ${target.text}`,
            value: target.notes,
            onInput: (event) => update(target.id, { notes: event.target.value })
          }
        )
      ] })
    ] }, target.id)) })
  ] });
}
function NotesTab() {
  const text = useSignal("");
  const confirmRemove = useSignal(null);
  const kind = useSignal("observation");
  const filter = useSignal("all");
  const notes = [...staffNotesSetting.signal.value].filter((note) => filter.value === "all" || (note.kind ?? "observation") === filter.value).sort((a2, b2) => b2.at - a2.at);
  function add(event) {
    event.preventDefault();
    const trimmed = text.value.trim();
    if (!trimmed || staffNotesSetting.signal.value.length >= MAX_NOTES) return;
    void staffNotesSetting.set([
      ...staffNotesSetting.signal.value,
      { id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: Date.now(), by: noteAuthorSetting.signal.value.trim(), text: trimmed, kind: kind.value }
    ]);
    text.value = "";
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body notes-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "A short note after a session or a day: what was tried, what the child did, what to try next. Notes are for adults only, stay on this ",
      deviceNoun(),
      ", and appear on the Reports sheets. Please write about communication, and keep it kind and factual."
    ] }),
    /* @__PURE__ */ u$1("form", { class: "notes-tab__form", onSubmit: add, children: [
      /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
        "Written by",
        /* @__PURE__ */ u$1(
          "input",
          {
            class: "about-tab__input",
            type: "text",
            autocomplete: "off",
            value: noteAuthorSetting.signal.value,
            onInput: (event) => void noteAuthorSetting.set(event.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "What kind of note",
        /* @__PURE__ */ u$1("select", { value: kind.value, onChange: (event) => kind.value = event.target.value, children: NOTE_KINDS.map((k2) => /* @__PURE__ */ u$1("option", { value: k2.id, children: k2.label }, k2.id)) })
      ] }),
      /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
        "Note",
        /* @__PURE__ */ u$1(
          "textarea",
          {
            class: "about-tab__input about-tab__textarea",
            value: text.value,
            onInput: (event) => text.value = event.target.value
          }
        )
      ] }),
      /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: !text.value.trim(), children: "Add note" })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "activity-tab__what", role: "group", "aria-label": "Show notes", children: [{ id: "all", label: "All" }, ...NOTE_KINDS].map((choice) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: `activity-tab__chip${filter.value === choice.id ? " activity-tab__chip--on" : ""}`,
        "aria-pressed": filter.value === choice.id,
        onClick: () => filter.value = choice.id,
        children: choice.label
      },
      choice.id
    )) }),
    notes.length === 0 ? /* @__PURE__ */ u$1("p", { children: staffNotesSetting.signal.value.length === 0 ? "No notes yet." : "No notes of this kind." }) : /* @__PURE__ */ u$1("ul", { class: "notes-tab__list", children: notes.map((note) => /* @__PURE__ */ u$1("li", { class: "notes-tab__note", children: [
      /* @__PURE__ */ u$1("p", { class: "notes-tab__meta", children: [
        formatTime$1(note.at),
        note.by.trim() ? `, ${note.by.trim()}` : "",
        " · ",
        NOTE_KINDS.find((k2) => k2.id === (note.kind ?? "observation")).label
      ] }),
      /* @__PURE__ */ u$1("p", { class: "notes-tab__text", children: note.text }),
      confirmRemove.value === note.id ? /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1("span", { children: "Remove this note?" }),
        " ",
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            onClick: () => {
              void staffNotesSetting.set(staffNotesSetting.signal.value.filter((n2) => n2.id !== note.id));
              confirmRemove.value = null;
            },
            children: "Yes, remove it"
          }
        ),
        " ",
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmRemove.value = null, children: "Keep it" })
      ] }) : /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", "aria-label": `Remove the note from ${formatTime$1(note.at)}`, onClick: () => confirmRemove.value = note.id, children: "Remove" })
    ] }, note.id)) })
  ] });
}
const ABOUT_ME_FIELDS = [
  {
    id: "howIcommunicate",
    title: "How I communicate",
    hint: "For example: I use this app, some words, and gestures. I need time to answer."
  },
  {
    id: "whatHelps",
    title: "What helps me",
    hint: "For example: a warning before changes, a quiet space, being shown rather than told."
  },
  {
    id: "whatIFindHard",
    title: "What I find hard",
    hint: "For example: loud rooms, being rushed, unexpected changes."
  },
  { id: "likes", title: "What I like", hint: "Favourite things, people, activities." },
  { id: "dislikes", title: "What I don't like", hint: "Things to avoid." }
];
function hasAboutMe(info) {
  return Object.values(info).some((value) => value.trim() !== "");
}
function aboutMeSections(info) {
  return ABOUT_ME_FIELDS.filter((field) => info[field.id].trim() !== "").map((field) => ({
    title: field.title,
    text: info[field.id].trim()
  }));
}
function aboutMeHeading(info, fallbackName = "") {
  const name = info.preferredName.trim() || fallbackName.trim();
  return name ? `About ${name}` : "About me";
}
const PRESS = {
  sentence: "Pressing a word adds it to the sentence, then Speak says it.",
  speak: "Pressing a word says it straight away.",
  both: "Pressing a word says it and adds it to the sentence."
};
const STYLE = {
  normal: "The sentence is read out all together.",
  clear: "The sentence is read out with small gaps between words, a little slower.",
  wordByWord: "The sentence is read out one word at a time, lighting each word."
};
const SCANNING = {
  off: void 0,
  oneSwitchTimed: "Uses one switch, with automatic scanning.",
  twoSwitchStepped: "Uses two switches: one to move, one to choose."
};
function handoverSheet(input) {
  const name = input.about.preferredName.trim() || input.profile.name.trim();
  const age = ageYears(input.profile);
  const sections = [];
  const who = [
    name ? `Likes to be called: ${name}` : "",
    age !== void 0 ? `Age: ${age}` : "",
    `Device: ${deviceTitle(input.profile)}`,
    ...schoolInfoLines(input.school).map((line) => `${line.label}: ${line.value}`)
  ].filter(Boolean);
  sections.push({ title: "Who and where", lines: who });
  for (const section of aboutMeSections(input.about)) sections.push({ title: section.title, lines: [section.text] });
  const how = [PRESS[input.press], STYLE[input.speakStyle], SCANNING[input.access.scanningMode]].filter((x2) => Boolean(x2));
  if (input.access.dwellMs > 0) how.push(`Holds a button for ${input.access.dwellMs / 1e3} seconds to choose it.`);
  sections.push({ title: "How the device works for them", lines: how });
  if (input.focusWords.length > 0) sections.push({ title: "Words being practised", lines: [input.focusWords.join(", ")] });
  const working = sortedTargets(input.targets).filter((t2) => t2.status === "working");
  if (working.length > 0) sections.push({ title: "Current targets", lines: working.map((t2) => t2.text) });
  sections.push({
    title: "If they want to be left alone, or want to talk",
    lines: [
      `Red: ${input.traffic.phrases.red}`,
      `Amber: ${input.traffic.phrases.amber}`,
      `Green: ${input.traffic.phrases.green}`
    ]
  });
  sections.push({
    title: "Good to know",
    lines: [
      "Let them take their time. Wait before asking again.",
      "The Help button is always along the top. Someone who is upset or tells you something worrying: follow your safeguarding procedure. The device does not tell anyone.",
      "Please do not move the buttons or change the settings without asking."
    ]
  });
  return { heading: name ? `Handover: ${name}` : "Handover", subheading: "Written for someone new to supporting this child.", sections };
}
function reviewSheet(input) {
  const name = input.about.preferredName.trim() || input.profile.name.trim();
  const since = input.now - input.days * 24 * 60 * 60 * 1e3;
  const sections = [];
  const targets = sortedTargets(input.targets);
  sections.push({
    title: "Targets",
    lines: targets.length === 0 ? ["No targets have been set."] : targets.map((t2) => {
      const area = TARGET_AREAS.find((a2) => a2.id === t2.area).label;
      return `${TARGET_STATUS_LABELS[t2.status]} (${area}): ${t2.text}${t2.notes.trim() ? ` Notes: ${t2.notes.trim()}` : ""}`;
    })
  });
  if (input.activityOn || input.activity.length > 0) {
    const mine = input.activity.filter((e2) => e2.at >= since);
    const sums = totals(mine, input.now);
    const spoken = topSpoken(mine, input.now, input.days, 10);
    sections.push({
      title: `How the device was used, last ${input.days} days`,
      lines: [
        `Things said: ${mine.filter((e2) => e2.kind === "speech").length}`,
        `Parts of the app opened: ${mine.filter((e2) => e2.kind === "screen").length}`,
        `In the last 7 days: ${sums.week}. In the last 30 days: ${sums.month}.`,
        ...spoken.length > 0 ? [`Said most: ${spoken.map((s2) => `${s2.label} (${s2.count})`).join(", ")}`] : []
      ]
    });
  } else {
    sections.push({ title: "How the device was used", lines: ["The activity log is off, so there is nothing to report."] });
  }
  if (input.usageOn) {
    const summary = summariseUsage(input.usage, Math.min(input.days, 90), new Date(input.now));
    sections.push({
      title: "Words pressed",
      lines: [
        `${summary.totalPresses} presses of ${summary.distinctWords} different words.`,
        ...summary.rows.length > 0 ? [`Most used: ${summary.rows.slice(0, 10).map((r2) => `${r2.word} (${r2.count})`).join(", ")}`] : []
      ]
    });
  }
  const notes = [...input.notes].filter((n2) => n2.at >= since).sort((a2, b2) => a2.at - b2.at);
  sections.push({
    title: "Notes from sessions",
    lines: notes.length === 0 ? ["No notes in this time."] : notes.map((n2) => `${formatTime$1(n2.at)}${n2.by.trim() ? `, ${n2.by.trim()}` : ""}: ${n2.text}`)
  });
  return {
    heading: name ? `Review: ${name}` : "Review",
    subheading: `The last ${input.days} days, to ${formatTime$1(input.now).slice(0, 10)}.`,
    sections
  };
}
function printPage() {
  const print = window.myWords?.print;
  if (print) void print();
  else window.print();
}
function SheetView({ sheet }) {
  return /* @__PURE__ */ u$1("div", { class: "print-page staff-sheet", children: [
    /* @__PURE__ */ u$1("h2", { class: "staff-sheet__heading", children: sheet.heading }),
    /* @__PURE__ */ u$1("p", { class: "staff-sheet__sub", children: sheet.subheading }),
    sheet.sections.map((section) => /* @__PURE__ */ u$1("section", { class: "staff-sheet__section", children: [
      /* @__PURE__ */ u$1("h3", { class: "staff-sheet__title", children: section.title }),
      section.lines.map((line, index) => /* @__PURE__ */ u$1("p", { class: "staff-sheet__line", children: line }, index))
    ] }, section.title))
  ] });
}
function ReportsTab() {
  const which = useSignal("handover");
  const days = useSignal(30);
  const access = useSignal(DEFAULT_ACCESS_SETTINGS);
  const focusWords = useSignal([]);
  const activity = useSignal([]);
  const version = accessSettingsVersion.value;
  h$2(() => {
    void getAccessSettings().then((loaded) => access.value = loaded);
  }, [version]);
  h$2(() => {
    void getAllBoards().then((boards) => {
      const words = boards.flatMap((board2) => board2.buttons.filter((b2) => b2.target).map((b2) => b2.label));
      focusWords.value = [...new Set(words)];
    });
    void getActivity().then((entries) => activity.value = entries);
  }, []);
  const sheet = which.value === "handover" ? handoverSheet({
    profile: userProfileSetting.signal.value,
    school: schoolInfoSetting.signal.value,
    about: aboutMeSetting.signal.value,
    targets: targetsSetting.signal.value,
    focusWords: focusWords.value,
    press: pressMode.value,
    speakStyle: speakStyleSetting.signal.value,
    access: access.value,
    traffic: trafficSetting.signal.value
  }) : reviewSheet({
    profile: userProfileSetting.signal.value,
    about: aboutMeSetting.signal.value,
    targets: targetsSetting.signal.value,
    notes: staffNotesSetting.signal.value,
    days: days.value,
    now: Date.now(),
    activity: activity.value,
    activityOn: activityEnabledSetting.signal.value,
    usage: usageCountsSetting.signal.value,
    usageOn: usageEnabledSetting.signal.value
  });
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body reports-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "Sheets to print, or to save as a PDF from the print window. They are made here from what is already on this",
      " ",
      deviceNoun(),
      " and are not sent anywhere."
    ] }),
    /* @__PURE__ */ u$1("div", { class: "activity-tab__what", role: "group", "aria-label": "Which sheet", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: `activity-tab__chip${which.value === "handover" ? " activity-tab__chip--on" : ""}`, "aria-pressed": which.value === "handover", onClick: () => which.value = "handover", children: "Handover sheet" }),
      /* @__PURE__ */ u$1("button", { type: "button", class: `activity-tab__chip${which.value === "review" ? " activity-tab__chip--on" : ""}`, "aria-pressed": which.value === "review", onClick: () => which.value = "review", children: "Review report" }),
      which.value === "review" && /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Covering",
        /* @__PURE__ */ u$1("select", { value: String(days.value), onChange: (event) => days.value = Number(event.target.value), children: [30, 90, 180, 365].map((n2) => /* @__PURE__ */ u$1("option", { value: String(n2), children: [
          "the last ",
          n2,
          " days"
        ] }, n2)) })
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => printPage(), children: "Print this sheet" })
    ] }),
    /* @__PURE__ */ u$1(SheetView, { sheet })
  ] });
}
const PICTURES = ["🙂", "😀", "😎", "🦁", "🐯", "🐶", "🐱", "🐰", "🐻", "🦊", "🐼", "🐸", "🦄", "🚀", "⚽", "🌈", "⭐", "🌻", "🚂", "🎨"];
function UserTab() {
  const profile = userProfileSetting.signal.value;
  function update(changes) {
    void userProfileSetting.set({ ...userProfileSetting.signal.value, ...changes });
  }
  const title = deviceTitle(profile);
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body user-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "Tell the app whose device this is. All of it is optional, it stays on this ",
      deviceNoun(),
      ", and none of it is sent anywhere. The device name shows along the top of the child's screen and in the window title, so it is clear whose device it is if it goes missing."
    ] }),
    /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      "Name",
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "about-tab__input",
          type: "text",
          autocomplete: "off",
          value: profile.name,
          placeholder: "Lucy",
          onInput: (event) => update({ name: event.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      "Device name",
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "about-tab__input",
          type: "text",
          autocomplete: "off",
          value: profile.deviceName,
          placeholder: profile.name.trim() ? `${profile.name.trim()}'s device` : "Lucy's device",
          onInput: (event) => update({ deviceName: event.target.value })
        }
      ),
      /* @__PURE__ */ u$1("span", { class: "access-tab__hint", children: "Leave blank to use the name, as in “Lucy's device”." })
    ] }),
    /* @__PURE__ */ u$1("label", { class: "about-tab__field user-tab__age", children: [
      "Age (optional)",
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "about-tab__input",
          type: "text",
          inputMode: "numeric",
          maxLength: 2,
          autocomplete: "off",
          value: profile.age,
          onInput: (event) => update({ age: event.target.value.replace(/\D/g, "") })
        }
      ),
      /* @__PURE__ */ u$1("span", { class: "access-tab__hint", children: "Printed on the About me sheet. It is never used to decide anything." })
    ] }),
    /* @__PURE__ */ u$1("fieldset", { class: "user-tab__pictures", children: [
      /* @__PURE__ */ u$1("legend", { children: "Picture" }),
      /* @__PURE__ */ u$1("div", { class: "user-tab__picture-grid", children: PICTURES.map((emoji) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `user-tab__picture${profile.emoji === emoji ? " user-tab__picture--chosen" : ""}`,
          "aria-pressed": profile.emoji === emoji,
          "aria-label": `Use ${emoji}`,
          onClick: () => update({ emoji: profile.emoji === emoji ? "" : emoji }),
          children: emoji
        },
        emoji
      )) })
    ] }),
    /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "checkbox",
          checked: profile.showOnScreen,
          onChange: (event) => update({ showOnScreen: event.target.checked })
        }
      ),
      "Show the device name along the top of the child's screen"
    ] }),
    /* @__PURE__ */ u$1("h2", { class: "access-tab__heading", children: "Traffic light words" }),
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "What the traffic light says when its button is pressed. Add ",
      /* @__PURE__ */ u$1("strong", { children: "Traffic light" }),
      " to the top bar in Quick Access to use it. Change the words to suit."
    ] }),
    TRAFFIC_LIGHTS.map((light) => /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      /* @__PURE__ */ u$1("span", { children: [
        /* @__PURE__ */ u$1("span", { "aria-hidden": "true", children: light.icon }),
        " ",
        light.short
      ] }),
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "about-tab__input",
          type: "text",
          value: trafficSetting.signal.value.phrases[light.id],
          onInput: (event) => void trafficSetting.set({
            ...trafficSetting.signal.value,
            phrases: { ...trafficSetting.signal.value.phrases, [light.id]: event.target.value }
          })
        }
      )
    ] }, light.id)),
    /* @__PURE__ */ u$1("p", { class: "user-tab__preview", "aria-label": "How it will look", children: [
      /* @__PURE__ */ u$1("span", { "aria-hidden": "true", children: profile.emoji }),
      " ",
      title
    ] })
  ] });
}
const PERIODS = [7, 30, USAGE_RETENTION_DAYS];
function LearningTab() {
  const boards = useSignal([]);
  const period = useSignal(30);
  const confirmClear = useSignal(false);
  const exportMessage = useSignal(null);
  h$2(() => {
    void getAllBoards().then((loaded) => boards.value = loaded);
  }, []);
  const stage = wordStageSetting.signal.value;
  const usageOn = usageEnabledSetting.signal.value;
  const counts = usageCountsSetting.signal.value;
  const words = boards.value.flatMap(
    (board2) => board2.buttons.filter((item) => !item.load_board && !item.hidden).map((item) => ({ item, boardName: board2.name }))
  );
  const heldBack = words.filter(({ item }) => !isItemShown(item, stage)).length;
  const focusWords = words.filter(({ item }) => item.target);
  const summary = summariseUsage(counts, period.value);
  const unused = wordsNotUsed(
    words.filter(({ item }) => isItemShown(item, stage)).map(({ item }) => item.label),
    summary
  );
  async function exportCsv() {
    exportMessage.value = null;
    const result = await window.myWords.files.save(usageToCsv(counts), {
      suggestedName: "rugged-speech-word-counts.csv",
      filterName: "Spreadsheet (CSV)",
      extensions: ["csv"]
    });
    exportMessage.value = result.ok ? "Saved." : null;
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body learning-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "learning-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "learning-tab__heading", children: "Word stage" }),
      /* @__PURE__ */ u$1("p", { class: "learning-tab__hint", children: [
        "Bring words in gradually. Give a word a stage under ",
        /* @__PURE__ */ u$1("strong", { children: "Boards → Details" }),
        "; words above the stage chosen here are held back, and their space stays empty so nothing else moves. Words without a stage are always shown."
      ] }),
      /* @__PURE__ */ u$1("label", { class: "learning-tab__row", children: [
        "Show words up to",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: stage,
            onChange: (event) => void wordStageSetting.set(Number(event.target.value)),
            children: [
              /* @__PURE__ */ u$1("option", { value: 0, children: "All words" }),
              WORD_STAGES.map((value) => /* @__PURE__ */ u$1("option", { value, children: [
                "Stage ",
                value
              ] }, value))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ u$1("p", { class: "learning-tab__status", children: heldBack === 0 ? "No words are being held back." : `${heldBack} word${heldBack === 1 ? " is" : "s are"} held back right now.` })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "learning-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "learning-tab__heading", children: "Focus words" }),
      /* @__PURE__ */ u$1("p", { class: "learning-tab__hint", children: [
        "Words being worked on show with a blue outline on the child's board. Mark or unmark them under ",
        /* @__PURE__ */ u$1("strong", { children: "Boards → Details" }),
        "."
      ] }),
      focusWords.length === 0 ? /* @__PURE__ */ u$1("p", { class: "learning-tab__status", children: "No focus words yet." }) : /* @__PURE__ */ u$1("ul", { class: "learning-tab__list", children: focusWords.map(({ item, boardName }) => /* @__PURE__ */ u$1("li", { children: [
        item.label,
        " ",
        /* @__PURE__ */ u$1("span", { class: "learning-tab__muted", children: [
          "on ",
          boardName
        ] })
      ] }, `${boardName}-${item.id}`)) })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "learning-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "learning-tab__heading", children: "After speaking" }),
      /* @__PURE__ */ u$1("label", { class: "learning-tab__check", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: clearAfterSpeakSetting.signal.value,
            onChange: (event) => void clearAfterSpeakSetting.set(event.target.checked)
          }
        ),
        "Clear the sentence once it has been spoken"
      ] }),
      /* @__PURE__ */ u$1("p", { class: "learning-tab__hint", children: "For people who start each sentence afresh. Off keeps it, so it can be said again." })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "learning-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "learning-tab__heading", children: "Word counts" }),
      /* @__PURE__ */ u$1("p", { class: "learning-tab__hint", children: [
        "Off by default. When on, it counts how many times each word is pressed each day, and nothing else: no sentences and no times of day. Counts stay on this device, are kept for",
        ` ${USAGE_RETENTION_DAYS} `,
        "days, and can be cleared or switched off whenever you like. Every word button is counted the same way. They are included in a backup."
      ] }),
      /* @__PURE__ */ u$1("label", { class: "learning-tab__check", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: usageOn,
            onChange: (event) => void usageEnabledSetting.set(event.target.checked)
          }
        ),
        "Count how often each word is pressed"
      ] }),
      usageOn || summary.totalPresses > 0 ? /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1("label", { class: "learning-tab__row", children: [
          "Show the last",
          /* @__PURE__ */ u$1(
            "select",
            {
              value: period.value,
              onChange: (event) => period.value = Number(event.target.value),
              children: PERIODS.map((days) => /* @__PURE__ */ u$1("option", { value: days, children: [
                days,
                " days"
              ] }, days))
            }
          )
        ] }),
        /* @__PURE__ */ u$1("p", { class: "learning-tab__status", children: [
          summary.totalPresses,
          " press",
          summary.totalPresses === 1 ? "" : "es",
          " of ",
          summary.distinctWords,
          " ",
          "different word",
          summary.distinctWords === 1 ? "" : "s",
          "."
        ] }),
        summary.rows.length > 0 && /* @__PURE__ */ u$1("table", { class: "learning-tab__table", children: [
          /* @__PURE__ */ u$1("thead", { children: /* @__PURE__ */ u$1("tr", { children: [
            /* @__PURE__ */ u$1("th", { scope: "col", children: "Word" }),
            /* @__PURE__ */ u$1("th", { scope: "col", children: "Presses" })
          ] }) }),
          /* @__PURE__ */ u$1("tbody", { children: summary.rows.slice(0, 25).map((row) => /* @__PURE__ */ u$1("tr", { children: [
            /* @__PURE__ */ u$1("td", { children: row.word }),
            /* @__PURE__ */ u$1("td", { children: row.count })
          ] }, row.word)) })
        ] }),
        summary.totalPresses > 0 && unused.length > 0 && /* @__PURE__ */ u$1("p", { class: "learning-tab__status", children: [
          /* @__PURE__ */ u$1("strong", { children: "Not pressed in this time:" }),
          " ",
          unused.join(", "),
          "."
        ] }),
        /* @__PURE__ */ u$1("div", { class: "learning-tab__actions", children: [
          /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__button",
              disabled: Object.keys(counts).length === 0,
              onClick: () => void exportCsv(),
              children: "Save the counts as a spreadsheet…"
            }
          ),
          confirmClear.value ? /* @__PURE__ */ u$1(S$1, { children: [
            /* @__PURE__ */ u$1("span", { children: "Delete all the counts?" }),
            /* @__PURE__ */ u$1(
              "button",
              {
                type: "button",
                class: "parent-mode-screen__button",
                onClick: () => {
                  confirmClear.value = false;
                  void clearUsage();
                },
                children: "Yes, clear them"
              }
            ),
            /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmClear.value = false, children: "Keep them" })
          ] }) : /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__button",
              disabled: Object.keys(counts).length === 0,
              onClick: () => confirmClear.value = true,
              children: "Clear the counts"
            }
          )
        ] }),
        exportMessage.value && /* @__PURE__ */ u$1("p", { class: "learning-tab__status", children: exportMessage.value })
      ] }) : null
    ] })
  ] });
}
function AboutMeTab() {
  const info = aboutMeSetting.signal.value;
  function update(field, value) {
    void aboutMeSetting.set({ ...aboutMeSetting.signal.value, [field]: value });
  }
  const sections = aboutMeSections(info);
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body about-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "about-tab__hint", children: [
      "A short page for anyone new to supporting this person: a new teacher, supply cover, a relative or a respite carer. It is shown to anyone who presses ",
      /* @__PURE__ */ u$1("strong", { children: "About me" }),
      " on the child's screen, with no PIN, so only write what you are happy for them to read. It appears on the child's screen once something is written."
    ] }),
    /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      "What I like to be called",
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "about-tab__input",
          type: "text",
          value: info.preferredName,
          onInput: (event) => update("preferredName", event.target.value)
        }
      )
    ] }),
    ABOUT_ME_FIELDS.map((field) => /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
      field.title,
      /* @__PURE__ */ u$1(
        "textarea",
        {
          class: "about-tab__input about-tab__textarea",
          placeholder: field.hint,
          value: info[field.id],
          onInput: (event) => update(field.id, event.target.value)
        }
      )
    ] }, field.id)),
    /* @__PURE__ */ u$1("div", { class: "about-tab__preview-header", children: [
      /* @__PURE__ */ u$1("h2", { class: "about-tab__preview-title", children: "Preview" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          disabled: !hasAboutMe(info),
          onClick: () => printPage(),
          children: "Print this page"
        }
      )
    ] }),
    /* @__PURE__ */ u$1("div", { class: "print-page about-tab__sheet", children: [
      /* @__PURE__ */ u$1("h2", { class: "about-tab__sheet-heading", children: aboutMeHeading(info, userProfileSetting.signal.value.name) }),
      sections.length === 0 ? /* @__PURE__ */ u$1("p", { class: "about-tab__empty", children: "Nothing written yet." }) : sections.map((section) => /* @__PURE__ */ u$1("section", { class: "about-tab__sheet-section", children: [
        /* @__PURE__ */ u$1("h3", { class: "about-tab__sheet-title", children: section.title }),
        /* @__PURE__ */ u$1("p", { class: "about-tab__sheet-text", children: section.text })
      ] }, section.title))
    ] })
  ] });
}
async function enableSchoolMode() {
  await schoolModeSetting.set(true);
}
async function disableSchoolMode() {
  await schoolModeSetting.set(false);
}
async function applySchoolTopBar() {
  await setQuickAccess([...SCHOOL_QUICK_ACCESS]);
  await setActiveProfileId("school");
}
function SchoolTab() {
  const on = schoolModeSetting.signal.value;
  const pinSet = useSignal(null);
  const choosing = useSignal(null);
  const confirmForget = useSignal(false);
  const message = useSignal("");
  h$2(() => {
    void hasSchoolPin().then((exists) => pinSet.value = exists);
  }, []);
  async function turnOn() {
    if (pinSet.value) {
      await enableSchoolMode();
      message.value = `${SCHOOL_MODE_NAME} is on. Its PIN is the one you chose before.`;
      return;
    }
    choosing.value = "new";
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body school-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: [
        SCHOOL_MODE_NAME,
        " is ",
        on ? "on" : "off"
      ] }),
      /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: [
        "A separate part of the app for the teachers and staff who work with this child at school. It has its own button, next to Parent Mode on the child's screen, and its own ",
        /* @__PURE__ */ u$1("strong", { children: "School PIN" }),
        ", so school staff never need the Parent PIN and parents never need the School PIN. It holds school details, a Today page, the timetable, lesson pages, vocabulary, communication targets, session notes, an activity log, a safeguarding page and printable handover and review sheets."
      ] }),
      !on ? /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1("ul", { class: "school-tab__list", children: [
          /* @__PURE__ */ u$1("li", { children: "You will choose a four-digit School PIN now. It is not the Parent PIN." }),
          /* @__PURE__ */ u$1("li", { children: [
            "A ",
            /* @__PURE__ */ u$1("strong", { children: SCHOOL_MODE_NAME }),
            " button then appears next to Parent Mode."
          ] }),
          /* @__PURE__ */ u$1("li", { children: "Nothing on the child's screen moves. The top bar stays as it is until staff choose to change it." })
        ] }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void turnOn(), children: [
          "Turn ",
          SCHOOL_MODE_NAME,
          " on…"
        ] })
      ] }) : /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1("ul", { class: "school-tab__list", children: [
          /* @__PURE__ */ u$1("li", { children: [
            "The ",
            SCHOOL_MODE_NAME,
            " button is next to Parent Mode on every screen."
          ] }),
          /* @__PURE__ */ u$1("li", { children: "School staff open it with the School PIN. The Parent PIN does not open it." })
        ] }),
        /* @__PURE__ */ u$1("div", { class: "school-tab__buttons", children: [
          /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => choosing.value = "change", children: "Choose a new School PIN" }),
          /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__button",
              onClick: () => {
                void disableSchoolMode();
                message.value = `${SCHOOL_MODE_NAME} is off. The button is gone. Everything staff wrote, and the School PIN, are kept.`;
              },
              children: [
                "Turn ",
                SCHOOL_MODE_NAME,
                " off"
              ]
            }
          )
        ] })
      ] }),
      !on && pinSet.value && /* @__PURE__ */ u$1("div", { class: "school-tab__buttons", children: confirmForget.value ? /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1("span", { children: "Forget the School PIN? A new one will be chosen next time." }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            onClick: () => {
              void clearSchoolPin().then(() => {
                pinSet.value = false;
                confirmForget.value = false;
                message.value = "The School PIN is forgotten.";
              });
            },
            children: "Yes, forget it"
          }
        ),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmForget.value = false, children: "Keep it" })
      ] }) : /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmForget.value = true, children: "Forget the School PIN" }) }),
      /* @__PURE__ */ u$1("p", { role: "status", class: "school-tab__hint", children: message.value })
    ] }),
    choosing.value && /* @__PURE__ */ u$1("div", { class: "pin-gate-overlay", children: /* @__PURE__ */ u$1(
      PinGate,
      {
        kind: "school",
        changePin: choosing.value === "change",
        onUnlock: () => {
          const wasNew = choosing.value === "new";
          choosing.value = null;
          pinSet.value = true;
          if (wasNew) {
            void enableSchoolMode();
            message.value = `${SCHOOL_MODE_NAME} is on. The button is next to Parent Mode.`;
          } else {
            message.value = "The School PIN is changed.";
          }
        },
        onCancel: () => choosing.value = null
      }
    ) })
  ] });
}
const TIMEOUT_CHOICES = [0, 5, 10, 15, 30, 60];
function GeneralTab() {
  const openAtLogin = useSignal(null);
  const hasStartup = window.myWords.capabilities?.startup !== false;
  const changingPin = useSignal(false);
  const pinChanged = useSignal(false);
  const favourites = useSignal([]);
  async function removeOne(id) {
    await removeFavourite(id);
    favourites.value = await getFavourites();
  }
  h$2(() => {
    void getFavourites().then((items) => favourites.value = items);
    if (hasStartup) void window.myWords.startup.getOpenAtLogin().then((value) => openAtLogin.value = value);
  }, []);
  async function toggle() {
    const next = !openAtLogin.value;
    await window.myWords.startup.setOpenAtLogin(next);
    openAtLogin.value = next;
  }
  if (hasStartup && openAtLogin.value === null) return null;
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body general-tab", children: [
    hasStartup && /* @__PURE__ */ u$1(S$1, { children: [
      /* @__PURE__ */ u$1("label", { class: "general-tab__checkbox", children: [
        /* @__PURE__ */ u$1("input", { type: "checkbox", checked: openAtLogin.value ?? false, onChange: () => void toggle() }),
        "Start when the computer starts"
      ] }),
      /* @__PURE__ */ u$1("p", { class: "general-tab__hint", children: "Off by default. On, the app opens automatically after login." })
    ] }),
    /* @__PURE__ */ u$1("label", { class: "general-tab__row", children: [
      "Close ",
      modeName(),
      " after",
      /* @__PURE__ */ u$1(
        "select",
        {
          value: parentModeTimeoutSetting.signal.value,
          onChange: (event) => void parentModeTimeoutSetting.set(Number(event.target.value)),
          children: TIMEOUT_CHOICES.map((minutes) => /* @__PURE__ */ u$1("option", { value: minutes, children: minutes === 0 ? "Never" : `${minutes} minutes without use` }, minutes))
        }
      )
    ] }),
    /* @__PURE__ */ u$1("p", { class: "general-tab__hint", children: "Handy on a shared or unattended device. Any press, key or typing counts as use. The PIN is needed again to get back in." }),
    /* @__PURE__ */ u$1("section", { class: "general-tab__favourites", children: [
      /* @__PURE__ */ u$1("h2", { class: "general-tab__heading", children: "Favourites" }),
      /* @__PURE__ */ u$1("p", { class: "general-tab__hint", children: "Words saved to Favourites, by holding a button down. Take any away here." }),
      favourites.value.length === 0 ? /* @__PURE__ */ u$1("p", { class: "general-tab__hint", children: "No favourites." }) : /* @__PURE__ */ u$1("ul", { class: "general-tab__favourite-list", children: favourites.value.map((item) => /* @__PURE__ */ u$1("li", { class: "general-tab__favourite", children: [
        /* @__PURE__ */ u$1("span", { children: [
          item.image?.kind === "emoji" ? `${item.image.char} ` : "",
          item.label
        ] }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            "aria-label": `Remove ${item.label} from Favourites`,
            onClick: () => void removeOne(item.id),
            children: "Remove"
          }
        )
      ] }, item.id)) })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "general-tab__pin", children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => changingPin.value = true, children: "Change the PIN" }),
      pinChanged.value && /* @__PURE__ */ u$1("p", { class: "general-tab__hint", children: "The PIN has been changed. Keep the new recovery code safe." }),
      /* @__PURE__ */ u$1("p", { class: "general-tab__hint", children: "Choosing a new PIN also gives you a new recovery code; the old one stops working." })
    ] }),
    changingPin.value && /* @__PURE__ */ u$1("div", { class: "pin-gate-overlay", children: /* @__PURE__ */ u$1(
      PinGate,
      {
        changePin: true,
        onUnlock: () => {
          changingPin.value = false;
          pinChanged.value = true;
        },
        onCancel: () => changingPin.value = false
      }
    ) })
  ] });
}
const MEDICAL_FIELDS = [
  { id: "medicines", label: "Medicines", hint: "Names, doses and times. Anything that must never be missed.", short: true },
  { id: "equipment", label: "Equipment and aids", hint: "For example a feeding tube, pump, hearing aids, oxygen, a wheelchair.", short: true },
  { id: "eating", label: "Eating and drinking", hint: "Choking risks, a thickened drink, tube feeding, foods to avoid." },
  { id: "moving", label: "Moving about", hint: "Can walk or not, needs a wheelchair, how to lift or help safely." },
  { id: "hearingSight", label: "Hearing and sight", hint: "Hearing loss, glasses, needing to be spoken to from one side." },
  { id: "communication", label: "How I communicate", hint: "For example: I do not speak. I use this device. Please give me time and show me a picture.", short: true },
  { id: "pain", label: "How I show pain or being unwell", hint: "What to look for if I cannot say: crying, going quiet, holding a part of me." },
  { id: "emergencyPlan", label: "In an emergency", hint: "A seizure plan, an asthma plan, or what to do first.", short: true },
  { id: "doctor", label: "Doctor or surgery", hint: "Name and phone number." },
  { id: "hospital", label: "Hospital and consultant", hint: "Where I am known, and who looks after me." },
  { id: "nhsNumber", label: "NHS number", hint: "Optional. Anyone who presses Medical Info can see it.", short: true }
];
const filled = (value) => (value ?? "").trim();
function hasMedicalInfo(info) {
  return Boolean(
    info.childName.trim() || info.allergies.trim() || info.conditions.trim() || MEDICAL_FIELDS.some((field) => filled(info[field.id])) || info.contacts.some((contact) => contact.name.trim() || contact.phone.trim())
  );
}
function oneLine(text) {
  return text.replace(/\s*\n\s*/g, "; ");
}
function lines(info, only) {
  const out = [];
  out.push(`MEDICAL INFORMATION${info.childName.trim() ? ` - ${info.childName.trim()}` : ""}`);
  if (info.allergies.trim()) out.push(`Allergies: ${oneLine(info.allergies.trim())}`);
  if (info.conditions.trim()) out.push(`Conditions: ${oneLine(info.conditions.trim())}`);
  for (const field of MEDICAL_FIELDS) {
    if (only && !only(field)) continue;
    const value = filled(info[field.id]);
    if (value) out.push(`${field.label}: ${oneLine(value)}`);
  }
  for (const contact of info.contacts) {
    if (!contact.name.trim() && !contact.phone.trim()) continue;
    out.push(`Emergency contact: ${contact.name.trim()} ${contact.phone.trim()}`.trim());
  }
  return out;
}
function formatMedicalInfoText(info) {
  return lines(info).join("\n");
}
const QR_TEXT_LIMIT = 1e3;
function formatMedicalQrText(info) {
  const full = formatMedicalInfoText(info);
  if (full.length <= QR_TEXT_LIMIT) return full;
  const compact = lines(info, (field) => field.short === true).join("\n");
  return compact.length <= QR_TEXT_LIMIT ? compact : `${compact.slice(0, QR_TEXT_LIMIT - 1).trimEnd()}…`;
}
const qrcode = function(typeNumber, errorCorrectionLevel) {
  const PAD0 = 236;
  const PAD1 = 17;
  let _typeNumber = typeNumber;
  const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  let _modules = null;
  let _moduleCount = 0;
  let _dataCache = null;
  const _dataList = [];
  const _this = {};
  const makeImpl = function(test, maskPattern) {
    _moduleCount = _typeNumber * 4 + 17;
    _modules = (function(moduleCount) {
      const modules = new Array(moduleCount);
      for (let row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount);
        for (let col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null;
        }
      }
      return modules;
    })(_moduleCount);
    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);
    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }
    if (_dataCache == null) {
      _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    }
    mapData(_dataCache, maskPattern);
  };
  const setupPositionProbePattern = function(row, col) {
    for (let r2 = -1; r2 <= 7; r2 += 1) {
      if (row + r2 <= -1 || _moduleCount <= row + r2) continue;
      for (let c2 = -1; c2 <= 7; c2 += 1) {
        if (col + c2 <= -1 || _moduleCount <= col + c2) continue;
        if (0 <= r2 && r2 <= 6 && (c2 == 0 || c2 == 6) || 0 <= c2 && c2 <= 6 && (r2 == 0 || r2 == 6) || 2 <= r2 && r2 <= 4 && 2 <= c2 && c2 <= 4) {
          _modules[row + r2][col + c2] = true;
        } else {
          _modules[row + r2][col + c2] = false;
        }
      }
    }
  };
  const getBestMaskPattern = function() {
    let minLostPoint = 0;
    let pattern = 0;
    for (let i2 = 0; i2 < 8; i2 += 1) {
      makeImpl(true, i2);
      const lostPoint = QRUtil.getLostPoint(_this);
      if (i2 == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i2;
      }
    }
    return pattern;
  };
  const setupTimingPattern = function() {
    for (let r2 = 8; r2 < _moduleCount - 8; r2 += 1) {
      if (_modules[r2][6] != null) {
        continue;
      }
      _modules[r2][6] = r2 % 2 == 0;
    }
    for (let c2 = 8; c2 < _moduleCount - 8; c2 += 1) {
      if (_modules[6][c2] != null) {
        continue;
      }
      _modules[6][c2] = c2 % 2 == 0;
    }
  };
  const setupPositionAdjustPattern = function() {
    const pos = QRUtil.getPatternPosition(_typeNumber);
    for (let i2 = 0; i2 < pos.length; i2 += 1) {
      for (let j2 = 0; j2 < pos.length; j2 += 1) {
        const row = pos[i2];
        const col = pos[j2];
        if (_modules[row][col] != null) {
          continue;
        }
        for (let r2 = -2; r2 <= 2; r2 += 1) {
          for (let c2 = -2; c2 <= 2; c2 += 1) {
            if (r2 == -2 || r2 == 2 || c2 == -2 || c2 == 2 || r2 == 0 && c2 == 0) {
              _modules[row + r2][col + c2] = true;
            } else {
              _modules[row + r2][col + c2] = false;
            }
          }
        }
      }
    }
  };
  const setupTypeNumber = function(test) {
    const bits = QRUtil.getBCHTypeNumber(_typeNumber);
    for (let i2 = 0; i2 < 18; i2 += 1) {
      const mod = !test && (bits >> i2 & 1) == 1;
      _modules[Math.floor(i2 / 3)][i2 % 3 + _moduleCount - 8 - 3] = mod;
    }
    for (let i2 = 0; i2 < 18; i2 += 1) {
      const mod = !test && (bits >> i2 & 1) == 1;
      _modules[i2 % 3 + _moduleCount - 8 - 3][Math.floor(i2 / 3)] = mod;
    }
  };
  const setupTypeInfo = function(test, maskPattern) {
    const data = _errorCorrectionLevel << 3 | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);
    for (let i2 = 0; i2 < 15; i2 += 1) {
      const mod = !test && (bits >> i2 & 1) == 1;
      if (i2 < 6) {
        _modules[i2][8] = mod;
      } else if (i2 < 8) {
        _modules[i2 + 1][8] = mod;
      } else {
        _modules[_moduleCount - 15 + i2][8] = mod;
      }
    }
    for (let i2 = 0; i2 < 15; i2 += 1) {
      const mod = !test && (bits >> i2 & 1) == 1;
      if (i2 < 8) {
        _modules[8][_moduleCount - i2 - 1] = mod;
      } else if (i2 < 9) {
        _modules[8][15 - i2 - 1 + 1] = mod;
      } else {
        _modules[8][15 - i2 - 1] = mod;
      }
    }
    _modules[_moduleCount - 8][8] = !test;
  };
  const mapData = function(data, maskPattern) {
    let inc = -1;
    let row = _moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);
    for (let col = _moduleCount - 1; col > 0; col -= 2) {
      if (col == 6) col -= 1;
      while (true) {
        for (let c2 = 0; c2 < 2; c2 += 1) {
          if (_modules[row][col - c2] == null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) == 1;
            }
            const mask = maskFunc(row, col - c2);
            if (mask) {
              dark = !dark;
            }
            _modules[row][col - c2] = dark;
            bitIndex -= 1;
            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };
  const createBytes = function(buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);
    for (let r2 = 0; r2 < rsBlocks.length; r2 += 1) {
      const dcCount = rsBlocks[r2].dataCount;
      const ecCount = rsBlocks[r2].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r2] = new Array(dcCount);
      for (let i2 = 0; i2 < dcdata[r2].length; i2 += 1) {
        dcdata[r2][i2] = 255 & buffer.getBuffer()[i2 + offset];
      }
      offset += dcCount;
      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = qrPolynomial(dcdata[r2], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r2] = new Array(rsPoly.getLength() - 1);
      for (let i2 = 0; i2 < ecdata[r2].length; i2 += 1) {
        const modIndex = i2 + modPoly.getLength() - ecdata[r2].length;
        ecdata[r2][i2] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
      }
    }
    let totalCodeCount = 0;
    for (let i2 = 0; i2 < rsBlocks.length; i2 += 1) {
      totalCodeCount += rsBlocks[i2].totalCount;
    }
    const data = new Array(totalCodeCount);
    let index = 0;
    for (let i2 = 0; i2 < maxDcCount; i2 += 1) {
      for (let r2 = 0; r2 < rsBlocks.length; r2 += 1) {
        if (i2 < dcdata[r2].length) {
          data[index] = dcdata[r2][i2];
          index += 1;
        }
      }
    }
    for (let i2 = 0; i2 < maxEcCount; i2 += 1) {
      for (let r2 = 0; r2 < rsBlocks.length; r2 += 1) {
        if (i2 < ecdata[r2].length) {
          data[index] = ecdata[r2][i2];
          index += 1;
        }
      }
    }
    return data;
  };
  const createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
    const buffer = qrBitBuffer();
    for (let i2 = 0; i2 < dataList.length; i2 += 1) {
      const data = dataList[i2];
      buffer.put(data.getMode(), 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
      data.write(buffer);
    }
    let totalDataCount = 0;
    for (let i2 = 0; i2 < rsBlocks.length; i2 += 1) {
      totalDataCount += rsBlocks[i2].dataCount;
    }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }
    return createBytes(buffer, rsBlocks);
  };
  _this.addData = function(data, mode) {
    mode = mode || "Byte";
    let newData = null;
    switch (mode) {
      case "Numeric":
        newData = qrNumber(data);
        break;
      case "Alphanumeric":
        newData = qrAlphaNum(data);
        break;
      case "Byte":
        newData = qr8BitByte(data);
        break;
      case "Kanji":
        newData = qrKanji(data);
        break;
      default:
        throw "mode:" + mode;
    }
    _dataList.push(newData);
    _dataCache = null;
  };
  _this.isDark = function(row, col) {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw row + "," + col;
    }
    return _modules[row][col];
  };
  _this.getModuleCount = function() {
    return _moduleCount;
  };
  _this.make = function() {
    if (_typeNumber < 1) {
      let typeNumber2 = 1;
      for (; typeNumber2 < 40; typeNumber2++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
        const buffer = qrBitBuffer();
        for (let i2 = 0; i2 < _dataList.length; i2++) {
          const data = _dataList[i2];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
          data.write(buffer);
        }
        let totalDataCount = 0;
        for (let i2 = 0; i2 < rsBlocks.length; i2++) {
          totalDataCount += rsBlocks[i2].dataCount;
        }
        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }
      _typeNumber = typeNumber2;
    }
    makeImpl(false, getBestMaskPattern());
  };
  _this.createTableTag = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    let qrHtml = "";
    qrHtml += '<table style="';
    qrHtml += " border-width: 0px; border-style: none;";
    qrHtml += " border-collapse: collapse;";
    qrHtml += " padding: 0px; margin: " + margin + "px;";
    qrHtml += '">';
    qrHtml += "<tbody>";
    for (let r2 = 0; r2 < _this.getModuleCount(); r2 += 1) {
      qrHtml += "<tr>";
      for (let c2 = 0; c2 < _this.getModuleCount(); c2 += 1) {
        qrHtml += '<td style="';
        qrHtml += " border-width: 0px; border-style: none;";
        qrHtml += " border-collapse: collapse;";
        qrHtml += " padding: 0px; margin: 0px;";
        qrHtml += " width: " + cellSize + "px;";
        qrHtml += " height: " + cellSize + "px;";
        qrHtml += " background-color: ";
        qrHtml += _this.isDark(r2, c2) ? "#000000" : "#ffffff";
        qrHtml += ";";
        qrHtml += '"/>';
      }
      qrHtml += "</tr>";
    }
    qrHtml += "</tbody>";
    qrHtml += "</table>";
    return qrHtml;
  };
  _this.createSvgTag = function(cellSize, margin, alt, title) {
    let opts = {};
    if (typeof arguments[0] == "object") {
      opts = arguments[0];
      cellSize = opts.cellSize;
      margin = opts.margin;
      alt = opts.alt;
      title = opts.title;
    }
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    alt = typeof alt === "string" ? { text: alt } : alt || {};
    alt.text = alt.text || null;
    alt.id = alt.text ? alt.id || "qrcode-description" : null;
    title = typeof title === "string" ? { text: title } : title || {};
    title.text = title.text || null;
    title.id = title.text ? title.id || "qrcode-title" : null;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let c2, mc, r2, mr, qrSvg = "", rect;
    rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
    qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
    qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
    qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
    qrSvg += ' preserveAspectRatio="xMinYMin meet"';
    qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
    qrSvg += ">";
    qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
    qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
    qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
    qrSvg += '<path d="';
    for (r2 = 0; r2 < _this.getModuleCount(); r2 += 1) {
      mr = r2 * cellSize + margin;
      for (c2 = 0; c2 < _this.getModuleCount(); c2 += 1) {
        if (_this.isDark(r2, c2)) {
          mc = c2 * cellSize + margin;
          qrSvg += "M" + mc + "," + mr + rect;
        }
      }
    }
    qrSvg += '" stroke="transparent" fill="black"/>';
    qrSvg += "</svg>";
    return qrSvg;
  };
  _this.createDataURL = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    return createDataURL(size, size, function(x2, y2) {
      if (min <= x2 && x2 < max && min <= y2 && y2 < max) {
        const c2 = Math.floor((x2 - min) / cellSize);
        const r2 = Math.floor((y2 - min) / cellSize);
        return _this.isDark(r2, c2) ? 0 : 1;
      } else {
        return 1;
      }
    });
  };
  _this.createImgTag = function(cellSize, margin, alt) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let img = "";
    img += "<img";
    img += ' src="';
    img += _this.createDataURL(cellSize, margin);
    img += '"';
    img += ' width="';
    img += size;
    img += '"';
    img += ' height="';
    img += size;
    img += '"';
    if (alt) {
      img += ' alt="';
      img += escapeXml(alt);
      img += '"';
    }
    img += "/>";
    return img;
  };
  const escapeXml = function(s2) {
    let escaped = "";
    for (let i2 = 0; i2 < s2.length; i2 += 1) {
      const c2 = s2.charAt(i2);
      switch (c2) {
        case "<":
          escaped += "&lt;";
          break;
        case ">":
          escaped += "&gt;";
          break;
        case "&":
          escaped += "&amp;";
          break;
        case '"':
          escaped += "&quot;";
          break;
        default:
          escaped += c2;
          break;
      }
    }
    return escaped;
  };
  const _createHalfASCII = function(margin) {
    const cellSize = 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y2, x2, r1, r2, p2;
    const blocks = {
      "██": "█",
      "█ ": "▀",
      " █": "▄",
      "  ": " "
    };
    const blocksLastLineNoMargin = {
      "██": "▀",
      "█ ": "▀",
      " █": " ",
      "  ": " "
    };
    let ascii = "";
    for (y2 = 0; y2 < size; y2 += 2) {
      r1 = Math.floor((y2 - min) / cellSize);
      r2 = Math.floor((y2 + 1 - min) / cellSize);
      for (x2 = 0; x2 < size; x2 += 1) {
        p2 = "█";
        if (min <= x2 && x2 < max && min <= y2 && y2 < max && _this.isDark(r1, Math.floor((x2 - min) / cellSize))) {
          p2 = " ";
        }
        if (min <= x2 && x2 < max && min <= y2 + 1 && y2 + 1 < max && _this.isDark(r2, Math.floor((x2 - min) / cellSize))) {
          p2 += " ";
        } else {
          p2 += "█";
        }
        ascii += margin < 1 && y2 + 1 >= max ? blocksLastLineNoMargin[p2] : blocks[p2];
      }
      ascii += "\n";
    }
    if (size % 2 && margin > 0) {
      return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("▀");
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.createASCII = function(cellSize, margin) {
    cellSize = cellSize || 1;
    if (cellSize < 2) {
      return _createHalfASCII(margin);
    }
    cellSize -= 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y2, x2, r2, p2;
    const white = Array(cellSize + 1).join("██");
    const black = Array(cellSize + 1).join("  ");
    let ascii = "";
    let line = "";
    for (y2 = 0; y2 < size; y2 += 1) {
      r2 = Math.floor((y2 - min) / cellSize);
      line = "";
      for (x2 = 0; x2 < size; x2 += 1) {
        p2 = 1;
        if (min <= x2 && x2 < max && min <= y2 && y2 < max && _this.isDark(r2, Math.floor((x2 - min) / cellSize))) {
          p2 = 0;
        }
        line += p2 ? white : black;
      }
      for (r2 = 0; r2 < cellSize; r2 += 1) {
        ascii += line + "\n";
      }
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.renderTo2dContext = function(context2, cellSize) {
    cellSize = cellSize || 2;
    const length = _this.getModuleCount();
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        context2.fillStyle = _this.isDark(row, col) ? "black" : "white";
        context2.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };
  return _this;
};
qrcode.stringToBytes = function(s2) {
  const bytes = [];
  for (let i2 = 0; i2 < s2.length; i2 += 1) {
    const c2 = s2.charCodeAt(i2);
    bytes.push(c2 & 255);
  }
  return bytes;
};
qrcode.createStringToBytes = function(unicodeData, numChars) {
  const unicodeMap = (function() {
    const bin = base64DecodeInputStream(unicodeData);
    const read = function() {
      const b2 = bin.read();
      if (b2 == -1) throw "eof";
      return b2;
    };
    let count = 0;
    const unicodeMap2 = {};
    while (true) {
      const b0 = bin.read();
      if (b0 == -1) break;
      const b1 = read();
      const b2 = read();
      const b3 = read();
      const k2 = String.fromCharCode(b0 << 8 | b1);
      const v2 = b2 << 8 | b3;
      unicodeMap2[k2] = v2;
      count += 1;
    }
    if (count != numChars) {
      throw count + " != " + numChars;
    }
    return unicodeMap2;
  })();
  const unknownChar = "?".charCodeAt(0);
  return function(s2) {
    const bytes = [];
    for (let i2 = 0; i2 < s2.length; i2 += 1) {
      const c2 = s2.charCodeAt(i2);
      if (c2 < 128) {
        bytes.push(c2);
      } else {
        const b2 = unicodeMap[s2.charAt(i2)];
        if (typeof b2 == "number") {
          if ((b2 & 255) == b2) {
            bytes.push(b2);
          } else {
            bytes.push(b2 >>> 8);
            bytes.push(b2 & 255);
          }
        } else {
          bytes.push(unknownChar);
        }
      }
    }
    return bytes;
  };
};
const QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3
};
const QRErrorCorrectionLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};
const QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};
const QRUtil = (function() {
  const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
  const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
  const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
  const _this = {};
  const getBCHDigit = function(data) {
    let digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };
  _this.getBCHTypeInfo = function(data) {
    let d2 = data << 10;
    while (getBCHDigit(d2) - getBCHDigit(G15) >= 0) {
      d2 ^= G15 << getBCHDigit(d2) - getBCHDigit(G15);
    }
    return (data << 10 | d2) ^ G15_MASK;
  };
  _this.getBCHTypeNumber = function(data) {
    let d2 = data << 12;
    while (getBCHDigit(d2) - getBCHDigit(G18) >= 0) {
      d2 ^= G18 << getBCHDigit(d2) - getBCHDigit(G18);
    }
    return data << 12 | d2;
  };
  _this.getPatternPosition = function(typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
  };
  _this.getMaskFunction = function(maskPattern) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return function(i2, j2) {
          return (i2 + j2) % 2 == 0;
        };
      case QRMaskPattern.PATTERN001:
        return function(i2, j2) {
          return i2 % 2 == 0;
        };
      case QRMaskPattern.PATTERN010:
        return function(i2, j2) {
          return j2 % 3 == 0;
        };
      case QRMaskPattern.PATTERN011:
        return function(i2, j2) {
          return (i2 + j2) % 3 == 0;
        };
      case QRMaskPattern.PATTERN100:
        return function(i2, j2) {
          return (Math.floor(i2 / 2) + Math.floor(j2 / 3)) % 2 == 0;
        };
      case QRMaskPattern.PATTERN101:
        return function(i2, j2) {
          return i2 * j2 % 2 + i2 * j2 % 3 == 0;
        };
      case QRMaskPattern.PATTERN110:
        return function(i2, j2) {
          return (i2 * j2 % 2 + i2 * j2 % 3) % 2 == 0;
        };
      case QRMaskPattern.PATTERN111:
        return function(i2, j2) {
          return (i2 * j2 % 3 + (i2 + j2) % 2) % 2 == 0;
        };
      default:
        throw "bad maskPattern:" + maskPattern;
    }
  };
  _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
    let a2 = qrPolynomial([1], 0);
    for (let i2 = 0; i2 < errorCorrectLength; i2 += 1) {
      a2 = a2.multiply(qrPolynomial([1, QRMath.gexp(i2)], 0));
    }
    return a2;
  };
  _this.getLengthInBits = function(mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw "mode:" + mode;
      }
    } else {
      throw "type:" + type;
    }
  };
  _this.getLostPoint = function(qrcode2) {
    const moduleCount = qrcode2.getModuleCount();
    let lostPoint = 0;
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        let sameCount = 0;
        const dark = qrcode2.isDark(row, col);
        for (let r2 = -1; r2 <= 1; r2 += 1) {
          if (row + r2 < 0 || moduleCount <= row + r2) {
            continue;
          }
          for (let c2 = -1; c2 <= 1; c2 += 1) {
            if (col + c2 < 0 || moduleCount <= col + c2) {
              continue;
            }
            if (r2 == 0 && c2 == 0) {
              continue;
            }
            if (dark == qrcode2.isDark(row + r2, col + c2)) {
              sameCount += 1;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }
    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrcode2.isDark(row, col)) count += 1;
        if (qrcode2.isDark(row + 1, col)) count += 1;
        if (qrcode2.isDark(row, col + 1)) count += 1;
        if (qrcode2.isDark(row + 1, col + 1)) count += 1;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row, col + 1) && qrcode2.isDark(row, col + 2) && qrcode2.isDark(row, col + 3) && qrcode2.isDark(row, col + 4) && !qrcode2.isDark(row, col + 5) && qrcode2.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row + 1, col) && qrcode2.isDark(row + 2, col) && qrcode2.isDark(row + 3, col) && qrcode2.isDark(row + 4, col) && !qrcode2.isDark(row + 5, col) && qrcode2.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrcode2.isDark(row, col)) {
          darkCount += 1;
        }
      }
    }
    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
  };
  return _this;
})();
const QRMath = (function() {
  const EXP_TABLE = new Array(256);
  const LOG_TABLE = new Array(256);
  for (let i2 = 0; i2 < 8; i2 += 1) {
    EXP_TABLE[i2] = 1 << i2;
  }
  for (let i2 = 8; i2 < 256; i2 += 1) {
    EXP_TABLE[i2] = EXP_TABLE[i2 - 4] ^ EXP_TABLE[i2 - 5] ^ EXP_TABLE[i2 - 6] ^ EXP_TABLE[i2 - 8];
  }
  for (let i2 = 0; i2 < 255; i2 += 1) {
    LOG_TABLE[EXP_TABLE[i2]] = i2;
  }
  const _this = {};
  _this.glog = function(n2) {
    if (n2 < 1) {
      throw "glog(" + n2 + ")";
    }
    return LOG_TABLE[n2];
  };
  _this.gexp = function(n2) {
    while (n2 < 0) {
      n2 += 255;
    }
    while (n2 >= 256) {
      n2 -= 255;
    }
    return EXP_TABLE[n2];
  };
  return _this;
})();
const qrPolynomial = function(num, shift) {
  if (typeof num.length == "undefined") {
    throw num.length + "/" + shift;
  }
  const _num = (function() {
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    const _num2 = new Array(num.length - offset + shift);
    for (let i2 = 0; i2 < num.length - offset; i2 += 1) {
      _num2[i2] = num[i2 + offset];
    }
    return _num2;
  })();
  const _this = {};
  _this.getAt = function(index) {
    return _num[index];
  };
  _this.getLength = function() {
    return _num.length;
  };
  _this.multiply = function(e2) {
    const num2 = new Array(_this.getLength() + e2.getLength() - 1);
    for (let i2 = 0; i2 < _this.getLength(); i2 += 1) {
      for (let j2 = 0; j2 < e2.getLength(); j2 += 1) {
        num2[i2 + j2] ^= QRMath.gexp(QRMath.glog(_this.getAt(i2)) + QRMath.glog(e2.getAt(j2)));
      }
    }
    return qrPolynomial(num2, 0);
  };
  _this.mod = function(e2) {
    if (_this.getLength() - e2.getLength() < 0) {
      return _this;
    }
    const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e2.getAt(0));
    const num2 = new Array(_this.getLength());
    for (let i2 = 0; i2 < _this.getLength(); i2 += 1) {
      num2[i2] = _this.getAt(i2);
    }
    for (let i2 = 0; i2 < e2.getLength(); i2 += 1) {
      num2[i2] ^= QRMath.gexp(QRMath.glog(e2.getAt(i2)) + ratio);
    }
    return qrPolynomial(num2, 0).mod(e2);
  };
  return _this;
};
const QRRSBlock = (function() {
  const RS_BLOCK_TABLE = [
    // L
    // M
    // Q
    // H
    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],
    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];
  const qrRSBlock = function(totalCount, dataCount) {
    const _this2 = {};
    _this2.totalCount = totalCount;
    _this2.dataCount = dataCount;
    return _this2;
  };
  const _this = {};
  const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
    switch (errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return void 0;
    }
  };
  _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
    const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
    if (typeof rsBlock == "undefined") {
      throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
    }
    const length = rsBlock.length / 3;
    const list = [];
    for (let i2 = 0; i2 < length; i2 += 1) {
      const count = rsBlock[i2 * 3 + 0];
      const totalCount = rsBlock[i2 * 3 + 1];
      const dataCount = rsBlock[i2 * 3 + 2];
      for (let j2 = 0; j2 < count; j2 += 1) {
        list.push(qrRSBlock(totalCount, dataCount));
      }
    }
    return list;
  };
  return _this;
})();
const qrBitBuffer = function() {
  const _buffer = [];
  let _length = 0;
  const _this = {};
  _this.getBuffer = function() {
    return _buffer;
  };
  _this.getAt = function(index) {
    const bufIndex = Math.floor(index / 8);
    return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
  };
  _this.put = function(num, length) {
    for (let i2 = 0; i2 < length; i2 += 1) {
      _this.putBit((num >>> length - i2 - 1 & 1) == 1);
    }
  };
  _this.getLengthInBits = function() {
    return _length;
  };
  _this.putBit = function(bit) {
    const bufIndex = Math.floor(_length / 8);
    if (_buffer.length <= bufIndex) {
      _buffer.push(0);
    }
    if (bit) {
      _buffer[bufIndex] |= 128 >>> _length % 8;
    }
    _length += 1;
  };
  return _this;
};
const qrNumber = function(data) {
  const _mode = QRMode.MODE_NUMBER;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _data.length;
  };
  _this.write = function(buffer) {
    const data2 = _data;
    let i2 = 0;
    while (i2 + 2 < data2.length) {
      buffer.put(strToNum(data2.substring(i2, i2 + 3)), 10);
      i2 += 3;
    }
    if (i2 < data2.length) {
      if (data2.length - i2 == 1) {
        buffer.put(strToNum(data2.substring(i2, i2 + 1)), 4);
      } else if (data2.length - i2 == 2) {
        buffer.put(strToNum(data2.substring(i2, i2 + 2)), 7);
      }
    }
  };
  const strToNum = function(s2) {
    let num = 0;
    for (let i2 = 0; i2 < s2.length; i2 += 1) {
      num = num * 10 + chatToNum(s2.charAt(i2));
    }
    return num;
  };
  const chatToNum = function(c2) {
    if ("0" <= c2 && c2 <= "9") {
      return c2.charCodeAt(0) - "0".charCodeAt(0);
    }
    throw "illegal char :" + c2;
  };
  return _this;
};
const qrAlphaNum = function(data) {
  const _mode = QRMode.MODE_ALPHA_NUM;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _data.length;
  };
  _this.write = function(buffer) {
    const s2 = _data;
    let i2 = 0;
    while (i2 + 1 < s2.length) {
      buffer.put(
        getCode(s2.charAt(i2)) * 45 + getCode(s2.charAt(i2 + 1)),
        11
      );
      i2 += 2;
    }
    if (i2 < s2.length) {
      buffer.put(getCode(s2.charAt(i2)), 6);
    }
  };
  const getCode = function(c2) {
    if ("0" <= c2 && c2 <= "9") {
      return c2.charCodeAt(0) - "0".charCodeAt(0);
    } else if ("A" <= c2 && c2 <= "Z") {
      return c2.charCodeAt(0) - "A".charCodeAt(0) + 10;
    } else {
      switch (c2) {
        case " ":
          return 36;
        case "$":
          return 37;
        case "%":
          return 38;
        case "*":
          return 39;
        case "+":
          return 40;
        case "-":
          return 41;
        case ".":
          return 42;
        case "/":
          return 43;
        case ":":
          return 44;
        default:
          throw "illegal char :" + c2;
      }
    }
  };
  return _this;
};
const qr8BitByte = function(data) {
  const _mode = QRMode.MODE_8BIT_BYTE;
  const _bytes = qrcode.stringToBytes(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _bytes.length;
  };
  _this.write = function(buffer) {
    for (let i2 = 0; i2 < _bytes.length; i2 += 1) {
      buffer.put(_bytes[i2], 8);
    }
  };
  return _this;
};
const qrKanji = function(data) {
  const _mode = QRMode.MODE_KANJI;
  const stringToBytes = qrcode.stringToBytes;
  !(function(c2, code) {
    const test = stringToBytes(c2);
    if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
      throw "sjis not supported.";
    }
  })("友", 38726);
  const _bytes = stringToBytes(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return ~~(_bytes.length / 2);
  };
  _this.write = function(buffer) {
    const data2 = _bytes;
    let i2 = 0;
    while (i2 + 1 < data2.length) {
      let c2 = (255 & data2[i2]) << 8 | 255 & data2[i2 + 1];
      if (33088 <= c2 && c2 <= 40956) {
        c2 -= 33088;
      } else if (57408 <= c2 && c2 <= 60351) {
        c2 -= 49472;
      } else {
        throw "illegal char at " + (i2 + 1) + "/" + c2;
      }
      c2 = (c2 >>> 8 & 255) * 192 + (c2 & 255);
      buffer.put(c2, 13);
      i2 += 2;
    }
    if (i2 < data2.length) {
      throw "illegal char at " + (i2 + 1);
    }
  };
  return _this;
};
const byteArrayOutputStream = function() {
  const _bytes = [];
  const _this = {};
  _this.writeByte = function(b2) {
    _bytes.push(b2 & 255);
  };
  _this.writeShort = function(i2) {
    _this.writeByte(i2);
    _this.writeByte(i2 >>> 8);
  };
  _this.writeBytes = function(b2, off, len) {
    off = off || 0;
    len = len || b2.length;
    for (let i2 = 0; i2 < len; i2 += 1) {
      _this.writeByte(b2[i2 + off]);
    }
  };
  _this.writeString = function(s2) {
    for (let i2 = 0; i2 < s2.length; i2 += 1) {
      _this.writeByte(s2.charCodeAt(i2));
    }
  };
  _this.toByteArray = function() {
    return _bytes;
  };
  _this.toString = function() {
    let s2 = "";
    s2 += "[";
    for (let i2 = 0; i2 < _bytes.length; i2 += 1) {
      if (i2 > 0) {
        s2 += ",";
      }
      s2 += _bytes[i2];
    }
    s2 += "]";
    return s2;
  };
  return _this;
};
const base64EncodeOutputStream = function() {
  let _buffer = 0;
  let _buflen = 0;
  let _length = 0;
  let _base64 = "";
  const _this = {};
  const writeEncoded = function(b2) {
    _base64 += String.fromCharCode(encode(b2 & 63));
  };
  const encode = function(n2) {
    if (n2 < 0) {
      throw "n:" + n2;
    } else if (n2 < 26) {
      return 65 + n2;
    } else if (n2 < 52) {
      return 97 + (n2 - 26);
    } else if (n2 < 62) {
      return 48 + (n2 - 52);
    } else if (n2 == 62) {
      return 43;
    } else if (n2 == 63) {
      return 47;
    } else {
      throw "n:" + n2;
    }
  };
  _this.writeByte = function(n2) {
    _buffer = _buffer << 8 | n2 & 255;
    _buflen += 8;
    _length += 1;
    while (_buflen >= 6) {
      writeEncoded(_buffer >>> _buflen - 6);
      _buflen -= 6;
    }
  };
  _this.flush = function() {
    if (_buflen > 0) {
      writeEncoded(_buffer << 6 - _buflen);
      _buffer = 0;
      _buflen = 0;
    }
    if (_length % 3 != 0) {
      const padlen = 3 - _length % 3;
      for (let i2 = 0; i2 < padlen; i2 += 1) {
        _base64 += "=";
      }
    }
  };
  _this.toString = function() {
    return _base64;
  };
  return _this;
};
const base64DecodeInputStream = function(str) {
  const _str = str;
  let _pos = 0;
  let _buffer = 0;
  let _buflen = 0;
  const _this = {};
  _this.read = function() {
    while (_buflen < 8) {
      if (_pos >= _str.length) {
        if (_buflen == 0) {
          return -1;
        }
        throw "unexpected end of file./" + _buflen;
      }
      const c2 = _str.charAt(_pos);
      _pos += 1;
      if (c2 == "=") {
        _buflen = 0;
        return -1;
      } else if (c2.match(/^\s$/)) {
        continue;
      }
      _buffer = _buffer << 6 | decode(c2.charCodeAt(0));
      _buflen += 6;
    }
    const n2 = _buffer >>> _buflen - 8 & 255;
    _buflen -= 8;
    return n2;
  };
  const decode = function(c2) {
    if (65 <= c2 && c2 <= 90) {
      return c2 - 65;
    } else if (97 <= c2 && c2 <= 122) {
      return c2 - 97 + 26;
    } else if (48 <= c2 && c2 <= 57) {
      return c2 - 48 + 52;
    } else if (c2 == 43) {
      return 62;
    } else if (c2 == 47) {
      return 63;
    } else {
      throw "c:" + c2;
    }
  };
  return _this;
};
const gifImage = function(width, height) {
  const _width = width;
  const _height = height;
  const _data = new Array(width * height);
  const _this = {};
  _this.setPixel = function(x2, y2, pixel) {
    _data[y2 * _width + x2] = pixel;
  };
  _this.write = function(out) {
    out.writeString("GIF87a");
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(128);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(255);
    out.writeByte(255);
    out.writeByte(255);
    out.writeString(",");
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);
    const lzwMinCodeSize = 2;
    const raster = getLZWRaster(lzwMinCodeSize);
    out.writeByte(lzwMinCodeSize);
    let offset = 0;
    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }
    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0);
    out.writeString(";");
  };
  const bitOutputStream = function(out) {
    const _out = out;
    let _bitLength = 0;
    let _bitBuffer = 0;
    const _this2 = {};
    _this2.write = function(data, length) {
      if (data >>> length != 0) {
        throw "length over";
      }
      while (_bitLength + length >= 8) {
        _out.writeByte(255 & (data << _bitLength | _bitBuffer));
        length -= 8 - _bitLength;
        data >>>= 8 - _bitLength;
        _bitBuffer = 0;
        _bitLength = 0;
      }
      _bitBuffer = data << _bitLength | _bitBuffer;
      _bitLength = _bitLength + length;
    };
    _this2.flush = function() {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };
    return _this2;
  };
  const getLZWRaster = function(lzwMinCodeSize) {
    const clearCode = 1 << lzwMinCodeSize;
    const endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;
    const table = lzwTable();
    for (let i2 = 0; i2 < clearCode; i2 += 1) {
      table.add(String.fromCharCode(i2));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));
    const byteOut = byteArrayOutputStream();
    const bitOut = bitOutputStream(byteOut);
    bitOut.write(clearCode, bitLength);
    let dataIndex = 0;
    let s2 = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;
    while (dataIndex < _data.length) {
      const c2 = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;
      if (table.contains(s2 + c2)) {
        s2 = s2 + c2;
      } else {
        bitOut.write(table.indexOf(s2), bitLength);
        if (table.size() < 4095) {
          if (table.size() == 1 << bitLength) {
            bitLength += 1;
          }
          table.add(s2 + c2);
        }
        s2 = c2;
      }
    }
    bitOut.write(table.indexOf(s2), bitLength);
    bitOut.write(endCode, bitLength);
    bitOut.flush();
    return byteOut.toByteArray();
  };
  const lzwTable = function() {
    const _map = {};
    let _size = 0;
    const _this2 = {};
    _this2.add = function(key) {
      if (_this2.contains(key)) {
        throw "dup key:" + key;
      }
      _map[key] = _size;
      _size += 1;
    };
    _this2.size = function() {
      return _size;
    };
    _this2.indexOf = function(key) {
      return _map[key];
    };
    _this2.contains = function(key) {
      return typeof _map[key] != "undefined";
    };
    return _this2;
  };
  return _this;
};
const createDataURL = function(width, height, getPixel) {
  const gif = gifImage(width, height);
  for (let y2 = 0; y2 < height; y2 += 1) {
    for (let x2 = 0; x2 < width; x2 += 1) {
      gif.setPixel(x2, y2, getPixel(x2, y2));
    }
  }
  const b2 = byteArrayOutputStream();
  gif.write(b2);
  const base64 = base64EncodeOutputStream();
  const bytes = b2.toByteArray();
  for (let i2 = 0; i2 < bytes.length; i2 += 1) {
    base64.writeByte(bytes[i2]);
  }
  base64.flush();
  return "data:image/gif;base64," + base64;
};
qrcode.stringToBytes;
qrcode.stringToBytes = (text) => Array.from(new TextEncoder().encode(text));
const QUIET_ZONE_MODULES = 4;
function buildQrMatrix(text) {
  if (text.length === 0) return { ok: false, reason: "empty" };
  const code = qrcode(0, "M");
  try {
    code.addData(text);
    code.make();
  } catch {
    return { ok: false, reason: "too-long" };
  }
  const size = code.getModuleCount();
  const modules = [];
  for (let row = 0; row < size; row += 1) {
    const cells = [];
    for (let col = 0; col < size; col += 1) cells.push(code.isDark(row, col));
    modules.push(cells);
  }
  return { ok: true, size, modules };
}
function qrToSvg(matrix, label) {
  const total = matrix.size + QUIET_ZONE_MODULES * 2;
  const safeLabel = label.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  let path = "";
  for (let row = 0; row < matrix.size; row += 1) {
    for (let col = 0; col < matrix.size; col += 1) {
      if (matrix.modules[row][col]) {
        path += `M${col + QUIET_ZONE_MODULES} ${row + QUIET_ZONE_MODULES}h1v1h-1z`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" role="img" aria-label="${safeLabel}" shape-rendering="crispEdges" style="forced-color-adjust:none"><rect width="${total}" height="${total}" fill="#ffffff"/><path d="${path}" fill="#000000"/></svg>`;
}
function QRCode({ text, class: className, label = "QR code" }) {
  const matrix = buildQrMatrix(text);
  if (!matrix.ok) {
    return matrix.reason === "too-long" ? /* @__PURE__ */ u$1("p", { class: "qr-code__too-long", children: "There is too much text to fit in one QR code. Shorten what has been entered and the code will appear here." }) : null;
  }
  return /* @__PURE__ */ u$1("div", { class: `qr-code ${className ?? ""}`, dangerouslySetInnerHTML: { __html: qrToSvg(matrix, label) } });
}
function MedicalInfoTab() {
  const info = useSignal(DEFAULT_MEDICAL_INFO);
  const loaded = useSignal(false);
  h$2(() => {
    void getMedicalInfo().then((loadedInfo) => {
      info.value = loadedInfo;
      loaded.value = true;
    });
  }, []);
  async function update(next) {
    info.value = next;
    await setMedicalInfo(next);
  }
  function updateContact(index, field, value) {
    const contacts = info.value.contacts.map(
      (contact, i2) => i2 === index ? { ...contact, [field]: value } : contact
    );
    void update({ ...info.value, contacts });
  }
  function addContact() {
    void update({ ...info.value, contacts: [...info.value.contacts, { name: "", phone: "" }] });
  }
  function removeContact(index) {
    void update({ ...info.value, contacts: info.value.contacts.filter((_2, i2) => i2 !== index) });
  }
  if (!loaded.value) return null;
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body medical-info-tab", children: [
    /* @__PURE__ */ u$1("p", { class: "medical-info-tab__hint", children: "Shown to anyone who presses the Medical Info button. It is not gated behind the PIN, so a stranger who's found the child can read it straight away." }),
    /* @__PURE__ */ u$1("label", { class: "medical-info-tab__field", children: [
      "Child's name",
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "text",
          value: info.value.childName,
          onInput: (event) => void update({ ...info.value, childName: event.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ u$1("label", { class: "medical-info-tab__field", children: [
      "Allergies",
      /* @__PURE__ */ u$1(
        "textarea",
        {
          value: info.value.allergies,
          onInput: (event) => void update({ ...info.value, allergies: event.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ u$1("label", { class: "medical-info-tab__field", children: [
      "Conditions",
      /* @__PURE__ */ u$1(
        "textarea",
        {
          value: info.value.conditions,
          onInput: (event) => void update({ ...info.value, conditions: event.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ u$1("h2", { class: "medical-info-tab__heading", children: "More about my health" }),
    /* @__PURE__ */ u$1("p", { class: "medical-info-tab__hint", children: "All optional. Add what someone helping in an emergency, or a new doctor, would want to know. It is shown on the screen to anyone who presses Medical Info, so only add what you are happy for a stranger who has found the child to read." }),
    MEDICAL_FIELDS.map((field) => /* @__PURE__ */ u$1("label", { class: "medical-info-tab__field", children: [
      field.label,
      /* @__PURE__ */ u$1(
        "textarea",
        {
          placeholder: field.hint,
          value: info.value[field.id] ?? "",
          onInput: (event) => void update({ ...info.value, [field.id]: event.target.value })
        }
      )
    ] }, field.id)),
    /* @__PURE__ */ u$1("div", { class: "medical-info-tab__contacts", children: [
      /* @__PURE__ */ u$1("h2", { class: "medical-info-tab__heading", children: "Emergency contacts" }),
      info.value.contacts.map((contact, index) => /* @__PURE__ */ u$1("div", { class: "medical-info-tab__contact-row", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            placeholder: "Name",
            value: contact.name,
            onInput: (event) => updateContact(index, "name", event.target.value)
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "tel",
            placeholder: "Phone",
            value: contact.phone,
            onInput: (event) => updateContact(index, "phone", event.target.value)
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "medical-info-tab__remove",
            onClick: () => removeContact(index),
            "aria-label": `Remove ${contact.name || "this contact"}`,
            children: "Remove"
          }
        )
      ] }, index)),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: addContact, children: "Add a contact" })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "medical-info-tab__preview", children: [
      /* @__PURE__ */ u$1("h2", { class: "medical-info-tab__heading", children: "Preview: what a scan or press shows" }),
      hasMedicalInfo(info.value) ? /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1(QRCode, { class: "medical-info-tab__qr", text: formatMedicalQrText(info.value) }),
        formatMedicalInfoText(info.value).length > QR_TEXT_LIMIT && /* @__PURE__ */ u$1("p", { class: "medical-info-tab__hint", children: "This is a long record, so the code holds the most important parts and the screen shows all of it." }),
        /* @__PURE__ */ u$1("pre", { class: "medical-info-tab__text", children: formatMedicalInfoText(info.value) })
      ] }) : /* @__PURE__ */ u$1("p", { class: "medical-info-tab__empty", children: "Nothing entered yet. The Medical Info button will say so." })
    ] })
  ] });
}
function newActivityId$1() {
  return `routine-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function WeeklyRoutineEditor() {
  const day = useSignal("mon");
  const newName = useSignal("");
  const routine = weeklyRoutineSetting.signal.value;
  const activities = routine[day.value];
  const save = (next) => void weeklyRoutineSetting.set(next);
  function add(event) {
    event.preventDefault();
    const name = newName.value.trim();
    if (!name) return;
    newName.value = "";
    save(addRoutineActivity(weeklyRoutineSetting.signal.value, day.value, { id: newActivityId$1(), name }));
  }
  const edit = (activity, updates) => save(editRoutineActivity(weeklyRoutineSetting.signal.value, day.value, activity.id, updates));
  return /* @__PURE__ */ u$1("section", { class: "weekly-routine", children: [
    /* @__PURE__ */ u$1("h2", { class: "weekly-routine__heading", children: "Weekly routine" }),
    /* @__PURE__ */ u$1("p", { class: "weekly-routine__hint", children: "Enter a timetable once. Any day that has no plan of its own uses it, so the child's My Day is already filled in each week. Days you have planned yourself are left alone." }),
    /* @__PURE__ */ u$1("div", { class: "weekly-routine__days", role: "group", "aria-label": "Day of the week", children: WEEKDAYS.map((value) => /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "weekly-routine__day",
        "aria-pressed": day.value === value,
        onClick: () => day.value = value,
        children: WEEKDAY_LABELS[value]
      },
      value
    )) }),
    /* @__PURE__ */ u$1("ul", { class: "weekly-routine__list", children: [
      activities.length === 0 && /* @__PURE__ */ u$1("li", { class: "weekly-routine__empty", children: [
        "Nothing planned on ",
        WEEKDAY_LABELS[day.value],
        "s yet."
      ] }),
      activities.map((activity, index) => /* @__PURE__ */ u$1("li", { class: "weekly-routine__activity", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            class: "weekly-routine__input",
            type: "text",
            "aria-label": "Activity name",
            value: activity.name,
            onInput: (event) => edit(activity, { name: event.target.value })
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            class: "parent-mode-screen__emoji-input",
            type: "text",
            "aria-label": "Emoji",
            placeholder: "🙂",
            value: activity.image?.kind === "emoji" ? activity.image.char : "",
            onInput: (event) => edit(activity, { image: { kind: "emoji", char: event.target.value } })
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "time",
            "aria-label": "Time",
            value: activity.time ?? "",
            onInput: (event) => edit(activity, { time: event.target.value })
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            class: "weekly-routine__input",
            type: "text",
            placeholder: "Location",
            "aria-label": "Location",
            value: activity.location ?? "",
            onInput: (event) => edit(activity, { location: event.target.value })
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            class: "weekly-routine__input",
            type: "text",
            placeholder: "Who with",
            "aria-label": "Who with",
            value: activity.person ?? "",
            onInput: (event) => edit(activity, { person: event.target.value })
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__move-button",
            "aria-label": `Move ${activity.name} earlier`,
            disabled: index === 0,
            onClick: () => save(moveRoutineActivity(weeklyRoutineSetting.signal.value, day.value, activity.id, "up")),
            children: "▲"
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__move-button",
            "aria-label": `Move ${activity.name} later`,
            disabled: index === activities.length - 1,
            onClick: () => save(moveRoutineActivity(weeklyRoutineSetting.signal.value, day.value, activity.id, "down")),
            children: "▼"
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "day-builder-tab__remove",
            "aria-label": `Remove ${activity.name} from ${WEEKDAY_LABELS[day.value]}`,
            onClick: () => save(removeRoutineActivity(weeklyRoutineSetting.signal.value, day.value, activity.id)),
            children: "Remove"
          }
        )
      ] }, activity.id))
    ] }),
    /* @__PURE__ */ u$1("form", { class: "weekly-routine__add-form", onSubmit: add, children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "weekly-routine__input",
          type: "text",
          placeholder: `New activity on ${WEEKDAY_LABELS[day.value]}`,
          "aria-label": "New routine activity",
          value: newName.value,
          onInput: (event) => newName.value = event.target.value
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: !newName.value.trim(), children: [
        "Add to ",
        WEEKDAY_LABELS[day.value]
      ] }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          disabled: activities.length === 0,
          onClick: () => save(copyToWeekdays(weeklyRoutineSetting.signal.value, day.value)),
          children: [
            "Copy ",
            WEEKDAY_LABELS[day.value],
            " to every weekday"
          ]
        }
      )
    ] })
  ] });
}
function CardEditor({ heading, card, onChange }) {
  async function handlePhoto(blob) {
    onChange({ ...card, photoBlobId: await savePhoto(blob) });
  }
  return /* @__PURE__ */ u$1("fieldset", { class: "first-then-editor__card", children: [
    /* @__PURE__ */ u$1("legend", { children: heading }),
    /* @__PURE__ */ u$1("label", { class: "first-then-editor__field", children: [
      "What it is",
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "first-then-editor__input",
          type: "text",
          value: card.label,
          onInput: (event) => onChange({ ...card, label: event.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ u$1("label", { class: "first-then-editor__field", children: [
      "Emoji",
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "parent-mode-screen__emoji-input",
          type: "text",
          "aria-label": `${heading} emoji`,
          value: card.emoji,
          onInput: (event) => onChange({ ...card, emoji: event.target.value })
        }
      )
    ] }),
    card.photoBlobId ? /* @__PURE__ */ u$1("div", { class: "first-then-editor__photo", children: [
      /* @__PURE__ */ u$1(PhotoThumbnail, { class: "first-then-editor__thumb", blobId: card.photoBlobId, alt: "" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          onClick: () => onChange({ label: card.label, emoji: card.emoji }),
          children: "Use the emoji instead"
        }
      )
    ] }) : null,
    /* @__PURE__ */ u$1(PhotoCapture, { onCapture: (blob) => void handlePhoto(blob) })
  ] });
}
function FirstThenEditor() {
  const data = firstThenSetting.signal.value;
  const message = useSignal(null);
  const save = (change) => void firstThenSetting.set({ ...firstThenSetting.signal.value, ...change });
  return /* @__PURE__ */ u$1("section", { class: "first-then-editor", children: [
    /* @__PURE__ */ u$1("h2", { class: "first-then-editor__heading", children: "First and Then" }),
    /* @__PURE__ */ u$1("p", { class: "first-then-editor__hint", children: [
      "A two-step picture support: ",
      /* @__PURE__ */ u$1("strong", { children: "First" }),
      " something, ",
      /* @__PURE__ */ u$1("strong", { children: "then" }),
      " something else. To show it, put ",
      /* @__PURE__ */ u$1("strong", { children: "First / Then" }),
      ' on the top bar (Quick Access). The child can press each card to hear it, and press "First is finished" to move on.'
    ] }),
    /* @__PURE__ */ u$1("div", { class: "first-then-editor__cards", children: [
      /* @__PURE__ */ u$1(CardEditor, { heading: "First", card: data.first, onChange: (first) => save({ first, firstDone: false }) }),
      /* @__PURE__ */ u$1(CardEditor, { heading: "Then", card: data.then, onChange: (then) => save({ then }) })
    ] }),
    /* @__PURE__ */ u$1(
      "button",
      {
        type: "button",
        class: "parent-mode-screen__button",
        disabled: !data.firstDone,
        onClick: () => {
          save({ firstDone: false });
          message.value = "Ready to start again.";
        },
        children: "Start again"
      }
    ),
    message.value && /* @__PURE__ */ u$1("span", { class: "first-then-editor__hint", children: [
      " ",
      message.value
    ] })
  ] });
}
const DEFAULT_SETTINGS = { view: "today", countdownEnabled: false };
function newActivityId() {
  return `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function DayBuilderTab() {
  const dateString = useSignal(getDateString(/* @__PURE__ */ new Date()));
  const plan = useSignal({ date: dateString.value, activities: [] });
  const settings = useSignal(DEFAULT_SETTINGS);
  const newName = useSignal("");
  const usesRoutine = useSignal(false);
  const latestLoad = A(0);
  async function load() {
    const thisLoad = ++latestLoad.current;
    const [{ plan: loadedPlan, fromRoutine }, loadedSettings] = await Promise.all([
      getEffectiveDayPlan(dateString.value),
      getDaySettings()
    ]);
    if (thisLoad !== latestLoad.current) return;
    plan.value = loadedPlan;
    usesRoutine.value = fromRoutine;
    settings.value = loadedSettings;
  }
  const routine = weeklyRoutineSetting.signal.value;
  h$2(() => {
    if (usesRoutine.value && routine !== void 0) void load();
  }, [routine]);
  h$2(() => {
    void load();
  }, [dateString.value]);
  async function persist(activities) {
    const next = { ...plan.value, activities };
    latestLoad.current++;
    plan.value = next;
    usesRoutine.value = false;
    await saveDayPlan(next);
  }
  function handleAdd(event) {
    event.preventDefault();
    if (!newName.value.trim()) return;
    const activity = { id: newActivityId(), name: newName.value.trim() };
    void persist(addActivity(plan.value.activities, activity));
    newName.value = "";
  }
  async function handleViewChange(view) {
    const next = { ...settings.value, view };
    settings.value = next;
    await setDaySettings(next);
  }
  async function handleCountdownToggle() {
    const next = { ...settings.value, countdownEnabled: !settings.value.countdownEnabled };
    settings.value = next;
    await setDaySettings(next);
  }
  async function setPhoto(id, blob) {
    const blobId = await savePhoto(blob);
    void persist(updateActivity(plan.value.activities, id, { image: { kind: "photo", blobId } }));
  }
  function updateField(id, field, value) {
    void persist(updateActivity(plan.value.activities, id, { [field]: value }));
  }
  return /* @__PURE__ */ u$1("div", { class: "day-builder-tab", children: [
    /* @__PURE__ */ u$1("div", { class: "day-builder-tab__controls", children: [
      /* @__PURE__ */ u$1("label", { children: [
        "Date",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "date",
            value: dateString.value,
            onInput: (event) => dateString.value = event.target.value
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { children: [
        "View",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: settings.value.view,
            onChange: (event) => void handleViewChange(event.target.value),
            children: [
              /* @__PURE__ */ u$1("option", { value: "today", children: "Today" }),
              /* @__PURE__ */ u$1("option", { value: "nowNextLater", children: "Now / Next / Later" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "day-builder-tab__countdown-toggle", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: settings.value.countdownEnabled,
            onChange: () => void handleCountdownToggle()
          }
        ),
        "Countdown warnings"
      ] })
    ] }),
    usesRoutine.value && plan.value.activities.length > 0 && /* @__PURE__ */ u$1("p", { class: "day-builder-tab__routine-note", children: "This day uses the weekly routine. Change anything here and it becomes this day's own plan." }),
    /* @__PURE__ */ u$1("ul", { class: "day-builder-tab__list", children: plan.value.activities.map((activity, index) => /* @__PURE__ */ u$1("li", { class: "day-builder-tab__activity", children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "parent-mode-screen__label-input",
          type: "text",
          value: activity.name,
          onInput: (event) => updateField(activity.id, "name", event.target.value)
        }
      ),
      /* @__PURE__ */ u$1("details", { class: "day-builder-tab__picture", children: [
        /* @__PURE__ */ u$1("summary", { children: activity.image?.kind === "emoji" ? activity.image.char : activity.image?.kind === "photo" ? "Photo" : "Picture" }),
        /* @__PURE__ */ u$1("div", { class: "day-builder-tab__picture-body", children: [
          /* @__PURE__ */ u$1("label", { children: [
            "Emoji",
            /* @__PURE__ */ u$1(
              "input",
              {
                class: "parent-mode-screen__emoji-input",
                type: "text",
                "aria-label": `Emoji for ${activity.name}`,
                value: activity.image?.kind === "emoji" ? activity.image.char : "",
                onInput: (event) => updateField(activity.id, "image", {
                  kind: "emoji",
                  char: event.target.value
                })
              }
            )
          ] }),
          activity.image?.kind === "photo" && /* @__PURE__ */ u$1(PhotoThumbnail, { class: "day-builder-tab__thumb", blobId: activity.image.blobId, alt: "" }),
          /* @__PURE__ */ u$1(PhotoCapture, { onCapture: (blob) => void setPhoto(activity.id, blob) }),
          activity.image && /* @__PURE__ */ u$1(
            "button",
            {
              type: "button",
              class: "parent-mode-screen__button",
              onClick: () => updateField(activity.id, "image", void 0),
              children: "Take the picture off"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "time",
          value: activity.time ?? "",
          onInput: (event) => updateField(activity.id, "time", event.target.value)
        }
      ),
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "text",
          placeholder: "Location",
          value: activity.location ?? "",
          onInput: (event) => updateField(activity.id, "location", event.target.value)
        }
      ),
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "text",
          placeholder: "Who with",
          value: activity.person ?? "",
          onInput: (event) => updateField(activity.id, "person", event.target.value)
        }
      ),
      /* @__PURE__ */ u$1(
        "select",
        {
          value: activity.countdownMinutes ?? "",
          onChange: (event) => {
            const value = event.target.value;
            updateField(activity.id, "countdownMinutes", value ? Number(value) : void 0);
          },
          children: [
            /* @__PURE__ */ u$1("option", { value: "", children: "No countdown" }),
            /* @__PURE__ */ u$1("option", { value: "5", children: "5 min" }),
            /* @__PURE__ */ u$1("option", { value: "30", children: "30 min" }),
            /* @__PURE__ */ u$1("option", { value: "60", children: "1 hour" })
          ]
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__move-button",
          onClick: () => void persist(moveActivity(plan.value.activities, activity.id, "up")),
          "aria-label": `Move ${activity.name} earlier`,
          disabled: index === 0,
          children: "▲"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__move-button",
          onClick: () => void persist(moveActivity(plan.value.activities, activity.id, "down")),
          "aria-label": `Move ${activity.name} later`,
          disabled: index === plan.value.activities.length - 1,
          children: "▼"
        }
      ),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "day-builder-tab__remove",
          onClick: () => void persist(removeActivity(plan.value.activities, activity.id)),
          "aria-label": `Remove ${activity.name}`,
          children: "Remove"
        }
      )
    ] }, activity.id)) }),
    /* @__PURE__ */ u$1("form", { class: "day-builder-tab__add-form", onSubmit: handleAdd, children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          class: "parent-mode-screen__label-input",
          type: "text",
          placeholder: "New activity name",
          value: newName.value,
          onInput: (event) => newName.value = event.target.value
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", children: "Add activity" })
    ] }),
    /* @__PURE__ */ u$1(WeeklyRoutineEditor, {}),
    /* @__PURE__ */ u$1(FirstThenEditor, {})
  ] });
}
const FORMAT = "my-words-backup";
const ENVELOPE_VERSION = 1;
const PBKDF2_ITERATIONS = 21e4;
function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i2 = 0; i2 < binary.length; i2 += 1) bytes[i2] = binary.charCodeAt(i2);
  return bytes;
}
async function deriveKey(passphrase, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
async function encodeBackup(payload, passphrase) {
  if (!passphrase) {
    const envelope2 = { format: FORMAT, version: ENVELOPE_VERSION, encrypted: false, payload };
    return JSON.stringify(envelope2);
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  const envelope = {
    format: FORMAT,
    version: ENVELOPE_VERSION,
    encrypted: true,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext))
  };
  return JSON.stringify(envelope);
}
class BackupFormatError extends Error {
}
class BackupPassphraseError extends Error {
}
function backupNeedsPassphrase(fileText) {
  const envelope = parseEnvelope(fileText);
  return envelope.encrypted;
}
function parseEnvelope(fileText) {
  let parsed2;
  try {
    parsed2 = JSON.parse(fileText);
  } catch {
    throw new BackupFormatError("This file is not a Rugged Speech backup.");
  }
  if (typeof parsed2 !== "object" || parsed2 === null || parsed2.format !== FORMAT) {
    throw new BackupFormatError("This file is not a Rugged Speech backup.");
  }
  return parsed2;
}
async function decodeBackup(fileText, passphrase) {
  const envelope = parseEnvelope(fileText);
  if (!envelope.encrypted) {
    return envelope.payload;
  }
  if (!passphrase) {
    throw new BackupPassphraseError("This backup is protected by a passphrase.");
  }
  const salt = base64ToBytes(envelope.salt);
  const iv = base64ToBytes(envelope.iv);
  const key = await deriveKey(passphrase, salt);
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      base64ToBytes(envelope.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch {
    throw new BackupPassphraseError("That passphrase is not correct for this backup.");
  }
}
function BackupTab() {
  const encryptSave = useSignal(false);
  const savePassphrase = useSignal("");
  const saveConfirmPassphrase = useSignal("");
  const saveStatus = useSignal(null);
  const saveError = useSignal(null);
  const saving = useSignal(false);
  h$2(() => {
    void lastBackupSetting.load();
  }, []);
  const restoreStep = useSignal("idle");
  const restoreFileData = useSignal(null);
  const restorePassphrase = useSignal("");
  const restoreError = useSignal(null);
  const restoring = useSignal(false);
  async function handleSave() {
    saveError.value = null;
    saveStatus.value = null;
    if (encryptSave.value) {
      if (!savePassphrase.value) {
        saveError.value = "Enter a passphrase, or turn off passphrase protection.";
        return;
      }
      if (savePassphrase.value !== saveConfirmPassphrase.value) {
        saveError.value = "Those two passphrases do not match.";
        return;
      }
    }
    saving.value = true;
    try {
      const payload = await exportBackupPayload();
      const encoded = await encodeBackup(payload, encryptSave.value ? savePassphrase.value : void 0);
      const result = await window.myWords.backup.save(encoded);
      saveStatus.value = result.ok ? "Backup saved." : null;
      if (result.ok) {
        await lastBackupSetting.set(Date.now());
        savePassphrase.value = "";
        saveConfirmPassphrase.value = "";
      }
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : String(err);
    } finally {
      saving.value = false;
    }
  }
  async function handlePickRestoreFile() {
    restoreError.value = null;
    restoreStep.value = "idle";
    const result = await window.myWords.backup.restore();
    if (!result.ok) return;
    let needsPassphrase;
    try {
      needsPassphrase = backupNeedsPassphrase(result.data);
    } catch (err) {
      restoreError.value = err instanceof BackupFormatError ? err.message : "Could not read that file.";
      return;
    }
    restoreFileData.value = result.data;
    restoreStep.value = needsPassphrase ? "needs-passphrase" : "confirming";
  }
  function handleUnlockRestore() {
    restoreError.value = null;
    restoreStep.value = "confirming";
  }
  async function handleConfirmRestore() {
    if (!restoreFileData.value) return;
    restoreError.value = null;
    restoring.value = true;
    try {
      const payload = await decodeBackup(restoreFileData.value, restorePassphrase.value || void 0);
      await importBackupPayload(payload);
      restoreStep.value = "done";
      restoreFileData.value = null;
      restorePassphrase.value = "";
    } catch (err) {
      if (err instanceof BackupPassphraseError) {
        restoreError.value = err.message;
        restoreStep.value = "needs-passphrase";
      } else {
        restoreError.value = err instanceof Error ? err.message : String(err);
      }
    } finally {
      restoring.value = false;
    }
  }
  function handleCancelRestore() {
    restoreStep.value = "idle";
    restoreFileData.value = null;
    restorePassphrase.value = "";
    restoreError.value = null;
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body backup-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "backup-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "backup-tab__heading", children: "Save a backup" }),
      /* @__PURE__ */ u$1("p", { class: "backup-tab__last", children: lastBackupSetting.signal.value === null ? `Last backup: never on this ${deviceNoun()}.` : `Last backup: ${new Date(lastBackupSetting.signal.value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })}.` }),
      /* @__PURE__ */ u$1("p", { class: "backup-tab__hint", children: "One file with everything: boards, photos, people, places, My Day. Optionally protect it with a passphrase, since it can contain a child's photographs and contact details." }),
      /* @__PURE__ */ u$1("label", { class: "backup-tab__checkbox", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: encryptSave.value,
            onChange: (event) => encryptSave.value = event.target.checked
          }
        ),
        "Protect with a passphrase"
      ] }),
      encryptSave.value && /* @__PURE__ */ u$1("div", { class: "backup-tab__passphrase-fields", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "password",
            placeholder: "Passphrase",
            value: savePassphrase.value,
            onInput: (event) => savePassphrase.value = event.target.value,
            "aria-label": "Passphrase"
          }
        ),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "password",
            placeholder: "Confirm passphrase",
            value: saveConfirmPassphrase.value,
            onInput: (event) => saveConfirmPassphrase.value = event.target.value,
            "aria-label": "Confirm passphrase"
          }
        )
      ] }),
      saveError.value && /* @__PURE__ */ u$1("p", { class: "parent-mode-screen__error", children: saveError.value }),
      saveStatus.value && /* @__PURE__ */ u$1("p", { class: "backup-tab__status", children: saveStatus.value }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", disabled: saving.value, onClick: () => void handleSave(), children: saving.value ? "Saving…" : "Save backup…" })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "backup-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "backup-tab__heading", children: "Restore from a backup" }),
      /* @__PURE__ */ u$1("p", { class: "backup-tab__hint", children: "This replaces everything currently on this device with the contents of the backup file. It cannot be undone." }),
      restoreStep.value === "idle" && /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void handlePickRestoreFile(), children: "Choose backup file…" }),
      restoreStep.value === "needs-passphrase" && /* @__PURE__ */ u$1("div", { class: "backup-tab__passphrase-fields", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "password",
            placeholder: "Passphrase",
            value: restorePassphrase.value,
            onInput: (event) => restorePassphrase.value = event.target.value,
            "aria-label": "Backup passphrase"
          }
        ),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: handleUnlockRestore, children: "Continue" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: handleCancelRestore, children: "Cancel" })
      ] }),
      restoreStep.value === "confirming" && /* @__PURE__ */ u$1("div", { class: "backup-tab__confirm", children: [
        /* @__PURE__ */ u$1("p", { class: "backup-tab__warning", children: "Replace everything on this device with this backup? This cannot be undone." }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            disabled: restoring.value,
            onClick: () => void handleConfirmRestore(),
            children: restoring.value ? "Restoring…" : "Yes, replace everything"
          }
        ),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: handleCancelRestore, children: "Cancel" })
      ] }),
      restoreStep.value === "done" && /* @__PURE__ */ u$1("p", { class: "backup-tab__status", children: "Backup restored." }),
      restoreError.value && /* @__PURE__ */ u$1("p", { class: "parent-mode-screen__error", children: restoreError.value })
    ] })
  ] });
}
const CARD_SIZES_MM = [20, 30, 50, 70];
function PrintTab() {
  const boards = useSignal([]);
  const selectedBoardId = useSignal(null);
  const cardSize = useSignal(50);
  const mode = useSignal("cards");
  const scheduleDate = useSignal(getDateString(/* @__PURE__ */ new Date()));
  const scheduleActivities = useSignal([]);
  h$2(() => {
    if (mode.value !== "schedule") return;
    void getEffectiveDayPlan(scheduleDate.value).then(({ plan }) => {
      scheduleActivities.value = plan.activities;
    });
  }, [mode.value, scheduleDate.value]);
  h$2(() => {
    void getAllBoards().then((loaded) => {
      const sorted = [...loaded].sort(
        (a2, b2) => a2.id === ROOT_BOARD_ID ? -1 : b2.id === ROOT_BOARD_ID ? 1 : a2.name.localeCompare(b2.name)
      );
      boards.value = sorted;
      selectedBoardId.value = sorted[0]?.id ?? null;
    });
  }, []);
  const selectedBoard = boards.value.find((board2) => board2.id === selectedBoardId.value) ?? null;
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body print-tab", children: [
    /* @__PURE__ */ u$1("div", { class: "print-tab__controls", children: [
      /* @__PURE__ */ u$1("label", { children: [
        "What to print",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: mode.value,
            onChange: (event) => mode.value = event.target.value,
            children: [
              /* @__PURE__ */ u$1("option", { value: "cards", children: "Board cards" }),
              /* @__PURE__ */ u$1("option", { value: "strip", children: "Sentence strip template" }),
              /* @__PURE__ */ u$1("option", { value: "schedule", children: "Visual schedule for a day" })
            ]
          }
        )
      ] }),
      mode.value === "schedule" && /* @__PURE__ */ u$1("label", { children: [
        "Day",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "date",
            value: scheduleDate.value,
            onInput: (event) => scheduleDate.value = event.target.value
          }
        )
      ] }),
      mode.value === "cards" && /* @__PURE__ */ u$1("label", { children: [
        "Board",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: selectedBoardId.value ?? "",
            onChange: (event) => selectedBoardId.value = event.target.value,
            children: boards.value.map((board2) => /* @__PURE__ */ u$1("option", { value: board2.id, children: board2.name }, board2.id))
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { children: [
        "Card size",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: cardSize.value,
            onChange: (event) => cardSize.value = Number(event.target.value),
            children: CARD_SIZES_MM.map((size) => /* @__PURE__ */ u$1("option", { value: size, children: [
              size,
              "mm"
            ] }, size))
          }
        )
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button print-tab__print-button", onClick: () => printPage(), children: "Print" })
    ] }),
    /* @__PURE__ */ u$1("p", { class: "print-tab__hint", children: "Printing opens the printer dialog, which shows its own preview before anything is sent to the printer." }),
    /* @__PURE__ */ u$1("div", { class: "print-page", children: [
      mode.value === "cards" && selectedBoard && /* @__PURE__ */ u$1("div", { class: "print-card-grid", children: selectedBoard.buttons.filter((button) => isItemShown(button, wordStageSetting.signal.value)).map((button) => /* @__PURE__ */ u$1(
        "div",
        {
          class: "print-card",
          style: { width: `${cardSize.value}mm`, height: `${cardSize.value}mm` },
          children: [
            button.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "print-card__emoji", char: button.image.char }),
            button.image?.kind === "photo" && /* @__PURE__ */ u$1(PhotoThumbnail, { class: "print-card__photo", blobId: button.image.blobId, alt: "" }),
            /* @__PURE__ */ u$1("span", { class: "print-card__label", children: button.label })
          ]
        },
        button.id
      )) }),
      mode.value === "schedule" && /* @__PURE__ */ u$1("div", { class: "print-schedule", children: [
        scheduleActivities.value.length === 0 && /* @__PURE__ */ u$1("p", { class: "print-schedule__empty", children: "Nothing is planned for this day." }),
        scheduleActivities.value.map((activity, index) => /* @__PURE__ */ u$1(
          "div",
          {
            class: "print-card print-schedule__card",
            style: { width: `${cardSize.value}mm`, minHeight: `${cardSize.value}mm` },
            children: [
              /* @__PURE__ */ u$1("span", { class: "print-schedule__step", children: index + 1 }),
              activity.image?.kind === "emoji" && /* @__PURE__ */ u$1(Pic, { class: "print-card__emoji", char: activity.image.char }),
              activity.image?.kind === "photo" && /* @__PURE__ */ u$1(PhotoThumbnail, { class: "print-card__photo", blobId: activity.image.blobId, alt: "" }),
              /* @__PURE__ */ u$1("span", { class: "print-card__label", children: activity.name }),
              activity.time && /* @__PURE__ */ u$1("span", { class: "print-schedule__time", children: formatTime(activity.time) })
            ]
          },
          activity.id
        ))
      ] }),
      mode.value === "strip" && /* @__PURE__ */ u$1("div", { class: "print-strip", children: /* @__PURE__ */ u$1("div", { class: "print-strip__boxes", children: Array.from({ length: 6 }).map((_2, index) => /* @__PURE__ */ u$1(
        "div",
        {
          class: "print-card print-strip__box",
          style: { width: `${cardSize.value}mm`, height: `${cardSize.value}mm` }
        },
        index
      )) }) })
    ] })
  ] });
}
const GROUPS$1 = [
  { title: "Start here", tabs: [{ id: "guide", label: "User guide" }] },
  {
    title: "About the child",
    tabs: [
      { id: "user", label: "User" },
      { id: "aboutme", label: "About me" },
      { id: "medical", label: "Medical" },
      { id: "body", label: "My body" }
    ]
  },
  {
    title: "Words and pages",
    tabs: [
      { id: "boards", label: "Boards" },
      { id: "people", label: "People" },
      { id: "places", label: "Places" },
      { id: "mypages", label: "My Pages" },
      { id: "quickaccess", label: "Quick Access" },
      { id: "profiles", label: "Profiles" }
    ]
  },
  {
    title: "Day and fun",
    tabs: [
      { id: "myday", label: "My Day" },
      { id: "music", label: "Music" },
      { id: "jokes", label: "Jokes" },
      { id: "seasons", label: "Seasons" }
    ]
  },
  {
    title: "How it looks and works",
    tabs: [
      { id: "access", label: "Access" },
      { id: "look", label: "Look" }
    ]
  },
  {
    title: "Learning and school",
    tabs: [
      { id: "learning", label: "Learning" },
      { id: "targets", label: "Targets" },
      { id: "notes", label: "Notes" },
      { id: "activity", label: "Activity" },
      { id: "reports", label: "Reports" },
      { id: "school", label: "School" }
    ]
  },
  {
    title: "Safety and data",
    tabs: [
      { id: "lost", label: "Lost mode" },
      { id: "backup", label: "Backup" },
      { id: "print", label: "Print" },
      { id: "general", label: "General" }
    ]
  }
];
const BACKUP_REMINDER_DAYS = 30;
const IDLE_CHECK_MS$1 = 5e3;
function ParentModeScreen({ onExit }) {
  const tab = useSignal("boards");
  const fullscreen = useSignal(false);
  const needsBackup = useSignal(false);
  h$2(() => {
    void window.myWords.parentMode.isFullscreen().then((value) => {
      fullscreen.value = value;
    });
  }, []);
  h$2(() => {
    void Promise.all([lastBackupSetting.get(), hasContentWorthBackingUp()]).then(([last, hasContent]) => {
      const stale = last === null || Date.now() - last > BACKUP_REMINDER_DAYS * 24 * 60 * 60 * 1e3;
      needsBackup.value = hasContent && stale;
    });
  }, []);
  const timeoutMinutes = parentModeTimeoutSetting.signal.value;
  h$2(() => {
    if (timeoutMinutes <= 0) return;
    let lastActivity = Date.now();
    const noteActivity = () => {
      lastActivity = Date.now();
    };
    const events = ["pointerdown", "keydown", "input", "wheel"];
    for (const name2 of events) document.addEventListener(name2, noteActivity, true);
    const timer = setInterval(() => {
      if (Date.now() - lastActivity >= timeoutMinutes * 6e4) {
        clearInterval(timer);
        onExit();
      }
    }, IDLE_CHECK_MS$1);
    return () => {
      for (const name2 of events) document.removeEventListener(name2, noteActivity, true);
      clearInterval(timer);
    };
  }, [timeoutMinutes]);
  async function toggleFullscreen() {
    const next = !fullscreen.value;
    await window.myWords.parentMode.setFullscreen(next);
    fullscreen.value = next;
  }
  const name = modeName();
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen", children: [
    /* @__PURE__ */ u$1("header", { class: "parent-mode-screen__header", children: [
      /* @__PURE__ */ u$1("h1", { class: "parent-mode-screen__title", children: name }),
      /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__header-actions", children: [
        window.myWords.capabilities?.fullscreen === false ? null : /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => void toggleFullscreen(), children: [
          "Fullscreen: ",
          fullscreen.value ? "On" : "Off"
        ] }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button parent-mode-screen__exit", onClick: onExit, children: [
          "Exit ",
          name
        ] })
      ] })
    ] }),
    needsBackup.value && /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__notice", role: "status", children: [
      /* @__PURE__ */ u$1("span", { children: [
        "There's no recent backup. A backup keeps the photos, pages and settings safe if this ",
        deviceNoun(),
        " is lost or breaks."
      ] }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "parent-mode-screen__button",
          onClick: () => {
            tab.value = "backup";
          },
          children: "Go to Backup"
        }
      )
    ] }),
    /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__layout", children: [
      /* @__PURE__ */ u$1("nav", { class: "parent-nav", "aria-label": `${name} sections`, children: GROUPS$1.map((group) => /* @__PURE__ */ u$1("div", { class: "parent-nav__group", children: [
        /* @__PURE__ */ u$1("p", { class: "parent-nav__heading", children: group.title }),
        group.tabs.map((entry) => /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "page-tabs__tab parent-nav__tab",
            "aria-pressed": tab.value === entry.id,
            onClick: () => tab.value = entry.id,
            children: entry.label
          },
          entry.id
        ))
      ] }, group.title)) }),
      /* @__PURE__ */ u$1("main", { class: "parent-mode-screen__main", children: [
        tab.value === "guide" && /* @__PURE__ */ u$1(GuideTab, {}),
        tab.value === "user" && /* @__PURE__ */ u$1(UserTab, {}),
        tab.value === "boards" && /* @__PURE__ */ u$1(BoardsTab, {}),
        tab.value === "people" && /* @__PURE__ */ u$1(PeoplePlacesTab, { kind: "people" }),
        tab.value === "places" && /* @__PURE__ */ u$1(PeoplePlacesTab, { kind: "places" }),
        tab.value === "myday" && /* @__PURE__ */ u$1(DayBuilderTab, {}),
        tab.value === "mypages" && /* @__PURE__ */ u$1(MyPagesTab, {}),
        tab.value === "quickaccess" && /* @__PURE__ */ u$1(QuickAccessTab, {}),
        tab.value === "profiles" && /* @__PURE__ */ u$1(ProfilesTab, {}),
        tab.value === "access" && /* @__PURE__ */ u$1(AccessTab, {}),
        tab.value === "look" && /* @__PURE__ */ u$1(LookTab, {}),
        tab.value === "body" && /* @__PURE__ */ u$1(BodyTab, {}),
        tab.value === "music" && /* @__PURE__ */ u$1(MusicTab, {}),
        tab.value === "jokes" && /* @__PURE__ */ u$1(JokesTab, {}),
        tab.value === "seasons" && /* @__PURE__ */ u$1(SeasonsTab, {}),
        tab.value === "lost" && /* @__PURE__ */ u$1(LostModeTab, {}),
        tab.value === "learning" && /* @__PURE__ */ u$1(LearningTab, {}),
        tab.value === "targets" && /* @__PURE__ */ u$1(TargetsTab, {}),
        tab.value === "notes" && /* @__PURE__ */ u$1(NotesTab, {}),
        tab.value === "activity" && /* @__PURE__ */ u$1(ActivityTab, {}),
        tab.value === "reports" && /* @__PURE__ */ u$1(ReportsTab, {}),
        tab.value === "aboutme" && /* @__PURE__ */ u$1(AboutMeTab, {}),
        tab.value === "school" && /* @__PURE__ */ u$1(SchoolTab, {}),
        tab.value === "backup" && /* @__PURE__ */ u$1(BackupTab, {}),
        tab.value === "print" && /* @__PURE__ */ u$1(PrintTab, {}),
        tab.value === "general" && /* @__PURE__ */ u$1(GeneralTab, {}),
        tab.value === "medical" && /* @__PURE__ */ u$1(MedicalInfoTab, {})
      ] })
    ] })
  ] });
}
const TIMEOUTS = [0, 5, 10, 15, 30, 60];
function ClassroomTab() {
  const confirmBar = useSignal(false);
  const barApplied = useSignal(false);
  const timetableAdded = useSignal(false);
  const changingPin = useSignal(false);
  const pinChanged = useSignal(false);
  const routineEmpty = routineIsEmpty(weeklyRoutineSetting.signal.value);
  async function addTypicalWeek() {
    if (!routineIsEmpty(weeklyRoutineSetting.signal.value)) return;
    await weeklyRoutineSetting.set(typicalSchoolWeek());
    timetableAdded.value = true;
  }
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body classroom-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "The child's top bar and first page" }),
      /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: [
        "For a classroom, the top bar can be ",
        /* @__PURE__ */ u$1("strong", { children: SCHOOL_QUICK_ACCESS.map((id) => QUICK_ACCESS_LABELS[id]).join(", ") }),
        ", and Talk can open to the School page. This moves buttons a child may already know, so it is only done when you press the button."
      ] }),
      confirmBar.value ? /* @__PURE__ */ u$1("div", { class: "school-tab__buttons", children: [
        /* @__PURE__ */ u$1("span", { children: "Change the top bar and the first page now?" }),
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "parent-mode-screen__button",
            onClick: () => {
              void applySchoolTopBar().then(() => {
                barApplied.value = true;
                confirmBar.value = false;
              });
            },
            children: "Yes, change them"
          }
        ),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmBar.value = false, children: "Not now" })
      ] }) : /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => confirmBar.value = true, children: "Use the school top bar" }),
      barApplied.value && /* @__PURE__ */ u$1("p", { role: "status", class: "school-tab__hint", children: "Done. The top bar is now Home, Help, Yes, No, Break and Question. Parents can change it again in Parent Mode." }),
      /* @__PURE__ */ u$1(CurrentBar, {})
    ] }),
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "The timetable" }),
      /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: [
        "Start from a typical school day, Monday to Friday, then change the names and times in ",
        /* @__PURE__ */ u$1("strong", { children: "Timetable" }),
        ". It never replaces a timetable that is already there."
      ] }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", disabled: !routineEmpty, onClick: () => void addTypicalWeek(), children: "Start from a typical school day" }),
      !routineEmpty && !timetableAdded.value && /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: "There is a timetable already, so it is left alone." }),
      timetableAdded.value && /* @__PURE__ */ u$1("p", { role: "status", class: "school-tab__hint", children: "Added Monday to Friday. Change the times and names in Timetable to match." })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "Closing School Mode" }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__select-row", children: [
        "Close School Mode after",
        /* @__PURE__ */ u$1(
          "select",
          {
            value: String(schoolTimeoutSetting.signal.value),
            onChange: (event) => void schoolTimeoutSetting.set(Number(event.target.value)),
            children: TIMEOUTS.map((minutes) => /* @__PURE__ */ u$1("option", { value: String(minutes), children: minutes === 0 ? "Never" : `${minutes} minutes without use` }, minutes))
          }
        )
      ] }),
      /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: "So a device left on a desk is not left open. Any press or key counts as use." })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "The School PIN" }),
      /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: "Four numbers, separate from the Parent PIN. If it is forgotten, whoever has the Parent PIN can choose a new one in Parent Mode." }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => changingPin.value = true, children: "Choose a new School PIN" }),
      pinChanged.value && /* @__PURE__ */ u$1("p", { role: "status", class: "school-tab__hint", children: "The School PIN is changed." })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "About me on the child's screen" }),
      /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: [
        "While School Mode is on, an ",
        /* @__PURE__ */ u$1("strong", { children: "About me" }),
        " button shows on the child's screen, so a supply teacher can read it without a PIN. Write it under ",
        /* @__PURE__ */ u$1("strong", { children: "About me" }),
        " in the menu."
      ] })
    ] }),
    changingPin.value && /* @__PURE__ */ u$1("div", { class: "pin-gate-overlay", children: /* @__PURE__ */ u$1(
      PinGate,
      {
        kind: "school",
        changePin: true,
        onUnlock: () => {
          changingPin.value = false;
          pinChanged.value = true;
        },
        onCancel: () => changingPin.value = false
      }
    ) })
  ] });
}
function CurrentBar() {
  return /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: [
    "The top bar now: ",
    quickAccessButtons.value.map((id) => QUICK_ACCESS_LABELS[id]).join(", "),
    "."
  ] });
}
function SchoolInfoForm({ only, except } = {}) {
  const info = { ...EMPTY_SCHOOL_INFO, ...schoolInfoSetting.signal.value };
  return /* @__PURE__ */ u$1("div", { class: "school-tab__fields", children: SCHOOL_INFO_FIELDS.filter((field) => (!only || only.includes(field.id)) && !except?.includes(field.id)).map((field) => /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
    field.label,
    /* @__PURE__ */ u$1(
      "input",
      {
        class: "about-tab__input",
        type: field.id === "phone" || field.id === "dslPhone" ? "tel" : "text",
        autocomplete: "off",
        placeholder: field.placeholder,
        value: info[field.id],
        onInput: (event) => void schoolInfoSetting.set({
          ...EMPTY_SCHOOL_INFO,
          ...schoolInfoSetting.signal.value,
          [field.id]: event.target.value
        })
      }
    )
  ] }, field.id)) });
}
function PupilTab() {
  const profile = userProfileSetting.signal.value;
  const about = aboutMeSetting.signal.value;
  const name = about.preferredName.trim() || profile.name.trim();
  const age = ageYears(profile);
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body pupil-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: name || "The pupil" }),
      /* @__PURE__ */ u$1("dl", { class: "pupil-tab__facts", children: [
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("dt", { children: "Device" }),
          /* @__PURE__ */ u$1("dd", { children: deviceTitle(profile) })
        ] }),
        age !== void 0 && /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("dt", { children: "Age" }),
          /* @__PURE__ */ u$1("dd", { children: age })
        ] })
      ] }),
      /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: "The pupil's name and age are set by the family, in Parent Mode, under User." })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "About the school" }),
      /* @__PURE__ */ u$1("p", { class: "school-tab__hint", children: "Who the child works with and where. It is for the adults: it is never shown on the child's screen. It appears on the handover sheet, and can fill in Lost mode." }),
      /* @__PURE__ */ u$1(SchoolInfoForm, { except: ["dsl", "dslPhone"] })
    ] })
  ] });
}
function SafeguardingTab() {
  const info = { ...EMPTY_SCHOOL_INFO, ...schoolInfoSetting.signal.value };
  const lead = info.dsl.trim();
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body safeguarding-tab", children: [
    /* @__PURE__ */ u$1("section", { class: "school-tab__section safeguarding-tab__card", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "If a child tells you something that worries you" }),
      /* @__PURE__ */ u$1("ol", { class: "school-tab__list safeguarding-tab__steps", children: [
        /* @__PURE__ */ u$1("li", { children: "Listen, stay calm, and do not promise to keep it secret." }),
        /* @__PURE__ */ u$1("li", { children: [
          "Follow ",
          /* @__PURE__ */ u$1("strong", { children: "your setting's safeguarding procedure" }),
          " and speak to the designated safeguarding lead."
        ] }),
        /* @__PURE__ */ u$1("li", { children: "Write down what was said, in the child's own words, as soon as you can." })
      ] }),
      /* @__PURE__ */ u$1("p", { class: "safeguarding-tab__lead", "aria-live": "polite", children: lead ? /* @__PURE__ */ u$1(S$1, { children: [
        "Designated safeguarding lead: ",
        /* @__PURE__ */ u$1("strong", { children: lead }),
        info.dslPhone.trim() ? /* @__PURE__ */ u$1(S$1, { children: [
          ", phone ",
          /* @__PURE__ */ u$1("strong", { children: info.dslPhone.trim() })
        ] }) : null
      ] }) : "Add the designated safeguarding lead below, so their name is here when it is needed." })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "What this device does and does not do" }),
      /* @__PURE__ */ u$1("ul", { class: "school-tab__list", children: [
        /* @__PURE__ */ u$1("li", { children: 'The Help phrases (such as "Someone hurt me" and "I feel unsafe") exist because a child needs the words.' }),
        /* @__PURE__ */ u$1("li", { children: [
          "The device ",
          /* @__PURE__ */ u$1("strong", { children: "speaks the phrase and stops" }),
          ". It does not tell anyone, flag it, or keep it any differently from anything else that is said."
        ] }),
        /* @__PURE__ */ u$1("li", { children: [
          "The same is true of ",
          /* @__PURE__ */ u$1("strong", { children: "My body" }),
          ', including "under my pants". Pointing is spoken, and nothing is recorded about it.'
        ] }),
        /* @__PURE__ */ u$1("li", { children: [
          "If the ",
          /* @__PURE__ */ u$1("strong", { children: "Activity" }),
          " log is on, every phrase is logged in the same way, the Help phrases included. Treat the log as sensitive. It is never sent anywhere."
        ] }),
        /* @__PURE__ */ u$1("li", { children: '"Call my parent" only speaks those words. It does not call anyone.' })
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "school-tab__section", children: [
      /* @__PURE__ */ u$1("h2", { class: "school-tab__heading", children: "Safeguarding lead" }),
      /* @__PURE__ */ u$1(SchoolInfoForm, { only: ["dsl", "dslPhone"] })
    ] })
  ] });
}
const LONG_DATE = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });
function TodayTab({ go }) {
  const today2 = getDateString(/* @__PURE__ */ new Date());
  const plan = useSignal([]);
  const activity = useSignal([]);
  const quick = useSignal("");
  const added = useSignal(false);
  const profile = userProfileSetting.signal.value;
  const targets = targetsSetting.signal.value;
  const notes = [...staffNotesSetting.signal.value].sort((a2, b2) => b2.at - a2.at).slice(0, 3);
  const due = targets.filter((t2) => reviewDue(t2, today2));
  const working = targets.filter((t2) => t2.status === "working");
  const traffic = trafficSetting.signal.value.status;
  const logOn = activityEnabledSetting.signal.value;
  const version = activityVersion.value;
  h$2(() => {
    void getEffectiveDayPlan(today2).then(({ plan: p2 }) => plan.value = p2.activities);
  }, [today2]);
  h$2(() => {
    void getActivity().then((entries) => activity.value = entries);
  }, [version, logOn]);
  function addQuickNote(event) {
    event.preventDefault();
    const text = quick.value.trim();
    if (!text) return;
    void staffNotesSetting.set([
      ...staffNotesSetting.signal.value,
      { id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: Date.now(), by: noteAuthorSetting.signal.value.trim(), text, kind: "observation" }
    ]);
    quick.value = "";
    added.value = true;
  }
  const now = Date.now();
  const sums = totals(activity.value, now, ["speech"]);
  const light = traffic === "off" ? void 0 : TRAFFIC_LIGHTS.find((l2) => l2.id === traffic);
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__body today-tab", children: [
    /* @__PURE__ */ u$1("header", { class: "today-tab__head", children: [
      /* @__PURE__ */ u$1("h2", { class: "today-tab__date", children: LONG_DATE.format(/* @__PURE__ */ new Date()) }),
      /* @__PURE__ */ u$1("p", { class: "today-tab__who", children: deviceTitle(profile) })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "today-tab__grid", children: [
      /* @__PURE__ */ u$1("section", { class: "today-tab__card", "aria-labelledby": "today-plan", children: [
        /* @__PURE__ */ u$1("h3", { id: "today-plan", children: "Today's plan" }),
        plan.value.length === 0 ? /* @__PURE__ */ u$1("p", { class: "today-tab__none", children: "Nothing planned for today." }) : /* @__PURE__ */ u$1("ul", { class: "today-tab__plan", children: plan.value.map((a2) => /* @__PURE__ */ u$1("li", { children: [
          /* @__PURE__ */ u$1("span", { class: "today-tab__time", children: a2.time ?? "" }),
          " ",
          a2.name
        ] }, a2.id)) }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => go("timetable"), children: "Open the timetable" })
      ] }),
      /* @__PURE__ */ u$1("section", { class: "today-tab__card", "aria-labelledby": "today-targets", children: [
        /* @__PURE__ */ u$1("h3", { id: "today-targets", children: "Targets" }),
        /* @__PURE__ */ u$1("p", { class: "today-tab__big", children: working.length }),
        /* @__PURE__ */ u$1("p", { class: "today-tab__none", children: "being worked on" }),
        due.length > 0 ? /* @__PURE__ */ u$1("p", { class: "targets-tab__due", role: "status", children: [
          due.length === 1 ? "1 target is" : `${due.length} targets are`,
          " due to be looked at again."
        ] }) : /* @__PURE__ */ u$1("p", { class: "today-tab__none", children: "None are due for review." }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => go("targets"), children: "Open targets" })
      ] }),
      /* @__PURE__ */ u$1("section", { class: "today-tab__card", "aria-labelledby": "today-use", children: [
        /* @__PURE__ */ u$1("h3", { id: "today-use", children: "Using the device today" }),
        logOn ? /* @__PURE__ */ u$1(S$1, { children: [
          /* @__PURE__ */ u$1("p", { class: "today-tab__big", children: sums.today }),
          /* @__PURE__ */ u$1("p", { class: "today-tab__none", children: "things said today" })
        ] }) : /* @__PURE__ */ u$1("p", { class: "today-tab__none", children: "The activity log is off, so there is nothing to show. It can be turned on in Activity." }),
        light && /* @__PURE__ */ u$1("p", { class: "today-tab__light", style: { "--light": light.colour }, children: [
          /* @__PURE__ */ u$1("span", { class: "traffic-chip__lamp", "aria-hidden": "true" }),
          " The child is showing: ",
          light.short
        ] }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => go("activity"), children: "Open activity" })
      ] }),
      /* @__PURE__ */ u$1("section", { class: "today-tab__card", "aria-labelledby": "today-notes", children: [
        /* @__PURE__ */ u$1("h3", { id: "today-notes", children: "Latest notes" }),
        notes.length === 0 ? /* @__PURE__ */ u$1("p", { class: "today-tab__none", children: "No notes yet." }) : /* @__PURE__ */ u$1("ul", { class: "today-tab__notes", children: notes.map((n2) => /* @__PURE__ */ u$1("li", { children: [
          /* @__PURE__ */ u$1("span", { class: "today-tab__time", children: formatTime$1(n2.at) }),
          " ",
          n2.text
        ] }, n2.id)) }),
        /* @__PURE__ */ u$1("form", { class: "today-tab__quick", onSubmit: addQuickNote, children: [
          /* @__PURE__ */ u$1("label", { class: "about-tab__field", children: [
            "A quick note",
            /* @__PURE__ */ u$1(
              "textarea",
              {
                class: "about-tab__input about-tab__textarea",
                value: quick.value,
                onInput: (event) => {
                  quick.value = event.target.value;
                  added.value = false;
                }
              }
            )
          ] }),
          /* @__PURE__ */ u$1("button", { type: "submit", class: "parent-mode-screen__button", disabled: !quick.value.trim(), children: "Add note" }),
          added.value && /* @__PURE__ */ u$1("span", { role: "status", children: " Added." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1("section", { class: "today-tab__shortcuts", children: [
      /* @__PURE__ */ u$1("h3", { children: "Jump to" }),
      /* @__PURE__ */ u$1("div", { class: "school-tab__buttons", children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => go("reports"), children: "Print a handover sheet" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => go("lessons"), children: "Make a lesson page" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => go("safeguarding"), children: "Safeguarding" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button", onClick: () => go("classroom"), children: "Classroom set-up" })
      ] })
    ] })
  ] });
}
const GROUPS = [
  { title: "Today", sections: [{ id: "today", label: "Today" }] },
  {
    title: "The pupil",
    sections: [
      { id: "pupil", label: "Pupil and school" },
      { id: "aboutme", label: "About me" },
      { id: "safeguarding", label: "Safeguarding" }
    ]
  },
  {
    title: "Planning",
    sections: [
      { id: "timetable", label: "Timetable" },
      { id: "lessons", label: "Lesson pages" },
      { id: "vocabulary", label: "Vocabulary" }
    ]
  },
  {
    title: "Working together",
    sections: [
      { id: "targets", label: "Targets" },
      { id: "notes", label: "Notes" },
      { id: "activity", label: "Activity" },
      { id: "reports", label: "Reports" }
    ]
  },
  {
    title: "Set-up",
    sections: [
      { id: "classroom", label: "Classroom set-up" },
      { id: "guide", label: "School guide" }
    ]
  }
];
const IDLE_CHECK_MS = 5e3;
function SchoolModeScreen({ onExit }) {
  const section = useSignal("today");
  const minutes = schoolTimeoutSetting.signal.value;
  h$2(() => {
    if (minutes <= 0) return;
    let lastActivity = Date.now();
    const noteActivity = () => {
      lastActivity = Date.now();
    };
    const events = ["pointerdown", "keydown", "input", "wheel"];
    for (const name of events) document.addEventListener(name, noteActivity, true);
    const timer = setInterval(() => {
      if (Date.now() - lastActivity >= minutes * 6e4) {
        clearInterval(timer);
        onExit();
      }
    }, IDLE_CHECK_MS);
    return () => {
      for (const name of events) document.removeEventListener(name, noteActivity, true);
      clearInterval(timer);
    };
  }, [minutes]);
  const go = (next) => section.value = next;
  return /* @__PURE__ */ u$1("div", { class: "parent-mode-screen school-mode-screen", children: [
    /* @__PURE__ */ u$1("header", { class: "parent-mode-screen__header school-mode-screen__header", children: [
      /* @__PURE__ */ u$1("h1", { class: "parent-mode-screen__title school-mode-screen__title", children: SCHOOL_MODE_NAME }),
      /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__header-actions", children: /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-screen__button parent-mode-screen__exit school-mode-screen__exit", onClick: onExit, children: [
        "Exit ",
        SCHOOL_MODE_NAME
      ] }) })
    ] }),
    /* @__PURE__ */ u$1("div", { class: "parent-mode-screen__layout", children: [
      /* @__PURE__ */ u$1("nav", { class: "parent-nav school-nav", "aria-label": `${SCHOOL_MODE_NAME} sections`, children: GROUPS.map((group) => /* @__PURE__ */ u$1("div", { class: "parent-nav__group", children: [
        /* @__PURE__ */ u$1("p", { class: "parent-nav__heading", children: group.title }),
        group.sections.map((entry) => /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "page-tabs__tab parent-nav__tab school-nav__tab",
            "aria-pressed": section.value === entry.id,
            onClick: () => go(entry.id),
            children: entry.label
          },
          entry.id
        ))
      ] }, group.title)) }),
      /* @__PURE__ */ u$1("main", { class: "parent-mode-screen__main", children: [
        section.value === "today" && /* @__PURE__ */ u$1(TodayTab, { go }),
        section.value === "pupil" && /* @__PURE__ */ u$1(PupilTab, {}),
        section.value === "aboutme" && /* @__PURE__ */ u$1(AboutMeTab, {}),
        section.value === "safeguarding" && /* @__PURE__ */ u$1(SafeguardingTab, {}),
        section.value === "timetable" && /* @__PURE__ */ u$1(DayBuilderTab, {}),
        section.value === "lessons" && /* @__PURE__ */ u$1(MyPagesTab, {}),
        section.value === "vocabulary" && /* @__PURE__ */ u$1(LearningTab, {}),
        section.value === "targets" && /* @__PURE__ */ u$1(TargetsTab, {}),
        section.value === "notes" && /* @__PURE__ */ u$1(NotesTab, {}),
        section.value === "activity" && /* @__PURE__ */ u$1(ActivityTab, {}),
        section.value === "reports" && /* @__PURE__ */ u$1(ReportsTab, {}),
        section.value === "classroom" && /* @__PURE__ */ u$1(ClassroomTab, {}),
        section.value === "guide" && /* @__PURE__ */ u$1(GuideTab, { start: "staff" })
      ] })
    ] })
  ] });
}
function applyAccessSettings(settings, options = {}) {
  const root = document.documentElement;
  root.dataset["contrast"] = settings.highContrast;
  root.dataset["reduceMotion"] = String(settings.reduceMotion);
  root.style.setProperty("--text-scale", String(settings.textScale));
  if (options.boldText) root.dataset["boldText"] = "true";
  else delete root.dataset["boldText"];
}
const OPENABLE_SCREENS = [
  "talk",
  "keyboard",
  "myday",
  "mypages",
  "firstthen",
  "game",
  "draw",
  "body",
  "music",
  "traffic",
  "feelings",
  "favourites"
];
const TRAFFIC_VALUES = ["off", "red", "amber", "green"];
function parseCommand(message) {
  if (message.type === "open" && typeof message["screen"] === "string") {
    const screen = OPENABLE_SCREENS.includes(message["screen"]) ? message["screen"] : null;
    return screen ? { kind: "open", screen } : null;
  }
  if (message.type === "traffic" && typeof message["status"] === "string" && TRAFFIC_VALUES.includes(message["status"])) {
    return { kind: "traffic", status: message["status"] };
  }
  return null;
}
const MAX_FAVOURITES = 30;
const MAX_ACTIVITIES = 12;
const hexNumber = (colour) => {
  const value = Number.parseInt((colour ?? "").replace("#", ""), 16);
  return Number.isFinite(value) ? value : 16707722;
};
function buildLinkState(input) {
  const unfinished = input.plan.filter((activity) => !activity.finished);
  return {
    type: "state",
    screen: input.screen,
    traffic: input.traffic,
    now: unfinished[0]?.name ?? null,
    next: unfinished[1]?.name ?? null,
    today: input.plan.slice(0, MAX_ACTIVITIES).map((activity) => ({
      name: activity.name,
      time: activity.time ?? null,
      done: activity.finished === true
    })),
    favourites: input.favourites.slice(0, MAX_FAVOURITES).map((item) => ({
      id: item.id,
      label: item.label,
      spoken: item.vocalization ?? item.label,
      emoji: item.image?.kind === "emoji" ? item.image.char : "",
      colour: hexNumber(item.background_color)
    }))
  };
}
const POLL_MS = 500;
const SEND_QUIET_MS = 400;
function startLink(code, onCommand, onPeers) {
  const link = window.myWords?.link;
  if (!link) return void 0;
  let stopped = false;
  let lastPeers = -1;
  let pending;
  let sendTimer;
  void link.start(code).catch(() => void 0);
  const poll = () => {
    void link.inbox().then(({ messages, peers }) => {
      if (stopped) return;
      if (peers !== lastPeers) {
        lastPeers = peers;
        onPeers(peers);
        if (peers > 0 && pending) void link.send(pending).catch(() => void 0);
      }
      for (const message of messages) {
        const command = parseCommand(message);
        if (command) onCommand(command);
      }
    }).catch(() => void 0);
  };
  const pollTimer = window.setInterval(poll, POLL_MS);
  return {
    publish: (state) => {
      pending = state;
      window.clearTimeout(sendTimer);
      sendTimer = window.setTimeout(() => {
        if (!stopped && pending) void link.send(pending).catch(() => void 0);
      }, SEND_QUIET_MS);
    },
    stop: () => {
      stopped = true;
      window.clearInterval(pollTimer);
      window.clearTimeout(sendTimer);
      void link.stop().catch(() => void 0);
    }
  };
}
const ICON_SYMBOLS = {
  talk: "talk",
  keyboard: "keyboard",
  myday: "my-day",
  favourites: "favourites",
  mypages: "my-pages",
  feelings: "happy",
  home: "home",
  help: "help",
  yes: "yes",
  no: "no",
  firstthen: "firstthen",
  game: "games",
  draw: "draw",
  body: "my-body",
  music: "music",
  traffic: "traffic",
  break: "break",
  question: "what",
  toilet: "toilet",
  finished: "all-done",
  again: "again"
};
function applySymbolStyle(style) {
  const root = document.documentElement;
  root.dataset["symbols"] = style;
  for (const [id, name] of Object.entries(ICON_SYMBOLS)) {
    const uri = symbolDataUri(name);
    if (style === "drawn" && uri) root.style.setProperty(`--icon-${id}`, `url("${uri}")`);
    else root.style.removeProperty(`--icon-${id}`);
  }
}
function applyLabelStyle(style) {
  document.documentElement.dataset["labels"] = style;
}
const FOCUSABLE_SELECTOR = 'button:not([disabled]):not([tabindex="-1"]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
function focusableElements(root = document) {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR));
}
function focusNext() {
  const elements = focusableElements();
  if (elements.length === 0) return;
  const currentIndex = elements.indexOf(document.activeElement);
  const nextIndex = (currentIndex + 1 + elements.length) % elements.length;
  elements[nextIndex]?.focus();
}
const EMPTY = { childName: "", allergies: "", conditions: "", contacts: [] };
function MedicalInfoButton() {
  const open = useSignal(false);
  const info = useSignal(EMPTY);
  async function handlePress() {
    info.value = await getMedicalInfo();
    open.value = true;
  }
  return /* @__PURE__ */ u$1(S$1, { children: [
    /* @__PURE__ */ u$1("button", { type: "button", class: "medical-info-button", onClick: () => void handlePress(), children: [
      /* @__PURE__ */ u$1("span", { class: "medical-info-button__icon", "aria-hidden": "true", children: "➕" }),
      "Medical Info"
    ] }),
    open.value && /* @__PURE__ */ u$1("div", { class: "medical-info-overlay", children: /* @__PURE__ */ u$1("div", { class: "medical-info-overlay__panel", children: [
      hasMedicalInfo(info.value) ? /* @__PURE__ */ u$1(S$1, { children: [
        /* @__PURE__ */ u$1(QRCode, { class: "medical-info-overlay__qr", text: formatMedicalQrText(info.value) }),
        /* @__PURE__ */ u$1("pre", { class: "medical-info-overlay__text", children: formatMedicalInfoText(info.value) })
      ] }) : /* @__PURE__ */ u$1("p", { class: "medical-info-overlay__empty", children: "No medical information has been set up for this device yet. An adult can add it in Parent Mode." }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "medical-info-overlay__close", onClick: () => open.value = false, children: "Close" })
    ] }) })
  ] });
}
function AboutMeButton() {
  const open = useSignal(false);
  const info = aboutMeSetting.signal.value;
  if (!hasAboutMe(info) && !schoolModeSetting.signal.value) return null;
  const sections = aboutMeSections(info);
  return /* @__PURE__ */ u$1(S$1, { children: [
    /* @__PURE__ */ u$1("button", { type: "button", class: "about-me-button", onClick: () => open.value = true, children: "About me" }),
    open.value && /* @__PURE__ */ u$1("div", { class: "medical-info-overlay", children: /* @__PURE__ */ u$1("div", { class: "medical-info-overlay__panel about-me-overlay__panel", children: [
      /* @__PURE__ */ u$1("h2", { class: "about-me-overlay__heading", children: aboutMeHeading(info, userProfileSetting.signal.value.name) }),
      sections.length === 0 ? /* @__PURE__ */ u$1("p", { class: "medical-info-overlay__empty", children: [
        "Nothing has been written here yet. An adult can add it in ",
        modeName(),
        "."
      ] }) : sections.map((section) => /* @__PURE__ */ u$1("section", { class: "about-me-overlay__section", children: [
        /* @__PURE__ */ u$1("h3", { class: "about-me-overlay__title", children: section.title }),
        /* @__PURE__ */ u$1("p", { class: "about-me-overlay__text", children: section.text })
      ] }, section.title)),
      /* @__PURE__ */ u$1("button", { type: "button", class: "medical-info-overlay__close", onClick: () => open.value = false, children: "Close" })
    ] }) })
  ] });
}
const STARTING_LOOKS = ["standard", "pink", "orange", "green", "turquoise", "blue", "purple", "night"];
const STEP_NUMBERS = { welcome: 0, about: 1, voice: 2, grid: 3, pictures: 4, press: 5, look: 6, pin: 7, ready: 8 };
const TEXT_SIZES = [
  { scale: 1, label: "Usual" },
  { scale: 1.25, label: "Larger" },
  { scale: 1.5, label: "Much larger" }
];
function FirstRunWizard({ onComplete }) {
  const screen = useSignal("welcome");
  const personName = useSignal("");
  const deviceName = useSignal("");
  const age = useSignal("");
  const gamesOnBar = useSignal(false);
  const chosenPress = useSignal("sentence");
  const textScale = useSignal(1);
  const voices = useSignal([]);
  const chosenVoiceURI = useSignal(void 0);
  const rootBoard2 = useSignal(null);
  const chosenSize = useSignal(4);
  const minSize = useSignal(4);
  const gridError = useSignal(null);
  h$2(() => {
    const stopWatching = watchVoices((found) => {
      voices.value = found;
      chosenVoiceURI.value ??= found[0]?.voiceURI;
    });
    void getRootBoard().then((board2) => {
      if (!board2) return;
      rootBoard2.value = board2;
      chosenSize.value = board2.grid.rows;
      const needed = VALID_GRID_SIZES.find((size) => size * size >= board2.buttons.length) ?? 5;
      minSize.value = needed;
    });
    return stopWatching;
  }, []);
  function tryVoice() {
    speak("This is what I sound like.", chosenVoiceURI.value ? { voiceURI: chosenVoiceURI.value } : {});
  }
  async function confirmAbout() {
    if (personName.value.trim() || deviceName.value.trim() || age.value.trim()) {
      await userProfileSetting.set({
        ...EMPTY_USER_PROFILE,
        name: personName.value.trim(),
        deviceName: deviceName.value.trim(),
        age: age.value.trim()
      });
    }
    screen.value = "voice";
  }
  async function confirmVoice() {
    await setPreferredVoiceURI(chosenVoiceURI.value);
    preferredVoiceURI.value = chosenVoiceURI.value;
    screen.value = "grid";
  }
  function goToPictures() {
    void symbolStyleSetting.set("drawn");
    screen.value = "pictures";
  }
  async function chooseTextSize(scale) {
    textScale.value = scale;
    await setAccessSettings({ ...await getAccessSettings(), textScale: scale });
  }
  async function confirmPress() {
    await setPressMode(chosenPress.value);
    pressMode.value = chosenPress.value;
    screen.value = "look";
  }
  function chooseLook(preset) {
    void themeSetting.set({ ...DEFAULT_THEME, ...themeSetting.signal.value, preset });
  }
  async function confirmGrid() {
    if (!rootBoard2.value) {
      goToPictures();
      return;
    }
    gridError.value = null;
    try {
      await updateBoard(resizeGrid(rootBoard2.value, chosenSize.value, chosenSize.value));
      goToPictures();
    } catch (err) {
      gridError.value = err instanceof Error ? err.message : String(err);
    }
  }
  async function finishSetup() {
    await setFirstRunCompleted();
    screen.value = "ready";
  }
  async function start() {
    if (gamesOnBar.value) {
      const bar = await getQuickAccess();
      const lastIndex = bar.length - 1;
      if (!bar.includes("game")) await setQuickAccess(bar.map((id, i2) => i2 === lastIndex && id !== "help" ? "game" : id));
    }
    onComplete();
  }
  const step = STEP_NUMBERS[screen.value];
  const looks = THEME_PRESETS;
  return /* @__PURE__ */ u$1("div", { class: "first-run-wizard", children: [
    screen.value === "welcome" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: "Welcome to Rugged Speech" }),
      /* @__PURE__ */ u$1("p", { class: "first-run-wizard__hint", children: "A way to say what you want to say, when speaking is hard. Words, pictures and a keyboard, spoken out loud, for children and young people." }),
      /* @__PURE__ */ u$1("ul", { class: "first-run-wizard__promises", children: [
        /* @__PURE__ */ u$1("li", { children: "It works with no internet, always." }),
        /* @__PURE__ */ u$1("li", { children: [
          "Everything stays on this ",
          deviceNoun(),
          ". Nothing is sent anywhere."
        ] }),
        /* @__PURE__ */ u$1("li", { children: "Nothing is spoken unless someone presses something." }),
        /* @__PURE__ */ u$1("li", { children: "An adult sets it up now. It takes about two minutes, and every choice can be changed later." })
      ] }),
      /* @__PURE__ */ u$1("div", { children: /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "first-run-wizard__button first-run-wizard__button--primary",
          onClick: () => screen.value = "about",
          children: "Get started"
        }
      ) })
    ] }),
    screen.value === "about" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: "Whose device is this?" }),
      /* @__PURE__ */ u$1("p", { class: "first-run-wizard__hint", children: [
        "All optional. A name makes it clear whose device this is, if it is ever picked up by someone else. It stays on this ",
        deviceNoun(),
        "."
      ] }),
      /* @__PURE__ */ u$1("label", { class: "first-run-wizard__field", children: [
        "Name",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            autocomplete: "off",
            placeholder: "Lucy",
            value: personName.value,
            onInput: (event) => personName.value = event.target.value
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "first-run-wizard__field", children: [
        "Device name",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            autocomplete: "off",
            placeholder: personName.value.trim() ? `${personName.value.trim()}'s device` : "Lucy's device",
            value: deviceName.value,
            onInput: (event) => deviceName.value = event.target.value
          }
        )
      ] }),
      /* @__PURE__ */ u$1("label", { class: "first-run-wizard__field", children: [
        "Age",
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            inputMode: "numeric",
            maxLength: 2,
            autocomplete: "off",
            value: age.value,
            onInput: (event) => age.value = event.target.value.replace(/\D/g, "")
          }
        )
      ] }),
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "first-run-wizard__button first-run-wizard__button--primary",
            onClick: () => void confirmAbout(),
            children: "Next"
          }
        ),
        /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button", onClick: () => screen.value = "voice", children: "Skip" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--back", onClick: () => screen.value = "welcome", children: "Back" })
      ] })
    ] }),
    screen.value === "voice" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: "Choose a voice" }),
      /* @__PURE__ */ u$1("p", { class: "first-run-wizard__hint", children: "This is the voice that speaks what's built on the board." }),
      voices.value.length === 0 && /* @__PURE__ */ u$1("p", { children: [
        "No offline voices were found on this ",
        deviceNoun(),
        "."
      ] }),
      /* @__PURE__ */ u$1("ul", { class: "first-run-wizard__voice-list", children: voices.value.map((voice) => /* @__PURE__ */ u$1("li", { children: /* @__PURE__ */ u$1("label", { class: "first-run-wizard__voice-option", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "radio",
            name: "voice",
            checked: chosenVoiceURI.value === voice.voiceURI,
            onChange: () => chosenVoiceURI.value = voice.voiceURI
          }
        ),
        voice.name
      ] }) }, voice.voiceURI)) }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button", onClick: tryVoice, disabled: !chosenVoiceURI.value, children: "Try it" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "first-run-wizard__button first-run-wizard__button--primary",
          onClick: () => void confirmVoice(),
          children: "Next"
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--back", onClick: () => screen.value = "about", children: "Back" })
    ] }),
    screen.value === "grid" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: "Choose a grid size" }),
      /* @__PURE__ */ u$1("p", { class: "first-run-wizard__hint", children: "Bigger buttons, fewer per page, or smaller buttons with more choices at once. This can be changed later in Parent Mode, but a child learns where buttons are, so it's worth getting right now." }),
      gridError.value && /* @__PURE__ */ u$1("p", { class: "first-run-wizard__error", children: gridError.value }),
      /* @__PURE__ */ u$1("div", { class: "first-run-wizard__grid-sizes", children: VALID_GRID_SIZES.filter((size) => size >= minSize.value).map((size) => /* @__PURE__ */ u$1("label", { class: "first-run-wizard__grid-size-option", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "radio",
            name: "grid-size",
            checked: chosenSize.value === size,
            onChange: () => chosenSize.value = size
          }
        ),
        size,
        " × ",
        size
      ] }, size)) }),
      /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "first-run-wizard__button first-run-wizard__button--primary",
          onClick: () => void confirmGrid(),
          children: "Next"
        }
      ),
      /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--back", onClick: () => screen.value = "voice", children: "Back" })
    ] }),
    screen.value === "pictures" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: "Pictures and words" }),
      /* @__PURE__ */ u$1("p", { class: "first-run-wizard__hint", children: "Choose what the buttons show. You can see the change straight away, and change it later in Parent Mode, under Look." }),
      /* @__PURE__ */ u$1(PictureChoices, {}),
      /* @__PURE__ */ u$1("div", { class: "picture-choices", role: "group", "aria-label": "Size of the writing", children: TEXT_SIZES.map((size) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `picture-choices__option${textScale.value === size.scale ? " picture-choices__option--on" : ""}`,
          "aria-pressed": textScale.value === size.scale,
          onClick: () => void chooseTextSize(size.scale),
          children: [
            /* @__PURE__ */ u$1("strong", { children: [
              size.label,
              " writing"
            ] }),
            /* @__PURE__ */ u$1("span", { children: "Words and labels in the app." })
          ]
        },
        size.scale
      )) }),
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--primary", onClick: () => screen.value = "press", children: "Next" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--back", onClick: () => screen.value = "grid", children: "Back" })
      ] })
    ] }),
    screen.value === "press" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: "What should pressing a word do?" }),
      /* @__PURE__ */ u$1("p", { class: "first-run-wizard__hint", children: "For someone just starting, it often helps to hear the word the moment they press it, so they learn that pressing makes a sound. Someone building sentences may prefer to add words and then press Speak. You can change this at any time in Access." }),
      /* @__PURE__ */ u$1("div", { class: "first-run-wizard__grid-sizes", role: "radiogroup", "aria-label": "What pressing a word does", children: [
        ["speak", "Say the word straight away", "Best for someone just starting."],
        ["both", "Say it, and add it to the sentence", "Hears each word, and can build a sentence too."],
        ["sentence", "Only add it to the sentence", "Then press Speak to say it all."]
      ].map(([mode, label, hint]) => /* @__PURE__ */ u$1("label", { class: "first-run-wizard__press-option", children: [
        /* @__PURE__ */ u$1("input", { type: "radio", name: "press-mode", checked: chosenPress.value === mode, onChange: () => chosenPress.value = mode }),
        /* @__PURE__ */ u$1("span", { children: [
          /* @__PURE__ */ u$1("strong", { children: label }),
          /* @__PURE__ */ u$1("span", { class: "first-run-wizard__press-hint", children: hint })
        ] })
      ] }, mode)) }),
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--primary", onClick: () => void confirmPress(), children: "Next" }),
        /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--back", onClick: () => screen.value = "pictures", children: "Back" })
      ] })
    ] }),
    screen.value === "look" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: "Choose the colours" }),
      /* @__PURE__ */ u$1("p", { class: "first-run-wizard__hint", children: [
        "Pick a favourite colour, or whatever is easiest on the eyes. You can see it change as you choose, and there are more choices, and your own colours, in ",
        `Parent Mode`,
        " later."
      ] }),
      /* @__PURE__ */ u$1("div", { class: "first-run-wizard__looks", role: "group", "aria-label": "Colour scheme", children: STARTING_LOOKS.map((id) => /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `first-run-wizard__look${themeSetting.signal.value.preset === id ? " first-run-wizard__look--chosen" : ""}`,
          "aria-pressed": themeSetting.signal.value.preset === id,
          onClick: () => chooseLook(id),
          children: [
            /* @__PURE__ */ u$1(
              "span",
              {
                class: "look-tab__swatch",
                style: { background: isFunColour(id) ? FUN_COLOURS[id].swatch : looks[id].colours.background, color: looks[id].colours.text, borderColor: looks[id].colours.border },
                "aria-hidden": "true",
                children: "Aa"
              }
            ),
            looks[id].name
          ]
        },
        id
      )) }),
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            type: "button",
            class: "first-run-wizard__button first-run-wizard__button--primary",
            onClick: () => screen.value = "pin",
            children: "Next"
          }
        ),
        /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--back", onClick: () => screen.value = "press", children: "Back" })
      ] })
    ] }),
    screen.value === "pin" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: "Set a Parent PIN" }),
      /* @__PURE__ */ u$1("p", { class: "first-run-wizard__hint", children: [
        "This protects settings and editing. It does not lock the ",
        deviceNoun(),
        "."
      ] }),
      /* @__PURE__ */ u$1(PinGate, { onUnlock: () => void finishSetup(), onCancel: () => {
      }, showCancel: false }),
      /* @__PURE__ */ u$1("button", { type: "button", class: "first-run-wizard__button first-run-wizard__button--back", onClick: () => screen.value = "look", children: "Back to colours" })
    ] }),
    screen.value === "ready" && /* @__PURE__ */ u$1("div", { class: "first-run-wizard__screen", children: [
      /* @__PURE__ */ u$1("h1", { class: "first-run-wizard__title", children: userProfileSetting.signal.value.name.trim() ? `${deviceTitle(userProfileSetting.signal.value)} is ready` : "You are ready" }),
      /* @__PURE__ */ u$1("ul", { class: "first-run-wizard__tour", children: [
        /* @__PURE__ */ u$1("li", { children: [
          /* @__PURE__ */ u$1("strong", { children: "Talk" }),
          " is where words are built into a sentence. Press words, then press Speak."
        ] }),
        /* @__PURE__ */ u$1("li", { children: [
          /* @__PURE__ */ u$1("strong", { children: "Help" }),
          " is always on the bar along the top."
        ] }),
        /* @__PURE__ */ u$1("li", { children: [
          /* @__PURE__ */ u$1("strong", { children: "Parent Mode" }),
          " (top right, with your PIN) is where you add people, places, photos and pages, and change how everything looks and sounds."
        ] }),
        /* @__PURE__ */ u$1("li", { children: [
          "The ",
          /* @__PURE__ */ u$1("strong", { children: "User guide" }),
          " that came with the app explains everything, step by step."
        ] })
      ] }),
      /* @__PURE__ */ u$1("label", { class: "access-tab__checkbox", children: [
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "checkbox",
            checked: gamesOnBar.value,
            onChange: (event) => gamesOnBar.value = event.target.checked
          }
        ),
        "Put Games and Draw on the top bar"
      ] }),
      /* @__PURE__ */ u$1("div", { children: /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: "first-run-wizard__button first-run-wizard__button--primary",
          onClick: () => void start(),
          children: "Start"
        }
      ) })
    ] }),
    /* @__PURE__ */ u$1("p", { class: "first-run-wizard__progress", "aria-hidden": step === 0, children: step > 0 && step < 8 ? `Step ${step} of 7` : "" })
  ] });
}
function SplashScreen() {
  return /* @__PURE__ */ u$1("div", { class: "splash", role: "status", "aria-label": "Getting ready", children: [
    /* @__PURE__ */ u$1("svg", { class: "splash__mark", viewBox: "0 0 120 120", "aria-hidden": "true", children: [
      /* @__PURE__ */ u$1("rect", { x: "8", y: "14", width: "104", height: "72", rx: "22", fill: "var(--color-accent)" }),
      /* @__PURE__ */ u$1("path", { d: "M34 86 L28 108 L58 86 Z", fill: "var(--color-accent)" }),
      /* @__PURE__ */ u$1("circle", { cx: "38", cy: "50", r: "7", fill: "var(--color-background)" }),
      /* @__PURE__ */ u$1("circle", { cx: "60", cy: "50", r: "7", fill: "var(--color-background)" }),
      /* @__PURE__ */ u$1("circle", { cx: "82", cy: "50", r: "7", fill: "var(--color-background)" })
    ] }),
    /* @__PURE__ */ u$1("h1", { class: "splash__name", children: APP_NAME }),
    /* @__PURE__ */ u$1("p", { class: "splash__note", children: "Getting ready" })
  ] });
}
const SCREEN_LABELS = {
  home: "Home",
  talk: "Talk",
  keyboard: "Keyboard",
  myday: "My Day",
  mypages: "My Pages",
  firstthen: "First / Then",
  game: "Games",
  draw: "Draw",
  body: "My body",
  music: "Music",
  traffic: "Traffic light",
  feelings: "Feelings & Help",
  favourites: "Favourites"
};
const GIVE_ME_TIME_PHRASE = "I know what I want to say. Please give me a moment.";
function pressGiveMeTime() {
  announceText(GIVE_ME_TIME_PHRASE);
}
function App() {
  const screen = useSignal({ name: "home" });
  const mode = useSignal("child");
  const pinGateOpen = useSignal(null);
  const access = useSignal(DEFAULT_ACCESS_SETTINGS);
  const firstRunDone = useSignal(null);
  const settingsReady = useSignal(false);
  const accessLoaded = useSignal(false);
  h$2(() => {
    void hasCompletedFirstRun().then((done) => firstRunDone.value = done);
    void getPreferredVoiceURI().then((uri) => preferredVoiceURI.value = uri);
    void getPreferredSpeechRate().then((rate) => preferredSpeechRate.value = rate);
    void getPreferredSpeechPitch().then((pitch) => preferredSpeechPitch.value = pitch);
    void getPressMode().then((mode2) => pressMode.value = mode2);
    void getQuickAccess().then((buttons) => quickAccessButtons.value = buttons);
    void loadStoredSettings().then(() => settingsReady.value = true);
  }, []);
  const accessVersion = accessSettingsVersion.value;
  h$2(() => {
    void getAccessSettings().then((settings) => {
      access.value = settings;
      accessLoaded.value = true;
    });
  }, [accessVersion]);
  h$2(() => watchDeviceAccessibility(), []);
  const followDeviceNow = followDeviceAccessibilitySetting.signal.value && settingsReady.value;
  const device = deviceAccessibility.value;
  h$2(() => {
    if (!accessLoaded.value) return;
    const effective = followDeviceNow ? followDevice(access.value, device) : access.value;
    applyAccessSettings(effective, { boldText: followDeviceNow && device.boldText });
  }, [access.value, accessLoaded.value, followDeviceNow, device]);
  const linkSettings = appleLinkSetting.signal.value;
  const linkOn = linkSettings.enabled && /^\d{4}$/.test(linkSettings.code) && settingsReady.value;
  const linkRef = A(void 0);
  function handleLinkCommand(command) {
    if (mode.value !== "child") return;
    if (command.kind === "open") {
      screen.value = command.screen === "feelings" ? { name: "feelings" } : command.screen === "favourites" ? { name: "favourites" } : { name: command.screen };
    } else {
      void trafficSetting.set({ ...trafficSetting.signal.value, status: command.status });
    }
  }
  h$2(() => {
    if (!linkOn) return void 0;
    const session = startLink(linkSettings.code, handleLinkCommand, (count) => linkPeers.value = count);
    linkRef.current = session;
    return () => {
      session?.stop();
      linkRef.current = void 0;
      linkPeers.value = 0;
    };
  }, [linkOn, linkSettings.code]);
  const favouritesNow = favouritesVersion.value;
  const planNow = dayPlanVersion.value;
  const trafficNow = trafficSetting.signal.value.status;
  const linkedScreen = screen.value.name;
  h$2(() => {
    if (!linkRef.current) return;
    void Promise.all([getFavourites(), getEffectiveDayPlan(getDateString(/* @__PURE__ */ new Date()))]).then(([favourites, { plan }]) => {
      linkRef.current?.publish(buildLinkState({ screen: linkedScreen, traffic: trafficNow, plan: plan.activities, favourites }));
    });
  }, [linkOn, favouritesNow, planNow, trafficNow, linkedScreen]);
  const buzzNow = pressBuzzSetting.signal.value && settingsReady.value;
  h$2(() => buzzNow ? buzzOnPress() : void 0, [buzzNow]);
  const screenName = screen.value.name;
  h$2(() => {
    if (firstRunDone.value) void recordActivity("screen", SCREEN_LABELS[screenName]);
  }, [screenName, firstRunDone.value]);
  const profile = userProfileSetting.signal.value;
  h$2(() => {
    document.title = deviceTitle(profile);
  }, [profile]);
  const symbolStyle = symbolStyleSetting.signal.value;
  const labelStyle = labelStyleSetting.signal.value;
  h$2(() => {
    applySymbolStyle(symbolStyle);
  }, [symbolStyle]);
  h$2(() => {
    applyLabelStyle(labelStyle);
  }, [labelStyle]);
  const theme = themeSetting.signal.value;
  h$2(() => {
    applyTheme(theme, access.value.highContrast !== "off");
  }, [theme, access.value.highContrast]);
  h$2(() => {
    function handleKeyDown(event) {
      if (access.value.scanningMode === "off") return;
      if (gridScanningActive.count > 0) return;
      if (event.code === "Space") {
        event.preventDefault();
        focusNext();
      }
    }
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, []);
  function goHome() {
    screen.value = { name: "home" };
  }
  function handleHomeSelect(tile) {
    screen.value = { name: tile };
  }
  function handleQuickAccess(target) {
    if (target === "help") {
      screen.value = { name: "feelings", tab: "help" };
      return;
    }
    screen.value = { name: target };
  }
  function openParentModeGate() {
    pinGateOpen.value = "parent";
  }
  function renderScreen() {
    switch (screen.value.name) {
      case "home":
        return /* @__PURE__ */ u$1(HomeScreen, { onSelect: handleHomeSelect });
      case "talk":
        return /* @__PURE__ */ u$1(TalkScreen, { onExit: goHome });
      case "keyboard":
        return /* @__PURE__ */ u$1(KeyboardScreen, {});
      case "myday":
        return /* @__PURE__ */ u$1(MyDayScreen, {});
      case "mypages":
        return /* @__PURE__ */ u$1(MyPagesScreen, { onExit: goHome });
      case "firstthen":
        return /* @__PURE__ */ u$1(FirstThenScreen, {});
      case "game":
        return /* @__PURE__ */ u$1(GamesScreen, {});
      case "draw":
        return /* @__PURE__ */ u$1(DrawScreen, {});
      case "body":
        return /* @__PURE__ */ u$1(MyBodyScreen, {});
      case "music":
        return /* @__PURE__ */ u$1(MusicScreen, {});
      case "traffic":
        return /* @__PURE__ */ u$1(TrafficScreen, {});
      case "feelings":
        return /* @__PURE__ */ u$1(
          FeelingsHelpScreen,
          {
            tab: screen.value.tab ?? "feelings",
            onTabChange: (tab) => screen.value = { name: "feelings", tab }
          }
        );
      case "favourites":
        return /* @__PURE__ */ u$1(
          FavouritesScreen,
          {
            tab: screen.value.tab ?? "favourites",
            onTabChange: (tab) => screen.value = { name: "favourites", tab }
          }
        );
    }
  }
  if (firstRunDone.value === null || !settingsReady.value) {
    return /* @__PURE__ */ u$1(SplashScreen, {});
  }
  if (!firstRunDone.value) {
    return /* @__PURE__ */ u$1(FirstRunWizard, { onComplete: () => firstRunDone.value = true });
  }
  if (mode.value === "school") {
    return /* @__PURE__ */ u$1(
      SchoolModeScreen,
      {
        onExit: () => {
          mode.value = "child";
          void recordActivity("adult", `Closed ${SCHOOL_MODE_NAME}`);
        }
      }
    );
  }
  if (mode.value === "parent") {
    return /* @__PURE__ */ u$1(
      ParentModeScreen,
      {
        onExit: () => {
          mode.value = "child";
          void recordActivity("adult", `Closed ${modeName()}`);
        }
      }
    );
  }
  if (lostModeSetting.signal.value.on) {
    return /* @__PURE__ */ u$1(LostModeScreen, {});
  }
  return /* @__PURE__ */ u$1("div", { class: "app-shell", children: [
    /* @__PURE__ */ u$1(QuickAccessBar, { onNavigate: handleQuickAccess }),
    /* @__PURE__ */ u$1("button", { type: "button", class: "give-me-time-bar", onClick: pressGiveMeTime, children: "Give me time" }),
    /* @__PURE__ */ u$1("div", { class: "app-shell__toolbar", children: [
      screen.value.name !== "home" && /* @__PURE__ */ u$1("button", { type: "button", class: "home-button", onClick: goHome, children: [
        /* @__PURE__ */ u$1("span", { "aria-hidden": "true", children: "←" }),
        " Home"
      ] }),
      profile.showOnScreen && (profile.deviceName.trim() || profile.name.trim()) && /* @__PURE__ */ u$1("span", { class: "app-shell__device-name", children: [
        profile.emoji && /* @__PURE__ */ u$1("span", { "aria-hidden": "true", children: [
          profile.emoji,
          " "
        ] }),
        deviceTitle(profile)
      ] }),
      /* @__PURE__ */ u$1(TrafficChip, {}),
      /* @__PURE__ */ u$1(MedicalInfoButton, {}),
      /* @__PURE__ */ u$1(AboutMeButton, {}),
      /* @__PURE__ */ u$1("button", { type: "button", class: "parent-mode-button", onClick: openParentModeGate, children: modeName() }),
      schoolModeSetting.signal.value && /* @__PURE__ */ u$1("button", { type: "button", class: "school-mode-button", onClick: () => pinGateOpen.value = "school", children: SCHOOL_MODE_NAME })
    ] }),
    /* @__PURE__ */ u$1("main", { class: "app-shell__screen", children: renderScreen() }),
    pinGateOpen.value && /* @__PURE__ */ u$1("div", { class: "pin-gate-overlay", children: /* @__PURE__ */ u$1(
      PinGate,
      {
        kind: pinGateOpen.value,
        onUnlock: () => {
          const which = pinGateOpen.value;
          pinGateOpen.value = null;
          mode.value = which === "school" ? "school" : "parent";
          void recordActivity("adult", `Opened ${which === "school" ? SCHOOL_MODE_NAME : modeName()}`);
        },
        onCancel: () => pinGateOpen.value = null
      }
    ) })
  ] });
}
const scriptRel = /* @__PURE__ */ (function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
})();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p2) => Promise.resolve(p2).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep, importerUrl);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (!!importerUrl) for (let i$12 = links.length - 1; i$12 >= 0; i$12--) {
        const link$1 = links[i$12];
        if (link$1.href === dep && (!isCss || link$1.rel === "stylesheet")) return;
      }
      else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$12 = new Event("vite:preloadError", { cancelable: true });
    e$12.payload = err$2;
    window.dispatchEvent(e$12);
    if (!e$12.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
function today() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function buildNativeBridge(shell, platform, version) {
  const saved = (ok) => ok ? { ok: true } : { ok: false };
  const opened = (result) => result.ok && typeof result.data === "string" ? { ok: true, data: result.data } : { ok: false };
  return {
    versions: { app: version },
    platform,
    // A phone or tablet app is always full screen, and starts only when it is opened.
    capabilities: { fullscreen: false, startup: false, deviceAccessibility: true, haptics: true, link: true },
    parentMode: {
      setFullscreen: async () => void 0,
      isFullscreen: async () => true
    },
    backup: {
      save: async (data) => {
        try {
          return saved((await shell.saveFile({ data, name: `rugged-speech-backup-${today()}.mwbackup` })).ok);
        } catch {
          return { ok: false };
        }
      },
      restore: async () => {
        try {
          return opened(await shell.openFile({ extensions: ["mwbackup"] }));
        } catch {
          return { ok: false };
        }
      }
    },
    files: {
      save: async (data, options) => {
        try {
          return saved((await shell.saveFile({ data, name: options.suggestedName })).ok);
        } catch {
          return { ok: false };
        }
      },
      open: async (options) => {
        try {
          return opened(await shell.openFile({ extensions: options.extensions }));
        } catch {
          return { ok: false };
        }
      }
    },
    startup: {
      getOpenAtLogin: async () => false,
      setOpenAtLogin: async () => void 0
    },
    print: () => shell.printPage(),
    deviceAccessibility: () => shell.accessibility(),
    haptic: () => shell.haptic(),
    link: {
      start: (code) => shell.linkStart({ code }),
      stop: () => shell.linkStop(),
      send: (message) => shell.linkSend({ json: JSON.stringify(message) }),
      inbox: async () => {
        const { messages, peers } = await shell.linkInbox();
        const parsed2 = [];
        for (const raw of messages) {
          try {
            const value = JSON.parse(raw);
            if (typeof value === "object" && value !== null && typeof value.type === "string") {
              parsed2.push(value);
            }
          } catch {
          }
        }
        return { messages: parsed2, peers };
      }
    }
  };
}
function nativePlatform() {
  const capacitor = window.Capacitor;
  if (!capacitor?.isNativePlatform?.()) return void 0;
  return capacitor.getPlatform?.() === "ios" ? "ios" : void 0;
}
async function installNativeBridge() {
  if (window.myWords) return;
  const platform = nativePlatform();
  if (!platform) return;
  const { registerPlugin } = await __vitePreload(async () => {
    const { registerPlugin: registerPlugin2 } = await import("./index-ZyNCyJiO.js");
    return { registerPlugin: registerPlugin2 };
  }, true ? [] : void 0, import.meta.url);
  const shell = registerPlugin("RuggedNative");
  let version = "0.0.0";
  try {
    version = (await shell.info()).version;
  } catch {
  }
  window.myWords = buildNativeBridge(shell, platform, version);
  document.documentElement.dataset["platform"] = platform;
}
void installNativeBridge().then(() => {
  R(/* @__PURE__ */ u$1(App, {}), document.getElementById("root"));
});
