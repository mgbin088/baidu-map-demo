var BMapLib = window.BMapLib = BMapLib || {};
var BMAP_DRAWING_MARKER = "marker", BMAP_DRAWING_POLYLINE = "polyline", BMAP_DRAWING_CIRCLE = "circle",
  BMAP_DRAWING_RECTANGLE = "rectangle", BMAP_DRAWING_POLYGON = "polygon";
(function () {
  var b = b || {guid: "$BAIDU$"};
  (function () {
    window[b.guid] = {};
    b.extend = function (i, g) {
      for (var h in g) {
        if (g.hasOwnProperty(h)) {
          i[h] = g[h]
        }
      }
      return i
    };
    b.lang = b.lang || {};
    b.lang.guid = function () {
      return "TANGRAM__" + (window[b.guid]._counter++).toString(36)
    };
    window[b.guid]._counter = window[b.guid]._counter || 1;
    window[b.guid]._instances = window[b.guid]._instances || {};
    b.lang.Class = function (g) {
      this.guid = g || b.lang.guid();
      window[b.guid]._instances[this.guid] = this
    };
    window[b.guid]._instances = window[b.guid]._instances || {};
    b.lang.isString = function (g) {
      return "[object String]" == Object.prototype.toString.call(g)
    };
    b.lang.isFunction = function (g) {
      return "[object Function]" == Object.prototype.toString.call(g)
    };
    b.lang.Class.prototype.toString = function () {
      return "[object " + (this._className || "Object") + "]"
    };
    b.lang.Class.prototype.dispose = function () {
      delete window[b.guid]._instances[this.guid];
      for (var g in this) {
        if (!b.lang.isFunction(this[g])) {
          delete this[g]
        }
      }
      this.disposed = true
    };
    b.lang.Event = function (g, h) {
      this.type = g;
      this.returnValue = true;
      this.target = h || null;
      this.currentTarget = null
    };
    b.lang.Class.prototype.addEventListener = function (j, i, h) {
      if (!b.lang.isFunction(i)) {
        return
      }
      !this.__listeners && (this.__listeners = {});
      var g = this.__listeners, k;
      if (typeof h == "string" && h) {
        if (/[^\w\-]/.test(h)) {
          throw ("nonstandard key:" + h)
        } else {
          i.hashCode = h;
          k = h
        }
      }
      j.indexOf("on") != 0 && (j = "on" + j);
      typeof g[j] != "object" && (g[j] = {});
      k = k || b.lang.guid();
      i.hashCode = k;
      g[j][k] = i
    };
    b.lang.Class.prototype.removeEventListener = function (i, h) {
      if (b.lang.isFunction(h)) {
        h = h.hashCode
      } else {
        if (!b.lang.isString(h)) {
          return
        }
      }
      !this.__listeners && (this.__listeners = {});
      i.indexOf("on") != 0 && (i = "on" + i);
      var g = this.__listeners;
      if (!g[i]) {
        return
      }
      g[i][h] && delete g[i][h]
    };
    b.lang.Class.prototype.dispatchEvent = function (k, g) {
      if (b.lang.isString(k)) {
        k = new b.lang.Event(k)
      }
      !this.__listeners && (this.__listeners = {});
      g = g || {};
      for (var j in g) {
        k[j] = g[j]
      }
      var j, h = this.__listeners, l = k.type;
      k.target = k.target || this;
      k.currentTarget = this;
      l.indexOf("on") != 0 && (l = "on" + l);
      b.lang.isFunction(this[l]) && this[l].apply(this, arguments);
      if (typeof h[l] == "object") {
        for (j in h[l]) {
          h[l][j].apply(this, arguments)
        }
      }
      return k.returnValue
    };
    b.lang.inherits = function (m, k, j) {
      var i, l, g = m.prototype, h = new Function();
      h.prototype = k.prototype;
      l = m.prototype = new h();
      for (i in g) {
        l[i] = g[i]
      }
      m.prototype.constructor = m;
      m.superClass = k.prototype;
      if ("string" == typeof j) {
        l._className = j
      }
    };
    b.dom = b.dom || {};
    b._g = b.dom._g = function (g) {
      if (b.lang.isString(g)) {
        return document.getElementById(g)
      }
      return g
    };
    b.g = b.dom.g = function (g) {
      if ("string" == typeof g || g instanceof String) {
        return document.getElementById(g)
      } else {
        if (g && g.nodeName && (g.nodeType == 1 || g.nodeType == 9)) {
          return g
        }
      }
      return null
    };
    b.insertHTML = b.dom.insertHTML = function (j, g, i) {
      j = b.dom.g(j);
      var h, k;
      if (j.insertAdjacentHTML) {
        j.insertAdjacentHTML(g, i)
      } else {
        h = j.ownerDocument.createRange();
        g = g.toUpperCase();
        if (g == "AFTERBEGIN" || g == "BEFOREEND") {
          h.selectNodeContents(j);
          h.collapse(g == "AFTERBEGIN")
        } else {
          k = g == "BEFOREBEGIN";
          h[k ? "setStartBefore" : "setEndAfter"](j);
          h.collapse(k)
        }
        h.insertNode(h.createContextualFragment(i))
      }
      return j
    };
    b.ac = b.dom.addClass = function (n, o) {
      n = b.dom.g(n);
      var h = o.split(/\s+/), g = n.className, m = " " + g + " ", k = 0, j = h.length;
      for (; k < j; k++) {
        if (m.indexOf(" " + h[k] + " ") < 0) {
          g += (g ? " " : "") + h[k]
        }
      }
      n.className = g;
      return n
    };
    b.event = b.event || {};
    b.event._listeners = b.event._listeners || [];
    b.on = b.event.on = function (h, k, m) {
      k = k.replace(/^on/i, "");
      h = b._g(h);
      var l = function (o) {
        m.call(h, o)
      }, g = b.event._listeners, j = b.event._eventFilter, n, i = k;
      k = k.toLowerCase();
      if (j && j[k]) {
        n = j[k](h, k, l);
        i = n.type;
        l = n.listener
      }
      if (h.addEventListener) {
        h.addEventListener(i, l, false)
      } else {
        if (h.attachEvent) {
          h.attachEvent("on" + i, l)
        }
      }
      g[g.length] = [h, k, m, l, i];
      return h
    };
    b.un = b.event.un = function (i, l, h) {
      i = b._g(i);
      l = l.replace(/^on/i, "").toLowerCase();
      var o = b.event._listeners, j = o.length, k = !h, n, m, g;
      while (j--) {
        n = o[j];
        if (n[1] === l && n[0] === i && (k || n[2] === h)) {
          m = n[4];
          g = n[3];
          if (i.removeEventListener) {
            i.removeEventListener(m, g, false)
          } else {
            if (i.detachEvent) {
              i.detachEvent("on" + m, g)
            }
          }
          o.splice(j, 1)
        }
      }
      return i
    };
    b.getEvent = b.event.getEvent = function (g) {
      return window.event || g
    };
    b.getTarget = b.event.getTarget = function (g) {
      var g = b.getEvent(g);
      return g.target || g.srcElement
    };
    b.preventDefault = b.event.preventDefault = function (g) {
      var g = b.getEvent(g);
      if (g.preventDefault) {
        g.preventDefault()
      } else {
        g.returnValue = false
      }
    };
    b.stopBubble = b.event.stopBubble = function (g) {
      g = b.getEvent(g);
      g.stopPropagation ? g.stopPropagation() : g.cancelBubble = true
    };
    b.browser = b.browser || {};
    if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
      b.browser.ie = b.ie = document.documentMode || +RegExp["\x241"]
    }
  })();
  var d = BMapLib.DrawingManager = function (h, g) {
    if (!h) {
      return
    }
    c.push(this);
    g = g || {};
    this._initialize(h, g)
  };
  b.lang.inherits(d, b.lang.Class, "DrawingManager");
  d.prototype.open = function () {
    if (this._isOpen == true) {
      return true
    }
    f(this);
    this._open()
  };
  d.prototype.close = function () {
    if (this._isOpen == false) {
      return true
    }
    var g = this;
    this._close();
    setTimeout(function () {
      g._map.enableDoubleClickZoom()
    }, 2000)
  };
  d.prototype.setDrawingMode = function (g) {
    if (this._drawingType != g) {
      f(this);
      this._setDrawingMode(g)
    }
  };
  d.prototype.getDrawingMode = function () {
    return this._drawingType
  };
  d.prototype.enableCalculate = function () {
    this._enableCalculate = true;
    this._addGeoUtilsLibrary()
  };
  d.prototype.disableCalculate = function () {
    this._enableCalculate = false
  };
  d.prototype._initialize = function (h, g) {
    this._map = h;
    this._opts = g;
    this._drawingType = g.drawingMode || BMAP_DRAWING_MARKER;
    if (g.enableDrawingTool) {
      var i = new a(this, g.drawingToolOptions);
      this._drawingTool = i;
      h.addControl(i)
    }
    if (g.enableCalculate === true) {
      this.enableCalculate()
    } else {
      this.disableCalculate()
    }
    this._isOpen = !!(g.isOpen === true);
    if (this._isOpen) {
      this._open()
    }
    this.markerOptions = g.markerOptions || {};
    this.circleOptions = g.circleOptions || {};
    this.polylineOptions = g.polylineOptions || {};
    this.polygonOptions = g.polygonOptions || {};
    this.rectangleOptions = g.rectangleOptions || {};
    this.controlButton = g.controlButton == "right" ? "right" : "left"
  }, d.prototype._open = function () {
    this._isOpen = true;
    if (!this._mask) {
      this._mask = new e()
    }
    this._map.addOverlay(this._mask);
    this._setDrawingMode(this._drawingType)
  };
  d.prototype._setDrawingMode = function (g) {
    this._drawingType = g;
    if (this._isOpen) {
      this._mask.__listeners = {};
      switch (g) {
        case BMAP_DRAWING_MARKER:
          this._bindMarker();
          break;
        case BMAP_DRAWING_CIRCLE:
          this._bindCircle();
          break;
        case BMAP_DRAWING_POLYLINE:
        case BMAP_DRAWING_POLYGON:
          this._bindPolylineOrPolygon();
          break;
        case BMAP_DRAWING_RECTANGLE:
          this._bindRectangle();
          break
      }
    }
    if (this._drawingTool && this._isOpen) {
      this._drawingTool.setStyleByDrawingMode(g)
    }
  };
  d.prototype._close = function () {
    this._isOpen = false;
    if (this._mask) {
      this._map.removeOverlay(this._mask)
    }
    if (this._drawingTool) {
      this._drawingTool.setStyleByDrawingMode("hander")
    }
  };
  d.prototype._bindMarker = function () {
    var i = this, j = this._map, h = this._mask;
    var g = function (l) {
      var k = new BMap.Marker(l.point, i.markerOptions);
      j.addOverlay(k);
      i._dispatchOverlayComplete(k)
    };
    h.addEventListener("click", g)
  };
  d.prototype._bindCircle = function () {
    var m = this, h = this._map, o = this._mask, i = null, k = null;
    var j = function (p) {
      if (m.controlButton == "right" && (p.button == 1 || p.button == 0)) {
        return
      }
      k = p.point;
      i = new BMap.Circle(k, 0, m.circleOptions);
      h.addOverlay(i);
      o.enableEdgeMove();
      o.addEventListener("mousemove", n);
      b.on(document, "mouseup", l)
    };
    var n = function (p) {
      i.setRadius(m._map.getDistance(k, p.point))
    };
    var l = function (q) {
      var p = m._calculate(i, q.point);
      m._dispatchOverlayComplete(i, p);
      k = null;
      o.disableEdgeMove();
      o.removeEventListener("mousemove", n);
      b.un(document, "mouseup", l)
    };
    var g = function (p) {
      b.preventDefault(p);
      b.stopBubble(p);
      if (m.controlButton == "right" && p.button == 1) {
        return
      }
      if (k == null) {
        j(p)
      }
    };
    o.addEventListener("mousedown", g)
  };
  d.prototype._bindPolylineOrPolygon = function () {
    var k = this, m = this._map, h = this._mask, j = [], n = null;
    overlay = null, isBinded = false;
    var l = function (o) {
      if (k.controlButton == "right" && (o.button == 1 || o.button == 0)) {
        return
      }
      j.push(o.point);
      n = j.concat(j[j.length - 1]);
      if (j.length == 1) {
        if (k._drawingType == BMAP_DRAWING_POLYLINE) {
          overlay = new BMap.Polyline(n, k.polylineOptions)
        } else {
          if (k._drawingType == BMAP_DRAWING_POLYGON) {
            overlay = new BMap.Polygon(n, k.polygonOptions)
          }
        }
        m.addOverlay(overlay)
      } else {
        overlay.setPath(n)
      }
      if (!isBinded) {
        isBinded = true;
        h.enableEdgeMove();
        h.addEventListener("mousemove", i);
        h.addEventListener("dblclick", g)
      }
    };
    var i = function (o) {
      overlay.setPositionAt(n.length - 1, o.point)
    };
    var g = function (p) {
      b.stopBubble(p);
      isBinded = false;
      h.disableEdgeMove();
      h.removeEventListener("mousedown", l);
      h.removeEventListener("mousemove", i);
      h.removeEventListener("dblclick", g);
      if (k.controlButton == "right") {
        j.push(p.point)
      } else {
        if (b.ie <= 8) {
        } else {
          j.pop()
        }
      }
      overlay.setPath(j);
      var o = k._calculate(overlay, j.pop());
      k._dispatchOverlayComplete(overlay, o);
      j.length = 0;
      n.length = 0;
      k.close()
    };
    h.addEventListener("mousedown", l);
    h.addEventListener("dblclick", function (o) {
      b.stopBubble(o)
    })
  };
  d.prototype._bindRectangle = function () {
    var k = this, n = this._map, h = this._mask, i = null, j = null;
    var m = function (p) {
      b.stopBubble(p);
      b.preventDefault(p);
      if (k.controlButton == "right" && (p.button == 1 || p.button == 0)) {
        return
      }
      j = p.point;
      var o = j;
      i = new BMap.Polygon(k._getRectanglePoint(j, o), k.rectangleOptions);
      n.addOverlay(i);
      h.enableEdgeMove();
      h.addEventListener("mousemove", l);
      b.on(document, "mouseup", g)
    };
    var l = function (o) {
      i.setPath(k._getRectanglePoint(j, o.point))
    };
    var g = function (p) {
      var o = k._calculate(i, i.getPath()[2]);
      k._dispatchOverlayComplete(i, o);
      j = null;
      h.disableEdgeMove();
      h.removeEventListener("mousemove", l);
      b.un(document, "mouseup", g)
    };
    h.addEventListener("mousedown", m)
  };
  d.prototype._calculate = function (j, i) {
    var h = {data: 0, label: null};
    if (this._enableCalculate && BMapLib.GeoUtils) {
      var k = j.toString();
      switch (k) {
        case"[object Polyline]":
          h.data = BMapLib.GeoUtils.getPolylineDistance(j);
          break;
        case"[object Polygon]":
          h.data = BMapLib.GeoUtils.getPolygonArea(j);
          break;
        case"[object Circle]":
          var g = j.getRadius();
          h.data = Math.PI * g * g;
          break
      }
      if (!h.data || h.data < 0) {
        h.data = 0
      } else {
        h.data = h.data.toFixed(2)
      }
      h.label = this._addLabel(i, h.data)
    }
    return h
  };
  d.prototype._addGeoUtilsLibrary = function () {
    if (!BMapLib.GeoUtils) {
      var g = document.createElement("script");
      g.setAttribute("type", "text/javascript");
      g.setAttribute("src", "http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js");
      document.body.appendChild(g)
    }
  };
  d.prototype._addLabel = function (g, i) {
    var h = new BMap.Label(i, {position: g});
    this._map.addOverlay(h);
    return h
  };
  d.prototype._getRectanglePoint = function (h, g) {
    return [new BMap.Point(h.lng, h.lat), new BMap.Point(g.lng, h.lat), new BMap.Point(g.lng, g.lat), new BMap.Point(h.lng, g.lat)]
  };
  d.prototype._dispatchOverlayComplete = function (h, i) {
    var g = {"overlay": h, "drawingMode": this._drawingType};
    if (i) {
      g.calculate = i.data || null;
      g.label = i.label || null
    }
    this.dispatchEvent(this._drawingType + "complete", h);
    this.dispatchEvent("overlaycomplete", g)
  };

  function e() {
    this._enableEdgeMove = false
  }

  e.prototype = new BMap.Overlay();
  e.prototype.dispatchEvent = b.lang.Class.prototype.dispatchEvent;
  e.prototype.addEventListener = b.lang.Class.prototype.addEventListener;
  e.prototype.removeEventListener = b.lang.Class.prototype.removeEventListener;
  e.prototype.initialize = function (i) {
    var h = this;
    this._map = i;
    var j = this.container = document.createElement("div");
    var g = this._map.getSize();
    j.style.cssText = "position:absolute;background:url(about:blank);cursor:crosshair;width:" + g.width + "px;height:" + g.height + "px";
    this._map.addEventListener("resize", function (k) {
      h._adjustSize(k.size)
    });
    this._map.getPanes().floatPane.appendChild(j);
    this._bind();
    return j
  };
  e.prototype.draw = function () {
    var i = this._map, g = i.pixelToPoint(new BMap.Pixel(0, 0)), h = i.pointToOverlayPixel(g);
    this.container.style.left = h.x + "px";
    this.container.style.top = h.y + "px"
  };
  e.prototype.enableEdgeMove = function () {
    this._enableEdgeMove = true
  };
  e.prototype.disableEdgeMove = function () {
    clearInterval(this._edgeMoveTimer);
    this._enableEdgeMove = false
  };
  e.prototype._bind = function () {
    var l = this, g = this._map, h = this.container, m = null, n = null;
    var k = function (p) {
      return {x: p.clientX, y: p.clientY}
    };
    var j = function (r) {
      var q = r.type;
      r = b.getEvent(r);
      point = l.getDrawPoint(r);
      var s = function (t) {
        r.point = point;
        l.dispatchEvent(r)
      };
      if (q == "mousedown") {
        m = k(r)
      }
      var p = k(r);
      if (q == "click") {
        if (Math.abs(p.x - m.x) < 5 && Math.abs(p.y - m.y) < 5) {
          if (!n || !(Math.abs(p.x - n.x) < 5 && Math.abs(p.y - n.y) < 5)) {
            s("click");
            n = k(r)
          } else {
            n = null
          }
        }
      } else {
        s(q)
      }
    };
    var o = ["click", "mousedown", "mousemove", "mouseup", "dblclick"], i = o.length;
    while (i--) {
      b.on(h, o[i], j)
    }
    b.on(h, "mousemove", function (p) {
      if (l._enableEdgeMove) {
        l.mousemoveAction(p)
      }
    })
  };
  e.prototype.mousemoveAction = function (n) {
    function g(s) {
      var r = s.clientX, q = s.clientY;
      if (s.changedTouches) {
        r = s.changedTouches[0].clientX;
        q = s.changedTouches[0].clientY
      }
      return new BMap.Pixel(r, q)
    }

    var h = this._map, o = this, i = h.pointToPixel(this.getDrawPoint(n)), k = g(n), l = k.x - i.x, j = k.y - i.y;
    i = new BMap.Pixel((k.x - l), (k.y - j));
    this._draggingMovePixel = i;
    var p = h.pixelToPoint(i), m = {pixel: i, point: p};
    this._panByX = this._panByY = 0;
    if (i.x <= 20 || i.x >= h.width - 20 || i.y <= 50 || i.y >= h.height - 10) {
      if (i.x <= 20) {
        this._panByX = 8
      } else {
        if (i.x >= h.width - 20) {
          this._panByX = -8
        }
      }
      if (i.y <= 50) {
        this._panByY = 8
      } else {
        if (i.y >= h.height - 10) {
          this._panByY = -8
        }
      }
      if (!this._edgeMoveTimer) {
        this._edgeMoveTimer = setInterval(function () {
          h.panBy(o._panByX, o._panByY, {"noAnimation": true})
        }, 30)
      }
    } else {
      if (this._edgeMoveTimer) {
        clearInterval(this._edgeMoveTimer);
        this._edgeMoveTimer = null
      }
    }
  };
  e.prototype._adjustSize = function (g) {
    this.container.style.width = g.width + "px";
    this.container.style.height = g.height + "px"
  };
  e.prototype.getDrawPoint = function (l) {
    var k = this._map, j = b.getTarget(l), h = l.offsetX || l.layerX || 0, m = l.offsetY || l.layerY || 0;
    if (j.nodeType != 1) {
      j = j.parentNode
    }
    while (j && j != k.getContainer()) {
      if (!(j.clientWidth == 0 && j.clientHeight == 0 && j.offsetParent && j.offsetParent.nodeName == "TD")) {
        h += j.offsetLeft || 0;
        m += j.offsetTop || 0
      }
      j = j.offsetParent
    }
    var i = new BMap.Pixel(h, m);
    var g = k.pixelToPoint(i);
    return g
  };

  function a(h, g) {
    this.drawingManager = h;
    g = this.drawingToolOptions = g || {};
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = new BMap.Size(10, 10);
    this.defaultDrawingModes = [BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYLINE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE];
    if (g.drawingModes) {
      this.drawingModes = g.drawingModes
    } else {
      this.drawingModes = this.defaultDrawingModes
    }
    if (g.anchor) {
      this.setAnchor(g.anchor)
    }
    if (g.offset) {
      this.setOffset(g.offset)
    }
  }

  a.prototype = new BMap.Control();
  a.prototype.initialize = function (i) {
    var h = this.container = document.createElement("div");
    h.className = "BMapLib_Drawing";
    var g = this.panel = document.createElement("div");
    g.className = "BMapLib_Drawing_panel";
    if (this.drawingToolOptions && this.drawingToolOptions.scale) {
      this._setScale(this.drawingToolOptions.scale)
    }
    h.appendChild(g);
    g.innerHTML = this._generalHtml();
    this._bind(g);
    i.getContainer().appendChild(h);
    return h
  };
  a.prototype._generalHtml = function (m) {
    var h = {};
    h["hander"] = "拖动地图";
    h[BMAP_DRAWING_MARKER] = "画点";
    h[BMAP_DRAWING_CIRCLE] = "画圆";
    h[BMAP_DRAWING_POLYLINE] = "画折线";
    h[BMAP_DRAWING_POLYGON] = "画多边形";
    h[BMAP_DRAWING_RECTANGLE] = "画矩形";
    var n = function (o, i) {
      return '<a class="' + o + '" drawingType="' + i + '" href="javascript:void(0)" title="' + h[i] + '" onfocus="this.blur()"></a>'
    };
    var k = [];
    k.push(n("BMapLib_box BMapLib_hander", "hander"));
    for (var j = 0, g = this.drawingModes.length;
         j < g; j++) {
      var l = "BMapLib_box BMapLib_" + this.drawingModes[j];
      if (j == g - 1) {
        l += " BMapLib_last"
      }
      k.push(n(l, this.drawingModes[j]))
    }
    return k.join("")
  };
  a.prototype._setScale = function (j) {
    var i = 390, g = 50, k = -parseInt((i - i * j) / 2, 10), h = -parseInt((g - g * j) / 2, 10);
    this.container.style.cssText = ["-moz-transform: scale(" + j + ");", "-o-transform: scale(" + j + ");", "-webkit-transform: scale(" + j + ");", "transform: scale(" + j + ");", "margin-left:" + k + "px;", "margin-top:" + h + "px;", "*margin-left:0px;", "*margin-top:0px;", "margin-left:0px\\0;", "margin-top:0px\\0;", "filter: progid:DXImageTransform.Microsoft.Matrix(", "M11=" + j + ",", "M12=0,", "M21=0,", "M22=" + j + ",", "SizingMethod='auto expand');"].join("")
  };
  a.prototype._bind = function (g) {
    var h = this;
    b.on(this.panel, "click", function (k) {
      var j = b.getTarget(k);
      var i = j.getAttribute("drawingType");
      h.setStyleByDrawingMode(i);
      h._bindEventByDraingMode(i)
    })
  };
  a.prototype.setStyleByDrawingMode = function (h) {
    if (!h) {
      return
    }
    var j = this.panel.getElementsByTagName("a");
    for (var k = 0, g = j.length; k < g; k++) {
      var m = j[k];
      if (m.getAttribute("drawingType") == h) {
        var l = "BMapLib_box BMapLib_" + h + "_hover";
        if (k == g - 1) {
          l += " BMapLib_last"
        }
        m.className = l
      } else {
        m.className = m.className.replace(/_hover/, "")
      }
    }
  };
  a.prototype._bindEventByDraingMode = function (g) {
    var i = this;
    var h = this.drawingManager;
    if (g == "hander") {
      h.close();
      h._map.enableDoubleClickZoom()
    } else {
      h.setDrawingMode(g);
      h.open();
      h._map.disableDoubleClickZoom()
    }
  };
  var c = [];

  function f(g) {
    var h = c.length;
    while (h--) {
      if (c[h] != g) {
        c[h].close()
      }
    }
  }
})();
