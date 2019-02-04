function EventDispatcher() {
  this.subscriptions = {}
}

function PkApiService() {
  this.apiService = new ApiService({
    baseURL: Onliner.secureProjectUrl('pk.api'),
  })
}

function PkServerService() {
  this.apiService = new ApiService({
    baseURL: Onliner.secureProjectUrl('r'),
  })
}

function OpenStreetMapApiService() {
  this.apiService = new ApiService({
    baseURL: '//nominatim.openstreetmap.org',
  })
}

function Tutorial(a) {
  ;(this.step = ko.observable(0)), (this.tutorialActive = ko.observable(!1)), (this.popup = a), this._initPopup()
}

function AuctionsAPI(a) {
  ;(this.key = a),
    (this.apiService = new ApiService({
      baseURL: Onliner.secureProjectUrl('auctions.api', '/auctions/' + a),
    }))
}

function AuctionsBid(a, b, c, d) {
  var e = this
  ;(this.dispatcher = d),
    (this.key = b),
    (this.settings = c
      ? {
          bid_min: parseFloat(c.bid_min),
          bid_step: parseFloat(c.bid_step),
          billing_period: c.billing_period,
        }
      : {}),
    (this.entityId = a.entity_id),
    (this.amount = {
      current: ko.observable(),
      next: ko.observable(),
      new: ko.observable(),
    }),
    (this.amount.newFormatted = ko.computed({
      read: function() {
        return format.formatPrice(e.amount.new(), 'BYN')
      },
      write: function(a) {
        ;(a = parseFloat(a.replace(/\,/g, '.'))), e.amount.new(isNaN(a) ? 0 : a), e.amount.new.notifySubscribers()
      },
      owner: this,
    })),
    (this.expiresIn = ko.observable(0)),
    (this.status = ko.observable('')),
    (this.lastUpdateTime = null),
    (this.actionStatus = ko.observable('')),
    (this.errors = ko.observableArray([])),
    (this.timer = null),
    (this.timerText = {
      short: ko.observable(''),
      full: ko.observable(''),
    }),
    (this.auctionsAPI = new AuctionsAPI(b, d)),
    this.setData(a),
    this.subscribe()
}

function Credentials(a) {
  ;(this.dispatcher = a),
    (this.token = null),
    (this.tokenType = null),
    (this.timer = null),
    (this.callbacks = []),
    (this.request = null)
}

function Popovers(a, b) {
  ;(a = a || {}),
    (this.selectors = a.selectors || {}),
    (this.modifiers = a.modifiers || {}),
    (this.dispatcher = b),
    this.attachEvents()
}

function Pagination(a) {
  ;(this.dispatcher = a || {}),
    (this.page = {
      current: ko.observable(1),
      last: ko.observable(1),
      limit: ko.observable(0),
    }),
    (this.total = ko.observable(0)),
    (this.pages = ko.computed(function() {
      return _.range(1, this.page.last() + 1)
    }, this)),
    (this.nextPageCounter = ko.computed(function() {
      var a = this.page.last(),
        b = this.page.limit()
      return a - this.page.current() <= 1 ? this.total() - b * (a - 1) : b
    }, this)),
    (this.isVisible = ko.observable(!1)),
    this.bindEvents()
}

function MapExtendedLayers(a, b) {
  ;(this.map = a),
    (this.mapConfig = b || {}),
    (this.features = {}),
    (this.postprocessing = []),
    this._initFeatures(),
    this._subscribe()
}

function PaginationDesktop(a) {
  Pagination.call(this, a),
    (this.nextPageText = ko.computed(function() {
      var a = this.nextPageCounter(),
        b = this.getNextText() + ' '
      return (
        1 !== a && (b += a + ' '),
        b + format.pluralForm(a, ['РѕР±СЉСЏРІР»РµРЅРёРµ', 'РѕР±СЉСЏРІР»РµРЅРёСЏ', 'РѕР±СЉСЏРІР»РµРЅРёР№'])
      )
    }, this)),
    (this.isActiveDropdown = ko.observable(!1)),
    (this.$list = $('.pagination-pages__list').eq(0)),
    this.subscribe()
}

function SearchApartments(a, b) {
  ;(this.dispatcher = b || {}),
    (this.isProcessing = ko.observable(!1)),
    (this.items = ko.observableArray([])),
    (this.total = ko.observable(null)),
    (this.defaultOrder = 'relevance'),
    (this.order = ko.observable('relevance')),
    (this.orderOptions = [
      {
        type: 'relevance',
        text: 'РђРєС‚СѓР°Р»СЊРЅС‹Рµ',
      },
      {
        type: 'created_at:desc',
        text: 'РќРѕРІС‹Рµ',
      },
      {
        type: 'price:asc',
        text: 'Р”РµС€С‘РІС‹Рµ',
      },
      {
        type: 'price:desc',
        text: 'Р”РѕСЂРѕРіРёРµ',
      },
      {
        type: 'area.total:desc',
        text: 'Р‘РѕР»СЊС€РёРµ',
      },
      {
        type: 'area.kitchen:desc',
        text: 'РЎ Р±РѕР»СЊС€РѕР№ РєСѓС…РЅРµР№',
      },
    ]),
    (this.isEmpty = ko.computed(function() {
      return 0 === this.total()
    }, this)),
    (this.hasError = ko.observable(!1))
}

function SearchAuctions(a, b, c, d, e) {
  var f = this
  ;(this.dispatcher = c),
    (this.tutorial = d),
    (this.settings = b
      ? {
          bid_min: parseFloat(b.bid_min.amount),
          bid_step: parseFloat(b.bid_step.amount),
          billing_period: b.billing_period,
        }
      : {}),
    (this.auctionsAPI = new AuctionsAPI('pk', c)),
    (this.accountUrl = Onliner.secureProjectUrl('profile', '/account')),
    (this.apartments = ko.observableArray()),
    (this.activeApartment = ko.observable()),
    (this.activeApartmentId = ko.observable()),
    (this.errors = ko.observableArray()),
    (this.isLoading = ko.observable(!1)),
    (this.isUpdating = ko.observable(!1)),
    (this.isAnimatedInput = ko.observable(!1)),
    (this.animationInputTimer = null),
    (this.bid = ko.observable()),
    (this.moneyPopup = e),
    c.subscribe(
      'auctions:update-apartments:complete',
      _.once(
        function() {
          var a = this.activeApartment()
          a && this.updateBid(a.id),
            this.subscribeObservables(),
            !_.any(f.apartments(), function(a) {
              return !!a.auction_amount()
            }) && this.tutorial.showTutorial()
        }.bind(this),
      ),
    ),
    this.initState(a),
    this.subscribe(),
    this._initMoneyPopup(),
    (this.pkApiService = new PkApiService())
}

function SearchFilter(a, b) {
  ;(this.collectors = {}),
    (this.dispatcher = b || {}),
    (this.isUsed = ko.observable(!1)),
    (this.isNew = ko.observable(!1)),
    (this.isOutermostFloor = ko.observable(!1)),
    (this.selectedFlatTypes = ko.observableArray([])),
    (this.priceInitial = {}),
    (this.areaInitial = {}),
    (this.yearInitial = {}),
    (this.price = {
      min: ko.observable(0),
      max: ko.observable(0),
    }),
    (this.area = {
      min: ko.observable(0),
      max: ko.observable(0),
    }),
    (this.building_year = {
      min: ko.observable(0),
      max: ko.observable(0),
    }),
    (this.resetSlider = {}),
    (this.setSlider = {}),
    (this.currency = ko.observable('usd')),
    (this.priceTriggerSkip = !0),
    (this.areaTriggerSkip = !0),
    (this.yearTriggerSkip = !0),
    (this.walling = ko.observableArray())
}

function SearchGeocoder(a) {
  ;(this.keyword = ko.observable('')),
    (this.hasForcedFocus = ko.observable(!1)),
    (this.list = ko.observableArray([])),
    (this.isActiveList = ko.observable(!1)),
    (this.activeSuggestIndex = ko.observable(null)),
    (this.isProcessing = ko.observable(!1)),
    (this.isLocationNotFound = ko.observable(!1)),
    (this.isVisibleList = ko.computed(function() {
      return this.isActiveList() && this.list().length
    }, this)),
    (this.dispatcher = a || {}),
    (this.geocoderInstance = new Geocoder()),
    this.subscribe()
}

function SearchMap(a, b, c) {
  var d = this,
    e = 'false' !== localStorage.getItem('mapAutosync')
  this._getMapConfiguration(function(a) {
    d.mapConfig = a
  }),
    (this.fullscreenModifier = 'arenda-main_fullscreen'),
    (this.$container = $('.arenda-main')),
    (this.containerId = a || ''),
    (this.dispatcher = c || {}),
    (this.map = null),
    (this.cluster = null),
    (this.accentIds = []),
    (this.collectionMarkers = {}),
    (this.initZoom = this.mapConfig.initZoom),
    (this.clusterPopup = null),
    (this.isProcessing = ko.observable(!1)),
    (this.total = ko.observable(0)),
    (this.autosync = ko.observable(!0)),
    this.autosync(null === e || e),
    (this.isActiveSyncButton = ko.observable(!1)),
    (this.isVisibleSyncButton = ko.computed(function() {
      var a = this.isActiveSyncButton() && !this.isProcessing() && !!this.total() && !this.autosync()
      return d.dispatcher.trigger('map-sync:changed', a), a
    }, this)),
    (this.onSyncButtonClick = _.debounce(function() {
      d.isProcessing() ||
        (d.isActiveSyncButton(!1),
        d.dispatcher.trigger('points:buttonclick', function() {
          d.$container.removeClass(d.fullscreenModifier)
        }))
    }, 100)),
    (this.autosync = ko.observable(!0)),
    this.autosync.subscribe(function(a) {
      try {
        localStorage.setItem('mapAutosync', a)
      } catch (a) {}
      c.trigger('map:synced:changed', a), d.isActiveSyncButton(!1)
    }),
    this.autosync(null === e || e),
    (this.initialBounds = null),
    (this.minMarkedZoom = 10),
    (this.pkApiService = new PkApiService())
}

function SearchRequest(a, b) {
  ;(this.params = {
    common: {},
  }),
    (this.requests = {}),
    (this.initialParams = {}),
    (this.dispatcher = a || {}),
    (this.synced = !0),
    (this.pkApiService = new PkApiService())
}

function SearchResponse(a) {
  this.dispatcher = a || {}
}

function SearchState(a, b) {
  ;(this.dispatcher = b), (this.state = _.isArray(a) ? {} : a), delete this.state.coordinates, this.subscribe()
}

function SearchApartmentsDesktop(a, b, c, d) {
  SearchApartments.call(this, a, c),
    (this.tutorial = d),
    (this.auctionsAPI = b),
    (this.activeIds = ko.observableArray([])),
    (this.pagination = new PaginationDesktop(c)),
    (this.autosync = ko.observable('false' !== localStorage.getItem('mapAutosync'))),
    (this.mapOutOfSync = ko.observable(!0)),
    (this.isAuctionsInitialized = ko.observable(!1)),
    (this.auctionsSettings = null),
    (this.auctionsSelectedApartment = ko.observable()),
    (this.isAuctionsSelectedApartmentInRange = ko.observable(!0)),
    (this.currentUserId = Credentials.getCurrentUserId()),
    this.initState(a),
    this.subscribe()
}

function SearchFilterDesktop(a, b) {
  ;(this.geocoder = new SearchGeocoderDesktop(b)),
    SearchFilter.call(this, a, b),
    this.initState(a),
    this.initCollectors(),
    this.subscribe()
}

function SearchGeocoderDesktop(a) {
  SearchGeocoder.call(this, a)
}

function SearchMapDesktop(a, b, c) {
  SearchMap.call(this, a, b, c),
    (this.popupTemplate = _.template(
      '<div class="map-popover <% if (processing) { %>map-popover_processing<% }%>"><div class="map-popover__inner"><div class="map-popover__content"><%= content %></div></div></div>',
    )),
    (this.popupMultipleTemplate = _.template(
      '<div class="map-popover <% if (processing) { %>map-popover_processing<% }%>"><div class="map-popover__inner"><div class="map-popover__content map-popover__content_multiple"><%= content %></div></div><% if (counter) { %><div class="map-popover__bar"><%= counter %></div><% } %></div>',
    )),
    (this.popupApartmentTemplate = _.template(
      '<a href="<%- url %>" class="classified classified_single" onclick="window.ga && window.ga(\'pk.send\', \'event\', \'РљР°СЂС‚Р°\', \'РџРµСЂРµС…РѕРґ РІ РѕР±СЉСЏРІР»РµРЅРёРµ\');"><span style="background-image: url(<%- photo %>)" class="classified__figure"><span class="classified__price classified__price_secondary"><span class="classified__price-value classified__price-value_complementary"><span><%- prices.usd %></span> <span class="classified__currency">$</span></span> </span><span class="classified__price classified__price_primary"><span class="classified__price-value classified__price-value_primary"><span><%- prices.byn %></span> <span class="classified__currency">СЂ.</span></span></span><span class="classified__top classified__top_time classified__top_time_up"><span class="classified__top-inner"><%- last_time_up %></span></span><% if (seller !== "РђРіРµРЅС‚СЃС‚РІРѕ") { %><span class="classified__top classified__top_type"><span class="classified__top-inner"><%- seller %></span></span><% } %></span><% if (auction_bid) { %><span class="classified__top classified__top_auction"><span class="classified__top-inner"><span class="classified__badge"></span></span></span><% } %></span><span class="classified__caption"><span class="classified__caption-line"><span class="classified__caption-item-aside"><span class="classified__caption-item-icon classified__caption-item-icon_stairs"></span><%- floor %> <span class="classified__complementary-symbol">/</span> <%- number_of_floors %></span><span class="classified__caption-item-main"><span class="classified__caption-item classified__caption-item_type classified__caption-item_type-count"><%- number_of_rooms %>Рє</span><span class="classified__caption-item classified__caption-item_type"><%- area.total %> <span class="classified__complementary-symbol">/</span> <%- area.living %> <span class="classified__complementary-symbol">/</span> <%- area.kitchen %>&nbsp;Рј<sup class="classified__sup">2</sup></span></span></span><span class="classified__caption-line"><span class="classified__caption-item"><%- address %></span></span></span></a>',
    )),
    (this.auctionsSelectedApartment = ko.observable()),
    this.initState(b),
    this.subscribe(),
    this.init()
}

function SearchRequestDesktop(a, b) {
  SearchRequest.call(this, a, b),
    this.subscribe(),
    this.setParams(
      {
        limit: 750,
      },
      'points',
    )
}
!(function(a) {
  'function' == typeof define && define.amd
    ? define(['jquery'], a)
    : 'object' == typeof module && module.exports
      ? (module.exports = a(require('jquery')))
      : a(window.jQuery)
})(function(a) {
  'use strict'

  function b(a) {
    var b = {}
    if (void 0 === a.selectionStart) {
      a.focus()
      var c = document.selection.createRange()
      ;(b.length = c.text.length),
        c.moveStart('character', -a.value.length),
        (b.end = c.text.length),
        (b.start = b.end - b.length)
    } else (b.start = a.selectionStart), (b.end = a.selectionEnd), (b.length = b.end - b.start)
    return b
  }

  function c(a, b, c) {
    if (void 0 === a.selectionStart) {
      a.focus()
      var d = a.createTextRange()
      d.collapse(!0), d.moveEnd('character', c), d.moveStart('character', b), d.select()
    } else (a.selectionStart = b), (a.selectionEnd = c)
  }

  function d(b, c) {
    a.each(c, function(a, d) {
      'function' == typeof d
        ? (c[a] = d(b, c, a))
        : 'function' == typeof b.autoNumeric[d] && (c[a] = b.autoNumeric[d](b, c, a))
    })
  }

  function e(a, b) {
    'string' == typeof a[b] && (a[b] *= 1)
  }

  function f(a, b) {
    d(a, b),
      (b.tagList = [
        'b',
        'caption',
        'cite',
        'code',
        'dd',
        'del',
        'div',
        'dfn',
        'dt',
        'em',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ins',
        'kdb',
        'label',
        'li',
        'output',
        'p',
        'q',
        's',
        'sample',
        'span',
        'strong',
        'td',
        'th',
        'u',
        'var',
      ])
    var c = b.vMax.toString().split('.'),
      f = b.vMin || 0 === b.vMin ? b.vMin.toString().split('.') : []
    if (
      (e(b, 'vMax'),
      e(b, 'vMin'),
      e(b, 'mDec'),
      (b.mDec = 'CHF' === b.mRound ? '2' : b.mDec),
      (b.allowLeading = !0),
      (b.aNeg = b.vMin < 0 ? '-' : ''),
      (c[0] = c[0].replace('-', '')),
      (f[0] = f[0].replace('-', '')),
      (b.mInt = Math.max(c[0].length, f[0].length, 1)),
      null === b.mDec)
    ) {
      var g = 0,
        h = 0
      c[1] && (g = c[1].length), f[1] && (h = f[1].length), (b.mDec = Math.max(g, h))
    }
    null === b.altDec &&
      b.mDec > 0 &&
      ('.' === b.aDec && ',' !== b.aSep ? (b.altDec = ',') : ',' === b.aDec && '.' !== b.aSep && (b.altDec = '.'))
    var i = b.aNeg ? '([-\\' + b.aNeg + ']?)' : '(-?)'
    ;(b.aNegRegAutoStrip = i),
      (b.skipFirstAutoStrip = new RegExp(
        i + '[^-' + (b.aNeg ? '\\' + b.aNeg : '') + '\\' + b.aDec + '\\d].*?(\\d|\\' + b.aDec + '\\d)',
      )),
      (b.skipLastAutoStrip = new RegExp('(\\d\\' + b.aDec + '?)[^\\' + b.aDec + '\\d]\\D*$'))
    var j = '-' + b.aNum + '\\' + b.aDec
    return (
      (b.allowedAutoStrip = new RegExp('[^' + j + ']', 'gi')),
      (b.numRegAutoStrip = new RegExp(
        i + '(?:\\' + b.aDec + '?(\\d+\\' + b.aDec + '\\d+)|(\\d*(?:\\' + b.aDec + '\\d*)?))',
      )),
      b
    )
  }

  function g(a, b, c) {
    if (b.aSign) for (; a.indexOf(b.aSign) > -1; ) a = a.replace(b.aSign, '')
    ;(a = a.replace(b.skipFirstAutoStrip, '$1$2')),
      (a = a.replace(b.skipLastAutoStrip, '$1')),
      (a = a.replace(b.allowedAutoStrip, '')),
      b.altDec && (a = a.replace(b.altDec, b.aDec))
    var d = a.match(b.numRegAutoStrip)
    if (((a = d ? [d[1], d[2], d[3]].join('') : ''), ('allow' === b.lZero || 'keep' === b.lZero) && 'strip' !== c)) {
      var e = [],
        f = ''
      ;(e = a.split(b.aDec)),
        e[0].indexOf('-') !== -1 && ((f = '-'), (e[0] = e[0].replace('-', ''))),
        e[0].length > b.mInt && '0' === e[0].charAt(0) && (e[0] = e[0].slice(1)),
        (a = f + e.join(b.aDec))
    }
    if ((c && 'deny' === b.lZero) || (c && 'allow' === b.lZero && b.allowLeading === !1)) {
      var g = '^' + b.aNegRegAutoStrip + '0*(\\d' + ('leading' === c ? ')' : '|$)')
      ;(g = new RegExp(g)), (a = a.replace(g, '$1$2'))
    }
    return a
  }

  function h(a, b) {
    if ('p' === b.pSign) {
      var c = b.nBracket.split(',')
      b.hasFocus || b.removeBrackets
        ? ((b.hasFocus && a.charAt(0) === c[0]) || (b.removeBrackets && a.charAt(0) === c[0])) &&
          ((a = a.replace(c[0], b.aNeg)), (a = a.replace(c[1], '')))
        : ((a = a.replace(b.aNeg, '')), (a = c[0] + a + c[1]))
    }
    return a
  }

  function i(a, b) {
    if (a) {
      var c = +a
      if (c < 1e-6 && c > -1)
        (a = +a),
          a < 1e-6 && a > 0 && ((a = (a + 10).toString()), (a = a.substring(1))),
          a < 0 && a > -1 && ((a = (a - 10).toString()), (a = '-' + a.substring(2))),
          (a = a.toString())
      else {
        var d = a.split('.')
        void 0 !== d[1] && (0 === +d[1] ? (a = d[0]) : ((d[1] = d[1].replace(/0*$/, '')), (a = d.join('.'))))
      }
    }
    return 'keep' === b.lZero ? a : a.replace(/^0*(\d)/, '$1')
  }

  function j(a, b, c) {
    return (
      b && '.' !== b && (a = a.replace(b, '.')),
      c && '-' !== c && (a = a.replace(c, '-')),
      a.match(/\d/) || (a += '0'),
      a
    )
  }

  function k(a, b, c) {
    return c && '-' !== c && (a = a.replace('-', c)), b && '.' !== b && (a = a.replace('.', b)), a
  }

  function l(a, b, c) {
    return '' === a || a === b.aNeg
      ? 'zero' === b.wEmpty
        ? a + '0'
        : 'sign' === b.wEmpty || c
          ? a + b.aSign
          : a
      : null
  }

  function m(a, b) {
    a = g(a, b)
    var c = a.replace(',', '.'),
      d = l(a, b, !0)
    if (null !== d) return d
    var e = ''
    e = 2 === b.dGroup ? /(\d)((\d)(\d{2}?)+)$/ : 4 === b.dGroup ? /(\d)((\d{4}?)+)$/ : /(\d)((\d{3}?)+)$/
    var f = a.split(b.aDec)
    b.altDec && 1 === f.length && (f = a.split(b.altDec))
    var i = f[0]
    if (b.aSep) for (; e.test(i); ) i = i.replace(e, '$1' + b.aSep + '$2')
    if (
      (0 !== b.mDec && f.length > 1
        ? (f[1].length > b.mDec && (f[1] = f[1].substring(0, b.mDec)), (a = i + b.aDec + f[1]))
        : (a = i),
      b.aSign)
    ) {
      var j = a.indexOf(b.aNeg) !== -1
      ;(a = a.replace(b.aNeg, '')), (a = 'p' === b.pSign ? b.aSign + a : a + b.aSign), j && (a = b.aNeg + a)
    }
    return c < 0 && null !== b.nBracket && (a = h(a, b)), a
  }

  function n(a, b) {
    ;(a = '' === a ? '0' : a.toString()), e(b, 'mDec'), 'CHF' === b.mRound && (a = (Math.round(20 * a) / 20).toString())
    var c = '',
      d = 0,
      f = '',
      g = 'boolean' == typeof b.aPad || null === b.aPad ? (b.aPad ? b.mDec : 0) : +b.aPad,
      h = function(a) {
        var b =
          0 === g
            ? /(\.(?:\d*[1-9])?)0*$/
            : 1 === g
              ? /(\.\d(?:\d*[1-9])?)0*$/
              : new RegExp('(\\.\\d{' + g + '}(?:\\d*[1-9])?)0*$')
        return (a = a.replace(b, '$1')), 0 === g && (a = a.replace(/\.$/, '')), a
      }
    '-' === a.charAt(0) && ((f = '-'), (a = a.replace('-', ''))),
      a.match(/^\d/) || (a = '0' + a),
      '-' === f && 0 === +a && (f = ''),
      ((+a > 0 && 'keep' !== b.lZero) || (a.length > 0 && 'allow' === b.lZero)) && (a = a.replace(/^0*(\d)/, '$1'))
    var i = a.lastIndexOf('.'),
      j = i === -1 ? a.length - 1 : i,
      k = a.length - 1 - j
    if (k <= b.mDec) {
      if (((c = a), k < g)) {
        i === -1 && (c += b.aDec)
        for (var l = '000000'; k < g; ) (l = l.substring(0, g - k)), (c += l), (k += l.length)
      } else k > g ? (c = h(c)) : 0 === k && 0 === g && (c = c.replace(/\.$/, ''))
      if ('CHF' !== b.mRound) return 0 === +c ? c : f + c
      'CHF' === b.mRound && ((i = c.lastIndexOf('.')), (a = c))
    }
    var m = i + b.mDec,
      n = +a.charAt(m + 1),
      o = a.substring(0, m + 1).split(''),
      p = '.' === a.charAt(m) ? a.charAt(m - 1) % 2 : a.charAt(m) % 2,
      q = !0
    if (
      (1 !== p && (p = 0 === p && a.substring(m + 2, a.length) > 0 ? 1 : 0),
      (n > 4 && 'S' === b.mRound) ||
        (n > 4 && 'A' === b.mRound && '' === f) ||
        (n > 5 && 'A' === b.mRound && '-' === f) ||
        (n > 5 && 's' === b.mRound) ||
        (n > 5 && 'a' === b.mRound && '' === f) ||
        (n > 4 && 'a' === b.mRound && '-' === f) ||
        (n > 5 && 'B' === b.mRound) ||
        (5 === n && 'B' === b.mRound && 1 === p) ||
        (n > 0 && 'C' === b.mRound && '' === f) ||
        (n > 0 && 'F' === b.mRound && '-' === f) ||
        (n > 0 && 'U' === b.mRound) ||
        'CHF' === b.mRound)
    )
      for (d = o.length - 1; d >= 0; d -= 1)
        if ('.' !== o[d]) {
          if ('CHF' === b.mRound && o[d] <= 2 && q) {
            ;(o[d] = 0), (q = !1)
            break
          }
          if ('CHF' === b.mRound && o[d] <= 7 && q) {
            ;(o[d] = 5), (q = !1)
            break
          }
          if (('CHF' === b.mRound && q ? ((o[d] = 10), (q = !1)) : (o[d] = +o[d] + 1), o[d] < 10)) break
          d > 0 && (o[d] = '0')
        }
    return (o = o.slice(0, m + 1)), (c = h(o.join(''))), 0 === +c ? c : f + c
  }

  function o(a, b, c) {
    var d = b.aDec,
      e = b.mDec
    if (((a = 'paste' === c ? n(a, b) : a), d && e)) {
      var f = a.split(d)
      f[1] && f[1].length > e && (e > 0 ? ((f[1] = f[1].substring(0, e)), (a = f.join(d))) : (a = f[0]))
    }
    return a
  }

  function p(a, b) {
    ;(a = g(a, b)), (a = o(a, b)), (a = j(a, b.aDec, b.aNeg))
    var c = +a
    return c >= b.vMin && c <= b.vMax
  }

  function q(b, c) {
    ;(this.settings = c),
      (this.that = b),
      (this.$that = a(b)),
      (this.formatted = !1),
      (this.settingsClone = f(this.$that, this.settings)),
      (this.value = b.value)
  }

  function r(b) {
    return (
      'string' == typeof b &&
        ((b = b.replace(/\[/g, '\\[').replace(/\]/g, '\\]')), (b = '#' + b.replace(/(:|\.)/g, '\\$1'))),
      a(b)
    )
  }

  function s(a, b, c) {
    var d = a.data('autoNumeric')
    d || ((d = {}), a.data('autoNumeric', d))
    var e = d.holder
    return ((void 0 === e && b) || c) && ((e = new q(a.get(0), b)), (d.holder = e)), e
  }
  q.prototype = {
    init: function(a) {
      ;(this.value = this.that.value),
        (this.settingsClone = f(this.$that, this.settings)),
        (this.ctrlKey = a.ctrlKey),
        (this.cmdKey = a.metaKey),
        (this.shiftKey = a.shiftKey),
        (this.selection = b(this.that)),
        ('keydown' !== a.type && 'keyup' !== a.type) || (this.kdCode = a.keyCode),
        (this.which = a.which),
        (this.processed = !1),
        (this.formatted = !1)
    },
    setSelection: function(a, b, d) {
      ;(a = Math.max(a, 0)),
        (b = Math.min(b, this.that.value.length)),
        (this.selection = {
          start: a,
          end: b,
          length: b - a,
        }),
        (void 0 === d || d) && c(this.that, a, b)
    },
    setPosition: function(a, b) {
      this.setSelection(a, a, b)
    },
    getBeforeAfter: function() {
      var a = this.value,
        b = a.substring(0, this.selection.start),
        c = a.substring(this.selection.end, a.length)
      return [b, c]
    },
    getBeforeAfterStriped: function() {
      var a = this.getBeforeAfter()
      return (a[0] = g(a[0], this.settingsClone)), (a[1] = g(a[1], this.settingsClone)), a
    },
    normalizeParts: function(a, b) {
      var c = this.settingsClone
      b = g(b, c)
      var d = !!b.match(/^\d/) || 'leading'
      ;(a = g(a, c, d)),
        ('' !== a && a !== c.aNeg) || 'deny' !== c.lZero || (b > '' && (b = b.replace(/^0*(\d)/, '$1')))
      var e = a + b
      if (c.aDec) {
        var f = e.match(new RegExp('^' + c.aNegRegAutoStrip + '\\' + c.aDec))
        f && ((a = a.replace(f[1], f[1] + '0')), (e = a + b))
      }
      return 'zero' !== c.wEmpty || (e !== c.aNeg && '' !== e) || (a += '0'), [a, b]
    },
    setValueParts: function(a, b, c) {
      var d = this.settingsClone,
        e = this.normalizeParts(a, b),
        f = e.join(''),
        g = e[0].length
      return (
        !!p(f, d) && ((f = o(f, d, c)), g > f.length && (g = f.length), (this.value = f), this.setPosition(g, !1), !0)
      )
    },
    signPosition: function() {
      var a = this.settingsClone,
        b = a.aSign,
        c = this.that
      if (b) {
        var d = b.length
        if ('p' === a.pSign) {
          var e = a.aNeg && c.value && c.value.charAt(0) === a.aNeg
          return e ? [1, d + 1] : [0, d]
        }
        var f = c.value.length
        return [f - d, f]
      }
      return [1e3, -1]
    },
    expandSelectionOnSign: function(a) {
      var b = this.signPosition(),
        c = this.selection
      c.start < b[1] &&
        c.end > b[0] &&
        ((c.start < b[0] || c.end > b[1]) &&
        this.value.substring(Math.max(c.start, b[0]), Math.min(c.end, b[1])).match(/^\s*$/)
          ? c.start < b[0]
            ? this.setSelection(c.start, b[0], a)
            : this.setSelection(b[1], c.end, a)
          : this.setSelection(Math.min(c.start, b[0]), Math.max(c.end, b[1]), a))
    },
    checkPaste: function() {
      if (void 0 !== this.valuePartsBeforePaste) {
        var a = this.getBeforeAfter(),
          b = this.valuePartsBeforePaste
        delete this.valuePartsBeforePaste,
          (a[0] = a[0].substr(0, b[0].length) + g(a[0].substr(b[0].length), this.settingsClone)),
          this.setValueParts(a[0], a[1], 'paste') || ((this.value = b.join('')), this.setPosition(b[0].length, !1))
      }
    },
    skipAllways: function(a) {
      var b = this.kdCode,
        c = this.which,
        d = this.ctrlKey,
        e = this.cmdKey,
        f = this.shiftKey
      if (((d || e) && 'keyup' === a.type && void 0 !== this.valuePartsBeforePaste) || (f && 45 === b))
        return this.checkPaste(), !1
      if (
        (b >= 112 && b <= 123) ||
        (b >= 91 && b <= 93) ||
        (b >= 9 && b <= 31) ||
        (b < 8 && (0 === c || c === b)) ||
        144 === b ||
        145 === b ||
        45 === b ||
        224 === b
      )
        return !0
      if ((d || e) && 65 === b) return !0
      if ((d || e) && (67 === b || 86 === b || 88 === b))
        return (
          'keydown' === a.type && this.expandSelectionOnSign(),
          (86 !== b && 45 !== b) ||
            ('keydown' === a.type || 'keypress' === a.type
              ? void 0 === this.valuePartsBeforePaste && (this.valuePartsBeforePaste = this.getBeforeAfter())
              : this.checkPaste()),
          'keydown' === a.type || 'keypress' === a.type || 67 === b
        )
      if (d || e) return !0
      if (37 === b || 39 === b) {
        var g = this.settingsClone.aSep,
          h = this.selection.start,
          i = this.that.value
        return (
          'keydown' === a.type &&
            g &&
            !this.shiftKey &&
            (37 === b && i.charAt(h - 2) === g
              ? this.setPosition(h - 1)
              : 39 === b && i.charAt(h + 1) === g && this.setPosition(h + 1)),
          !0
        )
      }
      return b >= 34 && b <= 40
    },
    processAllways: function() {
      var a
      return (
        (8 === this.kdCode || 46 === this.kdCode) &&
        (this.selection.length
          ? (this.expandSelectionOnSign(!1), (a = this.getBeforeAfterStriped()), this.setValueParts(a[0], a[1]))
          : ((a = this.getBeforeAfterStriped()),
            8 === this.kdCode ? (a[0] = a[0].substring(0, a[0].length - 1)) : (a[1] = a[1].substring(1, a[1].length)),
            this.setValueParts(a[0], a[1])),
        !0)
      )
    },
    processKeypress: function() {
      var a = this.settingsClone,
        b = String.fromCharCode(this.which),
        c = this.getBeforeAfterStriped(),
        d = c[0],
        e = c[1]
      return b === a.aDec || (a.altDec && b === a.altDec) || (('.' === b || ',' === b) && 110 === this.kdCode)
        ? !a.mDec ||
            !a.aDec ||
            (!!(a.aNeg && e.indexOf(a.aNeg) > -1) ||
              (d.indexOf(a.aDec) > -1 ||
                (e.indexOf(a.aDec) > 0 ||
                  (0 === e.indexOf(a.aDec) && (e = e.substr(1)), this.setValueParts(d + a.aDec, e), !0))))
        : '-' === b || '+' === b
          ? !a.aNeg ||
            ('' === d && e.indexOf(a.aNeg) > -1 && ((d = a.aNeg), (e = e.substring(1, e.length))),
            (d = d.charAt(0) === a.aNeg ? d.substring(1, d.length) : '-' === b ? a.aNeg + d : d),
            this.setValueParts(d, e),
            !0)
          : !(b >= '0' && b <= '9') ||
            (a.aNeg && '' === d && e.indexOf(a.aNeg) > -1 && ((d = a.aNeg), (e = e.substring(1, e.length))),
            a.vMax <= 0 && a.vMin < a.vMax && this.value.indexOf(a.aNeg) === -1 && '0' !== b && (d = a.aNeg + d),
            this.setValueParts(d + b, e),
            !0)
    },
    formatQuick: function() {
      var a = this.settingsClone,
        b = this.getBeforeAfterStriped(),
        c = this.value
      if (
        ('' === a.aSep || ('' !== a.aSep && c.indexOf(a.aSep) === -1)) &&
        ('' === a.aSign || ('' !== a.aSign && c.indexOf(a.aSign) === -1))
      ) {
        var d = [],
          e = ''
        ;(d = c.split(a.aDec)),
          d[0].indexOf('-') > -1 && ((e = '-'), (d[0] = d[0].replace('-', '')), (b[0] = b[0].replace('-', ''))),
          d[0].length > a.mInt && '0' === b[0].charAt(0) && (b[0] = b[0].slice(1)),
          (b[0] = e + b[0])
      }
      var f = m(this.value, this.settingsClone),
        g = f.length
      if (f) {
        var h = b[0].split(''),
          i = 0
        for (i; i < h.length; i += 1) h[i].match('\\d') || (h[i] = '\\' + h[i])
        var j = new RegExp('^.*?' + h.join('.*?')),
          k = f.match(j)
        k
          ? ((g = k[0].length),
            ((0 === g && f.charAt(0) !== a.aNeg) || (1 === g && f.charAt(0) === a.aNeg)) &&
              a.aSign &&
              'p' === a.pSign &&
              (g = this.settingsClone.aSign.length + ('-' === f.charAt(0) ? 1 : 0)))
          : a.aSign && 's' === a.pSign && (g -= a.aSign.length)
      }
      this.that.value !== f && ((this.that.value = f), this.setPosition(g)), (this.formatted = !0)
    },
  }
  var t = {
    init: function(b) {
      return this.each(function() {
        var d = a(this),
          e = d.data('autoNumeric'),
          f = d.data(),
          i = d.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])')
        if ('object' == typeof e) return this
        ;(e = a.extend({}, a.fn.autoNumeric.defaults, f, b, {
          aNum: '0123456789',
          hasFocus: !1,
          removeBrackets: !1,
          runOnce: !1,
          tagList: [
            'b',
            'caption',
            'cite',
            'code',
            'dd',
            'del',
            'div',
            'dfn',
            'dt',
            'em',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ins',
            'kdb',
            'label',
            'li',
            'output',
            'p',
            'q',
            's',
            'sample',
            'span',
            'strong',
            'td',
            'th',
            'u',
            'var',
          ],
        })),
          e.aDec === e.aSep &&
            a.error(
              "autoNumeric will not function properly when the decimal character aDec: '" +
                e.aDec +
                "' and thousand separator aSep: '" +
                e.aSep +
                "' are the same character",
            ),
          d.data('autoNumeric', e)
        var o = s(d, e)
        if (
          (i ||
            'input' !== d.prop('tagName').toLowerCase() ||
            a.error('The input type "' + d.prop('type') + '" is not supported by autoNumeric()'),
          a.inArray(d.prop('tagName').toLowerCase(), e.tagList) === -1 &&
            'input' !== d.prop('tagName').toLowerCase() &&
            a.error('The <' + d.prop('tagName').toLowerCase() + '> is not supported by autoNumeric()'),
          e.runOnce === !1 && e.aForm)
        ) {
          if (i) {
            var q = !0
            '' === d[0].value && 'empty' === e.wEmpty && ((d[0].value = ''), (q = !1)),
              '' === d[0].value && 'sign' === e.wEmpty && ((d[0].value = e.aSign), (q = !1)),
              q &&
                '' !== d.val() &&
                ((null === e.anDefault && d[0].value === d.prop('defaultValue')) ||
                  (null !== e.anDefault && e.anDefault.toString() === d.val())) &&
                d.autoNumeric('set', d.val())
          }
          a.inArray(d.prop('tagName').toLowerCase(), e.tagList) !== -1 &&
            '' !== d.text() &&
            d.autoNumeric('set', d.text())
        }
        ;(e.runOnce = !0),
          d.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])') &&
            (d.on('keydown.autoNumeric', function(b) {
              return (
                (o = s(d)),
                o.settings.aDec === o.settings.aSep &&
                  a.error(
                    "autoNumeric will not function properly when the decimal character aDec: '" +
                      o.settings.aDec +
                      "' and thousand separator aSep: '" +
                      o.settings.aSep +
                      "' are the same character",
                  ),
                o.that.readOnly
                  ? ((o.processed = !0), !0)
                  : (o.init(b),
                    o.skipAllways(b)
                      ? ((o.processed = !0), !0)
                      : o.processAllways()
                        ? ((o.processed = !0), o.formatQuick(), b.preventDefault(), !1)
                        : ((o.formatted = !1), !0))
              )
            }),
            d.on('keypress.autoNumeric', function(a) {
              o = s(d)
              var b = o.processed
              return (
                o.init(a),
                !!o.skipAllways(a) ||
                  (b
                    ? (a.preventDefault(), !1)
                    : o.processAllways() || o.processKeypress()
                      ? (o.formatQuick(), a.preventDefault(), !1)
                      : void (o.formatted = !1))
              )
            }),
            d.on('keyup.autoNumeric', function(a) {
              ;(o = s(d)), o.init(a)
              var b = o.skipAllways(a),
                e = o.kdCode
              return (
                (o.kdCode = 0),
                delete o.valuePartsBeforePaste,
                d[0].value === o.settings.aSign
                  ? 's' === o.settings.pSign
                    ? c(this, 0, 0)
                    : c(this, o.settings.aSign.length, o.settings.aSign.length)
                  : 9 === e && c(this, 0, d.val().length),
                !!b || ('' === this.value || void (o.formatted || o.formatQuick()))
              )
            }),
            d.on('focusin.autoNumeric', function() {
              o = s(d)
              var a = o.settingsClone
              if (((a.hasFocus = !0), null !== a.nBracket)) {
                var b = d.val()
                d.val(h(b, a))
              }
              o.inVal = d.val()
              var c = l(o.inVal, a, !0)
              null !== c && '' !== c && d.val(c)
            }),
            d.on('focusout.autoNumeric', function() {
              o = s(d)
              var a = o.settingsClone,
                b = d.val(),
                c = b
              a.hasFocus = !1
              var e = ''
              'allow' === a.lZero && ((a.allowLeading = !1), (e = 'leading')),
                '' !== b &&
                  ((b = g(b, a, e)),
                  null === l(b, a) && p(b, a, d[0])
                    ? ((b = j(b, a.aDec, a.aNeg)), (b = n(b, a)), (b = k(b, a.aDec, a.aNeg)))
                    : (b = ''))
              var f = l(b, a, !1)
              null === f && (f = m(b, a)), (f === o.inVal && f === c) || (d.val(f), d.change(), delete o.inVal)
            }))
      })
    },
    destroy: function() {
      return a(this).each(function() {
        var b = a(this)
        b.removeData('autoNumeric'), b.off('.autoNumeric')
      })
    },
    update: function(b) {
      return a(this).each(function() {
        var c = r(a(this)),
          d = c.data('autoNumeric')
        'object' != typeof d &&
          a.error("You must initialize autoNumeric('init', {options}) prior to calling the 'update' method")
        var e = c.autoNumeric('get')
        if (
          ((d = a.extend(d, b)),
          s(c, d, !0),
          d.aDec === d.aSep &&
            a.error(
              "autoNumeric will not function properly when the decimal character aDec: '" +
                d.aDec +
                "' and thousand separator aSep: '" +
                d.aSep +
                "' are the same character",
            ),
          c.data('autoNumeric', d),
          '' !== c.val() || '' !== c.text())
        )
          return c.autoNumeric('set', e)
      })
    },
    set: function(b) {
      if (null !== b && !isNaN(b))
        return a(this).each(function() {
          var c = r(a(this)),
            d = c.data('autoNumeric'),
            e = b.toString(),
            f = b.toString(),
            g = c.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])')
          return (
            'object' != typeof d &&
              a.error("You must initialize autoNumeric('init', {options}) prior to calling the 'set' method"),
            (f !== c.attr('value') && f !== c.text()) || d.runOnce !== !1 || (e = e.replace(',', '.')),
            a.isNumeric(+e) ||
              a.error('The value (' + e + ") being 'set' is not numeric and has caused a error to be thrown"),
            (e = i(e, d)),
            (d.setEvent = !0),
            e.toString(),
            '' !== e && (e = n(e, d)),
            (e = k(e, d.aDec, d.aNeg)),
            p(e, d) || (e = n('', d)),
            (e = m(e, d)),
            g ? c.val(e) : a.inArray(c.prop('tagName').toLowerCase(), d.tagList) !== -1 && c.text(e)
          )
        })
    },
    get: function() {
      var b = r(a(this)),
        c = b.data('autoNumeric')
      'object' != typeof c &&
        a.error("You must initialize autoNumeric('init', {options}) prior to calling the 'get' method")
      var d = ''
      return (
        b.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])')
          ? (d = b.eq(0).val())
          : a.inArray(b.prop('tagName').toLowerCase(), c.tagList) !== -1
            ? (d = b.eq(0).text())
            : a.error('The <' + b.prop('tagName').toLowerCase() + '> is not supported by autoNumeric()'),
        ('' === d && 'empty' === c.wEmpty) || (d === c.aSign && ('sign' === c.wEmpty || 'empty' === c.wEmpty))
          ? ''
          : ('' !== d && null !== c.nBracket && ((c.removeBrackets = !0), (d = h(d, c)), (c.removeBrackets = !1)),
            (c.runOnce || c.aForm === !1) && (d = g(d, c)),
            (d = j(d, c.aDec, c.aNeg)),
            0 === +d && 'keep' !== c.lZero && (d = '0'),
            'keep' === c.lZero ? d : (d = i(d, c)))
      )
    },
    getString: function() {
      var b = !1,
        c = r(a(this)),
        d = c.serialize(),
        e = d.split('&'),
        f = a('form').index(c),
        g = a('form:eq(' + f + ')'),
        h = [],
        i = [],
        j = /^(?:submit|button|image|reset|file)$/i,
        k = /^(?:input|select|textarea|keygen)/i,
        l = /^(?:checkbox|radio)$/i,
        m = /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit|time|url|week)/i,
        n = 0
      return (
        a.each(g[0], function(a, b) {
          '' === b.name || !k.test(b.localName) || j.test(b.type) || b.disabled || (!b.checked && l.test(b.type))
            ? i.push(-1)
            : (i.push(n), (n += 1))
        }),
        (n = 0),
        a.each(g[0], function(a, b) {
          'input' !== b.localName || ('' !== b.type && 'text' !== b.type && 'hidden' !== b.type && 'tel' !== b.type)
            ? (h.push(-1), 'input' === b.localName && m.test(b.type) && (n += 1))
            : (h.push(n), (n += 1))
        }),
        a.each(e, function(c, d) {
          d = e[c].split('=')
          var g = a.inArray(c, i)
          if (g > -1 && h[g] > -1) {
            var j = a('form:eq(' + f + ') input:eq(' + h[g] + ')'),
              k = j.data('autoNumeric')
            'object' == typeof k &&
              null !== d[1] &&
              ((d[1] = a('form:eq(' + f + ') input:eq(' + h[g] + ')')
                .autoNumeric('get')
                .toString()),
              (e[c] = d.join('=')),
              (b = !0))
          }
        }),
        b || a.error("You must initialize autoNumeric('init', {options}) prior to calling the 'getString' method"),
        e.join('&')
      )
    },
    getArray: function() {
      var b = !1,
        c = r(a(this)),
        d = c.serializeArray(),
        e = a('form').index(c),
        f = a('form:eq(' + e + ')'),
        g = [],
        h = [],
        i = /^(?:submit|button|image|reset|file)$/i,
        j = /^(?:input|select|textarea|keygen)/i,
        k = /^(?:checkbox|radio)$/i,
        l = /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit|time|url|week)/i,
        m = 0
      return (
        a.each(f[0], function(a, b) {
          '' === b.name || !j.test(b.localName) || i.test(b.type) || b.disabled || (!b.checked && k.test(b.type))
            ? h.push(-1)
            : (h.push(m), (m += 1))
        }),
        (m = 0),
        a.each(f[0], function(a, b) {
          'input' !== b.localName || ('' !== b.type && 'text' !== b.type && 'hidden' !== b.type && 'tel' !== b.type)
            ? (g.push(-1), 'input' === b.localName && l.test(b.type) && (m += 1))
            : (g.push(m), (m += 1))
        }),
        a.each(d, function(c, d) {
          var f = a.inArray(c, h)
          if (f > -1 && g[f] > -1) {
            var i = a('form:eq(' + e + ') input:eq(' + g[f] + ')'),
              j = i.data('autoNumeric')
            'object' == typeof j &&
              ((d.value = a('form:eq(' + e + ') input:eq(' + g[f] + ')')
                .autoNumeric('get')
                .toString()),
              (b = !0))
          }
        }),
        b || a.error('None of the successful form inputs are initialized by autoNumeric.'),
        d
      )
    },
    getSettings: function() {
      var b = r(a(this))
      return b.eq(0).data('autoNumeric')
    },
  }
  ;(a.fn.autoNumeric = function(b) {
    return t[b]
      ? t[b].apply(this, Array.prototype.slice.call(arguments, 1))
      : 'object' != typeof b && b
        ? void a.error('Method "' + b + '" is not supported by autoNumeric()')
        : t.init.apply(this, arguments)
  }),
    (a.fn.autoNumeric.defaults = {
      aSep: ',',
      dGroup: '3',
      aDec: '.',
      altDec: null,
      aSign: '',
      pSign: 'p',
      vMax: '9999999999999.99',
      vMin: '-9999999999999.99',
      mDec: null,
      mRound: 'S',
      aPad: !0,
      nBracket: null,
      wEmpty: 'empty',
      lZero: 'allow',
      sNumber: !0,
      aForm: !0,
      anDefault: null,
    })
}),
  (EventDispatcher.prototype.subscribe = function(a, b) {
    var c = this.subscriptions[a]
    'undefined' == typeof c && (c = this.subscriptions[a] = []), 'function' == typeof b && c.push(b)
  }),
  (EventDispatcher.prototype.trigger = function(a) {
    var b = Array.prototype.splice.call(arguments, 1),
      c = this.subscriptions[a]
    if ('undefined' != typeof c) for (var d in c) c[d].apply(null, b)
  }),
  (EventDispatcher.prototype.unsubscribe = function(a) {
    'undefined' != typeof this.subscriptions[a] && delete this.subscriptions[a]
  }),
  (function(a) {
    'use strict'
    var b,
      c = a.Base64,
      d = '2.1.9'
    if ('undefined' != typeof module && module.exports)
      try {
        b = require('buffer').Buffer
      } catch (a) {}
    var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      f = (function(a) {
        for (var b = {}, c = 0, d = a.length; c < d; c++) b[a.charAt(c)] = c
        return b
      })(e),
      g = String.fromCharCode,
      h = function(a) {
        if (a.length < 2) {
          var b = a.charCodeAt(0)
          return b < 128
            ? a
            : b < 2048
              ? g(192 | (b >>> 6)) + g(128 | (63 & b))
              : g(224 | ((b >>> 12) & 15)) + g(128 | ((b >>> 6) & 63)) + g(128 | (63 & b))
        }
        var b = 65536 + 1024 * (a.charCodeAt(0) - 55296) + (a.charCodeAt(1) - 56320)
        return g(240 | ((b >>> 18) & 7)) + g(128 | ((b >>> 12) & 63)) + g(128 | ((b >>> 6) & 63)) + g(128 | (63 & b))
      },
      i = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
      j = function(a) {
        return a.replace(i, h)
      },
      k = function(a) {
        var b = [0, 2, 1][a.length % 3],
          c =
            (a.charCodeAt(0) << 16) |
            ((a.length > 1 ? a.charCodeAt(1) : 0) << 8) |
            (a.length > 2 ? a.charCodeAt(2) : 0),
          d = [
            e.charAt(c >>> 18),
            e.charAt((c >>> 12) & 63),
            b >= 2 ? '=' : e.charAt((c >>> 6) & 63),
            b >= 1 ? '=' : e.charAt(63 & c),
          ]
        return d.join('')
      },
      l = a.btoa
        ? function(b) {
            return a.btoa(b)
          }
        : function(a) {
            return a.replace(/[\s\S]{1,3}/g, k)
          },
      m = b
        ? function(a) {
            return (a.constructor === b.constructor ? a : new b(a)).toString('base64')
          }
        : function(a) {
            return l(j(a))
          },
      n = function(a, b) {
        return b
          ? m(String(a))
              .replace(/[+\/]/g, function(a) {
                return '+' == a ? '-' : '_'
              })
              .replace(/=/g, '')
          : m(String(a))
      },
      o = function(a) {
        return n(a, !0)
      },
      p = new RegExp(['[ГЂ-Гџ][ВЂ-Вї]', '[Г -ГЇ][ВЂ-Вї]{2}', '[Г°-Г·][ВЂ-Вї]{3}'].join('|'), 'g'),
      q = function(a) {
        switch (a.length) {
          case 4:
            var b =
                ((7 & a.charCodeAt(0)) << 18) |
                ((63 & a.charCodeAt(1)) << 12) |
                ((63 & a.charCodeAt(2)) << 6) |
                (63 & a.charCodeAt(3)),
              c = b - 65536
            return g((c >>> 10) + 55296) + g((1023 & c) + 56320)
          case 3:
            return g(((15 & a.charCodeAt(0)) << 12) | ((63 & a.charCodeAt(1)) << 6) | (63 & a.charCodeAt(2)))
          default:
            return g(((31 & a.charCodeAt(0)) << 6) | (63 & a.charCodeAt(1)))
        }
      },
      r = function(a) {
        return a.replace(p, q)
      },
      s = function(a) {
        var b = a.length,
          c = b % 4,
          d =
            (b > 0 ? f[a.charAt(0)] << 18 : 0) |
            (b > 1 ? f[a.charAt(1)] << 12 : 0) |
            (b > 2 ? f[a.charAt(2)] << 6 : 0) |
            (b > 3 ? f[a.charAt(3)] : 0),
          e = [g(d >>> 16), g((d >>> 8) & 255), g(255 & d)]
        return (e.length -= [0, 0, 2, 1][c]), e.join('')
      },
      t = a.atob
        ? function(b) {
            return a.atob(b)
          }
        : function(a) {
            return a.replace(/[\s\S]{1,4}/g, s)
          },
      u = b
        ? function(a) {
            return (a.constructor === b.constructor ? a : new b(a, 'base64')).toString()
          }
        : function(a) {
            return r(t(a))
          },
      v = function(a) {
        return u(
          String(a)
            .replace(/[-_]/g, function(a) {
              return '-' == a ? '+' : '/'
            })
            .replace(/[^A-Za-z0-9\+\/]/g, ''),
        )
      },
      w = function() {
        var b = a.Base64
        return (a.Base64 = c), b
      }
    if (
      ((a.Base64 = {
        VERSION: d,
        atob: t,
        btoa: l,
        fromBase64: v,
        toBase64: n,
        utob: j,
        encode: n,
        encodeURI: o,
        btou: r,
        decode: v,
        noConflict: w,
      }),
      'function' == typeof Object.defineProperty)
    ) {
      var x = function(a) {
        return {
          value: a,
          enumerable: !1,
          writable: !0,
          configurable: !0,
        }
      }
      a.Base64.extendString = function() {
        Object.defineProperty(
          String.prototype,
          'fromBase64',
          x(function() {
            return v(this)
          }),
        ),
          Object.defineProperty(
            String.prototype,
            'toBase64',
            x(function(a) {
              return n(this, a)
            }),
          ),
          Object.defineProperty(
            String.prototype,
            'toBase64URI',
            x(function() {
              return n(this, !0)
            }),
          )
      }
    }
    a.Meteor && (Base64 = a.Base64)
  })(this),
  !(function(a, b) {
    'object' == typeof exports && 'undefined' != typeof module
      ? b(exports)
      : 'function' == typeof define && define.amd
        ? define(['exports'], b)
        : b((a.L = {}))
  })(this, function(a) {
    'use strict'

    function b(a) {
      var b, c, d, e
      for (c = 1, d = arguments.length; c < d; c++) {
        e = arguments[c]
        for (b in e) a[b] = e[b]
      }
      return a
    }

    function c(a, b) {
      var c = Array.prototype.slice
      if (a.bind) return a.bind.apply(a, c.call(arguments, 1))
      var d = c.call(arguments, 2)
      return function() {
        return a.apply(b, d.length ? d.concat(c.call(arguments)) : arguments)
      }
    }

    function d(a) {
      return (a._leaflet_id = a._leaflet_id || ++ab), a._leaflet_id
    }

    function e(a, b, c) {
      var d, e, f, g
      return (
        (g = function() {
          ;(d = !1), e && (f.apply(c, e), (e = !1))
        }),
        (f = function() {
          d ? (e = arguments) : (a.apply(c, arguments), setTimeout(g, b), (d = !0))
        })
      )
    }

    function f(a, b, c) {
      var d = b[1],
        e = b[0],
        f = d - e
      return a === d && c ? a : ((((a - e) % f) + f) % f) + e
    }

    function g() {
      return !1
    }

    function h(a, b) {
      var c = Math.pow(10, void 0 === b ? 6 : b)
      return Math.round(a * c) / c
    }

    function i(a) {
      return a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, '')
    }

    function j(a) {
      return i(a).split(/\s+/)
    }

    function k(a, b) {
      a.hasOwnProperty('options') || (a.options = a.options ? _a(a.options) : {})
      for (var c in b) a.options[c] = b[c]
      return a.options
    }

    function l(a, b, c) {
      var d = []
      for (var e in a) d.push(encodeURIComponent(c ? e.toUpperCase() : e) + '=' + encodeURIComponent(a[e]))
      return (b && -1 !== b.indexOf('?') ? '&' : '?') + d.join('&')
    }

    function m(a, b) {
      return a.replace(bb, function(a, c) {
        var d = b[c]
        if (void 0 === d) throw new Error('No value provided for variable ' + a)
        return 'function' == typeof d && (d = d(b)), d
      })
    }

    function n(a, b) {
      for (var c = 0; c < a.length; c++) if (a[c] === b) return c
      return -1
    }

    function o(a) {
      return window['webkit' + a] || window['moz' + a] || window['ms' + a]
    }

    function p(a) {
      var b = +new Date(),
        c = Math.max(0, 16 - (b - eb))
      return (eb = b + c), window.setTimeout(a, c)
    }

    function q(a, b, d) {
      return d && fb === p ? void a.call(b) : fb.call(window, c(a, b))
    }

    function r(a) {
      a && gb.call(window, a)
    }

    function s() {}

    function t(a) {
      if ('undefined' != typeof L && L && L.Mixin) {
        a = cb(a) ? a : [a]
        for (var b = 0; b < a.length; b++)
          a[b] === L.Mixin.Events &&
            console.warn(
              'Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.',
              new Error().stack,
            )
      }
    }

    function u(a, b, c) {
      ;(this.x = c ? Math.round(a) : a), (this.y = c ? Math.round(b) : b)
    }

    function v(a, b, c) {
      return a instanceof u
        ? a
        : cb(a)
          ? new u(a[0], a[1])
          : void 0 === a || null === a
            ? a
            : 'object' == typeof a && 'x' in a && 'y' in a
              ? new u(a.x, a.y)
              : new u(a, b, c)
    }

    function w(a, b) {
      if (a) for (var c = b ? [a, b] : a, d = 0, e = c.length; d < e; d++) this.extend(c[d])
    }

    function x(a, b) {
      return !a || a instanceof w ? a : new w(a, b)
    }

    function y(a, b) {
      if (a) for (var c = b ? [a, b] : a, d = 0, e = c.length; d < e; d++) this.extend(c[d])
    }

    function z(a, b) {
      return a instanceof y ? a : new y(a, b)
    }

    function A(a, b, c) {
      if (isNaN(a) || isNaN(b)) throw new Error('Invalid LatLng object: (' + a + ', ' + b + ')')
      ;(this.lat = +a), (this.lng = +b), void 0 !== c && (this.alt = +c)
    }

    function B(a, b, c) {
      return a instanceof A
        ? a
        : cb(a) && 'object' != typeof a[0]
          ? 3 === a.length
            ? new A(a[0], a[1], a[2])
            : 2 === a.length
              ? new A(a[0], a[1])
              : null
          : void 0 === a || null === a
            ? a
            : 'object' == typeof a && 'lat' in a
              ? new A(a.lat, 'lng' in a ? a.lng : a.lon, a.alt)
              : void 0 === b
                ? null
                : new A(a, b, c)
    }

    function C(a, b, c, d) {
      return cb(a)
        ? ((this._a = a[0]), (this._b = a[1]), (this._c = a[2]), void (this._d = a[3]))
        : ((this._a = a), (this._b = b), (this._c = c), (this._d = d), void 0)
    }

    function D(a, b, c, d) {
      return new C(a, b, c, d)
    }

    function E(a) {
      return document.createElementNS('http://www.w3.org/2000/svg', a)
    }

    function F(a, b) {
      var c,
        d,
        e,
        f,
        g,
        h,
        i = ''
      for (c = 0, e = a.length; c < e; c++) {
        for (d = 0, f = (g = a[c]).length; d < f; d++) (h = g[d]), (i += (d ? 'L' : 'M') + h.x + ' ' + h.y)
        i += b ? (Yb ? 'z' : 'x') : ''
      }
      return i || 'M0 0'
    }

    function G(a) {
      return navigator.userAgent.toLowerCase().indexOf(a) >= 0
    }

    function H(a, b, c, d) {
      return 'touchstart' === b ? J(a, c, d) : 'touchmove' === b ? P(a, c, d) : 'touchend' === b && Q(a, c, d), this
    }

    function I(a, b, c) {
      var d = a['_leaflet_' + b + c]
      return (
        'touchstart' === b
          ? a.removeEventListener(_b, d, !1)
          : 'touchmove' === b
            ? a.removeEventListener(ac, d, !1)
            : 'touchend' === b && (a.removeEventListener(bc, d, !1), a.removeEventListener(cc, d, !1)),
        this
      )
    }

    function J(a, b, d) {
      var e = c(function(a) {
        if ('mouse' !== a.pointerType && a.MSPOINTER_TYPE_MOUSE && a.pointerType !== a.MSPOINTER_TYPE_MOUSE) {
          if (!(dc.indexOf(a.target.tagName) < 0)) return
          $(a)
        }
        O(a, b)
      })
      ;(a['_leaflet_touchstart' + d] = e),
        a.addEventListener(_b, e, !1),
        fc ||
          (document.documentElement.addEventListener(_b, K, !0),
          document.documentElement.addEventListener(ac, M, !0),
          document.documentElement.addEventListener(bc, N, !0),
          document.documentElement.addEventListener(cc, N, !0),
          (fc = !0))
    }

    function K(a) {
      ;(ec[a.pointerId] = a), gc++
    }

    function M(a) {
      ec[a.pointerId] && (ec[a.pointerId] = a)
    }

    function N(a) {
      delete ec[a.pointerId], gc--
    }

    function O(a, b) {
      a.touches = []
      for (var c in ec) a.touches.push(ec[c])
      ;(a.changedTouches = [a]), b(a)
    }

    function P(a, b, c) {
      var d = function(a) {
        ;((a.pointerType !== a.MSPOINTER_TYPE_MOUSE && 'mouse' !== a.pointerType) || 0 !== a.buttons) && O(a, b)
      }
      ;(a['_leaflet_touchmove' + c] = d), a.addEventListener(ac, d, !1)
    }

    function Q(a, b, c) {
      var d = function(a) {
        O(a, b)
      }
      ;(a['_leaflet_touchend' + c] = d), a.addEventListener(bc, d, !1), a.addEventListener(cc, d, !1)
    }

    function R(a, b, c) {
      function d(a) {
        var b
        if (Sb) {
          if (!xb || 'mouse' === a.pointerType) return
          b = gc
        } else b = a.touches.length
        if (!(b > 1)) {
          var c = Date.now(),
            d = c - (f || c)
          ;(g = a.touches ? a.touches[0] : a), (h = d > 0 && d <= i), (f = c)
        }
      }

      function e(a) {
        if (h && !g.cancelBubble) {
          if (Sb) {
            if (!xb || 'mouse' === a.pointerType) return
            var c,
              d,
              e = {}
            for (d in g) (c = g[d]), (e[d] = c && c.bind ? c.bind(g) : c)
            g = e
          }
          ;(g.type = 'dblclick'), b(g), (f = null)
        }
      }
      var f,
        g,
        h = !1,
        i = 250
      return (
        (a[jc + hc + c] = d),
        (a[jc + ic + c] = e),
        (a[jc + 'dblclick' + c] = b),
        a.addEventListener(hc, d, !1),
        a.addEventListener(ic, e, !1),
        a.addEventListener('dblclick', b, !1),
        this
      )
    }

    function S(a, b) {
      var c = a[jc + hc + b],
        d = a[jc + ic + b],
        e = a[jc + 'dblclick' + b]
      return (
        a.removeEventListener(hc, c, !1),
        a.removeEventListener(ic, d, !1),
        xb || a.removeEventListener('dblclick', e, !1),
        this
      )
    }

    function T(a, b, c, d) {
      if ('object' == typeof b) for (var e in b) V(a, e, b[e], c)
      else for (var f = 0, g = (b = j(b)).length; f < g; f++) V(a, b[f], c, d)
      return this
    }

    function U(a, b, c, d) {
      if ('object' == typeof b) for (var e in b) W(a, e, b[e], c)
      else if (b) for (var f = 0, g = (b = j(b)).length; f < g; f++) W(a, b[f], c, d)
      else {
        for (var h in a[kc]) W(a, h, a[kc][h])
        delete a[kc]
      }
      return this
    }

    function V(a, b, c, e) {
      var f = b + d(c) + (e ? '_' + d(e) : '')
      if (a[kc] && a[kc][f]) return this
      var g = function(b) {
          return c.call(e || a, b || window.event)
        },
        h = g
      Sb && 0 === b.indexOf('touch')
        ? H(a, b, g, f)
        : !Tb || 'dblclick' !== b || !R || (Sb && Eb)
          ? 'addEventListener' in a
            ? 'mousewheel' === b
              ? a.addEventListener('onwheel' in a ? 'wheel' : 'mousewheel', g, !1)
              : 'mouseenter' === b || 'mouseleave' === b
                ? ((g = function(b) {
                    ;(b = b || window.event), ea(a, b) && h(b)
                  }),
                  a.addEventListener('mouseenter' === b ? 'mouseover' : 'mouseout', g, !1))
                : ('click' === b &&
                    zb &&
                    (g = function(a) {
                      fa(a, h)
                    }),
                  a.addEventListener(b, g, !1))
            : 'attachEvent' in a && a.attachEvent('on' + b, g)
          : R(a, g, f),
        (a[kc] = a[kc] || {}),
        (a[kc][f] = g)
    }

    function W(a, b, c, e) {
      var f = b + d(c) + (e ? '_' + d(e) : ''),
        g = a[kc] && a[kc][f]
      return g
        ? (Sb && 0 === b.indexOf('touch')
            ? I(a, b, f)
            : !Tb || 'dblclick' !== b || !S || (Sb && Eb)
              ? 'removeEventListener' in a
                ? 'mousewheel' === b
                  ? a.removeEventListener('onwheel' in a ? 'wheel' : 'mousewheel', g, !1)
                  : a.removeEventListener('mouseenter' === b ? 'mouseover' : 'mouseleave' === b ? 'mouseout' : b, g, !1)
                : 'detachEvent' in a && a.detachEvent('on' + b, g)
              : S(a, f),
          void (a[kc][f] = null))
        : this
    }

    function X(a) {
      return (
        a.stopPropagation
          ? a.stopPropagation()
          : a.originalEvent
            ? (a.originalEvent._stopped = !0)
            : (a.cancelBubble = !0),
        da(a),
        this
      )
    }

    function Y(a) {
      return V(a, 'mousewheel', X), this
    }

    function Z(a) {
      return T(a, 'mousedown touchstart dblclick', X), V(a, 'click', ca), this
    }

    function $(a) {
      return a.preventDefault ? a.preventDefault() : (a.returnValue = !1), this
    }

    function _(a) {
      return $(a), X(a), this
    }

    function aa(a, b) {
      if (!b) return new u(a.clientX, a.clientY)
      var c = b.getBoundingClientRect(),
        d = c.width / b.offsetWidth || 1,
        e = c.height / b.offsetHeight || 1
      return new u(a.clientX / d - c.left - b.clientLeft, a.clientY / e - c.top - b.clientTop)
    }

    function ba(a) {
      return xb
        ? a.wheelDeltaY / 2
        : a.deltaY && 0 === a.deltaMode
          ? -a.deltaY / lc
          : a.deltaY && 1 === a.deltaMode
            ? 20 * -a.deltaY
            : a.deltaY && 2 === a.deltaMode
              ? 60 * -a.deltaY
              : a.deltaX || a.deltaZ
                ? 0
                : a.wheelDelta
                  ? (a.wheelDeltaY || a.wheelDelta) / 2
                  : a.detail && Math.abs(a.detail) < 32765
                    ? 20 * -a.detail
                    : a.detail
                      ? (a.detail / -32765) * 60
                      : 0
    }

    function ca(a) {
      mc[a.type] = !0
    }

    function da(a) {
      var b = mc[a.type]
      return (mc[a.type] = !1), b
    }

    function ea(a, b) {
      var c = b.relatedTarget
      if (!c) return !0
      try {
        for (; c && c !== a; ) c = c.parentNode
      } catch (a) {
        return !1
      }
      return c !== a
    }

    function fa(a, b) {
      var c = a.timeStamp || (a.originalEvent && a.originalEvent.timeStamp),
        d = ob && c - ob
      ;(d && d > 100 && d < 500) || (a.target._simulatedClick && !a._simulated) ? _(a) : ((ob = c), b(a))
    }

    function ga(a) {
      return 'string' == typeof a ? document.getElementById(a) : a
    }

    function ha(a, b) {
      var c = a.style[b] || (a.currentStyle && a.currentStyle[b])
      if ((!c || 'auto' === c) && document.defaultView) {
        var d = document.defaultView.getComputedStyle(a, null)
        c = d ? d[b] : null
      }
      return 'auto' === c ? null : c
    }

    function ia(a, b, c) {
      var d = document.createElement(a)
      return (d.className = b || ''), c && c.appendChild(d), d
    }

    function ja(a) {
      var b = a.parentNode
      b && b.removeChild(a)
    }

    function ka(a) {
      for (; a.firstChild; ) a.removeChild(a.firstChild)
    }

    function la(a) {
      var b = a.parentNode
      b.lastChild !== a && b.appendChild(a)
    }

    function ma(a) {
      var b = a.parentNode
      b.firstChild !== a && b.insertBefore(a, b.firstChild)
    }

    function na(a, b) {
      if (void 0 !== a.classList) return a.classList.contains(b)
      var c = ra(a)
      return c.length > 0 && new RegExp('(^|\\s)' + b + '(\\s|$)').test(c)
    }

    function oa(a, b) {
      if (void 0 !== a.classList) for (var c = j(b), d = 0, e = c.length; d < e; d++) a.classList.add(c[d])
      else if (!na(a, b)) {
        var f = ra(a)
        qa(a, (f ? f + ' ' : '') + b)
      }
    }

    function pa(a, b) {
      void 0 !== a.classList ? a.classList.remove(b) : qa(a, i((' ' + ra(a) + ' ').replace(' ' + b + ' ', ' ')))
    }

    function qa(a, b) {
      void 0 === a.className.baseVal ? (a.className = b) : (a.className.baseVal = b)
    }

    function ra(a) {
      return void 0 === a.className.baseVal ? a.className : a.className.baseVal
    }

    function sa(a, b) {
      'opacity' in a.style ? (a.style.opacity = b) : 'filter' in a.style && ta(a, b)
    }

    function ta(a, b) {
      var c = !1,
        d = 'DXImageTransform.Microsoft.Alpha'
      try {
        c = a.filters.item(d)
      } catch (a) {
        if (1 === b) return
      }
      ;(b = Math.round(100 * b)),
        c ? ((c.Enabled = 100 !== b), (c.Opacity = b)) : (a.style.filter += ' progid:' + d + '(opacity=' + b + ')')
    }

    function ua(a) {
      for (var b = document.documentElement.style, c = 0; c < a.length; c++) if (a[c] in b) return a[c]
      return !1
    }

    function va(a, b, c) {
      var d = b || new u(0, 0)
      a.style[oc] =
        (Kb ? 'translate(' + d.x + 'px,' + d.y + 'px)' : 'translate3d(' + d.x + 'px,' + d.y + 'px,0)') +
        (c ? ' scale(' + c + ')' : '')
    }

    function wa(a, b) {
      ;(a._leaflet_pos = b), Nb ? va(a, b) : ((a.style.left = b.x + 'px'), (a.style.top = b.y + 'px'))
    }

    function xa(a) {
      return a._leaflet_pos || new u(0, 0)
    }

    function ya() {
      T(window, 'dragstart', $)
    }

    function za() {
      U(window, 'dragstart', $)
    }

    function Aa(a) {
      for (; -1 === a.tabIndex; ) a = a.parentNode
      a.style && (Ba(), (sc = a), (tc = a.style.outline), (a.style.outline = 'none'), T(window, 'keydown', Ba))
    }

    function Ba() {
      sc && ((sc.style.outline = tc), (sc = void 0), (tc = void 0), U(window, 'keydown', Ba))
    }

    function Ca(a, b) {
      if (!b || !a.length) return a.slice()
      var c = b * b
      return (a = Ga(a, c)), (a = Ea(a, c))
    }

    function Da(a, b, c) {
      return Math.sqrt(La(a, b, c, !0))
    }

    function Ea(a, b) {
      var c = a.length,
        d = new (typeof Uint8Array != void 0 + '' ? Uint8Array : Array)(c)
      ;(d[0] = d[c - 1] = 1), Fa(a, d, b, 0, c - 1)
      var e,
        f = []
      for (e = 0; e < c; e++) d[e] && f.push(a[e])
      return f
    }

    function Fa(a, b, c, d, e) {
      var f,
        g,
        h,
        i = 0
      for (g = d + 1; g <= e - 1; g++) (h = La(a[g], a[d], a[e], !0)) > i && ((f = g), (i = h))
      i > c && ((b[f] = 1), Fa(a, b, c, d, f), Fa(a, b, c, f, e))
    }

    function Ga(a, b) {
      for (var c = [a[0]], d = 1, e = 0, f = a.length; d < f; d++) Ka(a[d], a[e]) > b && (c.push(a[d]), (e = d))
      return e < f - 1 && c.push(a[f - 1]), c
    }

    function Ha(a, b, c, d, e) {
      var f,
        g,
        h,
        i = d ? Ec : Ja(a, c),
        j = Ja(b, c)
      for (Ec = j; ; ) {
        if (!(i | j)) return [a, b]
        if (i & j) return !1
        ;(h = Ja((g = Ia(a, b, (f = i || j), c, e)), c)), f === i ? ((a = g), (i = h)) : ((b = g), (j = h))
      }
    }

    function Ia(a, b, c, d, e) {
      var f,
        g,
        h = b.x - a.x,
        i = b.y - a.y,
        j = d.min,
        k = d.max
      return (
        8 & c
          ? ((f = a.x + (h * (k.y - a.y)) / i), (g = k.y))
          : 4 & c
            ? ((f = a.x + (h * (j.y - a.y)) / i), (g = j.y))
            : 2 & c
              ? ((f = k.x), (g = a.y + (i * (k.x - a.x)) / h))
              : 1 & c && ((f = j.x), (g = a.y + (i * (j.x - a.x)) / h)),
        new u(f, g, e)
      )
    }

    function Ja(a, b) {
      var c = 0
      return (
        a.x < b.min.x ? (c |= 1) : a.x > b.max.x && (c |= 2), a.y < b.min.y ? (c |= 4) : a.y > b.max.y && (c |= 8), c
      )
    }

    function Ka(a, b) {
      var c = b.x - a.x,
        d = b.y - a.y
      return c * c + d * d
    }

    function La(a, b, c, d) {
      var e,
        f = b.x,
        g = b.y,
        h = c.x - f,
        i = c.y - g,
        j = h * h + i * i
      return (
        j > 0 &&
          ((e = ((a.x - f) * h + (a.y - g) * i) / j) > 1
            ? ((f = c.x), (g = c.y))
            : e > 0 && ((f += h * e), (g += i * e))),
        (h = a.x - f),
        (i = a.y - g),
        d ? h * h + i * i : new u(f, g)
      )
    }

    function Ma(a) {
      return !cb(a[0]) || ('object' != typeof a[0][0] && void 0 !== a[0][0])
    }

    function Na(a) {
      return console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.'), Ma(a)
    }

    function Oa(a, b, c) {
      var d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m = [1, 4, 2, 8]
      for (e = 0, j = a.length; e < j; e++) a[e]._code = Ja(a[e], b)
      for (g = 0; g < 4; g++) {
        for (k = m[g], d = [], e = 0, f = (j = a.length) - 1; e < j; f = e++)
          (h = a[e]),
            (i = a[f]),
            h._code & k
              ? i._code & k || (((l = Ia(i, h, k, b, c))._code = Ja(l, b)), d.push(l))
              : (i._code & k && (((l = Ia(i, h, k, b, c))._code = Ja(l, b)), d.push(l)), d.push(h))
        a = d
      }
      return a
    }

    function Pa(a, b) {
      var c,
        d,
        e,
        f,
        g = 'Feature' === a.type ? a.geometry : a,
        h = g ? g.coordinates : null,
        i = [],
        j = b && b.pointToLayer,
        k = (b && b.coordsToLatLng) || Qa
      if (!h && !g) return null
      switch (g.type) {
        case 'Point':
          return (c = k(h)), j ? j(a, c) : new Yc(c)
        case 'MultiPoint':
          for (e = 0, f = h.length; e < f; e++) (c = k(h[e])), i.push(j ? j(a, c) : new Yc(c))
          return new Uc(i)
        case 'LineString':
        case 'MultiLineString':
          return (d = Ra(h, 'LineString' === g.type ? 0 : 1, k)), new ad(d, b)
        case 'Polygon':
        case 'MultiPolygon':
          return (d = Ra(h, 'Polygon' === g.type ? 1 : 2, k)), new bd(d, b)
        case 'GeometryCollection':
          for (e = 0, f = g.geometries.length; e < f; e++) {
            var l = Pa(
              {
                geometry: g.geometries[e],
                type: 'Feature',
                properties: a.properties,
              },
              b,
            )
            l && i.push(l)
          }
          return new Uc(i)
        default:
          throw new Error('Invalid GeoJSON object.')
      }
    }

    function Qa(a) {
      return new A(a[1], a[0], a[2])
    }

    function Ra(a, b, c) {
      for (var d, e = [], f = 0, g = a.length; f < g; f++) (d = b ? Ra(a[f], b - 1, c) : (c || Qa)(a[f])), e.push(d)
      return e
    }

    function Sa(a, b) {
      return (
        (b = 'number' == typeof b ? b : 6),
        void 0 !== a.alt ? [h(a.lng, b), h(a.lat, b), h(a.alt, b)] : [h(a.lng, b), h(a.lat, b)]
      )
    }

    function Ta(a, b, c, d) {
      for (var e = [], f = 0, g = a.length; f < g; f++) e.push(b ? Ta(a[f], b - 1, c, d) : Sa(a[f], d))
      return !b && c && e.push(e[0]), e
    }

    function Ua(a, c) {
      return a.feature
        ? b({}, a.feature, {
            geometry: c,
          })
        : Va(c)
    }

    function Va(a) {
      return 'Feature' === a.type || 'FeatureCollection' === a.type
        ? a
        : {
            type: 'Feature',
            properties: {},
            geometry: a,
          }
    }

    function Wa(a, b) {
      return new cd(a, b)
    }

    function Xa(a, b) {
      return new md(a, b)
    }

    function Ya(a) {
      return Xb ? new pd(a) : null
    }

    function Za(a) {
      return Yb || Zb ? new td(a) : null
    }
    var $a = Object.freeze
    Object.freeze = function(a) {
      return a
    }
    var _a =
        Object.create ||
        (function() {
          function a() {}
          return function(b) {
            return (a.prototype = b), new a()
          }
        })(),
      ab = 0,
      bb = /\{ *([\w_-]+) *\}/g,
      cb =
        Array.isArray ||
        function(a) {
          return '[object Array]' === Object.prototype.toString.call(a)
        },
      db = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
      eb = 0,
      fb = window.requestAnimationFrame || o('RequestAnimationFrame') || p,
      gb =
        window.cancelAnimationFrame ||
        o('CancelAnimationFrame') ||
        o('CancelRequestAnimationFrame') ||
        function(a) {
          window.clearTimeout(a)
        },
      hb = (Object.freeze || Object)({
        freeze: $a,
        extend: b,
        create: _a,
        bind: c,
        lastId: ab,
        stamp: d,
        throttle: e,
        wrapNum: f,
        falseFn: g,
        formatNum: h,
        trim: i,
        splitWords: j,
        setOptions: k,
        getParamString: l,
        template: m,
        isArray: cb,
        indexOf: n,
        emptyImageUrl: db,
        requestFn: fb,
        cancelFn: gb,
        requestAnimFrame: q,
        cancelAnimFrame: r,
      })
    ;(s.extend = function(a) {
      var c = function() {
          this.initialize && this.initialize.apply(this, arguments), this.callInitHooks()
        },
        d = (c.__super__ = this.prototype),
        e = _a(d)
      ;(e.constructor = c), (c.prototype = e)
      for (var f in this) this.hasOwnProperty(f) && 'prototype' !== f && '__super__' !== f && (c[f] = this[f])
      return (
        a.statics && (b(c, a.statics), delete a.statics),
        a.includes && (t(a.includes), b.apply(null, [e].concat(a.includes)), delete a.includes),
        e.options && (a.options = b(_a(e.options), a.options)),
        b(e, a),
        (e._initHooks = []),
        (e.callInitHooks = function() {
          if (!this._initHooksCalled) {
            d.callInitHooks && d.callInitHooks.call(this), (this._initHooksCalled = !0)
            for (var a = 0, b = e._initHooks.length; a < b; a++) e._initHooks[a].call(this)
          }
        }),
        c
      )
    }),
      (s.include = function(a) {
        return b(this.prototype, a), this
      }),
      (s.mergeOptions = function(a) {
        return b(this.prototype.options, a), this
      }),
      (s.addInitHook = function(a) {
        var b = Array.prototype.slice.call(arguments, 1),
          c =
            'function' == typeof a
              ? a
              : function() {
                  this[a].apply(this, b)
                }
        return (this.prototype._initHooks = this.prototype._initHooks || []), this.prototype._initHooks.push(c), this
      })
    var ib = {
      on: function(a, b, c) {
        if ('object' == typeof a) for (var d in a) this._on(d, a[d], b)
        else for (var e = 0, f = (a = j(a)).length; e < f; e++) this._on(a[e], b, c)
        return this
      },
      off: function(a, b, c) {
        if (a)
          if ('object' == typeof a) for (var d in a) this._off(d, a[d], b)
          else for (var e = 0, f = (a = j(a)).length; e < f; e++) this._off(a[e], b, c)
        else delete this._events
        return this
      },
      _on: function(a, b, c) {
        this._events = this._events || {}
        var d = this._events[a]
        d || ((d = []), (this._events[a] = d)), c === this && (c = void 0)
        for (
          var e = {
              fn: b,
              ctx: c,
            },
            f = d,
            g = 0,
            h = f.length;
          g < h;
          g++
        )
          if (f[g].fn === b && f[g].ctx === c) return
        f.push(e)
      },
      _off: function(a, b, c) {
        var d, e, f
        if (this._events && (d = this._events[a]))
          if (b) {
            if ((c === this && (c = void 0), d))
              for (e = 0, f = d.length; e < f; e++) {
                var h = d[e]
                if (h.ctx === c && h.fn === b)
                  return (h.fn = g), this._firingCount && (this._events[a] = d = d.slice()), void d.splice(e, 1)
              }
          } else {
            for (e = 0, f = d.length; e < f; e++) d[e].fn = g
            delete this._events[a]
          }
      },
      fire: function(a, c, d) {
        if (!this.listens(a, d)) return this
        var e = b({}, c, {
          type: a,
          target: this,
          sourceTarget: (c && c.sourceTarget) || this,
        })
        if (this._events) {
          var f = this._events[a]
          if (f) {
            this._firingCount = this._firingCount + 1 || 1
            for (var g = 0, h = f.length; g < h; g++) {
              var i = f[g]
              i.fn.call(i.ctx || this, e)
            }
            this._firingCount--
          }
        }
        return d && this._propagateEvent(e), this
      },
      listens: function(a, b) {
        var c = this._events && this._events[a]
        if (c && c.length) return !0
        if (b) for (var d in this._eventParents) if (this._eventParents[d].listens(a, b)) return !0
        return !1
      },
      once: function(a, b, d) {
        if ('object' == typeof a) {
          for (var e in a) this.once(e, a[e], b)
          return this
        }
        var f = c(function() {
          this.off(a, b, d).off(a, f, d)
        }, this)
        return this.on(a, b, d).on(a, f, d)
      },
      addEventParent: function(a) {
        return (this._eventParents = this._eventParents || {}), (this._eventParents[d(a)] = a), this
      },
      removeEventParent: function(a) {
        return this._eventParents && delete this._eventParents[d(a)], this
      },
      _propagateEvent: function(a) {
        for (var c in this._eventParents)
          this._eventParents[c].fire(
            a.type,
            b(
              {
                layer: a.target,
                propagatedFrom: a.target,
              },
              a,
            ),
            !0,
          )
      },
    }
    ;(ib.addEventListener = ib.on),
      (ib.removeEventListener = ib.clearAllEventListeners = ib.off),
      (ib.addOneTimeEventListener = ib.once),
      (ib.fireEvent = ib.fire),
      (ib.hasEventListeners = ib.listens)
    var jb = s.extend(ib),
      kb =
        Math.trunc ||
        function(a) {
          return a > 0 ? Math.floor(a) : Math.ceil(a)
        }
    ;(u.prototype = {
      clone: function() {
        return new u(this.x, this.y)
      },
      add: function(a) {
        return this.clone()._add(v(a))
      },
      _add: function(a) {
        return (this.x += a.x), (this.y += a.y), this
      },
      subtract: function(a) {
        return this.clone()._subtract(v(a))
      },
      _subtract: function(a) {
        return (this.x -= a.x), (this.y -= a.y), this
      },
      divideBy: function(a) {
        return this.clone()._divideBy(a)
      },
      _divideBy: function(a) {
        return (this.x /= a), (this.y /= a), this
      },
      multiplyBy: function(a) {
        return this.clone()._multiplyBy(a)
      },
      _multiplyBy: function(a) {
        return (this.x *= a), (this.y *= a), this
      },
      scaleBy: function(a) {
        return new u(this.x * a.x, this.y * a.y)
      },
      unscaleBy: function(a) {
        return new u(this.x / a.x, this.y / a.y)
      },
      round: function() {
        return this.clone()._round()
      },
      _round: function() {
        return (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this
      },
      floor: function() {
        return this.clone()._floor()
      },
      _floor: function() {
        return (this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this
      },
      ceil: function() {
        return this.clone()._ceil()
      },
      _ceil: function() {
        return (this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this
      },
      trunc: function() {
        return this.clone()._trunc()
      },
      _trunc: function() {
        return (this.x = kb(this.x)), (this.y = kb(this.y)), this
      },
      distanceTo: function(a) {
        var b = (a = v(a)).x - this.x,
          c = a.y - this.y
        return Math.sqrt(b * b + c * c)
      },
      equals: function(a) {
        return (a = v(a)).x === this.x && a.y === this.y
      },
      contains: function(a) {
        return (a = v(a)), Math.abs(a.x) <= Math.abs(this.x) && Math.abs(a.y) <= Math.abs(this.y)
      },
      toString: function() {
        return 'Point(' + h(this.x) + ', ' + h(this.y) + ')'
      },
    }),
      (w.prototype = {
        extend: function(a) {
          return (
            (a = v(a)),
            this.min || this.max
              ? ((this.min.x = Math.min(a.x, this.min.x)),
                (this.max.x = Math.max(a.x, this.max.x)),
                (this.min.y = Math.min(a.y, this.min.y)),
                (this.max.y = Math.max(a.y, this.max.y)))
              : ((this.min = a.clone()), (this.max = a.clone())),
            this
          )
        },
        getCenter: function(a) {
          return new u((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, a)
        },
        getBottomLeft: function() {
          return new u(this.min.x, this.max.y)
        },
        getTopRight: function() {
          return new u(this.max.x, this.min.y)
        },
        getTopLeft: function() {
          return this.min
        },
        getBottomRight: function() {
          return this.max
        },
        getSize: function() {
          return this.max.subtract(this.min)
        },
        contains: function(a) {
          var b, c
          return (
            (a = 'number' == typeof a[0] || a instanceof u ? v(a) : x(a)) instanceof w
              ? ((b = a.min), (c = a.max))
              : (b = c = a),
            b.x >= this.min.x && c.x <= this.max.x && b.y >= this.min.y && c.y <= this.max.y
          )
        },
        intersects: function(a) {
          a = x(a)
          var b = this.min,
            c = this.max,
            d = a.min,
            e = a.max,
            f = e.x >= b.x && d.x <= c.x,
            g = e.y >= b.y && d.y <= c.y
          return f && g
        },
        overlaps: function(a) {
          a = x(a)
          var b = this.min,
            c = this.max,
            d = a.min,
            e = a.max,
            f = e.x > b.x && d.x < c.x,
            g = e.y > b.y && d.y < c.y
          return f && g
        },
        isValid: function() {
          return !(!this.min || !this.max)
        },
      }),
      (y.prototype = {
        extend: function(a) {
          var b,
            c,
            d = this._southWest,
            e = this._northEast
          if (a instanceof A) (b = a), (c = a)
          else {
            if (!(a instanceof y)) return a ? this.extend(B(a) || z(a)) : this
            if (((b = a._southWest), (c = a._northEast), !b || !c)) return this
          }
          return (
            d || e
              ? ((d.lat = Math.min(b.lat, d.lat)),
                (d.lng = Math.min(b.lng, d.lng)),
                (e.lat = Math.max(c.lat, e.lat)),
                (e.lng = Math.max(c.lng, e.lng)))
              : ((this._southWest = new A(b.lat, b.lng)), (this._northEast = new A(c.lat, c.lng))),
            this
          )
        },
        pad: function(a) {
          var b = this._southWest,
            c = this._northEast,
            d = Math.abs(b.lat - c.lat) * a,
            e = Math.abs(b.lng - c.lng) * a
          return new y(new A(b.lat - d, b.lng - e), new A(c.lat + d, c.lng + e))
        },
        getCenter: function() {
          return new A((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2)
        },
        getSouthWest: function() {
          return this._southWest
        },
        getNorthEast: function() {
          return this._northEast
        },
        getNorthWest: function() {
          return new A(this.getNorth(), this.getWest())
        },
        getSouthEast: function() {
          return new A(this.getSouth(), this.getEast())
        },
        getWest: function() {
          return this._southWest.lng
        },
        getSouth: function() {
          return this._southWest.lat
        },
        getEast: function() {
          return this._northEast.lng
        },
        getNorth: function() {
          return this._northEast.lat
        },
        contains: function(a) {
          a = 'number' == typeof a[0] || a instanceof A || 'lat' in a ? B(a) : z(a)
          var b,
            c,
            d = this._southWest,
            e = this._northEast
          return (
            a instanceof y ? ((b = a.getSouthWest()), (c = a.getNorthEast())) : (b = c = a),
            b.lat >= d.lat && c.lat <= e.lat && b.lng >= d.lng && c.lng <= e.lng
          )
        },
        intersects: function(a) {
          a = z(a)
          var b = this._southWest,
            c = this._northEast,
            d = a.getSouthWest(),
            e = a.getNorthEast(),
            f = e.lat >= b.lat && d.lat <= c.lat,
            g = e.lng >= b.lng && d.lng <= c.lng
          return f && g
        },
        overlaps: function(a) {
          a = z(a)
          var b = this._southWest,
            c = this._northEast,
            d = a.getSouthWest(),
            e = a.getNorthEast(),
            f = e.lat > b.lat && d.lat < c.lat,
            g = e.lng > b.lng && d.lng < c.lng
          return f && g
        },
        toBBoxString: function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',')
        },
        equals: function(a, b) {
          return (
            !!a &&
            ((a = z(a)), this._southWest.equals(a.getSouthWest(), b) && this._northEast.equals(a.getNorthEast(), b))
          )
        },
        isValid: function() {
          return !(!this._southWest || !this._northEast)
        },
      }),
      (A.prototype = {
        equals: function(a, b) {
          return (
            !!a &&
            ((a = B(a)), Math.max(Math.abs(this.lat - a.lat), Math.abs(this.lng - a.lng)) <= (void 0 === b ? 1e-9 : b))
          )
        },
        toString: function(a) {
          return 'LatLng(' + h(this.lat, a) + ', ' + h(this.lng, a) + ')'
        },
        distanceTo: function(a) {
          return mb.distance(this, B(a))
        },
        wrap: function() {
          return mb.wrapLatLng(this)
        },
        toBounds: function(a) {
          var b = (180 * a) / 40075017,
            c = b / Math.cos((Math.PI / 180) * this.lat)
          return z([this.lat - b, this.lng - c], [this.lat + b, this.lng + c])
        },
        clone: function() {
          return new A(this.lat, this.lng, this.alt)
        },
      })
    var lb = {
        latLngToPoint: function(a, b) {
          var c = this.projection.project(a),
            d = this.scale(b)
          return this.transformation._transform(c, d)
        },
        pointToLatLng: function(a, b) {
          var c = this.scale(b),
            d = this.transformation.untransform(a, c)
          return this.projection.unproject(d)
        },
        project: function(a) {
          return this.projection.project(a)
        },
        unproject: function(a) {
          return this.projection.unproject(a)
        },
        scale: function(a) {
          return 256 * Math.pow(2, a)
        },
        zoom: function(a) {
          return Math.log(a / 256) / Math.LN2
        },
        getProjectedBounds: function(a) {
          if (this.infinite) return null
          var b = this.projection.bounds,
            c = this.scale(a)
          return new w(this.transformation.transform(b.min, c), this.transformation.transform(b.max, c))
        },
        infinite: !1,
        wrapLatLng: function(a) {
          var b = this.wrapLng ? f(a.lng, this.wrapLng, !0) : a.lng
          return new A(this.wrapLat ? f(a.lat, this.wrapLat, !0) : a.lat, b, a.alt)
        },
        wrapLatLngBounds: function(a) {
          var b = a.getCenter(),
            c = this.wrapLatLng(b),
            d = b.lat - c.lat,
            e = b.lng - c.lng
          if (0 === d && 0 === e) return a
          var f = a.getSouthWest(),
            g = a.getNorthEast()
          return new y(new A(f.lat - d, f.lng - e), new A(g.lat - d, g.lng - e))
        },
      },
      mb = b({}, lb, {
        wrapLng: [-180, 180],
        R: 6371e3,
        distance: function(a, b) {
          var c = Math.PI / 180,
            d = a.lat * c,
            e = b.lat * c,
            f = Math.sin(((b.lat - a.lat) * c) / 2),
            g = Math.sin(((b.lng - a.lng) * c) / 2),
            h = f * f + Math.cos(d) * Math.cos(e) * g * g,
            i = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
          return this.R * i
        },
      }),
      nb = {
        R: 6378137,
        MAX_LATITUDE: 85.0511287798,
        project: function(a) {
          var b = Math.PI / 180,
            c = this.MAX_LATITUDE,
            d = Math.max(Math.min(c, a.lat), -c),
            e = Math.sin(d * b)
          return new u(this.R * a.lng * b, (this.R * Math.log((1 + e) / (1 - e))) / 2)
        },
        unproject: function(a) {
          var b = 180 / Math.PI
          return new A((2 * Math.atan(Math.exp(a.y / this.R)) - Math.PI / 2) * b, (a.x * b) / this.R)
        },
        bounds: (function() {
          var a = 6378137 * Math.PI
          return new w([-a, -a], [a, a])
        })(),
      }
    C.prototype = {
      transform: function(a, b) {
        return this._transform(a.clone(), b)
      },
      _transform: function(a, b) {
        return (b = b || 1), (a.x = b * (this._a * a.x + this._b)), (a.y = b * (this._c * a.y + this._d)), a
      },
      untransform: function(a, b) {
        return (b = b || 1), new u((a.x / b - this._b) / this._a, (a.y / b - this._d) / this._c)
      },
    }
    var ob,
      pb,
      qb,
      rb,
      sb = b({}, mb, {
        code: 'EPSG:3857',
        projection: nb,
        transformation: (function() {
          var a = 0.5 / (Math.PI * nb.R)
          return D(a, 0.5, -a, 0.5)
        })(),
      }),
      tb = b({}, sb, {
        code: 'EPSG:900913',
      }),
      ub = document.documentElement.style,
      vb = 'ActiveXObject' in window,
      wb = vb && !document.addEventListener,
      xb = 'msLaunchUri' in navigator && !('documentMode' in document),
      yb = G('webkit'),
      zb = G('android'),
      Ab = G('android 2') || G('android 3'),
      Bb = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10),
      Cb = zb && G('Google') && Bb < 537 && !('AudioNode' in window),
      Db = !!window.opera,
      Eb = G('chrome'),
      Fb = G('gecko') && !yb && !Db && !vb,
      Gb = !Eb && G('safari'),
      Hb = G('phantom'),
      Ib = 'OTransition' in ub,
      Jb = 0 === navigator.platform.indexOf('Win'),
      Kb = vb && 'transition' in ub,
      Lb = 'WebKitCSSMatrix' in window && 'm11' in new window.WebKitCSSMatrix() && !Ab,
      Mb = 'MozPerspective' in ub,
      Nb = !window.L_DISABLE_3D && (Kb || Lb || Mb) && !Ib && !Hb,
      Ob = 'undefined' != typeof orientation || G('mobile'),
      Pb = Ob && yb,
      Qb = Ob && Lb,
      Rb = !window.PointerEvent && window.MSPointerEvent,
      Sb = !(!window.PointerEvent && !Rb),
      Tb =
        !window.L_NO_TOUCH &&
        (Sb || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)),
      Ub = Ob && Db,
      Vb = Ob && Fb,
      Wb = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1,
      Xb = !!document.createElement('canvas').getContext,
      Yb = !(!document.createElementNS || !E('svg').createSVGRect),
      Zb =
        !Yb &&
        (function() {
          try {
            var a = document.createElement('div')
            a.innerHTML = '<v:shape adj="1"/>'
            var b = a.firstChild
            return (b.style.behavior = 'url(#default#VML)'), b && 'object' == typeof b.adj
          } catch (a) {
            return !1
          }
        })(),
      $b = (Object.freeze || Object)({
        ie: vb,
        ielt9: wb,
        edge: xb,
        webkit: yb,
        android: zb,
        android23: Ab,
        androidStock: Cb,
        opera: Db,
        chrome: Eb,
        gecko: Fb,
        safari: Gb,
        phantom: Hb,
        opera12: Ib,
        win: Jb,
        ie3d: Kb,
        webkit3d: Lb,
        gecko3d: Mb,
        any3d: Nb,
        mobile: Ob,
        mobileWebkit: Pb,
        mobileWebkit3d: Qb,
        msPointer: Rb,
        pointer: Sb,
        touch: Tb,
        mobileOpera: Ub,
        mobileGecko: Vb,
        retina: Wb,
        canvas: Xb,
        svg: Yb,
        vml: Zb,
      }),
      _b = Rb ? 'MSPointerDown' : 'pointerdown',
      ac = Rb ? 'MSPointerMove' : 'pointermove',
      bc = Rb ? 'MSPointerUp' : 'pointerup',
      cc = Rb ? 'MSPointerCancel' : 'pointercancel',
      dc = ['INPUT', 'SELECT', 'OPTION'],
      ec = {},
      fc = !1,
      gc = 0,
      hc = Rb ? 'MSPointerDown' : Sb ? 'pointerdown' : 'touchstart',
      ic = Rb ? 'MSPointerUp' : Sb ? 'pointerup' : 'touchend',
      jc = '_leaflet_',
      kc = '_leaflet_events',
      lc = Jb && Eb ? 2 * window.devicePixelRatio : Fb ? window.devicePixelRatio : 1,
      mc = {},
      nc = (Object.freeze || Object)({
        on: T,
        off: U,
        stopPropagation: X,
        disableScrollPropagation: Y,
        disableClickPropagation: Z,
        preventDefault: $,
        stop: _,
        getMousePosition: aa,
        getWheelDelta: ba,
        fakeStop: ca,
        skipped: da,
        isExternalTarget: ea,
        addListener: T,
        removeListener: U,
      }),
      oc = ua(['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']),
      pc = ua(['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']),
      qc = 'webkitTransition' === pc || 'OTransition' === pc ? pc + 'End' : 'transitionend'
    if ('onselectstart' in document)
      (pb = function() {
        T(window, 'selectstart', $)
      }),
        (qb = function() {
          U(window, 'selectstart', $)
        })
    else {
      var rc = ua(['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect'])
      ;(pb = function() {
        if (rc) {
          var a = document.documentElement.style
          ;(rb = a[rc]), (a[rc] = 'none')
        }
      }),
        (qb = function() {
          rc && ((document.documentElement.style[rc] = rb), (rb = void 0))
        })
    }
    var sc,
      tc,
      uc = (Object.freeze || Object)({
        TRANSFORM: oc,
        TRANSITION: pc,
        TRANSITION_END: qc,
        get: ga,
        getStyle: ha,
        create: ia,
        remove: ja,
        empty: ka,
        toFront: la,
        toBack: ma,
        hasClass: na,
        addClass: oa,
        removeClass: pa,
        setClass: qa,
        getClass: ra,
        setOpacity: sa,
        testProp: ua,
        setTransform: va,
        setPosition: wa,
        getPosition: xa,
        disableTextSelection: pb,
        enableTextSelection: qb,
        disableImageDrag: ya,
        enableImageDrag: za,
        preventOutline: Aa,
        restoreOutline: Ba,
      }),
      vc = jb.extend({
        run: function(a, b, c, d) {
          this.stop(),
            (this._el = a),
            (this._inProgress = !0),
            (this._duration = c || 0.25),
            (this._easeOutPower = 1 / Math.max(d || 0.5, 0.2)),
            (this._startPos = xa(a)),
            (this._offset = b.subtract(this._startPos)),
            (this._startTime = +new Date()),
            this.fire('start'),
            this._animate()
        },
        stop: function() {
          this._inProgress && (this._step(!0), this._complete())
        },
        _animate: function() {
          ;(this._animId = q(this._animate, this)), this._step()
        },
        _step: function(a) {
          var b = +new Date() - this._startTime,
            c = 1e3 * this._duration
          b < c ? this._runFrame(this._easeOut(b / c), a) : (this._runFrame(1), this._complete())
        },
        _runFrame: function(a, b) {
          var c = this._startPos.add(this._offset.multiplyBy(a))
          b && c._round(), wa(this._el, c), this.fire('step')
        },
        _complete: function() {
          r(this._animId), (this._inProgress = !1), this.fire('end')
        },
        _easeOut: function(a) {
          return 1 - Math.pow(1 - a, this._easeOutPower)
        },
      }),
      wc = jb.extend({
        options: {
          crs: sb,
          center: void 0,
          zoom: void 0,
          minZoom: void 0,
          maxZoom: void 0,
          layers: [],
          maxBounds: void 0,
          renderer: void 0,
          zoomAnimation: !0,
          zoomAnimationThreshold: 4,
          fadeAnimation: !0,
          markerZoomAnimation: !0,
          transform3DLimit: 8388608,
          zoomSnap: 1,
          zoomDelta: 1,
          trackResize: !0,
        },
        initialize: function(a, b) {
          ;(b = k(this, b)),
            this._initContainer(a),
            this._initLayout(),
            (this._onResize = c(this._onResize, this)),
            this._initEvents(),
            b.maxBounds && this.setMaxBounds(b.maxBounds),
            void 0 !== b.zoom && (this._zoom = this._limitZoom(b.zoom)),
            b.center &&
              void 0 !== b.zoom &&
              this.setView(B(b.center), b.zoom, {
                reset: !0,
              }),
            (this._handlers = []),
            (this._layers = {}),
            (this._zoomBoundLayers = {}),
            (this._sizeChanged = !0),
            this.callInitHooks(),
            (this._zoomAnimated = pc && Nb && !Ub && this.options.zoomAnimation),
            this._zoomAnimated && (this._createAnimProxy(), T(this._proxy, qc, this._catchTransitionEnd, this)),
            this._addLayers(this.options.layers)
        },
        setView: function(a, c, d) {
          return (
            (c = void 0 === c ? this._zoom : this._limitZoom(c)),
            (a = this._limitCenter(B(a), c, this.options.maxBounds)),
            (d = d || {}),
            this._stop(),
            this._loaded &&
            !d.reset &&
            !0 !== d &&
            (void 0 !== d.animate &&
              ((d.zoom = b(
                {
                  animate: d.animate,
                },
                d.zoom,
              )),
              (d.pan = b(
                {
                  animate: d.animate,
                  duration: d.duration,
                },
                d.pan,
              ))),
            this._zoom !== c
              ? this._tryAnimatedZoom && this._tryAnimatedZoom(a, c, d.zoom)
              : this._tryAnimatedPan(a, d.pan))
              ? (clearTimeout(this._sizeTimer), this)
              : (this._resetView(a, c), this)
          )
        },
        setZoom: function(a, b) {
          return this._loaded
            ? this.setView(this.getCenter(), a, {
                zoom: b,
              })
            : ((this._zoom = a), this)
        },
        zoomIn: function(a, b) {
          return (a = a || (Nb ? this.options.zoomDelta : 1)), this.setZoom(this._zoom + a, b)
        },
        zoomOut: function(a, b) {
          return (a = a || (Nb ? this.options.zoomDelta : 1)), this.setZoom(this._zoom - a, b)
        },
        setZoomAround: function(a, b, c) {
          var d = this.getZoomScale(b),
            e = this.getSize().divideBy(2),
            f = (a instanceof u ? a : this.latLngToContainerPoint(a)).subtract(e).multiplyBy(1 - 1 / d),
            g = this.containerPointToLatLng(e.add(f))
          return this.setView(g, b, {
            zoom: c,
          })
        },
        _getBoundsCenterZoom: function(a, b) {
          ;(b = b || {}), (a = a.getBounds ? a.getBounds() : z(a))
          var c = v(b.paddingTopLeft || b.padding || [0, 0]),
            d = v(b.paddingBottomRight || b.padding || [0, 0]),
            e = this.getBoundsZoom(a, !1, c.add(d))
          if ((e = 'number' == typeof b.maxZoom ? Math.min(b.maxZoom, e) : e) === 1 / 0)
            return {
              center: a.getCenter(),
              zoom: e,
            }
          var f = d.subtract(c).divideBy(2),
            g = this.project(a.getSouthWest(), e),
            h = this.project(a.getNorthEast(), e)
          return {
            center: this.unproject(
              g
                .add(h)
                .divideBy(2)
                .add(f),
              e,
            ),
            zoom: e,
          }
        },
        fitBounds: function(a, b) {
          if (!(a = z(a)).isValid()) throw new Error('Bounds are not valid.')
          var c = this._getBoundsCenterZoom(a, b)
          return this.setView(c.center, c.zoom, b)
        },
        fitWorld: function(a) {
          return this.fitBounds([[-90, -180], [90, 180]], a)
        },
        panTo: function(a, b) {
          return this.setView(a, this._zoom, {
            pan: b,
          })
        },
        panBy: function(a, b) {
          if (((a = v(a).round()), (b = b || {}), !a.x && !a.y)) return this.fire('moveend')
          if (!0 !== b.animate && !this.getSize().contains(a))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(a)), this.getZoom()), this
          if (
            (this._panAnim ||
              ((this._panAnim = new vc()),
              this._panAnim.on(
                {
                  step: this._onPanTransitionStep,
                  end: this._onPanTransitionEnd,
                },
                this,
              )),
            b.noMoveStart || this.fire('movestart'),
            !1 !== b.animate)
          ) {
            oa(this._mapPane, 'leaflet-pan-anim')
            var c = this._getMapPanePos()
              .subtract(a)
              .round()
            this._panAnim.run(this._mapPane, c, b.duration || 0.25, b.easeLinearity)
          } else this._rawPanBy(a), this.fire('move').fire('moveend')
          return this
        },
        flyTo: function(a, b, c) {
          function d(a) {
            var b = (r * r - p * p + (a ? -1 : 1) * u * u * s * s) / (2 * (a ? r : p) * u * s),
              c = Math.sqrt(b * b + 1) - b
            return c < 1e-9 ? -18 : Math.log(c)
          }

          function e(a) {
            return (Math.exp(a) - Math.exp(-a)) / 2
          }

          function f(a) {
            return (Math.exp(a) + Math.exp(-a)) / 2
          }

          function g(a) {
            return e(a) / f(a)
          }

          function h(a) {
            return p * (f(v) / f(v + t * a))
          }

          function i(a) {
            return (p * (f(v) * g(v + t * a) - e(v))) / u
          }

          function j(a) {
            return 1 - Math.pow(1 - a, 1.5)
          }

          function k() {
            var c = (Date.now() - w) / y,
              d = j(c) * x
            c <= 1
              ? ((this._flyToFrame = q(k, this)),
                this._move(
                  this.unproject(l.add(m.subtract(l).multiplyBy(i(d) / s)), o),
                  this.getScaleZoom(p / h(d), o),
                  {
                    flyTo: !0,
                  },
                ))
              : this._move(a, b)._moveEnd(!0)
          }
          if (!1 === (c = c || {}).animate || !Nb) return this.setView(a, b, c)
          this._stop()
          var l = this.project(this.getCenter()),
            m = this.project(a),
            n = this.getSize(),
            o = this._zoom
          ;(a = B(a)), (b = void 0 === b ? o : b)
          var p = Math.max(n.x, n.y),
            r = p * this.getZoomScale(o, b),
            s = m.distanceTo(l) || 1,
            t = 1.42,
            u = t * t,
            v = d(0),
            w = Date.now(),
            x = (d(1) - v) / t,
            y = c.duration ? 1e3 * c.duration : 1e3 * x * 0.8
          return this._moveStart(!0, c.noMoveStart), k.call(this), this
        },
        flyToBounds: function(a, b) {
          var c = this._getBoundsCenterZoom(a, b)
          return this.flyTo(c.center, c.zoom, b)
        },
        setMaxBounds: function(a) {
          return (a = z(a)).isValid()
            ? (this.options.maxBounds && this.off('moveend', this._panInsideMaxBounds),
              (this.options.maxBounds = a),
              this._loaded && this._panInsideMaxBounds(),
              this.on('moveend', this._panInsideMaxBounds))
            : ((this.options.maxBounds = null), this.off('moveend', this._panInsideMaxBounds))
        },
        setMinZoom: function(a) {
          var b = this.options.minZoom
          return (
            (this.options.minZoom = a),
            this._loaded && b !== a && (this.fire('zoomlevelschange'), this.getZoom() < this.options.minZoom)
              ? this.setZoom(a)
              : this
          )
        },
        setMaxZoom: function(a) {
          var b = this.options.maxZoom
          return (
            (this.options.maxZoom = a),
            this._loaded && b !== a && (this.fire('zoomlevelschange'), this.getZoom() > this.options.maxZoom)
              ? this.setZoom(a)
              : this
          )
        },
        panInsideBounds: function(a, b) {
          this._enforcingBounds = !0
          var c = this.getCenter(),
            d = this._limitCenter(c, this._zoom, z(a))
          return c.equals(d) || this.panTo(d, b), (this._enforcingBounds = !1), this
        },
        invalidateSize: function(a) {
          if (!this._loaded) return this
          a = b(
            {
              animate: !1,
              pan: !0,
            },
            !0 === a
              ? {
                  animate: !0,
                }
              : a,
          )
          var d = this.getSize()
          ;(this._sizeChanged = !0), (this._lastCenter = null)
          var e = this.getSize(),
            f = d.divideBy(2).round(),
            g = e.divideBy(2).round(),
            h = f.subtract(g)
          return h.x || h.y
            ? (a.animate && a.pan
                ? this.panBy(h)
                : (a.pan && this._rawPanBy(h),
                  this.fire('move'),
                  a.debounceMoveend
                    ? (clearTimeout(this._sizeTimer),
                      (this._sizeTimer = setTimeout(c(this.fire, this, 'moveend'), 200)))
                    : this.fire('moveend')),
              this.fire('resize', {
                oldSize: d,
                newSize: e,
              }))
            : this
        },
        stop: function() {
          return (
            this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire('viewreset'), this._stop()
          )
        },
        locate: function(a) {
          if (
            ((a = this._locateOptions = b(
              {
                timeout: 1e4,
                watch: !1,
              },
              a,
            )),
            !('geolocation' in navigator))
          )
            return (
              this._handleGeolocationError({
                code: 0,
                message: 'Geolocation not supported.',
              }),
              this
            )
          var d = c(this._handleGeolocationResponse, this),
            e = c(this._handleGeolocationError, this)
          return (
            a.watch
              ? (this._locationWatchId = navigator.geolocation.watchPosition(d, e, a))
              : navigator.geolocation.getCurrentPosition(d, e, a),
            this
          )
        },
        stopLocate: function() {
          return (
            navigator.geolocation &&
              navigator.geolocation.clearWatch &&
              navigator.geolocation.clearWatch(this._locationWatchId),
            this._locateOptions && (this._locateOptions.setView = !1),
            this
          )
        },
        _handleGeolocationError: function(a) {
          var b = a.code,
            c = a.message || (1 === b ? 'permission denied' : 2 === b ? 'position unavailable' : 'timeout')
          this._locateOptions.setView && !this._loaded && this.fitWorld(),
            this.fire('locationerror', {
              code: b,
              message: 'Geolocation error: ' + c + '.',
            })
        },
        _handleGeolocationResponse: function(a) {
          var b = new A(a.coords.latitude, a.coords.longitude),
            c = b.toBounds(a.coords.accuracy),
            d = this._locateOptions
          if (d.setView) {
            var e = this.getBoundsZoom(c)
            this.setView(b, d.maxZoom ? Math.min(e, d.maxZoom) : e)
          }
          var f = {
            latlng: b,
            bounds: c,
            timestamp: a.timestamp,
          }
          for (var g in a.coords) 'number' == typeof a.coords[g] && (f[g] = a.coords[g])
          this.fire('locationfound', f)
        },
        addHandler: function(a, b) {
          if (!b) return this
          var c = (this[a] = new b(this))
          return this._handlers.push(c), this.options[a] && c.enable(), this
        },
        remove: function() {
          if ((this._initEvents(!0), this._containerId !== this._container._leaflet_id))
            throw new Error('Map container is being reused by another instance')
          try {
            delete this._container._leaflet_id, delete this._containerId
          } catch (a) {
            ;(this._container._leaflet_id = void 0), (this._containerId = void 0)
          }
          void 0 !== this._locationWatchId && this.stopLocate(),
            this._stop(),
            ja(this._mapPane),
            this._clearControlPos && this._clearControlPos(),
            this._clearHandlers(),
            this._loaded && this.fire('unload')
          var a
          for (a in this._layers) this._layers[a].remove()
          for (a in this._panes) ja(this._panes[a])
          return (this._layers = []), (this._panes = []), delete this._mapPane, delete this._renderer, this
        },
        createPane: function(a, b) {
          var c = ia(
            'div',
            'leaflet-pane' + (a ? ' leaflet-' + a.replace('Pane', '') + '-pane' : ''),
            b || this._mapPane,
          )
          return a && (this._panes[a] = c), c
        },
        getCenter: function() {
          return (
            this._checkIfLoaded(),
            this._lastCenter && !this._moved() ? this._lastCenter : this.layerPointToLatLng(this._getCenterLayerPoint())
          )
        },
        getZoom: function() {
          return this._zoom
        },
        getBounds: function() {
          var a = this.getPixelBounds()
          return new y(this.unproject(a.getBottomLeft()), this.unproject(a.getTopRight()))
        },
        getMinZoom: function() {
          return void 0 === this.options.minZoom ? this._layersMinZoom || 0 : this.options.minZoom
        },
        getMaxZoom: function() {
          return void 0 === this.options.maxZoom
            ? void 0 === this._layersMaxZoom
              ? 1 / 0
              : this._layersMaxZoom
            : this.options.maxZoom
        },
        getBoundsZoom: function(a, b, c) {
          ;(a = z(a)), (c = v(c || [0, 0]))
          var d = this.getZoom() || 0,
            e = this.getMinZoom(),
            f = this.getMaxZoom(),
            g = a.getNorthWest(),
            h = a.getSouthEast(),
            i = this.getSize().subtract(c),
            j = x(this.project(h, d), this.project(g, d)).getSize(),
            k = Nb ? this.options.zoomSnap : 1,
            l = i.x / j.x,
            m = i.y / j.y,
            n = b ? Math.max(l, m) : Math.min(l, m)
          return (
            (d = this.getScaleZoom(n, d)),
            k && ((d = Math.round(d / (k / 100)) * (k / 100)), (d = b ? Math.ceil(d / k) * k : Math.floor(d / k) * k)),
            Math.max(e, Math.min(f, d))
          )
        },
        getSize: function() {
          return (
            (this._size && !this._sizeChanged) ||
              ((this._size = new u(this._container.clientWidth || 0, this._container.clientHeight || 0)),
              (this._sizeChanged = !1)),
            this._size.clone()
          )
        },
        getPixelBounds: function(a, b) {
          var c = this._getTopLeftPoint(a, b)
          return new w(c, c.add(this.getSize()))
        },
        getPixelOrigin: function() {
          return this._checkIfLoaded(), this._pixelOrigin
        },
        getPixelWorldBounds: function(a) {
          return this.options.crs.getProjectedBounds(void 0 === a ? this.getZoom() : a)
        },
        getPane: function(a) {
          return 'string' == typeof a ? this._panes[a] : a
        },
        getPanes: function() {
          return this._panes
        },
        getContainer: function() {
          return this._container
        },
        getZoomScale: function(a, b) {
          var c = this.options.crs
          return (b = void 0 === b ? this._zoom : b), c.scale(a) / c.scale(b)
        },
        getScaleZoom: function(a, b) {
          var c = this.options.crs
          b = void 0 === b ? this._zoom : b
          var d = c.zoom(a * c.scale(b))
          return isNaN(d) ? 1 / 0 : d
        },
        project: function(a, b) {
          return (b = void 0 === b ? this._zoom : b), this.options.crs.latLngToPoint(B(a), b)
        },
        unproject: function(a, b) {
          return (b = void 0 === b ? this._zoom : b), this.options.crs.pointToLatLng(v(a), b)
        },
        layerPointToLatLng: function(a) {
          var b = v(a).add(this.getPixelOrigin())
          return this.unproject(b)
        },
        latLngToLayerPoint: function(a) {
          return this.project(B(a))
            ._round()
            ._subtract(this.getPixelOrigin())
        },
        wrapLatLng: function(a) {
          return this.options.crs.wrapLatLng(B(a))
        },
        wrapLatLngBounds: function(a) {
          return this.options.crs.wrapLatLngBounds(z(a))
        },
        distance: function(a, b) {
          return this.options.crs.distance(B(a), B(b))
        },
        containerPointToLayerPoint: function(a) {
          return v(a).subtract(this._getMapPanePos())
        },
        layerPointToContainerPoint: function(a) {
          return v(a).add(this._getMapPanePos())
        },
        containerPointToLatLng: function(a) {
          var b = this.containerPointToLayerPoint(v(a))
          return this.layerPointToLatLng(b)
        },
        latLngToContainerPoint: function(a) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(B(a)))
        },
        mouseEventToContainerPoint: function(a) {
          return aa(a, this._container)
        },
        mouseEventToLayerPoint: function(a) {
          return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(a))
        },
        mouseEventToLatLng: function(a) {
          return this.layerPointToLatLng(this.mouseEventToLayerPoint(a))
        },
        _initContainer: function(a) {
          var b = (this._container = ga(a))
          if (!b) throw new Error('Map container not found.')
          if (b._leaflet_id) throw new Error('Map container is already initialized.')
          T(b, 'scroll', this._onScroll, this), (this._containerId = d(b))
        },
        _initLayout: function() {
          var a = this._container
          ;(this._fadeAnimated = this.options.fadeAnimation && Nb),
            oa(
              a,
              'leaflet-container' +
                (Tb ? ' leaflet-touch' : '') +
                (Wb ? ' leaflet-retina' : '') +
                (wb ? ' leaflet-oldie' : '') +
                (Gb ? ' leaflet-safari' : '') +
                (this._fadeAnimated ? ' leaflet-fade-anim' : ''),
            )
          var b = ha(a, 'position')
          'absolute' !== b && 'relative' !== b && 'fixed' !== b && (a.style.position = 'relative'),
            this._initPanes(),
            this._initControlPos && this._initControlPos()
        },
        _initPanes: function() {
          var a = (this._panes = {})
          ;(this._paneRenderers = {}),
            (this._mapPane = this.createPane('mapPane', this._container)),
            wa(this._mapPane, new u(0, 0)),
            this.createPane('tilePane'),
            this.createPane('shadowPane'),
            this.createPane('overlayPane'),
            this.createPane('markerPane'),
            this.createPane('tooltipPane'),
            this.createPane('popupPane'),
            this.options.markerZoomAnimation ||
              (oa(a.markerPane, 'leaflet-zoom-hide'), oa(a.shadowPane, 'leaflet-zoom-hide'))
        },
        _resetView: function(a, b) {
          wa(this._mapPane, new u(0, 0))
          var c = !this._loaded
          ;(this._loaded = !0), (b = this._limitZoom(b)), this.fire('viewprereset')
          var d = this._zoom !== b
          this._moveStart(d, !1)
            ._move(a, b)
            ._moveEnd(d),
            this.fire('viewreset'),
            c && this.fire('load')
        },
        _moveStart: function(a, b) {
          return a && this.fire('zoomstart'), b || this.fire('movestart'), this
        },
        _move: function(a, b, c) {
          void 0 === b && (b = this._zoom)
          var d = this._zoom !== b
          return (
            (this._zoom = b),
            (this._lastCenter = a),
            (this._pixelOrigin = this._getNewPixelOrigin(a)),
            (d || (c && c.pinch)) && this.fire('zoom', c),
            this.fire('move', c)
          )
        },
        _moveEnd: function(a) {
          return a && this.fire('zoomend'), this.fire('moveend')
        },
        _stop: function() {
          return r(this._flyToFrame), this._panAnim && this._panAnim.stop(), this
        },
        _rawPanBy: function(a) {
          wa(this._mapPane, this._getMapPanePos().subtract(a))
        },
        _getZoomSpan: function() {
          return this.getMaxZoom() - this.getMinZoom()
        },
        _panInsideMaxBounds: function() {
          this._enforcingBounds || this.panInsideBounds(this.options.maxBounds)
        },
        _checkIfLoaded: function() {
          if (!this._loaded) throw new Error('Set map center and zoom first.')
        },
        _initEvents: function(a) {
          ;(this._targets = {}), (this._targets[d(this._container)] = this)
          var b = a ? U : T
          b(
            this._container,
            'click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress',
            this._handleDOMEvent,
            this,
          ),
            this.options.trackResize && b(window, 'resize', this._onResize, this),
            Nb && this.options.transform3DLimit && (a ? this.off : this.on).call(this, 'moveend', this._onMoveEnd)
        },
        _onResize: function() {
          r(this._resizeRequest),
            (this._resizeRequest = q(function() {
              this.invalidateSize({
                debounceMoveend: !0,
              })
            }, this))
        },
        _onScroll: function() {
          ;(this._container.scrollTop = 0), (this._container.scrollLeft = 0)
        },
        _onMoveEnd: function() {
          var a = this._getMapPanePos()
          Math.max(Math.abs(a.x), Math.abs(a.y)) >= this.options.transform3DLimit &&
            this._resetView(this.getCenter(), this.getZoom())
        },
        _findEventTargets: function(a, b) {
          for (var c, e = [], f = 'mouseout' === b || 'mouseover' === b, g = a.target || a.srcElement, h = !1; g; ) {
            if (
              (c = this._targets[d(g)]) &&
              ('click' === b || 'preclick' === b) &&
              !a._simulated &&
              this._draggableMoved(c)
            ) {
              h = !0
              break
            }
            if (c && c.listens(b, !0)) {
              if (f && !ea(g, a)) break
              if ((e.push(c), f)) break
            }
            if (g === this._container) break
            g = g.parentNode
          }
          return e.length || h || f || !ea(g, a) || (e = [this]), e
        },
        _handleDOMEvent: function(a) {
          if (this._loaded && !da(a)) {
            var b = a.type
            ;('mousedown' !== b && 'keypress' !== b) || Aa(a.target || a.srcElement), this._fireDOMEvent(a, b)
          }
        },
        _mouseEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu'],
        _fireDOMEvent: function(a, c, d) {
          if ('click' === a.type) {
            var e = b({}, a)
            ;(e.type = 'preclick'), this._fireDOMEvent(e, e.type, d)
          }
          if (!a._stopped && (d = (d || []).concat(this._findEventTargets(a, c))).length) {
            var f = d[0]
            'contextmenu' === c && f.listens(c, !0) && $(a)
            var g = {
              originalEvent: a,
            }
            if ('keypress' !== a.type) {
              var h = f.getLatLng && (!f._radius || f._radius <= 10)
              ;(g.containerPoint = h ? this.latLngToContainerPoint(f.getLatLng()) : this.mouseEventToContainerPoint(a)),
                (g.layerPoint = this.containerPointToLayerPoint(g.containerPoint)),
                (g.latlng = h ? f.getLatLng() : this.layerPointToLatLng(g.layerPoint))
            }
            for (var i = 0; i < d.length; i++)
              if (
                (d[i].fire(c, g, !0),
                g.originalEvent._stopped || (!1 === d[i].options.bubblingMouseEvents && -1 !== n(this._mouseEvents, c)))
              )
                return
          }
        },
        _draggableMoved: function(a) {
          return (
            ((a = a.dragging && a.dragging.enabled() ? a : this).dragging && a.dragging.moved()) ||
            (this.boxZoom && this.boxZoom.moved())
          )
        },
        _clearHandlers: function() {
          for (var a = 0, b = this._handlers.length; a < b; a++) this._handlers[a].disable()
        },
        whenReady: function(a, b) {
          return (
            this._loaded
              ? a.call(b || this, {
                  target: this,
                })
              : this.on('load', a, b),
            this
          )
        },
        _getMapPanePos: function() {
          return xa(this._mapPane) || new u(0, 0)
        },
        _moved: function() {
          var a = this._getMapPanePos()
          return a && !a.equals([0, 0])
        },
        _getTopLeftPoint: function(a, b) {
          return (a && void 0 !== b ? this._getNewPixelOrigin(a, b) : this.getPixelOrigin()).subtract(
            this._getMapPanePos(),
          )
        },
        _getNewPixelOrigin: function(a, b) {
          var c = this.getSize()._divideBy(2)
          return this.project(a, b)
            ._subtract(c)
            ._add(this._getMapPanePos())
            ._round()
        },
        _latLngToNewLayerPoint: function(a, b, c) {
          var d = this._getNewPixelOrigin(c, b)
          return this.project(a, b)._subtract(d)
        },
        _latLngBoundsToNewLayerBounds: function(a, b, c) {
          var d = this._getNewPixelOrigin(c, b)
          return x([
            this.project(a.getSouthWest(), b)._subtract(d),
            this.project(a.getNorthWest(), b)._subtract(d),
            this.project(a.getSouthEast(), b)._subtract(d),
            this.project(a.getNorthEast(), b)._subtract(d),
          ])
        },
        _getCenterLayerPoint: function() {
          return this.containerPointToLayerPoint(this.getSize()._divideBy(2))
        },
        _getCenterOffset: function(a) {
          return this.latLngToLayerPoint(a).subtract(this._getCenterLayerPoint())
        },
        _limitCenter: function(a, b, c) {
          if (!c) return a
          var d = this.project(a, b),
            e = this.getSize().divideBy(2),
            f = new w(d.subtract(e), d.add(e)),
            g = this._getBoundsOffset(f, c, b)
          return g.round().equals([0, 0]) ? a : this.unproject(d.add(g), b)
        },
        _limitOffset: function(a, b) {
          if (!b) return a
          var c = this.getPixelBounds(),
            d = new w(c.min.add(a), c.max.add(a))
          return a.add(this._getBoundsOffset(d, b))
        },
        _getBoundsOffset: function(a, b, c) {
          var d = x(this.project(b.getNorthEast(), c), this.project(b.getSouthWest(), c)),
            e = d.min.subtract(a.min),
            f = d.max.subtract(a.max)
          return new u(this._rebound(e.x, -f.x), this._rebound(e.y, -f.y))
        },
        _rebound: function(a, b) {
          return a + b > 0 ? Math.round(a - b) / 2 : Math.max(0, Math.ceil(a)) - Math.max(0, Math.floor(b))
        },
        _limitZoom: function(a) {
          var b = this.getMinZoom(),
            c = this.getMaxZoom(),
            d = Nb ? this.options.zoomSnap : 1
          return d && (a = Math.round(a / d) * d), Math.max(b, Math.min(c, a))
        },
        _onPanTransitionStep: function() {
          this.fire('move')
        },
        _onPanTransitionEnd: function() {
          pa(this._mapPane, 'leaflet-pan-anim'), this.fire('moveend')
        },
        _tryAnimatedPan: function(a, b) {
          var c = this._getCenterOffset(a)._trunc()
          return !((!0 !== (b && b.animate) && !this.getSize().contains(c)) || (this.panBy(c, b), 0))
        },
        _createAnimProxy: function() {
          var a = (this._proxy = ia('div', 'leaflet-proxy leaflet-zoom-animated'))
          this._panes.mapPane.appendChild(a),
            this.on(
              'zoomanim',
              function(a) {
                var b = oc,
                  c = this._proxy.style[b]
                va(this._proxy, this.project(a.center, a.zoom), this.getZoomScale(a.zoom, 1)),
                  c === this._proxy.style[b] && this._animatingZoom && this._onZoomTransitionEnd()
              },
              this,
            ),
            this.on(
              'load moveend',
              function() {
                var a = this.getCenter(),
                  b = this.getZoom()
                va(this._proxy, this.project(a, b), this.getZoomScale(b, 1))
              },
              this,
            ),
            this._on('unload', this._destroyAnimProxy, this)
        },
        _destroyAnimProxy: function() {
          ja(this._proxy), delete this._proxy
        },
        _catchTransitionEnd: function(a) {
          this._animatingZoom && a.propertyName.indexOf('transform') >= 0 && this._onZoomTransitionEnd()
        },
        _nothingToAnimate: function() {
          return !this._container.getElementsByClassName('leaflet-zoom-animated').length
        },
        _tryAnimatedZoom: function(a, b, c) {
          if (this._animatingZoom) return !0
          if (
            ((c = c || {}),
            !this._zoomAnimated ||
              !1 === c.animate ||
              this._nothingToAnimate() ||
              Math.abs(b - this._zoom) > this.options.zoomAnimationThreshold)
          )
            return !1
          var d = this.getZoomScale(b),
            e = this._getCenterOffset(a)._divideBy(1 - 1 / d)
          return !(
            (!0 !== c.animate && !this.getSize().contains(e)) ||
            (q(function() {
              this._moveStart(!0, !1)._animateZoom(a, b, !0)
            }, this),
            0)
          )
        },
        _animateZoom: function(a, b, d, e) {
          this._mapPane &&
            (d &&
              ((this._animatingZoom = !0),
              (this._animateToCenter = a),
              (this._animateToZoom = b),
              oa(this._mapPane, 'leaflet-zoom-anim')),
            this.fire('zoomanim', {
              center: a,
              zoom: b,
              noUpdate: e,
            }),
            setTimeout(c(this._onZoomTransitionEnd, this), 250))
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom &&
            (this._mapPane && pa(this._mapPane, 'leaflet-zoom-anim'),
            (this._animatingZoom = !1),
            this._move(this._animateToCenter, this._animateToZoom),
            q(function() {
              this._moveEnd(!0)
            }, this))
        },
      }),
      xc = s.extend({
        options: {
          position: 'topright',
        },
        initialize: function(a) {
          k(this, a)
        },
        getPosition: function() {
          return this.options.position
        },
        setPosition: function(a) {
          var b = this._map
          return b && b.removeControl(this), (this.options.position = a), b && b.addControl(this), this
        },
        getContainer: function() {
          return this._container
        },
        addTo: function(a) {
          this.remove(), (this._map = a)
          var b = (this._container = this.onAdd(a)),
            c = this.getPosition(),
            d = a._controlCorners[c]
          return (
            oa(b, 'leaflet-control'),
            -1 !== c.indexOf('bottom') ? d.insertBefore(b, d.firstChild) : d.appendChild(b),
            this
          )
        },
        remove: function() {
          return this._map
            ? (ja(this._container), this.onRemove && this.onRemove(this._map), (this._map = null), this)
            : this
        },
        _refocusOnMap: function(a) {
          this._map && a && a.screenX > 0 && a.screenY > 0 && this._map.getContainer().focus()
        },
      }),
      yc = function(a) {
        return new xc(a)
      }
    wc.include({
      addControl: function(a) {
        return a.addTo(this), this
      },
      removeControl: function(a) {
        return a.remove(), this
      },
      _initControlPos: function() {
        function a(a, e) {
          var f = c + a + ' ' + c + e
          b[a + e] = ia('div', f, d)
        }
        var b = (this._controlCorners = {}),
          c = 'leaflet-',
          d = (this._controlContainer = ia('div', c + 'control-container', this._container))
        a('top', 'left'), a('top', 'right'), a('bottom', 'left'), a('bottom', 'right')
      },
      _clearControlPos: function() {
        for (var a in this._controlCorners) ja(this._controlCorners[a])
        ja(this._controlContainer), delete this._controlCorners, delete this._controlContainer
      },
    })
    var zc = xc.extend({
        options: {
          collapsed: !0,
          position: 'topright',
          autoZIndex: !0,
          hideSingleBase: !1,
          sortLayers: !1,
          sortFunction: function(a, b, c, d) {
            return c < d ? -1 : d < c ? 1 : 0
          },
        },
        initialize: function(a, b, c) {
          k(this, c),
            (this._layerControlInputs = []),
            (this._layers = []),
            (this._lastZIndex = 0),
            (this._handlingClick = !1)
          for (var d in a) this._addLayer(a[d], d)
          for (d in b) this._addLayer(b[d], d, !0)
        },
        onAdd: function(a) {
          this._initLayout(), this._update(), (this._map = a), a.on('zoomend', this._checkDisabledLayers, this)
          for (var b = 0; b < this._layers.length; b++)
            this._layers[b].layer.on('add remove', this._onLayerChange, this)
          return this._container
        },
        addTo: function(a) {
          return xc.prototype.addTo.call(this, a), this._expandIfNotCollapsed()
        },
        onRemove: function() {
          this._map.off('zoomend', this._checkDisabledLayers, this)
          for (var a = 0; a < this._layers.length; a++)
            this._layers[a].layer.off('add remove', this._onLayerChange, this)
        },
        addBaseLayer: function(a, b) {
          return this._addLayer(a, b), this._map ? this._update() : this
        },
        addOverlay: function(a, b) {
          return this._addLayer(a, b, !0), this._map ? this._update() : this
        },
        removeLayer: function(a) {
          a.off('add remove', this._onLayerChange, this)
          var b = this._getLayer(d(a))
          return b && this._layers.splice(this._layers.indexOf(b), 1), this._map ? this._update() : this
        },
        expand: function() {
          oa(this._container, 'leaflet-control-layers-expanded'), (this._form.style.height = null)
          var a = this._map.getSize().y - (this._container.offsetTop + 50)
          return (
            a < this._form.clientHeight
              ? (oa(this._form, 'leaflet-control-layers-scrollbar'), (this._form.style.height = a + 'px'))
              : pa(this._form, 'leaflet-control-layers-scrollbar'),
            this._checkDisabledLayers(),
            this
          )
        },
        collapse: function() {
          return pa(this._container, 'leaflet-control-layers-expanded'), this
        },
        _initLayout: function() {
          var a = 'leaflet-control-layers',
            b = (this._container = ia('div', a)),
            c = this.options.collapsed
          b.setAttribute('aria-haspopup', !0), Z(b), Y(b)
          var d = (this._form = ia('form', a + '-list'))
          c &&
            (this._map.on('click', this.collapse, this),
            zb ||
              T(
                b,
                {
                  mouseenter: this.expand,
                  mouseleave: this.collapse,
                },
                this,
              ))
          var e = (this._layersLink = ia('a', a + '-toggle', b))
          ;(e.href = '#'),
            (e.title = 'Layers'),
            Tb ? (T(e, 'click', _), T(e, 'click', this.expand, this)) : T(e, 'focus', this.expand, this),
            c || this.expand(),
            (this._baseLayersList = ia('div', a + '-base', d)),
            (this._separator = ia('div', a + '-separator', d)),
            (this._overlaysList = ia('div', a + '-overlays', d)),
            b.appendChild(d)
        },
        _getLayer: function(a) {
          for (var b = 0; b < this._layers.length; b++)
            if (this._layers[b] && d(this._layers[b].layer) === a) return this._layers[b]
        },
        _addLayer: function(a, b, d) {
          this._map && a.on('add remove', this._onLayerChange, this),
            this._layers.push({
              layer: a,
              name: b,
              overlay: d,
            }),
            this.options.sortLayers &&
              this._layers.sort(
                c(function(a, b) {
                  return this.options.sortFunction(a.layer, b.layer, a.name, b.name)
                }, this),
              ),
            this.options.autoZIndex && a.setZIndex && (this._lastZIndex++, a.setZIndex(this._lastZIndex)),
            this._expandIfNotCollapsed()
        },
        _update: function() {
          if (!this._container) return this
          ka(this._baseLayersList), ka(this._overlaysList), (this._layerControlInputs = [])
          var a,
            b,
            c,
            d,
            e = 0
          for (c = 0; c < this._layers.length; c++)
            (d = this._layers[c]),
              this._addItem(d),
              (b = b || d.overlay),
              (a = a || !d.overlay),
              (e += d.overlay ? 0 : 1)
          return (
            this.options.hideSingleBase && ((a = a && e > 1), (this._baseLayersList.style.display = a ? '' : 'none')),
            (this._separator.style.display = b && a ? '' : 'none'),
            this
          )
        },
        _onLayerChange: function(a) {
          this._handlingClick || this._update()
          var b = this._getLayer(d(a.target)),
            c = b.overlay
              ? 'add' === a.type
                ? 'overlayadd'
                : 'overlayremove'
              : 'add' === a.type
                ? 'baselayerchange'
                : null
          c && this._map.fire(c, b)
        },
        _createRadioElement: function(a, b) {
          var c =
              '<input type="radio" class="leaflet-control-layers-selector" name="' +
              a +
              '"' +
              (b ? ' checked="checked"' : '') +
              '/>',
            d = document.createElement('div')
          return (d.innerHTML = c), d.firstChild
        },
        _addItem: function(a) {
          var b,
            c = document.createElement('label'),
            e = this._map.hasLayer(a.layer)
          a.overlay
            ? (((b = document.createElement('input')).type = 'checkbox'),
              (b.className = 'leaflet-control-layers-selector'),
              (b.defaultChecked = e))
            : (b = this._createRadioElement('leaflet-base-layers', e)),
            this._layerControlInputs.push(b),
            (b.layerId = d(a.layer)),
            T(b, 'click', this._onInputClick, this)
          var f = document.createElement('span')
          f.innerHTML = ' ' + a.name
          var g = document.createElement('div')
          return (
            c.appendChild(g),
            g.appendChild(b),
            g.appendChild(f),
            (a.overlay ? this._overlaysList : this._baseLayersList).appendChild(c),
            this._checkDisabledLayers(),
            c
          )
        },
        _onInputClick: function() {
          var a,
            b,
            c = this._layerControlInputs,
            d = [],
            e = []
          this._handlingClick = !0
          for (var f = c.length - 1; f >= 0; f--)
            (a = c[f]), (b = this._getLayer(a.layerId).layer), a.checked ? d.push(b) : a.checked || e.push(b)
          for (f = 0; f < e.length; f++) this._map.hasLayer(e[f]) && this._map.removeLayer(e[f])
          for (f = 0; f < d.length; f++) this._map.hasLayer(d[f]) || this._map.addLayer(d[f])
          ;(this._handlingClick = !1), this._refocusOnMap()
        },
        _checkDisabledLayers: function() {
          for (var a, b, c = this._layerControlInputs, d = this._map.getZoom(), e = c.length - 1; e >= 0; e--)
            (a = c[e]),
              (b = this._getLayer(a.layerId).layer),
              (a.disabled =
                (void 0 !== b.options.minZoom && d < b.options.minZoom) ||
                (void 0 !== b.options.maxZoom && d > b.options.maxZoom))
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this
        },
        _expand: function() {
          return this.expand()
        },
        _collapse: function() {
          return this.collapse()
        },
      }),
      Ac = xc.extend({
        options: {
          position: 'topleft',
          zoomInText: '+',
          zoomInTitle: 'Zoom in',
          zoomOutText: '&#x2212;',
          zoomOutTitle: 'Zoom out',
        },
        onAdd: function(a) {
          var b = 'leaflet-control-zoom',
            c = ia('div', b + ' leaflet-bar'),
            d = this.options
          return (
            (this._zoomInButton = this._createButton(d.zoomInText, d.zoomInTitle, b + '-in', c, this._zoomIn)),
            (this._zoomOutButton = this._createButton(d.zoomOutText, d.zoomOutTitle, b + '-out', c, this._zoomOut)),
            this._updateDisabled(),
            a.on('zoomend zoomlevelschange', this._updateDisabled, this),
            c
          )
        },
        onRemove: function(a) {
          a.off('zoomend zoomlevelschange', this._updateDisabled, this)
        },
        disable: function() {
          return (this._disabled = !0), this._updateDisabled(), this
        },
        enable: function() {
          return (this._disabled = !1), this._updateDisabled(), this
        },
        _zoomIn: function(a) {
          !this._disabled &&
            this._map._zoom < this._map.getMaxZoom() &&
            this._map.zoomIn(this._map.options.zoomDelta * (a.shiftKey ? 3 : 1))
        },
        _zoomOut: function(a) {
          !this._disabled &&
            this._map._zoom > this._map.getMinZoom() &&
            this._map.zoomOut(this._map.options.zoomDelta * (a.shiftKey ? 3 : 1))
        },
        _createButton: function(a, b, c, d, e) {
          var f = ia('a', c, d)
          return (
            (f.innerHTML = a),
            (f.href = '#'),
            (f.title = b),
            f.setAttribute('role', 'button'),
            f.setAttribute('aria-label', b),
            Z(f),
            T(f, 'click', _),
            T(f, 'click', e, this),
            T(f, 'click', this._refocusOnMap, this),
            f
          )
        },
        _updateDisabled: function() {
          var a = this._map,
            b = 'leaflet-disabled'
          pa(this._zoomInButton, b),
            pa(this._zoomOutButton, b),
            (this._disabled || a._zoom === a.getMinZoom()) && oa(this._zoomOutButton, b),
            (this._disabled || a._zoom === a.getMaxZoom()) && oa(this._zoomInButton, b)
        },
      })
    wc.mergeOptions({
      zoomControl: !0,
    }),
      wc.addInitHook(function() {
        this.options.zoomControl && ((this.zoomControl = new Ac()), this.addControl(this.zoomControl))
      })
    var Bc = xc.extend({
        options: {
          position: 'bottomleft',
          maxWidth: 100,
          metric: !0,
          imperial: !0,
        },
        onAdd: function(a) {
          var b = ia('div', 'leaflet-control-scale'),
            c = this.options
          return (
            this._addScales(c, 'leaflet-control-scale-line', b),
            a.on(c.updateWhenIdle ? 'moveend' : 'move', this._update, this),
            a.whenReady(this._update, this),
            b
          )
        },
        onRemove: function(a) {
          a.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this)
        },
        _addScales: function(a, b, c) {
          a.metric && (this._mScale = ia('div', b, c)), a.imperial && (this._iScale = ia('div', b, c))
        },
        _update: function() {
          var a = this._map,
            b = a.getSize().y / 2,
            c = a.distance(a.containerPointToLatLng([0, b]), a.containerPointToLatLng([this.options.maxWidth, b]))
          this._updateScales(c)
        },
        _updateScales: function(a) {
          this.options.metric && a && this._updateMetric(a), this.options.imperial && a && this._updateImperial(a)
        },
        _updateMetric: function(a) {
          var b = this._getRoundNum(a),
            c = b < 1e3 ? b + ' m' : b / 1e3 + ' km'
          this._updateScale(this._mScale, c, b / a)
        },
        _updateImperial: function(a) {
          var b,
            c,
            d,
            e = 3.2808399 * a
          e > 5280
            ? ((b = e / 5280), (c = this._getRoundNum(b)), this._updateScale(this._iScale, c + ' mi', c / b))
            : ((d = this._getRoundNum(e)), this._updateScale(this._iScale, d + ' ft', d / e))
        },
        _updateScale: function(a, b, c) {
          ;(a.style.width = Math.round(this.options.maxWidth * c) + 'px'), (a.innerHTML = b)
        },
        _getRoundNum: function(a) {
          var b = Math.pow(10, (Math.floor(a) + '').length - 1),
            c = a / b
          return (c = c >= 10 ? 10 : c >= 5 ? 5 : c >= 3 ? 3 : c >= 2 ? 2 : 1), b * c
        },
      }),
      Cc = xc.extend({
        options: {
          position: 'bottomright',
          prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>',
        },
        initialize: function(a) {
          k(this, a), (this._attributions = {})
        },
        onAdd: function(a) {
          ;(a.attributionControl = this),
            (this._container = ia('div', 'leaflet-control-attribution')),
            Z(this._container)
          for (var b in a._layers) a._layers[b].getAttribution && this.addAttribution(a._layers[b].getAttribution())
          return this._update(), this._container
        },
        setPrefix: function(a) {
          return (this.options.prefix = a), this._update(), this
        },
        addAttribution: function(a) {
          return a
            ? (this._attributions[a] || (this._attributions[a] = 0), this._attributions[a]++, this._update(), this)
            : this
        },
        removeAttribution: function(a) {
          return a ? (this._attributions[a] && (this._attributions[a]--, this._update()), this) : this
        },
        _update: function() {
          if (this._map) {
            var a = []
            for (var b in this._attributions) this._attributions[b] && a.push(b)
            var c = []
            this.options.prefix && c.push(this.options.prefix),
              a.length && c.push(a.join(', ')),
              (this._container.innerHTML = c.join(' | '))
          }
        },
      })
    wc.mergeOptions({
      attributionControl: !0,
    }),
      wc.addInitHook(function() {
        this.options.attributionControl && new Cc().addTo(this)
      }),
      (xc.Layers = zc),
      (xc.Zoom = Ac),
      (xc.Scale = Bc),
      (xc.Attribution = Cc),
      (yc.layers = function(a, b, c) {
        return new zc(a, b, c)
      }),
      (yc.zoom = function(a) {
        return new Ac(a)
      }),
      (yc.scale = function(a) {
        return new Bc(a)
      }),
      (yc.attribution = function(a) {
        return new Cc(a)
      })
    var Dc = s.extend({
      initialize: function(a) {
        this._map = a
      },
      enable: function() {
        return this._enabled ? this : ((this._enabled = !0), this.addHooks(), this)
      },
      disable: function() {
        return this._enabled ? ((this._enabled = !1), this.removeHooks(), this) : this
      },
      enabled: function() {
        return !!this._enabled
      },
    })
    Dc.addTo = function(a, b) {
      return a.addHandler(b, this), this
    }
    var Ec,
      Fc = {
        Events: ib,
      },
      Gc = Tb ? 'touchstart mousedown' : 'mousedown',
      Hc = {
        mousedown: 'mouseup',
        touchstart: 'touchend',
        pointerdown: 'touchend',
        MSPointerDown: 'touchend',
      },
      Ic = {
        mousedown: 'mousemove',
        touchstart: 'touchmove',
        pointerdown: 'touchmove',
        MSPointerDown: 'touchmove',
      },
      Jc = jb.extend({
        options: {
          clickTolerance: 3,
        },
        initialize: function(a, b, c, d) {
          k(this, d), (this._element = a), (this._dragStartTarget = b || a), (this._preventOutline = c)
        },
        enable: function() {
          this._enabled || (T(this._dragStartTarget, Gc, this._onDown, this), (this._enabled = !0))
        },
        disable: function() {
          this._enabled &&
            (Jc._dragging === this && this.finishDrag(),
            U(this._dragStartTarget, Gc, this._onDown, this),
            (this._enabled = !1),
            (this._moved = !1))
        },
        _onDown: function(a) {
          if (
            !a._simulated &&
            this._enabled &&
            ((this._moved = !1),
            !na(this._element, 'leaflet-zoom-anim') &&
              !(
                Jc._dragging ||
                a.shiftKey ||
                (1 !== a.which && 1 !== a.button && !a.touches) ||
                ((Jc._dragging = this), this._preventOutline && Aa(this._element), ya(), pb(), this._moving)
              ))
          ) {
            this.fire('down')
            var b = a.touches ? a.touches[0] : a
            ;(this._startPoint = new u(b.clientX, b.clientY)),
              T(document, Ic[a.type], this._onMove, this),
              T(document, Hc[a.type], this._onUp, this)
          }
        },
        _onMove: function(a) {
          if (!a._simulated && this._enabled)
            if (a.touches && a.touches.length > 1) this._moved = !0
            else {
              var b = a.touches && 1 === a.touches.length ? a.touches[0] : a,
                c = new u(b.clientX, b.clientY).subtract(this._startPoint)
              ;(c.x || c.y) &&
                (Math.abs(c.x) + Math.abs(c.y) < this.options.clickTolerance ||
                  ($(a),
                  this._moved ||
                    (this.fire('dragstart'),
                    (this._moved = !0),
                    (this._startPos = xa(this._element).subtract(c)),
                    oa(document.body, 'leaflet-dragging'),
                    (this._lastTarget = a.target || a.srcElement),
                    window.SVGElementInstance &&
                      this._lastTarget instanceof SVGElementInstance &&
                      (this._lastTarget = this._lastTarget.correspondingUseElement),
                    oa(this._lastTarget, 'leaflet-drag-target')),
                  (this._newPos = this._startPos.add(c)),
                  (this._moving = !0),
                  r(this._animRequest),
                  (this._lastEvent = a),
                  (this._animRequest = q(this._updatePosition, this, !0))))
            }
        },
        _updatePosition: function() {
          var a = {
            originalEvent: this._lastEvent,
          }
          this.fire('predrag', a), wa(this._element, this._newPos), this.fire('drag', a)
        },
        _onUp: function(a) {
          !a._simulated && this._enabled && this.finishDrag()
        },
        finishDrag: function() {
          pa(document.body, 'leaflet-dragging'),
            this._lastTarget && (pa(this._lastTarget, 'leaflet-drag-target'), (this._lastTarget = null))
          for (var a in Ic) U(document, Ic[a], this._onMove, this), U(document, Hc[a], this._onUp, this)
          za(),
            qb(),
            this._moved &&
              this._moving &&
              (r(this._animRequest),
              this.fire('dragend', {
                distance: this._newPos.distanceTo(this._startPos),
              })),
            (this._moving = !1),
            (Jc._dragging = !1)
        },
      }),
      Kc = (Object.freeze || Object)({
        simplify: Ca,
        pointToSegmentDistance: Da,
        closestPointOnSegment: function(a, b, c) {
          return La(a, b, c)
        },
        clipSegment: Ha,
        _getEdgeIntersection: Ia,
        _getBitCode: Ja,
        _sqClosestPointOnSegment: La,
        isFlat: Ma,
        _flat: Na,
      }),
      Lc = (Object.freeze || Object)({
        clipPolygon: Oa,
      }),
      Mc = {
        project: function(a) {
          return new u(a.lng, a.lat)
        },
        unproject: function(a) {
          return new A(a.y, a.x)
        },
        bounds: new w([-180, -90], [180, 90]),
      },
      Nc = {
        R: 6378137,
        R_MINOR: 6356752.314245179,
        bounds: new w([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),
        project: function(a) {
          var b = Math.PI / 180,
            c = this.R,
            d = a.lat * b,
            e = this.R_MINOR / c,
            f = Math.sqrt(1 - e * e),
            g = f * Math.sin(d),
            h = Math.tan(Math.PI / 4 - d / 2) / Math.pow((1 - g) / (1 + g), f / 2)
          return (d = -c * Math.log(Math.max(h, 1e-10))), new u(a.lng * b * c, d)
        },
        unproject: function(a) {
          for (
            var b,
              c = 180 / Math.PI,
              d = this.R,
              e = this.R_MINOR / d,
              f = Math.sqrt(1 - e * e),
              g = Math.exp(-a.y / d),
              h = Math.PI / 2 - 2 * Math.atan(g),
              i = 0,
              j = 0.1;
            i < 15 && Math.abs(j) > 1e-7;
            i++
          )
            (b = f * Math.sin(h)),
              (b = Math.pow((1 - b) / (1 + b), f / 2)),
              (h += j = Math.PI / 2 - 2 * Math.atan(g * b) - h)
          return new A(h * c, (a.x * c) / d)
        },
      },
      Oc = (Object.freeze || Object)({
        LonLat: Mc,
        Mercator: Nc,
        SphericalMercator: nb,
      }),
      Pc = b({}, mb, {
        code: 'EPSG:3395',
        projection: Nc,
        transformation: (function() {
          var a = 0.5 / (Math.PI * Nc.R)
          return D(a, 0.5, -a, 0.5)
        })(),
      }),
      Qc = b({}, mb, {
        code: 'EPSG:4326',
        projection: Mc,
        transformation: D(1 / 180, 1, -1 / 180, 0.5),
      }),
      Rc = b({}, lb, {
        projection: Mc,
        transformation: D(1, 0, -1, 0),
        scale: function(a) {
          return Math.pow(2, a)
        },
        zoom: function(a) {
          return Math.log(a) / Math.LN2
        },
        distance: function(a, b) {
          var c = b.lng - a.lng,
            d = b.lat - a.lat
          return Math.sqrt(c * c + d * d)
        },
        infinite: !0,
      })
    ;(lb.Earth = mb), (lb.EPSG3395 = Pc), (lb.EPSG3857 = sb), (lb.EPSG900913 = tb), (lb.EPSG4326 = Qc), (lb.Simple = Rc)
    var Sc = jb.extend({
      options: {
        pane: 'overlayPane',
        attribution: null,
        bubblingMouseEvents: !0,
      },
      addTo: function(a) {
        return a.addLayer(this), this
      },
      remove: function() {
        return this.removeFrom(this._map || this._mapToAdd)
      },
      removeFrom: function(a) {
        return a && a.removeLayer(this), this
      },
      getPane: function(a) {
        return this._map.getPane(a ? this.options[a] || a : this.options.pane)
      },
      addInteractiveTarget: function(a) {
        return (this._map._targets[d(a)] = this), this
      },
      removeInteractiveTarget: function(a) {
        return delete this._map._targets[d(a)], this
      },
      getAttribution: function() {
        return this.options.attribution
      },
      _layerAdd: function(a) {
        var b = a.target
        if (b.hasLayer(this)) {
          if (((this._map = b), (this._zoomAnimated = b._zoomAnimated), this.getEvents)) {
            var c = this.getEvents()
            b.on(c, this),
              this.once(
                'remove',
                function() {
                  b.off(c, this)
                },
                this,
              )
          }
          this.onAdd(b),
            this.getAttribution && b.attributionControl && b.attributionControl.addAttribution(this.getAttribution()),
            this.fire('add'),
            b.fire('layeradd', {
              layer: this,
            })
        }
      },
    })
    wc.include({
      addLayer: function(a) {
        if (!a._layerAdd) throw new Error('The provided object is not a Layer.')
        var b = d(a)
        return this._layers[b]
          ? this
          : ((this._layers[b] = a),
            (a._mapToAdd = this),
            a.beforeAdd && a.beforeAdd(this),
            this.whenReady(a._layerAdd, a),
            this)
      },
      removeLayer: function(a) {
        var b = d(a)
        return this._layers[b]
          ? (this._loaded && a.onRemove(this),
            a.getAttribution &&
              this.attributionControl &&
              this.attributionControl.removeAttribution(a.getAttribution()),
            delete this._layers[b],
            this._loaded &&
              (this.fire('layerremove', {
                layer: a,
              }),
              a.fire('remove')),
            (a._map = a._mapToAdd = null),
            this)
          : this
      },
      hasLayer: function(a) {
        return !!a && d(a) in this._layers
      },
      eachLayer: function(a, b) {
        for (var c in this._layers) a.call(b, this._layers[c])
        return this
      },
      _addLayers: function(a) {
        for (var b = 0, c = (a = a ? (cb(a) ? a : [a]) : []).length; b < c; b++) this.addLayer(a[b])
      },
      _addZoomLimit: function(a) {
        ;(!isNaN(a.options.maxZoom) && isNaN(a.options.minZoom)) ||
          ((this._zoomBoundLayers[d(a)] = a), this._updateZoomLevels())
      },
      _removeZoomLimit: function(a) {
        var b = d(a)
        this._zoomBoundLayers[b] && (delete this._zoomBoundLayers[b], this._updateZoomLevels())
      },
      _updateZoomLevels: function() {
        var a = 1 / 0,
          b = -1 / 0,
          c = this._getZoomSpan()
        for (var d in this._zoomBoundLayers) {
          var e = this._zoomBoundLayers[d].options
          ;(a = void 0 === e.minZoom ? a : Math.min(a, e.minZoom)),
            (b = void 0 === e.maxZoom ? b : Math.max(b, e.maxZoom))
        }
        ;(this._layersMaxZoom = b === -1 / 0 ? void 0 : b),
          (this._layersMinZoom = a === 1 / 0 ? void 0 : a),
          c !== this._getZoomSpan() && this.fire('zoomlevelschange'),
          void 0 === this.options.maxZoom &&
            this._layersMaxZoom &&
            this.getZoom() > this._layersMaxZoom &&
            this.setZoom(this._layersMaxZoom),
          void 0 === this.options.minZoom &&
            this._layersMinZoom &&
            this.getZoom() < this._layersMinZoom &&
            this.setZoom(this._layersMinZoom)
      },
    })
    var Tc = Sc.extend({
        initialize: function(a, b) {
          k(this, b), (this._layers = {})
          var c, d
          if (a) for (c = 0, d = a.length; c < d; c++) this.addLayer(a[c])
        },
        addLayer: function(a) {
          var b = this.getLayerId(a)
          return (this._layers[b] = a), this._map && this._map.addLayer(a), this
        },
        removeLayer: function(a) {
          var b = a in this._layers ? a : this.getLayerId(a)
          return this._map && this._layers[b] && this._map.removeLayer(this._layers[b]), delete this._layers[b], this
        },
        hasLayer: function(a) {
          return !!a && (a in this._layers || this.getLayerId(a) in this._layers)
        },
        clearLayers: function() {
          return this.eachLayer(this.removeLayer, this)
        },
        invoke: function(a) {
          var b,
            c,
            d = Array.prototype.slice.call(arguments, 1)
          for (b in this._layers) (c = this._layers[b])[a] && c[a].apply(c, d)
          return this
        },
        onAdd: function(a) {
          this.eachLayer(a.addLayer, a)
        },
        onRemove: function(a) {
          this.eachLayer(a.removeLayer, a)
        },
        eachLayer: function(a, b) {
          for (var c in this._layers) a.call(b, this._layers[c])
          return this
        },
        getLayer: function(a) {
          return this._layers[a]
        },
        getLayers: function() {
          var a = []
          return this.eachLayer(a.push, a), a
        },
        setZIndex: function(a) {
          return this.invoke('setZIndex', a)
        },
        getLayerId: function(a) {
          return d(a)
        },
      }),
      Uc = Tc.extend({
        addLayer: function(a) {
          return this.hasLayer(a)
            ? this
            : (a.addEventParent(this),
              Tc.prototype.addLayer.call(this, a),
              this.fire('layeradd', {
                layer: a,
              }))
        },
        removeLayer: function(a) {
          return this.hasLayer(a)
            ? (a in this._layers && (a = this._layers[a]),
              a.removeEventParent(this),
              Tc.prototype.removeLayer.call(this, a),
              this.fire('layerremove', {
                layer: a,
              }))
            : this
        },
        setStyle: function(a) {
          return this.invoke('setStyle', a)
        },
        bringToFront: function() {
          return this.invoke('bringToFront')
        },
        bringToBack: function() {
          return this.invoke('bringToBack')
        },
        getBounds: function() {
          var a = new y()
          for (var b in this._layers) {
            var c = this._layers[b]
            a.extend(c.getBounds ? c.getBounds() : c.getLatLng())
          }
          return a
        },
      }),
      Vc = s.extend({
        options: {
          popupAnchor: [0, 0],
          tooltipAnchor: [0, 0],
        },
        initialize: function(a) {
          k(this, a)
        },
        createIcon: function(a) {
          return this._createIcon('icon', a)
        },
        createShadow: function(a) {
          return this._createIcon('shadow', a)
        },
        _createIcon: function(a, b) {
          var c = this._getIconUrl(a)
          if (!c) {
            if ('icon' === a) throw new Error('iconUrl not set in Icon options (see the docs).')
            return null
          }
          var d = this._createImg(c, b && 'IMG' === b.tagName ? b : null)
          return this._setIconStyles(d, a), d
        },
        _setIconStyles: function(a, b) {
          var c = this.options,
            d = c[b + 'Size']
          'number' == typeof d && (d = [d, d])
          var e = v(d),
            f = v(('shadow' === b && c.shadowAnchor) || c.iconAnchor || (e && e.divideBy(2, !0)))
          ;(a.className = 'leaflet-marker-' + b + ' ' + (c.className || '')),
            f && ((a.style.marginLeft = -f.x + 'px'), (a.style.marginTop = -f.y + 'px')),
            e && ((a.style.width = e.x + 'px'), (a.style.height = e.y + 'px'))
        },
        _createImg: function(a, b) {
          return (b = b || document.createElement('img')), (b.src = a), b
        },
        _getIconUrl: function(a) {
          return (Wb && this.options[a + 'RetinaUrl']) || this.options[a + 'Url']
        },
      }),
      Wc = Vc.extend({
        options: {
          iconUrl: 'marker-icon.png',
          iconRetinaUrl: 'marker-icon-2x.png',
          shadowUrl: 'marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
        },
        _getIconUrl: function(a) {
          return (
            Wc.imagePath || (Wc.imagePath = this._detectIconPath()),
            (this.options.imagePath || Wc.imagePath) + Vc.prototype._getIconUrl.call(this, a)
          )
        },
        _detectIconPath: function() {
          var a = ia('div', 'leaflet-default-icon-path', document.body),
            b = ha(a, 'background-image') || ha(a, 'backgroundImage')
          return (
            document.body.removeChild(a),
            (b =
              null === b || 0 !== b.indexOf('url')
                ? ''
                : b.replace(/^url\(["']?/, '').replace(/marker-icon\.png["']?\)$/, ''))
          )
        },
      }),
      Xc = Dc.extend({
        initialize: function(a) {
          this._marker = a
        },
        addHooks: function() {
          var a = this._marker._icon
          this._draggable || (this._draggable = new Jc(a, a, !0)),
            this._draggable
              .on(
                {
                  dragstart: this._onDragStart,
                  predrag: this._onPreDrag,
                  drag: this._onDrag,
                  dragend: this._onDragEnd,
                },
                this,
              )
              .enable(),
            oa(a, 'leaflet-marker-draggable')
        },
        removeHooks: function() {
          this._draggable
            .off(
              {
                dragstart: this._onDragStart,
                predrag: this._onPreDrag,
                drag: this._onDrag,
                dragend: this._onDragEnd,
              },
              this,
            )
            .disable(),
            this._marker._icon && pa(this._marker._icon, 'leaflet-marker-draggable')
        },
        moved: function() {
          return this._draggable && this._draggable._moved
        },
        _adjustPan: function(a) {
          var b = this._marker,
            c = b._map,
            d = this._marker.options.autoPanSpeed,
            e = this._marker.options.autoPanPadding,
            f = L.DomUtil.getPosition(b._icon),
            g = c.getPixelBounds(),
            h = c.getPixelOrigin(),
            i = x(g.min._subtract(h).add(e), g.max._subtract(h).subtract(e))
          if (!i.contains(f)) {
            var j = v(
              (Math.max(i.max.x, f.x) - i.max.x) / (g.max.x - i.max.x) -
                (Math.min(i.min.x, f.x) - i.min.x) / (g.min.x - i.min.x),
              (Math.max(i.max.y, f.y) - i.max.y) / (g.max.y - i.max.y) -
                (Math.min(i.min.y, f.y) - i.min.y) / (g.min.y - i.min.y),
            ).multiplyBy(d)
            c.panBy(j, {
              animate: !1,
            }),
              this._draggable._newPos._add(j),
              this._draggable._startPos._add(j),
              L.DomUtil.setPosition(b._icon, this._draggable._newPos),
              this._onDrag(a),
              (this._panRequest = q(this._adjustPan.bind(this, a)))
          }
        },
        _onDragStart: function() {
          ;(this._oldLatLng = this._marker.getLatLng()),
            this._marker
              .closePopup()
              .fire('movestart')
              .fire('dragstart')
        },
        _onPreDrag: function(a) {
          this._marker.options.autoPan && (r(this._panRequest), (this._panRequest = q(this._adjustPan.bind(this, a))))
        },
        _onDrag: function(a) {
          var b = this._marker,
            c = b._shadow,
            d = xa(b._icon),
            e = b._map.layerPointToLatLng(d)
          c && wa(c, d),
            (b._latlng = e),
            (a.latlng = e),
            (a.oldLatLng = this._oldLatLng),
            b.fire('move', a).fire('drag', a)
        },
        _onDragEnd: function(a) {
          r(this._panRequest), delete this._oldLatLng, this._marker.fire('moveend').fire('dragend', a)
        },
      }),
      Yc = Sc.extend({
        options: {
          icon: new Wc(),
          interactive: !0,
          draggable: !1,
          autoPan: !1,
          autoPanPadding: [50, 50],
          autoPanSpeed: 10,
          keyboard: !0,
          title: '',
          alt: '',
          zIndexOffset: 0,
          opacity: 1,
          riseOnHover: !1,
          riseOffset: 250,
          pane: 'markerPane',
          bubblingMouseEvents: !1,
        },
        initialize: function(a, b) {
          k(this, b), (this._latlng = B(a))
        },
        onAdd: function(a) {
          ;(this._zoomAnimated = this._zoomAnimated && a.options.markerZoomAnimation),
            this._zoomAnimated && a.on('zoomanim', this._animateZoom, this),
            this._initIcon(),
            this.update()
        },
        onRemove: function(a) {
          this.dragging && this.dragging.enabled() && ((this.options.draggable = !0), this.dragging.removeHooks()),
            delete this.dragging,
            this._zoomAnimated && a.off('zoomanim', this._animateZoom, this),
            this._removeIcon(),
            this._removeShadow()
        },
        getEvents: function() {
          return {
            zoom: this.update,
            viewreset: this.update,
          }
        },
        getLatLng: function() {
          return this._latlng
        },
        setLatLng: function(a) {
          var b = this._latlng
          return (
            (this._latlng = B(a)),
            this.update(),
            this.fire('move', {
              oldLatLng: b,
              latlng: this._latlng,
            })
          )
        },
        setZIndexOffset: function(a) {
          return (this.options.zIndexOffset = a), this.update()
        },
        setIcon: function(a) {
          return (
            (this.options.icon = a),
            this._map && (this._initIcon(), this.update()),
            this._popup && this.bindPopup(this._popup, this._popup.options),
            this
          )
        },
        getElement: function() {
          return this._icon
        },
        update: function() {
          if (this._icon && this._map) {
            var a = this._map.latLngToLayerPoint(this._latlng).round()
            this._setPos(a)
          }
          return this
        },
        _initIcon: function() {
          var a = this.options,
            b = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide'),
            c = a.icon.createIcon(this._icon),
            d = !1
          c !== this._icon &&
            (this._icon && this._removeIcon(),
            (d = !0),
            a.title && (c.title = a.title),
            'IMG' === c.tagName && (c.alt = a.alt || '')),
            oa(c, b),
            a.keyboard && (c.tabIndex = '0'),
            (this._icon = c),
            a.riseOnHover &&
              this.on({
                mouseover: this._bringToFront,
                mouseout: this._resetZIndex,
              })
          var e = a.icon.createShadow(this._shadow),
            f = !1
          e !== this._shadow && (this._removeShadow(), (f = !0)),
            e && (oa(e, b), (e.alt = '')),
            (this._shadow = e),
            a.opacity < 1 && this._updateOpacity(),
            d && this.getPane().appendChild(this._icon),
            this._initInteraction(),
            e && f && this.getPane('shadowPane').appendChild(this._shadow)
        },
        _removeIcon: function() {
          this.options.riseOnHover &&
            this.off({
              mouseover: this._bringToFront,
              mouseout: this._resetZIndex,
            }),
            ja(this._icon),
            this.removeInteractiveTarget(this._icon),
            (this._icon = null)
        },
        _removeShadow: function() {
          this._shadow && ja(this._shadow), (this._shadow = null)
        },
        _setPos: function(a) {
          wa(this._icon, a),
            this._shadow && wa(this._shadow, a),
            (this._zIndex = a.y + this.options.zIndexOffset),
            this._resetZIndex()
        },
        _updateZIndex: function(a) {
          this._icon.style.zIndex = this._zIndex + a
        },
        _animateZoom: function(a) {
          var b = this._map._latLngToNewLayerPoint(this._latlng, a.zoom, a.center).round()
          this._setPos(b)
        },
        _initInteraction: function() {
          if (
            this.options.interactive &&
            (oa(this._icon, 'leaflet-interactive'), this.addInteractiveTarget(this._icon), Xc)
          ) {
            var a = this.options.draggable
            this.dragging && ((a = this.dragging.enabled()), this.dragging.disable()),
              (this.dragging = new Xc(this)),
              a && this.dragging.enable()
          }
        },
        setOpacity: function(a) {
          return (this.options.opacity = a), this._map && this._updateOpacity(), this
        },
        _updateOpacity: function() {
          var a = this.options.opacity
          sa(this._icon, a), this._shadow && sa(this._shadow, a)
        },
        _bringToFront: function() {
          this._updateZIndex(this.options.riseOffset)
        },
        _resetZIndex: function() {
          this._updateZIndex(0)
        },
        _getPopupAnchor: function() {
          return this.options.icon.options.popupAnchor
        },
        _getTooltipAnchor: function() {
          return this.options.icon.options.tooltipAnchor
        },
      }),
      Zc = Sc.extend({
        options: {
          stroke: !0,
          color: '#3388ff',
          weight: 3,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: null,
          dashOffset: null,
          fill: !1,
          fillColor: null,
          fillOpacity: 0.2,
          fillRule: 'evenodd',
          interactive: !0,
          bubblingMouseEvents: !0,
        },
        beforeAdd: function(a) {
          this._renderer = a.getRenderer(this)
        },
        onAdd: function() {
          this._renderer._initPath(this), this._reset(), this._renderer._addPath(this)
        },
        onRemove: function() {
          this._renderer._removePath(this)
        },
        redraw: function() {
          return this._map && this._renderer._updatePath(this), this
        },
        setStyle: function(a) {
          return k(this, a), this._renderer && this._renderer._updateStyle(this), this
        },
        bringToFront: function() {
          return this._renderer && this._renderer._bringToFront(this), this
        },
        bringToBack: function() {
          return this._renderer && this._renderer._bringToBack(this), this
        },
        getElement: function() {
          return this._path
        },
        _reset: function() {
          this._project(), this._update()
        },
        _clickTolerance: function() {
          return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance
        },
      }),
      $c = Zc.extend({
        options: {
          fill: !0,
          radius: 10,
        },
        initialize: function(a, b) {
          k(this, b), (this._latlng = B(a)), (this._radius = this.options.radius)
        },
        setLatLng: function(a) {
          return (
            (this._latlng = B(a)),
            this.redraw(),
            this.fire('move', {
              latlng: this._latlng,
            })
          )
        },
        getLatLng: function() {
          return this._latlng
        },
        setRadius: function(a) {
          return (this.options.radius = this._radius = a), this.redraw()
        },
        getRadius: function() {
          return this._radius
        },
        setStyle: function(a) {
          var b = (a && a.radius) || this._radius
          return Zc.prototype.setStyle.call(this, a), this.setRadius(b), this
        },
        _project: function() {
          ;(this._point = this._map.latLngToLayerPoint(this._latlng)), this._updateBounds()
        },
        _updateBounds: function() {
          var a = this._radius,
            b = this._radiusY || a,
            c = this._clickTolerance(),
            d = [a + c, b + c]
          this._pxBounds = new w(this._point.subtract(d), this._point.add(d))
        },
        _update: function() {
          this._map && this._updatePath()
        },
        _updatePath: function() {
          this._renderer._updateCircle(this)
        },
        _empty: function() {
          return this._radius && !this._renderer._bounds.intersects(this._pxBounds)
        },
        _containsPoint: function(a) {
          return a.distanceTo(this._point) <= this._radius + this._clickTolerance()
        },
      }),
      _c = $c.extend({
        initialize: function(a, c, d) {
          if (
            ('number' == typeof c &&
              (c = b({}, d, {
                radius: c,
              })),
            k(this, c),
            (this._latlng = B(a)),
            isNaN(this.options.radius))
          )
            throw new Error('Circle radius cannot be NaN')
          this._mRadius = this.options.radius
        },
        setRadius: function(a) {
          return (this._mRadius = a), this.redraw()
        },
        getRadius: function() {
          return this._mRadius
        },
        getBounds: function() {
          var a = [this._radius, this._radiusY || this._radius]
          return new y(
            this._map.layerPointToLatLng(this._point.subtract(a)),
            this._map.layerPointToLatLng(this._point.add(a)),
          )
        },
        setStyle: Zc.prototype.setStyle,
        _project: function() {
          var a = this._latlng.lng,
            b = this._latlng.lat,
            c = this._map,
            d = c.options.crs
          if (d.distance === mb.distance) {
            var e = Math.PI / 180,
              f = this._mRadius / mb.R / e,
              g = c.project([b + f, a]),
              h = c.project([b - f, a]),
              i = g.add(h).divideBy(2),
              j = c.unproject(i).lat,
              k =
                Math.acos((Math.cos(f * e) - Math.sin(b * e) * Math.sin(j * e)) / (Math.cos(b * e) * Math.cos(j * e))) /
                e
            ;(isNaN(k) || 0 === k) && (k = f / Math.cos((Math.PI / 180) * b)),
              (this._point = i.subtract(c.getPixelOrigin())),
              (this._radius = isNaN(k) ? 0 : i.x - c.project([j, a - k]).x),
              (this._radiusY = i.y - g.y)
          } else {
            var l = d.unproject(d.project(this._latlng).subtract([this._mRadius, 0]))
            ;(this._point = c.latLngToLayerPoint(this._latlng)),
              (this._radius = this._point.x - c.latLngToLayerPoint(l).x)
          }
          this._updateBounds()
        },
      }),
      ad = Zc.extend({
        options: {
          smoothFactor: 1,
          noClip: !1,
        },
        initialize: function(a, b) {
          k(this, b), this._setLatLngs(a)
        },
        getLatLngs: function() {
          return this._latlngs
        },
        setLatLngs: function(a) {
          return this._setLatLngs(a), this.redraw()
        },
        isEmpty: function() {
          return !this._latlngs.length
        },
        closestLayerPoint: function(a) {
          for (var b, c, d = 1 / 0, e = null, f = La, g = 0, h = this._parts.length; g < h; g++)
            for (var i = this._parts[g], j = 1, k = i.length; j < k; j++) {
              var l = f(a, (b = i[j - 1]), (c = i[j]), !0)
              l < d && ((d = l), (e = f(a, b, c)))
            }
          return e && (e.distance = Math.sqrt(d)), e
        },
        getCenter: function() {
          if (!this._map) throw new Error('Must add layer to map before using getCenter()')
          var a,
            b,
            c,
            d,
            e,
            f,
            g,
            h = this._rings[0],
            i = h.length
          if (!i) return null
          for (a = 0, b = 0; a < i - 1; a++) b += h[a].distanceTo(h[a + 1]) / 2
          if (0 === b) return this._map.layerPointToLatLng(h[0])
          for (a = 0, d = 0; a < i - 1; a++)
            if (((e = h[a]), (f = h[a + 1]), (c = e.distanceTo(f)), (d += c) > b))
              return (g = (d - b) / c), this._map.layerPointToLatLng([f.x - g * (f.x - e.x), f.y - g * (f.y - e.y)])
        },
        getBounds: function() {
          return this._bounds
        },
        addLatLng: function(a, b) {
          return (b = b || this._defaultShape()), (a = B(a)), b.push(a), this._bounds.extend(a), this.redraw()
        },
        _setLatLngs: function(a) {
          ;(this._bounds = new y()), (this._latlngs = this._convertLatLngs(a))
        },
        _defaultShape: function() {
          return Ma(this._latlngs) ? this._latlngs : this._latlngs[0]
        },
        _convertLatLngs: function(a) {
          for (var b = [], c = Ma(a), d = 0, e = a.length; d < e; d++)
            c ? ((b[d] = B(a[d])), this._bounds.extend(b[d])) : (b[d] = this._convertLatLngs(a[d]))
          return b
        },
        _project: function() {
          var a = new w()
          ;(this._rings = []), this._projectLatlngs(this._latlngs, this._rings, a)
          var b = this._clickTolerance(),
            c = new u(b, b)
          this._bounds.isValid() && a.isValid() && (a.min._subtract(c), a.max._add(c), (this._pxBounds = a))
        },
        _projectLatlngs: function(a, b, c) {
          var d,
            e,
            f = a[0] instanceof A,
            g = a.length
          if (f) {
            for (e = [], d = 0; d < g; d++) (e[d] = this._map.latLngToLayerPoint(a[d])), c.extend(e[d])
            b.push(e)
          } else for (d = 0; d < g; d++) this._projectLatlngs(a[d], b, c)
        },
        _clipPoints: function() {
          var a = this._renderer._bounds
          if (((this._parts = []), this._pxBounds && this._pxBounds.intersects(a)))
            if (this.options.noClip) this._parts = this._rings
            else {
              var b,
                c,
                d,
                e,
                f,
                g,
                h,
                i = this._parts
              for (b = 0, d = 0, e = this._rings.length; b < e; b++)
                for (c = 0, f = (h = this._rings[b]).length; c < f - 1; c++)
                  (g = Ha(h[c], h[c + 1], a, c, !0)) &&
                    ((i[d] = i[d] || []), i[d].push(g[0]), (g[1] === h[c + 1] && c !== f - 2) || (i[d].push(g[1]), d++))
            }
        },
        _simplifyPoints: function() {
          for (var a = this._parts, b = this.options.smoothFactor, c = 0, d = a.length; c < d; c++) a[c] = Ca(a[c], b)
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath())
        },
        _updatePath: function() {
          this._renderer._updatePoly(this)
        },
        _containsPoint: function(a, b) {
          var c,
            d,
            e,
            f,
            g,
            h,
            i = this._clickTolerance()
          if (!this._pxBounds || !this._pxBounds.contains(a)) return !1
          for (c = 0, f = this._parts.length; c < f; c++)
            for (d = 0, e = (g = (h = this._parts[c]).length) - 1; d < g; e = d++)
              if ((b || 0 !== d) && Da(a, h[e], h[d]) <= i) return !0
          return !1
        },
      })
    ad._flat = Na
    var bd = ad.extend({
        options: {
          fill: !0,
        },
        isEmpty: function() {
          return !this._latlngs.length || !this._latlngs[0].length
        },
        getCenter: function() {
          if (!this._map) throw new Error('Must add layer to map before using getCenter()')
          var a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j = this._rings[0],
            k = j.length
          if (!k) return null
          for (f = g = h = 0, a = 0, b = k - 1; a < k; b = a++)
            (c = j[a]),
              (d = j[b]),
              (e = c.y * d.x - d.y * c.x),
              (g += (c.x + d.x) * e),
              (h += (c.y + d.y) * e),
              (f += 3 * e)
          return (i = 0 === f ? j[0] : [g / f, h / f]), this._map.layerPointToLatLng(i)
        },
        _convertLatLngs: function(a) {
          var b = ad.prototype._convertLatLngs.call(this, a),
            c = b.length
          return c >= 2 && b[0] instanceof A && b[0].equals(b[c - 1]) && b.pop(), b
        },
        _setLatLngs: function(a) {
          ad.prototype._setLatLngs.call(this, a), Ma(this._latlngs) && (this._latlngs = [this._latlngs])
        },
        _defaultShape: function() {
          return Ma(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0]
        },
        _clipPoints: function() {
          var a = this._renderer._bounds,
            b = this.options.weight,
            c = new u(b, b)
          if (
            ((a = new w(a.min.subtract(c), a.max.add(c))),
            (this._parts = []),
            this._pxBounds && this._pxBounds.intersects(a))
          )
            if (this.options.noClip) this._parts = this._rings
            else
              for (var d, e = 0, f = this._rings.length; e < f; e++)
                (d = Oa(this._rings[e], a, !0)).length && this._parts.push(d)
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0)
        },
        _containsPoint: function(a) {
          var b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j = !1
          if (!this._pxBounds.contains(a)) return !1
          for (e = 0, h = this._parts.length; e < h; e++)
            for (f = 0, g = (i = (b = this._parts[e]).length) - 1; f < i; g = f++)
              (c = b[f]),
                (d = b[g]),
                c.y > a.y != d.y > a.y && a.x < ((d.x - c.x) * (a.y - c.y)) / (d.y - c.y) + c.x && (j = !j)
          return j || ad.prototype._containsPoint.call(this, a, !0)
        },
      }),
      cd = Uc.extend({
        initialize: function(a, b) {
          k(this, b), (this._layers = {}), a && this.addData(a)
        },
        addData: function(a) {
          var b,
            c,
            d,
            e = cb(a) ? a : a.features
          if (e) {
            for (b = 0, c = e.length; b < c; b++)
              ((d = e[b]).geometries || d.geometry || d.features || d.coordinates) && this.addData(d)
            return this
          }
          var f = this.options
          if (f.filter && !f.filter(a)) return this
          var g = Pa(a, f)
          return g
            ? ((g.feature = Va(a)),
              (g.defaultOptions = g.options),
              this.resetStyle(g),
              f.onEachFeature && f.onEachFeature(a, g),
              this.addLayer(g))
            : this
        },
        resetStyle: function(a) {
          return (a.options = b({}, a.defaultOptions)), this._setLayerStyle(a, this.options.style), this
        },
        setStyle: function(a) {
          return this.eachLayer(function(b) {
            this._setLayerStyle(b, a)
          }, this)
        },
        _setLayerStyle: function(a, b) {
          'function' == typeof b && (b = b(a.feature)), a.setStyle && a.setStyle(b)
        },
      }),
      dd = {
        toGeoJSON: function(a) {
          return Ua(this, {
            type: 'Point',
            coordinates: Sa(this.getLatLng(), a),
          })
        },
      }
    Yc.include(dd),
      _c.include(dd),
      $c.include(dd),
      ad.include({
        toGeoJSON: function(a) {
          var b = !Ma(this._latlngs),
            c = Ta(this._latlngs, b ? 1 : 0, !1, a)
          return Ua(this, {
            type: (b ? 'Multi' : '') + 'LineString',
            coordinates: c,
          })
        },
      }),
      bd.include({
        toGeoJSON: function(a) {
          var b = !Ma(this._latlngs),
            c = b && !Ma(this._latlngs[0]),
            d = Ta(this._latlngs, c ? 2 : b ? 1 : 0, !0, a)
          return (
            b || (d = [d]),
            Ua(this, {
              type: (c ? 'Multi' : '') + 'Polygon',
              coordinates: d,
            })
          )
        },
      }),
      Tc.include({
        toMultiPoint: function(a) {
          var b = []
          return (
            this.eachLayer(function(c) {
              b.push(c.toGeoJSON(a).geometry.coordinates)
            }),
            Ua(this, {
              type: 'MultiPoint',
              coordinates: b,
            })
          )
        },
        toGeoJSON: function(a) {
          var b = this.feature && this.feature.geometry && this.feature.geometry.type
          if ('MultiPoint' === b) return this.toMultiPoint(a)
          var c = 'GeometryCollection' === b,
            d = []
          return (
            this.eachLayer(function(b) {
              if (b.toGeoJSON) {
                var e = b.toGeoJSON(a)
                if (c) d.push(e.geometry)
                else {
                  var f = Va(e)
                  'FeatureCollection' === f.type ? d.push.apply(d, f.features) : d.push(f)
                }
              }
            }),
            c
              ? Ua(this, {
                  geometries: d,
                  type: 'GeometryCollection',
                })
              : {
                  type: 'FeatureCollection',
                  features: d,
                }
          )
        },
      })
    var ed = Wa,
      fd = Sc.extend({
        options: {
          opacity: 1,
          alt: '',
          interactive: !1,
          crossOrigin: !1,
          errorOverlayUrl: '',
          zIndex: 1,
          className: '',
        },
        initialize: function(a, b, c) {
          ;(this._url = a), (this._bounds = z(b)), k(this, c)
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()),
            this.options.interactive &&
              (oa(this._image, 'leaflet-interactive'), this.addInteractiveTarget(this._image)),
            this.getPane().appendChild(this._image),
            this._reset()
        },
        onRemove: function() {
          ja(this._image), this.options.interactive && this.removeInteractiveTarget(this._image)
        },
        setOpacity: function(a) {
          return (this.options.opacity = a), this._image && this._updateOpacity(), this
        },
        setStyle: function(a) {
          return a.opacity && this.setOpacity(a.opacity), this
        },
        bringToFront: function() {
          return this._map && la(this._image), this
        },
        bringToBack: function() {
          return this._map && ma(this._image), this
        },
        setUrl: function(a) {
          return (this._url = a), this._image && (this._image.src = a), this
        },
        setBounds: function(a) {
          return (this._bounds = z(a)), this._map && this._reset(), this
        },
        getEvents: function() {
          var a = {
            zoom: this._reset,
            viewreset: this._reset,
          }
          return this._zoomAnimated && (a.zoomanim = this._animateZoom), a
        },
        setZIndex: function(a) {
          return (this.options.zIndex = a), this._updateZIndex(), this
        },
        getBounds: function() {
          return this._bounds
        },
        getElement: function() {
          return this._image
        },
        _initImage: function() {
          var a = 'IMG' === this._url.tagName,
            b = (this._image = a ? this._url : ia('img'))
          oa(b, 'leaflet-image-layer'),
            this._zoomAnimated && oa(b, 'leaflet-zoom-animated'),
            this.options.className && oa(b, this.options.className),
            (b.onselectstart = g),
            (b.onmousemove = g),
            (b.onload = c(this.fire, this, 'load')),
            (b.onerror = c(this._overlayOnError, this, 'error')),
            this.options.crossOrigin && (b.crossOrigin = ''),
            this.options.zIndex && this._updateZIndex(),
            a ? (this._url = b.src) : ((b.src = this._url), (b.alt = this.options.alt))
        },
        _animateZoom: function(a) {
          var b = this._map.getZoomScale(a.zoom),
            c = this._map._latLngBoundsToNewLayerBounds(this._bounds, a.zoom, a.center).min
          va(this._image, c, b)
        },
        _reset: function() {
          var a = this._image,
            b = new w(
              this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
              this._map.latLngToLayerPoint(this._bounds.getSouthEast()),
            ),
            c = b.getSize()
          wa(a, b.min), (a.style.width = c.x + 'px'), (a.style.height = c.y + 'px')
        },
        _updateOpacity: function() {
          sa(this._image, this.options.opacity)
        },
        _updateZIndex: function() {
          this._image &&
            void 0 !== this.options.zIndex &&
            null !== this.options.zIndex &&
            (this._image.style.zIndex = this.options.zIndex)
        },
        _overlayOnError: function() {
          this.fire('error')
          var a = this.options.errorOverlayUrl
          a && this._url !== a && ((this._url = a), (this._image.src = a))
        },
      }),
      gd = fd.extend({
        options: {
          autoplay: !0,
          loop: !0,
        },
        _initImage: function() {
          var a = 'VIDEO' === this._url.tagName,
            b = (this._image = a ? this._url : ia('video'))
          if (
            (oa(b, 'leaflet-image-layer'),
            this._zoomAnimated && oa(b, 'leaflet-zoom-animated'),
            (b.onselectstart = g),
            (b.onmousemove = g),
            (b.onloadeddata = c(this.fire, this, 'load')),
            a)
          ) {
            for (var d = b.getElementsByTagName('source'), e = [], f = 0; f < d.length; f++) e.push(d[f].src)
            this._url = d.length > 0 ? e : [b.src]
          } else {
            cb(this._url) || (this._url = [this._url]),
              (b.autoplay = !!this.options.autoplay),
              (b.loop = !!this.options.loop)
            for (var h = 0; h < this._url.length; h++) {
              var i = ia('source')
              ;(i.src = this._url[h]), b.appendChild(i)
            }
          }
        },
      }),
      hd = Sc.extend({
        options: {
          offset: [0, 7],
          className: '',
          pane: 'popupPane',
        },
        initialize: function(a, b) {
          k(this, a), (this._source = b)
        },
        onAdd: function(a) {
          ;(this._zoomAnimated = a._zoomAnimated),
            this._container || this._initLayout(),
            a._fadeAnimated && sa(this._container, 0),
            clearTimeout(this._removeTimeout),
            this.getPane().appendChild(this._container),
            this.update(),
            a._fadeAnimated && sa(this._container, 1),
            this.bringToFront()
        },
        onRemove: function(a) {
          a._fadeAnimated
            ? (sa(this._container, 0), (this._removeTimeout = setTimeout(c(ja, void 0, this._container), 200)))
            : ja(this._container)
        },
        getLatLng: function() {
          return this._latlng
        },
        setLatLng: function(a) {
          return (this._latlng = B(a)), this._map && (this._updatePosition(), this._adjustPan()), this
        },
        getContent: function() {
          return this._content
        },
        setContent: function(a) {
          return (this._content = a), this.update(), this
        },
        getElement: function() {
          return this._container
        },
        update: function() {
          this._map &&
            ((this._container.style.visibility = 'hidden'),
            this._updateContent(),
            this._updateLayout(),
            this._updatePosition(),
            (this._container.style.visibility = ''),
            this._adjustPan())
        },
        getEvents: function() {
          var a = {
            zoom: this._updatePosition,
            viewreset: this._updatePosition,
          }
          return this._zoomAnimated && (a.zoomanim = this._animateZoom), a
        },
        isOpen: function() {
          return !!this._map && this._map.hasLayer(this)
        },
        bringToFront: function() {
          return this._map && la(this._container), this
        },
        bringToBack: function() {
          return this._map && ma(this._container), this
        },
        _updateContent: function() {
          if (this._content) {
            var a = this._contentNode,
              b = 'function' == typeof this._content ? this._content(this._source || this) : this._content
            if ('string' == typeof b) a.innerHTML = b
            else {
              for (; a.hasChildNodes(); ) a.removeChild(a.firstChild)
              a.appendChild(b)
            }
            this.fire('contentupdate')
          }
        },
        _updatePosition: function() {
          if (this._map) {
            var a = this._map.latLngToLayerPoint(this._latlng),
              b = v(this.options.offset),
              c = this._getAnchor()
            this._zoomAnimated ? wa(this._container, a.add(c)) : (b = b.add(a).add(c))
            var d = (this._containerBottom = -b.y),
              e = (this._containerLeft = -Math.round(this._containerWidth / 2) + b.x)
            ;(this._container.style.bottom = d + 'px'), (this._container.style.left = e + 'px')
          }
        },
        _getAnchor: function() {
          return [0, 0]
        },
      }),
      id = hd.extend({
        options: {
          maxWidth: 300,
          minWidth: 50,
          maxHeight: null,
          autoPan: !0,
          autoPanPaddingTopLeft: null,
          autoPanPaddingBottomRight: null,
          autoPanPadding: [5, 5],
          keepInView: !1,
          closeButton: !0,
          autoClose: !0,
          closeOnEscapeKey: !0,
          className: '',
        },
        openOn: function(a) {
          return a.openPopup(this), this
        },
        onAdd: function(a) {
          hd.prototype.onAdd.call(this, a),
            a.fire('popupopen', {
              popup: this,
            }),
            this._source &&
              (this._source.fire(
                'popupopen',
                {
                  popup: this,
                },
                !0,
              ),
              this._source instanceof Zc || this._source.on('preclick', X))
        },
        onRemove: function(a) {
          hd.prototype.onRemove.call(this, a),
            a.fire('popupclose', {
              popup: this,
            }),
            this._source &&
              (this._source.fire(
                'popupclose',
                {
                  popup: this,
                },
                !0,
              ),
              this._source instanceof Zc || this._source.off('preclick', X))
        },
        getEvents: function() {
          var a = hd.prototype.getEvents.call(this)
          return (
            (void 0 !== this.options.closeOnClick ? this.options.closeOnClick : this._map.options.closePopupOnClick) &&
              (a.preclick = this._close),
            this.options.keepInView && (a.moveend = this._adjustPan),
            a
          )
        },
        _close: function() {
          this._map && this._map.closePopup(this)
        },
        _initLayout: function() {
          var a = 'leaflet-popup',
            b = (this._container = ia('div', a + ' ' + (this.options.className || '') + ' leaflet-zoom-animated')),
            c = (this._wrapper = ia('div', a + '-content-wrapper', b))
          if (
            ((this._contentNode = ia('div', a + '-content', c)),
            Z(c),
            Y(this._contentNode),
            T(c, 'contextmenu', X),
            (this._tipContainer = ia('div', a + '-tip-container', b)),
            (this._tip = ia('div', a + '-tip', this._tipContainer)),
            this.options.closeButton)
          ) {
            var d = (this._closeButton = ia('a', a + '-close-button', b))
            ;(d.href = '#close'), (d.innerHTML = '&#215;'), T(d, 'click', this._onCloseButtonClick, this)
          }
        },
        _updateLayout: function() {
          var a = this._contentNode,
            b = a.style
          ;(b.width = ''), (b.whiteSpace = 'nowrap')
          var c = a.offsetWidth
          ;(c = Math.min(c, this.options.maxWidth)),
            (c = Math.max(c, this.options.minWidth)),
            (b.width = c + 1 + 'px'),
            (b.whiteSpace = ''),
            (b.height = '')
          var d = a.offsetHeight,
            e = this.options.maxHeight
          e && d > e ? ((b.height = e + 'px'), oa(a, 'leaflet-popup-scrolled')) : pa(a, 'leaflet-popup-scrolled'),
            (this._containerWidth = this._container.offsetWidth)
        },
        _animateZoom: function(a) {
          var b = this._map._latLngToNewLayerPoint(this._latlng, a.zoom, a.center),
            c = this._getAnchor()
          wa(this._container, b.add(c))
        },
        _adjustPan: function() {
          if (!(!this.options.autoPan || (this._map._panAnim && this._map._panAnim._inProgress))) {
            var a = this._map,
              b = parseInt(ha(this._container, 'marginBottom'), 10) || 0,
              c = this._container.offsetHeight + b,
              d = this._containerWidth,
              e = new u(this._containerLeft, -c - this._containerBottom)
            e._add(xa(this._container))
            var f = a.layerPointToContainerPoint(e),
              g = v(this.options.autoPanPadding),
              h = v(this.options.autoPanPaddingTopLeft || g),
              i = v(this.options.autoPanPaddingBottomRight || g),
              j = a.getSize(),
              k = 0,
              l = 0
            f.x + d + i.x > j.x && (k = f.x + d - j.x + i.x),
              f.x - k - h.x < 0 && (k = f.x - h.x),
              f.y + c + i.y > j.y && (l = f.y + c - j.y + i.y),
              f.y - l - h.y < 0 && (l = f.y - h.y),
              (k || l) && a.fire('autopanstart').panBy([k, l])
          }
        },
        _onCloseButtonClick: function(a) {
          this._close(), _(a)
        },
        _getAnchor: function() {
          return v(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0])
        },
      })
    wc.mergeOptions({
      closePopupOnClick: !0,
    }),
      wc.include({
        openPopup: function(a, b, c) {
          return (
            a instanceof id || (a = new id(c).setContent(a)),
            b && a.setLatLng(b),
            this.hasLayer(a)
              ? this
              : (this._popup && this._popup.options.autoClose && this.closePopup(), (this._popup = a), this.addLayer(a))
          )
        },
        closePopup: function(a) {
          return (a && a !== this._popup) || ((a = this._popup), (this._popup = null)), a && this.removeLayer(a), this
        },
      }),
      Sc.include({
        bindPopup: function(a, b) {
          return (
            a instanceof id
              ? (k(a, b), (this._popup = a), (a._source = this))
              : ((this._popup && !b) || (this._popup = new id(b, this)), this._popup.setContent(a)),
            this._popupHandlersAdded ||
              (this.on({
                click: this._openPopup,
                keypress: this._onKeyPress,
                remove: this.closePopup,
                move: this._movePopup,
              }),
              (this._popupHandlersAdded = !0)),
            this
          )
        },
        unbindPopup: function() {
          return (
            this._popup &&
              (this.off({
                click: this._openPopup,
                keypress: this._onKeyPress,
                remove: this.closePopup,
                move: this._movePopup,
              }),
              (this._popupHandlersAdded = !1),
              (this._popup = null)),
            this
          )
        },
        openPopup: function(a, b) {
          if ((a instanceof Sc || ((b = a), (a = this)), a instanceof Uc))
            for (var c in this._layers) {
              a = this._layers[c]
              break
            }
          return (
            b || (b = a.getCenter ? a.getCenter() : a.getLatLng()),
            this._popup &&
              this._map &&
              ((this._popup._source = a), this._popup.update(), this._map.openPopup(this._popup, b)),
            this
          )
        },
        closePopup: function() {
          return this._popup && this._popup._close(), this
        },
        togglePopup: function(a) {
          return this._popup && (this._popup._map ? this.closePopup() : this.openPopup(a)), this
        },
        isPopupOpen: function() {
          return !!this._popup && this._popup.isOpen()
        },
        setPopupContent: function(a) {
          return this._popup && this._popup.setContent(a), this
        },
        getPopup: function() {
          return this._popup
        },
        _openPopup: function(a) {
          var b = a.layer || a.target
          this._popup &&
            this._map &&
            (_(a),
            b instanceof Zc
              ? this.openPopup(a.layer || a.target, a.latlng)
              : this._map.hasLayer(this._popup) && this._popup._source === b
                ? this.closePopup()
                : this.openPopup(b, a.latlng))
        },
        _movePopup: function(a) {
          this._popup.setLatLng(a.latlng)
        },
        _onKeyPress: function(a) {
          13 === a.originalEvent.keyCode && this._openPopup(a)
        },
      })
    var jd = hd.extend({
      options: {
        pane: 'tooltipPane',
        offset: [0, 0],
        direction: 'auto',
        permanent: !1,
        sticky: !1,
        interactive: !1,
        opacity: 0.9,
      },
      onAdd: function(a) {
        hd.prototype.onAdd.call(this, a),
          this.setOpacity(this.options.opacity),
          a.fire('tooltipopen', {
            tooltip: this,
          }),
          this._source &&
            this._source.fire(
              'tooltipopen',
              {
                tooltip: this,
              },
              !0,
            )
      },
      onRemove: function(a) {
        hd.prototype.onRemove.call(this, a),
          a.fire('tooltipclose', {
            tooltip: this,
          }),
          this._source &&
            this._source.fire(
              'tooltipclose',
              {
                tooltip: this,
              },
              !0,
            )
      },
      getEvents: function() {
        var a = hd.prototype.getEvents.call(this)
        return Tb && !this.options.permanent && (a.preclick = this._close), a
      },
      _close: function() {
        this._map && this._map.closeTooltip(this)
      },
      _initLayout: function() {
        var a =
          'leaflet-tooltip ' +
          (this.options.className || '') +
          ' leaflet-zoom-' +
          (this._zoomAnimated ? 'animated' : 'hide')
        this._contentNode = this._container = ia('div', a)
      },
      _updateLayout: function() {},
      _adjustPan: function() {},
      _setPosition: function(a) {
        var b = this._map,
          c = this._container,
          d = b.latLngToContainerPoint(b.getCenter()),
          e = b.layerPointToContainerPoint(a),
          f = this.options.direction,
          g = c.offsetWidth,
          h = c.offsetHeight,
          i = v(this.options.offset),
          j = this._getAnchor()
        'top' === f
          ? (a = a.add(v(-g / 2 + i.x, -h + i.y + j.y, !0)))
          : 'bottom' === f
            ? (a = a.subtract(v(g / 2 - i.x, -i.y, !0)))
            : 'center' === f
              ? (a = a.subtract(v(g / 2 + i.x, h / 2 - j.y + i.y, !0)))
              : 'right' === f || ('auto' === f && e.x < d.x)
                ? ((f = 'right'), (a = a.add(v(i.x + j.x, j.y - h / 2 + i.y, !0))))
                : ((f = 'left'), (a = a.subtract(v(g + j.x - i.x, h / 2 - j.y - i.y, !0)))),
          pa(c, 'leaflet-tooltip-right'),
          pa(c, 'leaflet-tooltip-left'),
          pa(c, 'leaflet-tooltip-top'),
          pa(c, 'leaflet-tooltip-bottom'),
          oa(c, 'leaflet-tooltip-' + f),
          wa(c, a)
      },
      _updatePosition: function() {
        var a = this._map.latLngToLayerPoint(this._latlng)
        this._setPosition(a)
      },
      setOpacity: function(a) {
        ;(this.options.opacity = a), this._container && sa(this._container, a)
      },
      _animateZoom: function(a) {
        var b = this._map._latLngToNewLayerPoint(this._latlng, a.zoom, a.center)
        this._setPosition(b)
      },
      _getAnchor: function() {
        return v(
          this._source && this._source._getTooltipAnchor && !this.options.sticky
            ? this._source._getTooltipAnchor()
            : [0, 0],
        )
      },
    })
    wc.include({
      openTooltip: function(a, b, c) {
        return (
          a instanceof jd || (a = new jd(c).setContent(a)),
          b && a.setLatLng(b),
          this.hasLayer(a) ? this : this.addLayer(a)
        )
      },
      closeTooltip: function(a) {
        return a && this.removeLayer(a), this
      },
    }),
      Sc.include({
        bindTooltip: function(a, b) {
          return (
            a instanceof jd
              ? (k(a, b), (this._tooltip = a), (a._source = this))
              : ((this._tooltip && !b) || (this._tooltip = new jd(b, this)), this._tooltip.setContent(a)),
            this._initTooltipInteractions(),
            this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(),
            this
          )
        },
        unbindTooltip: function() {
          return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), (this._tooltip = null)), this
        },
        _initTooltipInteractions: function(a) {
          if (a || !this._tooltipHandlersAdded) {
            var b = a ? 'off' : 'on',
              c = {
                remove: this.closeTooltip,
                move: this._moveTooltip,
              }
            this._tooltip.options.permanent
              ? (c.add = this._openTooltip)
              : ((c.mouseover = this._openTooltip),
                (c.mouseout = this.closeTooltip),
                this._tooltip.options.sticky && (c.mousemove = this._moveTooltip),
                Tb && (c.click = this._openTooltip)),
              this[b](c),
              (this._tooltipHandlersAdded = !a)
          }
        },
        openTooltip: function(a, b) {
          if ((a instanceof Sc || ((b = a), (a = this)), a instanceof Uc))
            for (var c in this._layers) {
              a = this._layers[c]
              break
            }
          return (
            b || (b = a.getCenter ? a.getCenter() : a.getLatLng()),
            this._tooltip &&
              this._map &&
              ((this._tooltip._source = a),
              this._tooltip.update(),
              this._map.openTooltip(this._tooltip, b),
              this._tooltip.options.interactive &&
                this._tooltip._container &&
                (oa(this._tooltip._container, 'leaflet-clickable'),
                this.addInteractiveTarget(this._tooltip._container))),
            this
          )
        },
        closeTooltip: function() {
          return (
            this._tooltip &&
              (this._tooltip._close(),
              this._tooltip.options.interactive &&
                this._tooltip._container &&
                (pa(this._tooltip._container, 'leaflet-clickable'),
                this.removeInteractiveTarget(this._tooltip._container))),
            this
          )
        },
        toggleTooltip: function(a) {
          return this._tooltip && (this._tooltip._map ? this.closeTooltip() : this.openTooltip(a)), this
        },
        isTooltipOpen: function() {
          return this._tooltip.isOpen()
        },
        setTooltipContent: function(a) {
          return this._tooltip && this._tooltip.setContent(a), this
        },
        getTooltip: function() {
          return this._tooltip
        },
        _openTooltip: function(a) {
          var b = a.layer || a.target
          this._tooltip && this._map && this.openTooltip(b, this._tooltip.options.sticky ? a.latlng : void 0)
        },
        _moveTooltip: function(a) {
          var b,
            c,
            d = a.latlng
          this._tooltip.options.sticky &&
            a.originalEvent &&
            ((b = this._map.mouseEventToContainerPoint(a.originalEvent)),
            (c = this._map.containerPointToLayerPoint(b)),
            (d = this._map.layerPointToLatLng(c))),
            this._tooltip.setLatLng(d)
        },
      })
    var kd = Vc.extend({
      options: {
        iconSize: [12, 12],
        html: !1,
        bgPos: null,
        className: 'leaflet-div-icon',
      },
      createIcon: function(a) {
        var b = a && 'DIV' === a.tagName ? a : document.createElement('div'),
          c = this.options
        if (((b.innerHTML = !1 !== c.html ? c.html : ''), c.bgPos)) {
          var d = v(c.bgPos)
          b.style.backgroundPosition = -d.x + 'px ' + -d.y + 'px'
        }
        return this._setIconStyles(b, 'icon'), b
      },
      createShadow: function() {
        return null
      },
    })
    Vc.Default = Wc
    var ld = Sc.extend({
        options: {
          tileSize: 256,
          opacity: 1,
          updateWhenIdle: Ob,
          updateWhenZooming: !0,
          updateInterval: 200,
          zIndex: 1,
          bounds: null,
          minZoom: 0,
          maxZoom: void 0,
          maxNativeZoom: void 0,
          minNativeZoom: void 0,
          noWrap: !1,
          pane: 'tilePane',
          className: '',
          keepBuffer: 2,
        },
        initialize: function(a) {
          k(this, a)
        },
        onAdd: function() {
          this._initContainer(), (this._levels = {}), (this._tiles = {}), this._resetView(), this._update()
        },
        beforeAdd: function(a) {
          a._addZoomLimit(this)
        },
        onRemove: function(a) {
          this._removeAllTiles(),
            ja(this._container),
            a._removeZoomLimit(this),
            (this._container = null),
            (this._tileZoom = void 0)
        },
        bringToFront: function() {
          return this._map && (la(this._container), this._setAutoZIndex(Math.max)), this
        },
        bringToBack: function() {
          return this._map && (ma(this._container), this._setAutoZIndex(Math.min)), this
        },
        getContainer: function() {
          return this._container
        },
        setOpacity: function(a) {
          return (this.options.opacity = a), this._updateOpacity(), this
        },
        setZIndex: function(a) {
          return (this.options.zIndex = a), this._updateZIndex(), this
        },
        isLoading: function() {
          return this._loading
        },
        redraw: function() {
          return this._map && (this._removeAllTiles(), this._update()), this
        },
        getEvents: function() {
          var a = {
            viewprereset: this._invalidateAll,
            viewreset: this._resetView,
            zoom: this._resetView,
            moveend: this._onMoveEnd,
          }
          return (
            this.options.updateWhenIdle ||
              (this._onMove || (this._onMove = e(this._onMoveEnd, this.options.updateInterval, this)),
              (a.move = this._onMove)),
            this._zoomAnimated && (a.zoomanim = this._animateZoom),
            a
          )
        },
        createTile: function() {
          return document.createElement('div')
        },
        getTileSize: function() {
          var a = this.options.tileSize
          return a instanceof u ? a : new u(a, a)
        },
        _updateZIndex: function() {
          this._container &&
            void 0 !== this.options.zIndex &&
            null !== this.options.zIndex &&
            (this._container.style.zIndex = this.options.zIndex)
        },
        _setAutoZIndex: function(a) {
          for (var b, c = this.getPane().children, d = -a(-1 / 0, 1 / 0), e = 0, f = c.length; e < f; e++)
            (b = c[e].style.zIndex), c[e] !== this._container && b && (d = a(d, +b))
          isFinite(d) && ((this.options.zIndex = d + a(-1, 1)), this._updateZIndex())
        },
        _updateOpacity: function() {
          if (this._map && !wb) {
            sa(this._container, this.options.opacity)
            var a = +new Date(),
              b = !1,
              c = !1
            for (var d in this._tiles) {
              var e = this._tiles[d]
              if (e.current && e.loaded) {
                var f = Math.min(1, (a - e.loaded) / 200)
                sa(e.el, f), f < 1 ? (b = !0) : (e.active ? (c = !0) : this._onOpaqueTile(e), (e.active = !0))
              }
            }
            c && !this._noPrune && this._pruneTiles(),
              b && (r(this._fadeFrame), (this._fadeFrame = q(this._updateOpacity, this)))
          }
        },
        _onOpaqueTile: g,
        _initContainer: function() {
          this._container ||
            ((this._container = ia('div', 'leaflet-layer ' + (this.options.className || ''))),
            this._updateZIndex(),
            this.options.opacity < 1 && this._updateOpacity(),
            this.getPane().appendChild(this._container))
        },
        _updateLevels: function() {
          var a = this._tileZoom,
            b = this.options.maxZoom
          if (void 0 !== a) {
            for (var c in this._levels)
              this._levels[c].el.children.length || c === a
                ? ((this._levels[c].el.style.zIndex = b - Math.abs(a - c)), this._onUpdateLevel(c))
                : (ja(this._levels[c].el), this._removeTilesAtZoom(c), this._onRemoveLevel(c), delete this._levels[c])
            var d = this._levels[a],
              e = this._map
            return (
              d ||
                (((d = this._levels[a] = {}).el = ia(
                  'div',
                  'leaflet-tile-container leaflet-zoom-animated',
                  this._container,
                )),
                (d.el.style.zIndex = b),
                (d.origin = e.project(e.unproject(e.getPixelOrigin()), a).round()),
                (d.zoom = a),
                this._setZoomTransform(d, e.getCenter(), e.getZoom()),
                d.el.offsetWidth,
                this._onCreateLevel(d)),
              (this._level = d),
              d
            )
          }
        },
        _onUpdateLevel: g,
        _onRemoveLevel: g,
        _onCreateLevel: g,
        _pruneTiles: function() {
          if (this._map) {
            var a,
              b,
              c = this._map.getZoom()
            if (c > this.options.maxZoom || c < this.options.minZoom) this._removeAllTiles()
            else {
              for (a in this._tiles) (b = this._tiles[a]).retain = b.current
              for (a in this._tiles)
                if ((b = this._tiles[a]).current && !b.active) {
                  var d = b.coords
                  this._retainParent(d.x, d.y, d.z, d.z - 5) || this._retainChildren(d.x, d.y, d.z, d.z + 2)
                }
              for (a in this._tiles) this._tiles[a].retain || this._removeTile(a)
            }
          }
        },
        _removeTilesAtZoom: function(a) {
          for (var b in this._tiles) this._tiles[b].coords.z === a && this._removeTile(b)
        },
        _removeAllTiles: function() {
          for (var a in this._tiles) this._removeTile(a)
        },
        _invalidateAll: function() {
          for (var a in this._levels) ja(this._levels[a].el), this._onRemoveLevel(a), delete this._levels[a]
          this._removeAllTiles(), (this._tileZoom = void 0)
        },
        _retainParent: function(a, b, c, d) {
          var e = Math.floor(a / 2),
            f = Math.floor(b / 2),
            g = c - 1,
            h = new u(+e, +f)
          h.z = +g
          var i = this._tileCoordsToKey(h),
            j = this._tiles[i]
          return j && j.active
            ? ((j.retain = !0), !0)
            : (j && j.loaded && (j.retain = !0), g > d && this._retainParent(e, f, g, d))
        },
        _retainChildren: function(a, b, c, d) {
          for (var e = 2 * a; e < 2 * a + 2; e++)
            for (var f = 2 * b; f < 2 * b + 2; f++) {
              var g = new u(e, f)
              g.z = c + 1
              var h = this._tileCoordsToKey(g),
                i = this._tiles[h]
              i && i.active
                ? (i.retain = !0)
                : (i && i.loaded && (i.retain = !0), c + 1 < d && this._retainChildren(e, f, c + 1, d))
            }
        },
        _resetView: function(a) {
          var b = a && (a.pinch || a.flyTo)
          this._setView(this._map.getCenter(), this._map.getZoom(), b, b)
        },
        _animateZoom: function(a) {
          this._setView(a.center, a.zoom, !0, a.noUpdate)
        },
        _clampZoom: function(a) {
          var b = this.options
          return void 0 !== b.minNativeZoom && a < b.minNativeZoom
            ? b.minNativeZoom
            : void 0 !== b.maxNativeZoom && b.maxNativeZoom < a
              ? b.maxNativeZoom
              : a
        },
        _setView: function(a, b, c, d) {
          var e = this._clampZoom(Math.round(b))
          ;((void 0 !== this.options.maxZoom && e > this.options.maxZoom) ||
            (void 0 !== this.options.minZoom && e < this.options.minZoom)) &&
            (e = void 0)
          var f = this.options.updateWhenZooming && e !== this._tileZoom
          ;(d && !f) ||
            ((this._tileZoom = e),
            this._abortLoading && this._abortLoading(),
            this._updateLevels(),
            this._resetGrid(),
            void 0 !== e && this._update(a),
            c || this._pruneTiles(),
            (this._noPrune = !!c)),
            this._setZoomTransforms(a, b)
        },
        _setZoomTransforms: function(a, b) {
          for (var c in this._levels) this._setZoomTransform(this._levels[c], a, b)
        },
        _setZoomTransform: function(a, b, c) {
          var d = this._map.getZoomScale(c, a.zoom),
            e = a.origin
              .multiplyBy(d)
              .subtract(this._map._getNewPixelOrigin(b, c))
              .round()
          Nb ? va(a.el, e, d) : wa(a.el, e)
        },
        _resetGrid: function() {
          var a = this._map,
            b = a.options.crs,
            c = (this._tileSize = this.getTileSize()),
            d = this._tileZoom,
            e = this._map.getPixelWorldBounds(this._tileZoom)
          e && (this._globalTileRange = this._pxBoundsToTileRange(e)),
            (this._wrapX = b.wrapLng &&
              !this.options.noWrap && [
                Math.floor(a.project([0, b.wrapLng[0]], d).x / c.x),
                Math.ceil(a.project([0, b.wrapLng[1]], d).x / c.y),
              ]),
            (this._wrapY = b.wrapLat &&
              !this.options.noWrap && [
                Math.floor(a.project([b.wrapLat[0], 0], d).y / c.x),
                Math.ceil(a.project([b.wrapLat[1], 0], d).y / c.y),
              ])
        },
        _onMoveEnd: function() {
          this._map && !this._map._animatingZoom && this._update()
        },
        _getTiledPixelBounds: function(a) {
          var b = this._map,
            c = b._animatingZoom ? Math.max(b._animateToZoom, b.getZoom()) : b.getZoom(),
            d = b.getZoomScale(c, this._tileZoom),
            e = b.project(a, this._tileZoom).floor(),
            f = b.getSize().divideBy(2 * d)
          return new w(e.subtract(f), e.add(f))
        },
        _update: function(a) {
          var b = this._map
          if (b) {
            var c = this._clampZoom(b.getZoom())
            if ((void 0 === a && (a = b.getCenter()), void 0 !== this._tileZoom)) {
              var d = this._getTiledPixelBounds(a),
                e = this._pxBoundsToTileRange(d),
                f = e.getCenter(),
                g = [],
                h = this.options.keepBuffer,
                i = new w(e.getBottomLeft().subtract([h, -h]), e.getTopRight().add([h, -h]))
              if (!(isFinite(e.min.x) && isFinite(e.min.y) && isFinite(e.max.x) && isFinite(e.max.y)))
                throw new Error('Attempted to load an infinite number of tiles')
              for (var j in this._tiles) {
                var k = this._tiles[j].coords
                ;(k.z === this._tileZoom && i.contains(new u(k.x, k.y))) || (this._tiles[j].current = !1)
              }
              if (Math.abs(c - this._tileZoom) > 1) this._setView(a, c)
              else {
                for (var l = e.min.y; l <= e.max.y; l++)
                  for (var m = e.min.x; m <= e.max.x; m++) {
                    var n = new u(m, l)
                    if (((n.z = this._tileZoom), this._isValidTile(n))) {
                      var o = this._tiles[this._tileCoordsToKey(n)]
                      o ? (o.current = !0) : g.push(n)
                    }
                  }
                if (
                  (g.sort(function(a, b) {
                    return a.distanceTo(f) - b.distanceTo(f)
                  }),
                  0 !== g.length)
                ) {
                  this._loading || ((this._loading = !0), this.fire('loading'))
                  var p = document.createDocumentFragment()
                  for (m = 0; m < g.length; m++) this._addTile(g[m], p)
                  this._level.el.appendChild(p)
                }
              }
            }
          }
        },
        _isValidTile: function(a) {
          var b = this._map.options.crs
          if (!b.infinite) {
            var c = this._globalTileRange
            if ((!b.wrapLng && (a.x < c.min.x || a.x > c.max.x)) || (!b.wrapLat && (a.y < c.min.y || a.y > c.max.y)))
              return !1
          }
          if (!this.options.bounds) return !0
          var d = this._tileCoordsToBounds(a)
          return z(this.options.bounds).overlaps(d)
        },
        _keyToBounds: function(a) {
          return this._tileCoordsToBounds(this._keyToTileCoords(a))
        },
        _tileCoordsToNwSe: function(a) {
          var b = this._map,
            c = this.getTileSize(),
            d = a.scaleBy(c),
            e = d.add(c)
          return [b.unproject(d, a.z), b.unproject(e, a.z)]
        },
        _tileCoordsToBounds: function(a) {
          var b = this._tileCoordsToNwSe(a),
            c = new y(b[0], b[1])
          return this.options.noWrap || (c = this._map.wrapLatLngBounds(c)), c
        },
        _tileCoordsToKey: function(a) {
          return a.x + ':' + a.y + ':' + a.z
        },
        _keyToTileCoords: function(a) {
          var b = a.split(':'),
            c = new u(+b[0], +b[1])
          return (c.z = +b[2]), c
        },
        _removeTile: function(a) {
          var b = this._tiles[a]
          b &&
            (Cb || b.el.setAttribute('src', db),
            ja(b.el),
            delete this._tiles[a],
            this.fire('tileunload', {
              tile: b.el,
              coords: this._keyToTileCoords(a),
            }))
        },
        _initTile: function(a) {
          oa(a, 'leaflet-tile')
          var b = this.getTileSize()
          ;(a.style.width = b.x + 'px'),
            (a.style.height = b.y + 'px'),
            (a.onselectstart = g),
            (a.onmousemove = g),
            wb && this.options.opacity < 1 && sa(a, this.options.opacity),
            zb && !Ab && (a.style.WebkitBackfaceVisibility = 'hidden')
        },
        _addTile: function(a, b) {
          var d = this._getTilePos(a),
            e = this._tileCoordsToKey(a),
            f = this.createTile(this._wrapCoords(a), c(this._tileReady, this, a))
          this._initTile(f),
            this.createTile.length < 2 && q(c(this._tileReady, this, a, null, f)),
            wa(f, d),
            (this._tiles[e] = {
              el: f,
              coords: a,
              current: !0,
            }),
            b.appendChild(f),
            this.fire('tileloadstart', {
              tile: f,
              coords: a,
            })
        },
        _tileReady: function(a, b, d) {
          if (this._map) {
            b &&
              this.fire('tileerror', {
                error: b,
                tile: d,
                coords: a,
              })
            var e = this._tileCoordsToKey(a)
            ;(d = this._tiles[e]) &&
              ((d.loaded = +new Date()),
              this._map._fadeAnimated
                ? (sa(d.el, 0), r(this._fadeFrame), (this._fadeFrame = q(this._updateOpacity, this)))
                : ((d.active = !0), this._pruneTiles()),
              b ||
                (oa(d.el, 'leaflet-tile-loaded'),
                this.fire('tileload', {
                  tile: d.el,
                  coords: a,
                })),
              this._noTilesToLoad() &&
                ((this._loading = !1),
                this.fire('load'),
                wb || !this._map._fadeAnimated
                  ? q(this._pruneTiles, this)
                  : setTimeout(c(this._pruneTiles, this), 250)))
          }
        },
        _getTilePos: function(a) {
          return a.scaleBy(this.getTileSize()).subtract(this._level.origin)
        },
        _wrapCoords: function(a) {
          var b = new u(this._wrapX ? f(a.x, this._wrapX) : a.x, this._wrapY ? f(a.y, this._wrapY) : a.y)
          return (b.z = a.z), b
        },
        _pxBoundsToTileRange: function(a) {
          var b = this.getTileSize()
          return new w(
            a.min.unscaleBy(b).floor(),
            a.max
              .unscaleBy(b)
              .ceil()
              .subtract([1, 1]),
          )
        },
        _noTilesToLoad: function() {
          for (var a in this._tiles) if (!this._tiles[a].loaded) return !1
          return !0
        },
      }),
      md = ld.extend({
        options: {
          minZoom: 0,
          maxZoom: 18,
          subdomains: 'abc',
          errorTileUrl: '',
          zoomOffset: 0,
          tms: !1,
          zoomReverse: !1,
          detectRetina: !1,
          crossOrigin: !1,
        },
        initialize: function(a, b) {
          ;(this._url = a),
            (b = k(this, b)).detectRetina &&
              Wb &&
              b.maxZoom > 0 &&
              ((b.tileSize = Math.floor(b.tileSize / 2)),
              b.zoomReverse ? (b.zoomOffset--, b.minZoom++) : (b.zoomOffset++, b.maxZoom--),
              (b.minZoom = Math.max(0, b.minZoom))),
            'string' == typeof b.subdomains && (b.subdomains = b.subdomains.split('')),
            zb || this.on('tileunload', this._onTileRemove)
        },
        setUrl: function(a, b) {
          return (this._url = a), b || this.redraw(), this
        },
        createTile: function(a, b) {
          var d = document.createElement('img')
          return (
            T(d, 'load', c(this._tileOnLoad, this, b, d)),
            T(d, 'error', c(this._tileOnError, this, b, d)),
            this.options.crossOrigin && (d.crossOrigin = ''),
            (d.alt = ''),
            d.setAttribute('role', 'presentation'),
            (d.src = this.getTileUrl(a)),
            d
          )
        },
        getTileUrl: function(a) {
          var c = {
            r: Wb ? '@2x' : '',
            s: this._getSubdomain(a),
            x: a.x,
            y: a.y,
            z: this._getZoomForUrl(),
          }
          if (this._map && !this._map.options.crs.infinite) {
            var d = this._globalTileRange.max.y - a.y
            this.options.tms && (c.y = d), (c['-y'] = d)
          }
          return m(this._url, b(c, this.options))
        },
        _tileOnLoad: function(a, b) {
          wb ? setTimeout(c(a, this, null, b), 0) : a(null, b)
        },
        _tileOnError: function(a, b, c) {
          var d = this.options.errorTileUrl
          d && b.getAttribute('src') !== d && (b.src = d), a(c, b)
        },
        _onTileRemove: function(a) {
          a.tile.onload = null
        },
        _getZoomForUrl: function() {
          var a = this._tileZoom,
            b = this.options.maxZoom,
            c = this.options.zoomReverse,
            d = this.options.zoomOffset
          return c && (a = b - a), a + d
        },
        _getSubdomain: function(a) {
          var b = Math.abs(a.x + a.y) % this.options.subdomains.length
          return this.options.subdomains[b]
        },
        _abortLoading: function() {
          var a, b
          for (a in this._tiles)
            this._tiles[a].coords.z !== this._tileZoom &&
              (((b = this._tiles[a].el).onload = g),
              (b.onerror = g),
              b.complete || ((b.src = db), ja(b), delete this._tiles[a]))
        },
      }),
      nd = md.extend({
        defaultWmsParams: {
          service: 'WMS',
          request: 'GetMap',
          layers: '',
          styles: '',
          format: 'image/jpeg',
          transparent: !1,
          version: '1.1.1',
        },
        options: {
          crs: null,
          uppercase: !1,
        },
        initialize: function(a, c) {
          this._url = a
          var d = b({}, this.defaultWmsParams)
          for (var e in c) e in this.options || (d[e] = c[e])
          var f = (c = k(this, c)).detectRetina && Wb ? 2 : 1,
            g = this.getTileSize()
          ;(d.width = g.x * f), (d.height = g.y * f), (this.wmsParams = d)
        },
        onAdd: function(a) {
          ;(this._crs = this.options.crs || a.options.crs), (this._wmsVersion = parseFloat(this.wmsParams.version))
          var b = this._wmsVersion >= 1.3 ? 'crs' : 'srs'
          ;(this.wmsParams[b] = this._crs.code), md.prototype.onAdd.call(this, a)
        },
        getTileUrl: function(a) {
          var b = this._tileCoordsToNwSe(a),
            c = this._crs,
            d = x(c.project(b[0]), c.project(b[1])),
            e = d.min,
            f = d.max,
            g = (this._wmsVersion >= 1.3 && this._crs === Qc ? [e.y, e.x, f.y, f.x] : [e.x, e.y, f.x, f.y]).join(','),
            h = L.TileLayer.prototype.getTileUrl.call(this, a)
          return h + l(this.wmsParams, h, this.options.uppercase) + (this.options.uppercase ? '&BBOX=' : '&bbox=') + g
        },
        setParams: function(a, c) {
          return b(this.wmsParams, a), c || this.redraw(), this
        },
      })
    ;(md.WMS = nd),
      (Xa.wms = function(a, b) {
        return new nd(a, b)
      })
    var od = Sc.extend({
        options: {
          padding: 0.1,
          tolerance: 0,
        },
        initialize: function(a) {
          k(this, a), d(this), (this._layers = this._layers || {})
        },
        onAdd: function() {
          this._container ||
            (this._initContainer(), this._zoomAnimated && oa(this._container, 'leaflet-zoom-animated')),
            this.getPane().appendChild(this._container),
            this._update(),
            this.on('update', this._updatePaths, this)
        },
        onRemove: function() {
          this.off('update', this._updatePaths, this), this._destroyContainer()
        },
        getEvents: function() {
          var a = {
            viewreset: this._reset,
            zoom: this._onZoom,
            moveend: this._update,
            zoomend: this._onZoomEnd,
          }
          return this._zoomAnimated && (a.zoomanim = this._onAnimZoom), a
        },
        _onAnimZoom: function(a) {
          this._updateTransform(a.center, a.zoom)
        },
        _onZoom: function() {
          this._updateTransform(this._map.getCenter(), this._map.getZoom())
        },
        _updateTransform: function(a, b) {
          var c = this._map.getZoomScale(b, this._zoom),
            d = xa(this._container),
            e = this._map.getSize().multiplyBy(0.5 + this.options.padding),
            f = this._map.project(this._center, b),
            g = this._map.project(a, b).subtract(f),
            h = e
              .multiplyBy(-c)
              .add(d)
              .add(e)
              .subtract(g)
          Nb ? va(this._container, h, c) : wa(this._container, h)
        },
        _reset: function() {
          this._update(), this._updateTransform(this._center, this._zoom)
          for (var a in this._layers) this._layers[a]._reset()
        },
        _onZoomEnd: function() {
          for (var a in this._layers) this._layers[a]._project()
        },
        _updatePaths: function() {
          for (var a in this._layers) this._layers[a]._update()
        },
        _update: function() {
          var a = this.options.padding,
            b = this._map.getSize(),
            c = this._map.containerPointToLayerPoint(b.multiplyBy(-a)).round()
          ;(this._bounds = new w(c, c.add(b.multiplyBy(1 + 2 * a)).round())),
            (this._center = this._map.getCenter()),
            (this._zoom = this._map.getZoom())
        },
      }),
      pd = od.extend({
        getEvents: function() {
          var a = od.prototype.getEvents.call(this)
          return (a.viewprereset = this._onViewPreReset), a
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0
        },
        onAdd: function() {
          od.prototype.onAdd.call(this), this._draw()
        },
        _initContainer: function() {
          var a = (this._container = document.createElement('canvas'))
          T(a, 'mousemove', e(this._onMouseMove, 32, this), this),
            T(a, 'click dblclick mousedown mouseup contextmenu', this._onClick, this),
            T(a, 'mouseout', this._handleMouseOut, this),
            (this._ctx = a.getContext('2d'))
        },
        _destroyContainer: function() {
          delete this._ctx, ja(this._container), U(this._container), delete this._container
        },
        _updatePaths: function() {
          if (!this._postponeUpdatePaths) {
            this._redrawBounds = null
            for (var a in this._layers) this._layers[a]._update()
            this._redraw()
          }
        },
        _update: function() {
          if (!this._map._animatingZoom || !this._bounds) {
            ;(this._drawnLayers = {}), od.prototype._update.call(this)
            var a = this._bounds,
              b = this._container,
              c = a.getSize(),
              d = Wb ? 2 : 1
            wa(b, a.min),
              (b.width = d * c.x),
              (b.height = d * c.y),
              (b.style.width = c.x + 'px'),
              (b.style.height = c.y + 'px'),
              Wb && this._ctx.scale(2, 2),
              this._ctx.translate(-a.min.x, -a.min.y),
              this.fire('update')
          }
        },
        _reset: function() {
          od.prototype._reset.call(this),
            this._postponeUpdatePaths && ((this._postponeUpdatePaths = !1), this._updatePaths())
        },
        _initPath: function(a) {
          this._updateDashArray(a), (this._layers[d(a)] = a)
          var b = (a._order = {
            layer: a,
            prev: this._drawLast,
            next: null,
          })
          this._drawLast && (this._drawLast.next = b),
            (this._drawLast = b),
            (this._drawFirst = this._drawFirst || this._drawLast)
        },
        _addPath: function(a) {
          this._requestRedraw(a)
        },
        _removePath: function(a) {
          var b = a._order,
            c = b.next,
            d = b.prev
          c ? (c.prev = d) : (this._drawLast = d),
            d ? (d.next = c) : (this._drawFirst = c),
            delete a._order,
            delete this._layers[L.stamp(a)],
            this._requestRedraw(a)
        },
        _updatePath: function(a) {
          this._extendRedrawBounds(a), a._project(), a._update(), this._requestRedraw(a)
        },
        _updateStyle: function(a) {
          this._updateDashArray(a), this._requestRedraw(a)
        },
        _updateDashArray: function(a) {
          if (a.options.dashArray) {
            var b,
              c = a.options.dashArray.split(','),
              d = []
            for (b = 0; b < c.length; b++) d.push(Number(c[b]))
            a.options._dashArray = d
          }
        },
        _requestRedraw: function(a) {
          this._map &&
            (this._extendRedrawBounds(a), (this._redrawRequest = this._redrawRequest || q(this._redraw, this)))
        },
        _extendRedrawBounds: function(a) {
          if (a._pxBounds) {
            var b = (a.options.weight || 0) + 1
            ;(this._redrawBounds = this._redrawBounds || new w()),
              this._redrawBounds.extend(a._pxBounds.min.subtract([b, b])),
              this._redrawBounds.extend(a._pxBounds.max.add([b, b]))
          }
        },
        _redraw: function() {
          ;(this._redrawRequest = null),
            this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()),
            this._clear(),
            this._draw(),
            (this._redrawBounds = null)
        },
        _clear: function() {
          var a = this._redrawBounds
          if (a) {
            var b = a.getSize()
            this._ctx.clearRect(a.min.x, a.min.y, b.x, b.y)
          } else this._ctx.clearRect(0, 0, this._container.width, this._container.height)
        },
        _draw: function() {
          var a,
            b = this._redrawBounds
          if ((this._ctx.save(), b)) {
            var c = b.getSize()
            this._ctx.beginPath(), this._ctx.rect(b.min.x, b.min.y, c.x, c.y), this._ctx.clip()
          }
          this._drawing = !0
          for (var d = this._drawFirst; d; d = d.next)
            (a = d.layer), (!b || (a._pxBounds && a._pxBounds.intersects(b))) && a._updatePath()
          ;(this._drawing = !1), this._ctx.restore()
        },
        _updatePoly: function(a, b) {
          if (this._drawing) {
            var c,
              d,
              e,
              f,
              g = a._parts,
              h = g.length,
              i = this._ctx
            if (h) {
              for (this._drawnLayers[a._leaflet_id] = a, i.beginPath(), c = 0; c < h; c++) {
                for (d = 0, e = g[c].length; d < e; d++) (f = g[c][d]), i[d ? 'lineTo' : 'moveTo'](f.x, f.y)
                b && i.closePath()
              }
              this._fillStroke(i, a)
            }
          }
        },
        _updateCircle: function(a) {
          if (this._drawing && !a._empty()) {
            var b = a._point,
              c = this._ctx,
              d = Math.max(Math.round(a._radius), 1),
              e = (Math.max(Math.round(a._radiusY), 1) || d) / d
            ;(this._drawnLayers[a._leaflet_id] = a),
              1 !== e && (c.save(), c.scale(1, e)),
              c.beginPath(),
              c.arc(b.x, b.y / e, d, 0, 2 * Math.PI, !1),
              1 !== e && c.restore(),
              this._fillStroke(c, a)
          }
        },
        _fillStroke: function(a, b) {
          var c = b.options
          c.fill &&
            ((a.globalAlpha = c.fillOpacity), (a.fillStyle = c.fillColor || c.color), a.fill(c.fillRule || 'evenodd')),
            c.stroke &&
              0 !== c.weight &&
              (a.setLineDash && a.setLineDash((b.options && b.options._dashArray) || []),
              (a.globalAlpha = c.opacity),
              (a.lineWidth = c.weight),
              (a.strokeStyle = c.color),
              (a.lineCap = c.lineCap),
              (a.lineJoin = c.lineJoin),
              a.stroke())
        },
        _onClick: function(a) {
          for (var b, c, d = this._map.mouseEventToLayerPoint(a), e = this._drawFirst; e; e = e.next)
            (b = e.layer).options.interactive && b._containsPoint(d) && !this._map._draggableMoved(b) && (c = b)
          c && (ca(a), this._fireEvent([c], a))
        },
        _onMouseMove: function(a) {
          if (this._map && !this._map.dragging.moving() && !this._map._animatingZoom) {
            var b = this._map.mouseEventToLayerPoint(a)
            this._handleMouseHover(a, b)
          }
        },
        _handleMouseOut: function(a) {
          var b = this._hoveredLayer
          b &&
            (pa(this._container, 'leaflet-interactive'),
            this._fireEvent([b], a, 'mouseout'),
            (this._hoveredLayer = null))
        },
        _handleMouseHover: function(a, b) {
          for (var c, d, e = this._drawFirst; e; e = e.next)
            (c = e.layer).options.interactive && c._containsPoint(b) && (d = c)
          d !== this._hoveredLayer &&
            (this._handleMouseOut(a),
            d &&
              (oa(this._container, 'leaflet-interactive'),
              this._fireEvent([d], a, 'mouseover'),
              (this._hoveredLayer = d))),
            this._hoveredLayer && this._fireEvent([this._hoveredLayer], a)
        },
        _fireEvent: function(a, b, c) {
          this._map._fireDOMEvent(b, c || b.type, a)
        },
        _bringToFront: function(a) {
          var b = a._order,
            c = b.next,
            d = b.prev
          c &&
            ((c.prev = d),
            d ? (d.next = c) : c && (this._drawFirst = c),
            (b.prev = this._drawLast),
            (this._drawLast.next = b),
            (b.next = null),
            (this._drawLast = b),
            this._requestRedraw(a))
        },
        _bringToBack: function(a) {
          var b = a._order,
            c = b.next,
            d = b.prev
          d &&
            ((d.next = c),
            c ? (c.prev = d) : d && (this._drawLast = d),
            (b.prev = null),
            (b.next = this._drawFirst),
            (this._drawFirst.prev = b),
            (this._drawFirst = b),
            this._requestRedraw(a))
        },
      }),
      qd = (function() {
        try {
          return (
            document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml'),
            function(a) {
              return document.createElement('<lvml:' + a + ' class="lvml">')
            }
          )
        } catch (a) {
          return function(a) {
            return document.createElement('<' + a + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')
          }
        }
      })(),
      rd = {
        _initContainer: function() {
          this._container = ia('div', 'leaflet-vml-container')
        },
        _update: function() {
          this._map._animatingZoom || (od.prototype._update.call(this), this.fire('update'))
        },
        _initPath: function(a) {
          var b = (a._container = qd('shape'))
          oa(b, 'leaflet-vml-shape ' + (this.options.className || '')),
            (b.coordsize = '1 1'),
            (a._path = qd('path')),
            b.appendChild(a._path),
            this._updateStyle(a),
            (this._layers[d(a)] = a)
        },
        _addPath: function(a) {
          var b = a._container
          this._container.appendChild(b), a.options.interactive && a.addInteractiveTarget(b)
        },
        _removePath: function(a) {
          var b = a._container
          ja(b), a.removeInteractiveTarget(b), delete this._layers[d(a)]
        },
        _updateStyle: function(a) {
          var b = a._stroke,
            c = a._fill,
            d = a.options,
            e = a._container
          ;(e.stroked = !!d.stroke),
            (e.filled = !!d.fill),
            d.stroke
              ? (b || (b = a._stroke = qd('stroke')),
                e.appendChild(b),
                (b.weight = d.weight + 'px'),
                (b.color = d.color),
                (b.opacity = d.opacity),
                d.dashArray
                  ? (b.dashStyle = cb(d.dashArray) ? d.dashArray.join(' ') : d.dashArray.replace(/( *, *)/g, ' '))
                  : (b.dashStyle = ''),
                (b.endcap = d.lineCap.replace('butt', 'flat')),
                (b.joinstyle = d.lineJoin))
              : b && (e.removeChild(b), (a._stroke = null)),
            d.fill
              ? (c || (c = a._fill = qd('fill')),
                e.appendChild(c),
                (c.color = d.fillColor || d.color),
                (c.opacity = d.fillOpacity))
              : c && (e.removeChild(c), (a._fill = null))
        },
        _updateCircle: function(a) {
          var b = a._point.round(),
            c = Math.round(a._radius),
            d = Math.round(a._radiusY || c)
          this._setPath(a, a._empty() ? 'M0 0' : 'AL ' + b.x + ',' + b.y + ' ' + c + ',' + d + ' 0,23592600')
        },
        _setPath: function(a, b) {
          a._path.v = b
        },
        _bringToFront: function(a) {
          la(a._container)
        },
        _bringToBack: function(a) {
          ma(a._container)
        },
      },
      sd = Zb ? qd : E,
      td = od.extend({
        getEvents: function() {
          var a = od.prototype.getEvents.call(this)
          return (a.zoomstart = this._onZoomStart), a
        },
        _initContainer: function() {
          ;(this._container = sd('svg')),
            this._container.setAttribute('pointer-events', 'none'),
            (this._rootGroup = sd('g')),
            this._container.appendChild(this._rootGroup)
        },
        _destroyContainer: function() {
          ja(this._container), U(this._container), delete this._container, delete this._rootGroup, delete this._svgSize
        },
        _onZoomStart: function() {
          this._update()
        },
        _update: function() {
          if (!this._map._animatingZoom || !this._bounds) {
            od.prototype._update.call(this)
            var a = this._bounds,
              b = a.getSize(),
              c = this._container
            ;(this._svgSize && this._svgSize.equals(b)) ||
              ((this._svgSize = b), c.setAttribute('width', b.x), c.setAttribute('height', b.y)),
              wa(c, a.min),
              c.setAttribute('viewBox', [a.min.x, a.min.y, b.x, b.y].join(' ')),
              this.fire('update')
          }
        },
        _initPath: function(a) {
          var b = (a._path = sd('path'))
          a.options.className && oa(b, a.options.className),
            a.options.interactive && oa(b, 'leaflet-interactive'),
            this._updateStyle(a),
            (this._layers[d(a)] = a)
        },
        _addPath: function(a) {
          this._rootGroup || this._initContainer(),
            this._rootGroup.appendChild(a._path),
            a.addInteractiveTarget(a._path)
        },
        _removePath: function(a) {
          ja(a._path), a.removeInteractiveTarget(a._path), delete this._layers[d(a)]
        },
        _updatePath: function(a) {
          a._project(), a._update()
        },
        _updateStyle: function(a) {
          var b = a._path,
            c = a.options
          b &&
            (c.stroke
              ? (b.setAttribute('stroke', c.color),
                b.setAttribute('stroke-opacity', c.opacity),
                b.setAttribute('stroke-width', c.weight),
                b.setAttribute('stroke-linecap', c.lineCap),
                b.setAttribute('stroke-linejoin', c.lineJoin),
                c.dashArray ? b.setAttribute('stroke-dasharray', c.dashArray) : b.removeAttribute('stroke-dasharray'),
                c.dashOffset
                  ? b.setAttribute('stroke-dashoffset', c.dashOffset)
                  : b.removeAttribute('stroke-dashoffset'))
              : b.setAttribute('stroke', 'none'),
            c.fill
              ? (b.setAttribute('fill', c.fillColor || c.color),
                b.setAttribute('fill-opacity', c.fillOpacity),
                b.setAttribute('fill-rule', c.fillRule || 'evenodd'))
              : b.setAttribute('fill', 'none'))
        },
        _updatePoly: function(a, b) {
          this._setPath(a, F(a._parts, b))
        },
        _updateCircle: function(a) {
          var b = a._point,
            c = Math.max(Math.round(a._radius), 1),
            d = 'a' + c + ',' + (Math.max(Math.round(a._radiusY), 1) || c) + ' 0 1,0 ',
            e = a._empty() ? 'M0 0' : 'M' + (b.x - c) + ',' + b.y + d + 2 * c + ',0 ' + d + 2 * -c + ',0 '
          this._setPath(a, e)
        },
        _setPath: function(a, b) {
          a._path.setAttribute('d', b)
        },
        _bringToFront: function(a) {
          la(a._path)
        },
        _bringToBack: function(a) {
          ma(a._path)
        },
      })
    Zb && td.include(rd),
      wc.include({
        getRenderer: function(a) {
          var b = a.options.renderer || this._getPaneRenderer(a.options.pane) || this.options.renderer || this._renderer
          return (
            b || (b = this._renderer = (this.options.preferCanvas && Ya()) || Za()),
            this.hasLayer(b) || this.addLayer(b),
            b
          )
        },
        _getPaneRenderer: function(a) {
          if ('overlayPane' === a || void 0 === a) return !1
          var b = this._paneRenderers[a]
          return (
            void 0 === b &&
              ((b =
                (td &&
                  Za({
                    pane: a,
                  })) ||
                (pd &&
                  Ya({
                    pane: a,
                  }))),
              (this._paneRenderers[a] = b)),
            b
          )
        },
      })
    var ud = bd.extend({
      initialize: function(a, b) {
        bd.prototype.initialize.call(this, this._boundsToLatLngs(a), b)
      },
      setBounds: function(a) {
        return this.setLatLngs(this._boundsToLatLngs(a))
      },
      _boundsToLatLngs: function(a) {
        return (a = z(a)), [a.getSouthWest(), a.getNorthWest(), a.getNorthEast(), a.getSouthEast()]
      },
    })
    ;(td.create = sd),
      (td.pointsToPath = F),
      (cd.geometryToLayer = Pa),
      (cd.coordsToLatLng = Qa),
      (cd.coordsToLatLngs = Ra),
      (cd.latLngToCoords = Sa),
      (cd.latLngsToCoords = Ta),
      (cd.getFeature = Ua),
      (cd.asFeature = Va),
      wc.mergeOptions({
        boxZoom: !0,
      })
    var vd = Dc.extend({
      initialize: function(a) {
        ;(this._map = a),
          (this._container = a._container),
          (this._pane = a._panes.overlayPane),
          (this._resetStateTimeout = 0),
          a.on('unload', this._destroy, this)
      },
      addHooks: function() {
        T(this._container, 'mousedown', this._onMouseDown, this)
      },
      removeHooks: function() {
        U(this._container, 'mousedown', this._onMouseDown, this)
      },
      moved: function() {
        return this._moved
      },
      _destroy: function() {
        ja(this._pane), delete this._pane
      },
      _resetState: function() {
        ;(this._resetStateTimeout = 0), (this._moved = !1)
      },
      _clearDeferredResetState: function() {
        0 !== this._resetStateTimeout && (clearTimeout(this._resetStateTimeout), (this._resetStateTimeout = 0))
      },
      _onMouseDown: function(a) {
        return (
          !(!a.shiftKey || (1 !== a.which && 1 !== a.button)) &&
          (this._clearDeferredResetState(),
          this._resetState(),
          pb(),
          ya(),
          (this._startPoint = this._map.mouseEventToContainerPoint(a)),
          T(
            document,
            {
              contextmenu: _,
              mousemove: this._onMouseMove,
              mouseup: this._onMouseUp,
              keydown: this._onKeyDown,
            },
            this,
          ),
          void 0)
        )
      },
      _onMouseMove: function(a) {
        this._moved ||
          ((this._moved = !0),
          (this._box = ia('div', 'leaflet-zoom-box', this._container)),
          oa(this._container, 'leaflet-crosshair'),
          this._map.fire('boxzoomstart')),
          (this._point = this._map.mouseEventToContainerPoint(a))
        var b = new w(this._point, this._startPoint),
          c = b.getSize()
        wa(this._box, b.min), (this._box.style.width = c.x + 'px'), (this._box.style.height = c.y + 'px')
      },
      _finish: function() {
        this._moved && (ja(this._box), pa(this._container, 'leaflet-crosshair')),
          qb(),
          za(),
          U(
            document,
            {
              contextmenu: _,
              mousemove: this._onMouseMove,
              mouseup: this._onMouseUp,
              keydown: this._onKeyDown,
            },
            this,
          )
      },
      _onMouseUp: function(a) {
        if ((1 === a.which || 1 === a.button) && (this._finish(), this._moved)) {
          this._clearDeferredResetState(), (this._resetStateTimeout = setTimeout(c(this._resetState, this), 0))
          var b = new y(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point),
          )
          this._map.fitBounds(b).fire('boxzoomend', {
            boxZoomBounds: b,
          })
        }
      },
      _onKeyDown: function(a) {
        27 === a.keyCode && this._finish()
      },
    })
    wc.addInitHook('addHandler', 'boxZoom', vd),
      wc.mergeOptions({
        doubleClickZoom: !0,
      })
    var wd = Dc.extend({
      addHooks: function() {
        this._map.on('dblclick', this._onDoubleClick, this)
      },
      removeHooks: function() {
        this._map.off('dblclick', this._onDoubleClick, this)
      },
      _onDoubleClick: function(a) {
        var b = this._map,
          c = b.getZoom(),
          d = b.options.zoomDelta,
          e = a.originalEvent.shiftKey ? c - d : c + d
        'center' === b.options.doubleClickZoom ? b.setZoom(e) : b.setZoomAround(a.containerPoint, e)
      },
    })
    wc.addInitHook('addHandler', 'doubleClickZoom', wd),
      wc.mergeOptions({
        dragging: !0,
        inertia: !Ab,
        inertiaDeceleration: 3400,
        inertiaMaxSpeed: 1 / 0,
        easeLinearity: 0.2,
        worldCopyJump: !1,
        maxBoundsViscosity: 0,
      })
    var xd = Dc.extend({
      addHooks: function() {
        if (!this._draggable) {
          var a = this._map
          ;(this._draggable = new Jc(a._mapPane, a._container)),
            this._draggable.on(
              {
                dragstart: this._onDragStart,
                drag: this._onDrag,
                dragend: this._onDragEnd,
              },
              this,
            ),
            this._draggable.on('predrag', this._onPreDragLimit, this),
            a.options.worldCopyJump &&
              (this._draggable.on('predrag', this._onPreDragWrap, this),
              a.on('zoomend', this._onZoomEnd, this),
              a.whenReady(this._onZoomEnd, this))
        }
        oa(this._map._container, 'leaflet-grab leaflet-touch-drag'),
          this._draggable.enable(),
          (this._positions = []),
          (this._times = [])
      },
      removeHooks: function() {
        pa(this._map._container, 'leaflet-grab'),
          pa(this._map._container, 'leaflet-touch-drag'),
          this._draggable.disable()
      },
      moved: function() {
        return this._draggable && this._draggable._moved
      },
      moving: function() {
        return this._draggable && this._draggable._moving
      },
      _onDragStart: function() {
        var a = this._map
        if ((a._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity)) {
          var b = z(this._map.options.maxBounds)
          ;(this._offsetLimit = x(
            this._map.latLngToContainerPoint(b.getNorthWest()).multiplyBy(-1),
            this._map
              .latLngToContainerPoint(b.getSouthEast())
              .multiplyBy(-1)
              .add(this._map.getSize()),
          )),
            (this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity)))
        } else this._offsetLimit = null
        a.fire('movestart').fire('dragstart'), a.options.inertia && ((this._positions = []), (this._times = []))
      },
      _onDrag: function(a) {
        if (this._map.options.inertia) {
          var b = (this._lastTime = +new Date()),
            c = (this._lastPos = this._draggable._absPos || this._draggable._newPos)
          this._positions.push(c), this._times.push(b), this._prunePositions(b)
        }
        this._map.fire('move', a).fire('drag', a)
      },
      _prunePositions: function(a) {
        for (; this._positions.length > 1 && a - this._times[0] > 50; ) this._positions.shift(), this._times.shift()
      },
      _onZoomEnd: function() {
        var a = this._map.getSize().divideBy(2),
          b = this._map.latLngToLayerPoint([0, 0])
        ;(this._initialWorldOffset = b.subtract(a).x), (this._worldWidth = this._map.getPixelWorldBounds().getSize().x)
      },
      _viscousLimit: function(a, b) {
        return a - (a - b) * this._viscosity
      },
      _onPreDragLimit: function() {
        if (this._viscosity && this._offsetLimit) {
          var a = this._draggable._newPos.subtract(this._draggable._startPos),
            b = this._offsetLimit
          a.x < b.min.x && (a.x = this._viscousLimit(a.x, b.min.x)),
            a.y < b.min.y && (a.y = this._viscousLimit(a.y, b.min.y)),
            a.x > b.max.x && (a.x = this._viscousLimit(a.x, b.max.x)),
            a.y > b.max.y && (a.y = this._viscousLimit(a.y, b.max.y)),
            (this._draggable._newPos = this._draggable._startPos.add(a))
        }
      },
      _onPreDragWrap: function() {
        var a = this._worldWidth,
          b = Math.round(a / 2),
          c = this._initialWorldOffset,
          d = this._draggable._newPos.x,
          e = ((d - b + c) % a) + b - c,
          f = ((d + b + c) % a) - b - c,
          g = Math.abs(e + c) < Math.abs(f + c) ? e : f
        ;(this._draggable._absPos = this._draggable._newPos.clone()), (this._draggable._newPos.x = g)
      },
      _onDragEnd: function(a) {
        var b = this._map,
          c = b.options,
          d = !c.inertia || this._times.length < 2
        if ((b.fire('dragend', a), d)) b.fire('moveend')
        else {
          this._prunePositions(+new Date())
          var e = this._lastPos.subtract(this._positions[0]),
            f = (this._lastTime - this._times[0]) / 1e3,
            g = c.easeLinearity,
            h = e.multiplyBy(g / f),
            i = h.distanceTo([0, 0]),
            j = Math.min(c.inertiaMaxSpeed, i),
            k = h.multiplyBy(j / i),
            l = j / (c.inertiaDeceleration * g),
            m = k.multiplyBy(-l / 2).round()
          m.x || m.y
            ? ((m = b._limitOffset(m, b.options.maxBounds)),
              q(function() {
                b.panBy(m, {
                  duration: l,
                  easeLinearity: g,
                  noMoveStart: !0,
                  animate: !0,
                })
              }))
            : b.fire('moveend')
        }
      },
    })
    wc.addInitHook('addHandler', 'dragging', xd),
      wc.mergeOptions({
        keyboard: !0,
        keyboardPanDelta: 80,
      })
    var yd = Dc.extend({
      keyCodes: {
        left: [37],
        right: [39],
        down: [40],
        up: [38],
        zoomIn: [187, 107, 61, 171],
        zoomOut: [189, 109, 54, 173],
      },
      initialize: function(a) {
        ;(this._map = a), this._setPanDelta(a.options.keyboardPanDelta), this._setZoomDelta(a.options.zoomDelta)
      },
      addHooks: function() {
        var a = this._map._container
        a.tabIndex <= 0 && (a.tabIndex = '0'),
          T(
            a,
            {
              focus: this._onFocus,
              blur: this._onBlur,
              mousedown: this._onMouseDown,
            },
            this,
          ),
          this._map.on(
            {
              focus: this._addHooks,
              blur: this._removeHooks,
            },
            this,
          )
      },
      removeHooks: function() {
        this._removeHooks(),
          U(
            this._map._container,
            {
              focus: this._onFocus,
              blur: this._onBlur,
              mousedown: this._onMouseDown,
            },
            this,
          ),
          this._map.off(
            {
              focus: this._addHooks,
              blur: this._removeHooks,
            },
            this,
          )
      },
      _onMouseDown: function() {
        if (!this._focused) {
          var a = document.body,
            b = document.documentElement,
            c = a.scrollTop || b.scrollTop,
            d = a.scrollLeft || b.scrollLeft
          this._map._container.focus(), window.scrollTo(d, c)
        }
      },
      _onFocus: function() {
        ;(this._focused = !0), this._map.fire('focus')
      },
      _onBlur: function() {
        ;(this._focused = !1), this._map.fire('blur')
      },
      _setPanDelta: function(a) {
        var b,
          c,
          d = (this._panKeys = {}),
          e = this.keyCodes
        for (b = 0, c = e.left.length; b < c; b++) d[e.left[b]] = [-1 * a, 0]
        for (b = 0, c = e.right.length; b < c; b++) d[e.right[b]] = [a, 0]
        for (b = 0, c = e.down.length; b < c; b++) d[e.down[b]] = [0, a]
        for (b = 0, c = e.up.length; b < c; b++) d[e.up[b]] = [0, -1 * a]
      },
      _setZoomDelta: function(a) {
        var b,
          c,
          d = (this._zoomKeys = {}),
          e = this.keyCodes
        for (b = 0, c = e.zoomIn.length; b < c; b++) d[e.zoomIn[b]] = a
        for (b = 0, c = e.zoomOut.length; b < c; b++) d[e.zoomOut[b]] = -a
      },
      _addHooks: function() {
        T(document, 'keydown', this._onKeyDown, this)
      },
      _removeHooks: function() {
        U(document, 'keydown', this._onKeyDown, this)
      },
      _onKeyDown: function(a) {
        if (!(a.altKey || a.ctrlKey || a.metaKey)) {
          var b,
            c = a.keyCode,
            d = this._map
          if (c in this._panKeys) {
            if (d._panAnim && d._panAnim._inProgress) return
            ;(b = this._panKeys[c]),
              a.shiftKey && (b = v(b).multiplyBy(3)),
              d.panBy(b),
              d.options.maxBounds && d.panInsideBounds(d.options.maxBounds)
          } else if (c in this._zoomKeys) d.setZoom(d.getZoom() + (a.shiftKey ? 3 : 1) * this._zoomKeys[c])
          else {
            if (27 !== c || !d._popup || !d._popup.options.closeOnEscapeKey) return
            d.closePopup()
          }
          _(a)
        }
      },
    })
    wc.addInitHook('addHandler', 'keyboard', yd),
      wc.mergeOptions({
        scrollWheelZoom: !0,
        wheelDebounceTime: 40,
        wheelPxPerZoomLevel: 60,
      })
    var zd = Dc.extend({
      addHooks: function() {
        T(this._map._container, 'mousewheel', this._onWheelScroll, this), (this._delta = 0)
      },
      removeHooks: function() {
        U(this._map._container, 'mousewheel', this._onWheelScroll, this)
      },
      _onWheelScroll: function(a) {
        var b = ba(a),
          d = this._map.options.wheelDebounceTime
        ;(this._delta += b),
          (this._lastMousePos = this._map.mouseEventToContainerPoint(a)),
          this._startTime || (this._startTime = +new Date())
        var e = Math.max(d - (+new Date() - this._startTime), 0)
        clearTimeout(this._timer), (this._timer = setTimeout(c(this._performZoom, this), e)), _(a)
      },
      _performZoom: function() {
        var a = this._map,
          b = a.getZoom(),
          c = this._map.options.zoomSnap || 0
        a._stop()
        var d = this._delta / (4 * this._map.options.wheelPxPerZoomLevel),
          e = (4 * Math.log(2 / (1 + Math.exp(-Math.abs(d))))) / Math.LN2,
          f = c ? Math.ceil(e / c) * c : e,
          g = a._limitZoom(b + (this._delta > 0 ? f : -f)) - b
        ;(this._delta = 0),
          (this._startTime = null),
          g && ('center' === a.options.scrollWheelZoom ? a.setZoom(b + g) : a.setZoomAround(this._lastMousePos, b + g))
      },
    })
    wc.addInitHook('addHandler', 'scrollWheelZoom', zd),
      wc.mergeOptions({
        tap: !0,
        tapTolerance: 15,
      })
    var Ad = Dc.extend({
      addHooks: function() {
        T(this._map._container, 'touchstart', this._onDown, this)
      },
      removeHooks: function() {
        U(this._map._container, 'touchstart', this._onDown, this)
      },
      _onDown: function(a) {
        if (a.touches) {
          if (($(a), (this._fireClick = !0), a.touches.length > 1))
            return (this._fireClick = !1), void clearTimeout(this._holdTimeout)
          var b = a.touches[0],
            d = b.target
          ;(this._startPos = this._newPos = new u(b.clientX, b.clientY)),
            d.tagName && 'a' === d.tagName.toLowerCase() && oa(d, 'leaflet-active'),
            (this._holdTimeout = setTimeout(
              c(function() {
                this._isTapValid() && ((this._fireClick = !1), this._onUp(), this._simulateEvent('contextmenu', b))
              }, this),
              1e3,
            )),
            this._simulateEvent('mousedown', b),
            T(
              document,
              {
                touchmove: this._onMove,
                touchend: this._onUp,
              },
              this,
            )
        }
      },
      _onUp: function(a) {
        if (
          (clearTimeout(this._holdTimeout),
          U(
            document,
            {
              touchmove: this._onMove,
              touchend: this._onUp,
            },
            this,
          ),
          this._fireClick && a && a.changedTouches)
        ) {
          var b = a.changedTouches[0],
            c = b.target
          c && c.tagName && 'a' === c.tagName.toLowerCase() && pa(c, 'leaflet-active'),
            this._simulateEvent('mouseup', b),
            this._isTapValid() && this._simulateEvent('click', b)
        }
      },
      _isTapValid: function() {
        return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance
      },
      _onMove: function(a) {
        var b = a.touches[0]
        ;(this._newPos = new u(b.clientX, b.clientY)), this._simulateEvent('mousemove', b)
      },
      _simulateEvent: function(a, b) {
        var c = document.createEvent('MouseEvents')
        ;(c._simulated = !0),
          (b.target._simulatedClick = !0),
          c.initMouseEvent(a, !0, !0, window, 1, b.screenX, b.screenY, b.clientX, b.clientY, !1, !1, !1, !1, 0, null),
          b.target.dispatchEvent(c)
      },
    })
    Tb && !Sb && wc.addInitHook('addHandler', 'tap', Ad),
      wc.mergeOptions({
        touchZoom: Tb && !Ab,
        bounceAtZoomLimits: !0,
      })
    var Bd = Dc.extend({
      addHooks: function() {
        oa(this._map._container, 'leaflet-touch-zoom'), T(this._map._container, 'touchstart', this._onTouchStart, this)
      },
      removeHooks: function() {
        pa(this._map._container, 'leaflet-touch-zoom'), U(this._map._container, 'touchstart', this._onTouchStart, this)
      },
      _onTouchStart: function(a) {
        var b = this._map
        if (a.touches && 2 === a.touches.length && !b._animatingZoom && !this._zooming) {
          var c = b.mouseEventToContainerPoint(a.touches[0]),
            d = b.mouseEventToContainerPoint(a.touches[1])
          ;(this._centerPoint = b.getSize()._divideBy(2)),
            (this._startLatLng = b.containerPointToLatLng(this._centerPoint)),
            'center' !== b.options.touchZoom &&
              (this._pinchStartLatLng = b.containerPointToLatLng(c.add(d)._divideBy(2))),
            (this._startDist = c.distanceTo(d)),
            (this._startZoom = b.getZoom()),
            (this._moved = !1),
            (this._zooming = !0),
            b._stop(),
            T(document, 'touchmove', this._onTouchMove, this),
            T(document, 'touchend', this._onTouchEnd, this),
            $(a)
        }
      },
      _onTouchMove: function(a) {
        if (a.touches && 2 === a.touches.length && this._zooming) {
          var b = this._map,
            d = b.mouseEventToContainerPoint(a.touches[0]),
            e = b.mouseEventToContainerPoint(a.touches[1]),
            f = d.distanceTo(e) / this._startDist
          if (
            ((this._zoom = b.getScaleZoom(f, this._startZoom)),
            !b.options.bounceAtZoomLimits &&
              ((this._zoom < b.getMinZoom() && f < 1) || (this._zoom > b.getMaxZoom() && f > 1)) &&
              (this._zoom = b._limitZoom(this._zoom)),
            'center' === b.options.touchZoom)
          ) {
            if (((this._center = this._startLatLng), 1 === f)) return
          } else {
            var g = d
              ._add(e)
              ._divideBy(2)
              ._subtract(this._centerPoint)
            if (1 === f && 0 === g.x && 0 === g.y) return
            this._center = b.unproject(b.project(this._pinchStartLatLng, this._zoom).subtract(g), this._zoom)
          }
          this._moved || (b._moveStart(!0, !1), (this._moved = !0)), r(this._animRequest)
          var h = c(b._move, b, this._center, this._zoom, {
            pinch: !0,
            round: !1,
          })
          ;(this._animRequest = q(h, this, !0)), $(a)
        }
      },
      _onTouchEnd: function() {
        this._moved && this._zooming
          ? ((this._zooming = !1),
            r(this._animRequest),
            U(document, 'touchmove', this._onTouchMove),
            U(document, 'touchend', this._onTouchEnd),
            this._map.options.zoomAnimation
              ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap)
              : this._map._resetView(this._center, this._map._limitZoom(this._zoom)))
          : (this._zooming = !1)
      },
    })
    wc.addInitHook('addHandler', 'touchZoom', Bd),
      (wc.BoxZoom = vd),
      (wc.DoubleClickZoom = wd),
      (wc.Drag = xd),
      (wc.Keyboard = yd),
      (wc.ScrollWheelZoom = zd),
      (wc.Tap = Ad),
      (wc.TouchZoom = Bd)
    var Cd = window.L
    ;(window.L = a),
      (Object.freeze = $a),
      (a.version = '1.3.1'),
      (a.noConflict = function() {
        return (window.L = Cd), this
      }),
      (a.Control = xc),
      (a.control = yc),
      (a.Browser = $b),
      (a.Evented = jb),
      (a.Mixin = Fc),
      (a.Util = hb),
      (a.Class = s),
      (a.Handler = Dc),
      (a.extend = b),
      (a.bind = c),
      (a.stamp = d),
      (a.setOptions = k),
      (a.DomEvent = nc),
      (a.DomUtil = uc),
      (a.PosAnimation = vc),
      (a.Draggable = Jc),
      (a.LineUtil = Kc),
      (a.PolyUtil = Lc),
      (a.Point = u),
      (a.point = v),
      (a.Bounds = w),
      (a.bounds = x),
      (a.Transformation = C),
      (a.transformation = D),
      (a.Projection = Oc),
      (a.LatLng = A),
      (a.latLng = B),
      (a.LatLngBounds = y),
      (a.latLngBounds = z),
      (a.CRS = lb),
      (a.GeoJSON = cd),
      (a.geoJSON = Wa),
      (a.geoJson = ed),
      (a.Layer = Sc),
      (a.LayerGroup = Tc),
      (a.layerGroup = function(a, b) {
        return new Tc(a, b)
      }),
      (a.FeatureGroup = Uc),
      (a.featureGroup = function(a) {
        return new Uc(a)
      }),
      (a.ImageOverlay = fd),
      (a.imageOverlay = function(a, b, c) {
        return new fd(a, b, c)
      }),
      (a.VideoOverlay = gd),
      (a.videoOverlay = function(a, b, c) {
        return new gd(a, b, c)
      }),
      (a.DivOverlay = hd),
      (a.Popup = id),
      (a.popup = function(a, b) {
        return new id(a, b)
      }),
      (a.Tooltip = jd),
      (a.tooltip = function(a, b) {
        return new jd(a, b)
      }),
      (a.Icon = Vc),
      (a.icon = function(a) {
        return new Vc(a)
      }),
      (a.DivIcon = kd),
      (a.divIcon = function(a) {
        return new kd(a)
      }),
      (a.Marker = Yc),
      (a.marker = function(a, b) {
        return new Yc(a, b)
      }),
      (a.TileLayer = md),
      (a.tileLayer = Xa),
      (a.GridLayer = ld),
      (a.gridLayer = function(a) {
        return new ld(a)
      }),
      (a.SVG = td),
      (a.svg = Za),
      (a.Renderer = od),
      (a.Canvas = pd),
      (a.canvas = Ya),
      (a.Path = Zc),
      (a.CircleMarker = $c),
      (a.circleMarker = function(a, b) {
        return new $c(a, b)
      }),
      (a.Circle = _c),
      (a.circle = function(a, b, c) {
        return new _c(a, b, c)
      }),
      (a.Polyline = ad),
      (a.polyline = function(a, b) {
        return new ad(a, b)
      }),
      (a.Polygon = bd),
      (a.polygon = function(a, b) {
        return new bd(a, b)
      }),
      (a.Rectangle = ud),
      (a.rectangle = function(a, b) {
        return new ud(a, b)
      }),
      (a.Map = wc),
      (a.map = function(a, b) {
        return new wc(a, b)
      })
  }),
  !(function(a, b) {
    'object' == typeof exports && 'undefined' != typeof module
      ? b(exports)
      : 'function' == typeof define && define.amd
        ? define(['exports'], b)
        : b(((a.Leaflet = a.Leaflet || {}), (a.Leaflet.markercluster = a.Leaflet.markercluster || {})))
  })(this, function(a) {
    'use strict'
    var b = (L.MarkerClusterGroup = L.FeatureGroup.extend({
      options: {
        maxClusterRadius: 80,
        iconCreateFunction: null,
        clusterPane: L.Marker.prototype.options.pane,
        spiderfyOnMaxZoom: !0,
        showCoverageOnHover: !0,
        zoomToBoundsOnClick: !0,
        singleMarkerMode: !1,
        disableClusteringAtZoom: null,
        removeOutsideVisibleBounds: !0,
        animate: !0,
        animateAddingMarkers: !1,
        spiderfyDistanceMultiplier: 1,
        spiderLegPolylineOptions: {
          weight: 1.5,
          color: '#222',
          opacity: 0.5,
        },
        chunkedLoading: !1,
        chunkInterval: 200,
        chunkDelay: 50,
        chunkProgress: null,
        polygonOptions: {},
      },
      initialize: function(a) {
        L.Util.setOptions(this, a),
          this.options.iconCreateFunction || (this.options.iconCreateFunction = this._defaultIconCreateFunction),
          (this._featureGroup = L.featureGroup()),
          this._featureGroup.addEventParent(this),
          (this._nonPointGroup = L.featureGroup()),
          this._nonPointGroup.addEventParent(this),
          (this._inZoomAnimation = 0),
          (this._needsClustering = []),
          (this._needsRemoving = []),
          (this._currentShownBounds = null),
          (this._queue = []),
          (this._childMarkerEventHandlers = {
            dragstart: this._childMarkerDragStart,
            move: this._childMarkerMoved,
            dragend: this._childMarkerDragEnd,
          })
        var b = L.DomUtil.TRANSITION && this.options.animate
        L.extend(this, b ? this._withAnimation : this._noAnimation),
          (this._markerCluster = b ? L.MarkerCluster : L.MarkerClusterNonAnimated)
      },
      addLayer: function(a) {
        if (a instanceof L.LayerGroup) return this.addLayers([a])
        if (!a.getLatLng)
          return (
            this._nonPointGroup.addLayer(a),
            this.fire('layeradd', {
              layer: a,
            }),
            this
          )
        if (!this._map)
          return (
            this._needsClustering.push(a),
            this.fire('layeradd', {
              layer: a,
            }),
            this
          )
        if (this.hasLayer(a)) return this
        this._unspiderfy && this._unspiderfy(),
          this._addLayer(a, this._maxZoom),
          this.fire('layeradd', {
            layer: a,
          }),
          this._topClusterLevel._recalculateBounds(),
          this._refreshClustersIcons()
        var b = a,
          c = this._zoom
        if (a.__parent) for (; b.__parent._zoom >= c; ) b = b.__parent
        return (
          this._currentShownBounds.contains(b.getLatLng()) &&
            (this.options.animateAddingMarkers
              ? this._animationAddLayer(a, b)
              : this._animationAddLayerNonAnimated(a, b)),
          this
        )
      },
      removeLayer: function(a) {
        return a instanceof L.LayerGroup
          ? this.removeLayers([a])
          : a.getLatLng
            ? this._map
              ? a.__parent
                ? (this._unspiderfy && (this._unspiderfy(), this._unspiderfyLayer(a)),
                  this._removeLayer(a, !0),
                  this.fire('layerremove', {
                    layer: a,
                  }),
                  this._topClusterLevel._recalculateBounds(),
                  this._refreshClustersIcons(),
                  a.off(this._childMarkerEventHandlers, this),
                  this._featureGroup.hasLayer(a) &&
                    (this._featureGroup.removeLayer(a), a.clusterShow && a.clusterShow()),
                  this)
                : this
              : (!this._arraySplice(this._needsClustering, a) &&
                  this.hasLayer(a) &&
                  this._needsRemoving.push({
                    layer: a,
                    latlng: a._latlng,
                  }),
                this.fire('layerremove', {
                  layer: a,
                }),
                this)
            : (this._nonPointGroup.removeLayer(a),
              this.fire('layerremove', {
                layer: a,
              }),
              this)
      },
      addLayers: function(a, b) {
        if (!L.Util.isArray(a)) return this.addLayer(a)
        var c,
          d = this._featureGroup,
          e = this._nonPointGroup,
          f = this.options.chunkedLoading,
          g = this.options.chunkInterval,
          h = this.options.chunkProgress,
          i = a.length,
          j = 0,
          k = !0
        if (this._map) {
          var l = new Date().getTime(),
            m = L.bind(function() {
              for (var n = new Date().getTime(); i > j; j++) {
                if (f && 0 === j % 200) {
                  var o = new Date().getTime() - n
                  if (o > g) break
                }
                if (((c = a[j]), c instanceof L.LayerGroup))
                  k && ((a = a.slice()), (k = !1)), this._extractNonGroupLayers(c, a), (i = a.length)
                else if (c.getLatLng) {
                  if (
                    !this.hasLayer(c) &&
                    (this._addLayer(c, this._maxZoom),
                    b ||
                      this.fire('layeradd', {
                        layer: c,
                      }),
                    c.__parent && 2 === c.__parent.getChildCount())
                  ) {
                    var p = c.__parent.getAllChildMarkers(),
                      q = p[0] === c ? p[1] : p[0]
                    d.removeLayer(q)
                  }
                } else
                  e.addLayer(c),
                    b ||
                      this.fire('layeradd', {
                        layer: c,
                      })
              }
              h && h(j, i, new Date().getTime() - l),
                j === i
                  ? (this._topClusterLevel._recalculateBounds(),
                    this._refreshClustersIcons(),
                    this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds))
                  : setTimeout(m, this.options.chunkDelay)
            }, this)
          m()
        } else
          for (var n = this._needsClustering; i > j; j++)
            (c = a[j]),
              c instanceof L.LayerGroup
                ? (k && ((a = a.slice()), (k = !1)), this._extractNonGroupLayers(c, a), (i = a.length))
                : c.getLatLng
                  ? this.hasLayer(c) || n.push(c)
                  : e.addLayer(c)
        return this
      },
      removeLayers: function(a) {
        var b,
          c,
          d = a.length,
          e = this._featureGroup,
          f = this._nonPointGroup,
          g = !0
        if (!this._map) {
          for (b = 0; d > b; b++)
            (c = a[b]),
              c instanceof L.LayerGroup
                ? (g && ((a = a.slice()), (g = !1)), this._extractNonGroupLayers(c, a), (d = a.length))
                : (this._arraySplice(this._needsClustering, c),
                  f.removeLayer(c),
                  this.hasLayer(c) &&
                    this._needsRemoving.push({
                      layer: c,
                      latlng: c._latlng,
                    }),
                  this.fire('layerremove', {
                    layer: c,
                  }))
          return this
        }
        if (this._unspiderfy) {
          this._unspiderfy()
          var h = a.slice(),
            i = d
          for (b = 0; i > b; b++)
            (c = h[b]),
              c instanceof L.LayerGroup ? (this._extractNonGroupLayers(c, h), (i = h.length)) : this._unspiderfyLayer(c)
        }
        for (b = 0; d > b; b++)
          (c = a[b]),
            c instanceof L.LayerGroup
              ? (g && ((a = a.slice()), (g = !1)), this._extractNonGroupLayers(c, a), (d = a.length))
              : c.__parent
                ? (this._removeLayer(c, !0, !0),
                  this.fire('layerremove', {
                    layer: c,
                  }),
                  e.hasLayer(c) && (e.removeLayer(c), c.clusterShow && c.clusterShow()))
                : (f.removeLayer(c),
                  this.fire('layerremove', {
                    layer: c,
                  }))
        return (
          this._topClusterLevel._recalculateBounds(),
          this._refreshClustersIcons(),
          this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds),
          this
        )
      },
      clearLayers: function() {
        return (
          this._map || ((this._needsClustering = []), delete this._gridClusters, delete this._gridUnclustered),
          this._noanimationUnspiderfy && this._noanimationUnspiderfy(),
          this._featureGroup.clearLayers(),
          this._nonPointGroup.clearLayers(),
          this.eachLayer(function(a) {
            a.off(this._childMarkerEventHandlers, this), delete a.__parent
          }, this),
          this._map && this._generateInitialClusters(),
          this
        )
      },
      getBounds: function() {
        var a = new L.LatLngBounds()
        this._topClusterLevel && a.extend(this._topClusterLevel._bounds)
        for (var b = this._needsClustering.length - 1; b >= 0; b--) a.extend(this._needsClustering[b].getLatLng())
        return a.extend(this._nonPointGroup.getBounds()), a
      },
      eachLayer: function(a, b) {
        var c,
          d,
          e,
          f = this._needsClustering.slice(),
          g = this._needsRemoving
        for (this._topClusterLevel && this._topClusterLevel.getAllChildMarkers(f), d = f.length - 1; d >= 0; d--) {
          for (c = !0, e = g.length - 1; e >= 0; e--)
            if (g[e].layer === f[d]) {
              c = !1
              break
            }
          c && a.call(b, f[d])
        }
        this._nonPointGroup.eachLayer(a, b)
      },
      getLayers: function() {
        var a = []
        return (
          this.eachLayer(function(b) {
            a.push(b)
          }),
          a
        )
      },
      getLayer: function(a) {
        var b = null
        return (
          (a = parseInt(a, 10)),
          this.eachLayer(function(c) {
            L.stamp(c) === a && (b = c)
          }),
          b
        )
      },
      hasLayer: function(a) {
        if (!a) return !1
        var b,
          c = this._needsClustering
        for (b = c.length - 1; b >= 0; b--) if (c[b] === a) return !0
        for (c = this._needsRemoving, b = c.length - 1; b >= 0; b--) if (c[b].layer === a) return !1
        return !(!a.__parent || a.__parent._group !== this) || this._nonPointGroup.hasLayer(a)
      },
      zoomToShowLayer: function(a, b) {
        'function' != typeof b && (b = function() {})
        var c = function() {
          ;(!a._icon && !a.__parent._icon) ||
            this._inZoomAnimation ||
            (this._map.off('moveend', c, this),
            this.off('animationend', c, this),
            a._icon ? b() : a.__parent._icon && (this.once('spiderfied', b, this), a.__parent.spiderfy()))
        }
        a._icon && this._map.getBounds().contains(a.getLatLng())
          ? b()
          : a.__parent._zoom < Math.round(this._map._zoom)
            ? (this._map.on('moveend', c, this), this._map.panTo(a.getLatLng()))
            : (this._map.on('moveend', c, this), this.on('animationend', c, this), a.__parent.zoomToBounds())
      },
      onAdd: function(a) {
        this._map = a
        var b, c, d
        if (!isFinite(this._map.getMaxZoom())) throw 'Map has no maxZoom specified'
        for (
          this._featureGroup.addTo(a),
            this._nonPointGroup.addTo(a),
            this._gridClusters || this._generateInitialClusters(),
            this._maxLat = a.options.crs.projection.MAX_LATITUDE,
            b = 0,
            c = this._needsRemoving.length;
          c > b;
          b++
        )
          (d = this._needsRemoving[b]), (d.newlatlng = d.layer._latlng), (d.layer._latlng = d.latlng)
        for (b = 0, c = this._needsRemoving.length; c > b; b++)
          (d = this._needsRemoving[b]), this._removeLayer(d.layer, !0), (d.layer._latlng = d.newlatlng)
        ;(this._needsRemoving = []),
          (this._zoom = Math.round(this._map._zoom)),
          (this._currentShownBounds = this._getExpandedVisibleBounds()),
          this._map.on('zoomend', this._zoomEnd, this),
          this._map.on('moveend', this._moveEnd, this),
          this._spiderfierOnAdd && this._spiderfierOnAdd(),
          this._bindEvents(),
          (c = this._needsClustering),
          (this._needsClustering = []),
          this.addLayers(c, !0)
      },
      onRemove: function(a) {
        a.off('zoomend', this._zoomEnd, this),
          a.off('moveend', this._moveEnd, this),
          this._unbindEvents(),
          (this._map._mapPane.className = this._map._mapPane.className.replace(' leaflet-cluster-anim', '')),
          this._spiderfierOnRemove && this._spiderfierOnRemove(),
          delete this._maxLat,
          this._hideCoverage(),
          this._featureGroup.remove(),
          this._nonPointGroup.remove(),
          this._featureGroup.clearLayers(),
          (this._map = null)
      },
      getVisibleParent: function(a) {
        for (var b = a; b && !b._icon; ) b = b.__parent
        return b || null
      },
      _arraySplice: function(a, b) {
        for (var c = a.length - 1; c >= 0; c--) if (a[c] === b) return a.splice(c, 1), !0
      },
      _removeFromGridUnclustered: function(a, b) {
        for (
          var c = this._map, d = this._gridUnclustered, e = Math.floor(this._map.getMinZoom());
          b >= e && d[b].removeObject(a, c.project(a.getLatLng(), b));
          b--
        );
      },
      _childMarkerDragStart: function(a) {
        a.target.__dragStart = a.target._latlng
      },
      _childMarkerMoved: function(a) {
        if (!this._ignoreMove && !a.target.__dragStart) {
          var b = a.target._popup && a.target._popup.isOpen()
          this._moveChild(a.target, a.oldLatLng, a.latlng), b && a.target.openPopup()
        }
      },
      _moveChild: function(a, b, c) {
        ;(a._latlng = b), this.removeLayer(a), (a._latlng = c), this.addLayer(a)
      },
      _childMarkerDragEnd: function(a) {
        a.target.__dragStart && this._moveChild(a.target, a.target.__dragStart, a.target._latlng),
          delete a.target.__dragStart
      },
      _removeLayer: function(a, b, c) {
        var d = this._gridClusters,
          e = this._gridUnclustered,
          f = this._featureGroup,
          g = this._map,
          h = Math.floor(this._map.getMinZoom())
        b && this._removeFromGridUnclustered(a, this._maxZoom)
        var i,
          j = a.__parent,
          k = j._markers
        for (this._arraySplice(k, a); j && (j._childCount--, (j._boundsNeedUpdate = !0), !(j._zoom < h)); )
          b && j._childCount <= 1
            ? ((i = j._markers[0] === a ? j._markers[1] : j._markers[0]),
              d[j._zoom].removeObject(j, g.project(j._cLatLng, j._zoom)),
              e[j._zoom].addObject(i, g.project(i.getLatLng(), j._zoom)),
              this._arraySplice(j.__parent._childClusters, j),
              j.__parent._markers.push(i),
              (i.__parent = j.__parent),
              j._icon && (f.removeLayer(j), c || f.addLayer(i)))
            : (j._iconNeedsUpdate = !0),
            (j = j.__parent)
        delete a.__parent
      },
      _isOrIsParent: function(a, b) {
        for (; b; ) {
          if (a === b) return !0
          b = b.parentNode
        }
        return !1
      },
      fire: function(a, b, c) {
        if (b && b.layer instanceof L.MarkerCluster) {
          if (b.originalEvent && this._isOrIsParent(b.layer._icon, b.originalEvent.relatedTarget)) return
          a = 'cluster' + a
        }
        L.FeatureGroup.prototype.fire.call(this, a, b, c)
      },
      listens: function(a, b) {
        return (
          L.FeatureGroup.prototype.listens.call(this, a, b) ||
          L.FeatureGroup.prototype.listens.call(this, 'cluster' + a, b)
        )
      },
      _defaultIconCreateFunction: function(a) {
        var b = a.getChildCount(),
          c = ' marker-cluster-'
        return (
          (c += 10 > b ? 'small' : 100 > b ? 'medium' : 'large'),
          new L.DivIcon({
            html: '<div><span>' + b + '</span></div>',
            className: 'marker-cluster' + c,
            iconSize: new L.Point(40, 40),
          })
        )
      },
      _bindEvents: function() {
        var a = this._map,
          b = this.options.spiderfyOnMaxZoom,
          c = this.options.showCoverageOnHover,
          d = this.options.zoomToBoundsOnClick
        ;(b || d) && this.on('clusterclick', this._zoomOrSpiderfy, this),
          c &&
            (this.on('clustermouseover', this._showCoverage, this),
            this.on('clustermouseout', this._hideCoverage, this),
            a.on('zoomend', this._hideCoverage, this))
      },
      _zoomOrSpiderfy: function(a) {
        for (var b = a.layer, c = b; 1 === c._childClusters.length; ) c = c._childClusters[0]
        c._zoom === this._maxZoom && c._childCount === b._childCount && this.options.spiderfyOnMaxZoom
          ? b.spiderfy()
          : this.options.zoomToBoundsOnClick && b.zoomToBounds(),
          a.originalEvent && 13 === a.originalEvent.keyCode && this._map._container.focus()
      },
      _showCoverage: function(a) {
        var b = this._map
        this._inZoomAnimation ||
          (this._shownPolygon && b.removeLayer(this._shownPolygon),
          a.layer.getChildCount() > 2 &&
            a.layer !== this._spiderfied &&
            ((this._shownPolygon = new L.Polygon(a.layer.getConvexHull(), this.options.polygonOptions)),
            b.addLayer(this._shownPolygon)))
      },
      _hideCoverage: function() {
        this._shownPolygon && (this._map.removeLayer(this._shownPolygon), (this._shownPolygon = null))
      },
      _unbindEvents: function() {
        var a = this.options.spiderfyOnMaxZoom,
          b = this.options.showCoverageOnHover,
          c = this.options.zoomToBoundsOnClick,
          d = this._map
        ;(a || c) && this.off('clusterclick', this._zoomOrSpiderfy, this),
          b &&
            (this.off('clustermouseover', this._showCoverage, this),
            this.off('clustermouseout', this._hideCoverage, this),
            d.off('zoomend', this._hideCoverage, this))
      },
      _zoomEnd: function() {
        this._map &&
          (this._mergeSplitClusters(),
          (this._zoom = Math.round(this._map._zoom)),
          (this._currentShownBounds = this._getExpandedVisibleBounds()))
      },
      _moveEnd: function() {
        if (!this._inZoomAnimation) {
          var a = this._getExpandedVisibleBounds()
          this._topClusterLevel._recursivelyRemoveChildrenFromMap(
            this._currentShownBounds,
            Math.floor(this._map.getMinZoom()),
            this._zoom,
            a,
          ),
            this._topClusterLevel._recursivelyAddChildrenToMap(null, Math.round(this._map._zoom), a),
            (this._currentShownBounds = a)
        }
      },
      _generateInitialClusters: function() {
        var a = Math.ceil(this._map.getMaxZoom()),
          b = Math.floor(this._map.getMinZoom()),
          c = this.options.maxClusterRadius,
          d = c
        'function' != typeof c &&
          (d = function() {
            return c
          }),
          null !== this.options.disableClusteringAtZoom && (a = this.options.disableClusteringAtZoom - 1),
          (this._maxZoom = a),
          (this._gridClusters = {}),
          (this._gridUnclustered = {})
        for (var e = a; e >= b; e--)
          (this._gridClusters[e] = new L.DistanceGrid(d(e))), (this._gridUnclustered[e] = new L.DistanceGrid(d(e)))
        this._topClusterLevel = new this._markerCluster(this, b - 1)
      },
      _addLayer: function(a, b) {
        var c,
          d,
          e = this._gridClusters,
          f = this._gridUnclustered,
          g = Math.floor(this._map.getMinZoom())
        for (
          this.options.singleMarkerMode && this._overrideMarkerIcon(a), a.on(this._childMarkerEventHandlers, this);
          b >= g;
          b--
        ) {
          c = this._map.project(a.getLatLng(), b)
          var h = e[b].getNearObject(c)
          if (h) return h._addChild(a), void (a.__parent = h)
          if ((h = f[b].getNearObject(c))) {
            var i = h.__parent
            i && this._removeLayer(h, !1)
            var j = new this._markerCluster(this, b, h, a)
            e[b].addObject(j, this._map.project(j._cLatLng, b)), (h.__parent = j), (a.__parent = j)
            var k = j
            for (d = b - 1; d > i._zoom; d--)
              (k = new this._markerCluster(this, d, k)), e[d].addObject(k, this._map.project(h.getLatLng(), d))
            return i._addChild(k), void this._removeFromGridUnclustered(h, b)
          }
          f[b].addObject(a, c)
        }
        this._topClusterLevel._addChild(a), (a.__parent = this._topClusterLevel)
      },
      _refreshClustersIcons: function() {
        this._featureGroup.eachLayer(function(a) {
          a instanceof L.MarkerCluster && a._iconNeedsUpdate && a._updateIcon()
        })
      },
      _enqueue: function(a) {
        this._queue.push(a),
          this._queueTimeout || (this._queueTimeout = setTimeout(L.bind(this._processQueue, this), 300))
      },
      _processQueue: function() {
        for (var a = 0; a < this._queue.length; a++) this._queue[a].call(this)
        ;(this._queue.length = 0), clearTimeout(this._queueTimeout), (this._queueTimeout = null)
      },
      _mergeSplitClusters: function() {
        var a = Math.round(this._map._zoom)
        this._processQueue(),
          this._zoom < a && this._currentShownBounds.intersects(this._getExpandedVisibleBounds())
            ? (this._animationStart(),
              this._topClusterLevel._recursivelyRemoveChildrenFromMap(
                this._currentShownBounds,
                Math.floor(this._map.getMinZoom()),
                this._zoom,
                this._getExpandedVisibleBounds(),
              ),
              this._animationZoomIn(this._zoom, a))
            : this._zoom > a
              ? (this._animationStart(), this._animationZoomOut(this._zoom, a))
              : this._moveEnd()
      },
      _getExpandedVisibleBounds: function() {
        return this.options.removeOutsideVisibleBounds
          ? L.Browser.mobile
            ? this._checkBoundsMaxLat(this._map.getBounds())
            : this._checkBoundsMaxLat(this._map.getBounds().pad(1))
          : this._mapBoundsInfinite
      },
      _checkBoundsMaxLat: function(a) {
        var b = this._maxLat
        return (
          void 0 !== b &&
            (a.getNorth() >= b && (a._northEast.lat = 1 / 0), a.getSouth() <= -b && (a._southWest.lat = -1 / 0)),
          a
        )
      },
      _animationAddLayerNonAnimated: function(a, b) {
        if (b === a) this._featureGroup.addLayer(a)
        else if (2 === b._childCount) {
          b._addToMap()
          var c = b.getAllChildMarkers()
          this._featureGroup.removeLayer(c[0]), this._featureGroup.removeLayer(c[1])
        } else b._updateIcon()
      },
      _extractNonGroupLayers: function(a, b) {
        var c,
          d = a.getLayers(),
          e = 0
        for (b = b || []; e < d.length; e++)
          (c = d[e]), c instanceof L.LayerGroup ? this._extractNonGroupLayers(c, b) : b.push(c)
        return b
      },
      _overrideMarkerIcon: function(a) {
        var b = (a.options.icon = this.options.iconCreateFunction({
          getChildCount: function() {
            return 1
          },
          getAllChildMarkers: function() {
            return [a]
          },
        }))
        return b
      },
    }))
    L.MarkerClusterGroup.include({
      _mapBoundsInfinite: new L.LatLngBounds(new L.LatLng(-1 / 0, -1 / 0), new L.LatLng(1 / 0, 1 / 0)),
    }),
      L.MarkerClusterGroup.include({
        _noAnimation: {
          _animationStart: function() {},
          _animationZoomIn: function(a, b) {
            this._topClusterLevel._recursivelyRemoveChildrenFromMap(
              this._currentShownBounds,
              Math.floor(this._map.getMinZoom()),
              a,
            ),
              this._topClusterLevel._recursivelyAddChildrenToMap(null, b, this._getExpandedVisibleBounds()),
              this.fire('animationend')
          },
          _animationZoomOut: function(a, b) {
            this._topClusterLevel._recursivelyRemoveChildrenFromMap(
              this._currentShownBounds,
              Math.floor(this._map.getMinZoom()),
              a,
            ),
              this._topClusterLevel._recursivelyAddChildrenToMap(null, b, this._getExpandedVisibleBounds()),
              this.fire('animationend')
          },
          _animationAddLayer: function(a, b) {
            this._animationAddLayerNonAnimated(a, b)
          },
        },
        _withAnimation: {
          _animationStart: function() {
            ;(this._map._mapPane.className += ' leaflet-cluster-anim'), this._inZoomAnimation++
          },
          _animationZoomIn: function(a, b) {
            var c,
              d = this._getExpandedVisibleBounds(),
              e = this._featureGroup,
              f = Math.floor(this._map.getMinZoom())
            ;(this._ignoreMove = !0),
              this._topClusterLevel._recursively(d, a, f, function(f) {
                var g,
                  h = f._latlng,
                  i = f._markers
                for (
                  d.contains(h) || (h = null),
                    f._isSingleParent() && a + 1 === b
                      ? (e.removeLayer(f), f._recursivelyAddChildrenToMap(null, b, d))
                      : (f.clusterHide(), f._recursivelyAddChildrenToMap(h, b, d)),
                    c = i.length - 1;
                  c >= 0;
                  c--
                )
                  (g = i[c]), d.contains(g._latlng) || e.removeLayer(g)
              }),
              this._forceLayout(),
              this._topClusterLevel._recursivelyBecomeVisible(d, b),
              e.eachLayer(function(a) {
                a instanceof L.MarkerCluster || !a._icon || a.clusterShow()
              }),
              this._topClusterLevel._recursively(d, a, b, function(a) {
                a._recursivelyRestoreChildPositions(b)
              }),
              (this._ignoreMove = !1),
              this._enqueue(function() {
                this._topClusterLevel._recursively(d, a, f, function(a) {
                  e.removeLayer(a), a.clusterShow()
                }),
                  this._animationEnd()
              })
          },
          _animationZoomOut: function(a, b) {
            this._animationZoomOutSingle(this._topClusterLevel, a - 1, b),
              this._topClusterLevel._recursivelyAddChildrenToMap(null, b, this._getExpandedVisibleBounds()),
              this._topClusterLevel._recursivelyRemoveChildrenFromMap(
                this._currentShownBounds,
                Math.floor(this._map.getMinZoom()),
                a,
                this._getExpandedVisibleBounds(),
              )
          },
          _animationAddLayer: function(a, b) {
            var c = this,
              d = this._featureGroup
            d.addLayer(a),
              b !== a &&
                (b._childCount > 2
                  ? (b._updateIcon(),
                    this._forceLayout(),
                    this._animationStart(),
                    a._setPos(this._map.latLngToLayerPoint(b.getLatLng())),
                    a.clusterHide(),
                    this._enqueue(function() {
                      d.removeLayer(a), a.clusterShow(), c._animationEnd()
                    }))
                  : (this._forceLayout(),
                    c._animationStart(),
                    c._animationZoomOutSingle(b, this._map.getMaxZoom(), this._zoom)))
          },
        },
        _animationZoomOutSingle: function(a, b, c) {
          var d = this._getExpandedVisibleBounds(),
            e = Math.floor(this._map.getMinZoom())
          a._recursivelyAnimateChildrenInAndAddSelfToMap(d, e, b + 1, c)
          var f = this
          this._forceLayout(),
            a._recursivelyBecomeVisible(d, c),
            this._enqueue(function() {
              if (1 === a._childCount) {
                var g = a._markers[0]
                ;(this._ignoreMove = !0),
                  g.setLatLng(g.getLatLng()),
                  (this._ignoreMove = !1),
                  g.clusterShow && g.clusterShow()
              } else
                a._recursively(d, c, e, function(a) {
                  a._recursivelyRemoveChildrenFromMap(d, e, b + 1)
                })
              f._animationEnd()
            })
        },
        _animationEnd: function() {
          this._map &&
            (this._map._mapPane.className = this._map._mapPane.className.replace(' leaflet-cluster-anim', '')),
            this._inZoomAnimation--,
            this.fire('animationend')
        },
        _forceLayout: function() {
          L.Util.falseFn(document.body.offsetWidth)
        },
      }),
      (L.markerClusterGroup = function(a) {
        return new L.MarkerClusterGroup(a)
      })
    var c = (L.MarkerCluster = L.Marker.extend({
      options: L.Icon.prototype.options,
      initialize: function(a, b, c, d) {
        L.Marker.prototype.initialize.call(this, c ? c._cLatLng || c.getLatLng() : new L.LatLng(0, 0), {
          icon: this,
          pane: a.options.clusterPane,
        }),
          (this._group = a),
          (this._zoom = b),
          (this._markers = []),
          (this._childClusters = []),
          (this._childCount = 0),
          (this._iconNeedsUpdate = !0),
          (this._boundsNeedUpdate = !0),
          (this._bounds = new L.LatLngBounds()),
          c && this._addChild(c),
          d && this._addChild(d)
      },
      getAllChildMarkers: function(a) {
        a = a || []
        for (var b = this._childClusters.length - 1; b >= 0; b--) this._childClusters[b].getAllChildMarkers(a)
        for (var c = this._markers.length - 1; c >= 0; c--) a.push(this._markers[c])
        return a
      },
      getChildCount: function() {
        return this._childCount
      },
      zoomToBounds: function(a) {
        for (
          var b,
            c = this._childClusters.slice(),
            d = this._group._map,
            e = d.getBoundsZoom(this._bounds),
            f = this._zoom + 1,
            g = d.getZoom();
          c.length > 0 && e > f;

        ) {
          f++
          var h = []
          for (b = 0; b < c.length; b++) h = h.concat(c[b]._childClusters)
          c = h
        }
        e > f
          ? this._group._map.setView(this._latlng, f)
          : g >= e
            ? this._group._map.setView(this._latlng, g + 1)
            : this._group._map.fitBounds(this._bounds, a)
      },
      getBounds: function() {
        var a = new L.LatLngBounds()
        return a.extend(this._bounds), a
      },
      _updateIcon: function() {
        ;(this._iconNeedsUpdate = !0), this._icon && this.setIcon(this)
      },
      createIcon: function() {
        return (
          this._iconNeedsUpdate &&
            ((this._iconObj = this._group.options.iconCreateFunction(this)), (this._iconNeedsUpdate = !1)),
          this._iconObj.createIcon()
        )
      },
      createShadow: function() {
        return this._iconObj.createShadow()
      },
      _addChild: function(a, b) {
        ;(this._iconNeedsUpdate = !0),
          (this._boundsNeedUpdate = !0),
          this._setClusterCenter(a),
          a instanceof L.MarkerCluster
            ? (b || (this._childClusters.push(a), (a.__parent = this)), (this._childCount += a._childCount))
            : (b || this._markers.push(a), this._childCount++),
          this.__parent && this.__parent._addChild(a, !0)
      },
      _setClusterCenter: function(a) {
        this._cLatLng || (this._cLatLng = a._cLatLng || a._latlng)
      },
      _resetBounds: function() {
        var a = this._bounds
        a._southWest && ((a._southWest.lat = 1 / 0), (a._southWest.lng = 1 / 0)),
          a._northEast && ((a._northEast.lat = -1 / 0), (a._northEast.lng = -1 / 0))
      },
      _recalculateBounds: function() {
        var a,
          b,
          c,
          d,
          e = this._markers,
          f = this._childClusters,
          g = 0,
          h = 0,
          i = this._childCount
        if (0 !== i) {
          for (this._resetBounds(), a = 0; a < e.length; a++)
            (c = e[a]._latlng), this._bounds.extend(c), (g += c.lat), (h += c.lng)
          for (a = 0; a < f.length; a++)
            (b = f[a]),
              b._boundsNeedUpdate && b._recalculateBounds(),
              this._bounds.extend(b._bounds),
              (c = b._wLatLng),
              (d = b._childCount),
              (g += c.lat * d),
              (h += c.lng * d)
          ;(this._latlng = this._wLatLng = new L.LatLng(g / i, h / i)), (this._boundsNeedUpdate = !1)
        }
      },
      _addToMap: function(a) {
        a && ((this._backupLatlng = this._latlng), this.setLatLng(a)), this._group._featureGroup.addLayer(this)
      },
      _recursivelyAnimateChildrenIn: function(a, b, c) {
        this._recursively(
          a,
          this._group._map.getMinZoom(),
          c - 1,
          function(a) {
            var c,
              d,
              e = a._markers
            for (c = e.length - 1; c >= 0; c--) (d = e[c]), d._icon && (d._setPos(b), d.clusterHide())
          },
          function(a) {
            var c,
              d,
              e = a._childClusters
            for (c = e.length - 1; c >= 0; c--) (d = e[c]), d._icon && (d._setPos(b), d.clusterHide())
          },
        )
      },
      _recursivelyAnimateChildrenInAndAddSelfToMap: function(a, b, c, d) {
        this._recursively(a, d, b, function(e) {
          e._recursivelyAnimateChildrenIn(a, e._group._map.latLngToLayerPoint(e.getLatLng()).round(), c),
            e._isSingleParent() && c - 1 === d
              ? (e.clusterShow(), e._recursivelyRemoveChildrenFromMap(a, b, c))
              : e.clusterHide(),
            e._addToMap()
        })
      },
      _recursivelyBecomeVisible: function(a, b) {
        this._recursively(a, this._group._map.getMinZoom(), b, null, function(a) {
          a.clusterShow()
        })
      },
      _recursivelyAddChildrenToMap: function(a, b, c) {
        this._recursively(
          c,
          this._group._map.getMinZoom() - 1,
          b,
          function(d) {
            if (b !== d._zoom)
              for (var e = d._markers.length - 1; e >= 0; e--) {
                var f = d._markers[e]
                c.contains(f._latlng) &&
                  (a && ((f._backupLatlng = f.getLatLng()), f.setLatLng(a), f.clusterHide && f.clusterHide()),
                  d._group._featureGroup.addLayer(f))
              }
          },
          function(b) {
            b._addToMap(a)
          },
        )
      },
      _recursivelyRestoreChildPositions: function(a) {
        for (var b = this._markers.length - 1; b >= 0; b--) {
          var c = this._markers[b]
          c._backupLatlng && (c.setLatLng(c._backupLatlng), delete c._backupLatlng)
        }
        if (a - 1 === this._zoom)
          for (var d = this._childClusters.length - 1; d >= 0; d--) this._childClusters[d]._restorePosition()
        else
          for (var e = this._childClusters.length - 1; e >= 0; e--)
            this._childClusters[e]._recursivelyRestoreChildPositions(a)
      },
      _restorePosition: function() {
        this._backupLatlng && (this.setLatLng(this._backupLatlng), delete this._backupLatlng)
      },
      _recursivelyRemoveChildrenFromMap: function(a, b, c, d) {
        var e, f
        this._recursively(
          a,
          b - 1,
          c - 1,
          function(a) {
            for (f = a._markers.length - 1; f >= 0; f--)
              (e = a._markers[f]),
                (d && d.contains(e._latlng)) ||
                  (a._group._featureGroup.removeLayer(e), e.clusterShow && e.clusterShow())
          },
          function(a) {
            for (f = a._childClusters.length - 1; f >= 0; f--)
              (e = a._childClusters[f]),
                (d && d.contains(e._latlng)) ||
                  (a._group._featureGroup.removeLayer(e), e.clusterShow && e.clusterShow())
          },
        )
      },
      _recursively: function(a, b, c, d, e) {
        var f,
          g,
          h = this._childClusters,
          i = this._zoom
        if ((i >= b && (d && d(this), e && i === c && e(this)), b > i || c > i))
          for (f = h.length - 1; f >= 0; f--) (g = h[f]), a.intersects(g._bounds) && g._recursively(a, b, c, d, e)
      },
      _isSingleParent: function() {
        return this._childClusters.length > 0 && this._childClusters[0]._childCount === this._childCount
      },
    }))
    L.Marker.include({
      clusterHide: function() {
        return (this.options.opacityWhenUnclustered = this.options.opacity || 1), this.setOpacity(0)
      },
      clusterShow: function() {
        var a = this.setOpacity(this.options.opacity || this.options.opacityWhenUnclustered)
        return delete this.options.opacityWhenUnclustered, a
      },
    }),
      (L.DistanceGrid = function(a) {
        ;(this._cellSize = a), (this._sqCellSize = a * a), (this._grid = {}), (this._objectPoint = {})
      }),
      (L.DistanceGrid.prototype = {
        addObject: function(a, b) {
          var c = this._getCoord(b.x),
            d = this._getCoord(b.y),
            e = this._grid,
            f = (e[d] = e[d] || {}),
            g = (f[c] = f[c] || []),
            h = L.Util.stamp(a)
          ;(this._objectPoint[h] = b), g.push(a)
        },
        updateObject: function(a, b) {
          this.removeObject(a), this.addObject(a, b)
        },
        removeObject: function(a, b) {
          var c,
            d,
            e = this._getCoord(b.x),
            f = this._getCoord(b.y),
            g = this._grid,
            h = (g[f] = g[f] || {}),
            i = (h[e] = h[e] || [])
          for (delete this._objectPoint[L.Util.stamp(a)], c = 0, d = i.length; d > c; c++)
            if (i[c] === a) return i.splice(c, 1), 1 === d && delete h[e], !0
        },
        eachObject: function(a, b) {
          var c,
            d,
            e,
            f,
            g,
            h,
            i,
            j = this._grid
          for (c in j) {
            g = j[c]
            for (d in g) for (h = g[d], e = 0, f = h.length; f > e; e++) (i = a.call(b, h[e])), i && (e--, f--)
          }
        },
        getNearObject: function(a) {
          var b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j = this._getCoord(a.x),
            k = this._getCoord(a.y),
            l = this._objectPoint,
            m = this._sqCellSize,
            n = null
          for (b = k - 1; k + 1 >= b; b++)
            if ((e = this._grid[b]))
              for (c = j - 1; j + 1 >= c; c++)
                if ((f = e[c]))
                  for (d = 0, g = f.length; g > d; d++)
                    (h = f[d]),
                      (i = this._sqDist(l[L.Util.stamp(h)], a)),
                      (m > i || (m >= i && null === n)) && ((m = i), (n = h))
          return n
        },
        _getCoord: function(a) {
          var b = Math.floor(a / this._cellSize)
          return isFinite(b) ? b : a
        },
        _sqDist: function(a, b) {
          var c = b.x - a.x,
            d = b.y - a.y
          return c * c + d * d
        },
      }),
      (function() {
        L.QuickHull = {
          getDistant: function(a, b) {
            var c = b[1].lat - b[0].lat,
              d = b[0].lng - b[1].lng
            return d * (a.lat - b[0].lat) + c * (a.lng - b[0].lng)
          },
          findMostDistantPointFromBaseLine: function(a, b) {
            var c,
              d,
              e,
              f = 0,
              g = null,
              h = []
            for (c = b.length - 1; c >= 0; c--)
              (d = b[c]), (e = this.getDistant(d, a)), e > 0 && (h.push(d), e > f && ((f = e), (g = d)))
            return {
              maxPoint: g,
              newPoints: h,
            }
          },
          buildConvexHull: function(a, b) {
            var c = [],
              d = this.findMostDistantPointFromBaseLine(a, b)
            return d.maxPoint
              ? ((c = c.concat(this.buildConvexHull([a[0], d.maxPoint], d.newPoints))),
                (c = c.concat(this.buildConvexHull([d.maxPoint, a[1]], d.newPoints))))
              : [a[0]]
          },
          getConvexHull: function(a) {
            var b,
              c = !1,
              d = !1,
              e = !1,
              f = !1,
              g = null,
              h = null,
              i = null,
              j = null,
              k = null,
              l = null
            for (b = a.length - 1; b >= 0; b--) {
              var m = a[b]
              ;(c === !1 || m.lat > c) && ((g = m), (c = m.lat)),
                (d === !1 || m.lat < d) && ((h = m), (d = m.lat)),
                (e === !1 || m.lng > e) && ((i = m), (e = m.lng)),
                (f === !1 || m.lng < f) && ((j = m), (f = m.lng))
            }
            d !== c ? ((l = h), (k = g)) : ((l = j), (k = i))
            var n = [].concat(this.buildConvexHull([l, k], a), this.buildConvexHull([k, l], a))
            return n
          },
        }
      })(),
      L.MarkerCluster.include({
        getConvexHull: function() {
          var a,
            b,
            c = this.getAllChildMarkers(),
            d = []
          for (b = c.length - 1; b >= 0; b--) (a = c[b].getLatLng()), d.push(a)
          return L.QuickHull.getConvexHull(d)
        },
      }),
      L.MarkerCluster.include({
        _2PI: 2 * Math.PI,
        _circleFootSeparation: 25,
        _circleStartAngle: 0,
        _spiralFootSeparation: 28,
        _spiralLengthStart: 11,
        _spiralLengthFactor: 5,
        _circleSpiralSwitchover: 9,
        spiderfy: function() {
          if (this._group._spiderfied !== this && !this._group._inZoomAnimation) {
            var a,
              b = this.getAllChildMarkers(),
              c = this._group,
              d = c._map,
              e = d.latLngToLayerPoint(this._latlng)
            this._group._unspiderfy(),
              (this._group._spiderfied = this),
              b.length >= this._circleSpiralSwitchover
                ? (a = this._generatePointsSpiral(b.length, e))
                : ((e.y += 10), (a = this._generatePointsCircle(b.length, e))),
              this._animationSpiderfy(b, a)
          }
        },
        unspiderfy: function(a) {
          this._group._inZoomAnimation || (this._animationUnspiderfy(a), (this._group._spiderfied = null))
        },
        _generatePointsCircle: function(a, b) {
          var c,
            d,
            e = this._group.options.spiderfyDistanceMultiplier * this._circleFootSeparation * (2 + a),
            f = e / this._2PI,
            g = this._2PI / a,
            h = []
          for (f = Math.max(f, 35), h.length = a, c = 0; a > c; c++)
            (d = this._circleStartAngle + c * g),
              (h[c] = new L.Point(b.x + f * Math.cos(d), b.y + f * Math.sin(d))._round())
          return h
        },
        _generatePointsSpiral: function(a, b) {
          var c,
            d = this._group.options.spiderfyDistanceMultiplier,
            e = d * this._spiralLengthStart,
            f = d * this._spiralFootSeparation,
            g = d * this._spiralLengthFactor * this._2PI,
            h = 0,
            i = []
          for (i.length = a, c = a; c >= 0; c--)
            a > c && (i[c] = new L.Point(b.x + e * Math.cos(h), b.y + e * Math.sin(h))._round()),
              (h += f / e + 5e-4 * c),
              (e += g / h)
          return i
        },
        _noanimationUnspiderfy: function() {
          var a,
            b,
            c = this._group,
            d = c._map,
            e = c._featureGroup,
            f = this.getAllChildMarkers()
          for (c._ignoreMove = !0, this.setOpacity(1), b = f.length - 1; b >= 0; b--)
            (a = f[b]),
              e.removeLayer(a),
              a._preSpiderfyLatlng && (a.setLatLng(a._preSpiderfyLatlng), delete a._preSpiderfyLatlng),
              a.setZIndexOffset && a.setZIndexOffset(0),
              a._spiderLeg && (d.removeLayer(a._spiderLeg), delete a._spiderLeg)
          c.fire('unspiderfied', {
            cluster: this,
            markers: f,
          }),
            (c._ignoreMove = !1),
            (c._spiderfied = null)
        },
      }),
      (L.MarkerClusterNonAnimated = L.MarkerCluster.extend({
        _animationSpiderfy: function(a, b) {
          var c,
            d,
            e,
            f,
            g = this._group,
            h = g._map,
            i = g._featureGroup,
            j = this._group.options.spiderLegPolylineOptions
          for (g._ignoreMove = !0, c = 0; c < a.length; c++)
            (f = h.layerPointToLatLng(b[c])),
              (d = a[c]),
              (e = new L.Polyline([this._latlng, f], j)),
              h.addLayer(e),
              (d._spiderLeg = e),
              (d._preSpiderfyLatlng = d._latlng),
              d.setLatLng(f),
              d.setZIndexOffset && d.setZIndexOffset(1e6),
              i.addLayer(d)
          this.setOpacity(0.3),
            (g._ignoreMove = !1),
            g.fire('spiderfied', {
              cluster: this,
              markers: a,
            })
        },
        _animationUnspiderfy: function() {
          this._noanimationUnspiderfy()
        },
      })),
      L.MarkerCluster.include({
        _animationSpiderfy: function(a, b) {
          var c,
            d,
            e,
            f,
            g,
            h,
            i = this,
            j = this._group,
            k = j._map,
            l = j._featureGroup,
            m = this._latlng,
            n = k.latLngToLayerPoint(m),
            o = L.Path.SVG,
            p = L.extend({}, this._group.options.spiderLegPolylineOptions),
            q = p.opacity
          for (
            void 0 === q && (q = L.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity),
              o
                ? ((p.opacity = 0), (p.className = (p.className || '') + ' leaflet-cluster-spider-leg'))
                : (p.opacity = q),
              j._ignoreMove = !0,
              c = 0;
            c < a.length;
            c++
          )
            (d = a[c]),
              (h = k.layerPointToLatLng(b[c])),
              (e = new L.Polyline([m, h], p)),
              k.addLayer(e),
              (d._spiderLeg = e),
              o &&
                ((f = e._path),
                (g = f.getTotalLength() + 0.1),
                (f.style.strokeDasharray = g),
                (f.style.strokeDashoffset = g)),
              d.setZIndexOffset && d.setZIndexOffset(1e6),
              d.clusterHide && d.clusterHide(),
              l.addLayer(d),
              d._setPos && d._setPos(n)
          for (j._forceLayout(), j._animationStart(), c = a.length - 1; c >= 0; c--)
            (h = k.layerPointToLatLng(b[c])),
              (d = a[c]),
              (d._preSpiderfyLatlng = d._latlng),
              d.setLatLng(h),
              d.clusterShow && d.clusterShow(),
              o &&
                ((e = d._spiderLeg),
                (f = e._path),
                (f.style.strokeDashoffset = 0),
                e.setStyle({
                  opacity: q,
                }))
          this.setOpacity(0.3),
            (j._ignoreMove = !1),
            setTimeout(function() {
              j._animationEnd(),
                j.fire('spiderfied', {
                  cluster: i,
                  markers: a,
                })
            }, 200)
        },
        _animationUnspiderfy: function(a) {
          var b,
            c,
            d,
            e,
            f,
            g,
            h = this,
            i = this._group,
            j = i._map,
            k = i._featureGroup,
            l = a ? j._latLngToNewLayerPoint(this._latlng, a.zoom, a.center) : j.latLngToLayerPoint(this._latlng),
            m = this.getAllChildMarkers(),
            n = L.Path.SVG
          for (i._ignoreMove = !0, i._animationStart(), this.setOpacity(1), c = m.length - 1; c >= 0; c--)
            (b = m[c]),
              b._preSpiderfyLatlng &&
                (b.closePopup(),
                b.setLatLng(b._preSpiderfyLatlng),
                delete b._preSpiderfyLatlng,
                (g = !0),
                b._setPos && (b._setPos(l), (g = !1)),
                b.clusterHide && (b.clusterHide(), (g = !1)),
                g && k.removeLayer(b),
                n &&
                  ((d = b._spiderLeg),
                  (e = d._path),
                  (f = e.getTotalLength() + 0.1),
                  (e.style.strokeDashoffset = f),
                  d.setStyle({
                    opacity: 0,
                  })))
          ;(i._ignoreMove = !1),
            setTimeout(function() {
              var a = 0
              for (c = m.length - 1; c >= 0; c--) (b = m[c]), b._spiderLeg && a++
              for (c = m.length - 1; c >= 0; c--)
                (b = m[c]),
                  b._spiderLeg &&
                    (b.clusterShow && b.clusterShow(),
                    b.setZIndexOffset && b.setZIndexOffset(0),
                    a > 1 && k.removeLayer(b),
                    j.removeLayer(b._spiderLeg),
                    delete b._spiderLeg)
              i._animationEnd(),
                i.fire('unspiderfied', {
                  cluster: h,
                  markers: m,
                })
            }, 200)
        },
      }),
      L.MarkerClusterGroup.include({
        _spiderfied: null,
        unspiderfy: function() {
          this._unspiderfy.apply(this, arguments)
        },
        _spiderfierOnAdd: function() {
          this._map.on('click', this._unspiderfyWrapper, this),
            this._map.options.zoomAnimation && this._map.on('zoomstart', this._unspiderfyZoomStart, this),
            this._map.on('zoomend', this._noanimationUnspiderfy, this),
            L.Browser.touch || this._map.getRenderer(this)
        },
        _spiderfierOnRemove: function() {
          this._map.off('click', this._unspiderfyWrapper, this),
            this._map.off('zoomstart', this._unspiderfyZoomStart, this),
            this._map.off('zoomanim', this._unspiderfyZoomAnim, this),
            this._map.off('zoomend', this._noanimationUnspiderfy, this),
            this._noanimationUnspiderfy()
        },
        _unspiderfyZoomStart: function() {
          this._map && this._map.on('zoomanim', this._unspiderfyZoomAnim, this)
        },
        _unspiderfyZoomAnim: function(a) {
          L.DomUtil.hasClass(this._map._mapPane, 'leaflet-touching') ||
            (this._map.off('zoomanim', this._unspiderfyZoomAnim, this), this._unspiderfy(a))
        },
        _unspiderfyWrapper: function() {
          this._unspiderfy()
        },
        _unspiderfy: function(a) {
          this._spiderfied && this._spiderfied.unspiderfy(a)
        },
        _noanimationUnspiderfy: function() {
          this._spiderfied && this._spiderfied._noanimationUnspiderfy()
        },
        _unspiderfyLayer: function(a) {
          a._spiderLeg &&
            (this._featureGroup.removeLayer(a),
            a.clusterShow && a.clusterShow(),
            a.setZIndexOffset && a.setZIndexOffset(0),
            this._map.removeLayer(a._spiderLeg),
            delete a._spiderLeg)
        },
      }),
      L.MarkerClusterGroup.include({
        refreshClusters: function(a) {
          return (
            a
              ? a instanceof L.MarkerClusterGroup
                ? (a = a._topClusterLevel.getAllChildMarkers())
                : a instanceof L.LayerGroup
                  ? (a = a._layers)
                  : a instanceof L.MarkerCluster
                    ? (a = a.getAllChildMarkers())
                    : a instanceof L.Marker && (a = [a])
              : (a = this._topClusterLevel.getAllChildMarkers()),
            this._flagParentsIconsNeedUpdate(a),
            this._refreshClustersIcons(),
            this.options.singleMarkerMode && this._refreshSingleMarkerModeMarkers(a),
            this
          )
        },
        _flagParentsIconsNeedUpdate: function(a) {
          var b, c
          for (b in a) for (c = a[b].__parent; c; ) (c._iconNeedsUpdate = !0), (c = c.__parent)
        },
        _refreshSingleMarkerModeMarkers: function(a) {
          var b, c
          for (b in a) (c = a[b]), this.hasLayer(c) && c.setIcon(this._overrideMarkerIcon(c))
        },
      }),
      L.Marker.include({
        refreshIconOptions: function(a, b) {
          var c = this.options.icon
          return (
            L.setOptions(c, a), this.setIcon(c), b && this.__parent && this.__parent._group.refreshClusters(this), this
          )
        },
      }),
      (a.MarkerClusterGroup = b),
      (a.MarkerCluster = c)
  }),
  (function(a) {
    if ('function' == typeof require && 'object' == typeof exports && 'object' == typeof module) {
      try {
        var b = require('jquery')
      } catch (a) {}
      module.exports = a(b)
    } else if ('function' == typeof define && define.amd)
      define(['jquery'], function(b) {
        return a(b)
      })
    else {
      var c
      try {
        c = (0, eval)('this')
      } catch (a) {
        c = window
      }
      c.deparam = a(c.jQuery)
    }
  })(function(a) {
    var b = function(a, b) {
      var c = {},
        d = {
          true: !0,
          false: !1,
          null: null,
        }
      return (
        a
          .replace(/\+/g, ' ')
          .split('&')
          .forEach(function(a) {
            var e,
              f = a.split('='),
              g = decodeURIComponent(f[0]),
              h = c,
              i = 0,
              j = g.split(']['),
              k = j.length - 1
            if (
              (/\[/.test(j[0]) && /\]$/.test(j[k])
                ? ((j[k] = j[k].replace(/\]$/, '')),
                  (j = j
                    .shift()
                    .split('[')
                    .concat(j)),
                  (k = j.length - 1))
                : (k = 0),
              2 === f.length)
            )
              if (
                ((e = decodeURIComponent(f[1])),
                b &&
                  (e = e && !isNaN(e) && +e + '' === e ? +e : 'undefined' === e ? void 0 : void 0 !== d[e] ? d[e] : e),
                k)
              )
                for (; i <= k; i++)
                  (g = '' === j[i] ? h.length : j[i]),
                    (h = h[g] = i < k ? h[g] || (j[i + 1] && isNaN(j[i + 1]) ? {} : []) : e)
              else
                '[object Array]' === Object.prototype.toString.call(c[g])
                  ? c[g].push(e)
                  : {}.hasOwnProperty.call(c, g)
                    ? (c[g] = [c[g], e])
                    : (c[g] = e)
            else g && (c[g] = b ? void 0 : '')
          }),
        c
      )
    }
    return a && (a.prototype.deparam = a.deparam = b), b
  }),
  function() {
    function a(a) {
      this._value = a
    }

    function b(a, b, c, d) {
      var e,
        f,
        g,
        h,
        i = a.toString().split('.'),
        j = b - (d || 0)
      return (
        (e = 2 === i.length ? Math.min(Math.max(i[1].length, j), b) : j),
        (g = Math.pow(10, e)),
        (h = (c(a * g) / g).toFixed(e)),
        d > b - e && ((f = new RegExp('\\.?0{1,' + (d - (b - e)) + '}$')), (h = h.replace(f, ''))),
        h
      )
    }

    function c(a, b, c) {
      var j
      return (j =
        0 === a._value && null !== s.zeroFormat
          ? s.zeroFormat
          : null === a._value && null !== s.nullFormat
            ? s.nullFormat
            : b.indexOf('$') > -1
              ? d(a, b, c)
              : b.indexOf('%') > -1
                ? e(a, b, c)
                : b.indexOf(':') > -1
                  ? h(a, b)
                  : b.indexOf('b') > -1 || b.indexOf('ib') > -1
                    ? f(a, b, c)
                    : b.indexOf('o') > -1
                      ? g(a, b, c)
                      : i(a._value, b, c))
    }

    function d(a, b, c) {
      var d,
        e,
        f = b.indexOf('$'),
        g = b.indexOf('('),
        h = b.indexOf('-'),
        j = ''
      return (
        b.indexOf(' $') > -1
          ? ((j = ' '), (b = b.replace(' $', '')))
          : b.indexOf('$ ') > -1
            ? ((j = ' '), (b = b.replace('$ ', '')))
            : (b = b.replace('$', '')),
        (e = i(a._value, b, c, !1)),
        f <= 1
          ? e.indexOf('(') > -1 || e.indexOf('-') > -1
            ? ((e = e.split('')),
              (d = 1),
              (f < g || f < h) && (d = 0),
              e.splice(d, 0, q[s.currentLanguage].currency.symbol + j),
              (e = e.join('')))
            : (e = q[s.currentLanguage].currency.symbol + j + e)
          : e.indexOf(')') > -1
            ? ((e = e.split('')), e.splice(-1, 0, j + q[s.currentLanguage].currency.symbol), (e = e.join('')))
            : (e = e + j + q[s.currentLanguage].currency.symbol),
        e
      )
    }

    function e(a, b, c) {
      var d,
        e = '',
        f = 100 * a._value
      return (
        b.indexOf(' %') > -1 ? ((e = ' '), (b = b.replace(' %', ''))) : (b = b.replace('%', '')),
        (d = i(f, b, c)),
        d.indexOf(')') > -1 ? ((d = d.split('')), d.splice(-1, 0, e + '%'), (d = d.join(''))) : (d = d + e + '%'),
        d
      )
    }

    function f(a, b, c) {
      var d,
        e,
        f,
        g,
        h = b.indexOf('ib') > -1 ? t.iec : t.bytes,
        j = a._value,
        k = ''
      for (
        b.indexOf(' b') > -1 || b.indexOf(' ib') > -1
          ? ((k = ' '), (b = b.replace(' ib', '').replace(' b', '')))
          : (b = b.replace('ib', '').replace('b', '')),
          e = 0;
        e <= h.length;
        e++
      )
        if (((f = Math.pow(1024, e)), (g = Math.pow(1024, e + 1)), null === j || 0 === j || (j >= f && j < g))) {
          ;(k += h[e]), f > 0 && (j /= f)
          break
        }
      return (d = i(j, b, c)), d + k
    }

    function g(a, b, c) {
      var d,
        e = ''
      return (
        b.indexOf(' o') > -1 ? ((e = ' '), (b = b.replace(' o', ''))) : (b = b.replace('o', '')),
        (e += q[s.currentLanguage].ordinal(a._value)),
        (d = i(a._value, b, c)),
        d + e
      )
    }

    function h(a) {
      var b = Math.floor(a._value / 60 / 60),
        c = Math.floor((a._value - 60 * b * 60) / 60),
        d = Math.round(a._value - 60 * b * 60 - 60 * c)
      return b + ':' + (c < 10 ? '0' + c : c) + ':' + (d < 10 ? '0' + d : d)
    }

    function i(a, c, d) {
      var e,
        f,
        g,
        h,
        i = !1,
        j = !1,
        k = !1,
        l = '',
        m = !1,
        n = !1,
        o = !1,
        p = !1,
        r = !1,
        t = '',
        u = !1
      return (
        null === a && (a = 0),
        (e = Math.abs(a)),
        c.indexOf('(') > -1
          ? ((i = !0), (c = c.slice(1, -1)))
          : c.indexOf('+') > -1 && ((j = !0), (c = c.replace(/\+/g, ''))),
        c.indexOf('a') > -1 &&
          ((m = c.indexOf('aK') >= 0),
          (n = c.indexOf('aM') >= 0),
          (o = c.indexOf('aB') >= 0),
          (p = c.indexOf('aT') >= 0),
          (r = m || n || o || p),
          c.indexOf(' a') > -1 && (l = ' '),
          (c = c.replace(new RegExp(l + 'a[KMBT]?'), '')),
          (e >= Math.pow(10, 12) && !r) || p
            ? ((l += q[s.currentLanguage].abbreviations.trillion), (a /= Math.pow(10, 12)))
            : (e < Math.pow(10, 12) && e >= Math.pow(10, 9) && !r) || o
              ? ((l += q[s.currentLanguage].abbreviations.billion), (a /= Math.pow(10, 9)))
              : (e < Math.pow(10, 9) && e >= Math.pow(10, 6) && !r) || n
                ? ((l += q[s.currentLanguage].abbreviations.million), (a /= Math.pow(10, 6)))
                : ((e < Math.pow(10, 6) && e >= Math.pow(10, 3) && !r) || m) &&
                  ((l += q[s.currentLanguage].abbreviations.thousand), (a /= Math.pow(10, 3)))),
        c.indexOf('[.]') > -1 && ((k = !0), (c = c.replace('[.]', '.'))),
        (f = a.toString().split('.')[0]),
        (g = c.split('.')[1]),
        (h = c.indexOf(',')),
        g
          ? (g.indexOf('[') > -1
              ? ((g = g.replace(']', '')), (g = g.split('[')), (t = b(a, g[0].length + g[1].length, d, g[1].length)))
              : (t = b(a, g.length, d)),
            (f = t.split('.')[0]),
            (t = t.indexOf('.') > -1 ? q[s.currentLanguage].delimiters.decimal + t.split('.')[1] : ''),
            k && 0 === Number(t.slice(1)) && (t = ''))
          : (f = b(a, null, d)),
        f.indexOf('-') > -1 && ((f = f.slice(1)), (u = !0)),
        h > -1 &&
          (f = f.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + q[s.currentLanguage].delimiters.thousands)),
        0 === c.indexOf('.') && (f = ''),
        (i && u ? '(' : '') + (!i && u ? '-' : '') + (!u && j ? '+' : '') + f + t + (l ? l : '') + (i && u ? ')' : '')
      )
    }

    function j(a, b) {
      var c,
        d,
        e,
        f,
        g,
        h,
        i = b,
        j = !1
      if (b.indexOf(':') > -1) h = k(b)
      else if (b === s.zeroFormat || b === s.nullFormat) h = 0
      else {
        for (
          '.' !== q[s.currentLanguage].delimiters.decimal &&
            (b = b.replace(/\./g, '').replace(q[s.currentLanguage].delimiters.decimal, '.')),
            c = new RegExp(
              '[^a-zA-Z]' +
                q[s.currentLanguage].abbreviations.thousand +
                '(?:\\)|(\\' +
                q[s.currentLanguage].currency.symbol +
                ')?(?:\\))?)?$',
            ),
            d = new RegExp(
              '[^a-zA-Z]' +
                q[s.currentLanguage].abbreviations.million +
                '(?:\\)|(\\' +
                q[s.currentLanguage].currency.symbol +
                ')?(?:\\))?)?$',
            ),
            e = new RegExp(
              '[^a-zA-Z]' +
                q[s.currentLanguage].abbreviations.billion +
                '(?:\\)|(\\' +
                q[s.currentLanguage].currency.symbol +
                ')?(?:\\))?)?$',
            ),
            f = new RegExp(
              '[^a-zA-Z]' +
                q[s.currentLanguage].abbreviations.trillion +
                '(?:\\)|(\\' +
                q[s.currentLanguage].currency.symbol +
                ')?(?:\\))?)?$',
            ),
            g = 1;
          g <= t.bytes.length && !(j = (b.indexOf(t.bytes[g]) > -1 || b.indexOf(t.iec[g]) > -1) && Math.pow(1024, g));
          g++
        );
        ;(h = j ? j : 1),
          (h *= i.match(c) ? Math.pow(10, 3) : 1),
          (h *= i.match(d) ? Math.pow(10, 6) : 1),
          (h *= i.match(e) ? Math.pow(10, 9) : 1),
          (h *= i.match(f) ? Math.pow(10, 12) : 1),
          (h *= b.indexOf('%') > -1 ? 0.01 : 1),
          (h *= (b.split('-').length + Math.min(b.split('(').length - 1, b.split(')').length - 1)) % 2 ? 1 : -1),
          (h *= Number(b.replace(/[^0-9\.]+/g, ''))),
          (h = j ? Math.ceil(h) : h)
      }
      return (a._value = h), a._value
    }

    function k(a) {
      var b = a.split(':'),
        c = 0
      return (
        3 === b.length
          ? ((c += 60 * Number(b[0]) * 60), (c += 60 * Number(b[1])), (c += Number(b[2])))
          : 2 === b.length && ((c += 60 * Number(b[0])), (c += Number(b[1]))),
        Number(c)
      )
    }

    function l(a, b) {
      q[a] = b
    }

    function m(a) {
      var b = a.toString().split('.')
      return b.length < 2 ? 1 : Math.pow(10, b[1].length)
    }

    function n() {
      var a = Array.prototype.slice.call(arguments)
      return a.reduce(function(a, b) {
        var c = m(a),
          d = m(b)
        return c > d ? c : d
      }, -(1 / 0))
    }
    var o,
      p = '1.5.6',
      q = {},
      r = {
        currentLanguage: 'en',
        zeroFormat: null,
        nullFormat: null,
        defaultFormat: '0,0',
      },
      s = {
        currentLanguage: r.currentLanguage,
        zeroFormat: r.zeroFormat,
        nullFormat: r.nullFormat,
        defaultFormat: r.defaultFormat,
      },
      t = {
        bytes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        iec: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
      }
    ;(o = function(b) {
      return (
        (b = o.isNumeral(b)
          ? b.value()
          : 0 === b || 'undefined' == typeof b
            ? 0
            : null === b
              ? null
              : Number(b)
                ? Number(b)
                : o.fn.unformat(b)),
        new a(b)
      )
    }),
      (o.version = p),
      (o.isNumeral = function(b) {
        return b instanceof a
      }),
      (o.language = function(a, b) {
        if (!a) return s.currentLanguage
        if (((a = a.toLowerCase()), a && !b)) {
          if (!q[a]) throw new Error('Unknown language : ' + a)
          s.currentLanguage = a
        }
        return (!b && q[a]) || l(a, b), o
      }),
      (o.reset = function() {
        for (var a in r) s[a] = r[a]
      }),
      (o.languageData = function(a) {
        if (!a) return q[s.currentLanguage]
        if (!q[a]) throw new Error('Unknown language : ' + a)
        return q[a]
      }),
      o.language('en', {
        delimiters: {
          thousands: ',',
          decimal: '.',
        },
        abbreviations: {
          thousand: 'k',
          million: 'm',
          billion: 'b',
          trillion: 't',
        },
        ordinal: function(a) {
          var b = a % 10
          return 1 === ~~((a % 100) / 10) ? 'th' : 1 === b ? 'st' : 2 === b ? 'nd' : 3 === b ? 'rd' : 'th'
        },
        currency: {
          symbol: '$',
        },
      }),
      (o.zeroFormat = function(a) {
        s.zeroFormat = 'string' == typeof a ? a : null
      }),
      (o.nullFormat = function(a) {
        s.nullFormat = 'string' == typeof a ? a : null
      }),
      (o.defaultFormat = function(a) {
        s.defaultFormat = 'string' == typeof a ? a : '0.0'
      }),
      (o.validate = function(a, b) {
        var c, d, e, f, g, h, i, j
        if (
          ('string' != typeof a &&
            ((a += ''), console.warn && console.warn('Numeral.js: Value is not string. It has been co-erced to: ', a)),
          (a = a.trim()),
          a.match(/^\d+$/))
        )
          return !0
        if ('' === a) return !1
        try {
          i = o.languageData(b)
        } catch (a) {
          i = o.languageData(o.language())
        }
        return (
          (e = i.currency.symbol),
          (g = i.abbreviations),
          (c = i.delimiters.decimal),
          (d = '.' === i.delimiters.thousands ? '\\.' : i.delimiters.thousands),
          (j = a.match(/^[^\d]+/)),
          (null === j || ((a = a.substr(1)), j[0] === e)) &&
            ((j = a.match(/[^\d]+$/)),
            (null === j ||
              ((a = a.slice(0, -1)),
              j[0] === g.thousand || j[0] === g.million || j[0] === g.billion || j[0] === g.trillion)) &&
              ((h = new RegExp(d + '{2}')),
              !a.match(/[^\d.,]/g) &&
                ((f = a.split(c)),
                !(f.length > 2) &&
                  (f.length < 2
                    ? !!f[0].match(/^\d+.*\d$/) && !f[0].match(h)
                    : 1 === f[0].length
                      ? !!f[0].match(/^\d+$/) && !f[0].match(h) && !!f[1].match(/^\d+$/)
                      : !!f[0].match(/^\d+.*\d$/) && !f[0].match(h) && !!f[1].match(/^\d+$/)))))
        )
      }),
      Array.prototype.reduce ||
        (Array.prototype.reduce = function(a) {
          'use strict'
          if (null === this) throw new TypeError('Array.prototype.reduce called on null or undefined')
          if ('function' != typeof a) throw new TypeError(a + ' is not a function')
          var b,
            c = Object(this),
            d = c.length >>> 0,
            e = 0
          if (2 === arguments.length) b = arguments[1]
          else {
            for (; e < d && !(e in c); ) e++
            if (e >= d) throw new TypeError('Reduce of empty array with no initial value')
            b = c[e++]
          }
          for (; e < d; e++) e in c && (b = a(b, c[e], e, c))
          return b
        }),
      (o.fn = a.prototype = {
        clone: function() {
          return o(this)
        },
        format: function(a, b) {
          return c(this, a ? a : s.defaultFormat, void 0 !== b ? b : Math.round)
        },
        unformat: function(a) {
          return '[object Number]' === Object.prototype.toString.call(a) ? a : j(this, a ? a : s.defaultFormat)
        },
        value: function() {
          return this._value
        },
        valueOf: function() {
          return this._value
        },
        set: function(a) {
          return (this._value = Number(a)), this
        },
        add: function(a) {
          function b(a, b, d, e) {
            return a + c * b
          }
          var c = n.call(null, this._value, a)
          return (this._value = [this._value, a].reduce(b, 0) / c), this
        },
        subtract: function(a) {
          function b(a, b, d, e) {
            return a - c * b
          }
          var c = n.call(null, this._value, a)
          return (this._value = [a].reduce(b, this._value * c) / c), this
        },
        multiply: function(a) {
          function b(a, b, c, d) {
            var e = n(a, b)
            return (a * e * (b * e)) / (e * e)
          }
          return (this._value = [this._value, a].reduce(b, 1)), this
        },
        divide: function(a) {
          function b(a, b, c, d) {
            var e = n(a, b)
            return (a * e) / (b * e)
          }
          return (this._value = [this._value, a].reduce(b)), this
        },
        difference: function(a) {
          return Math.abs(
            o(this._value)
              .subtract(a)
              .value(),
          )
        },
      }),
      'undefined' != typeof module && module.exports && (module.exports = o),
      'undefined' == typeof ender && (this.numeral = o),
      'function' == typeof define &&
        define.amd &&
        define([], function() {
          return o
        })
  }.call(this),
  !(function(a, b) {
    'object' == typeof exports && 'undefined' != typeof module
      ? b(exports)
      : 'function' == typeof define && define.amd
        ? define(['exports'], b)
        : b((a.async = a.async || {}))
  })(this, function(a) {
    'use strict'

    function b(a, b) {
      b |= 0
      for (var c = Math.max(a.length - b, 0), d = Array(c), e = 0; e < c; e++) d[e] = a[b + e]
      return d
    }

    function c(a) {
      var b = typeof a
      return null != a && ('object' == b || 'function' == b)
    }

    function d(a) {
      setTimeout(a, 0)
    }

    function e(a) {
      return function(c) {
        var d = b(arguments, 1)
        a(function() {
          c.apply(null, d)
        })
      }
    }

    function f(a) {
      return gb(function(b, d) {
        var e
        try {
          e = a.apply(this, b)
        } catch (a) {
          return d(a)
        }
        c(e) && 'function' == typeof e.then
          ? e.then(
              function(a) {
                g(d, null, a)
              },
              function(a) {
                g(d, a.message ? a : new Error(a))
              },
            )
          : d(null, e)
      })
    }

    function g(a, b, c) {
      try {
        a(b, c)
      } catch (a) {
        jb(h, a)
      }
    }

    function h(a) {
      throw a
    }

    function i(a) {
      return kb && 'AsyncFunction' === a[Symbol.toStringTag]
    }

    function j(a) {
      return i(a) ? f(a) : a
    }

    function k(a) {
      return function(c) {
        var d = b(arguments, 1),
          e = gb(function(b, d) {
            var e = this
            return a(
              c,
              function(a, c) {
                j(a).apply(e, b.concat(c))
              },
              d,
            )
          })
        return d.length ? e.apply(this, d) : e
      }
    }

    function l(a) {
      var b = qb.call(a, sb),
        c = a[sb]
      try {
        a[sb] = void 0
        var d = !0
      } catch (a) {}
      var e = rb.call(a)
      return d && (b ? (a[sb] = c) : delete a[sb]), e
    }

    function m(a) {
      return ub.call(a)
    }

    function n(a) {
      return null == a ? (void 0 === a ? wb : vb) : xb && xb in Object(a) ? l(a) : m(a)
    }

    function o(a) {
      if (!c(a)) return !1
      var b = n(a)
      return b == zb || b == Ab || b == yb || b == Bb
    }

    function p(a) {
      return 'number' == typeof a && a > -1 && a % 1 == 0 && a <= Cb
    }

    function q(a) {
      return null != a && p(a.length) && !o(a)
    }

    function r() {}

    function s(a) {
      return function() {
        if (null !== a) {
          var b = a
          ;(a = null), b.apply(this, arguments)
        }
      }
    }

    function t(a, b) {
      for (var c = -1, d = Array(a); ++c < a; ) d[c] = b(c)
      return d
    }

    function u(a) {
      return null != a && 'object' == typeof a
    }

    function v(a) {
      return u(a) && n(a) == Gb
    }

    function w() {
      return !1
    }

    function x(a, b) {
      var c = typeof a
      return (
        (b = null == b ? Sb : b),
        !!b && ('number' == c || ('symbol' != c && Tb.test(a))) && a > -1 && a % 1 == 0 && a < b
      )
    }

    function y(a) {
      return u(a) && p(a.length) && !!qc[n(a)]
    }

    function z(a) {
      return function(b) {
        return a(b)
      }
    }

    function A(a, b) {
      var c = Lb(a),
        d = !c && Kb(a),
        e = !c && !d && Rb(a),
        f = !c && !d && !e && xc(a),
        g = c || d || e || f,
        h = g ? t(a.length, String) : [],
        i = h.length
      for (var j in a)
        (!b && !zc.call(a, j)) ||
          (g &&
            ('length' == j ||
              (e && ('offset' == j || 'parent' == j)) ||
              (f && ('buffer' == j || 'byteLength' == j || 'byteOffset' == j)) ||
              x(j, i))) ||
          h.push(j)
      return h
    }

    function B(a) {
      var b = a && a.constructor,
        c = ('function' == typeof b && b.prototype) || Ac
      return a === c
    }

    function C(a, b) {
      return function(c) {
        return a(b(c))
      }
    }

    function D(a) {
      if (!B(a)) return Bc(a)
      var b = []
      for (var c in Object(a)) Dc.call(a, c) && 'constructor' != c && b.push(c)
      return b
    }

    function E(a) {
      return q(a) ? A(a) : D(a)
    }

    function F(a) {
      var b = -1,
        c = a.length
      return function() {
        return ++b < c
          ? {
              value: a[b],
              key: b,
            }
          : null
      }
    }

    function G(a) {
      var b = -1
      return function() {
        var c = a.next()
        return c.done
          ? null
          : (b++,
            {
              value: c.value,
              key: b,
            })
      }
    }

    function H(a) {
      var b = E(a),
        c = -1,
        d = b.length
      return function() {
        var e = b[++c]
        return c < d
          ? {
              value: a[e],
              key: e,
            }
          : null
      }
    }

    function I(a) {
      if (q(a)) return F(a)
      var b = Fb(a)
      return b ? G(b) : H(a)
    }

    function J(a) {
      return function() {
        if (null === a) throw new Error('Callback was already called.')
        var b = a
        ;(a = null), b.apply(this, arguments)
      }
    }

    function K(a) {
      return function(b, c, d) {
        function e(a, b) {
          if (((i -= 1), a)) (h = !0), d(a)
          else {
            if (b === Db || (h && i <= 0)) return (h = !0), d(null)
            j || f()
          }
        }

        function f() {
          for (j = !0; i < a && !h; ) {
            var b = g()
            if (null === b) return (h = !0), void (i <= 0 && d(null))
            ;(i += 1), c(b.value, b.key, J(e))
          }
          j = !1
        }
        if (((d = s(d || r)), a <= 0 || !b)) return d(null)
        var g = I(b),
          h = !1,
          i = 0,
          j = !1
        f()
      }
    }

    function L(a, b, c, d) {
      K(b)(a, j(c), d)
    }

    function M(a, b) {
      return function(c, d, e) {
        return a(c, b, d, e)
      }
    }

    function N(a, b, c) {
      function d(a, b) {
        a ? c(a) : (++f !== g && b !== Db) || c(null)
      }
      c = s(c || r)
      var e = 0,
        f = 0,
        g = a.length
      for (0 === g && c(null); e < g; e++) b(a[e], e, J(d))
    }

    function O(a) {
      return function(b, c, d) {
        return a(Fc, b, j(c), d)
      }
    }

    function P(a, b, c, d) {
      ;(d = d || r), (b = b || [])
      var e = [],
        f = 0,
        g = j(c)
      a(
        b,
        function(a, b, c) {
          var d = f++
          g(a, function(a, b) {
            ;(e[d] = b), c(a)
          })
        },
        function(a) {
          d(a, e)
        },
      )
    }

    function Q(a) {
      return function(b, c, d, e) {
        return a(K(c), b, j(d), e)
      }
    }

    function R(a, b) {
      for (var c = -1, d = null == a ? 0 : a.length; ++c < d && b(a[c], c, a) !== !1; );
      return a
    }

    function S(a) {
      return function(b, c, d) {
        for (var e = -1, f = Object(b), g = d(b), h = g.length; h--; ) {
          var i = g[a ? h : ++e]
          if (c(f[i], i, f) === !1) break
        }
        return b
      }
    }

    function T(a, b) {
      return a && Lc(a, b, E)
    }

    function U(a, b, c, d) {
      for (var e = a.length, f = c + (d ? 1 : -1); d ? f-- : ++f < e; ) if (b(a[f], f, a)) return f
      return -1
    }

    function V(a) {
      return a !== a
    }

    function W(a, b, c) {
      for (var d = c - 1, e = a.length; ++d < e; ) if (a[d] === b) return d
      return -1
    }

    function X(a, b, c) {
      return b === b ? W(a, b, c) : U(a, V, c)
    }

    function Y(a, b) {
      for (var c = -1, d = null == a ? 0 : a.length, e = Array(d); ++c < d; ) e[c] = b(a[c], c, a)
      return e
    }

    function Z(a) {
      return 'symbol' == typeof a || (u(a) && n(a) == Nc)
    }

    function $(a) {
      if ('string' == typeof a) return a
      if (Lb(a)) return Y(a, $) + ''
      if (Z(a)) return Qc ? Qc.call(a) : ''
      var b = a + ''
      return '0' == b && 1 / a == -Oc ? '-0' : b
    }

    function _(a, b, c) {
      var d = -1,
        e = a.length
      b < 0 && (b = -b > e ? 0 : e + b),
        (c = c > e ? e : c),
        c < 0 && (c += e),
        (e = b > c ? 0 : (c - b) >>> 0),
        (b >>>= 0)
      for (var f = Array(e); ++d < e; ) f[d] = a[d + b]
      return f
    }

    function aa(a, b, c) {
      var d = a.length
      return (c = void 0 === c ? d : c), !b && c >= d ? a : _(a, b, c)
    }

    function ba(a, b) {
      for (var c = a.length; c-- && X(b, a[c], 0) > -1; );
      return c
    }

    function ca(a, b) {
      for (var c = -1, d = a.length; ++c < d && X(b, a[c], 0) > -1; );
      return c
    }

    function da(a) {
      return a.split('')
    }

    function ea(a) {
      return Yc.test(a)
    }

    function fa(a) {
      return a.match(qd) || []
    }

    function ga(a) {
      return ea(a) ? fa(a) : da(a)
    }

    function ha(a) {
      return null == a ? '' : $(a)
    }

    function ia(a, b, c) {
      if (((a = ha(a)), a && (c || void 0 === b))) return a.replace(rd, '')
      if (!a || !(b = $(b))) return a
      var d = ga(a),
        e = ga(b),
        f = ca(d, e),
        g = ba(d, e) + 1
      return aa(d, f, g).join('')
    }

    function ja(a) {
      return (
        (a = a.toString().replace(vd, '')),
        (a = a.match(sd)[2].replace(' ', '')),
        (a = a ? a.split(td) : []),
        (a = a.map(function(a) {
          return ia(a.replace(ud, ''))
        }))
      )
    }

    function ka(a, b) {
      var c = {}
      T(a, function(a, b) {
        function d(b, c) {
          var d = Y(e, function(a) {
            return b[a]
          })
          d.push(c), j(a).apply(null, d)
        }
        var e,
          f = i(a),
          g = (!f && 1 === a.length) || (f && 0 === a.length)
        if (Lb(a)) (e = a.slice(0, -1)), (a = a[a.length - 1]), (c[b] = e.concat(e.length > 0 ? d : a))
        else if (g) c[b] = a
        else {
          if (((e = ja(a)), 0 === a.length && !f && 0 === e.length))
            throw new Error('autoInject task functions require explicit parameters.')
          f || e.pop(), (c[b] = e.concat(d))
        }
      }),
        Mc(c, b)
    }

    function la() {
      ;(this.head = this.tail = null), (this.length = 0)
    }

    function ma(a, b) {
      ;(a.length = 1), (a.head = a.tail = b)
    }

    function na(a, b, c) {
      function d(a, b, c) {
        if (null != c && 'function' != typeof c) throw new Error('task callback must be a function')
        if (((l.started = !0), Lb(a) || (a = [a]), 0 === a.length && l.idle()))
          return jb(function() {
            l.drain()
          })
        for (var d = 0, e = a.length; d < e; d++) {
          var f = {
            data: a[d],
            callback: c || r,
          }
          b ? l._tasks.unshift(f) : l._tasks.push(f)
        }
        i ||
          ((i = !0),
          jb(function() {
            ;(i = !1), l.process()
          }))
      }

      function e(a) {
        return function(b) {
          g -= 1
          for (var c = 0, d = a.length; c < d; c++) {
            var e = a[c],
              f = X(h, e, 0)
            0 === f ? h.shift() : f > 0 && h.splice(f, 1),
              e.callback.apply(e, arguments),
              null != b && l.error(b, e.data)
          }
          g <= l.concurrency - l.buffer && l.unsaturated(), l.idle() && l.drain(), l.process()
        }
      }
      if (null == b) b = 1
      else if (0 === b) throw new Error('Concurrency must not be zero')
      var f = j(a),
        g = 0,
        h = [],
        i = !1,
        k = !1,
        l = {
          _tasks: new la(),
          concurrency: b,
          payload: c,
          saturated: r,
          unsaturated: r,
          buffer: b / 4,
          empty: r,
          drain: r,
          error: r,
          started: !1,
          paused: !1,
          push: function(a, b) {
            d(a, !1, b)
          },
          kill: function() {
            ;(l.drain = r), l._tasks.empty()
          },
          unshift: function(a, b) {
            d(a, !0, b)
          },
          remove: function(a) {
            l._tasks.remove(a)
          },
          process: function() {
            if (!k) {
              for (k = !0; !l.paused && g < l.concurrency && l._tasks.length; ) {
                var a = [],
                  b = [],
                  c = l._tasks.length
                l.payload && (c = Math.min(c, l.payload))
                for (var d = 0; d < c; d++) {
                  var i = l._tasks.shift()
                  a.push(i), h.push(i), b.push(i.data)
                }
                ;(g += 1), 0 === l._tasks.length && l.empty(), g === l.concurrency && l.saturated()
                var j = J(e(a))
                f(b, j)
              }
              k = !1
            }
          },
          length: function() {
            return l._tasks.length
          },
          running: function() {
            return g
          },
          workersList: function() {
            return h
          },
          idle: function() {
            return l._tasks.length + g === 0
          },
          pause: function() {
            l.paused = !0
          },
          resume: function() {
            l.paused !== !1 && ((l.paused = !1), jb(l.process))
          },
        }
      return l
    }

    function oa(a, b) {
      return na(a, 1, b)
    }

    function pa(a, b, c, d) {
      d = s(d || r)
      var e = j(c)
      xd(
        a,
        function(a, c, d) {
          e(b, a, function(a, c) {
            ;(b = c), d(a)
          })
        },
        function(a) {
          d(a, b)
        },
      )
    }

    function qa() {
      var a = Y(arguments, j)
      return function() {
        var c = b(arguments),
          d = this,
          e = c[c.length - 1]
        'function' == typeof e ? c.pop() : (e = r),
          pa(
            a,
            c,
            function(a, c, e) {
              c.apply(
                d,
                a.concat(function(a) {
                  var c = b(arguments, 1)
                  e(a, c)
                }),
              )
            },
            function(a, b) {
              e.apply(d, [a].concat(b))
            },
          )
      }
    }

    function ra(a) {
      return a
    }

    function sa(a, b) {
      return function(c, d, e, f) {
        f = f || r
        var g,
          h = !1
        c(
          d,
          function(c, d, f) {
            e(c, function(d, e) {
              d ? f(d) : a(e) && !g ? ((h = !0), (g = b(!0, c)), f(null, Db)) : f()
            })
          },
          function(a) {
            a ? f(a) : f(null, h ? g : b(!1))
          },
        )
      }
    }

    function ta(a, b) {
      return b
    }

    function ua(a) {
      return function(c) {
        var d = b(arguments, 1)
        d.push(function(c) {
          var d = b(arguments, 1)
          'object' == typeof console &&
            (c
              ? console.error && console.error(c)
              : console[a] &&
                R(d, function(b) {
                  console[a](b)
                }))
        }),
          j(c).apply(null, d)
      }
    }

    function va(a, c, d) {
      function e(a) {
        if (a) return d(a)
        var c = b(arguments, 1)
        c.push(f), h.apply(this, c)
      }

      function f(a, b) {
        return a ? d(a) : b ? void g(e) : d(null)
      }
      d = J(d || r)
      var g = j(a),
        h = j(c)
      f(null, !0)
    }

    function wa(a, c, d) {
      d = J(d || r)
      var e = j(a),
        f = function(a) {
          if (a) return d(a)
          var g = b(arguments, 1)
          return c.apply(this, g) ? e(f) : void d.apply(null, [null].concat(g))
        }
      e(f)
    }

    function xa(a, b, c) {
      wa(
        a,
        function() {
          return !b.apply(this, arguments)
        },
        c,
      )
    }

    function ya(a, b, c) {
      function d(a) {
        return a ? c(a) : void g(e)
      }

      function e(a, b) {
        return a ? c(a) : b ? void f(d) : c(null)
      }
      c = J(c || r)
      var f = j(b),
        g = j(a)
      g(e)
    }

    function za(a) {
      return function(b, c, d) {
        return a(b, d)
      }
    }

    function Aa(a, b, c) {
      Fc(a, za(j(b)), c)
    }

    function Ba(a, b, c, d) {
      K(b)(a, za(j(c)), d)
    }

    function Ca(a) {
      return i(a)
        ? a
        : gb(function(b, c) {
            var d = !0
            b.push(function() {
              var a = arguments
              d
                ? jb(function() {
                    c.apply(null, a)
                  })
                : c.apply(null, a)
            }),
              a.apply(this, b),
              (d = !1)
          })
    }

    function Da(a) {
      return !a
    }

    function Ea(a) {
      return function(b) {
        return null == b ? void 0 : b[a]
      }
    }

    function Fa(a, b, c, d) {
      var e = new Array(b.length)
      a(
        b,
        function(a, b, d) {
          c(a, function(a, c) {
            ;(e[b] = !!c), d(a)
          })
        },
        function(a) {
          if (a) return d(a)
          for (var c = [], f = 0; f < b.length; f++) e[f] && c.push(b[f])
          d(null, c)
        },
      )
    }

    function Ga(a, b, c, d) {
      var e = []
      a(
        b,
        function(a, b, d) {
          c(a, function(c, f) {
            c
              ? d(c)
              : (f &&
                  e.push({
                    index: b,
                    value: a,
                  }),
                d())
          })
        },
        function(a) {
          a
            ? d(a)
            : d(
                null,
                Y(
                  e.sort(function(a, b) {
                    return a.index - b.index
                  }),
                  Ea('value'),
                ),
              )
        },
      )
    }

    function Ha(a, b, c, d) {
      var e = q(b) ? Fa : Ga
      e(a, b, j(c), d || r)
    }

    function Ia(a, b) {
      function c(a) {
        return a ? d(a) : void e(c)
      }
      var d = J(b || r),
        e = j(Ca(a))
      c()
    }

    function Ja(a, b, c, d) {
      d = s(d || r)
      var e = {},
        f = j(c)
      L(
        a,
        b,
        function(a, b, c) {
          f(a, b, function(a, d) {
            return a ? c(a) : ((e[b] = d), void c())
          })
        },
        function(a) {
          d(a, e)
        },
      )
    }

    function Ka(a, b) {
      return b in a
    }

    function La(a, c) {
      var d = Object.create(null),
        e = Object.create(null)
      c = c || ra
      var f = j(a),
        g = gb(function(a, g) {
          var h = c.apply(null, a)
          Ka(d, h)
            ? jb(function() {
                g.apply(null, d[h])
              })
            : Ka(e, h)
              ? e[h].push(g)
              : ((e[h] = [g]),
                f.apply(
                  null,
                  a.concat(function() {
                    var a = b(arguments)
                    d[h] = a
                    var c = e[h]
                    delete e[h]
                    for (var f = 0, g = c.length; f < g; f++) c[f].apply(null, a)
                  }),
                ))
        })
      return (g.memo = d), (g.unmemoized = a), g
    }

    function Ma(a, c, d) {
      d = d || r
      var e = q(c) ? [] : {}
      a(
        c,
        function(a, c, d) {
          j(a)(function(a, f) {
            arguments.length > 2 && (f = b(arguments, 1)), (e[c] = f), d(a)
          })
        },
        function(a) {
          d(a, e)
        },
      )
    }

    function Na(a, b) {
      Ma(Fc, a, b)
    }

    function Oa(a, b, c) {
      Ma(K(b), a, c)
    }

    function Pa(a, b) {
      if (((b = s(b || r)), !Lb(a))) return b(new TypeError('First argument to race must be an array of functions'))
      if (!a.length) return b()
      for (var c = 0, d = a.length; c < d; c++) j(a[c])(b)
    }

    function Qa(a, c, d, e) {
      var f = b(a).reverse()
      pa(f, c, d, e)
    }

    function Ra(a) {
      var c = j(a)
      return gb(function(a, d) {
        return (
          a.push(function(a, c) {
            if (a)
              d(null, {
                error: a,
              })
            else {
              var e
              ;(e = arguments.length <= 2 ? c : b(arguments, 1)),
                d(null, {
                  value: e,
                })
            }
          }),
          c.apply(this, a)
        )
      })
    }

    function Sa(a) {
      var b
      return (
        Lb(a)
          ? (b = Y(a, Ra))
          : ((b = {}),
            T(a, function(a, c) {
              b[c] = Ra.call(this, a)
            })),
        b
      )
    }

    function Ta(a, b, c, d) {
      Ha(
        a,
        b,
        function(a, b) {
          c(a, function(a, c) {
            b(a, !c)
          })
        },
        d,
      )
    }

    function Ua(a) {
      return function() {
        return a
      }
    }

    function Va(a, b, c) {
      function d(a, b) {
        if ('object' == typeof b)
          (a.times = +b.times || f),
            (a.intervalFunc = 'function' == typeof b.interval ? b.interval : Ua(+b.interval || g)),
            (a.errorFilter = b.errorFilter)
        else {
          if ('number' != typeof b && 'string' != typeof b) throw new Error('Invalid arguments for async.retry')
          a.times = +b || f
        }
      }

      function e() {
        i(function(a) {
          a && k++ < h.times && ('function' != typeof h.errorFilter || h.errorFilter(a))
            ? setTimeout(e, h.intervalFunc(k))
            : c.apply(null, arguments)
        })
      }
      var f = 5,
        g = 0,
        h = {
          times: f,
          intervalFunc: Ua(g),
        }
      if (
        (arguments.length < 3 && 'function' == typeof a ? ((c = b || r), (b = a)) : (d(h, a), (c = c || r)),
        'function' != typeof b)
      )
        throw new Error('Invalid arguments for async.retry')
      var i = j(b),
        k = 1
      e()
    }

    function Wa(a, b) {
      Ma(xd, a, b)
    }

    function Xa(a, b, c) {
      function d(a, b) {
        var c = a.criteria,
          d = b.criteria
        return c < d ? -1 : c > d ? 1 : 0
      }
      var e = j(b)
      Gc(
        a,
        function(a, b) {
          e(a, function(c, d) {
            return c
              ? b(c)
              : void b(null, {
                  value: a,
                  criteria: d,
                })
          })
        },
        function(a, b) {
          return a ? c(a) : void c(null, Y(b.sort(d), Ea('value')))
        },
      )
    }

    function Ya(a, b, c) {
      var d = j(a)
      return gb(function(e, f) {
        function g() {
          var b = a.name || 'anonymous',
            d = new Error('Callback function "' + b + '" timed out.')
          ;(d.code = 'ETIMEDOUT'), c && (d.info = c), (i = !0), f(d)
        }
        var h,
          i = !1
        e.push(function() {
          i || (f.apply(null, arguments), clearTimeout(h))
        }),
          (h = setTimeout(g, b)),
          d.apply(null, e)
      })
    }

    function Za(a, b, c, d) {
      for (var e = -1, f = ee(de((b - a) / (c || 1)), 0), g = Array(f); f--; ) (g[d ? f : ++e] = a), (a += c)
      return g
    }

    function $a(a, b, c, d) {
      var e = j(c)
      Ic(Za(0, a, 1), b, e, d)
    }

    function _a(a, b, c, d) {
      arguments.length <= 3 && ((d = c), (c = b), (b = Lb(a) ? [] : {})), (d = s(d || r))
      var e = j(c)
      Fc(
        a,
        function(a, c, d) {
          e(b, a, c, d)
        },
        function(a) {
          d(a, b)
        },
      )
    }

    function ab(a, c) {
      var d,
        e = null
      ;(c = c || r),
        Id(
          a,
          function(a, c) {
            j(a)(function(a, f) {
              ;(d = arguments.length > 2 ? b(arguments, 1) : f), (e = a), c(!a)
            })
          },
          function() {
            c(e, d)
          },
        )
    }

    function bb(a) {
      return function() {
        return (a.unmemoized || a).apply(null, arguments)
      }
    }

    function cb(a, c, d) {
      d = J(d || r)
      var e = j(c)
      if (!a()) return d(null)
      var f = function(c) {
        if (c) return d(c)
        if (a()) return e(f)
        var g = b(arguments, 1)
        d.apply(null, [null].concat(g))
      }
      e(f)
    }

    function db(a, b, c) {
      cb(
        function() {
          return !a.apply(this, arguments)
        },
        b,
        c,
      )
    }
    var eb,
      fb = function(a) {
        var c = b(arguments, 1)
        return function() {
          var d = b(arguments)
          return a.apply(null, c.concat(d))
        }
      },
      gb = function(a) {
        return function() {
          var c = b(arguments),
            d = c.pop()
          a.call(this, c, d)
        }
      },
      hb = 'function' == typeof setImmediate && setImmediate,
      ib = 'object' == typeof process && 'function' == typeof process.nextTick
    eb = hb ? setImmediate : ib ? process.nextTick : d
    var jb = e(eb),
      kb = 'function' == typeof Symbol,
      lb = 'object' == typeof global && global && global.Object === Object && global,
      mb = 'object' == typeof self && self && self.Object === Object && self,
      nb = lb || mb || Function('return this')(),
      ob = nb.Symbol,
      pb = Object.prototype,
      qb = pb.hasOwnProperty,
      rb = pb.toString,
      sb = ob ? ob.toStringTag : void 0,
      tb = Object.prototype,
      ub = tb.toString,
      vb = '[object Null]',
      wb = '[object Undefined]',
      xb = ob ? ob.toStringTag : void 0,
      yb = '[object AsyncFunction]',
      zb = '[object Function]',
      Ab = '[object GeneratorFunction]',
      Bb = '[object Proxy]',
      Cb = 9007199254740991,
      Db = {},
      Eb = 'function' == typeof Symbol && Symbol.iterator,
      Fb = function(a) {
        return Eb && a[Eb] && a[Eb]()
      },
      Gb = '[object Arguments]',
      Hb = Object.prototype,
      Ib = Hb.hasOwnProperty,
      Jb = Hb.propertyIsEnumerable,
      Kb = v(
        (function() {
          return arguments
        })(),
      )
        ? v
        : function(a) {
            return u(a) && Ib.call(a, 'callee') && !Jb.call(a, 'callee')
          },
      Lb = Array.isArray,
      Mb = 'object' == typeof a && a && !a.nodeType && a,
      Nb = Mb && 'object' == typeof module && module && !module.nodeType && module,
      Ob = Nb && Nb.exports === Mb,
      Pb = Ob ? nb.Buffer : void 0,
      Qb = Pb ? Pb.isBuffer : void 0,
      Rb = Qb || w,
      Sb = 9007199254740991,
      Tb = /^(?:0|[1-9]\d*)$/,
      Ub = '[object Arguments]',
      Vb = '[object Array]',
      Wb = '[object Boolean]',
      Xb = '[object Date]',
      Yb = '[object Error]',
      Zb = '[object Function]',
      $b = '[object Map]',
      _b = '[object Number]',
      ac = '[object Object]',
      bc = '[object RegExp]',
      cc = '[object Set]',
      dc = '[object String]',
      ec = '[object WeakMap]',
      fc = '[object ArrayBuffer]',
      gc = '[object DataView]',
      hc = '[object Float32Array]',
      ic = '[object Float64Array]',
      jc = '[object Int8Array]',
      kc = '[object Int16Array]',
      lc = '[object Int32Array]',
      mc = '[object Uint8Array]',
      nc = '[object Uint8ClampedArray]',
      oc = '[object Uint16Array]',
      pc = '[object Uint32Array]',
      qc = {}
    ;(qc[hc] = qc[ic] = qc[jc] = qc[kc] = qc[lc] = qc[mc] = qc[nc] = qc[oc] = qc[pc] = !0),
      (qc[Ub] = qc[Vb] = qc[fc] = qc[Wb] = qc[gc] = qc[Xb] = qc[Yb] = qc[Zb] = qc[$b] = qc[_b] = qc[ac] = qc[bc] = qc[
        cc
      ] = qc[dc] = qc[ec] = !1)
    var rc = 'object' == typeof a && a && !a.nodeType && a,
      sc = rc && 'object' == typeof module && module && !module.nodeType && module,
      tc = sc && sc.exports === rc,
      uc = tc && lb.process,
      vc = (function() {
        try {
          var a = sc && sc.require && sc.require('util').types
          return a ? a : uc && uc.binding && uc.binding('util')
        } catch (a) {}
      })(),
      wc = vc && vc.isTypedArray,
      xc = wc ? z(wc) : y,
      yc = Object.prototype,
      zc = yc.hasOwnProperty,
      Ac = Object.prototype,
      Bc = C(Object.keys, Object),
      Cc = Object.prototype,
      Dc = Cc.hasOwnProperty,
      Ec = M(L, 1 / 0),
      Fc = function(a, b, c) {
        var d = q(a) ? N : Ec
        d(a, j(b), c)
      },
      Gc = O(P),
      Hc = k(Gc),
      Ic = Q(P),
      Jc = M(Ic, 1),
      Kc = k(Jc),
      Lc = S(),
      Mc = function(a, c, d) {
        function e(a, b) {
          u.push(function() {
            i(a, b)
          })
        }

        function f() {
          if (0 === u.length && 0 === p) return d(null, o)
          for (; u.length && p < c; ) {
            var a = u.shift()
            a()
          }
        }

        function g(a, b) {
          var c = t[a]
          c || (c = t[a] = []), c.push(b)
        }

        function h(a) {
          var b = t[a] || []
          R(b, function(a) {
            a()
          }),
            f()
        }

        function i(a, c) {
          if (!q) {
            var e = J(function(c, e) {
              if ((p--, arguments.length > 2 && (e = b(arguments, 1)), c)) {
                var f = {}
                T(o, function(a, b) {
                  f[b] = a
                }),
                  (f[a] = e),
                  (q = !0),
                  (t = Object.create(null)),
                  d(c, f)
              } else (o[a] = e), h(a)
            })
            p++
            var f = j(c[c.length - 1])
            c.length > 1 ? f(o, e) : f(e)
          }
        }

        function k() {
          for (var a, b = 0; v.length; )
            (a = v.pop()),
              b++,
              R(l(a), function(a) {
                0 === --w[a] && v.push(a)
              })
          if (b !== n) throw new Error('async.auto cannot execute tasks due to a recursive dependency')
        }

        function l(b) {
          var c = []
          return (
            T(a, function(a, d) {
              Lb(a) && X(a, b, 0) >= 0 && c.push(d)
            }),
            c
          )
        }
        'function' == typeof c && ((d = c), (c = null)), (d = s(d || r))
        var m = E(a),
          n = m.length
        if (!n) return d(null)
        c || (c = n)
        var o = {},
          p = 0,
          q = !1,
          t = Object.create(null),
          u = [],
          v = [],
          w = {}
        T(a, function(b, c) {
          if (!Lb(b)) return e(c, [b]), void v.push(c)
          var d = b.slice(0, b.length - 1),
            f = d.length
          return 0 === f
            ? (e(c, b), void v.push(c))
            : ((w[c] = f),
              void R(d, function(h) {
                if (!a[h])
                  throw new Error(
                    'async.auto task `' + c + '` has a non-existent dependency `' + h + '` in ' + d.join(', '),
                  )
                g(h, function() {
                  f--, 0 === f && e(c, b)
                })
              }))
        }),
          k(),
          f()
      },
      Nc = '[object Symbol]',
      Oc = 1 / 0,
      Pc = ob ? ob.prototype : void 0,
      Qc = Pc ? Pc.toString : void 0,
      Rc = '\\ud800-\\udfff',
      Sc = '\\u0300-\\u036f',
      Tc = '\\ufe20-\\ufe2f',
      Uc = '\\u20d0-\\u20ff',
      Vc = Sc + Tc + Uc,
      Wc = '\\ufe0e\\ufe0f',
      Xc = '\\u200d',
      Yc = RegExp('[' + Xc + Rc + Vc + Wc + ']'),
      Zc = '\\ud800-\\udfff',
      $c = '\\u0300-\\u036f',
      _c = '\\ufe20-\\ufe2f',
      ad = '\\u20d0-\\u20ff',
      bd = $c + _c + ad,
      cd = '\\ufe0e\\ufe0f',
      dd = '[' + Zc + ']',
      ed = '[' + bd + ']',
      fd = '\\ud83c[\\udffb-\\udfff]',
      gd = '(?:' + ed + '|' + fd + ')',
      hd = '[^' + Zc + ']',
      id = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      jd = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      kd = '\\u200d',
      ld = gd + '?',
      md = '[' + cd + ']?',
      nd = '(?:' + kd + '(?:' + [hd, id, jd].join('|') + ')' + md + ld + ')*',
      od = md + ld + nd,
      pd = '(?:' + [hd + ed + '?', ed, id, jd, dd].join('|') + ')',
      qd = RegExp(fd + '(?=' + fd + ')|' + pd + od, 'g'),
      rd = /^\s+|\s+$/g,
      sd = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m,
      td = /,/,
      ud = /(=.+)?(\s*)$/,
      vd = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
    ;(la.prototype.removeLink = function(a) {
      return (
        a.prev ? (a.prev.next = a.next) : (this.head = a.next),
        a.next ? (a.next.prev = a.prev) : (this.tail = a.prev),
        (a.prev = a.next = null),
        (this.length -= 1),
        a
      )
    }),
      (la.prototype.empty = function() {
        for (; this.head; ) this.shift()
        return this
      }),
      (la.prototype.insertAfter = function(a, b) {
        ;(b.prev = a), (b.next = a.next), a.next ? (a.next.prev = b) : (this.tail = b), (a.next = b), (this.length += 1)
      }),
      (la.prototype.insertBefore = function(a, b) {
        ;(b.prev = a.prev), (b.next = a), a.prev ? (a.prev.next = b) : (this.head = b), (a.prev = b), (this.length += 1)
      }),
      (la.prototype.unshift = function(a) {
        this.head ? this.insertBefore(this.head, a) : ma(this, a)
      }),
      (la.prototype.push = function(a) {
        this.tail ? this.insertAfter(this.tail, a) : ma(this, a)
      }),
      (la.prototype.shift = function() {
        return this.head && this.removeLink(this.head)
      }),
      (la.prototype.pop = function() {
        return this.tail && this.removeLink(this.tail)
      }),
      (la.prototype.toArray = function() {
        for (var a = Array(this.length), b = this.head, c = 0; c < this.length; c++) (a[c] = b.data), (b = b.next)
        return a
      }),
      (la.prototype.remove = function(a) {
        for (var b = this.head; b; ) {
          var c = b.next
          a(b) && this.removeLink(b), (b = c)
        }
        return this
      })
    var wd,
      xd = M(L, 1),
      yd = function() {
        return qa.apply(null, b(arguments).reverse())
      },
      zd = Array.prototype.concat,
      Ad = function(a, c, d, e) {
        e = e || r
        var f = j(d)
        Ic(
          a,
          c,
          function(a, c) {
            f(a, function(a) {
              return a ? c(a) : c(null, b(arguments, 1))
            })
          },
          function(a, b) {
            for (var c = [], d = 0; d < b.length; d++) b[d] && (c = zd.apply(c, b[d]))
            return e(a, c)
          },
        )
      },
      Bd = M(Ad, 1 / 0),
      Cd = M(Ad, 1),
      Dd = function() {
        var a = b(arguments),
          c = [null].concat(a)
        return function() {
          var a = arguments[arguments.length - 1]
          return a.apply(this, c)
        }
      },
      Ed = O(sa(ra, ta)),
      Fd = Q(sa(ra, ta)),
      Gd = M(Fd, 1),
      Hd = ua('dir'),
      Id = M(Ba, 1),
      Jd = O(sa(Da, Da)),
      Kd = Q(sa(Da, Da)),
      Ld = M(Kd, 1),
      Md = O(Ha),
      Nd = Q(Ha),
      Od = M(Nd, 1),
      Pd = function(a, b, c, d) {
        d = d || r
        var e = j(c)
        Ic(
          a,
          b,
          function(a, b) {
            e(a, function(c, d) {
              return c
                ? b(c)
                : b(null, {
                    key: d,
                    val: a,
                  })
            })
          },
          function(a, b) {
            for (var c = {}, e = Object.prototype.hasOwnProperty, f = 0; f < b.length; f++)
              if (b[f]) {
                var g = b[f].key,
                  h = b[f].val
                e.call(c, g) ? c[g].push(h) : (c[g] = [h])
              }
            return d(a, c)
          },
        )
      },
      Qd = M(Pd, 1 / 0),
      Rd = M(Pd, 1),
      Sd = ua('log'),
      Td = M(Ja, 1 / 0),
      Ud = M(Ja, 1)
    wd = ib ? process.nextTick : hb ? setImmediate : d
    var Vd = e(wd),
      Wd = function(a, b) {
        var c = j(a)
        return na(
          function(a, b) {
            c(a[0], b)
          },
          b,
          1,
        )
      },
      Xd = function(a, b) {
        var c = Wd(a, b)
        return (
          (c.push = function(a, b, d) {
            if ((null == d && (d = r), 'function' != typeof d)) throw new Error('task callback must be a function')
            if (((c.started = !0), Lb(a) || (a = [a]), 0 === a.length))
              return jb(function() {
                c.drain()
              })
            b = b || 0
            for (var e = c._tasks.head; e && b >= e.priority; ) e = e.next
            for (var f = 0, g = a.length; f < g; f++) {
              var h = {
                data: a[f],
                priority: b,
                callback: d,
              }
              e ? c._tasks.insertBefore(e, h) : c._tasks.push(h)
            }
            jb(c.process)
          }),
          delete c.unshift,
          c
        )
      },
      Yd = O(Ta),
      Zd = Q(Ta),
      $d = M(Zd, 1),
      _d = function(a, b) {
        b || ((b = a), (a = null))
        var c = j(b)
        return gb(function(b, d) {
          function e(a) {
            c.apply(null, b.concat(a))
          }
          a ? Va(a, e, d) : Va(e, d)
        })
      },
      ae = O(sa(Boolean, ra)),
      be = Q(sa(Boolean, ra)),
      ce = M(be, 1),
      de = Math.ceil,
      ee = Math.max,
      fe = M($a, 1 / 0),
      ge = M($a, 1),
      he = function(a, c) {
        function d(b) {
          var c = j(a[f++])
          b.push(J(e)), c.apply(null, b)
        }

        function e(e) {
          return e || f === a.length ? c.apply(null, arguments) : void d(b(arguments, 1))
        }
        if (((c = s(c || r)), !Lb(a))) return c(new Error('First argument to waterfall must be an array of functions'))
        if (!a.length) return c()
        var f = 0
        d([])
      },
      ie = {
        apply: fb,
        applyEach: Hc,
        applyEachSeries: Kc,
        asyncify: f,
        auto: Mc,
        autoInject: ka,
        cargo: oa,
        compose: yd,
        concat: Bd,
        concatLimit: Ad,
        concatSeries: Cd,
        constant: Dd,
        detect: Ed,
        detectLimit: Fd,
        detectSeries: Gd,
        dir: Hd,
        doDuring: va,
        doUntil: xa,
        doWhilst: wa,
        during: ya,
        each: Aa,
        eachLimit: Ba,
        eachOf: Fc,
        eachOfLimit: L,
        eachOfSeries: xd,
        eachSeries: Id,
        ensureAsync: Ca,
        every: Jd,
        everyLimit: Kd,
        everySeries: Ld,
        filter: Md,
        filterLimit: Nd,
        filterSeries: Od,
        forever: Ia,
        groupBy: Qd,
        groupByLimit: Pd,
        groupBySeries: Rd,
        log: Sd,
        map: Gc,
        mapLimit: Ic,
        mapSeries: Jc,
        mapValues: Td,
        mapValuesLimit: Ja,
        mapValuesSeries: Ud,
        memoize: La,
        nextTick: Vd,
        parallel: Na,
        parallelLimit: Oa,
        priorityQueue: Xd,
        queue: Wd,
        race: Pa,
        reduce: pa,
        reduceRight: Qa,
        reflect: Ra,
        reflectAll: Sa,
        reject: Yd,
        rejectLimit: Zd,
        rejectSeries: $d,
        retry: Va,
        retryable: _d,
        seq: qa,
        series: Wa,
        setImmediate: jb,
        some: ae,
        someLimit: be,
        someSeries: ce,
        sortBy: Xa,
        timeout: Ya,
        times: fe,
        timesLimit: $a,
        timesSeries: ge,
        transform: _a,
        tryEach: ab,
        unmemoize: bb,
        until: db,
        waterfall: he,
        whilst: cb,
        all: Jd,
        allLimit: Kd,
        allSeries: Ld,
        any: ae,
        anyLimit: be,
        anySeries: ce,
        find: Ed,
        findLimit: Fd,
        findSeries: Gd,
        forEach: Aa,
        forEachSeries: Id,
        forEachLimit: Ba,
        forEachOf: Fc,
        forEachOfSeries: xd,
        forEachOfLimit: L,
        inject: pa,
        foldl: pa,
        foldr: Qa,
        select: Md,
        selectLimit: Nd,
        selectSeries: Od,
        wrapSync: f,
      }
    ;(a.default = ie),
      (a.apply = fb),
      (a.applyEach = Hc),
      (a.applyEachSeries = Kc),
      (a.asyncify = f),
      (a.auto = Mc),
      (a.autoInject = ka),
      (a.cargo = oa),
      (a.compose = yd),
      (a.concat = Bd),
      (a.concatLimit = Ad),
      (a.concatSeries = Cd),
      (a.constant = Dd),
      (a.detect = Ed),
      (a.detectLimit = Fd),
      (a.detectSeries = Gd),
      (a.dir = Hd),
      (a.doDuring = va),
      (a.doUntil = xa),
      (a.doWhilst = wa),
      (a.during = ya),
      (a.each = Aa),
      (a.eachLimit = Ba),
      (a.eachOf = Fc),
      (a.eachOfLimit = L),
      (a.eachOfSeries = xd),
      (a.eachSeries = Id),
      (a.ensureAsync = Ca),
      (a.every = Jd),
      (a.everyLimit = Kd),
      (a.everySeries = Ld),
      (a.filter = Md),
      (a.filterLimit = Nd),
      (a.filterSeries = Od),
      (a.forever = Ia),
      (a.groupBy = Qd),
      (a.groupByLimit = Pd),
      (a.groupBySeries = Rd),
      (a.log = Sd),
      (a.map = Gc),
      (a.mapLimit = Ic),
      (a.mapSeries = Jc),
      (a.mapValues = Td),
      (a.mapValuesLimit = Ja),
      (a.mapValuesSeries = Ud),
      (a.memoize = La),
      (a.nextTick = Vd),
      (a.parallel = Na),
      (a.parallelLimit = Oa),
      (a.priorityQueue = Xd),
      (a.queue = Wd),
      (a.race = Pa),
      (a.reduce = pa),
      (a.reduceRight = Qa),
      (a.reflect = Ra),
      (a.reflectAll = Sa),
      (a.reject = Yd),
      (a.rejectLimit = Zd),
      (a.rejectSeries = $d),
      (a.retry = Va),
      (a.retryable = _d),
      (a.seq = qa),
      (a.series = Wa),
      (a.setImmediate = jb),
      (a.some = ae),
      (a.someLimit = be),
      (a.someSeries = ce),
      (a.sortBy = Xa),
      (a.timeout = Ya),
      (a.times = fe),
      (a.timesLimit = $a),
      (a.timesSeries = ge),
      (a.transform = _a),
      (a.tryEach = ab),
      (a.unmemoize = bb),
      (a.until = db),
      (a.waterfall = he),
      (a.whilst = cb),
      (a.all = Jd),
      (a.allLimit = Kd),
      (a.allSeries = Ld),
      (a.any = ae),
      (a.anyLimit = be),
      (a.anySeries = ce),
      (a.find = Ed),
      (a.findLimit = Fd),
      (a.findSeries = Gd),
      (a.forEach = Aa),
      (a.forEachSeries = Id),
      (a.forEachLimit = Ba),
      (a.forEachOf = Fc),
      (a.forEachOfSeries = xd),
      (a.forEachOfLimit = L),
      (a.inject = pa),
      (a.foldl = pa),
      (a.foldr = Qa),
      (a.select = Md),
      (a.selectLimit = Nd),
      (a.selectSeries = Od),
      (a.wrapSync = f),
      Object.defineProperty(a, '__esModule', {
        value: !0,
      })
  }),
  (function(a, b) {
    'object' == typeof module && 'object' == typeof module.exports
      ? (module.exports = b(require('numeral')))
      : (a.format = b(window.numeral))
  })(this, function(a) {
    var b = {}
    return (
      (b.pluralForm = function(a, b) {
        var c = 2,
          b = b || []
        return (
          a % 10 === 1 && a % 100 != 11
            ? (c = 0)
            : a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20) && (c = 1),
          c > b.length ? b[0] || null : b[c]
        )
      }),
      (b.numberWithSpaces = function(a) {
        return a && a < 1e4
          ? a
          : (a || '')
              .toString()
              .replace(/\s+/g, '')
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      }),
      (b.getPriceAmount = function(a, b) {
        var b = b || 'BYN',
          a = a.converted[b]
        return (a = a ? a.amount : pricesObject.amount), this.formatPrice(a, b)
      }),
      (b.formatPrice = function(b, c) {
        var d = parseFloat(b),
          e = d >= 1e4
        return 'BYN' === c
          ? e
            ? a(b)
                .format('0,0.00')
                .replace(/\,/g, ' ')
                .replace(/\./g, ',')
            : a(b)
                .format('0.00')
                .replace(/\./g, ',')
          : e
            ? a(b)
                .format('0,0')
                .replace(/\,/g, ' ')
            : a(b).format('0')
      }),
      (b.htmlToText = function(a) {
        var b = document.createElement('div')
        return (b.innerHTML = a), b.innerText || b.textContent
      }),
      b
    )
  }),
  (PkApiService.prototype.closeApartment = function(a, b, c, d) {
    var e = {
      url: 'apartments/' + a,
      method: 'delete',
      withCredentials: !0,
      data: {
        closure_reason: {
          key: b,
          message: c,
        },
      },
      callbacks: d,
    }
    this.apiService.query(e)
  }),
  (PkApiService.prototype.reopenApartment = function(a, b) {
    var c = {
      url: 'apartments/' + a + '/reopen',
      method: 'put',
      withCredentials: !0,
      callbacks: b,
    }
    this.apiService.query(c)
  }),
  (PkApiService.prototype.getUserApartmentState = function(a, b, c) {
    var d = {
      url: a + (b ? '?' + b : ''),
      method: 'get',
      withCredentials: !0,
      callbacks: c,
    }
    return this.apiService.query(d)
  }),
  (PkApiService.prototype.apartmentComplaint = function(a, b, c, d) {
    var e = {
      url: '/apartments/' + a + '/complaints',
      method: 'post',
      data: {
        reason: b,
        comment: $.trim(c),
      },
      withCredentials: !0,
      callbacks: d,
    }
    this.apiService.query(e)
  }),
  (PkApiService.prototype.postClickStatistics = function(a) {
    var b = {
      url: '/statistics/show-contacts',
      method: 'post',
      data: {
        apartment_id: a,
      },
      withCredentials: !0,
    }
    this.apiService.query(b)
  }),
  (PkApiService.prototype.apartmentUp = function(a, b) {
    var c = {
      url: 'apartments/' + a + '/up',
      method: 'put',
      withCredentials: !0,
      errors: {
        silent: !0,
      },
      callbacks: b,
    }
    this.apiService.query(c)
  }),
  (PkApiService.prototype.apartmentEditorSend = function(a, b, c, d) {
    var e = {
      url: '/apartments' + (a ? '/' + a : ''),
      method: 'create' === b ? 'post' : 'patch',
      data: c,
      callbacks: d,
      withCredentials: !0,
    }
    this.apiService.query(e)
  }),
  (PkApiService.prototype.apartmentUpdate = function(a, b) {
    var c = {
      url: '/users/' + a + '/apartments/summary',
      method: 'get',
      withCredentials: !0,
      callbacks: b,
    }
    this.apiService.query(c)
  }),
  (PkApiService.prototype.requestApartmentsData = function(a, b, c) {
    var d = {
      url: '/apartments/',
      method: 'get',
      params: {
        id: a,
        limit: b,
      },
      callbacks: c,
    }
    this.apiService.query(d)
  }),
  (PkApiService.prototype.searchApartments = function(a, b, c) {
    var d = {
      url: '/search/' + a + '?' + $.param(b),
      method: 'get',
      withCredentials: !0,
      callbacks: c,
    }
    return this.apiService.query(d)
  }),
  (PkServerService.prototype.setViewsCounts = function(a, b) {
    var c = {
      url: 'apartments/views',
      method: 'get',
      params: {
        id: a,
      },
      callbacks: b,
    }
    this.apiService.query(c)
  }),
  (OpenStreetMapApiService.prototype.search = function(a, b) {
    var c = {
      url: '/search',
      method: 'get',
      params: {
        q: a,
        format: 'json',
        addressdetails: 1,
        countrycodes: 'by',
        limit: 10,
        'accept-language': 'ru',
      },
      callbacks: b,
    }
    return this.apiService.query(c)
  }),
  (OpenStreetMapApiService.prototype.reverse = function(a, b) {
    var c = {
      url: '/reverse',
      method: 'get',
      params: {
        lat: a.latitude,
        lon: a.longitude,
        format: 'json',
      },
      callbacks: b,
    }
    return this.apiService.query(c)
  }),
  (Tutorial.prototype.nextStep = function() {
    this.step(this.step() + 1)
  }),
  (Tutorial.prototype.goToStep = function(a) {
    this.step(a)
  }),
  (Tutorial.prototype.startTutorial = function() {
    this.tutorialActive(!0), this.popup.close()
  }),
  (Tutorial.prototype.finishTutorial = function(a) {
    return this.tutorialActive(!1), window.localStorage.setItem('tutorial-finished', 1), a
  }),
  (Tutorial.prototype.showTutorial = function() {
    !window.localStorage.getItem('tutorial-finished') && this.popup.open()
  }),
  (Tutorial.prototype._initPopup = function() {
    var a = this,
      b = document.getElementById('auctions-popup'),
      c = document.getElementById('auctions-popup-overlay')
    b && ko.applyBindings(this, b),
      c && ko.applyBindings(this, c),
      this.popup.initialized.subscribe(function(b) {
        b &&
          $(document).keyup(function(b) {
            var c = b.which || b.keyCode
            27 === c && a.finishTutorial()
          })
      })
  }),
  (function(a, b) {
    'object' == typeof module && 'object' == typeof module.exports
      ? (module.exports = b(window.jQuery))
      : (a.Popup = b(window.jQuery))
  })(this, function(a) {
    function b(b, c, d) {
      ;(this.selectors = a.extend(
        !0,
        {
          popups: '.js-popup-style',
          popup: '.js-popup-style[data-popup-id="' + b + '"]',
          close: '.js-popup-style-button-close',
          overlay: '.js-popup-style-overlay',
        },
        c,
      )),
        (this.modifiers = a.extend(
          !0,
          {
            overlayVisible: 'popup-style__overlay_visible',
            popupVisible: 'popup-style_visible',
          },
          d,
        )),
        (this.initialized = ko.observable(!1)),
        this.init(),
        this.attachEvents()
    }
    return (
      (b.prototype.init = function() {
        var b = this,
          c = this.selectors
        a(document).ready(function() {
          ;(b.$popups = a(c.popups)),
            (b.$popup = a(c.popup)),
            (b.$overlay = a(c.overlay)),
            b.$overlay.parent('body').length || b.$overlay.appendTo('body'),
            b.$popup.parent('body').length || b.$popup.appendTo('body'),
            b.initialized(!0)
        })
      }),
      (b.prototype.attachEvents = function() {
        var b = this,
          c = this.selectors,
          d = a(document),
          e = a(window)
        d.on('keydown', function(a) {
          27 === a.which && b.closeAll()
        }),
          d.on('click', c.overlay, function() {
            b.close()
          }),
          d.on('click', c.close, function() {
            b.close()
          }),
          'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0 ||
            e.resize(this.updatePosition.bind(this))
      }),
      (b.prototype.open = function() {
        var a = this.modifiers
        this.$overlay.addClass(a.overlayVisible), this.$popup.addClass(a.popupVisible), this.updatePosition()
      }),
      (b.prototype.closeAll = function() {
        var a = this.modifiers
        this.$overlay.removeClass(a.overlayVisible), this.$popups.removeClass(a.popupVisible)
      }),
      (b.prototype.close = function() {
        var a = this.modifiers
        this.$overlay.removeClass(a.overlayVisible),
          this.$popup.removeClass(a.popupVisible),
          this.$popup.css({
            top: 0,
            left: 0,
          })
      }),
      (b.prototype.updatePosition = function() {
        var b = a(window),
          c = this.$popup,
          d = (b.height() - c.outerHeight()) / 2,
          e = (b.width() - c.outerWidth()) / 2
        ;(d = Math.max(0, d)),
          (e = Math.max(0, e)),
          c.css({
            top: d + b.scrollTop(),
            left: e + b.scrollLeft(),
          })
      }),
      b
    )
  }),
  (function(a, b, c) {
    !(function(b) {
      var d = 'function' == typeof define && define.amd,
        e = 'https:' == c.location.protocol ? 'https:' : 'http:',
        f = 'cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.12/jquery.mousewheel.min.js'
      d ||
        a.event.special.mousewheel ||
        a('head').append(decodeURI('%3Cscript src=' + e + '//' + f + '%3E%3C/script%3E')),
        b()
    })(function() {
      var d = 'mCustomScrollbar',
        e = 'mCS',
        f = '.mCustomScrollbar',
        g = {
          setTop: 0,
          setLeft: 0,
          axis: 'y',
          scrollbarPosition: 'inside',
          scrollInertia: 950,
          autoDraggerLength: !0,
          alwaysShowScrollbar: 0,
          snapOffset: 0,
          mouseWheel: {
            enable: !0,
            scrollAmount: 'auto',
            axis: 'y',
            deltaFactor: 'auto',
            disableOver: ['select', 'option', 'keygen', 'datalist', 'textarea'],
          },
          scrollButtons: {
            scrollType: 'stepless',
            scrollAmount: 'auto',
          },
          keyboard: {
            enable: !0,
            scrollType: 'stepless',
            scrollAmount: 'auto',
          },
          contentTouchScroll: 25,
          advanced: {
            autoScrollOnFocus:
              "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
            updateOnContentResize: !0,
            updateOnImageLoad: !0,
          },
          theme: 'light',
          callbacks: {
            onTotalScrollOffset: 0,
            onTotalScrollBackOffset: 0,
            alwaysTriggerOffsets: !0,
          },
        },
        h = 0,
        i = {},
        j = b.attachEvent && !b.addEventListener ? 1 : 0,
        k = !1,
        l = [
          'mCSB_dragger_onDrag',
          'mCSB_scrollTools_onDrag',
          'mCS_img_loaded',
          'mCS_disabled',
          'mCS_destroyed',
          'mCS_no_scrollbar',
          'mCS-autoHide',
          'mCS-dir-rtl',
          'mCS_no_scrollbar_y',
          'mCS_no_scrollbar_x',
          'mCS_y_hidden',
          'mCS_x_hidden',
          'mCSB_draggerContainer',
          'mCSB_buttonUp',
          'mCSB_buttonDown',
          'mCSB_buttonLeft',
          'mCSB_buttonRight',
        ],
        m = {
          init: function(b) {
            var b = a.extend(!0, {}, g, b),
              c = n.call(this)
            if (b.live) {
              var d = b.liveSelector || this.selector || f,
                j = a(d)
              if ('off' === b.live) return void p(d)
              i[d] = setTimeout(function() {
                j.mCustomScrollbar(b), 'once' === b.live && j.length && p(d)
              }, 500)
            } else p(d)
            return (
              (b.setWidth = b.set_width ? b.set_width : b.setWidth),
              (b.setHeight = b.set_height ? b.set_height : b.setHeight),
              (b.axis = b.horizontalScroll ? 'x' : q(b.axis)),
              (b.scrollInertia = b.scrollInertia > 0 && b.scrollInertia < 17 ? 17 : b.scrollInertia),
              'object' != typeof b.mouseWheel &&
                1 == b.mouseWheel &&
                (b.mouseWheel = {
                  enable: !0,
                  scrollAmount: 'auto',
                  axis: 'y',
                  preventDefault: !1,
                  deltaFactor: 'auto',
                  normalizeDelta: !1,
                  invert: !1,
                }),
              (b.mouseWheel.scrollAmount = b.mouseWheelPixels ? b.mouseWheelPixels : b.mouseWheel.scrollAmount),
              (b.mouseWheel.normalizeDelta = b.advanced.normalizeMouseWheelDelta
                ? b.advanced.normalizeMouseWheelDelta
                : b.mouseWheel.normalizeDelta),
              (b.scrollButtons.scrollType = r(b.scrollButtons.scrollType)),
              o(b),
              a(c).each(function() {
                var c = a(this)
                if (!c.data(e)) {
                  c.data(e, {
                    idx: ++h,
                    opt: b,
                    scrollRatio: {
                      y: null,
                      x: null,
                    },
                    overflowed: null,
                    contentReset: {
                      y: null,
                      x: null,
                    },
                    bindEvents: !1,
                    tweenRunning: !1,
                    sequential: {},
                    langDir: c.css('direction'),
                    cbOffsets: null,
                    trigger: null,
                  })
                  var d = c.data(e),
                    f = d.opt,
                    g = c.data('mcs-axis'),
                    i = c.data('mcs-scrollbar-position'),
                    j = c.data('mcs-theme')
                  g && (f.axis = g),
                    i && (f.scrollbarPosition = i),
                    j && ((f.theme = j), o(f)),
                    s.call(this),
                    a('#mCSB_' + d.idx + '_container img:not(.' + l[2] + ')').addClass(l[2]),
                    m.update.call(null, c)
                }
              })
            )
          },
          update: function(b, c) {
            var d = b || n.call(this)
            return a(d).each(function() {
              var b = a(this)
              if (b.data(e)) {
                var d = b.data(e),
                  f = d.opt,
                  g = a('#mCSB_' + d.idx + '_container'),
                  h = [a('#mCSB_' + d.idx + '_dragger_vertical'), a('#mCSB_' + d.idx + '_dragger_horizontal')]
                if (!g.length) return
                d.tweenRunning && V(b),
                  b.hasClass(l[3]) && b.removeClass(l[3]),
                  b.hasClass(l[4]) && b.removeClass(l[4]),
                  w.call(this),
                  u.call(this),
                  'y' === f.axis || f.advanced.autoExpandHorizontalScroll || g.css('width', t(g.children())),
                  (d.overflowed = A.call(this)),
                  E.call(this),
                  f.autoDraggerLength && x.call(this),
                  y.call(this),
                  C.call(this)
                var i = [Math.abs(g[0].offsetTop), Math.abs(g[0].offsetLeft)]
                'x' !== f.axis &&
                  (d.overflowed[0]
                    ? h[0].height() > h[0].parent().height()
                      ? B.call(this)
                      : (W(b, i[0].toString(), {
                          dir: 'y',
                          dur: 0,
                          overwrite: 'none',
                        }),
                        (d.contentReset.y = null))
                    : (B.call(this),
                      'y' === f.axis
                        ? D.call(this)
                        : 'yx' === f.axis &&
                          d.overflowed[1] &&
                          W(b, i[1].toString(), {
                            dir: 'x',
                            dur: 0,
                            overwrite: 'none',
                          }))),
                  'y' !== f.axis &&
                    (d.overflowed[1]
                      ? h[1].width() > h[1].parent().width()
                        ? B.call(this)
                        : (W(b, i[1].toString(), {
                            dir: 'x',
                            dur: 0,
                            overwrite: 'none',
                          }),
                          (d.contentReset.x = null))
                      : (B.call(this),
                        'x' === f.axis
                          ? D.call(this)
                          : 'yx' === f.axis &&
                            d.overflowed[0] &&
                            W(b, i[0].toString(), {
                              dir: 'y',
                              dur: 0,
                              overwrite: 'none',
                            }))),
                  c &&
                    d &&
                    (2 === c && f.callbacks.onImageLoad && 'function' == typeof f.callbacks.onImageLoad
                      ? f.callbacks.onImageLoad.call(this)
                      : 3 === c && f.callbacks.onSelectorChange && 'function' == typeof f.callbacks.onSelectorChange
                        ? f.callbacks.onSelectorChange.call(this)
                        : f.callbacks.onUpdate &&
                          'function' == typeof f.callbacks.onUpdate &&
                          f.callbacks.onUpdate.call(this)),
                  T.call(this)
              }
            })
          },
          scrollTo: function(b, c) {
            if ('undefined' != typeof b && null != b) {
              var d = n.call(this)
              return a(d).each(function() {
                var d = a(this)
                if (d.data(e)) {
                  var f = d.data(e),
                    g = f.opt,
                    h = {
                      trigger: 'external',
                      scrollInertia: g.scrollInertia,
                      scrollEasing: 'mcsEaseInOut',
                      moveDragger: !1,
                      timeout: 60,
                      callbacks: !0,
                      onStart: !0,
                      onUpdate: !0,
                      onComplete: !0,
                    },
                    i = a.extend(!0, {}, h, c),
                    j = R.call(this, b),
                    k = i.scrollInertia > 0 && i.scrollInertia < 17 ? 17 : i.scrollInertia
                  ;(j[0] = S.call(this, j[0], 'y')),
                    (j[1] = S.call(this, j[1], 'x')),
                    i.moveDragger && ((j[0] *= f.scrollRatio.y), (j[1] *= f.scrollRatio.x)),
                    (i.dur = k),
                    setTimeout(function() {
                      null !== j[0] &&
                        'undefined' != typeof j[0] &&
                        'x' !== g.axis &&
                        f.overflowed[0] &&
                        ((i.dir = 'y'), (i.overwrite = 'all'), W(d, j[0].toString(), i)),
                        null !== j[1] &&
                          'undefined' != typeof j[1] &&
                          'y' !== g.axis &&
                          f.overflowed[1] &&
                          ((i.dir = 'x'), (i.overwrite = 'none'), W(d, j[1].toString(), i))
                    }, i.timeout)
                }
              })
            }
          },
          stop: function() {
            var b = n.call(this)
            return a(b).each(function() {
              var b = a(this)
              b.data(e) && V(b)
            })
          },
          disable: function(b) {
            var c = n.call(this)
            return a(c).each(function() {
              var c = a(this)
              if (c.data(e)) {
                c.data(e)
                T.call(this, 'remove'), D.call(this), b && B.call(this), E.call(this, !0), c.addClass(l[3])
              }
            })
          },
          destroy: function() {
            var b = n.call(this)
            return a(b).each(function() {
              var c = a(this)
              if (c.data(e)) {
                var f = c.data(e),
                  g = f.opt,
                  h = a('#mCSB_' + f.idx),
                  i = a('#mCSB_' + f.idx + '_container'),
                  j = a('.mCSB_' + f.idx + '_scrollbar')
                g.live && p(g.liveSelector || a(b).selector),
                  T.call(this, 'remove'),
                  D.call(this),
                  B.call(this),
                  c.removeData(e),
                  $(this, 'mcs'),
                  j.remove(),
                  i.find('img.' + l[2]).removeClass(l[2]),
                  h.replaceWith(i.contents()),
                  c
                    .removeClass(d + ' _' + e + '_' + f.idx + ' ' + l[6] + ' ' + l[7] + ' ' + l[5] + ' ' + l[3])
                    .addClass(l[4])
              }
            })
          },
        },
        n = function() {
          return 'object' != typeof a(this) || a(this).length < 1 ? f : this
        },
        o = function(b) {
          var c = ['rounded', 'rounded-dark', 'rounded-dots', 'rounded-dots-dark'],
            d = [
              'rounded-dots',
              'rounded-dots-dark',
              '3d',
              '3d-dark',
              '3d-thick',
              '3d-thick-dark',
              'inset',
              'inset-dark',
              'inset-2',
              'inset-2-dark',
              'inset-3',
              'inset-3-dark',
            ],
            e = ['minimal', 'minimal-dark'],
            f = ['minimal', 'minimal-dark'],
            g = ['minimal', 'minimal-dark']
          ;(b.autoDraggerLength = !(a.inArray(b.theme, c) > -1) && b.autoDraggerLength),
            (b.autoExpandScrollbar = !(a.inArray(b.theme, d) > -1) && b.autoExpandScrollbar),
            (b.scrollButtons.enable = !(a.inArray(b.theme, e) > -1) && b.scrollButtons.enable),
            (b.autoHideScrollbar = a.inArray(b.theme, f) > -1 || b.autoHideScrollbar),
            (b.scrollbarPosition = a.inArray(b.theme, g) > -1 ? 'outside' : b.scrollbarPosition)
        },
        p = function(a) {
          i[a] && (clearTimeout(i[a]), $(i, a))
        },
        q = function(a) {
          return 'yx' === a || 'xy' === a || 'auto' === a ? 'yx' : 'x' === a || 'horizontal' === a ? 'x' : 'y'
        },
        r = function(a) {
          return 'stepped' === a || 'pixels' === a || 'step' === a || 'click' === a ? 'stepped' : 'stepless'
        },
        s = function() {
          var b = a(this),
            c = b.data(e),
            f = c.opt,
            g = f.autoExpandScrollbar ? ' ' + l[1] + '_expand' : '',
            h = [
              "<div id='mCSB_" +
                c.idx +
                "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" +
                c.idx +
                '_scrollbar mCS-' +
                f.theme +
                ' mCSB_scrollTools_vertical' +
                g +
                "'><div class='" +
                l[12] +
                "'><div id='mCSB_" +
                c.idx +
                "_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>",
              "<div id='mCSB_" +
                c.idx +
                "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" +
                c.idx +
                '_scrollbar mCS-' +
                f.theme +
                ' mCSB_scrollTools_horizontal' +
                g +
                "'><div class='" +
                l[12] +
                "'><div id='mCSB_" +
                c.idx +
                "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>",
            ],
            i = 'yx' === f.axis ? 'mCSB_vertical_horizontal' : 'x' === f.axis ? 'mCSB_horizontal' : 'mCSB_vertical',
            j = 'yx' === f.axis ? h[0] + h[1] : 'x' === f.axis ? h[1] : h[0],
            k =
              'yx' === f.axis ? "<div id='mCSB_" + c.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : '',
            m = f.autoHideScrollbar ? ' ' + l[6] : '',
            n = 'x' !== f.axis && 'rtl' === c.langDir ? ' ' + l[7] : ''
          f.setWidth && b.css('width', f.setWidth),
            f.setHeight && b.css('height', f.setHeight),
            (f.setLeft = 'y' !== f.axis && 'rtl' === c.langDir ? '989999px' : f.setLeft),
            b
              .addClass(d + ' _' + e + '_' + c.idx + m + n)
              .wrapInner(
                "<div id='mCSB_" +
                  c.idx +
                  "' class='mCustomScrollBox mCS-" +
                  f.theme +
                  ' ' +
                  i +
                  "'><div id='mCSB_" +
                  c.idx +
                  "_container' class='mCSB_container' style='position:relative; top:" +
                  f.setTop +
                  '; left:' +
                  f.setLeft +
                  ";' dir=" +
                  c.langDir +
                  ' /></div>',
              )
          var o = a('#mCSB_' + c.idx),
            p = a('#mCSB_' + c.idx + '_container')
          'y' === f.axis || f.advanced.autoExpandHorizontalScroll || p.css('width', t(p.children())),
            'outside' === f.scrollbarPosition
              ? ('static' === b.css('position') && b.css('position', 'relative'),
                b.css('overflow', 'visible'),
                o.addClass('mCSB_outside').after(j))
              : (o.addClass('mCSB_inside').append(j), p.wrap(k)),
            v.call(this)
          var q = [a('#mCSB_' + c.idx + '_dragger_vertical'), a('#mCSB_' + c.idx + '_dragger_horizontal')]
          q[0].css('min-height', q[0].height()), q[1].css('min-width', q[1].width())
        },
        t = function(b) {
          return Math.max.apply(
            Math,
            b
              .map(function() {
                return a(this).outerWidth(!0)
              })
              .get(),
          )
        },
        u = function() {
          var b = a(this),
            c = b.data(e),
            d = c.opt,
            f = a('#mCSB_' + c.idx + '_container')
          d.advanced.autoExpandHorizontalScroll &&
            'y' !== d.axis &&
            f
              .css({
                position: 'absolute',
                width: 'auto',
              })
              .wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
              .css({
                width:
                  Math.ceil(f[0].getBoundingClientRect().right + 0.4) - Math.floor(f[0].getBoundingClientRect().left),
                position: 'relative',
              })
              .unwrap()
        },
        v = function() {
          var b = a(this),
            c = b.data(e),
            d = c.opt,
            f = a('.mCSB_' + c.idx + '_scrollbar:first'),
            g = ba(d.scrollButtons.tabindex) ? "tabindex='" + d.scrollButtons.tabindex + "'" : '',
            h = [
              "<a href='#' class='" + l[13] + "' oncontextmenu='return false;' " + g + ' />',
              "<a href='#' class='" + l[14] + "' oncontextmenu='return false;' " + g + ' />',
              "<a href='#' class='" + l[15] + "' oncontextmenu='return false;' " + g + ' />',
              "<a href='#' class='" + l[16] + "' oncontextmenu='return false;' " + g + ' />',
            ],
            i = ['x' === d.axis ? h[2] : h[0], 'x' === d.axis ? h[3] : h[1], h[2], h[3]]
          d.scrollButtons.enable &&
            f
              .prepend(i[0])
              .append(i[1])
              .next('.mCSB_scrollTools')
              .prepend(i[2])
              .append(i[3])
        },
        w = function() {
          var b = a(this),
            c = b.data(e),
            d = a('#mCSB_' + c.idx),
            f = b.css('max-height') || 'none',
            g = f.indexOf('%') !== -1,
            h = b.css('box-sizing')
          if ('none' !== f) {
            var i = g ? (b.parent().height() * parseInt(f)) / 100 : parseInt(f)
            'border-box' === h && (i -= b.innerHeight() - b.height() + (b.outerHeight() - b.innerHeight())),
              d.css('max-height', Math.round(i))
          }
        },
        x = function() {
          var b = a(this),
            c = b.data(e),
            d = a('#mCSB_' + c.idx),
            f = a('#mCSB_' + c.idx + '_container'),
            g = [a('#mCSB_' + c.idx + '_dragger_vertical'), a('#mCSB_' + c.idx + '_dragger_horizontal')],
            h = [d.height() / f.outerHeight(!1), d.width() / f.outerWidth(!1)],
            i = [
              parseInt(g[0].css('min-height')),
              Math.round(h[0] * g[0].parent().height()),
              parseInt(g[1].css('min-width')),
              Math.round(h[1] * g[1].parent().width()),
            ],
            k = j && i[1] < i[0] ? i[0] : i[1],
            l = j && i[3] < i[2] ? i[2] : i[3]
          g[0]
            .css({
              height: k,
              'max-height': g[0].parent().height() - 10,
            })
            .find('.mCSB_dragger_bar')
            .css({
              'line-height': i[0] + 'px',
            }),
            g[1].css({
              width: l,
              'max-width': g[1].parent().width() - 10,
            })
        },
        y = function() {
          var b = a(this),
            c = b.data(e),
            d = a('#mCSB_' + c.idx),
            f = a('#mCSB_' + c.idx + '_container'),
            g = [a('#mCSB_' + c.idx + '_dragger_vertical'), a('#mCSB_' + c.idx + '_dragger_horizontal')],
            h = [f.outerHeight(!1) - d.height(), f.outerWidth(!1) - d.width()],
            i = [h[0] / (g[0].parent().height() - g[0].height()), h[1] / (g[1].parent().width() - g[1].width())]
          c.scrollRatio = {
            y: i[0],
            x: i[1],
          }
        },
        z = function(a, b, c) {
          var d = c ? l[0] + '_expanded' : '',
            e = a.closest('.mCSB_scrollTools')
          'active' === b
            ? (a.toggleClass(l[0] + ' ' + d), e.toggleClass(l[1]), (a[0]._draggable = a[0]._draggable ? 0 : 1))
            : a[0]._draggable ||
              ('hide' === b ? (a.removeClass(l[0]), e.removeClass(l[1])) : (a.addClass(l[0]), e.addClass(l[1])))
        },
        A = function() {
          var b = a(this),
            c = b.data(e),
            d = a('#mCSB_' + c.idx),
            f = a('#mCSB_' + c.idx + '_container'),
            g = null == c.overflowed ? f.height() : f.outerHeight(!1),
            h = null == c.overflowed ? f.width() : f.outerWidth(!1)
          return [g > d.height(), h > d.width()]
        },
        B = function() {
          var b = a(this),
            c = b.data(e),
            d = c.opt,
            f = a('#mCSB_' + c.idx),
            g = a('#mCSB_' + c.idx + '_container'),
            h = [a('#mCSB_' + c.idx + '_dragger_vertical'), a('#mCSB_' + c.idx + '_dragger_horizontal')]
          if (
            (V(b),
            (('x' !== d.axis && !c.overflowed[0]) || ('y' === d.axis && c.overflowed[0])) &&
              (h[0].add(g).css('top', 0), W(b, '_resetY')),
            ('y' !== d.axis && !c.overflowed[1]) || ('x' === d.axis && c.overflowed[1]))
          ) {
            var i = (dx = 0)
            'rtl' === c.langDir && ((i = f.width() - g.outerWidth(!1)), (dx = Math.abs(i / c.scrollRatio.x))),
              g.css('left', i),
              h[1].css('left', dx),
              W(b, '_resetX')
          }
        },
        C = function() {
          function b() {
            g = setTimeout(function() {
              a.event.special.mousewheel ? (clearTimeout(g), J.call(c[0])) : b()
            }, 100)
          }
          var c = a(this),
            d = c.data(e),
            f = d.opt
          if (!d.bindEvents) {
            if ((G.call(this), f.contentTouchScroll && H.call(this), I.call(this), f.mouseWheel.enable)) {
              var g
              b()
            }
            L.call(this),
              N.call(this),
              f.advanced.autoScrollOnFocus && M.call(this),
              f.scrollButtons.enable && O.call(this),
              f.keyboard.enable && P.call(this),
              (d.bindEvents = !0)
          }
        },
        D = function() {
          var b = a(this),
            d = b.data(e),
            f = d.opt,
            g = e + '_' + d.idx,
            h = '.mCSB_' + d.idx + '_scrollbar',
            i = a(
              '#mCSB_' +
                d.idx +
                ',#mCSB_' +
                d.idx +
                '_container,#mCSB_' +
                d.idx +
                '_container_wrapper,' +
                h +
                ' .' +
                l[12] +
                ',#mCSB_' +
                d.idx +
                '_dragger_vertical,#mCSB_' +
                d.idx +
                '_dragger_horizontal,' +
                h +
                '>a',
            ),
            j = a('#mCSB_' + d.idx + '_container')
          f.advanced.releaseDraggableSelectors && i.add(a(f.advanced.releaseDraggableSelectors)),
            d.bindEvents &&
              (a(c).unbind('.' + g),
              i.each(function() {
                a(this).unbind('.' + g)
              }),
              clearTimeout(b[0]._focusTimeout),
              $(b[0], '_focusTimeout'),
              clearTimeout(d.sequential.step),
              $(d.sequential, 'step'),
              clearTimeout(j[0].onCompleteTimeout),
              $(j[0], 'onCompleteTimeout'),
              (d.bindEvents = !1))
        },
        E = function(b) {
          var c = a(this),
            d = c.data(e),
            f = d.opt,
            g = a('#mCSB_' + d.idx + '_container_wrapper'),
            h = g.length ? g : a('#mCSB_' + d.idx + '_container'),
            i = [a('#mCSB_' + d.idx + '_scrollbar_vertical'), a('#mCSB_' + d.idx + '_scrollbar_horizontal')],
            j = [i[0].find('.mCSB_dragger'), i[1].find('.mCSB_dragger')]
          'x' !== f.axis &&
            (d.overflowed[0] && !b
              ? (i[0]
                  .add(j[0])
                  .add(i[0].children('a'))
                  .css('display', 'block'),
                h.removeClass(l[8] + ' ' + l[10]))
              : (f.alwaysShowScrollbar
                  ? (2 !== f.alwaysShowScrollbar && j[0].add(i[0].children('a')).css('display', 'none'),
                    h.removeClass(l[10]))
                  : (i[0].css('display', 'none'), h.addClass(l[10])),
                h.addClass(l[8]))),
            'y' !== f.axis &&
              (d.overflowed[1] && !b
                ? (i[1]
                    .add(j[1])
                    .add(i[1].children('a'))
                    .css('display', 'block'),
                  h.removeClass(l[9] + ' ' + l[11]))
                : (f.alwaysShowScrollbar
                    ? (2 !== f.alwaysShowScrollbar && j[1].add(i[1].children('a')).css('display', 'none'),
                      h.removeClass(l[11]))
                    : (i[1].css('display', 'none'), h.addClass(l[11])),
                  h.addClass(l[9]))),
            d.overflowed[0] || d.overflowed[1] ? c.removeClass(l[5]) : c.addClass(l[5])
        },
        F = function(a) {
          var b = a.type
          switch (b) {
            case 'pointerdown':
            case 'MSPointerDown':
            case 'pointermove':
            case 'MSPointerMove':
            case 'pointerup':
            case 'MSPointerUp':
              return [a.originalEvent.pageY, a.originalEvent.pageX, !1]
            case 'touchstart':
            case 'touchmove':
            case 'touchend':
              var c = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0],
                d = a.originalEvent.touches.length || a.originalEvent.changedTouches.length
              return [c.pageY, c.pageX, d > 1]
            default:
              return [a.pageY, a.pageX, !1]
          }
        },
        G = function() {
          function b(a) {
            var b = p.find('iframe')
            if (b.length) {
              var c = a ? 'auto' : 'none'
              b.css('pointer-events', c)
            }
          }

          function d(a, b, c, d) {
            if (((p[0].idleTimer = m.scrollInertia < 233 ? 250 : 0), f.attr('id') === o[1]))
              var e = 'x',
                g = (f[0].offsetLeft - b + d) * l.scrollRatio.x
            else
              var e = 'y',
                g = (f[0].offsetTop - a + c) * l.scrollRatio.y
            W(i, g.toString(), {
              dir: e,
              drag: !0,
            })
          }
          var f,
            g,
            h,
            i = a(this),
            l = i.data(e),
            m = l.opt,
            n = e + '_' + l.idx,
            o = ['mCSB_' + l.idx + '_dragger_vertical', 'mCSB_' + l.idx + '_dragger_horizontal'],
            p = a('#mCSB_' + l.idx + '_container'),
            q = a('#' + o[0] + ',#' + o[1]),
            r = m.advanced.releaseDraggableSelectors ? q.add(a(m.advanced.releaseDraggableSelectors)) : q
          q
            .bind('mousedown.' + n + ' touchstart.' + n + ' pointerdown.' + n + ' MSPointerDown.' + n, function(d) {
              if ((d.stopImmediatePropagation(), d.preventDefault(), _(d))) {
                ;(k = !0),
                  j &&
                    (c.onselectstart = function() {
                      return !1
                    }),
                  b(!1),
                  V(i),
                  (f = a(this))
                var e = f.offset(),
                  l = F(d)[0] - e.top,
                  n = F(d)[1] - e.left,
                  o = f.height() + e.top,
                  p = f.width() + e.left
                l < o && l > 0 && n < p && n > 0 && ((g = l), (h = n)), z(f, 'active', m.autoExpandScrollbar)
              }
            })
            .bind('touchmove.' + n, function(a) {
              a.stopImmediatePropagation(), a.preventDefault()
              var b = f.offset(),
                c = F(a)[0] - b.top,
                e = F(a)[1] - b.left
              d(g, h, c, e)
            }),
            a(c)
              .bind('mousemove.' + n + ' pointermove.' + n + ' MSPointerMove.' + n, function(a) {
                if (f) {
                  var b = f.offset(),
                    c = F(a)[0] - b.top,
                    e = F(a)[1] - b.left
                  if (g === c) return
                  d(g, h, c, e)
                }
              })
              .add(r)
              .bind('mouseup.' + n + ' touchend.' + n + ' pointerup.' + n + ' MSPointerUp.' + n, function(a) {
                f && (z(f, 'active', m.autoExpandScrollbar), (f = null)), (k = !1), j && (c.onselectstart = null), b(!0)
              })
        },
        H = function() {
          function b(a, b) {
            var c = [1.5 * b, 2 * b, b / 1.5, b / 2]
            return a > 90
              ? b > 4
                ? c[0]
                : c[3]
              : a > 60
                ? b > 3
                  ? c[3]
                  : c[2]
                : a > 30
                  ? b > 8
                    ? c[1]
                    : b > 6
                      ? c[0]
                      : b > 4
                        ? b
                        : c[2]
                  : b > 8
                    ? b
                    : c[3]
          }

          function c(a, b, c, d, e, f) {
            a &&
              W(q, a.toString(), {
                dur: b,
                scrollEasing: c,
                dir: d,
                overwrite: e,
                drag: f,
              })
          }
          var d,
            f,
            g,
            h,
            i,
            j,
            l,
            m,
            n,
            o,
            p,
            q = a(this),
            r = q.data(e),
            s = r.opt,
            t = e + '_' + r.idx,
            u = a('#mCSB_' + r.idx),
            v = a('#mCSB_' + r.idx + '_container'),
            w = [a('#mCSB_' + r.idx + '_dragger_vertical'), a('#mCSB_' + r.idx + '_dragger_horizontal')],
            x = [],
            y = [],
            z = 0,
            A = 'yx' === s.axis ? 'none' : 'all',
            B = []
          v
            .bind('touchstart.' + t + ' pointerdown.' + t + ' MSPointerDown.' + t, function(a) {
              if (aa(a) && !k && !F(a)[2]) {
                var b = v.offset()
                ;(d = F(a)[0] - b.top), (f = F(a)[1] - b.left), (B = [F(a)[0], F(a)[1]])
              }
            })
            .bind('touchmove.' + t + ' pointermove.' + t + ' MSPointerMove.' + t, function(a) {
              if (aa(a) && !k && !F(a)[2]) {
                a.stopImmediatePropagation(), (j = Y())
                var b = u.offset(),
                  e = F(a)[0] - b.top,
                  g = F(a)[1] - b.left,
                  h = 'mcsLinearOut'
                if (
                  (x.push(e),
                  y.push(g),
                  (B[2] = Math.abs(F(a)[0] - B[0])),
                  (B[3] = Math.abs(F(a)[1] - B[1])),
                  r.overflowed[0])
                )
                  var i = w[0].parent().height() - w[0].height(),
                    l = d - e > 0 && e - d > -(i * r.scrollRatio.y) && (2 * B[3] < B[2] || 'yx' === s.axis)
                if (r.overflowed[1])
                  var m = w[1].parent().width() - w[1].width(),
                    n = f - g > 0 && g - f > -(m * r.scrollRatio.x) && (2 * B[2] < B[3] || 'yx' === s.axis)
                ;(l || n) && a.preventDefault(),
                  (o = 'yx' === s.axis ? [d - e, f - g] : 'x' === s.axis ? [null, f - g] : [d - e, null]),
                  (v[0].idleTimer = 250),
                  r.overflowed[0] && c(o[0], z, h, 'y', 'all', !0),
                  r.overflowed[1] && c(o[1], z, h, 'x', A, !0)
              }
            }),
            u
              .bind('touchstart.' + t + ' pointerdown.' + t + ' MSPointerDown.' + t, function(a) {
                if (aa(a) && !k && !F(a)[2]) {
                  a.stopImmediatePropagation(), V(q), (i = Y())
                  var b = u.offset()
                  ;(g = F(a)[0] - b.top), (h = F(a)[1] - b.left), (x = []), (y = [])
                }
              })
              .bind('touchend.' + t + ' pointerup.' + t + ' MSPointerUp.' + t, function(a) {
                if (aa(a) && !k && !F(a)[2]) {
                  a.stopImmediatePropagation(), (l = Y())
                  var d = u.offset(),
                    e = F(a)[0] - d.top,
                    f = F(a)[1] - d.left
                  if (!(l - j > 30)) {
                    n = 1e3 / (l - i)
                    var q = 'mcsEaseOut',
                      t = n < 2.5,
                      w = t ? [x[x.length - 2], y[y.length - 2]] : [0, 0]
                    m = t ? [e - w[0], f - w[1]] : [e - g, f - h]
                    var z = [Math.abs(m[0]), Math.abs(m[1])]
                    n = t ? [Math.abs(m[0] / 4), Math.abs(m[1] / 4)] : [n, n]
                    var B = [
                      Math.abs(v[0].offsetTop) - m[0] * b(z[0] / n[0], n[0]),
                      Math.abs(v[0].offsetLeft) - m[1] * b(z[1] / n[1], n[1]),
                    ]
                    ;(o = 'yx' === s.axis ? [B[0], B[1]] : 'x' === s.axis ? [null, B[1]] : [B[0], null]),
                      (p = [4 * z[0] + s.scrollInertia, 4 * z[1] + s.scrollInertia])
                    var C = parseInt(s.contentTouchScroll) || 0
                    ;(o[0] = z[0] > C ? o[0] : 0),
                      (o[1] = z[1] > C ? o[1] : 0),
                      r.overflowed[0] && c(o[0], p[0], q, 'y', A, !1),
                      r.overflowed[1] && c(o[1], p[1], q, 'x', A, !1)
                  }
                }
              })
        },
        I = function() {
          function d() {
            return b.getSelection
              ? b.getSelection().toString()
              : c.selection && 'Control' != c.selection.type
                ? c.selection.createRange().text
                : 0
          }

          function f(a, b, c) {
            ;(l.type = c && g ? 'stepped' : 'stepless'),
              (l.scrollAmount = 10),
              Q(h, a, b, 'mcsLinearOut', c ? 60 : null)
          }
          var g,
            h = a(this),
            i = h.data(e),
            j = i.opt,
            l = i.sequential,
            m = e + '_' + i.idx,
            n = a('#mCSB_' + i.idx + '_container'),
            o = n.parent()
          n.bind('mousedown.' + m, function(a) {
            g || ((g = 1), (k = !0))
          })
            .add(c)
            .bind('mousemove.' + m, function(a) {
              if (g && d()) {
                var b = n.offset(),
                  c = F(a)[0] - b.top + n[0].offsetTop,
                  e = F(a)[1] - b.left + n[0].offsetLeft
                c > 0 && c < o.height() && e > 0 && e < o.width()
                  ? l.step && f('off', null, 'stepped')
                  : ('x' !== j.axis && i.overflowed[0] && (c < 0 ? f('on', 38) : c > o.height() && f('on', 40)),
                    'y' !== j.axis && i.overflowed[1] && (e < 0 ? f('on', 37) : e > o.width() && f('on', 39)))
              }
            })
            .bind('mouseup.' + m, function(a) {
              g && ((g = 0), f('off', null)), (k = !1)
            })
        },
        J = function() {
          function b(a) {
            var b = null
            try {
              var c = a.contentDocument || a.contentWindow.document
              b = c.body.innerHTML
            } catch (a) {}
            return null !== b
          }
          var c = a(this),
            d = c.data(e)
          if (d) {
            var f = d.opt,
              g = e + '_' + d.idx,
              h = a('#mCSB_' + d.idx),
              i = [a('#mCSB_' + d.idx + '_dragger_vertical'), a('#mCSB_' + d.idx + '_dragger_horizontal')],
              k = a('#mCSB_' + d.idx + '_container').find('iframe'),
              l = h
            k.length &&
              k.each(function() {
                var c = this
                b(c) &&
                  (l = l.add(
                    a(c)
                      .contents()
                      .find('body'),
                  ))
              }),
              l.bind('mousewheel.' + g, function(b, e) {
                if ((V(c), !K(c, b.target))) {
                  var g =
                    'auto' !== f.mouseWheel.deltaFactor
                      ? parseInt(f.mouseWheel.deltaFactor)
                      : j && b.deltaFactor < 100
                        ? 100
                        : b.deltaFactor || 100
                  if ('x' === f.axis || 'x' === f.mouseWheel.axis)
                    var k = 'x',
                      l = [Math.round(g * d.scrollRatio.x), parseInt(f.mouseWheel.scrollAmount)],
                      m = 'auto' !== f.mouseWheel.scrollAmount ? l[1] : l[0] >= h.width() ? 0.9 * h.width() : l[0],
                      n = Math.abs(a('#mCSB_' + d.idx + '_container')[0].offsetLeft),
                      o = i[1][0].offsetLeft,
                      p = i[1].parent().width() - i[1].width(),
                      q = b.deltaX || b.deltaY || e
                  else
                    var k = 'y',
                      l = [Math.round(g * d.scrollRatio.y), parseInt(f.mouseWheel.scrollAmount)],
                      m = 'auto' !== f.mouseWheel.scrollAmount ? l[1] : l[0] >= h.height() ? 0.9 * h.height() : l[0],
                      n = Math.abs(a('#mCSB_' + d.idx + '_container')[0].offsetTop),
                      o = i[0][0].offsetTop,
                      p = i[0].parent().height() - i[0].height(),
                      q = b.deltaY || e
                  ;('y' === k && !d.overflowed[0]) ||
                    ('x' === k && !d.overflowed[1]) ||
                    (f.mouseWheel.invert && (q = -q),
                    f.mouseWheel.normalizeDelta && (q = q < 0 ? -1 : 1),
                    ((q > 0 && 0 !== o) || (q < 0 && o !== p) || f.mouseWheel.preventDefault) &&
                      (b.stopImmediatePropagation(), b.preventDefault()),
                    W(c, (n - q * m).toString(), {
                      dir: k,
                    }))
                }
              })
          }
        },
        K = function(b, c) {
          var d = c.nodeName.toLowerCase(),
            f = b.data(e).opt.mouseWheel.disableOver,
            g = ['select', 'textarea']
          return a.inArray(d, f) > -1 && !(a.inArray(d, g) > -1 && !a(c).is(':focus'))
        },
        L = function() {
          var b = a(this),
            c = b.data(e),
            d = e + '_' + c.idx,
            f = a('#mCSB_' + c.idx + '_container'),
            g = f.parent(),
            h = a('.mCSB_' + c.idx + '_scrollbar .' + l[12])
          h.bind('touchstart.' + d + ' pointerdown.' + d + ' MSPointerDown.' + d, function(a) {
            k = !0
          })
            .bind('touchend.' + d + ' pointerup.' + d + ' MSPointerUp.' + d, function(a) {
              k = !1
            })
            .bind('click.' + d, function(d) {
              if (a(d.target).hasClass(l[12]) || a(d.target).hasClass('mCSB_draggerRail')) {
                V(b)
                var e = a(this),
                  h = e.find('.mCSB_dragger')
                if (e.parent('.mCSB_scrollTools_horizontal').length > 0) {
                  if (!c.overflowed[1]) return
                  var i = 'x',
                    j = d.pageX > h.offset().left ? -1 : 1,
                    k = Math.abs(f[0].offsetLeft) - j * (0.9 * g.width())
                } else {
                  if (!c.overflowed[0]) return
                  var i = 'y',
                    j = d.pageY > h.offset().top ? -1 : 1,
                    k = Math.abs(f[0].offsetTop) - j * (0.9 * g.height())
                }
                W(b, k.toString(), {
                  dir: i,
                  scrollEasing: 'mcsEaseInOut',
                })
              }
            })
        },
        M = function() {
          var b = a(this),
            d = b.data(e),
            f = d.opt,
            g = e + '_' + d.idx,
            h = a('#mCSB_' + d.idx + '_container'),
            i = h.parent()
          h.bind('focusin.' + g, function(d) {
            var e = a(c.activeElement),
              g = h.find('.mCustomScrollBox').length,
              j = 0
            e.is(f.advanced.autoScrollOnFocus) &&
              (V(b),
              clearTimeout(b[0]._focusTimeout),
              (b[0]._focusTimer = g ? (j + 17) * g : 0),
              (b[0]._focusTimeout = setTimeout(function() {
                var a = [ca(e)[0], ca(e)[1]],
                  c = [h[0].offsetTop, h[0].offsetLeft],
                  d = [
                    c[0] + a[0] >= 0 && c[0] + a[0] < i.height() - e.outerHeight(!1),
                    c[1] + a[1] >= 0 && c[0] + a[1] < i.width() - e.outerWidth(!1),
                  ],
                  g = 'yx' !== f.axis || d[0] || d[1] ? 'all' : 'none'
                'x' === f.axis ||
                  d[0] ||
                  W(b, a[0].toString(), {
                    dir: 'y',
                    scrollEasing: 'mcsEaseInOut',
                    overwrite: g,
                    dur: j,
                  }),
                  'y' === f.axis ||
                    d[1] ||
                    W(b, a[1].toString(), {
                      dir: 'x',
                      scrollEasing: 'mcsEaseInOut',
                      overwrite: g,
                      dur: j,
                    })
              }, b[0]._focusTimer)))
          })
        },
        N = function() {
          var b = a(this),
            c = b.data(e),
            d = e + '_' + c.idx,
            f = a('#mCSB_' + c.idx + '_container').parent()
          f.bind('scroll.' + d, function(b) {
            ;(0 === f.scrollTop() && 0 === f.scrollLeft()) ||
              a('.mCSB_' + c.idx + '_scrollbar').css('visibility', 'hidden')
          })
        },
        O = function() {
          var b = a(this),
            c = b.data(e),
            d = c.opt,
            f = c.sequential,
            g = e + '_' + c.idx,
            h = '.mCSB_' + c.idx + '_scrollbar',
            i = a(h + '>a')
          i.bind(
            'mousedown.' +
              g +
              ' touchstart.' +
              g +
              ' pointerdown.' +
              g +
              ' MSPointerDown.' +
              g +
              ' mouseup.' +
              g +
              ' touchend.' +
              g +
              ' pointerup.' +
              g +
              ' MSPointerUp.' +
              g +
              ' mouseout.' +
              g +
              ' pointerout.' +
              g +
              ' MSPointerOut.' +
              g +
              ' click.' +
              g,
            function(e) {
              function g(a, c) {
                ;(f.scrollAmount = d.snapAmount || d.scrollButtons.scrollAmount), Q(b, a, c)
              }
              if ((e.preventDefault(), _(e))) {
                var h = a(this).attr('class')
                switch (((f.type = d.scrollButtons.scrollType), e.type)) {
                  case 'mousedown':
                  case 'touchstart':
                  case 'pointerdown':
                  case 'MSPointerDown':
                    if ('stepped' === f.type) return
                    ;(k = !0), (c.tweenRunning = !1), g('on', h)
                    break
                  case 'mouseup':
                  case 'touchend':
                  case 'pointerup':
                  case 'MSPointerUp':
                  case 'mouseout':
                  case 'pointerout':
                  case 'MSPointerOut':
                    if ('stepped' === f.type) return
                    ;(k = !1), f.dir && g('off', h)
                    break
                  case 'click':
                    if ('stepped' !== f.type || c.tweenRunning) return
                    g('on', h)
                }
              }
            },
          )
        },
        P = function() {
          var b = a(this),
            d = b.data(e),
            f = d.opt,
            g = d.sequential,
            h = e + '_' + d.idx,
            i = a('#mCSB_' + d.idx),
            j = a('#mCSB_' + d.idx + '_container'),
            k = j.parent(),
            l = "input,textarea,select,datalist,keygen,[contenteditable='true']"
          i.attr('tabindex', '0').bind('blur.' + h + ' keydown.' + h + ' keyup.' + h, function(e) {
            function h(a, c) {
              ;(g.type = f.keyboard.scrollType),
                (g.scrollAmount = f.snapAmount || f.keyboard.scrollAmount),
                ('stepped' === g.type && d.tweenRunning) || Q(b, a, c)
            }
            switch (e.type) {
              case 'blur':
                d.tweenRunning && g.dir && h('off', null)
                break
              case 'keydown':
              case 'keyup':
                var i = e.keyCode ? e.keyCode : e.which,
                  m = 'on'
                if (('x' !== f.axis && (38 === i || 40 === i)) || ('y' !== f.axis && (37 === i || 39 === i))) {
                  if (((38 === i || 40 === i) && !d.overflowed[0]) || ((37 === i || 39 === i) && !d.overflowed[1]))
                    return
                  'keyup' === e.type && (m = 'off'),
                    a(c.activeElement).is(l) || (e.preventDefault(), e.stopImmediatePropagation(), h(m, i))
                } else if (33 === i || 34 === i) {
                  if (
                    ((d.overflowed[0] || d.overflowed[1]) && (e.preventDefault(), e.stopImmediatePropagation()),
                    'keyup' === e.type)
                  ) {
                    V(b)
                    var n = 34 === i ? -1 : 1
                    if ('x' === f.axis || ('yx' === f.axis && d.overflowed[1] && !d.overflowed[0]))
                      var o = 'x',
                        p = Math.abs(j[0].offsetLeft) - n * (0.9 * k.width())
                    else
                      var o = 'y',
                        p = Math.abs(j[0].offsetTop) - n * (0.9 * k.height())
                    W(b, p.toString(), {
                      dir: o,
                      scrollEasing: 'mcsEaseInOut',
                    })
                  }
                } else if (
                  (35 === i || 36 === i) &&
                  !a(c.activeElement).is(l) &&
                  ((d.overflowed[0] || d.overflowed[1]) && (e.preventDefault(), e.stopImmediatePropagation()),
                  'keyup' === e.type)
                ) {
                  if ('x' === f.axis || ('yx' === f.axis && d.overflowed[1] && !d.overflowed[0]))
                    var o = 'x',
                      p = 35 === i ? Math.abs(k.width() - j.outerWidth(!1)) : 0
                  else
                    var o = 'y',
                      p = 35 === i ? Math.abs(k.height() - j.outerHeight(!1)) : 0
                  W(b, p.toString(), {
                    dir: o,
                    scrollEasing: 'mcsEaseInOut',
                  })
                }
            }
          })
        },
        Q = function(b, c, d, f, g) {
          function h(a) {
            var c = 'stepped' !== m.type,
              d = g ? g : a ? (c ? k.scrollInertia / 1.5 : k.scrollInertia) : 1e3 / 60,
              e = a ? (c ? 7.5 : 40) : 2.5,
              i = [Math.abs(n[0].offsetTop), Math.abs(n[0].offsetLeft)],
              l = [j.scrollRatio.y > 10 ? 10 : j.scrollRatio.y, j.scrollRatio.x > 10 ? 10 : j.scrollRatio.x],
              o = 'x' === m.dir[0] ? i[1] + m.dir[1] * (l[1] * e) : i[0] + m.dir[1] * (l[0] * e),
              p =
                'x' === m.dir[0]
                  ? i[1] + m.dir[1] * parseInt(m.scrollAmount)
                  : i[0] + m.dir[1] * parseInt(m.scrollAmount),
              q = 'auto' !== m.scrollAmount ? p : o,
              r = f ? f : a ? (c ? 'mcsLinearOut' : 'mcsEaseInOut') : 'mcsLinear',
              s = !!a
            return (
              a && d < 17 && (q = 'x' === m.dir[0] ? i[1] : i[0]),
              W(b, q.toString(), {
                dir: m.dir[0],
                scrollEasing: r,
                dur: d,
                onComplete: s,
              }),
              a
                ? void (m.dir = !1)
                : (clearTimeout(m.step),
                  void (m.step = setTimeout(function() {
                    h()
                  }, d)))
            )
          }

          function i() {
            clearTimeout(m.step), $(m, 'step'), V(b)
          }
          var j = b.data(e),
            k = j.opt,
            m = j.sequential,
            n = a('#mCSB_' + j.idx + '_container'),
            o = 'stepped' === m.type
          switch (c) {
            case 'on':
              if (
                ((m.dir = [
                  d === l[16] || d === l[15] || 39 === d || 37 === d ? 'x' : 'y',
                  d === l[13] || d === l[15] || 38 === d || 37 === d ? -1 : 1,
                ]),
                V(b),
                ba(d) && 'stepped' === m.type)
              )
                return
              h(o)
              break
            case 'off':
              i(), (o || (j.tweenRunning && m.dir)) && h(!0)
          }
        },
        R = function(b) {
          var c = a(this).data(e).opt,
            d = []
          return (
            'function' == typeof b && (b = b()),
            b instanceof Array
              ? (d = b.length > 1 ? [b[0], b[1]] : 'x' === c.axis ? [null, b[0]] : [b[0], null])
              : ((d[0] = b.y ? b.y : b.x || 'x' === c.axis ? null : b),
                (d[1] = b.x ? b.x : b.y || 'y' === c.axis ? null : b)),
            'function' == typeof d[0] && (d[0] = d[0]()),
            'function' == typeof d[1] && (d[1] = d[1]()),
            d
          )
        },
        S = function(b, c) {
          if (null != b && 'undefined' != typeof b) {
            var d = a(this),
              f = d.data(e),
              g = f.opt,
              h = a('#mCSB_' + f.idx + '_container'),
              i = h.parent(),
              j = typeof b
            c || (c = 'x' === g.axis ? 'x' : 'y')
            var k = 'x' === c ? h.outerWidth(!1) : h.outerHeight(!1),
              l = 'x' === c ? h[0].offsetLeft : h[0].offsetTop,
              n = 'x' === c ? 'left' : 'top'
            switch (j) {
              case 'function':
                return b()
              case 'object':
                var o = b.jquery ? b : a(b)
                if (!o.length) return
                return 'x' === c ? ca(o)[1] : ca(o)[0]
              case 'string':
              case 'number':
                if (ba(b)) return Math.abs(b)
                if (b.indexOf('%') !== -1) return Math.abs((k * parseInt(b)) / 100)
                if (b.indexOf('-=') !== -1) return Math.abs(l - parseInt(b.split('-=')[1]))
                if (b.indexOf('+=') !== -1) {
                  var p = l + parseInt(b.split('+=')[1])
                  return p >= 0 ? 0 : Math.abs(p)
                }
                if (b.indexOf('px') !== -1 && ba(b.split('px')[0])) return Math.abs(b.split('px')[0])
                if ('top' === b || 'left' === b) return 0
                if ('bottom' === b) return Math.abs(i.height() - h.outerHeight(!1))
                if ('right' === b) return Math.abs(i.width() - h.outerWidth(!1))
                if ('first' === b || 'last' === b) {
                  var o = h.find(':' + b)
                  return 'x' === c ? ca(o)[1] : ca(o)[0]
                }
                return a(b).length
                  ? 'x' === c
                    ? ca(a(b))[1]
                    : ca(a(b))[0]
                  : (h.css(n, b), void m.update.call(null, d[0]))
            }
          }
        },
        T = function(b) {
          function c() {
            clearTimeout(n[0].autoUpdate),
              (n[0].autoUpdate = setTimeout(function() {
                return k.advanced.updateOnSelectorChange && ((o = g()), o !== u)
                  ? (h(3), void (u = o))
                  : (k.advanced.updateOnContentResize &&
                      ((p = [n.outerHeight(!1), n.outerWidth(!1), r.height(), r.width(), t()[0], t()[1]]),
                      (p[0] === v[0] &&
                        p[1] === v[1] &&
                        p[2] === v[2] &&
                        p[3] === v[3] &&
                        p[4] === v[4] &&
                        p[5] === v[5]) ||
                        (h(p[0] !== v[0] || p[1] !== v[1]), (v = p))),
                    k.advanced.updateOnImageLoad &&
                      ((q = d()),
                      q !== w &&
                        (n.find('img').each(function() {
                          f(this)
                        }),
                        (w = q))),
                    void (
                      (k.advanced.updateOnSelectorChange ||
                        k.advanced.updateOnContentResize ||
                        k.advanced.updateOnImageLoad) &&
                      c()
                    ))
              }, 60))
          }

          function d() {
            var a = 0
            return k.advanced.updateOnImageLoad && (a = n.find('img').length), a
          }

          function f(b) {
            function c(a, b) {
              return function() {
                return b.apply(a, arguments)
              }
            }

            function d() {
              ;(this.onload = null), a(b).addClass(l[2]), h(2)
            }
            if (a(b).hasClass(l[2])) return void h()
            var e = new Image()
            ;(e.onload = c(e, d)), (e.src = b.src)
          }

          function g() {
            k.advanced.updateOnSelectorChange === !0 && (k.advanced.updateOnSelectorChange = '*')
            var b = 0,
              c = n.find(k.advanced.updateOnSelectorChange)
            return (
              k.advanced.updateOnSelectorChange &&
                c.length > 0 &&
                c.each(function() {
                  b += a(this).height() + a(this).width()
                }),
              b
            )
          }

          function h(a) {
            clearTimeout(n[0].autoUpdate), m.update.call(null, i[0], a)
          }
          var i = a(this),
            j = i.data(e),
            k = j.opt,
            n = a('#mCSB_' + j.idx + '_container')
          if (b) return clearTimeout(n[0].autoUpdate), void $(n[0], 'autoUpdate')
          var o,
            p,
            q,
            r = n.parent(),
            s = [a('#mCSB_' + j.idx + '_scrollbar_vertical'), a('#mCSB_' + j.idx + '_scrollbar_horizontal')],
            t = function() {
              return [s[0].is(':visible') ? s[0].outerHeight(!0) : 0, s[1].is(':visible') ? s[1].outerWidth(!0) : 0]
            },
            u = g(),
            v = [n.outerHeight(!1), n.outerWidth(!1), r.height(), r.width(), t()[0], t()[1]],
            w = d()
          c()
        },
        U = function(a, b, c) {
          return Math.round(a / b) * b - c
        },
        V = function(b) {
          var c = b.data(e),
            d = a(
              '#mCSB_' +
                c.idx +
                '_container,#mCSB_' +
                c.idx +
                '_container_wrapper,#mCSB_' +
                c.idx +
                '_dragger_vertical,#mCSB_' +
                c.idx +
                '_dragger_horizontal',
            )
          d.each(function() {
            Z.call(this)
          })
        },
        W = function(b, c, d) {
          function f(a) {
            return i && j.callbacks[a] && 'function' == typeof j.callbacks[a]
          }

          function g() {
            return [j.callbacks.alwaysTriggerOffsets || t >= u[0] + w, j.callbacks.alwaysTriggerOffsets || t <= -x]
          }

          function h() {
            var a = [n[0].offsetTop, n[0].offsetLeft],
              c = [r[0].offsetTop, r[0].offsetLeft],
              e = [n.outerHeight(!1), n.outerWidth(!1)],
              f = [m.height(), m.width()]
            b[0].mcs = {
              content: n,
              top: a[0],
              left: a[1],
              draggerTop: c[0],
              draggerLeft: c[1],
              topPct: Math.round((100 * Math.abs(a[0])) / (Math.abs(e[0]) - f[0])),
              leftPct: Math.round((100 * Math.abs(a[1])) / (Math.abs(e[1]) - f[1])),
              direction: d.dir,
            }
          }
          var i = b.data(e),
            j = i.opt,
            k = {
              trigger: 'internal',
              dir: 'y',
              scrollEasing: 'mcsEaseOut',
              drag: !1,
              dur: j.scrollInertia,
              overwrite: 'all',
              callbacks: !0,
              onStart: !0,
              onUpdate: !0,
              onComplete: !0,
            },
            d = a.extend(k, d),
            l = [d.dur, d.drag ? 0 : d.dur],
            m = a('#mCSB_' + i.idx),
            n = a('#mCSB_' + i.idx + '_container'),
            o = n.parent(),
            p = j.callbacks.onTotalScrollOffset ? R.call(b, j.callbacks.onTotalScrollOffset) : [0, 0],
            q = j.callbacks.onTotalScrollBackOffset ? R.call(b, j.callbacks.onTotalScrollBackOffset) : [0, 0]
          if (
            ((i.trigger = d.trigger),
            (0 === o.scrollTop() && 0 === o.scrollLeft()) ||
              (a('.mCSB_' + i.idx + '_scrollbar').css('visibility', 'visible'), o.scrollTop(0).scrollLeft(0)),
            '_resetY' !== c ||
              i.contentReset.y ||
              (f('onOverflowYNone') && j.callbacks.onOverflowYNone.call(b[0]), (i.contentReset.y = 1)),
            '_resetX' !== c ||
              i.contentReset.x ||
              (f('onOverflowXNone') && j.callbacks.onOverflowXNone.call(b[0]), (i.contentReset.x = 1)),
            '_resetY' !== c && '_resetX' !== c)
          ) {
            switch (
              ((!i.contentReset.y && b[0].mcs) ||
                !i.overflowed[0] ||
                (f('onOverflowY') && j.callbacks.onOverflowY.call(b[0]), (i.contentReset.x = null)),
              (!i.contentReset.x && b[0].mcs) ||
                !i.overflowed[1] ||
                (f('onOverflowX') && j.callbacks.onOverflowX.call(b[0]), (i.contentReset.x = null)),
              j.snapAmount && (c = U(c, j.snapAmount, j.snapOffset)),
              d.dir)
            ) {
              case 'x':
                var r = a('#mCSB_' + i.idx + '_dragger_horizontal'),
                  s = 'left',
                  t = n[0].offsetLeft,
                  u = [m.width() - n.outerWidth(!1), r.parent().width() - r.width()],
                  v = [c, 0 === c ? 0 : c / i.scrollRatio.x],
                  w = p[1],
                  x = q[1],
                  y = w > 0 ? w / i.scrollRatio.x : 0,
                  A = x > 0 ? x / i.scrollRatio.x : 0
                break
              case 'y':
                var r = a('#mCSB_' + i.idx + '_dragger_vertical'),
                  s = 'top',
                  t = n[0].offsetTop,
                  u = [m.height() - n.outerHeight(!1), r.parent().height() - r.height()],
                  v = [c, 0 === c ? 0 : c / i.scrollRatio.y],
                  w = p[0],
                  x = q[0],
                  y = w > 0 ? w / i.scrollRatio.y : 0,
                  A = x > 0 ? x / i.scrollRatio.y : 0
            }
            v[1] < 0 || (0 === v[0] && 0 === v[1]) ? (v = [0, 0]) : v[1] >= u[1] ? (v = [u[0], u[1]]) : (v[0] = -v[0]),
              b[0].mcs || (h(), f('onInit') && j.callbacks.onInit.call(b[0])),
              clearTimeout(n[0].onCompleteTimeout),
              (!i.tweenRunning && ((0 === t && v[0] >= 0) || (t === u[0] && v[0] <= u[0]))) ||
                (X(r[0], s, Math.round(v[1]), l[1], d.scrollEasing),
                X(n[0], s, Math.round(v[0]), l[0], d.scrollEasing, d.overwrite, {
                  onStart: function() {
                    d.callbacks &&
                      d.onStart &&
                      !i.tweenRunning &&
                      (f('onScrollStart') && (h(), j.callbacks.onScrollStart.call(b[0])),
                      (i.tweenRunning = !0),
                      z(r),
                      (i.cbOffsets = g()))
                  },
                  onUpdate: function() {
                    d.callbacks && d.onUpdate && f('whileScrolling') && (h(), j.callbacks.whileScrolling.call(b[0]))
                  },
                  onComplete: function() {
                    if (d.callbacks && d.onComplete) {
                      'yx' === j.axis && clearTimeout(n[0].onCompleteTimeout)
                      var a = n[0].idleTimer || 0
                      n[0].onCompleteTimeout = setTimeout(function() {
                        f('onScroll') && (h(), j.callbacks.onScroll.call(b[0])),
                          f('onTotalScroll') &&
                            v[1] >= u[1] - y &&
                            i.cbOffsets[0] &&
                            (h(), j.callbacks.onTotalScroll.call(b[0])),
                          f('onTotalScrollBack') &&
                            v[1] <= A &&
                            i.cbOffsets[1] &&
                            (h(), j.callbacks.onTotalScrollBack.call(b[0])),
                          (i.tweenRunning = !1),
                          (n[0].idleTimer = 0),
                          z(r, 'hide')
                      }, a)
                    }
                  },
                }))
          }
        },
        X = function(a, c, d, e, f, g, h) {
          function i() {
            w.stop ||
              (t || p.call(),
              (t = Y() - s),
              j(),
              t >= w.time &&
                ((w.time = t > w.time ? t + n - (t - w.time) : t + n - 1), w.time < t + 1 && (w.time = t + 1)),
              w.time < e ? (w.id = o(i)) : r.call())
          }

          function j() {
            e > 0 ? ((w.currVal = m(w.time, u, x, e, f)), (v[c] = Math.round(w.currVal) + 'px')) : (v[c] = d + 'px'),
              q.call()
          }

          function k() {
            ;(n = 1e3 / 60),
              (w.time = t + n),
              (o = b.requestAnimationFrame
                ? b.requestAnimationFrame
                : function(a) {
                    return j(), setTimeout(a, 0.01)
                  }),
              (w.id = o(i))
          }

          function l() {
            null != w.id && (b.requestAnimationFrame ? b.cancelAnimationFrame(w.id) : clearTimeout(w.id), (w.id = null))
          }

          function m(a, b, c, d, e) {
            switch (e) {
              case 'linear':
              case 'mcsLinear':
                return (c * a) / d + b
              case 'mcsLinearOut':
                return (a /= d), a--, c * Math.sqrt(1 - a * a) + b
              case 'easeInOutSmooth':
                return (a /= d / 2), a < 1 ? (c / 2) * a * a + b : (a--, (-c / 2) * (a * (a - 2) - 1) + b)
              case 'easeInOutStrong':
                return (
                  (a /= d / 2),
                  a < 1 ? (c / 2) * Math.pow(2, 10 * (a - 1)) + b : (a--, (c / 2) * (-Math.pow(2, -10 * a) + 2) + b)
                )
              case 'easeInOut':
              case 'mcsEaseInOut':
                return (a /= d / 2), a < 1 ? (c / 2) * a * a * a + b : ((a -= 2), (c / 2) * (a * a * a + 2) + b)
              case 'easeOutSmooth':
                return (a /= d), a--, -c * (a * a * a * a - 1) + b
              case 'easeOutStrong':
                return c * (-Math.pow(2, (-10 * a) / d) + 1) + b
              case 'easeOut':
              case 'mcsEaseOut':
              default:
                var f = (a /= d) * a,
                  g = f * a
                return b + c * (0.499999999999997 * g * f + -2.5 * f * f + 5.5 * g + -6.5 * f + 4 * a)
            }
          }
          a._mTween ||
            (a._mTween = {
              top: {},
              left: {},
            })
          var n,
            o,
            h = h || {},
            p = h.onStart || function() {},
            q = h.onUpdate || function() {},
            r = h.onComplete || function() {},
            s = Y(),
            t = 0,
            u = a.offsetTop,
            v = a.style,
            w = a._mTween[c]
          'left' === c && (u = a.offsetLeft)
          var x = d - u
          ;(w.stop = 0), 'none' !== g && l(), k()
        },
        Y = function() {
          return b.performance && b.performance.now
            ? b.performance.now()
            : b.performance && b.performance.webkitNow
              ? b.performance.webkitNow()
              : Date.now
                ? Date.now()
                : new Date().getTime()
        },
        Z = function() {
          var a = this
          a._mTween ||
            (a._mTween = {
              top: {},
              left: {},
            })
          for (var c = ['top', 'left'], d = 0; d < c.length; d++) {
            var e = c[d]
            a._mTween[e].id &&
              (b.requestAnimationFrame ? b.cancelAnimationFrame(a._mTween[e].id) : clearTimeout(a._mTween[e].id),
              (a._mTween[e].id = null),
              (a._mTween[e].stop = 1))
          }
        },
        $ = function(a, b) {
          try {
            delete a[b]
          } catch (c) {
            a[b] = null
          }
        },
        _ = function(a) {
          return !(a.which && 1 !== a.which)
        },
        aa = function(a) {
          var b = a.originalEvent.pointerType
          return !(b && 'touch' !== b && 2 !== b)
        },
        ba = function(a) {
          return !isNaN(parseFloat(a)) && isFinite(a)
        },
        ca = function(a) {
          var b = a.parents('.mCSB_container')
          return [a.offset().top - b.offset().top, a.offset().left - b.offset().left]
        }
      ;(a.fn[d] = function(b) {
        return m[b]
          ? m[b].apply(this, Array.prototype.slice.call(arguments, 1))
          : 'object' != typeof b && b
            ? void a.error('Method ' + b + ' does not exist')
            : m.init.apply(this, arguments)
      }),
        (a[d] = function(b) {
          return m[b]
            ? m[b].apply(this, Array.prototype.slice.call(arguments, 1))
            : 'object' != typeof b && b
              ? void a.error('Method ' + b + ' does not exist')
              : m.init.apply(this, arguments)
        }),
        (a[d].defaults = g),
        (b[d] = !0),
        a(b).load(function() {
          a(f)[d](),
            a.extend(a.expr[':'], {
              mcsInView:
                a.expr[':'].mcsInView ||
                function(b) {
                  var c,
                    d,
                    e = a(b),
                    f = e.parents('.mCSB_container')
                  if (f.length)
                    return (
                      (c = f.parent()),
                      (d = [f[0].offsetTop, f[0].offsetLeft]),
                      d[0] + ca(e)[0] >= 0 &&
                        d[0] + ca(e)[0] < c.height() - e.outerHeight(!1) &&
                        d[1] + ca(e)[1] >= 0 &&
                        d[1] + ca(e)[1] < c.width() - e.outerWidth(!1)
                    )
                },
              mcsOverflow:
                a.expr[':'].mcsOverflow ||
                function(b) {
                  var c = a(b).data(e)
                  if (c) return c.overflowed[0] || c.overflowed[1]
                },
            })
        })
    })
  })(jQuery, window, document),
  (function() {
    'use strict'

    function a(a) {
      return a
        .split('')
        .reverse()
        .join('')
    }

    function b(a, b) {
      return a.substring(0, b.length) === b
    }

    function c(a, b) {
      return a.slice(-1 * b.length) === b
    }

    function d(a, b, c) {
      if ((a[b] || a[c]) && a[b] === a[c]) throw new Error(b)
    }

    function e(a) {
      return 'number' == typeof a && isFinite(a)
    }

    function f(a, b) {
      var c = Math.pow(10, b)
      return (Math.round(a * c) / c).toFixed(b)
    }

    function g(b, c, d, g, h, i, j, k, l, m, n, o) {
      var p,
        q,
        r,
        s = o,
        t = '',
        u = ''
      return (
        i && (o = i(o)),
        !!e(o) &&
          (b && 0 === parseFloat(o.toFixed(b)) && (o = 0),
          o < 0 && ((p = !0), (o = Math.abs(o))),
          b !== !1 && (o = f(o, b)),
          (o = o.toString()),
          o.indexOf('.') !== -1 ? ((q = o.split('.')), (r = q[0]), d && (t = d + q[1])) : (r = o),
          c && ((r = a(r).match(/.{1,3}/g)), (r = a(r.join(a(c))))),
          p && k && (u += k),
          g && (u += g),
          p && l && (u += l),
          (u += r),
          (u += t),
          h && (u += h),
          m && (u = m(u, s)),
          u)
      )
    }

    function h(a, d, f, g, h, i, j, k, l, m, n, o) {
      var p,
        q = ''
      return (
        n && (o = n(o)),
        !(!o || 'string' != typeof o) &&
          (k && b(o, k) && ((o = o.replace(k, '')), (p = !0)),
          g && b(o, g) && (o = o.replace(g, '')),
          l && b(o, l) && ((o = o.replace(l, '')), (p = !0)),
          h && c(o, h) && (o = o.slice(0, -1 * h.length)),
          d && (o = o.split(d).join('')),
          f && (o = o.replace(f, '.')),
          p && (q += '-'),
          (q += o),
          (q = q.replace(/[^0-9\.\-.]/g, '')),
          '' !== q && ((q = Number(q)), j && (q = j(q)), !!e(q) && q))
      )
    }

    function i(a) {
      var b,
        c,
        e,
        f = {}
      for (b = 0; b < l.length; b += 1)
        if (((c = l[b]), (e = a[c]), void 0 === e))
          'negative' !== c || f.negativeBefore
            ? 'mark' === c && '.' !== f.thousand
              ? (f[c] = '.')
              : (f[c] = !1)
            : (f[c] = '-')
        else if ('decimals' === c) {
          if (!(e >= 0 && e < 8)) throw new Error(c)
          f[c] = e
        } else if ('encoder' === c || 'decoder' === c || 'edit' === c || 'undo' === c) {
          if ('function' != typeof e) throw new Error(c)
          f[c] = e
        } else {
          if ('string' != typeof e) throw new Error(c)
          f[c] = e
        }
      return d(f, 'mark', 'thousand'), d(f, 'prefix', 'negative'), d(f, 'prefix', 'negativeBefore'), f
    }

    function j(a, b, c) {
      var d,
        e = []
      for (d = 0; d < l.length; d += 1) e.push(a[l[d]])
      return e.push(c), b.apply('', e)
    }

    function k(a) {
      return this instanceof k
        ? void (
            'object' == typeof a &&
            ((a = i(a)),
            (this.to = function(b) {
              return j(a, g, b)
            }),
            (this.from = function(b) {
              return j(a, h, b)
            }))
          )
        : new k(a)
    }
    var l = [
      'decimals',
      'thousand',
      'mark',
      'prefix',
      'postfix',
      'encoder',
      'decoder',
      'negativeBefore',
      'negative',
      'edit',
      'undo',
    ]
    window.wNumb = k
  })(),
  (function(a) {
    'use strict'

    function b(b) {
      return b instanceof a || (a.zepto && a.zepto.isZ(b))
    }

    function c(b, c) {
      if ('string' == typeof b && 0 === b.indexOf('-inline-'))
        return (this.method = c || 'html'), (this.target = this.el = a(b.replace('-inline-', '') || '<div/>')), !0
    }

    function d(b) {
      if ('string' == typeof b && 0 !== b.indexOf('-')) {
        this.method = 'val'
        var c = document.createElement('input')
        return (c.name = b), (c.type = 'hidden'), (this.target = this.el = a(c)), !0
      }
    }

    function e(a) {
      if ('function' == typeof a) return (this.target = !1), (this.method = a), !0
    }

    function f(a, c) {
      if (b(a) && !c)
        return (
          a.is('input, select, textarea')
            ? ((this.method = 'val'), (this.target = a.on('change.liblink', this.changeHandler)))
            : ((this.target = a), (this.method = 'html')),
          !0
        )
    }

    function g(a, c) {
      if (b(a) && ('function' == typeof c || ('string' == typeof c && a[c])))
        return (this.method = c), (this.target = a), !0
    }

    function h(b, c, d) {
      var e = this,
        f = !1
      if (
        ((this.changeHandler = function(b) {
          var c = e.formatInstance.from(a(this).val())
          return c === !1 || isNaN(c) ? (a(this).val(e.lastSetValue), !1) : void e.changeHandlerMethod.call('', b, c)
        }),
        (this.el = !1),
        (this.formatInstance = d),
        a.each(k, function(a, d) {
          return (f = d.call(e, b, c)), !f
        }),
        !f)
      )
        throw new RangeError('(Link) Invalid Link.')
    }

    function i(a) {
      ;(this.items = []), (this.elements = []), (this.origin = a)
    }

    function j(b, c, d, e) {
      0 === b && (b = this.LinkDefaultFlag),
        this.linkAPI || (this.linkAPI = {}),
        this.linkAPI[b] || (this.linkAPI[b] = new i(this))
      var f = new h(c, d, e || this.LinkDefaultFormatter)
      f.target || (f.target = a(this)),
        (f.changeHandlerMethod = this.LinkConfirm(b, f.el)),
        this.linkAPI[b].push(f, f.el),
        this.LinkUpdate(b)
    }
    var k = [c, d, e, f, g]
    ;(h.prototype.set = function(a) {
      var b = Array.prototype.slice.call(arguments),
        c = b.slice(1)
      ;(this.lastSetValue = this.formatInstance.to(a)),
        c.unshift(this.lastSetValue),
        ('function' == typeof this.method ? this.method : this.target[this.method]).apply(this.target, c)
    }),
      (i.prototype.push = function(a, b) {
        this.items.push(a), b && this.elements.push(b)
      }),
      (i.prototype.reconfirm = function(a) {
        var b
        for (b = 0; b < this.elements.length; b += 1) this.origin.LinkConfirm(a, this.elements[b])
      }),
      (i.prototype.remove = function(a) {
        var b
        for (b = 0; b < this.items.length; b += 1) this.items[b].target.off('.liblink')
        for (b = 0; b < this.elements.length; b += 1) this.elements[b].remove()
      }),
      (i.prototype.change = function(a) {
        if (this.origin.LinkIsEmitting) return !1
        this.origin.LinkIsEmitting = !0
        var b,
          c = Array.prototype.slice.call(arguments, 1)
        for (c.unshift(a), b = 0; b < this.items.length; b += 1) this.items[b].set.apply(this.items[b], c)
        this.origin.LinkIsEmitting = !1
      }),
      (a.fn.Link = function(b) {
        var c = this
        if (b === !1)
          return c.each(function() {
            this.linkAPI &&
              (a.map(this.linkAPI, function(a) {
                a.remove()
              }),
              delete this.linkAPI)
          })
        if (void 0 === b) b = 0
        else if ('string' != typeof b) throw new Error('Flag must be string.')
        return {
          to: function(a, d, e) {
            return c.each(function() {
              j.call(this, b, a, d, e)
            })
          },
        }
      })
  })(window.jQuery || window.Zepto),
  (function(a) {
    'use strict'

    function b(b) {
      return a.grep(b, function(c, d) {
        return d === a.inArray(c, b)
      })
    }

    function c(a, b) {
      return Math.round(a / b) * b
    }

    function d(a) {
      return 'number' == typeof a && !isNaN(a) && isFinite(a)
    }

    function e(a) {
      var b = Math.pow(10, 7)
      return Number((Math.round(a * b) / b).toFixed(7))
    }

    function f(a, b, c) {
      a.addClass(b),
        setTimeout(function() {
          a.removeClass(b)
        }, c)
    }

    function g(a) {
      return Math.max(Math.min(a, 100), 0)
    }

    function h(b) {
      return a.isArray(b) ? b : [b]
    }

    function i(a, b) {
      return 100 / (b - a)
    }

    function j(a, b) {
      return (100 * b) / (a[1] - a[0])
    }

    function k(a, b) {
      return j(a, a[0] < 0 ? b + Math.abs(a[0]) : b - a[0])
    }

    function l(a, b) {
      return (b * (a[1] - a[0])) / 100 + a[0]
    }

    function m(a, b) {
      for (var c = 1; a >= b[c]; ) c += 1
      return c
    }

    function n(a, b, c) {
      if (c >= a.slice(-1)[0]) return 100
      var d,
        e,
        f,
        g,
        h = m(c, a)
      return (d = a[h - 1]), (e = a[h]), (f = b[h - 1]), (g = b[h]), f + k([d, e], c) / i(f, g)
    }

    function o(a, b, c) {
      if (c >= 100) return a.slice(-1)[0]
      var d,
        e,
        f,
        g,
        h = m(c, b)
      return (d = a[h - 1]), (e = a[h]), (f = b[h - 1]), (g = b[h]), l([d, e], (c - f) * i(f, g))
    }

    function p(a, b, d, e) {
      if (100 === e) return e
      var f,
        g,
        h = m(e, a)
      return d
        ? ((f = a[h - 1]), (g = a[h]), e - f > (g - f) / 2 ? g : f)
        : b[h - 1]
          ? a[h - 1] + c(e - a[h - 1], b[h - 1])
          : e
    }

    function q(a, b, c) {
      var e
      if (('number' == typeof b && (b = [b]), '[object Array]' !== Object.prototype.toString.call(b)))
        throw new Error("noUiSlider: 'range' contains invalid value.")
      if (((e = 'min' === a ? 0 : 'max' === a ? 100 : parseFloat(a)), !d(e) || !d(b[0])))
        throw new Error("noUiSlider: 'range' value isn't numeric.")
      c.xPct.push(e), c.xVal.push(b[0]), e ? c.xSteps.push(!isNaN(b[1]) && b[1]) : isNaN(b[1]) || (c.xSteps[0] = b[1])
    }

    function r(a, b, c) {
      return !b || void (c.xSteps[a] = j([c.xVal[a], c.xVal[a + 1]], b) / i(c.xPct[a], c.xPct[a + 1]))
    }

    function s(a, b, c, d) {
      ;(this.xPct = []),
        (this.xVal = []),
        (this.xSteps = [d || !1]),
        (this.xNumSteps = [!1]),
        (this.snap = b),
        (this.direction = c)
      var e,
        f = this
      for (e in a) a.hasOwnProperty(e) && q(e, a[e], f)
      f.xNumSteps = f.xSteps.slice(0)
      for (e in f.xNumSteps) f.xNumSteps.hasOwnProperty(e) && r(Number(e), f.xNumSteps[e], f)
    }

    function t(a, b) {
      if (!d(b)) throw new Error("noUiSlider: 'step' is not numeric.")
      a.singleStep = b
    }

    function u(b, c) {
      if ('object' != typeof c || a.isArray(c)) throw new Error("noUiSlider: 'range' is not an object.")
      if (void 0 === c.min || void 0 === c.max) throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.")
      b.spectrum = new s(c, b.snap, b.dir, b.singleStep)
    }

    function v(b, c) {
      if (((c = h(c)), !a.isArray(c) || !c.length || c.length > 2))
        throw new Error("noUiSlider: 'start' option is incorrect.")
      ;(b.handles = c.length), (b.start = c)
    }

    function w(a, b) {
      if (((a.snap = b), 'boolean' != typeof b)) throw new Error("noUiSlider: 'snap' option must be a boolean.")
    }

    function x(a, b) {
      if (((a.animate = b), 'boolean' != typeof b)) throw new Error("noUiSlider: 'animate' option must be a boolean.")
    }

    function y(a, b) {
      if ('lower' === b && 1 === a.handles) a.connect = 1
      else if ('upper' === b && 1 === a.handles) a.connect = 2
      else if (b === !0 && 2 === a.handles) a.connect = 3
      else {
        if (b !== !1) throw new Error("noUiSlider: 'connect' option doesn't match handle count.")
        a.connect = 0
      }
    }

    function z(a, b) {
      switch (b) {
        case 'horizontal':
          a.ort = 0
          break
        case 'vertical':
          a.ort = 1
          break
        default:
          throw new Error("noUiSlider: 'orientation' option is invalid.")
      }
    }

    function A(a, b) {
      if (!d(b)) throw new Error("noUiSlider: 'margin' option must be numeric.")
      if (((a.margin = a.spectrum.getMargin(b)), !a.margin))
        throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.")
    }

    function B(a, b) {
      if (!d(b)) throw new Error("noUiSlider: 'limit' option must be numeric.")
      if (((a.limit = a.spectrum.getMargin(b)), !a.limit))
        throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.")
    }

    function C(a, b) {
      switch (b) {
        case 'ltr':
          a.dir = 0
          break
        case 'rtl':
          ;(a.dir = 1), (a.connect = [0, 2, 1, 3][a.connect])
          break
        default:
          throw new Error("noUiSlider: 'direction' option was not recognized.")
      }
    }

    function D(a, b) {
      if ('string' != typeof b) throw new Error("noUiSlider: 'behaviour' must be a string containing options.")
      var c = b.indexOf('tap') >= 0,
        d = b.indexOf('drag') >= 0,
        e = b.indexOf('fixed') >= 0,
        f = b.indexOf('snap') >= 0
      a.events = {
        tap: c || f,
        drag: d,
        fixed: e,
        snap: f,
      }
    }

    function E(a, b) {
      if (((a.format = b), 'function' == typeof b.to && 'function' == typeof b.from)) return !0
      throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.")
    }

    function F(b) {
      var c,
        d = {
          margin: 0,
          limit: 0,
          animate: !0,
          format: Y,
        }
      return (
        (c = {
          step: {
            r: !1,
            t: t,
          },
          start: {
            r: !0,
            t: v,
          },
          connect: {
            r: !0,
            t: y,
          },
          direction: {
            r: !0,
            t: C,
          },
          snap: {
            r: !1,
            t: w,
          },
          animate: {
            r: !1,
            t: x,
          },
          range: {
            r: !0,
            t: u,
          },
          orientation: {
            r: !1,
            t: z,
          },
          margin: {
            r: !1,
            t: A,
          },
          limit: {
            r: !1,
            t: B,
          },
          behaviour: {
            r: !0,
            t: D,
          },
          format: {
            r: !1,
            t: E,
          },
        }),
        (b = a.extend(
          {
            connect: !1,
            direction: 'ltr',
            behaviour: 'tap',
            orientation: 'horizontal',
          },
          b,
        )),
        a.each(c, function(a, c) {
          if (void 0 === b[a]) {
            if (c.r) throw new Error("noUiSlider: '" + a + "' is required.")
            return !0
          }
          c.t(d, b[a])
        }),
        (d.style = d.ort ? 'top' : 'left'),
        d
      )
    }

    function G(a, b, c) {
      var d = a + b[0],
        e = a + b[1]
      return c ? (d < 0 && (e += Math.abs(d)), e > 100 && (d -= e - 100), [g(d), g(e)]) : [d, e]
    }

    function H(a) {
      a.preventDefault()
      var b,
        c,
        d = 0 === a.type.indexOf('touch'),
        e = 0 === a.type.indexOf('mouse'),
        f = 0 === a.type.indexOf('pointer'),
        g = a
      return (
        0 === a.type.indexOf('MSPointer') && (f = !0),
        a.originalEvent && (a = a.originalEvent),
        d && ((b = a.changedTouches[0].pageX), (c = a.changedTouches[0].pageY)),
        (e || f) &&
          (f ||
            void 0 !== window.pageXOffset ||
            ((window.pageXOffset = document.documentElement.scrollLeft),
            (window.pageYOffset = document.documentElement.scrollTop)),
          (b = a.clientX + window.pageXOffset),
          (c = a.clientY + window.pageYOffset)),
        (g.points = [b, c]),
        (g.cursor = e),
        g
      )
    }

    function I(b, c) {
      var d = a('<div><div/></div>').addClass(X[2]),
        e = ['-lower', '-upper']
      return b && e.reverse(), d.children().addClass(X[3] + ' ' + X[3] + e[c]), d
    }

    function J(a, b, c) {
      switch (a) {
        case 1:
          b.addClass(X[7]), c[0].addClass(X[6])
          break
        case 3:
          c[1].addClass(X[6])
        case 2:
          c[0].addClass(X[7])
        case 0:
          b.addClass(X[6])
      }
    }

    function K(a, b, c) {
      var d,
        e = []
      for (d = 0; d < a; d += 1) e.push(I(b, d).appendTo(c))
      return e
    }

    function L(b, c, d) {
      return (
        d.addClass([X[0], X[8 + b], X[4 + c]].join(' ')),
        a('<div/>')
          .appendTo(d)
          .addClass(X[1])
      )
    }

    function M(b, c, d) {
      function e() {
        return B[['width', 'height'][c.ort]]()
      }

      function i(a) {
        var b,
          c = [D.val()]
        for (b = 0; b < a.length; b += 1) D.trigger(a[b], c)
      }

      function j(a) {
        return 1 === a.length ? a[0] : c.dir ? a.reverse() : a
      }

      function k(a) {
        return function(b, c) {
          D.val([a ? null : c, a ? c : null], !0)
        }
      }

      function l(b) {
        var c = a.inArray(b, M)
        D[0].linkAPI && D[0].linkAPI[b] && D[0].linkAPI[b].change(I[c], C[c].children(), D)
      }

      function m(b, d) {
        var e = a.inArray(b, M)
        return d && d.appendTo(C[e].children()), c.dir && c.handles > 1 && (e = 1 === e ? 0 : 1), k(e)
      }

      function n() {
        var a, b
        for (a = 0; a < M.length; a += 1) this.linkAPI && this.linkAPI[(b = M[a])] && this.linkAPI[b].reconfirm(b)
      }

      function o(a, b, d, e) {
        return (
          (a = a.replace(/\s/g, V + ' ') + V),
          b.on(a, function(a) {
            return (
              !D.attr('disabled') && (!D.hasClass(X[14]) && ((a = H(a)), (a.calcPoint = a.points[c.ort]), void d(a, e)))
            )
          })
        )
      }

      function p(a, b) {
        var c,
          d = b.handles || C,
          f = !1,
          g = (100 * (a.calcPoint - b.start)) / e(),
          h = d[0][0] !== C[0][0] ? 1 : 0
        ;(c = G(g, b.positions, d.length > 1)),
          (f = u(d[0], c[h], 1 === d.length)),
          d.length > 1 && (f = u(d[1], c[h ? 0 : 1], !1) || f),
          f && i(['slide'])
      }

      function q(b) {
        a('.' + X[15]).removeClass(X[15]),
          b.cursor &&
            a('body')
              .css('cursor', '')
              .off(V),
          T.off(V),
          D.removeClass(X[12]),
          i(['set', 'change'])
      }

      function r(b, c) {
        1 === c.handles.length && c.handles[0].children().addClass(X[15]),
          b.stopPropagation(),
          o(W.move, T, p, {
            start: b.calcPoint,
            handles: c.handles,
            positions: [E[0], E[C.length - 1]],
          }),
          o(W.end, T, q, null),
          b.cursor &&
            (a('body').css('cursor', a(b.target).css('cursor')),
            C.length > 1 && D.addClass(X[12]),
            a('body').on('selectstart' + V, !1))
      }

      function s(b) {
        var d,
          g = b.calcPoint,
          h = 0
        b.stopPropagation(),
          a.each(C, function() {
            h += this.offset()[c.style]
          }),
          (h = g < h / 2 || 1 === C.length ? 0 : 1),
          (g -= B.offset()[c.style]),
          (d = (100 * g) / e()),
          c.events.snap || f(D, X[14], 300),
          u(C[h], d),
          i(['slide', 'set', 'change']),
          c.events.snap &&
            r(b, {
              handles: [C[h]],
            })
      }

      function t(a) {
        var b, c
        if (!a.fixed)
          for (b = 0; b < C.length; b += 1)
            o(W.start, C[b].children(), r, {
              handles: [C[b]],
            })
        a.tap &&
          o(W.start, B, s, {
            handles: C,
          }),
          a.drag &&
            ((c = B.find('.' + X[7]).addClass(X[10])),
            a.fixed &&
              (c = c.add(
                B.children()
                  .not(c)
                  .children(),
              )),
            o(W.start, c, r, {
              handles: C,
            }))
      }

      function u(a, b, d) {
        var e = a[0] !== C[0][0] ? 1 : 0,
          f = E[0] + c.margin,
          h = E[1] - c.margin,
          i = E[0] + c.limit,
          j = E[1] - c.limit
        return (
          C.length > 1 && (b = e ? Math.max(b, f) : Math.min(b, h)),
          d !== !1 && c.limit && C.length > 1 && (b = e ? Math.min(b, i) : Math.max(b, j)),
          (b = F.getStep(b)),
          (b = g(parseFloat(b.toFixed(7)))),
          b !== E[e] &&
            (a.css(c.style, b + '%'),
            a.is(':first-child') && a.toggleClass(X[17], b > 50),
            (E[e] = b),
            (I[e] = F.fromStepping(b)),
            l(M[e]),
            !0)
        )
      }

      function v(a, b) {
        var d, e, f
        for (c.limit && (a += 1), d = 0; d < a; d += 1)
          (e = d % 2),
            (f = b[e]),
            null !== f &&
              f !== !1 &&
              ('number' == typeof f && (f = String(f)),
              (f = c.format.from(f)),
              (f === !1 || isNaN(f) || u(C[e], F.toStepping(f), d === 3 - c.dir) === !1) && l(M[e]))
      }

      function w(a) {
        if (D[0].LinkIsEmitting) return this
        var b,
          d = h(a)
        return (
          c.dir && c.handles > 1 && d.reverse(),
          c.animate && E[0] !== -1 && f(D, X[14], 300),
          (b = C.length > 1 ? 3 : 1),
          1 === d.length && (b = 1),
          v(b, d),
          i(['set']),
          this
        )
      }

      function x() {
        var a,
          b = []
        for (a = 0; a < c.handles; a += 1) b[a] = c.format.to(I[a])
        return j(b)
      }

      function y() {
        return (
          a(this)
            .off(V)
            .removeClass(X.join(' '))
            .empty(),
          delete this.LinkUpdate,
          delete this.LinkConfirm,
          delete this.LinkDefaultFormatter,
          delete this.LinkDefaultFlag,
          delete this.reappend,
          delete this.vGet,
          delete this.vSet,
          delete this.getCurrentStep,
          delete this.getInfo,
          delete this.destroy,
          d
        )
      }

      function z() {
        var b = a.map(E, function(a, b) {
          var c = F.getApplicableStep(a),
            d = I[b],
            e = c[2],
            f = d - c[2] >= c[1] ? c[2] : c[0]
          return [[f, e]]
        })
        return j(b)
      }

      function A() {
        return d
      }
      var B,
        C,
        D = a(b),
        E = [-1, -1],
        F = c.spectrum,
        I = [],
        M = ['lower', 'upper'].slice(0, c.handles)
      if (
        (c.dir && M.reverse(),
        (b.LinkUpdate = l),
        (b.LinkConfirm = m),
        (b.LinkDefaultFormatter = c.format),
        (b.LinkDefaultFlag = 'lower'),
        (b.reappend = n),
        D.hasClass(X[0]))
      )
        throw new Error('Slider was already initialized.')
      ;(B = L(c.dir, c.ort, D)),
        (C = K(c.handles, c.dir, B)),
        J(c.connect, D, C),
        t(c.events),
        (b.vSet = w),
        (b.vGet = x),
        (b.destroy = y),
        (b.getCurrentStep = z),
        (b.getOriginalOptions = A),
        (b.getInfo = function() {
          return [F, c.style, c.ort]
        }),
        D.val(c.start)
    }

    function N(a) {
      if (!this.length) throw new Error("noUiSlider: Can't initialize slider on empty selection.")
      var b = F(a, this)
      return this.each(function() {
        M(this, b, a)
      })
    }

    function O(b) {
      return this.each(function() {
        if (!this.destroy) return void a(this).noUiSlider(b)
        var c = a(this).val(),
          d = this.destroy(),
          e = a.extend({}, d, b)
        a(this).noUiSlider(e), this.reappend(), d.start === e.start && a(this).val(c)
      })
    }

    function P() {
      return this[0][arguments.length ? 'vSet' : 'vGet'].apply(this[0], arguments)
    }

    function Q(b, c, d, e) {
      if ('range' === c || 'steps' === c) return b.xVal
      if ('count' === c) {
        var f,
          g = 100 / (d - 1),
          h = 0
        for (d = []; (f = h++ * g) <= 100; ) d.push(f)
        c = 'positions'
      }
      return 'positions' === c
        ? a.map(d, function(a) {
            return b.fromStepping(e ? b.getStep(a) : a)
          })
        : 'values' === c
          ? e
            ? a.map(d, function(a) {
                return b.fromStepping(b.getStep(b.toStepping(a)))
              })
            : d
          : void 0
    }

    function R(c, d, e, f) {
      var g = c.direction,
        h = {},
        i = c.xVal[0],
        j = c.xVal[c.xVal.length - 1],
        k = !1,
        l = !1,
        m = 0
      return (
        (c.direction = 0),
        (f = b(
          f.slice().sort(function(a, b) {
            return a - b
          }),
        )),
        f[0] !== i && (f.unshift(i), (k = !0)),
        f[f.length - 1] !== j && (f.push(j), (l = !0)),
        a.each(f, function(b) {
          var g,
            i,
            j,
            n,
            o,
            p,
            q,
            r,
            s,
            t,
            u = f[b],
            v = f[b + 1]
          if (('steps' === e && (g = c.xNumSteps[b]), g || (g = v - u), u !== !1 && void 0 !== v))
            for (i = u; i <= v; i += g) {
              for (n = c.toStepping(i), o = n - m, r = o / d, s = Math.round(r), t = o / s, j = 1; j <= s; j += 1)
                (p = m + j * t), (h[p.toFixed(5)] = ['x', 0])
              ;(q = a.inArray(i, f) > -1 ? 1 : 'steps' === e ? 2 : 0),
                !b && k && (q = 0),
                (i === v && l) || (h[n.toFixed(5)] = [i, q]),
                (m = n)
            }
        }),
        (c.direction = g),
        h
      )
    }

    function S(b, c, d, e, f, g) {
      function h(a, b) {
        return ['-normal', '-large', '-sub'][a && f ? f(b, a) : a]
      }

      function i(a, c, d) {
        return 'class="' + c + ' ' + c + '-' + k + ' ' + c + h(d[1], d[0]) + '" style="' + b + ': ' + a + '%"'
      }

      function j(a, b) {
        d && (a = 100 - a),
          l.append('<div ' + i(a, 'noUi-marker', b) + '></div>'),
          b[1] && l.append('<div ' + i(a, 'noUi-value', b) + '>' + g.to(b[0]) + '</div>')
      }
      var k = ['horizontal', 'vertical'][c],
        l = a('<div/>')
      return l.addClass('noUi-pips noUi-pips-' + k), a.each(e, j), l
    }
    var T = a(document),
      U = a.fn.val,
      V = '.nui',
      W = window.navigator.pointerEnabled
        ? {
            start: 'pointerdown',
            move: 'pointermove',
            end: 'pointerup',
          }
        : window.navigator.msPointerEnabled
          ? {
              start: 'MSPointerDown',
              move: 'MSPointerMove',
              end: 'MSPointerUp',
            }
          : {
              start: 'mousedown touchstart',
              move: 'mousemove touchmove',
              end: 'mouseup touchend',
            },
      X = [
        'noUi-target',
        'noUi-base',
        'noUi-origin',
        'noUi-handle',
        'noUi-horizontal',
        'noUi-vertical',
        'noUi-background',
        'noUi-connect',
        'noUi-ltr',
        'noUi-rtl',
        'noUi-dragable',
        '',
        'noUi-state-drag',
        '',
        'noUi-state-tap',
        'noUi-active',
        '',
        'noUi-stacking',
      ]
    ;(s.prototype.getMargin = function(a) {
      return 2 === this.xPct.length && j(this.xVal, a)
    }),
      (s.prototype.toStepping = function(a) {
        return (a = n(this.xVal, this.xPct, a)), this.direction && (a = 100 - a), a
      }),
      (s.prototype.fromStepping = function(a) {
        return this.direction && (a = 100 - a), e(o(this.xVal, this.xPct, a))
      }),
      (s.prototype.getStep = function(a) {
        return (
          this.direction && (a = 100 - a),
          (a = p(this.xPct, this.xSteps, this.snap, a)),
          this.direction && (a = 100 - a),
          a
        )
      }),
      (s.prototype.getApplicableStep = function(a) {
        var b = m(a, this.xPct),
          c = 100 === a ? 2 : 1
        return [this.xNumSteps[b - 2], this.xVal[b - c], this.xNumSteps[b - c]]
      }),
      (s.prototype.convert = function(a) {
        return this.getStep(this.toStepping(a))
      })
    var Y = {
      to: function(a) {
        return a.toFixed(2)
      },
      from: Number,
    }
    ;(a.fn.val = function(b) {
      function c(a) {
        return a.hasClass(X[0]) ? P : U
      }
      if (void 0 === b) {
        var d = a(this[0])
        return c(d).call(d)
      }
      var e = a.isFunction(b)
      return this.each(function(d) {
        var f = b,
          g = a(this)
        e && (f = b.call(this, d, g.val())), c(g).call(g, f)
      })
    }),
      (a.fn.noUiSlider = function(a, b) {
        switch (a) {
          case 'step':
            return this[0].getCurrentStep()
          case 'options':
            return this[0].getOriginalOptions()
        }
        return (b ? O : N).call(this, a)
      }),
      (a.fn.noUiSlider_pips = function(b) {
        var c = b.mode,
          d = b.density || 1,
          e = b.filter || !1,
          f = b.values || !1,
          g = b.format || {
            to: Math.round,
          },
          h = b.stepped || !1
        return this.each(function() {
          var b = this.getInfo(),
            i = Q(b[0], c, f, h),
            j = R(b[0], d, c, i)
          return a(this).append(S(b[1], b[2], b[0].direction, j, e, g))
        })
      })
  })(window.jQuery || window.Zepto),
  (function(a) {
    if ('object' == typeof exports && 'undefined' != typeof module) module.exports = a()
    else if ('function' == typeof define && define.amd) define([], a)
    else {
      var b
      ;(b =
        'undefined' != typeof window
          ? window
          : 'undefined' != typeof global
            ? global
            : 'undefined' != typeof self
              ? self
              : this),
        (b.leafletPip = a())
    }
  })(function() {
    return (function a(b, c, d) {
      function e(g, h) {
        if (!c[g]) {
          if (!b[g]) {
            var i = 'function' == typeof require && require
            if (!h && i) return i(g, !0)
            if (f) return f(g, !0)
            var j = new Error("Cannot find module '" + g + "'")
            throw ((j.code = 'MODULE_NOT_FOUND'), j)
          }
          var k = (c[g] = {
            exports: {},
          })
          b[g][0].call(
            k.exports,
            function(a) {
              var c = b[g][1][a]
              return e(c ? c : a)
            },
            k,
            k.exports,
            a,
            b,
            c,
            d,
          )
        }
        return c[g].exports
      }
      for (var f = 'function' == typeof require && require, g = 0; g < d.length; g++) e(d[g])
      return e
    })(
      {
        1: [
          function(a, b, c) {
            'use strict'

            function d(a) {
              return (
                a.feature &&
                a.feature.geometry &&
                a.feature.geometry.type &&
                ['Polygon', 'MultiPolygon'].indexOf(a.feature.geometry.type) !== -1
              )
            }
            var e = a('geojson-utils'),
              f = {
                bassackwards: !1,
                pointInLayer: function(a, b, c) {
                  'number' == typeof a.lat ? (a = [a.lng, a.lat]) : f.bassackwards && (a = a.concat().reverse())
                  var g = []
                  return (
                    b.eachLayer(function(b) {
                      ;(c && g.length) ||
                        (d(b) &&
                          e.pointInPolygon(
                            {
                              type: 'Point',
                              coordinates: a,
                            },
                            b.toGeoJSON().geometry,
                          ) &&
                          g.push(b))
                    }),
                    g
                  )
                },
              }
            b.exports = f
          },
          {
            'geojson-utils': 2,
          },
        ],
        2: [
          function(a, b, c) {
            !(function() {
              function a(a) {
                for (var b = [], c = [], d = 0; d < a[0].length; d++) b.push(a[0][d][1]), c.push(a[0][d][0])
                return (
                  (b = b.sort(function(a, b) {
                    return a - b
                  })),
                  (c = c.sort(function(a, b) {
                    return a - b
                  })),
                  [[b[0], c[0]], [b[b.length - 1], c[c.length - 1]]]
                )
              }

              function c(a, b, c) {
                for (var d = [[0, 0]], e = 0; e < c.length; e++) {
                  for (var f = 0; f < c[e].length; f++) d.push(c[e][f])
                  d.push(c[e][0]), d.push([0, 0])
                }
                for (var g = !1, e = 0, f = d.length - 1; e < d.length; f = e++)
                  d[e][0] > b != d[f][0] > b &&
                    a < ((d[f][1] - d[e][1]) * (b - d[e][0])) / (d[f][0] - d[e][0]) + d[e][1] &&
                    (g = !g)
                return g
              }
              var d = (this.gju = {})
              'undefined' != typeof b && b.exports && (b.exports = d),
                (d.lineStringsIntersect = function(a, b) {
                  for (var c = [], d = 0; d <= a.coordinates.length - 2; ++d)
                    for (var e = 0; e <= b.coordinates.length - 2; ++e) {
                      var f = {
                          x: a.coordinates[d][1],
                          y: a.coordinates[d][0],
                        },
                        g = {
                          x: a.coordinates[d + 1][1],
                          y: a.coordinates[d + 1][0],
                        },
                        h = {
                          x: b.coordinates[e][1],
                          y: b.coordinates[e][0],
                        },
                        i = {
                          x: b.coordinates[e + 1][1],
                          y: b.coordinates[e + 1][0],
                        },
                        j = (i.x - h.x) * (f.y - h.y) - (i.y - h.y) * (f.x - h.x),
                        k = (g.x - f.x) * (f.y - h.y) - (g.y - f.y) * (f.x - h.x),
                        l = (i.y - h.y) * (g.x - f.x) - (i.x - h.x) * (g.y - f.y)
                      if (0 != l) {
                        var m = j / l,
                          n = k / l
                        0 <= m &&
                          m <= 1 &&
                          0 <= n &&
                          n <= 1 &&
                          c.push({
                            type: 'Point',
                            coordinates: [f.x + m * (g.x - f.x), f.y + m * (g.y - f.y)],
                          })
                      }
                    }
                  return 0 == c.length && (c = !1), c
                }),
                (d.pointInBoundingBox = function(a, b) {
                  return !(
                    a.coordinates[1] < b[0][0] ||
                    a.coordinates[1] > b[1][0] ||
                    a.coordinates[0] < b[0][1] ||
                    a.coordinates[0] > b[1][1]
                  )
                }),
                (d.pointInPolygon = function(b, e) {
                  for (var f = 'Polygon' == e.type ? [e.coordinates] : e.coordinates, g = !1, h = 0; h < f.length; h++)
                    d.pointInBoundingBox(b, a(f[h])) && (g = !0)
                  if (!g) return !1
                  for (var i = !1, h = 0; h < f.length; h++) c(b.coordinates[1], b.coordinates[0], f[h]) && (i = !0)
                  return i
                }),
                (d.pointInMultiPolygon = function(b, e) {
                  for (
                    var f = 'MultiPolygon' == e.type ? [e.coordinates] : e.coordinates, g = !1, h = !1, i = 0;
                    i < f.length;
                    i++
                  ) {
                    for (var j = f[i], k = 0; k < j.length; k++) g || (d.pointInBoundingBox(b, a(j[k])) && (g = !0))
                    if (!g) return !1
                    for (var k = 0; k < j.length; k++) h || (c(b.coordinates[1], b.coordinates[0], j[k]) && (h = !0))
                  }
                  return h
                }),
                (d.numberToRadius = function(a) {
                  return (a * Math.PI) / 180
                }),
                (d.numberToDegree = function(a) {
                  return (180 * a) / Math.PI
                }),
                (d.drawCircle = function(a, b, c) {
                  for (
                    var e = [b.coordinates[1], b.coordinates[0]],
                      f = a / 1e3 / 6371,
                      g = [d.numberToRadius(e[0]), d.numberToRadius(e[1])],
                      c = c || 15,
                      h = [[e[0], e[1]]],
                      i = 0;
                    i < c;
                    i++
                  ) {
                    var j = (2 * Math.PI * i) / c,
                      k = Math.asin(Math.sin(g[0]) * Math.cos(f) + Math.cos(g[0]) * Math.sin(f) * Math.cos(j)),
                      l =
                        g[1] +
                        Math.atan2(
                          Math.sin(j) * Math.sin(f) * Math.cos(g[0]),
                          Math.cos(f) - Math.sin(g[0]) * Math.sin(k),
                        )
                    ;(h[i] = []), (h[i][1] = d.numberToDegree(k)), (h[i][0] = d.numberToDegree(l))
                  }
                  return {
                    type: 'Polygon',
                    coordinates: [h],
                  }
                }),
                (d.rectangleCentroid = function(a) {
                  var b = a.coordinates[0],
                    c = b[0][0],
                    d = b[0][1],
                    e = b[2][0],
                    f = b[2][1],
                    g = e - c,
                    h = f - d
                  return {
                    type: 'Point',
                    coordinates: [c + g / 2, d + h / 2],
                  }
                }),
                (d.pointDistance = function(a, b) {
                  var c = a.coordinates[0],
                    e = a.coordinates[1],
                    f = b.coordinates[0],
                    g = b.coordinates[1],
                    h = d.numberToRadius(g - e),
                    i = d.numberToRadius(f - c),
                    j =
                      Math.pow(Math.sin(h / 2), 2) +
                      Math.cos(d.numberToRadius(e)) * Math.cos(d.numberToRadius(g)) * Math.pow(Math.sin(i / 2), 2),
                    k = 2 * Math.atan2(Math.sqrt(j), Math.sqrt(1 - j))
                  return 6371 * k * 1e3
                }),
                (d.geometryWithinRadius = function(a, b, c) {
                  if ('Point' == a.type) return d.pointDistance(a, b) <= c
                  if ('LineString' == a.type || 'Polygon' == a.type) {
                    var e,
                      f = {}
                    e = 'Polygon' == a.type ? a.coordinates[0] : a.coordinates
                    for (var g in e) if (((f.coordinates = e[g]), d.pointDistance(f, b) > c)) return !1
                  }
                  return !0
                }),
                (d.area = function(a) {
                  for (var b, c, d = 0, e = a.coordinates[0], f = e.length - 1, g = 0; g < e.length; f = g++) {
                    var b = {
                        x: e[g][1],
                        y: e[g][0],
                      },
                      c = {
                        x: e[f][1],
                        y: e[f][0],
                      }
                    ;(d += b.x * c.y), (d -= b.y * c.x)
                  }
                  return (d /= 2)
                }),
                (d.centroid = function(a) {
                  for (
                    var b, c, e, f = 0, g = 0, h = a.coordinates[0], i = h.length - 1, j = 0;
                    j < h.length;
                    i = j++
                  ) {
                    var c = {
                        x: h[j][1],
                        y: h[j][0],
                      },
                      e = {
                        x: h[i][1],
                        y: h[i][0],
                      }
                    ;(b = c.x * e.y - e.x * c.y), (f += (c.x + e.x) * b), (g += (c.y + e.y) * b)
                  }
                  return (
                    (b = 6 * d.area(a)),
                    {
                      type: 'Point',
                      coordinates: [g / b, f / b],
                    }
                  )
                }),
                (d.simplify = function(a, b) {
                  ;(b = b || 20),
                    (a = a.map(function(a) {
                      return {
                        lng: a.coordinates[0],
                        lat: a.coordinates[1],
                      }
                    }))
                  var c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p,
                    q,
                    r,
                    s,
                    t,
                    u,
                    v = (Math.PI / 180) * 0.5,
                    w = new Array(),
                    x = new Array(),
                    y = new Array()
                  if (a.length < 3) return a
                  for (
                    c = a.length, l = (360 * b) / (2 * Math.PI * 6378137), l *= l, e = 0, x[0] = 0, y[0] = c - 1, d = 1;
                    d > 0;

                  )
                    if (((f = x[d - 1]), (g = y[d - 1]), d--, g - f > 1)) {
                      for (
                        m = a[g].lng() - a[f].lng(),
                          n = a[g].lat() - a[f].lat(),
                          Math.abs(m) > 180 && (m = 360 - Math.abs(m)),
                          m *= Math.cos(v * (a[g].lat() + a[f].lat())),
                          o = m * m + n * n,
                          h = f + 1,
                          i = f,
                          k = -1;
                        h < g;
                        h++
                      )
                        (p = a[h].lng() - a[f].lng()),
                          (q = a[h].lat() - a[f].lat()),
                          Math.abs(p) > 180 && (p = 360 - Math.abs(p)),
                          (p *= Math.cos(v * (a[h].lat() + a[f].lat()))),
                          (r = p * p + q * q),
                          (s = a[h].lng() - a[g].lng()),
                          (t = a[h].lat() - a[g].lat()),
                          Math.abs(s) > 180 && (s = 360 - Math.abs(s)),
                          (s *= Math.cos(v * (a[h].lat() + a[g].lat()))),
                          (u = s * s + t * t),
                          (j = r >= o + u ? u : u >= o + r ? r : ((p * n - q * m) * (p * n - q * m)) / o),
                          j > k && ((i = h), (k = j))
                      k < l
                        ? ((w[e] = f), e++)
                        : (d++, (x[d - 1] = i), (y[d - 1] = g), d++, (x[d - 1] = f), (y[d - 1] = i))
                    } else (w[e] = f), e++
                  ;(w[e] = c - 1), e++
                  for (var z = new Array(), h = 0; h < e; h++) z.push(a[w[h]])
                  return z.map(function(a) {
                    return {
                      type: 'Point',
                      coordinates: [a.lng, a.lat],
                    }
                  })
                }),
                (d.destinationPoint = function(a, b, c) {
                  ;(c /= 6371), (b = d.numberToRadius(b))
                  var e = d.numberToRadius(a.coordinates[0]),
                    f = d.numberToRadius(a.coordinates[1]),
                    g = Math.asin(Math.sin(f) * Math.cos(c) + Math.cos(f) * Math.sin(c) * Math.cos(b)),
                    h = e + Math.atan2(Math.sin(b) * Math.sin(c) * Math.cos(f), Math.cos(c) - Math.sin(f) * Math.sin(g))
                  return (
                    (h = ((h + 3 * Math.PI) % (2 * Math.PI)) - Math.PI),
                    {
                      type: 'Point',
                      coordinates: [d.numberToDegree(h), d.numberToDegree(g)],
                    }
                  )
                })
            })()
          },
          {},
        ],
      },
      {},
      [1],
    )(1)
  }),
  function(a) {
    function b(a, b, c) {
      switch (arguments.length) {
        case 2:
          return null != a ? a : b
        case 3:
          return null != a ? a : null != b ? b : c
        default:
          throw new Error('Implement me')
      }
    }

    function c(a, b) {
      return za.call(a, b)
    }

    function d() {
      return {
        empty: !1,
        unusedTokens: [],
        unusedInput: [],
        overflow: -2,
        charsLeftOver: 0,
        nullInput: !1,
        invalidMonth: null,
        invalidFormat: !1,
        userInvalidated: !1,
        iso: !1,
      }
    }

    function e(a) {
      ta.suppressDeprecationWarnings === !1 &&
        'undefined' != typeof console &&
        console.warn &&
        console.warn('Deprecation warning: ' + a)
    }

    function f(a, b) {
      var c = !0
      return m(function() {
        return c && (e(a), (c = !1)), b.apply(this, arguments)
      }, b)
    }

    function g(a, b) {
      qb[a] || (e(b), (qb[a] = !0))
    }

    function h(a, b) {
      return function(c) {
        return p(a.call(this, c), b)
      }
    }

    function i(a, b) {
      return function(c) {
        return this.localeData().ordinal(a.call(this, c), b)
      }
    }

    function j() {}

    function k(a, b) {
      b !== !1 && F(a), n(this, a), (this._d = new Date(+a._d))
    }

    function l(a) {
      var b = y(a),
        c = b.year || 0,
        d = b.quarter || 0,
        e = b.month || 0,
        f = b.week || 0,
        g = b.day || 0,
        h = b.hour || 0,
        i = b.minute || 0,
        j = b.second || 0,
        k = b.millisecond || 0
      ;(this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h),
        (this._days = +g + 7 * f),
        (this._months = +e + 3 * d + 12 * c),
        (this._data = {}),
        (this._locale = ta.localeData()),
        this._bubble()
    }

    function m(a, b) {
      for (var d in b) c(b, d) && (a[d] = b[d])
      return c(b, 'toString') && (a.toString = b.toString), c(b, 'valueOf') && (a.valueOf = b.valueOf), a
    }

    function n(a, b) {
      var c, d, e
      if (
        ('undefined' != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject),
        'undefined' != typeof b._i && (a._i = b._i),
        'undefined' != typeof b._f && (a._f = b._f),
        'undefined' != typeof b._l && (a._l = b._l),
        'undefined' != typeof b._strict && (a._strict = b._strict),
        'undefined' != typeof b._tzm && (a._tzm = b._tzm),
        'undefined' != typeof b._isUTC && (a._isUTC = b._isUTC),
        'undefined' != typeof b._offset && (a._offset = b._offset),
        'undefined' != typeof b._pf && (a._pf = b._pf),
        'undefined' != typeof b._locale && (a._locale = b._locale),
        Ia.length > 0)
      )
        for (c in Ia) (d = Ia[c]), (e = b[d]), 'undefined' != typeof e && (a[d] = e)
      return a
    }

    function o(a) {
      return a < 0 ? Math.ceil(a) : Math.floor(a)
    }

    function p(a, b, c) {
      for (var d = '' + Math.abs(a), e = a >= 0; d.length < b; ) d = '0' + d
      return (e ? (c ? '+' : '') : '-') + d
    }

    function q(a, b) {
      var c = {
        milliseconds: 0,
        months: 0,
      }
      return (
        (c.months = b.month() - a.month() + 12 * (b.year() - a.year())),
        a
          .clone()
          .add(c.months, 'M')
          .isAfter(b) && --c.months,
        (c.milliseconds = +b - +a.clone().add(c.months, 'M')),
        c
      )
    }

    function r(a, b) {
      var c
      return (
        (b = K(b, a)),
        a.isBefore(b) ? (c = q(a, b)) : ((c = q(b, a)), (c.milliseconds = -c.milliseconds), (c.months = -c.months)),
        c
      )
    }

    function s(a, b) {
      return function(c, d) {
        var e, f
        return (
          null === d ||
            isNaN(+d) ||
            (g(b, 'moment().' + b + '(period, number) is deprecated. Please use moment().' + b + '(number, period).'),
            (f = c),
            (c = d),
            (d = f)),
          (c = 'string' == typeof c ? +c : c),
          (e = ta.duration(c, d)),
          t(this, e, a),
          this
        )
      }
    }

    function t(a, b, c, d) {
      var e = b._milliseconds,
        f = b._days,
        g = b._months
      ;(d = null == d || d),
        e && a._d.setTime(+a._d + e * c),
        f && na(a, 'Date', ma(a, 'Date') + f * c),
        g && la(a, ma(a, 'Month') + g * c),
        d && ta.updateOffset(a, f || g)
    }

    function u(a) {
      return '[object Array]' === Object.prototype.toString.call(a)
    }

    function v(a) {
      return '[object Date]' === Object.prototype.toString.call(a) || a instanceof Date
    }

    function w(a, b, c) {
      var d,
        e = Math.min(a.length, b.length),
        f = Math.abs(a.length - b.length),
        g = 0
      for (d = 0; d < e; d++) ((c && a[d] !== b[d]) || (!c && A(a[d]) !== A(b[d]))) && g++
      return g + f
    }

    function x(a) {
      if (a) {
        var b = a.toLowerCase().replace(/(.)s$/, '$1')
        a = jb[a] || kb[b] || b
      }
      return a
    }

    function y(a) {
      var b,
        d,
        e = {}
      for (d in a) c(a, d) && ((b = x(d)), b && (e[b] = a[d]))
      return e
    }

    function z(b) {
      var c, d
      if (0 === b.indexOf('week')) (c = 7), (d = 'day')
      else {
        if (0 !== b.indexOf('month')) return
        ;(c = 12), (d = 'month')
      }
      ta[b] = function(e, f) {
        var g,
          h,
          i = ta._locale[b],
          j = []
        if (
          ('number' == typeof e && ((f = e), (e = a)),
          (h = function(a) {
            var b = ta()
              .utc()
              .set(d, a)
            return i.call(ta._locale, b, e || '')
          }),
          null != f)
        )
          return h(f)
        for (g = 0; g < c; g++) j.push(h(g))
        return j
      }
    }

    function A(a) {
      var b = +a,
        c = 0
      return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)), c
    }

    function B(a, b) {
      return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }

    function C(a, b, c) {
      return ha(ta([a, 11, 31 + b - c]), b, c).week
    }

    function D(a) {
      return E(a) ? 366 : 365
    }

    function E(a) {
      return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0
    }

    function F(a) {
      var b
      a._a &&
        a._pf.overflow === -2 &&
        ((b =
          a._a[Ba] < 0 || a._a[Ba] > 11
            ? Ba
            : a._a[Ca] < 1 || a._a[Ca] > B(a._a[Aa], a._a[Ba])
              ? Ca
              : a._a[Da] < 0 ||
                a._a[Da] > 24 ||
                (24 === a._a[Da] && (0 !== a._a[Ea] || 0 !== a._a[Fa] || 0 !== a._a[Ga]))
                ? Da
                : a._a[Ea] < 0 || a._a[Ea] > 59
                  ? Ea
                  : a._a[Fa] < 0 || a._a[Fa] > 59
                    ? Fa
                    : a._a[Ga] < 0 || a._a[Ga] > 999
                      ? Ga
                      : -1),
        a._pf._overflowDayOfYear && (b < Aa || b > Ca) && (b = Ca),
        (a._pf.overflow = b))
    }

    function G(b) {
      return (
        null == b._isValid &&
          ((b._isValid =
            !isNaN(b._d.getTime()) &&
            b._pf.overflow < 0 &&
            !b._pf.empty &&
            !b._pf.invalidMonth &&
            !b._pf.nullInput &&
            !b._pf.invalidFormat &&
            !b._pf.userInvalidated),
          b._strict &&
            (b._isValid =
              b._isValid && 0 === b._pf.charsLeftOver && 0 === b._pf.unusedTokens.length && b._pf.bigHour === a)),
        b._isValid
      )
    }

    function H(a) {
      return a ? a.toLowerCase().replace('_', '-') : a
    }

    function I(a) {
      for (var b, c, d, e, f = 0; f < a.length; ) {
        for (e = H(a[f]).split('-'), b = e.length, c = H(a[f + 1]), c = c ? c.split('-') : null; b > 0; ) {
          if ((d = J(e.slice(0, b).join('-')))) return d
          if (c && c.length >= b && w(e, c, !0) >= b - 1) break
          b--
        }
        f++
      }
      return null
    }

    function J(a) {
      var b = null
      if (!Ha[a] && Ja)
        try {
          ;(b = ta.locale()), require('./locale/' + a), ta.locale(b)
        } catch (a) {}
      return Ha[a]
    }

    function K(a, b) {
      var c, d
      return b._isUTC
        ? ((c = b.clone()),
          (d = (ta.isMoment(a) || v(a) ? +a : +ta(a)) - +c),
          c._d.setTime(+c._d + d),
          ta.updateOffset(c, !1),
          c)
        : ta(a).local()
    }

    function L(a) {
      return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, '') : a.replace(/\\/g, '')
    }

    function M(a) {
      var b,
        c,
        d = a.match(Na)
      for (b = 0, c = d.length; b < c; b++) pb[d[b]] ? (d[b] = pb[d[b]]) : (d[b] = L(d[b]))
      return function(e) {
        var f = ''
        for (b = 0; b < c; b++) f += d[b] instanceof Function ? d[b].call(e, a) : d[b]
        return f
      }
    }

    function N(a, b) {
      return a.isValid()
        ? ((b = O(b, a.localeData())), lb[b] || (lb[b] = M(b)), lb[b](a))
        : a.localeData().invalidDate()
    }

    function O(a, b) {
      function c(a) {
        return b.longDateFormat(a) || a
      }
      var d = 5
      for (Oa.lastIndex = 0; d >= 0 && Oa.test(a); ) (a = a.replace(Oa, c)), (Oa.lastIndex = 0), (d -= 1)
      return a
    }

    function P(a, b) {
      var c,
        d = b._strict
      switch (a) {
        case 'Q':
          return Za
        case 'DDDD':
          return _a
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
          return d ? ab : Ra
        case 'Y':
        case 'G':
        case 'g':
          return cb
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
          return d ? bb : Sa
        case 'S':
          if (d) return Za
        case 'SS':
          if (d) return $a
        case 'SSS':
          if (d) return _a
        case 'DDD':
          return Qa
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
          return Ua
        case 'a':
        case 'A':
          return b._locale._meridiemParse
        case 'x':
          return Xa
        case 'X':
          return Ya
        case 'Z':
        case 'ZZ':
          return Va
        case 'T':
          return Wa
        case 'SSSS':
          return Ta
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
          return d ? $a : Pa
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
          return Pa
        case 'Do':
          return d ? b._locale._ordinalParse : b._locale._ordinalParseLenient
        default:
          return (c = new RegExp(Y(X(a.replace('\\', '')), 'i')))
      }
    }

    function Q(a) {
      a = a || ''
      var b = a.match(Va) || [],
        c = b[b.length - 1] || [],
        d = (c + '').match(hb) || ['-', 0, 0],
        e = +(60 * d[1]) + A(d[2])
      return '+' === d[0] ? -e : e
    }

    function R(a, b, c) {
      var d,
        e = c._a
      switch (a) {
        case 'Q':
          null != b && (e[Ba] = 3 * (A(b) - 1))
          break
        case 'M':
        case 'MM':
          null != b && (e[Ba] = A(b) - 1)
          break
        case 'MMM':
        case 'MMMM':
          ;(d = c._locale.monthsParse(b, a, c._strict)), null != d ? (e[Ba] = d) : (c._pf.invalidMonth = b)
          break
        case 'D':
        case 'DD':
          null != b && (e[Ca] = A(b))
          break
        case 'Do':
          null != b && (e[Ca] = A(parseInt(b.match(/\d{1,2}/)[0], 10)))
          break
        case 'DDD':
        case 'DDDD':
          null != b && (c._dayOfYear = A(b))
          break
        case 'YY':
          e[Aa] = ta.parseTwoDigitYear(b)
          break
        case 'YYYY':
        case 'YYYYY':
        case 'YYYYYY':
          e[Aa] = A(b)
          break
        case 'a':
        case 'A':
          c._isPm = c._locale.isPM(b)
          break
        case 'h':
        case 'hh':
          c._pf.bigHour = !0
        case 'H':
        case 'HH':
          e[Da] = A(b)
          break
        case 'm':
        case 'mm':
          e[Ea] = A(b)
          break
        case 's':
        case 'ss':
          e[Fa] = A(b)
          break
        case 'S':
        case 'SS':
        case 'SSS':
        case 'SSSS':
          e[Ga] = A(1e3 * ('0.' + b))
          break
        case 'x':
          c._d = new Date(A(b))
          break
        case 'X':
          c._d = new Date(1e3 * parseFloat(b))
          break
        case 'Z':
        case 'ZZ':
          ;(c._useUTC = !0), (c._tzm = Q(b))
          break
        case 'dd':
        case 'ddd':
        case 'dddd':
          ;(d = c._locale.weekdaysParse(b)),
            null != d ? ((c._w = c._w || {}), (c._w.d = d)) : (c._pf.invalidWeekday = b)
          break
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
          a = a.substr(0, 1)
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
          ;(a = a.substr(0, 2)), b && ((c._w = c._w || {}), (c._w[a] = A(b)))
          break
        case 'gg':
        case 'GG':
          ;(c._w = c._w || {}), (c._w[a] = ta.parseTwoDigitYear(b))
      }
    }

    function S(a) {
      var c, d, e, f, g, h, i
      ;(c = a._w),
        null != c.GG || null != c.W || null != c.E
          ? ((g = 1), (h = 4), (d = b(c.GG, a._a[Aa], ha(ta(), 1, 4).year)), (e = b(c.W, 1)), (f = b(c.E, 1)))
          : ((g = a._locale._week.dow),
            (h = a._locale._week.doy),
            (d = b(c.gg, a._a[Aa], ha(ta(), g, h).year)),
            (e = b(c.w, 1)),
            null != c.d ? ((f = c.d), f < g && ++e) : (f = null != c.e ? c.e + g : g)),
        (i = ia(d, e, f, h, g)),
        (a._a[Aa] = i.year),
        (a._dayOfYear = i.dayOfYear)
    }

    function T(a) {
      var c,
        d,
        e,
        f,
        g = []
      if (!a._d) {
        for (
          e = V(a),
            a._w && null == a._a[Ca] && null == a._a[Ba] && S(a),
            a._dayOfYear &&
              ((f = b(a._a[Aa], e[Aa])),
              a._dayOfYear > D(f) && (a._pf._overflowDayOfYear = !0),
              (d = da(f, 0, a._dayOfYear)),
              (a._a[Ba] = d.getUTCMonth()),
              (a._a[Ca] = d.getUTCDate())),
            c = 0;
          c < 3 && null == a._a[c];
          ++c
        )
          a._a[c] = g[c] = e[c]
        for (; c < 7; c++) a._a[c] = g[c] = null == a._a[c] ? (2 === c ? 1 : 0) : a._a[c]
        24 === a._a[Da] && 0 === a._a[Ea] && 0 === a._a[Fa] && 0 === a._a[Ga] && ((a._nextDay = !0), (a._a[Da] = 0)),
          (a._d = (a._useUTC ? da : ca).apply(null, g)),
          null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() + a._tzm),
          a._nextDay && (a._a[Da] = 24)
      }
    }

    function U(a) {
      var b
      a._d ||
        ((b = y(a._i)), (a._a = [b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond]), T(a))
    }

    function V(a) {
      var b = new Date()
      return a._useUTC
        ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()]
        : [b.getFullYear(), b.getMonth(), b.getDate()]
    }

    function W(b) {
      if (b._f === ta.ISO_8601) return void $(b)
      ;(b._a = []), (b._pf.empty = !0)
      var c,
        d,
        e,
        f,
        g,
        h = '' + b._i,
        i = h.length,
        j = 0
      for (e = O(b._f, b._locale).match(Na) || [], c = 0; c < e.length; c++)
        (f = e[c]),
          (d = (h.match(P(f, b)) || [])[0]),
          d &&
            ((g = h.substr(0, h.indexOf(d))),
            g.length > 0 && b._pf.unusedInput.push(g),
            (h = h.slice(h.indexOf(d) + d.length)),
            (j += d.length)),
          pb[f]
            ? (d ? (b._pf.empty = !1) : b._pf.unusedTokens.push(f), R(f, d, b))
            : b._strict && !d && b._pf.unusedTokens.push(f)
      ;(b._pf.charsLeftOver = i - j),
        h.length > 0 && b._pf.unusedInput.push(h),
        b._pf.bigHour === !0 && b._a[Da] <= 12 && (b._pf.bigHour = a),
        b._isPm && b._a[Da] < 12 && (b._a[Da] += 12),
        b._isPm === !1 && 12 === b._a[Da] && (b._a[Da] = 0),
        T(b),
        F(b)
    }

    function X(a) {
      return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(a, b, c, d, e) {
        return b || c || d || e
      })
    }

    function Y(a) {
      return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    }

    function Z(a) {
      var b, c, e, f, g
      if (0 === a._f.length) return (a._pf.invalidFormat = !0), void (a._d = new Date(NaN))
      for (f = 0; f < a._f.length; f++)
        (g = 0),
          (b = n({}, a)),
          null != a._useUTC && (b._useUTC = a._useUTC),
          (b._pf = d()),
          (b._f = a._f[f]),
          W(b),
          G(b) &&
            ((g += b._pf.charsLeftOver),
            (g += 10 * b._pf.unusedTokens.length),
            (b._pf.score = g),
            (null == e || g < e) && ((e = g), (c = b)))
      m(a, c || b)
    }

    function $(a) {
      var b,
        c,
        d = a._i,
        e = db.exec(d)
      if (e) {
        for (a._pf.iso = !0, b = 0, c = fb.length; b < c; b++)
          if (fb[b][1].exec(d)) {
            a._f = fb[b][0] + (e[6] || ' ')
            break
          }
        for (b = 0, c = gb.length; b < c; b++)
          if (gb[b][1].exec(d)) {
            a._f += gb[b][0]
            break
          }
        d.match(Va) && (a._f += 'Z'), W(a)
      } else a._isValid = !1
    }

    function _(a) {
      $(a), a._isValid === !1 && (delete a._isValid, ta.createFromInputFallback(a))
    }

    function aa(a, b) {
      var c,
        d = []
      for (c = 0; c < a.length; ++c) d.push(b(a[c], c))
      return d
    }

    function ba(b) {
      var c,
        d = b._i
      d === a
        ? (b._d = new Date())
        : v(d)
          ? (b._d = new Date(+d))
          : null !== (c = Ka.exec(d))
            ? (b._d = new Date(+c[1]))
            : 'string' == typeof d
              ? _(b)
              : u(d)
                ? ((b._a = aa(d.slice(0), function(a) {
                    return parseInt(a, 10)
                  })),
                  T(b))
                : 'object' == typeof d
                  ? U(b)
                  : 'number' == typeof d
                    ? (b._d = new Date(d))
                    : ta.createFromInputFallback(b)
    }

    function ca(a, b, c, d, e, f, g) {
      var h = new Date(a, b, c, d, e, f, g)
      return a < 1970 && h.setFullYear(a), h
    }

    function da(a) {
      var b = new Date(Date.UTC.apply(null, arguments))
      return a < 1970 && b.setUTCFullYear(a), b
    }

    function ea(a, b) {
      if ('string' == typeof a)
        if (isNaN(a)) {
          if (((a = b.weekdaysParse(a)), 'number' != typeof a)) return null
        } else a = parseInt(a, 10)
      return a
    }

    function fa(a, b, c, d, e) {
      return e.relativeTime(b || 1, !!c, a, d)
    }

    function ga(a, b, c) {
      var d = ta.duration(a).abs(),
        e = ya(d.as('s')),
        f = ya(d.as('m')),
        g = ya(d.as('h')),
        h = ya(d.as('d')),
        i = ya(d.as('M')),
        j = ya(d.as('y')),
        k = (e < mb.s && ['s', e]) ||
          (1 === f && ['m']) ||
          (f < mb.m && ['mm', f]) ||
          (1 === g && ['h']) ||
          (g < mb.h && ['hh', g]) ||
          (1 === h && ['d']) ||
          (h < mb.d && ['dd', h]) ||
          (1 === i && ['M']) ||
          (i < mb.M && ['MM', i]) ||
          (1 === j && ['y']) || ['yy', j]
      return (k[2] = b), (k[3] = +a > 0), (k[4] = c), fa.apply({}, k)
    }

    function ha(a, b, c) {
      var d,
        e = c - b,
        f = c - a.day()
      return (
        f > e && (f -= 7),
        f < e - 7 && (f += 7),
        (d = ta(a).add(f, 'd')),
        {
          week: Math.ceil(d.dayOfYear() / 7),
          year: d.year(),
        }
      )
    }

    function ia(a, b, c, d, e) {
      var f,
        g,
        h = da(a, 0, 1).getUTCDay()
      return (
        (h = 0 === h ? 7 : h),
        (c = null != c ? c : e),
        (f = e - h + (h > d ? 7 : 0) - (h < e ? 7 : 0)),
        (g = 7 * (b - 1) + (c - e) + f + 1),
        {
          year: g > 0 ? a : a - 1,
          dayOfYear: g > 0 ? g : D(a - 1) + g,
        }
      )
    }

    function ja(b) {
      var c,
        d = b._i,
        e = b._f
      return (
        (b._locale = b._locale || ta.localeData(b._l)),
        null === d || (e === a && '' === d)
          ? ta.invalid({
              nullInput: !0,
            })
          : ('string' == typeof d && (b._i = d = b._locale.preparse(d)),
            ta.isMoment(d)
              ? new k(d, !0)
              : (e ? (u(e) ? Z(b) : W(b)) : ba(b), (c = new k(b)), c._nextDay && (c.add(1, 'd'), (c._nextDay = a)), c))
      )
    }

    function ka(a, b) {
      var c, d
      if ((1 === b.length && u(b[0]) && (b = b[0]), !b.length)) return ta()
      for (c = b[0], d = 1; d < b.length; ++d) b[d][a](c) && (c = b[d])
      return c
    }

    function la(a, b) {
      var c
      return 'string' == typeof b && ((b = a.localeData().monthsParse(b)), 'number' != typeof b)
        ? a
        : ((c = Math.min(a.date(), B(a.year(), b))), a._d['set' + (a._isUTC ? 'UTC' : '') + 'Month'](b, c), a)
    }

    function ma(a, b) {
      return a._d['get' + (a._isUTC ? 'UTC' : '') + b]()
    }

    function na(a, b, c) {
      return 'Month' === b ? la(a, c) : a._d['set' + (a._isUTC ? 'UTC' : '') + b](c)
    }

    function oa(a, b) {
      return function(c) {
        return null != c ? (na(this, a, c), ta.updateOffset(this, b), this) : ma(this, a)
      }
    }

    function pa(a) {
      return (400 * a) / 146097
    }

    function qa(a) {
      return (146097 * a) / 400
    }

    function ra(a) {
      ta.duration.fn[a] = function() {
        return this._data[a]
      }
    }

    function sa(a) {
      'undefined' == typeof ender &&
        ((ua = xa.moment),
        a
          ? (xa.moment = f(
              'Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.',
              ta,
            ))
          : (xa.moment = ta))
    }
    for (
      var ta,
        ua,
        va,
        wa = '2.8.4',
        xa = 'undefined' != typeof global ? global : this,
        ya = Math.round,
        za = Object.prototype.hasOwnProperty,
        Aa = 0,
        Ba = 1,
        Ca = 2,
        Da = 3,
        Ea = 4,
        Fa = 5,
        Ga = 6,
        Ha = {},
        Ia = [],
        Ja = 'undefined' != typeof module && module && module.exports,
        Ka = /^\/?Date\((\-?\d+)/i,
        La = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
        Ma = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,
        Na = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        Oa = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        Pa = /\d\d?/,
        Qa = /\d{1,3}/,
        Ra = /\d{1,4}/,
        Sa = /[+\-]?\d{1,6}/,
        Ta = /\d+/,
        Ua = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
        Va = /Z|[\+\-]\d\d:?\d\d/gi,
        Wa = /T/i,
        Xa = /[\+\-]?\d+/,
        Ya = /[\+\-]?\d+(\.\d{1,3})?/,
        Za = /\d/,
        $a = /\d\d/,
        _a = /\d{3}/,
        ab = /\d{4}/,
        bb = /[+-]?\d{6}/,
        cb = /[+-]?\d+/,
        db = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        eb = 'YYYY-MM-DDTHH:mm:ssZ',
        fb = [
          ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
          ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
          ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
          ['GGGG-[W]WW', /\d{4}-W\d{2}/],
          ['YYYY-DDD', /\d{4}-\d{3}/],
        ],
        gb = [
          ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
          ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
          ['HH:mm', /(T| )\d\d:\d\d/],
          ['HH', /(T| )\d\d/],
        ],
        hb = /([\+\-]|\d\d)/gi,
        ib = ('Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        {
          Milliseconds: 1,
          Seconds: 1e3,
          Minutes: 6e4,
          Hours: 36e5,
          Days: 864e5,
          Months: 2592e6,
          Years: 31536e6,
        }),
        jb = {
          ms: 'millisecond',
          s: 'second',
          m: 'minute',
          h: 'hour',
          d: 'day',
          D: 'date',
          w: 'week',
          W: 'isoWeek',
          M: 'month',
          Q: 'quarter',
          y: 'year',
          DDD: 'dayOfYear',
          e: 'weekday',
          E: 'isoWeekday',
          gg: 'weekYear',
          GG: 'isoWeekYear',
        },
        kb = {
          dayofyear: 'dayOfYear',
          isoweekday: 'isoWeekday',
          isoweek: 'isoWeek',
          weekyear: 'weekYear',
          isoweekyear: 'isoWeekYear',
        },
        lb = {},
        mb = {
          s: 45,
          m: 45,
          h: 22,
          d: 26,
          M: 11,
        },
        nb = 'DDD w W M D d'.split(' '),
        ob = 'M D H h m s w W'.split(' '),
        pb = {
          M: function() {
            return this.month() + 1
          },
          MMM: function(a) {
            return this.localeData().monthsShort(this, a)
          },
          MMMM: function(a) {
            return this.localeData().months(this, a)
          },
          D: function() {
            return this.date()
          },
          DDD: function() {
            return this.dayOfYear()
          },
          d: function() {
            return this.day()
          },
          dd: function(a) {
            return this.localeData().weekdaysMin(this, a)
          },
          ddd: function(a) {
            return this.localeData().weekdaysShort(this, a)
          },
          dddd: function(a) {
            return this.localeData().weekdays(this, a)
          },
          w: function() {
            return this.week()
          },
          W: function() {
            return this.isoWeek()
          },
          YY: function() {
            return p(this.year() % 100, 2)
          },
          YYYY: function() {
            return p(this.year(), 4)
          },
          YYYYY: function() {
            return p(this.year(), 5)
          },
          YYYYYY: function() {
            var a = this.year(),
              b = a >= 0 ? '+' : '-'
            return b + p(Math.abs(a), 6)
          },
          gg: function() {
            return p(this.weekYear() % 100, 2)
          },
          gggg: function() {
            return p(this.weekYear(), 4)
          },
          ggggg: function() {
            return p(this.weekYear(), 5)
          },
          GG: function() {
            return p(this.isoWeekYear() % 100, 2)
          },
          GGGG: function() {
            return p(this.isoWeekYear(), 4)
          },
          GGGGG: function() {
            return p(this.isoWeekYear(), 5)
          },
          e: function() {
            return this.weekday()
          },
          E: function() {
            return this.isoWeekday()
          },
          a: function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), !0)
          },
          A: function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), !1)
          },
          H: function() {
            return this.hours()
          },
          h: function() {
            return this.hours() % 12 || 12
          },
          m: function() {
            return this.minutes()
          },
          s: function() {
            return this.seconds()
          },
          S: function() {
            return A(this.milliseconds() / 100)
          },
          SS: function() {
            return p(A(this.milliseconds() / 10), 2)
          },
          SSS: function() {
            return p(this.milliseconds(), 3)
          },
          SSSS: function() {
            return p(this.milliseconds(), 3)
          },
          Z: function() {
            var a = -this.zone(),
              b = '+'
            return a < 0 && ((a = -a), (b = '-')), b + p(A(a / 60), 2) + ':' + p(A(a) % 60, 2)
          },
          ZZ: function() {
            var a = -this.zone(),
              b = '+'
            return a < 0 && ((a = -a), (b = '-')), b + p(A(a / 60), 2) + p(A(a) % 60, 2)
          },
          z: function() {
            return this.zoneAbbr()
          },
          zz: function() {
            return this.zoneName()
          },
          x: function() {
            return this.valueOf()
          },
          X: function() {
            return this.unix()
          },
          Q: function() {
            return this.quarter()
          },
        },
        qb = {},
        rb = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];
      nb.length;

    )
      (va = nb.pop()), (pb[va + 'o'] = i(pb[va], va))
    for (; ob.length; ) (va = ob.pop()), (pb[va + va] = h(pb[va], 2))
    ;(pb.DDDD = h(pb.DDD, 3)),
      m(j.prototype, {
        set: function(a) {
          var b, c
          for (c in a) (b = a[c]), 'function' == typeof b ? (this[c] = b) : (this['_' + c] = b)
          this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source)
        },
        _months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months: function(a) {
          return this._months[a.month()]
        },
        _monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort: function(a) {
          return this._monthsShort[a.month()]
        },
        monthsParse: function(a, b, c) {
          var d, e, f
          for (
            this._monthsParse ||
              ((this._monthsParse = []), (this._longMonthsParse = []), (this._shortMonthsParse = [])),
              d = 0;
            d < 12;
            d++
          ) {
            if (
              ((e = ta.utc([2e3, d])),
              c &&
                !this._longMonthsParse[d] &&
                ((this._longMonthsParse[d] = new RegExp('^' + this.months(e, '').replace('.', '') + '$', 'i')),
                (this._shortMonthsParse[d] = new RegExp('^' + this.monthsShort(e, '').replace('.', '') + '$', 'i'))),
              c ||
                this._monthsParse[d] ||
                ((f = '^' + this.months(e, '') + '|^' + this.monthsShort(e, '')),
                (this._monthsParse[d] = new RegExp(f.replace('.', ''), 'i'))),
              c && 'MMMM' === b && this._longMonthsParse[d].test(a))
            )
              return d
            if (c && 'MMM' === b && this._shortMonthsParse[d].test(a)) return d
            if (!c && this._monthsParse[d].test(a)) return d
          }
        },
        _weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays: function(a) {
          return this._weekdays[a.day()]
        },
        _weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort: function(a) {
          return this._weekdaysShort[a.day()]
        },
        _weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin: function(a) {
          return this._weekdaysMin[a.day()]
        },
        weekdaysParse: function(a) {
          var b, c, d
          for (this._weekdaysParse || (this._weekdaysParse = []), b = 0; b < 7; b++)
            if (
              (this._weekdaysParse[b] ||
                ((c = ta([2e3, 1]).day(b)),
                (d = '^' + this.weekdays(c, '') + '|^' + this.weekdaysShort(c, '') + '|^' + this.weekdaysMin(c, '')),
                (this._weekdaysParse[b] = new RegExp(d.replace('.', ''), 'i'))),
              this._weekdaysParse[b].test(a))
            )
              return b
        },
        _longDateFormat: {
          LTS: 'h:mm:ss A',
          LT: 'h:mm A',
          L: 'MM/DD/YYYY',
          LL: 'MMMM D, YYYY',
          LLL: 'MMMM D, YYYY LT',
          LLLL: 'dddd, MMMM D, YYYY LT',
        },
        longDateFormat: function(a) {
          var b = this._longDateFormat[a]
          return (
            !b &&
              this._longDateFormat[a.toUpperCase()] &&
              ((b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(a) {
                return a.slice(1)
              })),
              (this._longDateFormat[a] = b)),
            b
          )
        },
        isPM: function(a) {
          return 'p' === (a + '').toLowerCase().charAt(0)
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function(a, b, c) {
          return a > 11 ? (c ? 'pm' : 'PM') : c ? 'am' : 'AM'
        },
        _calendar: {
          sameDay: '[Today at] LT',
          nextDay: '[Tomorrow at] LT',
          nextWeek: 'dddd [at] LT',
          lastDay: '[Yesterday at] LT',
          lastWeek: '[Last] dddd [at] LT',
          sameElse: 'L',
        },
        calendar: function(a, b, c) {
          var d = this._calendar[a]
          return 'function' == typeof d ? d.apply(b, [c]) : d
        },
        _relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s: 'a few seconds',
          m: 'a minute',
          mm: '%d minutes',
          h: 'an hour',
          hh: '%d hours',
          d: 'a day',
          dd: '%d days',
          M: 'a month',
          MM: '%d months',
          y: 'a year',
          yy: '%d years',
        },
        relativeTime: function(a, b, c, d) {
          var e = this._relativeTime[c]
          return 'function' == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
        },
        pastFuture: function(a, b) {
          var c = this._relativeTime[a > 0 ? 'future' : 'past']
          return 'function' == typeof c ? c(b) : c.replace(/%s/i, b)
        },
        ordinal: function(a) {
          return this._ordinal.replace('%d', a)
        },
        _ordinal: '%d',
        _ordinalParse: /\d{1,2}/,
        preparse: function(a) {
          return a
        },
        postformat: function(a) {
          return a
        },
        week: function(a) {
          return ha(a, this._week.dow, this._week.doy).week
        },
        _week: {
          dow: 0,
          doy: 6,
        },
        _invalidDate: 'Invalid date',
        invalidDate: function() {
          return this._invalidDate
        },
      }),
      (ta = function(b, c, e, f) {
        var g
        return (
          'boolean' == typeof e && ((f = e), (e = a)),
          (g = {}),
          (g._isAMomentObject = !0),
          (g._i = b),
          (g._f = c),
          (g._l = e),
          (g._strict = f),
          (g._isUTC = !1),
          (g._pf = d()),
          ja(g)
        )
      }),
      (ta.suppressDeprecationWarnings = !1),
      (ta.createFromInputFallback = f(
        'moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.',
        function(a) {
          a._d = new Date(a._i + (a._useUTC ? ' UTC' : ''))
        },
      )),
      (ta.min = function() {
        var a = [].slice.call(arguments, 0)
        return ka('isBefore', a)
      }),
      (ta.max = function() {
        var a = [].slice.call(arguments, 0)
        return ka('isAfter', a)
      }),
      (ta.utc = function(b, c, e, f) {
        var g
        return (
          'boolean' == typeof e && ((f = e), (e = a)),
          (g = {}),
          (g._isAMomentObject = !0),
          (g._useUTC = !0),
          (g._isUTC = !0),
          (g._l = e),
          (g._i = b),
          (g._f = c),
          (g._strict = f),
          (g._pf = d()),
          ja(g).utc()
        )
      }),
      (ta.unix = function(a) {
        return ta(1e3 * a)
      }),
      (ta.duration = function(a, b) {
        var d,
          e,
          f,
          g,
          h = a,
          i = null
        return (
          ta.isDuration(a)
            ? (h = {
                ms: a._milliseconds,
                d: a._days,
                M: a._months,
              })
            : 'number' == typeof a
              ? ((h = {}), b ? (h[b] = a) : (h.milliseconds = a))
              : (i = La.exec(a))
                ? ((d = '-' === i[1] ? -1 : 1),
                  (h = {
                    y: 0,
                    d: A(i[Ca]) * d,
                    h: A(i[Da]) * d,
                    m: A(i[Ea]) * d,
                    s: A(i[Fa]) * d,
                    ms: A(i[Ga]) * d,
                  }))
                : (i = Ma.exec(a))
                  ? ((d = '-' === i[1] ? -1 : 1),
                    (f = function(a) {
                      var b = a && parseFloat(a.replace(',', '.'))
                      return (isNaN(b) ? 0 : b) * d
                    }),
                    (h = {
                      y: f(i[2]),
                      M: f(i[3]),
                      d: f(i[4]),
                      h: f(i[5]),
                      m: f(i[6]),
                      s: f(i[7]),
                      w: f(i[8]),
                    }))
                  : 'object' == typeof h &&
                    ('from' in h || 'to' in h) &&
                    ((g = r(ta(h.from), ta(h.to))), (h = {}), (h.ms = g.milliseconds), (h.M = g.months)),
          (e = new l(h)),
          ta.isDuration(a) && c(a, '_locale') && (e._locale = a._locale),
          e
        )
      }),
      (ta.version = wa),
      (ta.defaultFormat = eb),
      (ta.ISO_8601 = function() {}),
      (ta.momentProperties = Ia),
      (ta.updateOffset = function() {}),
      (ta.relativeTimeThreshold = function(b, c) {
        return mb[b] !== a && (c === a ? mb[b] : ((mb[b] = c), !0))
      }),
      (ta.lang = f('moment.lang is deprecated. Use moment.locale instead.', function(a, b) {
        return ta.locale(a, b)
      })),
      (ta.locale = function(a, b) {
        var c
        return (
          a &&
            ((c = 'undefined' != typeof b ? ta.defineLocale(a, b) : ta.localeData(a)),
            c && (ta.duration._locale = ta._locale = c)),
          ta._locale._abbr
        )
      }),
      (ta.defineLocale = function(a, b) {
        return null !== b
          ? ((b.abbr = a), Ha[a] || (Ha[a] = new j()), Ha[a].set(b), ta.locale(a), Ha[a])
          : (delete Ha[a], null)
      }),
      (ta.langData = f('moment.langData is deprecated. Use moment.localeData instead.', function(a) {
        return ta.localeData(a)
      })),
      (ta.localeData = function(a) {
        var b
        if ((a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a)) return ta._locale
        if (!u(a)) {
          if ((b = J(a))) return b
          a = [a]
        }
        return I(a)
      }),
      (ta.isMoment = function(a) {
        return a instanceof k || (null != a && c(a, '_isAMomentObject'))
      }),
      (ta.isDuration = function(a) {
        return a instanceof l
      })
    for (va = rb.length - 1; va >= 0; --va) z(rb[va])
    ;(ta.normalizeUnits = function(a) {
      return x(a)
    }),
      (ta.invalid = function(a) {
        var b = ta.utc(NaN)
        return null != a ? m(b._pf, a) : (b._pf.userInvalidated = !0), b
      }),
      (ta.parseZone = function() {
        return ta.apply(null, arguments).parseZone()
      }),
      (ta.parseTwoDigitYear = function(a) {
        return A(a) + (A(a) > 68 ? 1900 : 2e3)
      }),
      m((ta.fn = k.prototype), {
        clone: function() {
          return ta(this)
        },
        valueOf: function() {
          return +this._d + 6e4 * (this._offset || 0)
        },
        unix: function() {
          return Math.floor(+this / 1e3)
        },
        toString: function() {
          return this.clone()
            .locale('en')
            .format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ')
        },
        toDate: function() {
          return this._offset ? new Date(+this) : this._d
        },
        toISOString: function() {
          var a = ta(this).utc()
          return 0 < a.year() && a.year() <= 9999
            ? 'function' == typeof Date.prototype.toISOString
              ? this.toDate().toISOString()
              : N(a, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
            : N(a, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
        },
        toArray: function() {
          var a = this
          return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
        },
        isValid: function() {
          return G(this)
        },
        isDSTShifted: function() {
          return (
            !!this._a && (this.isValid() && w(this._a, (this._isUTC ? ta.utc(this._a) : ta(this._a)).toArray()) > 0)
          )
        },
        parsingFlags: function() {
          return m({}, this._pf)
        },
        invalidAt: function() {
          return this._pf.overflow
        },
        utc: function(a) {
          return this.zone(0, a)
        },
        local: function(a) {
          return this._isUTC && (this.zone(0, a), (this._isUTC = !1), a && this.add(this._dateTzOffset(), 'm')), this
        },
        format: function(a) {
          var b = N(this, a || ta.defaultFormat)
          return this.localeData().postformat(b)
        },
        add: s(1, 'add'),
        subtract: s(-1, 'subtract'),
        diff: function(a, b, c) {
          var d,
            e,
            f,
            g = K(a, this),
            h = 6e4 * (this.zone() - g.zone())
          return (
            (b = x(b)),
            'year' === b || 'month' === b
              ? ((d = 432e5 * (this.daysInMonth() + g.daysInMonth())),
                (e = 12 * (this.year() - g.year()) + (this.month() - g.month())),
                (f = this - ta(this).startOf('month') - (g - ta(g).startOf('month'))),
                (f -=
                  6e4 *
                  (this.zone() -
                    ta(this)
                      .startOf('month')
                      .zone() -
                    (g.zone() -
                      ta(g)
                        .startOf('month')
                        .zone()))),
                (e += f / d),
                'year' === b && (e /= 12))
              : ((d = this - g),
                (e =
                  'second' === b
                    ? d / 1e3
                    : 'minute' === b
                      ? d / 6e4
                      : 'hour' === b
                        ? d / 36e5
                        : 'day' === b
                          ? (d - h) / 864e5
                          : 'week' === b
                            ? (d - h) / 6048e5
                            : d)),
            c ? e : o(e)
          )
        },
        from: function(a, b) {
          return ta
            .duration({
              to: this,
              from: a,
            })
            .locale(this.locale())
            .humanize(!b)
        },
        fromNow: function(a) {
          return this.from(ta(), a)
        },
        calendar: function(a) {
          var b = a || ta(),
            c = K(b, this).startOf('day'),
            d = this.diff(c, 'days', !0),
            e =
              d < -6
                ? 'sameElse'
                : d < -1
                  ? 'lastWeek'
                  : d < 0
                    ? 'lastDay'
                    : d < 1
                      ? 'sameDay'
                      : d < 2
                        ? 'nextDay'
                        : d < 7
                          ? 'nextWeek'
                          : 'sameElse'
          return this.format(this.localeData().calendar(e, this, ta(b)))
        },
        isLeapYear: function() {
          return E(this.year())
        },
        isDST: function() {
          return (
            this.zone() <
              this.clone()
                .month(0)
                .zone() ||
            this.zone() <
              this.clone()
                .month(5)
                .zone()
          )
        },
        day: function(a) {
          var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay()
          return null != a ? ((a = ea(a, this.localeData())), this.add(a - b, 'd')) : b
        },
        month: oa('Month', !0),
        startOf: function(a) {
          switch ((a = x(a))) {
            case 'year':
              this.month(0)
            case 'quarter':
            case 'month':
              this.date(1)
            case 'week':
            case 'isoWeek':
            case 'day':
              this.hours(0)
            case 'hour':
              this.minutes(0)
            case 'minute':
              this.seconds(0)
            case 'second':
              this.milliseconds(0)
          }
          return (
            'week' === a ? this.weekday(0) : 'isoWeek' === a && this.isoWeekday(1),
            'quarter' === a && this.month(3 * Math.floor(this.month() / 3)),
            this
          )
        },
        endOf: function(b) {
          return (
            (b = x(b)),
            b === a || 'millisecond' === b
              ? this
              : this.startOf(b)
                  .add(1, 'isoWeek' === b ? 'week' : b)
                  .subtract(1, 'ms')
          )
        },
        isAfter: function(a, b) {
          var c
          return (
            (b = x('undefined' != typeof b ? b : 'millisecond')),
            'millisecond' === b
              ? ((a = ta.isMoment(a) ? a : ta(a)), +this > +a)
              : ((c = ta.isMoment(a) ? +a : +ta(a)), c < +this.clone().startOf(b))
          )
        },
        isBefore: function(a, b) {
          var c
          return (
            (b = x('undefined' != typeof b ? b : 'millisecond')),
            'millisecond' === b
              ? ((a = ta.isMoment(a) ? a : ta(a)), +this < +a)
              : ((c = ta.isMoment(a) ? +a : +ta(a)), +this.clone().endOf(b) < c)
          )
        },
        isSame: function(a, b) {
          var c
          return (
            (b = x(b || 'millisecond')),
            'millisecond' === b
              ? ((a = ta.isMoment(a) ? a : ta(a)), +this === +a)
              : ((c = +ta(a)), +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b))
          )
        },
        min: f(
          'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
          function(a) {
            return (a = ta.apply(null, arguments)), a < this ? this : a
          },
        ),
        max: f(
          'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
          function(a) {
            return (a = ta.apply(null, arguments)), a > this ? this : a
          },
        ),
        zone: function(a, b) {
          var c,
            d = this._offset || 0
          return null == a
            ? this._isUTC
              ? d
              : this._dateTzOffset()
            : ('string' == typeof a && (a = Q(a)),
              Math.abs(a) < 16 && (a *= 60),
              !this._isUTC && b && (c = this._dateTzOffset()),
              (this._offset = a),
              (this._isUTC = !0),
              null != c && this.subtract(c, 'm'),
              d !== a &&
                (!b || this._changeInProgress
                  ? t(this, ta.duration(d - a, 'm'), 1, !1)
                  : this._changeInProgress ||
                    ((this._changeInProgress = !0), ta.updateOffset(this, !0), (this._changeInProgress = null))),
              this)
        },
        zoneAbbr: function() {
          return this._isUTC ? 'UTC' : ''
        },
        zoneName: function() {
          return this._isUTC ? 'Coordinated Universal Time' : ''
        },
        parseZone: function() {
          return this._tzm ? this.zone(this._tzm) : 'string' == typeof this._i && this.zone(this._i), this
        },
        hasAlignedHourOffset: function(a) {
          return (a = a ? ta(a).zone() : 0), (this.zone() - a) % 60 === 0
        },
        daysInMonth: function() {
          return B(this.year(), this.month())
        },
        dayOfYear: function(a) {
          var b = ya((ta(this).startOf('day') - ta(this).startOf('year')) / 864e5) + 1
          return null == a ? b : this.add(a - b, 'd')
        },
        quarter: function(a) {
          return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + (this.month() % 3))
        },
        weekYear: function(a) {
          var b = ha(this, this.localeData()._week.dow, this.localeData()._week.doy).year
          return null == a ? b : this.add(a - b, 'y')
        },
        isoWeekYear: function(a) {
          var b = ha(this, 1, 4).year
          return null == a ? b : this.add(a - b, 'y')
        },
        week: function(a) {
          var b = this.localeData().week(this)
          return null == a ? b : this.add(7 * (a - b), 'd')
        },
        isoWeek: function(a) {
          var b = ha(this, 1, 4).week
          return null == a ? b : this.add(7 * (a - b), 'd')
        },
        weekday: function(a) {
          var b = (this.day() + 7 - this.localeData()._week.dow) % 7
          return null == a ? b : this.add(a - b, 'd')
        },
        isoWeekday: function(a) {
          return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
        },
        isoWeeksInYear: function() {
          return C(this.year(), 1, 4)
        },
        weeksInYear: function() {
          var a = this.localeData()._week
          return C(this.year(), a.dow, a.doy)
        },
        get: function(a) {
          return (a = x(a)), this[a]()
        },
        set: function(a, b) {
          return (a = x(a)), 'function' == typeof this[a] && this[a](b), this
        },
        locale: function(b) {
          var c
          return b === a ? this._locale._abbr : ((c = ta.localeData(b)), null != c && (this._locale = c), this)
        },
        lang: f(
          'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
          function(b) {
            return b === a ? this.localeData() : this.locale(b)
          },
        ),
        localeData: function() {
          return this._locale
        },
        _dateTzOffset: function() {
          return 15 * Math.round(this._d.getTimezoneOffset() / 15)
        },
      }),
      (ta.fn.millisecond = ta.fn.milliseconds = oa('Milliseconds', !1)),
      (ta.fn.second = ta.fn.seconds = oa('Seconds', !1)),
      (ta.fn.minute = ta.fn.minutes = oa('Minutes', !1)),
      (ta.fn.hour = ta.fn.hours = oa('Hours', !0)),
      (ta.fn.date = oa('Date', !0)),
      (ta.fn.dates = f('dates accessor is deprecated. Use date instead.', oa('Date', !0))),
      (ta.fn.year = oa('FullYear', !0)),
      (ta.fn.years = f('years accessor is deprecated. Use year instead.', oa('FullYear', !0))),
      (ta.fn.days = ta.fn.day),
      (ta.fn.months = ta.fn.month),
      (ta.fn.weeks = ta.fn.week),
      (ta.fn.isoWeeks = ta.fn.isoWeek),
      (ta.fn.quarters = ta.fn.quarter),
      (ta.fn.toJSON = ta.fn.toISOString),
      m((ta.duration.fn = l.prototype), {
        _bubble: function() {
          var a,
            b,
            c,
            d = this._milliseconds,
            e = this._days,
            f = this._months,
            g = this._data,
            h = 0
          ;(g.milliseconds = d % 1e3),
            (a = o(d / 1e3)),
            (g.seconds = a % 60),
            (b = o(a / 60)),
            (g.minutes = b % 60),
            (c = o(b / 60)),
            (g.hours = c % 24),
            (e += o(c / 24)),
            (h = o(pa(e))),
            (e -= o(qa(h))),
            (f += o(e / 30)),
            (e %= 30),
            (h += o(f / 12)),
            (f %= 12),
            (g.days = e),
            (g.months = f),
            (g.years = h)
        },
        abs: function() {
          return (
            (this._milliseconds = Math.abs(this._milliseconds)),
            (this._days = Math.abs(this._days)),
            (this._months = Math.abs(this._months)),
            (this._data.milliseconds = Math.abs(this._data.milliseconds)),
            (this._data.seconds = Math.abs(this._data.seconds)),
            (this._data.minutes = Math.abs(this._data.minutes)),
            (this._data.hours = Math.abs(this._data.hours)),
            (this._data.months = Math.abs(this._data.months)),
            (this._data.years = Math.abs(this._data.years)),
            this
          )
        },
        weeks: function() {
          return o(this.days() / 7)
        },
        valueOf: function() {
          return this._milliseconds + 864e5 * this._days + (this._months % 12) * 2592e6 + 31536e6 * A(this._months / 12)
        },
        humanize: function(a) {
          var b = ga(this, !a, this.localeData())
          return a && (b = this.localeData().pastFuture(+this, b)), this.localeData().postformat(b)
        },
        add: function(a, b) {
          var c = ta.duration(a, b)
          return (
            (this._milliseconds += c._milliseconds),
            (this._days += c._days),
            (this._months += c._months),
            this._bubble(),
            this
          )
        },
        subtract: function(a, b) {
          var c = ta.duration(a, b)
          return (
            (this._milliseconds -= c._milliseconds),
            (this._days -= c._days),
            (this._months -= c._months),
            this._bubble(),
            this
          )
        },
        get: function(a) {
          return (a = x(a)), this[a.toLowerCase() + 's']()
        },
        as: function(a) {
          var b, c
          if (((a = x(a)), 'month' === a || 'year' === a))
            return (
              (b = this._days + this._milliseconds / 864e5), (c = this._months + 12 * pa(b)), 'month' === a ? c : c / 12
            )
          switch (((b = this._days + Math.round(qa(this._months / 12))), a)) {
            case 'week':
              return b / 7 + this._milliseconds / 6048e5
            case 'day':
              return b + this._milliseconds / 864e5
            case 'hour':
              return 24 * b + this._milliseconds / 36e5
            case 'minute':
              return 24 * b * 60 + this._milliseconds / 6e4
            case 'second':
              return 24 * b * 60 * 60 + this._milliseconds / 1e3
            case 'millisecond':
              return Math.floor(24 * b * 60 * 60 * 1e3) + this._milliseconds
            default:
              throw new Error('Unknown unit ' + a)
          }
        },
        lang: ta.fn.lang,
        locale: ta.fn.locale,
        toIsoString: f(
          'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
          function() {
            return this.toISOString()
          },
        ),
        toISOString: function() {
          var a = Math.abs(this.years()),
            b = Math.abs(this.months()),
            c = Math.abs(this.days()),
            d = Math.abs(this.hours()),
            e = Math.abs(this.minutes()),
            f = Math.abs(this.seconds() + this.milliseconds() / 1e3)
          return this.asSeconds()
            ? (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (a ? a + 'Y' : '') +
                (b ? b + 'M' : '') +
                (c ? c + 'D' : '') +
                (d || e || f ? 'T' : '') +
                (d ? d + 'H' : '') +
                (e ? e + 'M' : '') +
                (f ? f + 'S' : '')
            : 'P0D'
        },
        localeData: function() {
          return this._locale
        },
      }),
      (ta.duration.fn.toString = ta.duration.fn.toISOString)
    for (va in ib) c(ib, va) && ra(va.toLowerCase())
    ;(ta.duration.fn.asMilliseconds = function() {
      return this.as('ms')
    }),
      (ta.duration.fn.asSeconds = function() {
        return this.as('s')
      }),
      (ta.duration.fn.asMinutes = function() {
        return this.as('m')
      }),
      (ta.duration.fn.asHours = function() {
        return this.as('h')
      }),
      (ta.duration.fn.asDays = function() {
        return this.as('d')
      }),
      (ta.duration.fn.asWeeks = function() {
        return this.as('weeks')
      }),
      (ta.duration.fn.asMonths = function() {
        return this.as('M')
      }),
      (ta.duration.fn.asYears = function() {
        return this.as('y')
      }),
      ta.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(a) {
          var b = a % 10,
            c = 1 === A((a % 100) / 10) ? 'th' : 1 === b ? 'st' : 2 === b ? 'nd' : 3 === b ? 'rd' : 'th'
          return a + c
        },
      }),
      Ja
        ? (module.exports = ta)
        : 'function' == typeof define && define.amd
          ? (define('moment', function(a, b, c) {
              return c.config && c.config() && c.config().noGlobal === !0 && (xa.moment = ua), ta
            }),
            sa(!0))
          : sa()
  }.call(this),
  (function(a) {
    'function' == typeof define && define.amd
      ? define(['moment'], a)
      : 'object' == typeof exports
        ? (module.exports = a(require('../moment')))
        : a(('undefined' != typeof global ? global : this).moment)
  })(function(a) {
    function b(a, b) {
      var c = a.split('_')
      return b % 10 === 1 && b % 100 !== 11
        ? c[0]
        : b % 10 >= 2 && b % 10 <= 4 && (b % 100 < 10 || b % 100 >= 20)
          ? c[1]
          : c[2]
    }

    function c(a, c, d) {
      var e = {
        mm: c ? 'Ð¼Ð¸Ð½ÑƒÑ‚Ð°_Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹_Ð¼Ð¸Ð½ÑƒÑ‚' : 'Ð¼Ð¸Ð½ÑƒÑ‚Ñƒ_Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹_Ð¼Ð¸Ð½ÑƒÑ‚',
        hh: 'Ñ‡Ð°Ñ_Ñ‡Ð°ÑÐ°_Ñ‡Ð°ÑÐ¾Ð²',
        dd: 'Ð´ÐµÐ½ÑŒ_Ð´Ð½Ñ_Ð´Ð½ÐµÐ¹',
        MM: 'Ð¼ÐµÑÑÑ†_Ð¼ÐµÑÑÑ†Ð°_Ð¼ÐµÑÑÑ†ÐµÐ²',
        yy: 'Ð³Ð¾Ð´_Ð³Ð¾Ð´Ð°_Ð»ÐµÑ‚',
      }
      return 'm' === d ? (c ? 'Ð¼Ð¸Ð½ÑƒÑ‚Ð°' : 'Ð¼Ð¸Ð½ÑƒÑ‚Ñƒ') : a + ' ' + b(e[d], +a)
    }

    function d(a, b) {
      var c = {
          nominative: 'ÑÐ½Ð²Ð°Ñ€ÑŒ_Ñ„ÐµÐ²Ñ€Ð°Ð»ÑŒ_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€ÐµÐ»ÑŒ_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½ÑŒ_Ð¸ÑŽÐ»ÑŒ_Ð°Ð²Ð³ÑƒÑÑ‚_ÑÐµÐ½Ñ‚ÑÐ±Ñ€ÑŒ_Ð¾ÐºÑ‚ÑÐ±Ñ€ÑŒ_Ð½Ð¾ÑÐ±Ñ€ÑŒ_Ð´ÐµÐºÐ°Ð±Ñ€ÑŒ'.split(
            '_',
          ),
          accusative: 'ÑÐ½Ð²Ð°Ñ€Ñ_Ñ„ÐµÐ²Ñ€Ð°Ð»Ñ_Ð¼Ð°Ñ€Ñ‚Ð°_Ð°Ð¿Ñ€ÐµÐ»Ñ_Ð¼Ð°Ñ_Ð¸ÑŽÐ½Ñ_Ð¸ÑŽÐ»Ñ_Ð°Ð²Ð³ÑƒÑÑ‚Ð°_ÑÐµÐ½Ñ‚ÑÐ±Ñ€Ñ_Ð¾ÐºÑ‚ÑÐ±Ñ€Ñ_Ð½Ð¾ÑÐ±Ñ€Ñ_Ð´ÐµÐºÐ°Ð±Ñ€Ñ'.split(
            '_',
          ),
        },
        d = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b) ? 'accusative' : 'nominative'
      return c[d][a.month()]
    }

    function e(a, b) {
      var c = {
          nominative: 'ÑÐ½Ð²_Ñ„ÐµÐ²_Ð¼Ð°Ñ€Ñ‚_Ð°Ð¿Ñ€_Ð¼Ð°Ð¹_Ð¸ÑŽÐ½ÑŒ_Ð¸ÑŽÐ»ÑŒ_Ð°Ð²Ð³_ÑÐµÐ½_Ð¾ÐºÑ‚_Ð½Ð¾Ñ_Ð´ÐµÐº'.split(
            '_',
          ),
          accusative: 'ÑÐ½Ð²_Ñ„ÐµÐ²_Ð¼Ð°Ñ€_Ð°Ð¿Ñ€_Ð¼Ð°Ñ_Ð¸ÑŽÐ½Ñ_Ð¸ÑŽÐ»Ñ_Ð°Ð²Ð³_ÑÐµÐ½_Ð¾ÐºÑ‚_Ð½Ð¾Ñ_Ð´ÐµÐº'.split('_'),
        },
        d = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b) ? 'accusative' : 'nominative'
      return c[d][a.month()]
    }

    function f(a, b) {
      var c = {
          nominative: 'Ð²Ð¾ÑÐºÑ€ÐµÑÐµÐ½ÑŒÐµ_Ð¿Ð¾Ð½ÐµÐ´ÐµÐ»ÑŒÐ½Ð¸Ðº_Ð²Ñ‚Ð¾Ñ€Ð½Ð¸Ðº_ÑÑ€ÐµÐ´Ð°_Ñ‡ÐµÑ‚Ð²ÐµÑ€Ð³_Ð¿ÑÑ‚Ð½Ð¸Ñ†Ð°_ÑÑƒÐ±Ð±Ð¾Ñ‚Ð°'.split(
            '_',
          ),
          accusative: 'Ð²Ð¾ÑÐºÑ€ÐµÑÐµÐ½ÑŒÐµ_Ð¿Ð¾Ð½ÐµÐ´ÐµÐ»ÑŒÐ½Ð¸Ðº_Ð²Ñ‚Ð¾Ñ€Ð½Ð¸Ðº_ÑÑ€ÐµÐ´Ñƒ_Ñ‡ÐµÑ‚Ð²ÐµÑ€Ð³_Ð¿ÑÑ‚Ð½Ð¸Ñ†Ñƒ_ÑÑƒÐ±Ð±Ð¾Ñ‚Ñƒ'.split(
            '_',
          ),
        },
        d = /\[ ?[Ð’Ð²] ?(?:Ð¿Ñ€Ð¾ÑˆÐ»ÑƒÑŽ|ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÑƒÑŽ|ÑÑ‚Ñƒ)? ?\] ?dddd/.test(b) ? 'accusative' : 'nominative'
      return c[d][a.day()]
    }
    return a.defineLocale('ru', {
      months: d,
      monthsShort: e,
      weekdays: f,
      weekdaysShort: 'Ð²Ñ_Ð¿Ð½_Ð²Ñ‚_ÑÑ€_Ñ‡Ñ‚_Ð¿Ñ‚_ÑÐ±'.split('_'),
      weekdaysMin: 'Ð²Ñ_Ð¿Ð½_Ð²Ñ‚_ÑÑ€_Ñ‡Ñ‚_Ð¿Ñ‚_ÑÐ±'.split('_'),
      monthsParse: [
        /^ÑÐ½Ð²/i,
        /^Ñ„ÐµÐ²/i,
        /^Ð¼Ð°Ñ€/i,
        /^Ð°Ð¿Ñ€/i,
        /^Ð¼Ð°[Ð¹|Ñ]/i,
        /^Ð¸ÑŽÐ½/i,
        /^Ð¸ÑŽÐ»/i,
        /^Ð°Ð²Ð³/i,
        /^ÑÐµÐ½/i,
        /^Ð¾ÐºÑ‚/i,
        /^Ð½Ð¾Ñ/i,
        /^Ð´ÐµÐº/i,
      ],
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'LT:ss',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY Ð³.',
        LLL: 'D MMMM YYYY Ð³., LT',
        LLLL: 'dddd, D MMMM YYYY Ð³., LT',
      },
      calendar: {
        sameDay: '[Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ Ð²] LT',
        nextDay: '[Ð—Ð°Ð²Ñ‚Ñ€Ð° Ð²] LT',
        lastDay: '[Ð’Ñ‡ÐµÑ€Ð° Ð²] LT',
        nextWeek: function() {
          return 2 === this.day() ? '[Ð’Ð¾] dddd [Ð²] LT' : '[Ð’] dddd [Ð²] LT'
        },
        lastWeek: function(a) {
          if (a.week() === this.week()) return 2 === this.day() ? '[Ð’Ð¾] dddd [Ð²] LT' : '[Ð’] dddd [Ð²] LT'
          switch (this.day()) {
            case 0:
              return '[Ð’ Ð¿Ñ€Ð¾ÑˆÐ»Ð¾Ðµ] dddd [Ð²] LT'
            case 1:
            case 2:
            case 4:
              return '[Ð’ Ð¿Ñ€Ð¾ÑˆÐ»Ñ‹Ð¹] dddd [Ð²] LT'
            case 3:
            case 5:
            case 6:
              return '[Ð’ Ð¿Ñ€Ð¾ÑˆÐ»ÑƒÑŽ] dddd [Ð²] LT'
          }
        },
        sameElse: 'L',
      },
      relativeTime: {
        future: 'Ñ‡ÐµÑ€ÐµÐ· %s',
        past: '%s Ð½Ð°Ð·Ð°Ð´',
        s: 'Ð¼Ð¸Ð½ÑƒÑ‚Ñƒ',
        m: c,
        mm: c,
        h: 'Ñ‡Ð°Ñ',
        hh: c,
        d: 'Ð´ÐµÐ½ÑŒ',
        dd: c,
        M: 'Ð¼ÐµÑÑÑ†',
        MM: c,
        y: 'Ð³Ð¾Ð´',
        yy: c,
      },
      meridiemParse: /Ð½Ð¾Ñ‡Ð¸|ÑƒÑ‚Ñ€Ð°|Ð´Ð½Ñ|Ð²ÐµÑ‡ÐµÑ€Ð°/i,
      isPM: function(a) {
        return /^(Ð´Ð½Ñ|Ð²ÐµÑ‡ÐµÑ€Ð°)$/.test(a)
      },
      meridiem: function(a, b, c) {
        return a < 4 ? 'Ð½Ð¾Ñ‡Ð¸' : a < 12 ? 'ÑƒÑ‚Ñ€Ð°' : a < 17 ? 'Ð´Ð½Ñ' : 'Ð²ÐµÑ‡ÐµÑ€Ð°'
      },
      ordinalParse: /\d{1,2}-(Ð¹|Ð³Ð¾|Ñ)/,
      ordinal: function(a, b) {
        switch (b) {
          case 'M':
          case 'd':
          case 'DDD':
            return a + '-Ð¹'
          case 'D':
            return a + '-Ð³Ð¾'
          case 'w':
          case 'W':
            return a + '-Ñ'
          default:
            return a
        }
      },
      week: {
        dow: 1,
        doy: 7,
      },
    })
  }),
  (function a(b, c, d) {
    function e(g, h) {
      if (!c[g]) {
        if (!b[g]) {
          var i = 'function' == typeof require && require
          if (!h && i) return i(g, !0)
          if (f) return f(g, !0)
          var j = new Error("Cannot find module '" + g + "'")
          throw ((j.code = 'MODULE_NOT_FOUND'), j)
        }
        var k = (c[g] = {
          exports: {},
        })
        b[g][0].call(
          k.exports,
          function(a) {
            var c = b[g][1][a]
            return e(c ? c : a)
          },
          k,
          k.exports,
          a,
          b,
          c,
          d,
        )
      }
      return c[g].exports
    }
    for (var f = 'function' == typeof require && require, g = 0; g < d.length; g++) e(d[g])
    return e
  })(
    {
      1: [
        function(a, b, c) {
          'use strict'

          function d(a) {
            a.fn.perfectScrollbar = function(b) {
              return this.each(function() {
                if ('object' == typeof b || 'undefined' == typeof b) {
                  var c = b
                  f.get(this) || e.initialize(this, c)
                } else {
                  var d = b
                  'update' === d ? e.update(this) : 'destroy' === d && e.destroy(this)
                }
                return a(this)
              })
            }
          }
          var e = a('../main'),
            f = a('../plugin/instances')
          if ('function' == typeof define && define.amd) define(['jquery'], d)
          else {
            var g = window.jQuery ? window.jQuery : window.$
            'undefined' != typeof g && d(g)
          }
          b.exports = d
        },
        {
          '../main': 7,
          '../plugin/instances': 18,
        },
      ],
      2: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            var c = a.className.split(' ')
            c.indexOf(b) < 0 && c.push(b), (a.className = c.join(' '))
          }

          function e(a, b) {
            var c = a.className.split(' '),
              d = c.indexOf(b)
            d >= 0 && c.splice(d, 1), (a.className = c.join(' '))
          }
          ;(c.add = function(a, b) {
            a.classList ? a.classList.add(b) : d(a, b)
          }),
            (c.remove = function(a, b) {
              a.classList ? a.classList.remove(b) : e(a, b)
            }),
            (c.list = function(a) {
              return a.classList ? a.classList : a.className.split(' ')
            })
        },
        {},
      ],
      3: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            return window.getComputedStyle(a)[b]
          }

          function e(a, b, c) {
            return 'number' == typeof c && (c = c.toString() + 'px'), (a.style[b] = c), a
          }

          function f(a, b) {
            for (var c in b) {
              var d = b[c]
              'number' == typeof d && (d = d.toString() + 'px'), (a.style[c] = d)
            }
            return a
          }
          ;(c.e = function(a, b) {
            var c = document.createElement(a)
            return (c.className = b), c
          }),
            (c.appendTo = function(a, b) {
              return b.appendChild(a), a
            }),
            (c.css = function(a, b, c) {
              return 'object' == typeof b ? f(a, b) : 'undefined' == typeof c ? d(a, b) : e(a, b, c)
            }),
            (c.matches = function(a, b) {
              return 'undefined' != typeof a.matches
                ? a.matches(b)
                : 'undefined' != typeof a.matchesSelector
                  ? a.matchesSelector(b)
                  : 'undefined' != typeof a.webkitMatchesSelector
                    ? a.webkitMatchesSelector(b)
                    : 'undefined' != typeof a.mozMatchesSelector
                      ? a.mozMatchesSelector(b)
                      : 'undefined' != typeof a.msMatchesSelector
                        ? a.msMatchesSelector(b)
                        : void 0
            }),
            (c.remove = function(a) {
              'undefined' != typeof a.remove ? a.remove() : a.parentNode.removeChild(a)
            })
        },
        {},
      ],
      4: [
        function(a, b, c) {
          'use strict'
          var d = function(a) {
            ;(this.element = a), (this.events = {})
          }
          ;(d.prototype.bind = function(a, b) {
            'undefined' == typeof this.events[a] && (this.events[a] = []),
              this.events[a].push(b),
              this.element.addEventListener(a, b, !1)
          }),
            (d.prototype.unbind = function(a, b) {
              var c = 'undefined' != typeof b
              this.events[a] = this.events[a].filter(function(d) {
                return !(!c || d === b) || (this.element.removeEventListener(a, d, !1), !1)
              }, this)
            }),
            (d.prototype.unbindAll = function() {
              for (var a in this.events) this.unbind(a)
            })
          var e = function() {
            this.eventElements = []
          }
          ;(e.prototype.eventElement = function(a) {
            var b = this.eventElements.filter(function(b) {
              return b.element === a
            })[0]
            return 'undefined' == typeof b && ((b = new d(a)), this.eventElements.push(b)), b
          }),
            (e.prototype.bind = function(a, b, c) {
              this.eventElement(a).bind(b, c)
            }),
            (e.prototype.unbind = function(a, b, c) {
              this.eventElement(a).unbind(b, c)
            }),
            (e.prototype.unbindAll = function() {
              for (var a = 0; a < this.eventElements.length; a++) this.eventElements[a].unbindAll()
            }),
            (e.prototype.once = function(a, b, c) {
              var d = this.eventElement(a),
                e = function(a) {
                  d.unbind(b, e), c(a)
                }
              d.bind(b, e)
            }),
            (b.exports = e)
        },
        {},
      ],
      5: [
        function(a, b, c) {
          'use strict'
          b.exports = (function() {
            function a() {
              return Math.floor(65536 * (1 + Math.random()))
                .toString(16)
                .substring(1)
            }
            return function() {
              return a() + a() + '-' + a() + '-' + a() + '-' + a() + '-' + a() + a() + a()
            }
          })()
        },
        {},
      ],
      6: [
        function(a, b, c) {
          'use strict'
          var d = a('./class'),
            e = a('./dom')
          ;(c.toInt = function(a) {
            return 'string' == typeof a ? parseInt(a, 10) : ~~a
          }),
            (c.clone = function(a) {
              if (null === a) return null
              if ('object' == typeof a) {
                var b = {}
                for (var c in a) b[c] = this.clone(a[c])
                return b
              }
              return a
            }),
            (c.extend = function(a, b) {
              var c = this.clone(a)
              for (var d in b) c[d] = this.clone(b[d])
              return c
            }),
            (c.isEditable = function(a) {
              return (
                e.matches(a, 'input,[contenteditable]') ||
                e.matches(a, 'select,[contenteditable]') ||
                e.matches(a, 'textarea,[contenteditable]') ||
                e.matches(a, 'button,[contenteditable]')
              )
            }),
            (c.removePsClasses = function(a) {
              for (var b = d.list(a), c = 0; c < b.length; c++) {
                var e = b[c]
                0 === e.indexOf('ps-') && d.remove(a, e)
              }
            }),
            (c.outerWidth = function(a) {
              return (
                this.toInt(e.css(a, 'width')) +
                this.toInt(e.css(a, 'paddingLeft')) +
                this.toInt(e.css(a, 'paddingRight')) +
                this.toInt(e.css(a, 'borderLeftWidth')) +
                this.toInt(e.css(a, 'borderRightWidth'))
              )
            }),
            (c.startScrolling = function(a, b) {
              d.add(a, 'ps-in-scrolling'),
                'undefined' != typeof b ? d.add(a, 'ps-' + b) : (d.add(a, 'ps-x'), d.add(a, 'ps-y'))
            }),
            (c.stopScrolling = function(a, b) {
              d.remove(a, 'ps-in-scrolling'),
                'undefined' != typeof b ? d.remove(a, 'ps-' + b) : (d.remove(a, 'ps-x'), d.remove(a, 'ps-y'))
            }),
            (c.env = {
              isWebKit: 'WebkitAppearance' in document.documentElement.style,
              supportsTouch:
                'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch),
              supportsIePointer: null !== window.navigator.msMaxTouchPoints,
            })
        },
        {
          './class': 2,
          './dom': 3,
        },
      ],
      7: [
        function(a, b, c) {
          'use strict'
          var d = a('./plugin/destroy'),
            e = a('./plugin/initialize'),
            f = a('./plugin/update')
          b.exports = {
            initialize: e,
            update: f,
            destroy: d,
          }
        },
        {
          './plugin/destroy': 9,
          './plugin/initialize': 17,
          './plugin/update': 20,
        },
      ],
      8: [
        function(a, b, c) {
          'use strict'
          b.exports = {
            wheelSpeed: 1,
            wheelPropagation: !1,
            swipePropagation: !0,
            minScrollbarLength: null,
            maxScrollbarLength: null,
            useBothWheelAxes: !1,
            useKeyboard: !0,
            suppressScrollX: !1,
            suppressScrollY: !1,
            scrollXMarginOffset: 0,
            scrollYMarginOffset: 0,
          }
        },
        {},
      ],
      9: [
        function(a, b, c) {
          'use strict'
          var d = a('../lib/dom'),
            e = a('../lib/helper'),
            f = a('./instances')
          b.exports = function(a) {
            var b = f.get(a)
            b.event.unbindAll(),
              d.remove(b.scrollbarX),
              d.remove(b.scrollbarY),
              d.remove(b.scrollbarXRail),
              d.remove(b.scrollbarYRail),
              e.removePsClasses(a),
              f.remove(a)
          }
        },
        {
          '../lib/dom': 3,
          '../lib/helper': 6,
          './instances': 18,
        },
      ],
      10: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            function c(a) {
              return a.getBoundingClientRect()
            }
            var d = window.Event.prototype.stopPropagation.bind
            b.event.bind(b.scrollbarY, 'click', d),
              b.event.bind(b.scrollbarYRail, 'click', function(d) {
                var f = e.toInt(b.scrollbarYHeight / 2),
                  h = d.pageY - c(b.scrollbarYRail).top - f,
                  i = b.containerHeight - b.scrollbarYHeight,
                  j = h / i
                j < 0 ? (j = 0) : j > 1 && (j = 1), (a.scrollTop = (b.contentHeight - b.containerHeight) * j), g(a)
              }),
              b.event.bind(b.scrollbarX, 'click', d),
              b.event.bind(b.scrollbarXRail, 'click', function(d) {
                var f = e.toInt(b.scrollbarXWidth / 2),
                  h = d.pageX - c(b.scrollbarXRail).left - f
                console.log(d.pageX, b.scrollbarXRail.offsetLeft)
                var i = b.containerWidth - b.scrollbarXWidth,
                  j = h / i
                j < 0 ? (j = 0) : j > 1 && (j = 1), (a.scrollLeft = (b.contentWidth - b.containerWidth) * j), g(a)
              })
          }
          var e = a('../../lib/helper'),
            f = a('../instances'),
            g = a('../update-geometry')
          b.exports = function(a) {
            var b = f.get(a)
            d(a, b)
          }
        },
        {
          '../../lib/helper': 6,
          '../instances': 18,
          '../update-geometry': 19,
        },
      ],
      11: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            function c(c) {
              var e = d + c,
                f = b.containerWidth - b.scrollbarXWidth
              e < 0 ? (b.scrollbarXLeft = 0) : e > f ? (b.scrollbarXLeft = f) : (b.scrollbarXLeft = e)
              var h = g.toInt(
                (b.scrollbarXLeft * (b.contentWidth - b.containerWidth)) / (b.containerWidth - b.scrollbarXWidth),
              )
              a.scrollLeft = h
            }
            var d = null,
              e = null,
              h = function(b) {
                c(b.pageX - e), i(a), b.stopPropagation(), b.preventDefault()
              },
              j = function() {
                g.stopScrolling(a, 'x'), b.event.unbind(b.ownerDocument, 'mousemove', h)
              }
            b.event.bind(b.scrollbarX, 'mousedown', function(c) {
              ;(e = c.pageX),
                (d = g.toInt(f.css(b.scrollbarX, 'left'))),
                g.startScrolling(a, 'x'),
                b.event.bind(b.ownerDocument, 'mousemove', h),
                b.event.once(b.ownerDocument, 'mouseup', j),
                c.stopPropagation(),
                c.preventDefault()
            })
          }

          function e(a, b) {
            function c(c) {
              var e = d + c,
                f = b.containerHeight - b.scrollbarYHeight
              e < 0 ? (b.scrollbarYTop = 0) : e > f ? (b.scrollbarYTop = f) : (b.scrollbarYTop = e)
              var h = g.toInt(
                (b.scrollbarYTop * (b.contentHeight - b.containerHeight)) / (b.containerHeight - b.scrollbarYHeight),
              )
              a.scrollTop = h
            }
            var d = null,
              e = null,
              h = function(b) {
                c(b.pageY - e), i(a), b.stopPropagation(), b.preventDefault()
              },
              j = function() {
                g.stopScrolling(a, 'y'), b.event.unbind(b.ownerDocument, 'mousemove', h)
              }
            b.event.bind(b.scrollbarY, 'mousedown', function(c) {
              ;(e = c.pageY),
                (d = g.toInt(f.css(b.scrollbarY, 'top'))),
                g.startScrolling(a, 'y'),
                b.event.bind(b.ownerDocument, 'mousemove', h),
                b.event.once(b.ownerDocument, 'mouseup', j),
                c.stopPropagation(),
                c.preventDefault()
            })
          }
          var f = a('../../lib/dom'),
            g = a('../../lib/helper'),
            h = a('../instances'),
            i = a('../update-geometry')
          b.exports = function(a) {
            var b = h.get(a)
            d(a, b), e(a, b)
          }
        },
        {
          '../../lib/dom': 3,
          '../../lib/helper': 6,
          '../instances': 18,
          '../update-geometry': 19,
        },
      ],
      12: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            function c(c, d) {
              var e = a.scrollTop
              if (0 === c) {
                if (!b.scrollbarYActive) return !1
                if ((0 === e && d > 0) || (e >= b.contentHeight - b.containerHeight && d < 0))
                  return !b.settings.wheelPropagation
              }
              var f = a.scrollLeft
              if (0 === d) {
                if (!b.scrollbarXActive) return !1
                if ((0 === f && c < 0) || (f >= b.contentWidth - b.containerWidth && c > 0))
                  return !b.settings.wheelPropagation
              }
              return !0
            }
            var d = !1
            b.event.bind(a, 'mouseenter', function() {
              d = !0
            }),
              b.event.bind(a, 'mouseleave', function() {
                d = !1
              })
            var f = !1
            b.event.bind(b.ownerDocument, 'keydown', function(h) {
              if ((!h.isDefaultPrevented || !h.isDefaultPrevented()) && d) {
                var i = document.activeElement ? document.activeElement : b.ownerDocument.activeElement
                if (i) {
                  for (; i.shadowRoot; ) i = i.shadowRoot.activeElement
                  if (e.isEditable(i)) return
                }
                var j = 0,
                  k = 0
                switch (h.which) {
                  case 37:
                    j = -30
                    break
                  case 38:
                    k = 30
                    break
                  case 39:
                    j = 30
                    break
                  case 40:
                    k = -30
                    break
                  case 33:
                    k = 90
                    break
                  case 32:
                  case 34:
                    k = -90
                    break
                  case 35:
                    k = h.ctrlKey ? -b.contentHeight : -b.containerHeight
                    break
                  case 36:
                    k = h.ctrlKey ? a.scrollTop : b.containerHeight
                    break
                  default:
                    return
                }
                ;(a.scrollTop = a.scrollTop - k),
                  (a.scrollLeft = a.scrollLeft + j),
                  g(a),
                  (f = c(j, k)),
                  f && h.preventDefault()
              }
            })
          }
          var e = a('../../lib/helper'),
            f = a('../instances'),
            g = a('../update-geometry')
          b.exports = function(a) {
            var b = f.get(a)
            d(a, b)
          }
        },
        {
          '../../lib/helper': 6,
          '../instances': 18,
          '../update-geometry': 19,
        },
      ],
      13: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            function c(c, d) {
              var e = a.scrollTop
              if (0 === c) {
                if (!b.scrollbarYActive) return !1
                if ((0 === e && d > 0) || (e >= b.contentHeight - b.containerHeight && d < 0))
                  return !b.settings.wheelPropagation
              }
              var f = a.scrollLeft
              if (0 === d) {
                if (!b.scrollbarXActive) return !1
                if ((0 === f && c < 0) || (f >= b.contentWidth - b.containerWidth && c > 0))
                  return !b.settings.wheelPropagation
              }
              return !0
            }

            function d(a) {
              var b = a.deltaX,
                c = -1 * a.deltaY
              return (
                ('undefined' != typeof b && 'undefined' != typeof c) ||
                  ((b = (-1 * a.wheelDeltaX) / 6), (c = a.wheelDeltaY / 6)),
                a.deltaMode && 1 === a.deltaMode && ((b *= 10), (c *= 10)),
                b !== b && c !== c && ((b = 0), (c = a.wheelDelta)),
                [b, c]
              )
            }

            function f(f) {
              if (e.env.isWebKit || !a.querySelector('select:focus')) {
                var i = d(f),
                  j = i[0],
                  k = i[1]
                ;(h = !1),
                  b.settings.useBothWheelAxes
                    ? b.scrollbarYActive && !b.scrollbarXActive
                      ? (k
                          ? (a.scrollTop = a.scrollTop - k * b.settings.wheelSpeed)
                          : (a.scrollTop = a.scrollTop + j * b.settings.wheelSpeed),
                        (h = !0))
                      : b.scrollbarXActive &&
                        !b.scrollbarYActive &&
                        (j
                          ? (a.scrollLeft = a.scrollLeft + j * b.settings.wheelSpeed)
                          : (a.scrollLeft = a.scrollLeft - k * b.settings.wheelSpeed),
                        (h = !0))
                    : ((a.scrollTop = a.scrollTop - k * b.settings.wheelSpeed),
                      (a.scrollLeft = a.scrollLeft + j * b.settings.wheelSpeed)),
                  g(a),
                  (h = h || c(j, k)),
                  h && (f.stopPropagation(), f.preventDefault())
              }
            }
            var h = !1
            'undefined' != typeof window.onwheel
              ? b.event.bind(a, 'wheel', f)
              : 'undefined' != typeof window.onmousewheel && b.event.bind(a, 'mousewheel', f)
          }
          var e = a('../../lib/helper'),
            f = a('../instances'),
            g = a('../update-geometry')
          b.exports = function(a) {
            var b = f.get(a)
            d(a, b)
          }
        },
        {
          '../../lib/helper': 6,
          '../instances': 18,
          '../update-geometry': 19,
        },
      ],
      14: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            b.event.bind(a, 'scroll', function() {
              f(a)
            })
          }
          var e = a('../instances'),
            f = a('../update-geometry')
          b.exports = function(a) {
            var b = e.get(a)
            d(a, b)
          }
        },
        {
          '../instances': 18,
          '../update-geometry': 19,
        },
      ],
      15: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            function c() {
              var a = window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : ''
              return 0 === a.toString().length ? null : a.getRangeAt(0).commonAncestorContainer
            }

            function d() {
              i ||
                (i = setInterval(function() {
                  return f.get(a)
                    ? ((a.scrollTop = a.scrollTop + j.top), (a.scrollLeft = a.scrollLeft + j.left), void g(a))
                    : void clearInterval(i)
                }, 50))
            }

            function h() {
              i && (clearInterval(i), (i = null)), e.stopScrolling(a)
            }
            var i = null,
              j = {
                top: 0,
                left: 0,
              },
              k = !1
            b.event.bind(b.ownerDocument, 'selectionchange', function() {
              a.contains(c()) ? (k = !0) : ((k = !1), h())
            }),
              b.event.bind(window, 'mouseup', function() {
                k && ((k = !1), h())
              }),
              b.event.bind(window, 'mousemove', function(b) {
                if (k) {
                  var c = {
                      x: b.pageX,
                      y: b.pageY,
                    },
                    f = {
                      left: a.offsetLeft,
                      right: a.offsetLeft + a.offsetWidth,
                      top: a.offsetTop,
                      bottom: a.offsetTop + a.offsetHeight,
                    }
                  c.x < f.left + 3
                    ? ((j.left = -5), e.startScrolling(a, 'x'))
                    : c.x > f.right - 3
                      ? ((j.left = 5), e.startScrolling(a, 'x'))
                      : (j.left = 0),
                    c.y < f.top + 3
                      ? (f.top + 3 - c.y < 5 ? (j.top = -5) : (j.top = -20), e.startScrolling(a, 'y'))
                      : c.y > f.bottom - 3
                        ? (c.y - f.bottom + 3 < 5 ? (j.top = 5) : (j.top = 20), e.startScrolling(a, 'y'))
                        : (j.top = 0),
                    0 === j.top && 0 === j.left ? h() : d()
                }
              })
          }
          var e = a('../../lib/helper'),
            f = a('../instances'),
            g = a('../update-geometry')
          b.exports = function(a) {
            var b = f.get(a)
            d(a, b)
          }
        },
        {
          '../../lib/helper': 6,
          '../instances': 18,
          '../update-geometry': 19,
        },
      ],
      16: [
        function(a, b, c) {
          'use strict'

          function d(a, b, c, d) {
            function g(c, d) {
              var e = a.scrollTop,
                f = a.scrollLeft,
                g = Math.abs(c),
                h = Math.abs(d)
              if (h > g) {
                if ((d < 0 && e === b.contentHeight - b.containerHeight) || (d > 0 && 0 === e))
                  return !b.settings.swipePropagation
              } else if (g > h && ((c < 0 && f === b.contentWidth - b.containerWidth) || (c > 0 && 0 === f)))
                return !b.settings.swipePropagation
              return !0
            }

            function h(b, c) {
              ;(a.scrollTop = a.scrollTop - c), (a.scrollLeft = a.scrollLeft - b), f(a)
            }

            function i() {
              t = !0
            }

            function j() {
              t = !1
            }

            function k(a) {
              return a.targetTouches ? a.targetTouches[0] : a
            }

            function l(a) {
              return (
                !(!a.targetTouches || 1 !== a.targetTouches.length) ||
                !(!a.pointerType || 'mouse' === a.pointerType || a.pointerType === a.MSPOINTER_TYPE_MOUSE)
              )
            }

            function m(a) {
              if (l(a)) {
                u = !0
                var b = k(a)
                ;(p.pageX = b.pageX),
                  (p.pageY = b.pageY),
                  (q = new Date().getTime()),
                  null !== s && clearInterval(s),
                  a.stopPropagation()
              }
            }

            function n(a) {
              if (!t && u && l(a)) {
                var b = k(a),
                  c = {
                    pageX: b.pageX,
                    pageY: b.pageY,
                  },
                  d = c.pageX - p.pageX,
                  e = c.pageY - p.pageY
                h(d, e), (p = c)
                var f = new Date().getTime(),
                  i = f - q
                i > 0 && ((r.x = d / i), (r.y = e / i), (q = f)), g(d, e) && (a.stopPropagation(), a.preventDefault())
              }
            }

            function o() {
              !t &&
                u &&
                ((u = !1),
                clearInterval(s),
                (s = setInterval(function() {
                  return e.get(a)
                    ? Math.abs(r.x) < 0.01 && Math.abs(r.y) < 0.01
                      ? void clearInterval(s)
                      : (h(30 * r.x, 30 * r.y), (r.x *= 0.8), void (r.y *= 0.8))
                    : void clearInterval(s)
                }, 10)))
            }
            var p = {},
              q = 0,
              r = {},
              s = null,
              t = !1,
              u = !1
            c &&
              (b.event.bind(window, 'touchstart', i),
              b.event.bind(window, 'touchend', j),
              b.event.bind(a, 'touchstart', m),
              b.event.bind(a, 'touchmove', n),
              b.event.bind(a, 'touchend', o)),
              d &&
                (window.PointerEvent
                  ? (b.event.bind(window, 'pointerdown', i),
                    b.event.bind(window, 'pointerup', j),
                    b.event.bind(a, 'pointerdown', m),
                    b.event.bind(a, 'pointermove', n),
                    b.event.bind(a, 'pointerup', o))
                  : window.MSPointerEvent &&
                    (b.event.bind(window, 'MSPointerDown', i),
                    b.event.bind(window, 'MSPointerUp', j),
                    b.event.bind(a, 'MSPointerDown', m),
                    b.event.bind(a, 'MSPointerMove', n),
                    b.event.bind(a, 'MSPointerUp', o)))
          }
          var e = a('../instances'),
            f = a('../update-geometry')
          b.exports = function(a, b, c) {
            var f = e.get(a)
            d(a, f, b, c)
          }
        },
        {
          '../instances': 18,
          '../update-geometry': 19,
        },
      ],
      17: [
        function(a, b, c) {
          'use strict'
          var d = a('../lib/class'),
            e = a('../lib/helper'),
            f = a('./instances'),
            g = a('./update-geometry'),
            h = a('./handler/click-rail'),
            i = a('./handler/drag-scrollbar'),
            j = a('./handler/keyboard'),
            k = a('./handler/mouse-wheel'),
            l = a('./handler/native-scroll'),
            m = a('./handler/selection'),
            n = a('./handler/touch')
          b.exports = function(a, b) {
            ;(b = 'object' == typeof b ? b : {}), d.add(a, 'ps-container')
            var c = f.add(a)
            ;(c.settings = e.extend(c.settings, b)),
              h(a),
              i(a),
              k(a),
              l(a),
              m(a),
              (e.env.supportsTouch || e.env.supportsIePointer) && n(a, e.env.supportsTouch, e.env.supportsIePointer),
              c.settings.useKeyboard && j(a),
              g(a)
          }
        },
        {
          '../lib/class': 2,
          '../lib/helper': 6,
          './handler/click-rail': 10,
          './handler/drag-scrollbar': 11,
          './handler/keyboard': 12,
          './handler/mouse-wheel': 13,
          './handler/native-scroll': 14,
          './handler/selection': 15,
          './handler/touch': 16,
          './instances': 18,
          './update-geometry': 19,
        },
      ],
      18: [
        function(a, b, c) {
          'use strict'

          function d(a) {
            var b = this
            ;(b.settings = l.clone(i)),
              (b.containerWidth = null),
              (b.containerHeight = null),
              (b.contentWidth = null),
              (b.contentHeight = null),
              (b.isRtl = 'rtl' === h.css(a, 'direction')),
              (b.event = new j()),
              (b.ownerDocument = a.ownerDocument || document),
              (b.scrollbarXRail = h.appendTo(h.e('div', 'ps-scrollbar-x-rail'), a)),
              (b.scrollbarX = h.appendTo(h.e('div', 'ps-scrollbar-x'), b.scrollbarXRail)),
              (b.scrollbarXActive = null),
              (b.scrollbarXWidth = null),
              (b.scrollbarXLeft = null),
              (b.scrollbarXBottom = l.toInt(h.css(b.scrollbarXRail, 'bottom'))),
              (b.isScrollbarXUsingBottom = b.scrollbarXBottom === b.scrollbarXBottom),
              (b.scrollbarXTop = b.isScrollbarXUsingBottom ? null : l.toInt(h.css(b.scrollbarXRail, 'top'))),
              (b.railBorderXWidth =
                l.toInt(h.css(b.scrollbarXRail, 'borderLeftWidth')) +
                l.toInt(h.css(b.scrollbarXRail, 'borderRightWidth'))),
              (b.railXMarginWidth =
                l.toInt(h.css(b.scrollbarXRail, 'marginLeft')) + l.toInt(h.css(b.scrollbarXRail, 'marginRight'))),
              (b.railXWidth = null),
              (b.scrollbarYRail = h.appendTo(h.e('div', 'ps-scrollbar-y-rail'), a)),
              (b.scrollbarY = h.appendTo(h.e('div', 'ps-scrollbar-y'), b.scrollbarYRail)),
              (b.scrollbarYActive = null),
              (b.scrollbarYHeight = null),
              (b.scrollbarYTop = null),
              (b.scrollbarYRight = l.toInt(h.css(b.scrollbarYRail, 'right'))),
              (b.isScrollbarYUsingRight = b.scrollbarYRight === b.scrollbarYRight),
              (b.scrollbarYLeft = b.isScrollbarYUsingRight ? null : l.toInt(h.css(b.scrollbarYRail, 'left'))),
              (b.scrollbarYOuterWidth = b.isRtl ? l.outerWidth(b.scrollbarY) : null),
              (b.railBorderYWidth =
                l.toInt(h.css(b.scrollbarYRail, 'borderTopWidth')) +
                l.toInt(h.css(b.scrollbarYRail, 'borderBottomWidth'))),
              (b.railYMarginHeight =
                l.toInt(h.css(b.scrollbarYRail, 'marginTop')) + l.toInt(h.css(b.scrollbarYRail, 'marginBottom'))),
              (b.railYHeight = null)
          }

          function e(a) {
            return 'undefined' == typeof a.dataset ? a.getAttribute('data-ps-id') : a.dataset.psId
          }

          function f(a, b) {
            'undefined' == typeof a.dataset ? a.setAttribute('data-ps-id', b) : (a.dataset.psId = b)
          }

          function g(a) {
            'undefined' == typeof a.dataset ? a.removeAttribute('data-ps-id') : delete a.dataset.psId
          }
          var h = a('../lib/dom'),
            i = a('./default-setting'),
            j = a('../lib/event-manager'),
            k = a('../lib/guid'),
            l = a('../lib/helper'),
            m = {}
          ;(c.add = function(a) {
            var b = k()
            return f(a, b), (m[b] = new d(a)), m[b]
          }),
            (c.remove = function(a) {
              delete m[e(a)], g(a)
            }),
            (c.get = function(a) {
              return m[e(a)]
            })
        },
        {
          '../lib/dom': 3,
          '../lib/event-manager': 4,
          '../lib/guid': 5,
          '../lib/helper': 6,
          './default-setting': 8,
        },
      ],
      19: [
        function(a, b, c) {
          'use strict'

          function d(a, b) {
            return (
              a.settings.minScrollbarLength && (b = Math.max(b, a.settings.minScrollbarLength)),
              a.settings.maxScrollbarLength && (b = Math.min(b, a.settings.maxScrollbarLength)),
              b
            )
          }

          function e(a, b) {
            var c = {
              width: b.railXWidth,
            }
            b.isRtl ? (c.left = a.scrollLeft + b.containerWidth - b.contentWidth) : (c.left = a.scrollLeft),
              b.isScrollbarXUsingBottom
                ? (c.bottom = b.scrollbarXBottom - a.scrollTop)
                : (c.top = b.scrollbarXTop + a.scrollTop),
              g.css(b.scrollbarXRail, c)
            var d = {
              top: a.scrollTop,
              height: b.railYHeight,
            }
            b.isScrollbarYUsingRight
              ? b.isRtl
                ? (d.right = b.contentWidth - a.scrollLeft - b.scrollbarYRight - b.scrollbarYOuterWidth)
                : (d.right = b.scrollbarYRight - a.scrollLeft)
              : b.isRtl
                ? (d.left =
                    a.scrollLeft + 2 * b.containerWidth - b.contentWidth - b.scrollbarYLeft - b.scrollbarYOuterWidth)
                : (d.left = b.scrollbarYLeft + a.scrollLeft),
              g.css(b.scrollbarYRail, d),
              g.css(b.scrollbarX, {
                left: b.scrollbarXLeft,
                width: b.scrollbarXWidth - b.railBorderXWidth,
              }),
              g.css(b.scrollbarY, {
                top: b.scrollbarYTop,
                height: b.scrollbarYHeight - b.railBorderYWidth,
              })
          }
          var f = a('../lib/class'),
            g = a('../lib/dom'),
            h = a('../lib/helper'),
            i = a('./instances')
          b.exports = function(a) {
            var b = i.get(a)
            ;(b.containerWidth = a.clientWidth),
              (b.containerHeight = a.clientHeight),
              (b.contentWidth = a.scrollWidth),
              (b.contentHeight = a.scrollHeight),
              !b.settings.suppressScrollX && b.containerWidth + b.settings.scrollXMarginOffset < b.contentWidth
                ? ((b.scrollbarXActive = !0),
                  (b.railXWidth = b.containerWidth - b.railXMarginWidth),
                  (b.scrollbarXWidth = d(b, h.toInt((b.railXWidth * b.containerWidth) / b.contentWidth))),
                  (b.scrollbarXLeft = h.toInt(
                    (a.scrollLeft * (b.railXWidth - b.scrollbarXWidth)) / (b.contentWidth - b.containerWidth),
                  )))
                : ((b.scrollbarXActive = !1), (b.scrollbarXWidth = 0), (b.scrollbarXLeft = 0), (a.scrollLeft = 0)),
              !b.settings.suppressScrollY && b.containerHeight + b.settings.scrollYMarginOffset < b.contentHeight
                ? ((b.scrollbarYActive = !0),
                  (b.railYHeight = b.containerHeight - b.railYMarginHeight),
                  (b.scrollbarYHeight = d(b, h.toInt((b.railYHeight * b.containerHeight) / b.contentHeight))),
                  (b.scrollbarYTop = h.toInt(
                    (a.scrollTop * (b.railYHeight - b.scrollbarYHeight)) / (b.contentHeight - b.containerHeight),
                  )))
                : ((b.scrollbarYActive = !1), (b.scrollbarYHeight = 0), (b.scrollbarYTop = 0), (a.scrollTop = 0)),
              b.scrollbarXLeft >= b.railXWidth - b.scrollbarXWidth &&
                (b.scrollbarXLeft = b.railXWidth - b.scrollbarXWidth),
              b.scrollbarYTop >= b.railYHeight - b.scrollbarYHeight &&
                (b.scrollbarYTop = b.railYHeight - b.scrollbarYHeight),
              e(a, b),
              f[b.scrollbarXActive ? 'add' : 'remove'](a, 'ps-active-x'),
              f[b.scrollbarYActive ? 'add' : 'remove'](a, 'ps-active-y')
          }
        },
        {
          '../lib/class': 2,
          '../lib/dom': 3,
          '../lib/helper': 6,
          './instances': 18,
        },
      ],
      20: [
        function(a, b, c) {
          'use strict'
          var d = a('../lib/dom'),
            e = a('./destroy'),
            f = a('./initialize'),
            g = a('./instances'),
            h = a('./update-geometry')
          b.exports = function(a) {
            var b = g.get(a)
            b.scrollbarXRail && a.contains(b.scrollbarXRail) && b.scrollbarYRail && a.contains(b.scrollbarYRail)
              ? (d.css(b.scrollbarXRail, 'display', 'none'),
                d.css(b.scrollbarYRail, 'display', 'none'),
                h(a),
                d.css(b.scrollbarXRail, 'display', 'block'),
                d.css(b.scrollbarYRail, 'display', 'block'))
              : (e(a), f(a))
          }
        },
        {
          '../lib/dom': 3,
          './destroy': 9,
          './initialize': 17,
          './instances': 18,
          './update-geometry': 19,
        },
      ],
    },
    {},
    [1],
  ),
  (AuctionsAPI.prototype.getSettings = function(a) {
    var b = {
      method: 'get',
      callbacks: a,
    }
    this.apiService.query(b)
  }),
  (AuctionsAPI.prototype.get = function(a, b) {
    var c = {
      url: '/bids/' + a,
      method: 'get',
      authorization: {
        useToken: !0,
      },
      errors: {
        silent: !0,
      },
      callbacks: b,
    }
    this.apiService.query(c)
  }),
  (AuctionsAPI.prototype.update = function(a, b, c) {
    var d = {
      url: '/bids/' + a,
      method: 'put',
      data: b,
      authorization: {
        useToken: !0,
      },
      callbacks: c,
    }
    this.apiService.query(d)
  }),
  (AuctionsAPI.prototype.remove = function(a, b) {
    var c = {
      url: '/bids/' + a,
      method: 'delete',
      authorization: {
        useToken: !0,
      },
      callbacks: b,
    }
    this.apiService.query(c)
  }),
  (AuctionsBid.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher
    this.amount.new.subscribe(function() {
      a.errors([])
    }),
      this.amount.current.subscribe(function(c) {
        b && b.trigger('auctions-bid:amount:change', c, a.entityId)
      })
  }),
  (AuctionsBid.prototype.setData = function(a) {
    function b(a) {
      return a ? parseFloat(a.amount) : null
    }
    var a = a || {},
      c = this.settings
    this.amount.current(b(a.current_amount) || 0),
      this.amount.next(b(a.next_amount) || 0),
      this.amount.new(b(a.current_amount) || c.bid_min || 0),
      this.expiresIn(a.expires_in || 0),
      this.status(a.status || null),
      (this.lastUpdateTime = new Date().getTime()),
      this.initTimer()
  }),
  (AuctionsBid.prototype.increase = function() {
    this.amount.new(this.amount.new() + this.settings.bid_step)
  }),
  (AuctionsBid.prototype.decrease = function() {
    var a = this.amount.new() - this.settings.bid_step
    ;(a = Math.max(a, this.settings.bid_min)), this.amount.new(a)
  }),
  (AuctionsBid.prototype.update = function() {
    var a = this,
      b = this.dispatcher,
      c = this.amount.new().toString(),
      d = {
        bid: {
          amount: format.formatPrice(c, 'BYN').replace(/\,/g, '.'),
          currency: 'BYN',
        },
      },
      e = {}
    this.errors([]),
      this.actionStatus('update'),
      (e.success = function(c) {
        a.setData(c.data), b && b.trigger('auctions-bid:update:success')
      }),
      (e.error = function(c) {
        var d = [],
          e = {}
        402 !== c.response.status &&
          ko.utils.objectForEach(c.response.data.errors || {}, function(a, b) {
            d = d.concat(b)
          }),
          403 !== c.response.status || d.length || (e.message && (d = d.concat(e.message))),
          402 === c.response.status && b && b.trigger('auctions-bid:error:not-enough-money'),
          402 !== c.response.status && !d.length && d.push('ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ ÑÐ´ÐµÐ»Ð°Ñ‚ÑŒ ÑÑ‚Ð°Ð²ÐºÑƒ'),
          a.errors(d),
          b && b.trigger('auctions-bid:update:error')
      }),
      (e.complete = function() {
        a.actionStatus(''), b && b.trigger('auctions-bid:update:complete')
      }),
      this.auctionsAPI.update(this.entityId, d, e)
  }),
  (AuctionsBid.prototype.remove = function() {
    var a = this,
      b = this.dispatcher,
      c = {}
    this.errors([]),
      this.actionStatus('remove'),
      (c.success = function(c) {
        a.setData(c.data), b && b.trigger('auctions-bid:remove:success')
      }),
      (c.error = function() {
        var c = []
        404 === error.response.status && (c = ['ÐÐµÑ‚ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾Ð¹ ÑÑ‚Ð°Ð²ÐºÐ¸']),
          !c.length && c.push('ÐžÑˆÐ¸Ð±ÐºÐ° Ð¿Ñ€Ð¸ ÑƒÐ´Ð°Ð»ÐµÐ½Ð¸Ð¸'),
          a.errors(c),
          b && b.trigger('auctions-bid:remove:error')
      }),
      (c.complete = function() {
        a.actionStatus(''), b && b.trigger('auctions-bid:remove:complete')
      }),
      this.auctionsAPI.remove(this.entityId, c)
  }),
  (AuctionsBid.prototype.initTimer = function() {
    function a(a) {
      b.timerText.short(b._getShortTimerText(a)), b.timerText.full(b._getFullTimerText(a))
    }
    if (this.status()) {
      var b = this,
        c = b._getSeconds()
      clearTimeout(this.timer),
        a(c),
        (this.timer = setInterval(function() {
          var c = b._getSeconds()
          a(c), c < 60 && (clearTimeout(b.timer), b.status('processing'))
        }, 1e3 * Math.min(60, c)))
    }
  }),
  (AuctionsBid.prototype._getShortTimerText = function(a) {
    function b(a) {
      return a ? (a < 10 ? '0' : '') + a : '00'
    }
    var c = this._getDuration(a),
      d = b(c.hours),
      e = b(c.minutes),
      f = [d, e].join(':')
    return f
  }),
  (AuctionsBid.prototype._getFullTimerText = function(a) {
    var b = this._getDuration(a),
      c = []
    return (
      b.hours && (c.push(b.hours), c.push(format.pluralForm(b.hours, ['Ñ‡Ð°Ñ', 'Ñ‡Ð°ÑÐ°', 'Ñ‡Ð°ÑÐ¾Ð²']))),
      b.minutes &&
        (c.push(b.minutes), c.push(format.pluralForm(b.minutes, ['Ð¼Ð¸Ð½ÑƒÑ‚Ð°', 'Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹', 'Ð¼Ð¸Ð½ÑƒÑ‚']))),
      b.hours || b.minutes || c.push('Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¾ ÑÐµÐºÑƒÐ½Ð´'),
      c.join(' ')
    )
  }),
  (AuctionsBid.prototype._getSeconds = function() {
    var a,
      b = new Date().getTime(),
      c = this.lastUpdateTime
    return (a = this.expiresIn() - Math.ceil((b - c) / 1e3)), (a = Math.max(a, 0)), a || 0
  }),
  (AuctionsBid.prototype._getDuration = function(a) {
    var b = {}
    return (b.hours = Math.floor(a / 3600)), (b.minutes = Math.floor((a - 60 * b.hours * 60) / 60)), b
  }),
  (Credentials.isAuth = function() {
    var a = (window.MODELS && window.MODELS.currentUser) || null
    return !!Cookies.get('onl_session') && !(!a || !a.id())
  }),
  (Credentials.getCurrentUserId = function() {
    var a = (window.MODELS && window.MODELS.currentUser) || null
    return (a && a.id()) || null
  }),
  (Credentials.prototype.executeCallbacks = function() {
    for (var a = this.callbacks || [], b = a.shift(); b; ) 'function' == typeof b && b(), (b = a.shift())
  }),
  (Credentials.prototype.query = function(a) {
    var b = this,
      c = this.dispatcher
    return this.token
      ? void a()
      : (this.callbacks.push(a),
        void (
          this.request ||
          ((this.request = $.ajax({
            type: 'POST',
            url: Onliner.secureProjectUrl('credentials.api', '/oauth/token'),
            data: {
              grant_type: 'client_credentials',
            },
            beforeSend: function(a) {
              a.setRequestHeader('Authorization', 'Basic ' + Base64.encode('onliner_user:' + $.cookie('onl_session')))
            },
          })),
          this.request.done(function(a) {
            var c = 1e3 * Math.max(a.expires_in - 60, 60)
            clearTimeout(b.timer),
              (b.token = a.access_token),
              (b.tokenType = a.token_type),
              (b.timer = setTimeout(function() {
                b.token = null
              }, c)),
              b.executeCallbacks()
          }),
          this.request.fail(function(a) {
            ;(b.callbacks = []), c && c.trigger('credentials:fail', a)
          }),
          this.request.always(function() {
            b.request = null
          }))
        ))
  })
var Geocoder
!(function() {
  function a(a, b) {
    var c
    return (
      !!b &&
      ((c = new RegExp('([^a-zA-Z0-9Ð°-ÑÐ-Ð¯]|^)' + b + '([^a-zA-Z0-9Ð°-ÑÐ-Ð¯]|$)', 'i')),
      !/^.+,.+,.+$/.test(a) && !c.test(a))
    )
  }

  function b(a) {
    var b = ['city', 'town', 'hamlet', 'village', 'construction', 'road', 'street', 'house_number'],
      c = a.address,
      d = []
    return (
      b.forEach(function(a) {
        c[a] && d.push(c[a])
      }),
      0 === d.length && d.push(a.display_name),
      d.join(', ')
    )
  }

  function c(a, b) {
    var c = _.filter(a, function(a) {
      return a.title === b.title
    })
    return !!c.length
  }

  function d(a, d) {
    var e = [],
      f = []
    return (
      a.forEach(function(a) {
        ;(a.title = b(a)),
          c(e.concat(f), a) ||
            (d && a.address.city && a.address.city.toLowerCase() === d.toLowerCase() ? e.push(a) : f.push(a))
      }),
      e
        .slice(0, 3)
        .concat(f)
        .slice(0, 5)
    )
  }

  function e(a) {
    if (!a) return null
    var b = {
      'Ð‘Ñ€ÐµÑÑ‚': [52.023784, 52.1524458, 23.5654409, 23.854412],
      'Ð’Ð¸Ñ‚ÐµÐ±ÑÐº': [55.130321, 55.3132579, 30.0679114, 30.325316],
      'Ð“Ð¾Ð¼ÐµÐ»ÑŒ': [52.3447416, 52.5512893, 30.8066023, 31.0917619],
      'Ð“Ñ€Ð¾Ð´Ð½Ð¾': [53.599045, 53.7597232, 23.7118019, 23.9812318],
      'ÐœÐ¸Ð½ÑÐº': [53.79619, 54.008172, 27.39029, 27.734298],
      'ÐœÐ¾Ð³Ð¸Ð»ÐµÐ²': [53.7963545, 53.9704271, 30.2225218, 30.4756389],
    }[a]
    return b || null
  }
  var f = new OpenStreetMapApiService()
  ;(Geocoder = function(a) {
    ;(this.prioritizedCity = a),
      (this.requests = {
        search: [],
        reverse: [],
      })
  }),
    (Geocoder.prototype.abortRequests = function(a) {
      var b = this.requests[a]
      b &&
        b.forEach(function(a) {
          a.cancel()
        })
    }),
    (Geocoder.prototype.search = function(b, c) {
      var e = this.prioritizedCity,
        g = [],
        h = []
      b &&
        (this.abortRequests('search'),
        g.push(function(a) {
          var c = {}
          ;(c.success = function(b) {
            a(null, b)
          }),
            (c.error = function(b) {
              a(b)
            }),
            h.push(f.search(b, c))
        }),
        a(b, e) &&
          g.push(function(a) {
            var c = {}
            ;(c.success = function(b) {
              a(null, b)
            }),
              (c.error = function(b) {
                a(b)
              }),
              h.push(f.search(e + ' ' + b, c))
          }),
        async.parallel(g, function(a, b) {
          if (a) return void (c && c([]))
          var f,
            g = []
          _.each(b, function(a) {
            g = a.data.concat(g || [])
          }),
            (f = d(g, e)),
            c && c(f)
        }),
        (this.requests.search = h))
    }),
    (Geocoder.prototype.reverse = function(a, c) {
      if (a && a.latitude && a.longitude) {
        var d = {}
        ;(d.success = function(a) {
          var d = a.data
          ;(d.title = b(d)), c && c(d)
        }),
          (d.error = function() {
            c && c(null)
          }),
          f.reverse(a, d)
      }
    }),
    (Geocoder.executeAfterGettingCityBounds = function(a, b) {
      return a && a.latitude && a.longitude
        ? void Geocoder.prototype.reverse(a, function(c) {
            function d(c) {
              return a.latitude < c[0] || a.latitude > c[1] || a.longitude < c[2] || a.longitude > c[3]
                ? void b(null)
                : void b([[c[0], c[2]], [c[1], c[3]]])
            }
            if (!c) return void b(null)
            var g = c.address || {},
              h = g.city || g.town || g.hamlet || g.village
            if (!h) return void b(null)
            var i = e(h)
            if (i) return void d(i)
            var j = {}
            ;(j.success = function(a) {
              var c = a.data[0],
                e = c && c.boundingbox
              return e ? void d(e) : void b(null)
            }),
              (j.error = function() {
                b(null)
              }),
              f.search(h, j)
          })
        : void b(null)
    })
})(),
  (Popovers.prototype.attachEvents = function() {
    var a = this,
      b = $(document),
      c = this.selectors,
      d = this.modifiers
    b.on('click', c.trigger, function(a) {
      var b = $(this).data('popover'),
        e = $('#' + b),
        f = $(c.container).not(e)
      e.toggleClass(d.opened), f.removeClass(d.opened), a.stopPropagation(), a.preventDefault()
    }),
      b.on('click', c.open, function(a) {
        var b = $(this).data('popover'),
          e = $('#' + b),
          f = $(c.container).not(e)
        e.addClass(d.opened), f.removeClass(d.opened), a.stopPropagation(), a.preventDefault()
      }),
      b.on('click', c.close, function(b) {
        var e = $(this).parents(c.container + ':first')
        e.removeClass(d.opened),
          b.stopPropagation(),
          b.preventDefault(),
          a.dispatcher && a.dispatcher.trigger('popover:close', e)
      }),
      b.on('click', c.container, function(a) {
        a.stopPropagation()
      }),
      b.on('click', function(b) {
        $(c.container + ':not(' + c.unclosable + ')').removeClass(d.opened),
          a.dispatcher && a.dispatcher.trigger('popover:close')
      }),
      b.on('keyup', function(b) {
        var c = b.keyCode || b.which
        27 === c && a.hideAll(), a.dispatcher && a.dispatcher.trigger('popover:close')
      })
  }),
  (Popovers.prototype.hideAll = function() {
    var a = this.selectors,
      b = this.modifiers
    $(a.container).removeClass(b.opened)
  }),
  (Pagination.prototype.bindEvents = function() {}),
  (Pagination.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher
    b.subscribe('request:start', function() {
      a.isVisible(!1)
    }),
      b.subscribe('request:success', function(b) {
        var c = b.page
        a.page.current(c.current),
          a.page.last(c.last),
          a.page.limit(c.limit),
          a.total(b.total),
          a.isVisible(!!b.page.items)
      }),
      b.subscribe('request:error', function() {
        a.isVisible(!1)
      })
  }),
  (Pagination.prototype.setPage = function(a) {
    a !== this.page.current() && (this.page.current(a), this.dispatcher.trigger('pagination:change', a))
  }),
  (Pagination.prototype.getNextText = function() {
    var a,
      b = this.nextPageCounter(),
      c = {
        next: ['Ð¡Ð»ÐµÐ´ÑƒÑŽÑ‰ÐµÐµ', 'Ð¡Ð»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ðµ'],
        last: ['ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ', 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ'],
      },
      d = this.page.last() - this.page.current() <= 1 ? 'last' : 'next'
    return (a = b % 10 === 1 && b / 10 !== 1 ? c[d][0] : c[d][1])
  }),
  (Pagination.prototype.nextPage = function() {
    this.setPage(this.page.current() + 1)
  }),
  (MapExtendedLayers.prototype.updateLayerVisibility = function() {
    var a,
      b,
      c,
      d = this.map,
      e = Math.ceil(d.getZoom())
    for (var f in this.features) {
      if (!this.features.hasOwnProperty(f)) return
      ;(a = this.features[f]),
        (b = this.mapConfig.visibility[f]),
        (c = (!b.from || e >= b.from) && (!b.to || e <= b.to)),
        c ? this.map.addLayer(a) : this.map.hasLayer(a) && this.map.removeLayer(a),
        this.postprocessing.forEach(function(a) {
          a()
        })
    }
  }),
  (MapExtendedLayers.prototype.updateSubscriptions = function() {
    var a = this
    this.map.eachLayer(function(b) {
      !b.propagated &&
        ((L.Marker && b instanceof L.Marker) ||
          (L.MarkerCluster && b instanceof L.MarkerCluster) ||
          (L.MarkerClusterGroup && b instanceof L.MarkerClusterGroup)) &&
        (a._propagateEvent(b, 'mouseover'), a._propagateEvent(b, 'mouseout'))
    })
  }),
  (MapExtendedLayers.prototype._propagateEvent = function(a, b) {
    var c = this
    a.on(b, function(a) {
      for (var d in c.features) {
        if (!c.features.hasOwnProperty(d)) return
        var e = c.features[d],
          f = leafletPip.pointInLayer(a.latlng, e)
        f.forEach(function(a) {
          a.fire(b)
        })
      }
    }),
      (a.propagated = !0)
  }),
  (MapExtendedLayers.prototype._initFeatures = function() {
    var a = this
    this._getGeoJson(function(b) {
      a.layers = b
    }),
      this.layers.forEach(function(b) {
        var c,
          d = a.mapConfig.styles[b.properties.name]
        ;(a.features[b.properties.name] = L.geoJSON(b, {
          onEachFeature: function(e, f) {
            f.bindTooltip(e.properties.name),
              f.setStyle(d.default),
              f.on('mouseover', function() {
                a._resetLayerGroupStyles(c.getLayers(), b.properties.name), f.setStyle(d.hover)
              }),
              f.on('mouseout', function() {
                f.setStyle(d.default)
              }),
              f.on('click', function() {
                a.map.fitBounds(f.getBounds())
              })
          },
        })),
          (c = a.features[b.properties.name])
      })
  }),
  (MapExtendedLayers.prototype._subscribe = function() {
    this.map.on('zoom', this.updateLayerVisibility.bind(this)), this.updateSubscriptions(), this.updateLayerVisibility()
  }),
  (MapExtendedLayers.prototype._getGeoJson = function(a) {
    $.ajax({
      url: Onliner.secureProjectUrl('r', '/pk/assets/config/features.geojson'),
      async: !1,
      dataType: 'json',
      success: function(b) {
        a && a(b)
      },
    })
  }),
  (MapExtendedLayers.prototype._addBlur = function(a) {
    var b = this.map.getPanes().overlayPane.firstChild,
      c = document.createElementNS('http://www.w3.org/2000/svg', 'filter'),
      d = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
    b &&
      (c.setAttribute('id', 'blur'),
      d.setAttribute('stdDeviation', 4),
      c.appendChild(d),
      b.appendChild(c),
      a._path && a._path.setAttribute('filter', 'url(#blur)'))
  }),
  (MapExtendedLayers.prototype._resetLayerGroupStyles = function(a, b) {
    var c = this
    a.forEach(function(a) {
      a.setStyle(c.mapConfig.styles[b].default)
    })
  }),
  (PaginationDesktop.prototype = Object.create(Pagination.prototype)),
  (PaginationDesktop.prototype.bindEvents = function() {
    Pagination.prototype.bindEvents.call(this)
    var a = this
    $(function() {
      $('body').bind('click', function() {
        a.isActiveDropdown() && a.isActiveDropdown(!1)
      }),
        $('.pagination').on('click', function(a) {
          a.stopPropagation()
        }),
        $('.pagination-pages__wrapper').mCustomScrollbar({
          axis: 'x',
          scrollInertia: 0,
          advanced: {
            updateOnContentResize: !0,
            updateOnSelectorChange: '.pagination-pages__list',
          },
        })
    })
  }),
  (PaginationDesktop.prototype.toggleDropdown = function() {
    var a = this.isActiveDropdown()
    a || this.recalculatePaginationWidth(), this.isActiveDropdown(!a)
  }),
  (PaginationDesktop.prototype.recalculatePaginationWidth = function() {
    var a = this.$list
    a.parent().width('auto')
  }),
  (PaginationDesktop.prototype.setPage = function(a) {
    a !== this.page.current() && (this.isActiveDropdown(!1), Pagination.prototype.setPage.call(this, a))
  }),
  (SearchApartments.prototype.initState = function(a) {
    var b = this,
      c = this.dispatcher
    _.isArray(a) ||
      _.each(['order', 'page', 'bounds'], function(d) {
        var e = b.restoreFunctions[d],
          f = a[d]
        null !== f && void 0 !== f && (e && e.call(b, f), c.trigger('apartments:paraminit', d, f))
      })
  }),
  (SearchApartments.prototype.restoreState = function(a) {
    var b = this
    ;(a = a || {}),
      _.each(['order', 'page'], function(c) {
        var d = b.restoreFunctions[c],
          e = a[c]
        d && d.call(b, e)
      })
  }),
  (SearchApartments.prototype.restoreFunctions = {
    order: function(a) {
      var b = _.pluck(this.orderOptions, 'type'),
        c = _.indexOf(b, a) > -1 ? a : this.defaultOrder
      this.order() !== c &&
        (this.order(c),
        this.dispatcher.trigger('apartments:order:change', {
          order: this.order(),
        }))
    },
    page: function(a) {
      var b = parseInt(a, 10) || 1
      this.pagination.setPage(b), this.dispatcher.trigger('pagination:change', b)
    },
  }),
  (SearchApartments.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher
    b.subscribe('apartments:processing', function() {
      a.isProcessing(!0), a.hasError(!1)
    }),
      b.subscribe('apartments:updated', function(b) {
        ko.utils.arrayForEach(b.apartments, function(a) {
          SearchApartments.transformApartment(a)
        }),
          a.isProcessing(!1),
          a.setItems(b.apartments),
          a.total(b.total || 0),
          a.pagination.page.current(b.page.current),
          a.pagination.page.last(b.page.last),
          a.pagination.page.limit(b.page.limit),
          a.pagination.total(b.total),
          a.triggerForcedResize(),
          a.collectCurrentsIds(),
          b.apartments.length || b.page.current !== b.page.last || a.dispatcher.trigger('pagination:change', 1)
      }),
      b.subscribe('apartments:error', function() {
        a.isProcessing(!1), a.hasError(!0), a.items([]), a.total(0), a.triggerForcedResize(), a.collectCurrentsIds()
      }),
      b.subscribe('filter:paramschange', function() {
        a.scrollTop()
      }),
      b.subscribe('points:buttonclick', function() {
        a.scrollTop()
      }),
      b.subscribe('auctions:apartment:change', function() {
        a.scrollTop()
      }),
      b.subscribe('popstate:restore', function(b) {
        a.restoreState(b)
      })
  }),
  (SearchApartments.prototype.setItems = function(a) {
    ;(a = a || []),
      ko.utils.arrayForEach(a, function(a) {
        a.seller.title = SearchApartments.formatSellerType(a.seller.type)
      }),
      this.items(a)
  }),
  (SearchApartments.prototype.collectCurrentsIds = function() {
    this.dispatcher.trigger('apartments:idscollectend', _.pluck(this.items(), 'id'))
  }),
  (SearchApartments.prototype.triggerForcedResize = function() {
    $(window).trigger('resize')
  }),
  (SearchApartments.prototype.setOrder = function(a) {
    this.order(a),
      this.dispatcher.trigger('apartments:order:change', {
        order: this.order(),
      }),
      this.pagination.setPage(1),
      this.scrollTop()
  }),
  (SearchApartments.formatDate = function(a) {
    return moment(a).fromNow()
  }),
  (SearchApartments.formatPhotoUrl = function(a) {
    return 'url(' + a + ')'
  }),
  (SearchApartments.formatPrice = function(a, b) {
    return format.getPriceAmount(a, b)
  }),
  (SearchApartments.formatSellerType = function(a) {
    var b = {
      agent: 'ÐÐ³ÐµÐ½Ñ‚ÑÑ‚Ð²Ð¾',
      builder: 'Ð—Ð°ÑÑ‚Ñ€Ð¾Ð¹Ñ‰Ð¸Ðº',
    }
    return b[a] || ''
  }),
  (SearchApartments.formatCounter = function(a) {
    var b = format.pluralForm(a, ['Ð¾Ð±ÑŠÑÐ²Ð»ÐµÐ½Ð¸Ðµ', 'Ð¾Ð±ÑŠÑÐ²Ð»ÐµÐ½Ð¸Ñ', 'Ð¾Ð±ÑŠÑÐ²Ð»ÐµÐ½Ð¸Ð¹'])
    return SearchApartments.formatNumberDigits(a) + ' ' + b
  }),
  (SearchApartments.formatNumberDigits = function(a) {
    return a > 1e4 ? format.numberWithSpaces(a) : a
  }),
  (SearchApartments.transformApartment = function(a) {
    return SearchApartments.transformAddress(a), SearchApartments.transformArea(a), a
  }),
  (SearchApartments.transformArea = function(a) {
    function b(a) {
      return (a || '').toString().replace(/\./, ',')
    }
    var c = a.area || {}
    return (c.total = b(c.total)), (c.living = b(c.living)), (c.kitchen = b(c.kitchen)), (a.area = c), a
  }),
  (SearchApartments.transformAddress = function(a) {
    var b = a.location.user_address || '',
      c = b,
      d = [
        {
          from: 'ÑƒÐ»Ð¸Ñ†Ð°',
          to: '',
        },
        {
          from: 'ÑƒÐ»',
          to: '',
        },
        {
          from: 'Ð±ÑƒÐ»ÑŒÐ²Ð°Ñ€',
          to: 'Ð±ÑƒÐ».',
        },
        {
          from: 'Ð¿ÐµÑ€ÐµÑƒÐ»Ð¾Ðº',
          to: 'Ð¿ÐµÑ€.',
        },
        {
          from: 'Ð¿Ð»Ð¾Ñ‰Ð°Ð´ÑŒ',
          to: 'Ð¿Ð».',
        },
        {
          from: 'Ð¿Ð¾ÑÐµÐ»Ð¾Ðº',
          to: 'Ð¿Ð¾Ñ.',
        },
        {
          from: 'Ð¿Ñ€Ð¾ÑÐ¿ÐµÐºÑ‚',
          to: 'Ð¿Ñ€-Ñ‚',
        },
      ]
    return (
      d.forEach(function(a) {
        var c = new RegExp('(^|[^_0-9a-zA-ZÐ°-ÑÑ‘Ð-Ð¯Ð])' + a.from + '([^_0-9a-zA-ZÐ°-ÑÑ‘Ð-Ð¯Ð]|$)', 'ig')
        b = b.replace(c, ' ' + a.to + ' ')
      }),
      (b = b.replace(/^Ð¼Ð¸Ð½ÑÐº[^_0-9a-zA-ZÐ°-ÑÑ‘Ð-Ð¯Ð]/i, '')),
      (b = b.replace(/[^_0-9a-zA-ZÐ°-ÑÑ‘Ð-Ð¯Ð]Ð¼Ð¸Ð½ÑÐº$/i, '')),
      (b = b.replace(/^(\s|,)*/, '').replace(/(\s|,)*$/, '')),
      (a.location.user_address = b || c),
      a
    )
  }),
  (SearchApartments.scrollTop = function() {}),
  (SearchAuctions.prototype.initState = function(a) {
    if (!_.isArray(a)) {
      var b = parseInt(a.auction_apartment_id, 10) || void 0
      this.activeApartmentId(b), this.dispatcher.trigger('auctions:apartment-id:init', b)
    }
  }),
  (SearchAuctions.prototype.subscribeObservables = function() {
    var a = this,
      b = this.dispatcher
    this.activeApartment.subscribe(function(b) {
      var c = (b && b.id) || void 0
      a.activeApartment.silent ? a.updateObservableSilent(a.activeApartmentId, c) : a.activeApartmentId(c),
        a.updateBid(c)
    }),
      this.activeApartmentId.subscribe(function() {
        b.trigger('auctions:apartment:change', a.activeApartment(), a.activeApartmentId.silent)
      })
  }),
  (SearchAuctions.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher
    b.subscribe('apartments:auctions-amount:set', function(b) {
      clearTimeout(a.animationInputTimer),
        a.isAnimatedInput(!0),
        (a.animationInputTimer = setTimeout(function() {
          a.isAnimatedInput(!1)
        }, 1e3))
    }),
      b.subscribe('apartments:auctions-amount:set', function(b) {
        var c = a.bid()
        c && c.amount.new(b)
      }),
      b.subscribe('map:auctions-apartment:choose', function(b, c) {
        var d = _.find(a.apartments(), function(a) {
          return a.id === b
        })
        d && (c ? a.updateObservableSilent(a.activeApartment, d) : a.activeApartment(d))
      }),
      b.subscribe('auctions-bid:amount:change', function(b, c) {
        var d = _.find(a.apartments(), function(a) {
          return a.id === c
        })
        d.auction_amount(b)
      }),
      b &&
        b.subscribe('auctions-bid:updated-from-popup:success', function() {
          a.updateApartments()
        }),
      b &&
        b.subscribe('auctions-bid:error:not-enough-money', function() {
          a.showMoneyPopup()
        })
  }),
  (SearchAuctions.prototype.setApartments = function(a) {
    var b,
      c = this,
      a = a || []
    ko.utils.arrayForEach(a, function(a) {
      var d = []
      d.push(a.number_of_rooms + 'Ðº'),
        d.push(a.location.user_address || a.location.address),
        d.push(format.getPriceAmount(a.price, 'USD') + ' $'),
        (a.auction_amount = ko.observable((a.auction_bid && parseFloat(a.auction_bid.amount)) || null)),
        (a.title = d.join(', ')),
        (a.full_title = ko.computed(function() {
          var b = a.auction_amount()
          return (b ? format.formatPrice(b, 'BYN') + ' Ñ€ÑƒÐ±. â€” ' : '') + a.title
        })),
        (a.errors = ko.observable([])),
        (a.canRetryBidding = ko.observable(!0)),
        (a.actionStatus = ko.observable('')),
        a.id === c.activeApartmentId() && (b = a)
    }),
      this.apartments(a),
      this.activeApartment(b || a[0] || void 0)
  }),
  (SearchAuctions.prototype.setBid = function(a) {
    var b = new AuctionsBid(a, 'pk', this.settings, this.dispatcher)
    this.bid(b), this._initAmountInputs()
  }),
  (SearchAuctions.prototype.updateApartments = function() {
    var a = this,
      b = this.dispatcher,
      c = Credentials.getCurrentUserId(),
      d = {}
    this.errors([]),
      this.isLoading(!0),
      (d.success = function(c) {
        a.setApartments(c.data.apartments),
          b.trigger('auctions:update-apartments:success', c.apartments, a.activeApartment())
      }),
      (d.error = function(c) {
        a.setApartments([]),
          a.errors(['ÐžÑˆÐ¸Ð±ÐºÐ° Ð¿Ñ€Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐµ Ð´Ð°Ð½Ð½Ñ‹Ñ…']),
          b.trigger('auctions:update-apartments:error')
      }),
      (d.complete = function() {
        a.isLoading(!1), b.trigger('auctions:update-apartments:complete')
      }),
      this.pkApiService.apartmentUpdate(c, d)
  }),
  (SearchAuctions.prototype.updateBid = _.debounce(function(a) {
    var b = this,
      c = this.dispatcher
    this.bid(null),
      this.errors([]),
      a &&
        (this.isUpdating(!0),
        this.auctionsAPI.get(a, {
          success: function(a) {
            b.setBid(a.data), c.trigger('auctions:update-bid:success', a.data)
          },
          error: function(d) {
            return 404 === d.response.status
              ? void b.setBid({
                  entity_id: a,
                })
              : (b.errors(['ÐžÑˆÐ¸Ð±ÐºÐ° Ð¿Ñ€Ð¸ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ð¸ Ð´ÐµÑ‚Ð°Ð»ÐµÐ¹ ÑÑ‚Ð°Ð²ÐºÐ¸']),
                void c.trigger('auctions:update-bid:error'))
          },
          complete: function() {
            b.isUpdating(!1), c.trigger('auctions:update-bid:complete')
          },
        }))
  }, 300)),
  (SearchAuctions.prototype.updateObservableSilent = function(a, b) {
    a && ((a.silent = !0), 'function' == typeof a && a(b), (a.silent = !1))
  }),
  (SearchAuctions.prototype.showMoneyPopup = function() {
    this.moneyPopup && this.moneyPopup.open()
  }),
  (SearchAuctions.prototype._initMoneyPopup = function() {
    var a = document.getElementById('money-popup'),
      b = document.getElementById('money-popup-overlay')
    a && ko.applyBindings(this, a),
      b && ko.applyBindings(this, b),
      $(document).keyup(function(a) {
        a.which || a.keyCode
      })
  }),
  (SearchAuctions.prototype._initAmountInputs = function() {
    var a = $('.js-amount-input')
    a.length &&
      a.each(function(a, b) {
        var c = $(b)
        c.autoNumeric('init', {
          aSep: '',
          mDec: 2,
          aDec: ',',
          vMin: 0,
          vMax: 999999.99,
        })
      })
  }),
  (SearchFilter.prototype.initState = function(a) {
    var b = this,
      c = this.dispatcher
    _.isArray(a) ||
      _.each(
        ['resale', 'number_of_rooms', 'price', 'currency', 'walling', 'building_year', 'area', 'outermost_floor'],
        function(d) {
          var e = a[d]
          null !== e &&
            void 0 !== e &&
            (_.isFunction(b.restoreFunctions[d]) && b.restoreFunctions[d].call(b, e),
            c.trigger('filter:paraminit', d, e))
        },
      )
  }),
  (SearchFilter.prototype.restoreState = function(a) {
    var b = this,
      c = this.dispatcher,
      d = {}
    ;(a = a || {}),
      _.each(
        ['resale', 'number_of_rooms', 'price', 'currency', 'walling', 'building_year', 'area', 'outermost_floor'],
        function(c) {
          var e = b.restoreFunctions[c],
            f = b.clearFunctions[c],
            g = a[c]
          null !== g && void 0 !== g ? (e && e.call(b, g), b.updateParameter(c)) : (f && f.call(b), (d[c] = null))
        },
      ),
      c.trigger('filter:paramsclear', d, !0)
  }),
  (SearchFilter.prototype.initPriceSlider = function(a) {
    var b = $(a.from),
      c = $(a.to),
      d = parseInt(b.attr('placeholder')),
      e = parseInt(c.attr('placeholder')),
      f = {
        '5%': 25e3,
        '45%': 55e3,
        '80%': 9e4,
        '90%': 12e4,
        '95%': 22e4,
      },
      g = d < f['5%'] ? d : f['5%'] / 2,
      h = f['95%'] < e ? f['95%'] : Math.round(e - (e - f['90%']) / 4),
      i = {
        start: [this.price.min() || g, this.price.max() || e],
        range: {
          min: [g],
          '5%': [f['5%'], 750],
          '45%': [f['45%'], 5e3],
          '80%': [f['80%'], 3e3],
          '90%': [f['90%'], 2e4],
          '95%': [h],
          max: e,
        },
        connect: !1,
        step: 5e3,
      }
    ;(this.priceInitial = {
      min: i.range.min[0],
      max: i.range.max,
    }),
      wNumb &&
        (i.format = wNumb({
          decimals: 0,
          thousand: ' ',
        })),
      this._initSlider('price', a, i, this.priceInitial),
      (this.priceTriggerSkip = !1)
  }),
  (SearchFilter.prototype.initAreaSlider = function(a) {
    var b = $(a.from),
      c = $(a.to),
      d = parseInt(b.attr('placeholder')),
      e = parseInt(c.attr('placeholder')),
      f = {
        '3%': 30,
        '56%': 70,
        '69%': 80,
        '82%': 100,
        '92%': 150,
      },
      g = d < f['3%'] ? d : f['3%'] / 2,
      h = f['92%'] < e ? f['92%'] : Math.round(e - (e - f['82%']) / 4),
      i = {
        start: [this.area.min() || g, this.area.max() || e],
        range: {
          min: [g],
          '3%': [f['3%'], 1],
          '56%': [f['56%'], 1],
          '69%': [f['69%'], 2],
          '82%': [f['82%'], 10],
          '92%': h,
          max: e,
        },
        connect: !1,
        step: 10,
      }
    ;(this.areaInitial = {
      min: i.range.min[0],
      max: i.range.max,
    }),
      wNumb &&
        (i.format = wNumb({
          decimals: 0,
        })),
      this._initSlider('area', a, i, this.areaInitial),
      (this.areaTriggerSkip = !1)
  }),
  (SearchFilter.prototype.initYearSlider = function(a) {
    var b = $(a.from),
      c = $(a.to),
      d = parseInt(b.attr('placeholder')),
      e = parseInt(c.attr('placeholder')),
      f = moment().year(),
      g = {
        '5%': 1950,
        '22%': 1980,
        '35%': 2e3,
        '95%': f + 1,
      },
      h = d < g['5%'] ? d : 1900,
      i = {
        start: [this.building_year.min() || h, this.building_year.max() || e],
        range: {
          min: [h],
          '5%': [g['5%'], 5],
          '22%': [g['22%'], 4],
          '35%': [g['35%'], 1],
          '95%': g['95%'],
          max: e,
        },
        connect: !1,
        step: 10,
      }
    ;(this.yearInitial = {
      min: i.range.min[0],
      max: i.range.max,
    }),
      wNumb &&
        (i.format = wNumb({
          decimals: 0,
        })),
      this._initSlider('building_year', a, i, this.yearInitial),
      (this.yearTriggerSkip = !1)
  }),
  (SearchFilter.prototype.restoreFunctions = {
    resale: function(a) {
      var b = 'true' === a || a === !0,
        c = 'false' === a || a === !1
      this.isUsed(b), this.isNew(c)
    },
    number_of_rooms: function(a) {
      ;(a = _.intersection(['1', '2', '3', '4'], a)), this.selectedFlatTypes(a)
    },
    price: function(a) {
      a = a || {}
      var b = this,
        c = parseFloat(a.min) || this.priceInitial.min,
        d = parseFloat(a.max) || this.priceInitial.max
      b.price.min(c), b.price.max(d), this.setSlider.price && this.setSlider.price(c, d)
    },
    area: function(a) {
      a = a || {}
      var b = this,
        c = parseFloat(a.min) || this.areaInitial.min,
        d = parseFloat(a.max) || this.areaInitial.max
      b.area.min(c), b.area.max(d), this.setSlider.area && this.setSlider.area(c, d)
    },
    building_year: function(a) {
      a = a || {}
      var b = this,
        c = parseFloat(a.min) || this.yearInitial.min,
        d = parseFloat(a.max) || this.yearInitial.max
      b.building_year.min(c), b.building_year.max(d), this.setSlider.building_year && this.setSlider.building_year(c, d)
    },
    currency: function(a) {
      this.currency(a)
    },
    walling: function(a) {
      this.walling(a)
    },
    outermost_floor: function(a) {
      var b = 'false' === a || a === !1
      this.isOutermostFloor(b)
    },
  }),
  (SearchFilter.prototype.clearFunctions = {
    resale: function() {
      this.updateObservableSilent(this.isUsed, !1), this.updateObservableSilent(this.isNew, !1)
    },
    number_of_rooms: function() {
      this.updateObservableSilent(this.selectedFlatTypes, [])
    },
    price: function() {
      this.resetSlider.price()
    },
    area: function() {
      this.resetSlider.area()
    },
    building_year: function() {
      this.resetSlider.building_year()
    },
    currency: function() {
      this.updateObservableSilent(this.currency, 'usd')
    },
    walling: function() {
      this.updateObservableSilent(this.walling, [])
    },
    outermost_floor: function() {
      this.updateObservableSilent(this.isOutermostFloor, !1)
    },
  }),
  (SearchFilter.prototype.initCollectors = function() {
    var a = this
    ;(this.collectors.resale = function() {
      return !(!a.isUsed() || a.isNew()) || (!(!a.isUsed() && a.isNew()) && null)
    }),
      (this.collectors.number_of_rooms = function() {
        var b = _.clone(a.selectedFlatTypes())
        return _.contains(b, '1') && _.contains(b, '2') && _.contains(b, '3') && _.contains(b, '4')
          ? []
          : (_.contains(b, '4') && b.push('5', '6'), b)
      }),
      (this.collectors.price = function() {
        function b(a) {
          return (a || '')
            .toString()
            .split(' ')
            .join('')
        }
        return {
          min: b(a.price.min()),
          max: b(a.price.max()),
        }
      }),
      (this.collectors.area = function() {
        return {
          min: a.area.min(),
          max: a.area.max(),
        }
      }),
      (this.collectors.building_year = function() {
        return {
          min: a.building_year.min(),
          max: a.building_year.max(),
        }
      }),
      (this.collectors.currency = function() {
        return a.currency()
      }),
      (this.collectors.walling = function() {
        return a.walling()
      }),
      (this.collectors.outermost_floor = function() {
        return !a.isOutermostFloor() && null
      })
  }),
  (SearchFilter.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher
    this.isUsed.subscribe(function(b) {
      b && window.ga && window.ga('pk.send', 'event', 'ÐŸÐ¾Ð¸ÑÐº', 'Ð’Ñ‚Ð¾Ñ€Ð¸Ñ‡ÐºÐ°'),
        a.isUsed.silent || a.updateParameter('resale')
    }),
      this.isNew.subscribe(function(b) {
        b && window.ga && window.ga('pk.send', 'event', 'ÐŸÐ¾Ð¸ÑÐº', 'ÐÐ¾Ð²Ð¾ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°'),
          a.isNew.silent || a.updateParameter('resale')
      }),
      this.price.min.subscribe(function() {
        a.price.min.silent || (a.updateParameter('price'), a.updateParameter('currency'))
      }),
      this.price.max.subscribe(function() {
        a.price.max.silent || (a.updateParameter('price'), a.updateParameter('currency'))
      }),
      this.area.min.subscribe(function() {
        a.area.min.silent || a.updateParameter('area')
      }),
      this.area.max.subscribe(function() {
        a.area.max.silent || a.updateParameter('area')
      }),
      this.building_year.min.subscribe(function() {
        a.building_year.min.silent || a.updateParameter('building_year')
      }),
      this.building_year.max.subscribe(function() {
        a.building_year.max.silent || a.updateParameter('building_year')
      }),
      this.walling.subscribe(function() {
        a.walling.silent || a.updateParameter('walling')
      }),
      this.isOutermostFloor.subscribe(function(b) {
        b && window.ga && window.ga('pk.send', 'event', 'ÐŸÐ¾Ð¸ÑÐº', 'Ð­Ñ‚Ð°Ð¶'),
          a.isOutermostFloor.silent || a.updateParameter('outermost_floor')
      }),
      b.subscribe('auctions:apartment:change', function(b) {
        b && a.clearParameters()
      }),
      b.subscribe('popstate:restore', function(b) {
        a.restoreState(b)
      })
  }),
  (SearchFilter.prototype.clearParameters = function() {
    var a = this,
      b = {
        resale: null,
        number_of_rooms: null,
        price: null,
        currency: null,
        walling: null,
        order: null,
        area: null,
        building_year: null,
        outermost_floor: null,
      }
    _.each(b, function(b, c) {
      var d = a.clearFunctions[c]
      _.isFunction(d) && d.call(a)
    }),
      this.dispatcher.trigger('filter:paramsclear', b)
  }),
  (SearchFilter.prototype.collectParameter = function(a) {
    var b = this.collectors[a]
    return _.isFunction(b) ? b() : null
  }),
  (SearchFilter.prototype.updateParameter = function(a) {
    function b(a) {
      return null !== a && void 0 !== a && $.isNumeric(a.toString().replace(/\s+/g, ''))
    }
    if (
      (('price' !== a && 'currency' !== a) || !this.priceTriggerSkip) &&
      (('price' !== a && 'currency' !== a) || (b(this.price.min()) && b(this.price.max()))) &&
      ('area' !== a || !this.areaTriggerSkip) &&
      ('area' !== a || (b(this.area.min()) && b(this.area.max()))) &&
      ('building_year' !== a || !this.yearTriggerSkip) &&
      ('building_year' !== a || (b(this.building_year.min()) && b(this.building_year.max())))
    ) {
      var c = {}
      ;(c[a] = this.collectParameter(a)), this.dispatcher.trigger('filter:paramschange', c)
    }
  }),
  (SearchFilter.prototype.changeFlatType = function(a, b) {
    var c = $(a).is(':checked'),
      d = this.selectedFlatTypes()
    c ? d.push(b) : (d = _.without(d, b)),
      (d = _.intersection(['1', '2', '3', '4'], d)),
      this.selectedFlatTypes(d),
      this.updateParameter('number_of_rooms')
  }),
  (SearchFilter.prototype.isSelectedFlatType = function(a) {
    return _.contains(this.selectedFlatTypes(), a)
  }),
  (SearchFilter.prototype.updateObservableSilent = function(a, b) {
    a && ((a.silent = !0), 'function' == typeof a && a(b), (a.silent = !1))
  }),
  (SearchFilter.prototype.toggleWalling = function(a) {
    var b = this.walling(),
      c = this.isSelectedWalling(a)
    c ? this.walling(_.without(b, a)) : this.walling.push(a)
  }),
  (SearchFilter.prototype.isSelectedWalling = function(a) {
    return _.indexOf(this.walling(), a) > -1
  }),
  (SearchFilter.prototype.getSelectedWallingText = function() {
    var a,
      b = this.walling(),
      c = []
    return (
      b.forEach(function(b) {
        ;(a = {
          panel: 'ÐŸÐ°Ð½ÐµÐ»ÑŒ',
          brick: 'ÐšÐ¸Ñ€Ð¿Ð¸Ñ‡',
          monolith: 'ÐœÐ¾Ð½Ð¾Ð»Ð¸Ñ‚',
          block: 'Ð‘Ð»Ð¾Ðº',
        }[b]),
          c.push(a)
      }),
      c.length ? c.join(', ') : 'ÐœÐ°Ñ‚ÐµÑ€Ð¸Ð°Ð» ÑÑ‚ÐµÐ½'
    )
  }),
  (SearchFilter.prototype.anyWallingSelected = function() {
    return !!this.walling().length
  }),
  (SearchFilter.prototype._initSlider = function(a, b, c, d) {
    function e() {
      p.trigger('change'), q.trigger('change')
    }

    function f() {
      var a = l.parent().css('left')
      return a === $(r).css('left') || ($(r).css('left', a), !1)
    }

    function g() {
      var a = m.parent().css('left'),
        b = o.width() - parseInt(a, 10)
      return b === parseInt($(r).css('right'), 10) || ($(r).css('right', b), !1)
    }

    function h() {
      n[a].min(p.val()), n[a].max(q.val())
    }

    function i() {
      o.val([d.min, d.max])
    }

    function j(a, b) {
      o.val([a, b])
    }
    var k,
      l,
      m,
      n = this,
      o = $(b.container),
      p = $(b.from),
      q = $(b.to),
      r = document.createElement('div')
    o
      .noUiSlider(c)
      .Link('lower')
      .to(p)
      .Link('upper')
      .to(q),
      (k = o.find('.noUi-base')[0]),
      (l = o.find('.noUi-handle-lower')),
      (m = o.find('.noUi-handle-upper')),
      (r.className += 'noUi-connect'),
      k.appendChild(r),
      o.on('slide', function() {
        f(), g()
      }),
      o.on('change', e),
      o.on('set', function() {
        var a
        h(),
          (a = setInterval(function() {
            var b = f(),
              c = g()
            b && c && clearInterval(a)
          }, 40))
      }),
      f(),
      g(),
      e(),
      this[a].min.subscribe(function(a) {
        !a && i()
      }),
      this[a].max.subscribe(function(a) {
        !a && i()
      }),
      (this.resetSlider[a] = i.bind(this)),
      (this.setSlider[a] = j.bind(this))
  }),
  (SearchGeocoder.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher
    this.keyword.subscribe(
      function() {
        this.keyword.silent || (this.resetList(), this.debouncedSearch())
      }.bind(this),
    ),
      b.subscribe('auctions:apartment:change', function(b) {
        b && (a.resetKeyword(), a.hasForcedFocus(!1))
      })
  }),
  (SearchGeocoder.prototype.debouncedSearch = _.debounce(function(a) {
    var b = this.keyword()
    b.length > 2 && this.search(b, a)
  }, 300)),
  (SearchGeocoder.prototype.onKeyUp = function(a, b) {
    var c = b.keyCode || b.which,
      d = {
        enter: 13,
      },
      e = this.activeSuggestIndex()
    if ((this.isLocationNotFound() && this.isLocationNotFound(!1), c === d.enter))
      return void (null !== e ? this.applyLocation(this.list()[e]) : this.debouncedSearch(!0))
  }),
  (SearchGeocoder.prototype.onFocus = function() {
    !this.isActiveList() && this.isActiveList(!0), !this.list().length && !this.keyword() && this.setDefaultList()
  }),
  (SearchGeocoder.prototype.onBlur = function() {
    this.isActiveList() && this.isActiveList(!1), this.isLocationNotFound(!1)
  }),
  (SearchGeocoder.prototype.search = function(a, b) {
    var c = this
    this.isProcessing(!0),
      this.activeSuggestIndex(null),
      this.isLocationNotFound(!1),
      this.geocoderInstance.search(a, function(a) {
        c.updateList(a, b), c.isProcessing(!1)
      })
  }),
  (SearchGeocoder.prototype.updateList = function(a, b) {
    ;(a = a || []), a.length ? this.activeSuggestIndex(0) : b && this.isLocationNotFound(!0), this.list(a)
  }),
  (SearchGeocoder.prototype.resetList = function() {
    this.list([])
  }),
  (SearchGeocoder.prototype.getDefaultList = function() {
    var a = [
      {
        title: 'ÐœÐ¸Ð½ÑÐº',
        boundingbox: [53.79619, 54.008172, 27.39029, 27.734298],
      },
      {
        title: 'Ð‘Ñ€ÐµÑÑ‚',
        boundingbox: [52.023784, 52.1524458, 23.5654409, 23.854412],
      },
      {
        title: 'Ð’Ð¸Ñ‚ÐµÐ±ÑÐº',
        boundingbox: [55.130321, 55.3132579, 30.0679114, 30.325316],
      },
      {
        title: 'Ð“Ð¾Ð¼ÐµÐ»ÑŒ',
        boundingbox: [52.3447416, 52.5512893, 30.8066023, 31.0917619],
      },
      {
        title: 'Ð“Ñ€Ð¾Ð´Ð½Ð¾',
        boundingbox: [53.599045, 53.7597232, 23.7118019, 23.9812318],
      },
      {
        title: 'ÐœÐ¾Ð³Ð¸Ð»ÐµÐ²',
        boundingbox: [53.7963545, 53.9704271, 30.2225218, 30.4756389],
      },
    ]
    return a
  }),
  (SearchGeocoder.prototype.setDefaultList = function() {
    var a = this.getDefaultList()
    this.list(a)
  }),
  (SearchGeocoder.prototype.resetKeyword = function() {
    this.isLocationNotFound(!1),
      this.keyword(''),
      this.list([]),
      this.activeSuggestIndex(null),
      this.hasForcedFocus(!0),
      this.isActiveList(!1)
  }),
  (SearchGeocoder.prototype.applyLocation = function(a) {
    if (a) {
      var b = a.boundingbox || [],
        c = [[b[0], b[2]], [b[1], b[3]]]
      this.dispatcher.trigger('geocode:boundsupdated', c),
        this.updateObservableSilent(this.keyword, a.title),
        this.resetList()
    }
  }),
  (SearchGeocoder.prototype.updateObservableSilent = function(a, b) {
    a && ((a.silent = !0), 'function' == typeof a && a(b), (a.silent = !1))
  }),
  (SearchMap.prototype.initState = function(a) {
    if (!_.isArray(a)) {
      var b = a.bounds,
        c = a.coordinates
      b &&
        b.lb &&
        b.lb.lat &&
        b.lb.long &&
        b.rt &&
        b.rt.lat &&
        b.rt.long &&
        (this.initialBounds = [[b.lb.lat, b.lb.long], [b.rt.lat, b.rt.long]]),
        c && c.latitude && c.longitude && (this.initialCoordinates = [c.latitude, c.longitude])
    }
  }),
  (SearchMap.prototype.restoreState = function(a) {
    a = a || {}
    var b,
      c = a.bounds
    c && c.lb && c.lb.lat && c.lb.long && c.rt && c.rt.lat && c.rt.long
      ? ((b = [[c.lb.lat, c.lb.long], [c.rt.lat, c.rt.long]]),
        (this.map.programmaticalEvent = !0),
        this.map.fitBounds(b),
        this.dispatcher.trigger('points:bounds:restore', {
          bounds: c,
        }))
      : ((this.map.programmaticalEvent = !0),
        this.setInitialMapBounds(),
        this.dispatcher.trigger('points:bounds:restore', {
          bounds: null,
        }))
  }),
  (SearchMap.prototype.subscribe = function() {
    var a = this,
      b = !1,
      c = _.once(function() {
        a.isActiveSyncButton(!1)
      })
    this.dispatcher.subscribe('filter:paramschange', function() {
      b = !0
    }),
      this.dispatcher.subscribe('filter:paramsclear', function() {
        b = !0
      }),
      this.dispatcher.subscribe('points:processing', function() {
        a.isProcessing(!0)
      }),
      this.dispatcher.subscribe('points:updated', function(d) {
        var e = a.updatePoints(d)
        a.isActiveSyncButton() || (!e.addedMarkersCounter && !e.removedMarkersCounter) || a.isActiveSyncButton(!0),
          a.isActiveSyncButton() && b && a.isActiveSyncButton(!1),
          c(),
          a.total(d.total),
          a.isProcessing(!1),
          (b = !1),
          a.dispatcher.trigger('map:points:updated', d.features)
      }),
      this.dispatcher.subscribe('points:error', function() {
        a.total(0), a.isProcessing(!1)
      }),
      this.dispatcher.subscribe('geocode:boundsupdated', function(b) {
        a.map.fitBounds(b)
      }),
      this.dispatcher.subscribe('apartments:idscollectend', function(b) {
        ;(a.accentIds = b), a.map && (a.updateMarkersAccent(), a.updateMarkersSelected())
      }),
      this.dispatcher.subscribe('auctions:apartment:change', function(b, c) {
        if (b) {
          if (c) return void a.setPoints()
          var d = b.location.latitude,
            e = b.location.longitude,
            f = {
              latitude: d,
              longitude: e,
            }
          Geocoder.executeAfterGettingCityBounds(f, function(b) {
            ;(a.map.programmaticalEvent = !0),
              b ? a.map.fitBounds(b) : a.map.setView([d, e], a.initZoom),
              setTimeout(function() {
                ;(a.map.programmaticalEvent = !1), a.setPoints()
              }, 260)
          })
        }
      }),
      this.dispatcher.subscribe('apartments:auctions-apartment:choose', function(b) {
        var c = a.collectionMarkers[b],
          d = !!c
        a.dispatcher.trigger('map:auctions-apartment:choose', b, d)
      }),
      this.dispatcher.subscribe('map:sync:start', function() {
        a.onSyncButtonClick()
      }),
      this.dispatcher.subscribe('popstate:restore', function(b) {
        a.restoreState(b)
      })
  }),
  (SearchMap.prototype.init = function() {
    L.Icon.Default.imagePath = 'images/leaflet'
    var a = {
        zoomSnap: 0.2,
        attributionControl: !1,
        zoomControl: !1,
      },
      b = this
    ;(this.map = L.map(this.containerId, a)),
      (this.cluster = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: !1,
        zoomToBoundsOnClick: !1,
        maxClusterRadius: 12,
        iconCreateFunction: function(a) {
          return L.divIcon({
            iconSize: [14, 14],
            className: 'map-marker-cluster',
            html: ' ',
          })
        },
      })),
      this.cluster.on('clusterclick', function(a) {
        var c = a.layer
        window.ga && window.ga('pk.send', 'event', 'ÐšÐ°Ñ€Ñ‚Ð°', 'ÐŸÐ¸Ð½'), b.showClusterPopup(c)
      }),
      this.map.addLayer(this.cluster),
      L.tileLayer(this.mapConfig.tileSource, {
        detectRetina: !0,
      }).addTo(this.map),
      !Onliner.isMobile && (this.extendedLayers = new MapExtendedLayers(this.map, this.mapConfig)),
      L.control
        .attribution({
          position: 'bottomright',
          prefix: !1,
        })
        .addAttribution(this.mapConfig.copyright)
        .addTo(this.map),
      L.control
        .zoom({
          position: 'bottomleft',
        })
        .addTo(this.map),
      this.setInitialMapBounds(),
      this.initEvents(),
      this.initPoints()
  }),
  (SearchMap.prototype.initEvents = function() {
    var a = this,
      b = this.map,
      c = _.debounce(function() {
        a.getPoints()
      }, 350)
    b.on('moveend', function() {
      return b.programmaticalEvent ? void (b.programmaticalEvent = !1) : void c()
    }),
      b.on('zoomend', function() {
        b.getZoom() !== b.getMaxZoom() && a.hideClusterPopup(), a.updateMarkersMarked()
      }),
      this.cluster.on('clusterclick', function(c) {
        b.getZoom() === b.getMaxZoom() && a.showClusterPopup(c.layer)
      })
  }),
  (SearchMap.prototype.setInitialMapBounds = function() {
    var a = !_.isNull(this.initialBounds)
    this.initialCoordinates
      ? this.map.setView(this.initialCoordinates, this.initZoom)
      : a
        ? this.map.fitBounds(this.initialBounds)
        : this.map.setView([53.898242, 27.562198], this.initZoom)
  }),
  (SearchMap.prototype.showClusterPopup = function(a) {
    function b(a, b) {
      d.pkApiService.requestApartmentsData(a, f, b)
    }

    function c() {
      h.setContent(
        d.popupMultipleTemplate({
          content: i,
          counter: SearchApartments.formatCounter(e),
          processing: !1,
        }),
      ),
        $('.leaflet-popup-content-wrapper').addClass('leaflet-popup-content-wrapper_multiple'),
        'function' == typeof $.fn.perfectScrollbar &&
          $('.map-popover__content:last').perfectScrollbar({
            minScrollbarLength: 20,
          })
    }
    var d = this,
      e = 0,
      f = 100,
      g = [],
      h = L.popup()
        .setLatLng(a.getLatLng())
        .setContent(
          d.popupTemplate({
            content: null,
            processing: !0,
          }),
        )
        .openOn(this.map),
      i = ''
    ;(this.clusterPopup = h),
      (a.popup = h),
      _.each(a.getAllChildMarkers() || [], function(a) {
        g.push(a.myId)
      })
    var j = []
    do
      !(function() {
        var a = g.splice(0, f)
        e += a.length
        var c = function(c) {
          var d = {}
          ;(d.success = function(a) {
            c(null, a)
          }),
            b(a, d)
        }
        j.push(c)
      })()
    while (g.length)
    async.parallel(j, function(a, b) {
      _.each(b, function(a) {
        b[0].data &&
          b[0].data.apartments &&
          _.each(a.data.apartments, function(a) {
            SearchApartments.transformApartment(a), (i += d.popupApartmentTemplate(d.getApartmentDataForTemplate(a)))
          })
      }),
        c()
    })
  }),
  (SearchMap.prototype.hideClusterPopupByMarker = function(a) {
    var b = this.map,
      c = this.cluster.getVisibleParent(a)
    c && c.popup && (b.closePopup(), (c.popup = null))
  }),
  (SearchMap.prototype.hideClusterPopup = function() {
    var a = this.clusterPopup
    a && a._close()
  }),
  (SearchMap.prototype.getApartmentDataForTemplate = function(a) {
    return a
      ? {
          url: a.url,
          photo: a.photo,
          created_at: SearchApartments.formatDate(a.created_at),
          last_time_up: SearchApartments.formatDate(a.last_time_up),
          seller: SearchApartments.formatSellerType(a.seller.type),
          prices: {
            byn: SearchApartments.formatPrice(a.price, 'BYN'),
            usd: SearchApartments.formatPrice(a.price, 'USD'),
          },
          number_of_rooms: a.number_of_rooms,
          area: a.area,
          floor: a.floor,
          number_of_floors: a.number_of_floors,
          address: a.location.user_address,
          auction_bid: a.auction_bid,
        }
      : {}
  }),
  (SearchMap.prototype.getBoundsObjects = function() {
    var a = this.map.getBounds(),
      b = a.getSouthWest(),
      c = a.getNorthEast()
    return {
      lb: {
        lat: b.lat,
        long: b.lng,
      },
      rt: {
        lat: c.lat,
        long: c.lng,
      },
    }
  }),
  (SearchMap.prototype.initPoints = function() {
    this.dispatcher.trigger('points:boundsinit', {
      bounds: this.getBoundsObjects(),
    })
  }),
  (SearchMap.prototype.getPoints = function() {
    this.dispatcher.trigger('points:boundschange', {
      bounds: this.getBoundsObjects(),
    })
  }),
  (SearchMap.prototype.setPoints = function() {
    this.dispatcher.trigger('points:bounds:setview', {
      bounds: this.getBoundsObjects(),
    })
  }),
  (SearchMap.prototype.updatePoints = function(a) {
    var b = {
      removedMarkersCounter: this.removeMissingMarkers(a),
      addedMarkersCounter: this.addNewMarkers(a),
    }
    return (
      this.updateMarkersData(a), this.updateMarkersAccent(), this.updateMarkersSelected(), this.updateMarkersMarked(), b
    )
  }),
  (SearchMap.prototype.removeMissingMarkers = function(a) {
    var b = this,
      c = this.collectionMarkers,
      d = 0
    if (a && a.features)
      return (
        ko.utils.objectForEach(c, function(c, e) {
          _.where(a.features, {
            id: parseInt(c, 10),
          }).length || (b.removeMarker(c), (d += 1))
        }),
        d
      )
  }),
  (SearchMap.prototype.addNewMarkers = function(a) {
    var b = this,
      c = this.collectionMarkers,
      d = []
    if (a && a.features)
      return (
        a.features.forEach(function(a) {
          var e,
            f = a.id
          c[f] || ((e = b.createMarker(a)), d.push(e))
        }),
        this.addMarkers(d),
        d.length
      )
  }),
  (SearchMap.prototype.addMarkers = function(a) {
    var b = this
    ;(a = a || []),
      this.cluster.addLayers(a, {
        chunkedLoading: !0,
        chunkInterval: 50,
        chunkDelay: 100,
      }),
      this.extendedLayers && this.extendedLayers.updateSubscriptions(),
      a.forEach(function(a) {
        ;(b.collectionMarkers[a.myId] = a), b.hideClusterPopupByMarker(a)
      })
  }),
  (SearchMap.prototype.removeMarker = function(a) {
    var b = this.collectionMarkers[a]
    this.hideClusterPopupByMarker(b), this.cluster.removeLayer(b), delete this.collectionMarkers[a]
  }),
  (SearchMap.prototype.createMarker = function(a) {
    var b = this,
      c = new L.Marker(a.geometry.coordinates, {
        icon: L.divIcon({
          className: 'map-marker',
          iconSize: [14, 14],
        }),
      })
    return (
      c.bindPopup('', {
        closeButton: !1,
      }),
      (c.data = a),
      (c.myId = a.id),
      c.on('popupopen', function() {
        var a = this
        window.ga && window.ga('pk.send', 'event', 'ÐšÐ°Ñ€Ñ‚Ð°', 'ÐŸÐ¸Ð½'),
          a.myPopupIsLoaded ||
            (a.setPopupContent(
              b.popupTemplate({
                content: null,
                processing: !0,
              }),
            ),
            $.get(Onliner.secureProjectUrl('pk.api', '/apartments/' + c.myId)).done(function(c) {
              SearchApartments.transformApartment(c),
                a.setPopupContent(
                  b.popupTemplate({
                    content: b.popupApartmentTemplate(b.getApartmentDataForTemplate(c)),
                    processing: !1,
                  }),
                ),
                (a.myPopupIsLoaded = !0)
            }))
      }),
      c.on('mouseover', function() {
        b.dispatcher.trigger('map:markerselect', [this.myId])
      }),
      c.on('mouseout', function() {
        b.dispatcher.trigger('map:markerunselect')
      }),
      c
    )
  }),
  (SearchMap.prototype.updateMarkersData = function(a) {
    var b = this.collectionMarkers
    a &&
      a.features &&
      a.features.forEach(function(a) {
        var c = a.id,
          d = b[c]
        d.data = a
      })
  }),
  (SearchMap.prototype.updateMarkersAccent = function() {
    this.deaccentMarkers(), this.accentMarkers()
  }),
  (SearchMap.prototype.updateMarkersSelected = function() {}),
  (SearchMap.prototype.updateMarkersMarked = function() {
    var a = this,
      b = this.map.getZoom()
    _.each(this.collectionMarkers, function(c) {
      if (c.data.is_marked && b >= a.minMarkedZoom) {
        var d = a.cluster.getVisibleParent(c)
        a.setMarkerIcon(c, 'marked'), a.setClusterIcon(d, 'marked')
      } else a.setMarkerIcon(c, 'not-marked')
    })
  }),
  (SearchMap.prototype.accentMarkers = function() {
    var a = this,
      b = this.collectionMarkers
    this.accentIds.forEach(function(c) {
      var d = b[c]
      a.setMarkerIcon(d, 'accent')
    })
  }),
  (SearchMap.prototype.deaccentMarkers = function() {
    var a = this
    _.each(this.collectionMarkers, function(b) {
      a.setMarkerIcon(b, 'not-accent')
    })
  }),
  (SearchMap.prototype.setMarkerIcon = function(a, b) {
    if (a) {
      var c = a.options.icon,
        d = c.options.iconSize,
        e = (c.options.className || '').split(' ')
      switch (b) {
        case 'active':
          e.push('map-marker_active')
          break
        case 'not-active':
          e = _.without(e, 'map-marker_active')
          break
        case 'accent':
          e.push('map-marker_accent')
          break
        case 'not-accent':
          e = _.without(e, 'map-marker_accent')
          break
        case 'selected':
          e.push('map-marker_selected')
          break
        case 'not-selected':
          e = _.without(e, 'map-marker_selected')
          break
        case 'marked':
          e.push('map-marker_marked')
          break
        case 'not-marked':
          e = _.without(e, 'map-marker_marked')
      }
      ;(c.options.iconSize = d), (c.options.className = e.join(' ')), a.setIcon(c)
    }
  }),
  (SearchMap.prototype.setClusterIcon = function(a, b) {
    if (a && a.getChildCount) {
      var c,
        d = a.options.icon,
        e = d.options.iconSize,
        f = (d.options.className || '').split(' ')
      switch ((f.push('map-marker-cluster'), b)) {
        case 'active':
          f.push('map-marker_active')
          break
        case 'not-active':
          f = _.without(f, 'map-marker_active')
          break
        case 'selected':
          f.push('map-marker_selected')
          break
        case 'not-selected':
          f = _.without(f, 'map-marker_selected')
          break
        case 'marked':
          f.push('map-marker_marked')
          break
        case 'not-marked':
          f = _.without(f, 'map-marker_marked')
      }
      ;(c = {
        html: '',
        className: _.uniq(f).join(' '),
        iconSize: e,
      }),
        (d = L.divIcon(c)),
        a.setIcon(d)
    }
  }),
  (SearchMap.prototype.toggleFullscreen = function() {
    this.$container.toggleClass(this.fullscreenModifier),
      this.map.invalidateSize(),
      !this._isFullscreen && window.ga && window.ga('pk.send', 'event', 'ÐšÐ°Ñ€Ñ‚Ð°', 'Ð Ð°Ð·Ð²ÐµÑ€Ð½ÑƒÑ‚ÑŒ')
  }),
  (SearchMap.prototype._isFullscreen = function() {
    return this.$container.hasClass(fullscreenModifier)
  }),
  (SearchMap.prototype._getMapConfiguration = function(a) {
    $.ajax({
      url: Onliner.secureProjectUrl('r', '/pk/assets/config/map.config.json'),
      async: !1,
      dataType: 'json',
      success: function(b) {
        a && a(b)
      },
    })
  }),
  (SearchRequest.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher,
      c = _.debounce(function() {
        a.apartments()
      }, 300),
      d = _.debounce(function() {
        a.points()
      }, 300)
    b.subscribe('filter:paraminit', function(b, c) {
      a.setParams(SearchRequest.createPairObject(b, c)), d()
    }),
      b.subscribe('filter:paramschange', function(b) {
        a.copyPointsBoundsToApartments(),
          a.setParams(b),
          a.setParams(
            {
              page: 1,
            },
            'apartments',
          ),
          c(),
          d()
      }),
      b.subscribe('filter:paramsclear', function(b, c) {
        a.setParams(b),
          a.setParams(b, 'points'),
          a.setParams(b, 'apartments'),
          !c &&
            a.setParams(
              {
                page: 1,
              },
              'apartments',
            )
      }),
      b.subscribe('points:boundsinit', function(b) {
        _.extend(a.initialParams, b), a.setParams(b, 'apartments'), a.setParams(b, 'points'), c(), d()
      }),
      b.subscribe('points:boundschange', function(b) {
        a.setParams(b, 'points'),
          d(),
          a.synced && a.setParams(b, 'apartments'),
          a.synced &&
            a.setParams(
              {
                page: 1,
              },
              'apartments',
            ),
          a.synced && c()
      }),
      b.subscribe('points:buttonclick', function(b) {
        a.copyPointsBoundsToApartments(),
          a.setParams(
            {
              page: 1,
            },
            'apartments',
          ),
          a.apartments(),
          b && b()
      }),
      b.subscribe('points:bounds:setview', function(b) {
        a.setParams(b, 'apartments'), a.setParams(b, 'points'), c(), d()
      }),
      b.subscribe('points:bounds:restore', function(b) {
        ;(b = _.clone(b)),
          (b.bounds = b.bounds || a.initialParams.bounds),
          a.setParams(b, 'apartments', !0),
          a.setParams(b, 'points'),
          c(),
          d()
      }),
      b.subscribe('apartments:paraminit', function(b, d) {
        a.setParams(SearchRequest.createPairObject(b, d), 'apartments'), c()
      }),
      b.subscribe('apartments:order:change', function(b) {
        a.setParams(b, 'apartments'),
          a.setParams(b, 'points'),
          a.setParams(
            {
              page: 1,
            },
            'apartments',
          ),
          c(),
          d()
      }),
      b.subscribe('pagination:change', function(b) {
        var d = {
          page: b,
        }
        a.setParams(d, 'apartments'), c()
      }),
      b.subscribe('map:synced:changed', function(b) {
        a.synced = b
      }),
      b.subscribe('auctions-bid:update:success', function() {
        c(), d()
      })
  }),
  (SearchRequest.prototype.setParams = function(a, b, c) {
    b = b || 'common'
    var d = this.params[b]
    _.isUndefined(d) && (d = this.params[b] = {}),
      1 === d.page && delete d.page,
      'relevance' === d.order && delete d.order
    for (var e in a)
      null !== a[e]
        ? (c || 'apartments' !== b || 'bounds' !== e || this.dispatcher.trigger('apartments:boundschange', a[e]),
          (d[e] = a[e]))
        : delete d[e]
  }),
  (SearchRequest.prototype.query = function(a) {
    var b = this,
      c = _.extend(_.clone(this.params.common), this.params[a] || {}),
      d = {}
    this.requests[a] && this.requests[a].cancel(),
      this.dispatcher.trigger(a + ':processing'),
      (d.success = function(c) {
        b.dispatcher.trigger(a + ':updated', c.data)
      }),
      (d.error = function(c) {
        b.dispatcher.trigger(a + ':error')
      }),
      (this.requests[a] = this.pkApiService.searchApartments(a, c, d))
  }),
  (SearchRequest.prototype.apartments = function() {
    this.query('apartments')
  }),
  (SearchRequest.prototype.points = function() {
    this.query('points')
  }),
  (SearchRequest.prototype.copyPointsBoundsToApartments = function() {
    var a = (this.params.points && this.params.points.bounds) || void 0
    _.isUndefined(a) ||
      this.setParams(
        {
          bounds: a,
        },
        'apartments',
      )
  }),
  (SearchRequest.createPairObject = function(a, b) {
    var c = {}
    return (c[a] = b), c
  }),
  (SearchResponse.prototype.parse = function(a, b) {
    var c = this
    a.done(function(a) {
      c.dispatcher.trigger(b + ':updated', a)
    }),
      a.fail(function(a, d) {
        'abort' !== d && c.dispatcher.trigger(b + ':error')
      })
  }),
  (SearchState.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher
    b.subscribe('apartments:boundschange', function(b) {
      _.extend(a.state, {
        bounds: b,
        page: 1,
      }),
        a.setState()
    }),
      b.subscribe('apartments:paramschange', function(b) {
        _.extend(a.state, {
          page: 1,
        }),
          _.extend(a.state, b),
          a.setState()
      }),
      b.subscribe('apartments:order:change', function(b) {
        _.extend(a.state, b), a.setState()
      }),
      b.subscribe('pagination:change', function(b) {
        _.extend(a.state, {
          page: b,
        }),
          a.setState()
      }),
      b.subscribe('filter:paramschange', function(b) {
        _.extend(a.state, {
          page: 1,
        }),
          _.extend(a.state, b),
          a.setState()
      }),
      b.subscribe('filter:paramsclear', function(b) {
        _.each(b, function(b, c) {
          delete a.state[c]
        }),
          a.setState()
      }),
      b.subscribe('auctions:apartment:change', function(b) {
        var c = b && {
          auction_apartment_id: b.id,
        }
        c || delete a.state.auction_apartment_id, _.extend(a.state, c), a.setState()
      }),
      b.subscribe('points:bounds:setview', function() {
        delete a.state.bounds, a.setState()
      }),
      b.subscribe('points:bounds:restore', function(b) {
        _.extend(a.state, b), a.setState()
      })
  }),
  (SearchState.prototype.setState = _.debounce(function() {
    var a = this.state
    if (
      (1 === a.page && delete a.page,
      'relevance' === a.order && delete a.order,
      _.each(a, function(b, c) {
        ;(void 0 !== b && null !== b && '' !== b) || delete a[c], _.isArray(b) && !b.length && delete a[c]
      }),
      window.history.pushState)
    ) {
      var b = window.location,
        c = encodeURI(this.getPath()),
        d = b.pathname + b.search + b.hash
      c !== d && window.history.pushState(a, '', c)
    }
  }, 10)),
  (SearchState.prototype.getPath = function() {
    var a = this.state,
      b = ['auction_apartment_id', 'bounds', 'order', 'page'],
      c = _.omit(a, b),
      d = _.pick(a, b),
      e = decodeURIComponent($.param(c)),
      f = decodeURIComponent($.param(d)),
      g = document.location.pathname
    return (g += e.length ? '?' + e : ''), (g += f.length ? '#' + f : '')
  }),
  (SearchState.getInitialState = function() {
    var a = (location.hash || '').replace(/^#/, ''),
      b = (location.search || '').replace(/^\?/, ''),
      c = deparam(a),
      d = deparam(b),
      e = _.extend({}, c, d)
    return e
  }),
  (SearchApartmentsDesktop.prototype = Object.create(SearchApartments.prototype)),
  (SearchApartmentsDesktop.prototype.subscribe = function() {
    var a = this,
      b = this.dispatcher
    SearchApartments.prototype.subscribe.call(this),
      b.subscribe('map:markerselect', function(b) {
        a.activeIds(b)
      }),
      b.subscribe('map:markerunselect', function() {
        a.activeIds([])
      }),
      b.subscribe('pagination:change', function() {
        a.scrollTop()
      }),
      b.subscribe('auctions:settings:success', function(b, c) {
        a.initAuctions(b, c)
      }),
      b.subscribe('auctions:update-apartments:success', function(b, c) {
        c && (a.auctionsSelectedApartment(c), a._setAuctionsSelectedItem())
      }),
      b.subscribe('auctions:apartment:change', function(b) {
        return b
          ? (a.auctionsSelectedApartment(b),
            a.order('relevance'),
            a.dispatcher.trigger('apartments:paramschange', {
              order: a.order(),
            }),
            void a.pagination.page.current(1))
          : (a.auctionsSelectedApartment(null), void a._setAuctionsSelectedItem())
      }),
      b.subscribe('map:points:updated', function(c) {
        a.auctionsSelectedApartment()
          ? a.isAuctionsSelectedApartmentInRange(
              _.any(c, function(b) {
                return b.id === a.auctionsSelectedApartment().id
              }),
            )
          : a.isAuctionsSelectedApartmentInRange(!1),
          b.subscribe('auctions:update-apartments:complete', function() {
            a.auctionsSelectedApartment()
              ? a.isAuctionsSelectedApartmentInRange(
                  _.any(c, function(b) {
                    return b.id === a.auctionsSelectedApartment().id
                  }),
                )
              : a.isAuctionsSelectedApartmentInRange(!1),
              b.unsubscribe('auctions:update-apartments:complete')
          })
      }),
      b.subscribe('popover:close', function(b) {
        var c
        b
          ? ((c = ko.dataFor(b[0])),
            c && c.biddingStage && c.biddingStage('hidden'),
            c && c.errors && c.errors([]),
            b.parent().one('hover', function() {
              c && c.biddingStage && c.biddingStage('bidding')
            }))
          : a.items().forEach(function(a) {
              a.biddingStage('bidding')
            })
      }),
      b.subscribe('map:synced:changed', function(b) {
        a.autosync(b)
      }),
      b.subscribe('map-sync:changed', function(b) {
        a.mapOutOfSync(b)
      })
  }),
  (SearchApartmentsDesktop.prototype.initAuctions = function(a, b) {
    this.isAuctionsInitialized(!0),
      (this.auctionsSettings = a
        ? {
            bid_min: parseFloat(a.bid_min.amount),
            bid_step: parseFloat(a.bid_step.amount),
            billing_period: a.billing_period,
          }
        : {}),
      (this.auctions = b),
      this._setAuctionsDataItems()
  }),
  (SearchApartmentsDesktop.prototype.setItems = function(a) {
    ;(a = a || []),
      ko.utils.arrayForEach(a, function(a) {
        ;(a.seller.title = SearchApartments.formatSellerType(a.seller.type)),
          (a.auction_cost = ko.observable()),
          (a.auctionPopoverAmount = ko.observable()),
          (a.formatedAuctionPopoverAmount = ko.computed({
            read: function() {
              return format.formatPrice(a.auctionPopoverAmount(), 'BYN')
            },
            write: function(b) {
              a.errors([]),
                (b = parseFloat(b.replace(/\,/g, '.'))),
                a.auctionPopoverAmount(isNaN(b) ? 0 : b),
                a.formatedAuctionPopoverAmount.notifySubscribers()
            },
            owner: this,
          })),
          (a.actionStatus = ko.observable()),
          (a.canRetryBidding = ko.observable(!0)),
          (a.biddingStage = ko.observable()),
          (a.selected = ko.observable()),
          (a.errors = ko.observable([]))
      }),
      this._setAuctionsDataItems(a),
      this._setAuctionsSelectedItem(a),
      this.items(a)
  }),
  (SearchApartmentsDesktop.prototype._setAuctionsDataItems = function(a) {
    var b = this,
      a = a || this.items() || [],
      c = this.auctionsSettings,
      d = c ? c.bid_min : 0
    this.isAuctionsInitialized() &&
      c &&
      ko.utils.arrayForEach(a, function(e, f) {
        var g
        e.auction_bid
          ? ((e.auction_bid = parseFloat(e.auction_bid.amount)),
            (g =
              f && b.currentUserId === e.author_id && a[f - 1].auction_bid
                ? a[f - 1].auction_bid + c.bid_step
                : e.auction_bid + c.bid_step),
            (g = parseFloat(numeral(g).format('0.00'))),
            e.auction_cost(g),
            e.auctionPopoverAmount(g))
          : e.auctionPopoverAmount(d),
          e.biddingStage('bidding'),
          (e.expiresIn = ko.observable())
      })
  }),
  (SearchApartmentsDesktop.prototype._setAuctionsSelectedItem = function(a) {
    var a = a || this.items() || [],
      b = this.auctionsSelectedApartment()
    ko.utils.arrayForEach(a, function(a) {
      var c = (b && a.id === b.id) || !1
      a.selected(c)
    })
  }),
  (SearchApartmentsDesktop.prototype.setOrder = function(a) {
    this.order() !== a && SearchApartments.prototype.setOrder.call(this, a)
  }),
  (SearchApartmentsDesktop.prototype.setAuctionsApartment = function(a) {
    var b = this
    this.scrollToAuctions(function() {
      b.dispatcher.trigger('apartments:auctions-apartment:choose', a.id)
    })
  }),
  (SearchApartmentsDesktop.prototype.setAuctionsAmount = function(a) {
    var b = this
    this.scrollToAuctions(function() {
      b.dispatcher.trigger('apartments:auctions-amount:set', a.auction_cost())
    })
  }),
  (SearchApartmentsDesktop.prototype.onMouseEnter = function(a) {
    this.dispatcher.trigger('apartments:itemfocus', a)
  }),
  (SearchApartmentsDesktop.prototype.onMouseLeave = function(a) {
    this.dispatcher.trigger('apartments:itemunfocus', a)
  }),
  (SearchApartmentsDesktop.prototype.scrollTop = function() {
    var a = $('.arenda-main').eq(0)
    $('html, body').animate(
      {
        scrollTop: a.length ? a.offset().top : 0,
      },
      180,
    )
  }),
  (SearchApartmentsDesktop.prototype.scrollToAuctions = function(a) {
    var b = $('.arenda-auction').eq(0),
      c = b.length ? b.offset().top : 0
    return $(window).scrollTop() <= c
      ? void (a && a())
      : void $('html, body').animate(
          {
            scrollTop: c,
          },
          180,
          a,
        )
  }),
  (SearchApartmentsDesktop.prototype.increaseItemPopoverAmount = function(a) {
    a.auctionPopoverAmount(a.auctionPopoverAmount() + this.auctionsSettings.bid_step)
  }),
  (SearchApartmentsDesktop.prototype.decreaseItemPopoverAmount = function(a) {
    var b = a.auctionPopoverAmount() - this.auctionsSettings.bid_step
    ;(b = Math.max(b, this.auctionsSettings.bid_min)), a.auctionPopoverAmount(b)
  }),
  (SearchApartmentsDesktop.prototype.goToBillingStage = function(a, b) {
    var c = [],
      d = a.auctionPopoverAmount(),
      e = this.auctionsSettings.bid_min,
      f = this.auctionsSettings.bid_step
    return (
      a.errors([]),
      Math.round(100 * d) % Math.round(100 * f) !== 0 && c.push('Ð¨Ð°Ð³ ÑÑ‚Ð°Ð²ÐºÐ¸ ' + f + ' Ñ€ÑƒÐ±Ð»ÐµÐ¹'),
      d < e && c.push('ÐœÐ¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð°Ñ ÑÑ‚Ð°Ð²ÐºÐ° ' + e + ' Ñ€ÑƒÐ±Ð»ÐµÐ¹'),
      c.length
        ? void a.errors(c)
        : (a.biddingStage('pre-billing'),
          void (
            b &&
            this.auctionsAPI.get(a.id, {
              success: function(b) {
                a.expiresIn(b.data.expires_in)
              },
            })
          ))
    )
  }),
  (SearchApartmentsDesktop.prototype.getStepUpAmount = function(a, b) {
    return b && this.items()[b].auction_bid && this.items()[b - 1].auction_bid
      ? this.items()[b - 1].auction_bid - a.auction_bid + this.auctionsSettings.bid_step
      : ''
  }),
  (SearchApartmentsDesktop.prototype.updateBid = function(a, b) {
    var c = this.dispatcher,
      d = {
        bid: {
          amount: format.formatPrice(b, 'BYN').replace(/\,/g, '.'),
          currency: 'BYN',
        },
      },
      e = {}
    a.canRetryBidding(!0),
      a.errors([]),
      a.actionStatus('update'),
      (e.success = function(a) {
        c && c.trigger('auctions-bid:updated-from-popup:success'),
          c && c.trigger('auctions-bid:update:success'),
          c && c.trigger('auctions-bid:update:complete')
      }),
      (e.error = function(b) {
        var d = [],
          e = {}
        switch (
          (ko.utils.objectForEach(b.response.data.errors || {}, function(a, b) {
            d = d.concat(b)
          }),
          b.response.status)
        ) {
          case 403:
            e.message && a.errors([e.message]), a.canRetryBidding(!1)
            break
          case 402:
            c && c.trigger('auctions-bid:error:not-enough-money')
            break
          case 422:
            a.errors(d)
            break
          default:
            !d.length && a.errors(['ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ ÑÐ´ÐµÐ»Ð°Ñ‚ÑŒ ÑÑ‚Ð°Ð²ÐºÑƒ'])
        }
        c && c.trigger('auctions-bid:update:error')
      }),
      (e.complete = function() {
        a.actionStatus('')
      }),
      this.auctionsAPI.update(a.id, d, e)
  }),
  (SearchApartmentsDesktop.prototype.getHumanizedExpirationDuration = function(a) {
    var b = moment.duration(a, 'seconds'),
      c = b.hours(),
      d = b.minutes(),
      e = []
    return (
      c > 0 && e.push(c, format.pluralForm(c, ['Ñ‡Ð°Ñ', 'Ñ‡Ð°ÑÐ°', 'Ñ‡Ð°ÑÐ¾Ð²'])),
      e.push(d, format.pluralForm(d, ['Ð¼Ð¸Ð½ÑƒÑ‚Ñƒ', 'Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹', 'Ð¼Ð¸Ð½ÑƒÑ‚'])),
      e.join(' ')
    )
  }),
  (SearchApartmentsDesktop.prototype.resetToSelectedApartment = function() {
    this.dispatcher && this.dispatcher.trigger('auctions:apartment:change', this.auctionsSelectedApartment(), !1)
  }),
  (SearchApartmentsDesktop.prototype.syncMap = function() {
    this.dispatcher.trigger('map:sync:start')
  }),
  (SearchFilterDesktop.prototype = Object.create(SearchFilter.prototype)),
  (SearchGeocoderDesktop.prototype = Object.create(SearchGeocoder.prototype)),
  (SearchGeocoderDesktop.prototype.onKeyUp = function(a, b) {
    var c,
      d,
      e = b.keyCode || b.which,
      f = {
        up: 38,
        down: 40,
      },
      g = this.activeSuggestIndex()
    if (e === f.up || e === f.down) {
      if (!this.list().length) return
      return (
        (c = this.list().length - 1),
        e === f.up && null !== g && (d = g - 1 < 0 ? c : g - 1),
        e === f.down && (d = null === g ? 0 : g + 1 > c ? 0 : g + 1),
        void this.activeSuggestIndex(d)
      )
    }
    SearchGeocoder.prototype.onKeyUp.call(this, a, b)
  }),
  (SearchMapDesktop.prototype = Object.create(SearchMap.prototype)),
  (SearchMapDesktop.prototype.subscribe = function() {
    var a = this
    SearchMap.prototype.subscribe.call(this),
      this.dispatcher.subscribe('apartments:itemfocus', function(b) {
        var c = a.collectionMarkers[b],
          d = a.cluster.getVisibleParent(c)
        a.setMarkerIcon(c, 'active'), a.setClusterIcon(d, 'active')
      }),
      this.dispatcher.subscribe('apartments:itemunfocus', function(b) {
        var c = a.collectionMarkers[b],
          d = a.cluster.getVisibleParent(c)
        a.setMarkerIcon(c, 'not-active'), a.setClusterIcon(d, 'not-active')
      }),
      this.dispatcher.subscribe('apartments:updated', function(b) {
        var c = a.cluster.getLayers() || []
        c.forEach(function(b) {
          var c = a.cluster.getVisibleParent(b)
          a.setClusterIcon(c, 'not-active')
        })
      }),
      this.dispatcher.subscribe('auctions:update-apartments:success', function(b, c) {
        c && (a.auctionsSelectedApartment(c), a.updateMarkersSelected())
      }),
      this.dispatcher.subscribe('auctions:apartment:change', function(b) {
        return b
          ? void a.auctionsSelectedApartment(b)
          : (a.auctionsSelectedApartment(null), void a.updateMarkersSelected())
      })
  }),
  (SearchMapDesktop.prototype.initEvents = function() {
    var a = this,
      b = this.map
    SearchMap.prototype.initEvents.call(this),
      b.scrollWheelZoom.disable(),
      $(document).bind('mousedown', function() {
        b.scrollWheelZoom.disable()
      }),
      $('#' + this.containerId).bind('mousedown', function(a) {
        b.scrollWheelZoom.enable(), a.stopPropagation()
      }),
      this.cluster.on('clustermouseover', function(b) {
        var c = b.layer.getAllChildMarkers(),
          d = []
        c.forEach(function(a) {
          d.push(a.myId)
        }),
          a.setClusterIcon(b.layer, 'active'),
          a.dispatcher.trigger('map:markerselect', d)
      }),
      this.cluster.on('clustermouseout', function(b) {
        a.setClusterIcon(b.layer, 'not-active'), a.dispatcher.trigger('map:markerunselect')
      }),
      this.cluster.on('clusterclick', function(b) {
        a.dispatcher.trigger('map:markerunselect')
      })
  }),
  (SearchMapDesktop.prototype.updateMarkersSelected = function() {
    var a = this,
      b = this.collectionMarkers,
      c = this.auctionsSelectedApartment(),
      d = c && b[c.id]
    _.each(b, function(b) {
      a.setMarkerIcon(b, 'not-selected')
    }),
      a.setMarkerIcon(d, 'selected')
    var e = a.cluster.getLayers() || [],
      f = a.cluster.getVisibleParent(d)
    e.forEach(function(b) {
      var c = a.cluster.getVisibleParent(b)
      a.setClusterIcon(c, 'not-selected')
    }),
      a.setClusterIcon(f, 'selected')
  }),
  (SearchRequestDesktop.prototype = Object.create(SearchRequest.prototype)),
  (function(a) {
    a(function() {
      function b(a) {
        var b = d ? 'focus' : 'click'
        a.on(b, function() {
          var a = this
          d
            ? setTimeout(function() {
                a.select()
              }, 100)
            : a.select()
        })
      }
      var c = navigator.userAgent
      if (!('Netscape' === navigator.appName && c.indexOf('Trident') > -1 && c.indexOf('rv:11') > -1)) {
        var d = !!(navigator.userAgent.indexOf('Firefox') + 1) || !!(navigator.userAgent.indexOf('MSIE 10') + 1)
        b(a('input[data-autoselect]'))
      }
    })
  })(jQuery),
  (function(a) {
    a(function() {
      function b(b) {
        a('body').on('click', function() {
          b.removeClass(d.opened)
        }),
          b.on('click', function(c) {
            var e = a(this)
            b.not(e).removeClass(d.opened), e.toggleClass(d.opened), c.stopPropagation()
          })
      }

      function c(b) {
        a('body').on('click', function() {
          b.removeClass(d.opened)
        }),
          a(document).on('keyup', function() {
            var a = event.keyCode || event.which
            27 === a && b.removeClass(d.opened)
          }),
          b.on('click', function(c) {
            if ((c.stopPropagation(), !a(c.originalEvent.target).hasClass(e.dropdownItem))) {
              var f = a(this)
              b.not(f).removeClass(d.opened), f.toggleClass(d.opened)
            }
          })
      }
      var d = {
          opened: 'dropdown_opened',
        },
        e = {
          dropdownItem: 'dropdown__item',
        }
      b(
        a('.dropdown')
          .not('.dropdown_manual')
          .not('.dropdown_multiselect'),
      ),
        c(a('.dropdown_multiselect').not('.dropdown_manual'))
    })
  })(jQuery)
var app
;(app = (function() {
  var a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k = {
      events: function() {
        b.on({
          'scroll resize': function() {
            var c = b.scrollTop(),
              d = b.scrollLeft(),
              h = a.length ? a.offset().top : 0
            l.state(c, h),
              l.preFooter(c, h),
              l.repositionClassifiedBar(),
              'fixed' === f.css('position') ? f.css('margin-left', -d) : f.css('margin-left', ''),
              'fixed' === e.css('position') ? e.css('margin-left', -d) : e.css('margin-left', ''),
              'fixed' === g.css('position') ? g.css('margin-left', -d) : g.css('margin-left', '')
          },
          resize: function() {
            m.viewportUnitsFallback()
          },
        }).trigger('resize')
      },
    },
    l = {
      state: function(b, c) {
        var d = 'arenda-main_fixed'
        b >= c && !a.hasClass(d) ? a.addClass(d) : b < c && a.hasClass(d) && a.removeClass(d)
      },
      preFooter: function(d) {
        var f = c.offset().top,
          g = 'arenda-main_prefooter',
          h = 'classifieds-bar_bottom',
          i = b.height()
        f - d - i <= 0 ? a.addClass(g) : a.removeClass(g),
          f - d < 90 && !e.hasClass(h) ? e.addClass(h) : f - d >= 90 && e.hasClass(h) && e.removeClass(h)
      },
      repositionClassifiedBar: function() {
        if (f.length && 'none' !== f.css('display')) {
          var a = 'fixed' === e.css('position') ? f.height() : 0,
            b = $(window).height() - a
          e.css('top', a), g.css('top', a).height(b), i.height(b), j.height(b), h.css('margin-top', a)
        }
      },
    },
    m = {
      viewportUnitsSupport: function() {
        var a = $(document.createElement('div'))
        return (
          a.css({
            height: '100vh',
          }),
          a.height() > 0
        )
      },
      viewportUnitsFallback: function() {
        m.viewportUnitsSupport() || d.height(b.height())
      },
    },
    n = function(l) {
      ;(a = $(l)),
        (b = $(window)),
        (d = $('#map')),
        (c = $('.g-bottom-i')),
        (e = $('.js-classifieds-bar').first()),
        (f = $('.js-arenda-auction').first()),
        (g = $('.js-arenda-main__box_1')),
        (h = $('.js-arenda-main__box_2')),
        (i = $('.js-arenda-map')),
        (j = $('.js-arenda-map-group')),
        k.events()
    }
  return {
    initModule: n,
  }
})()),
  (function(a, b, c, d, e, f, g, h, i, j, k, l) {
    function m() {
      var a = new b(r),
        h = (new c(r, a), new f(s, r)),
        i = new d(s, t, r, v),
        j = new e('map', s, r),
        k = (new g(s, r), p && p.activeApartment())
      q && i.initAuctions(q, p),
        k && (i.auctionsSelectedApartment(k), j.auctionsSelectedApartment(k)),
        (function() {
          ko.applyBindings(i, document.getElementById('search-filter-results')),
            ko.applyBindings(j, document.getElementById('map-status-processing')),
            ko.applyBindings(j, document.getElementById('map-status-sync-button')),
            ko.applyBindings(j, document.getElementById('map-status-autosync')),
            ko.applyBindings(j, document.getElementById('map-fullscreen-button')),
            ko.applyBindings(h, document.getElementById('search-filter'))
        })(),
        h.initPriceSlider({
          container: '#search-filter-price-slider',
          from: '#search-filter-price-from',
          to: '#search-filter-price-to',
        }),
        h.initAreaSlider({
          container: '#search-filter-area-slider',
          from: '#search-filter-area-from',
          to: '#search-filter-area-to',
        }),
        h.initYearSlider({
          container: '#search-filter-year-slider',
          from: '#search-filter-year-from',
          to: '#search-filter-year-to',
        })
    }

    function n() {
      var a = {}
      ;(a.success = function(a) {
        var b = document.getElementById('arenda-auction')
        ;(q = (a.data && a.data.auction && a.data.auction.settings) || null),
          (p = new h(s, q, r, v, w)),
          p.updateApartments(),
          b && ko.applyBindings(p, b),
          r.trigger('auctions:settings:success', q, p),
          $(window).trigger('scroll')
      }),
        (a.error = function(a) {
          r.trigger('auctions:settings:error')
        }),
        t.getSettings(a),
        r.subscribe('auctions-bid:update:complete', function() {
          u.hideAll()
        }),
        r.subscribe('auctions-bid:remove:complete', function() {
          u.hideAll()
        }),
        r.subscribe('credentials:fail', function(a) {
          400 === a.status && window.location.reload()
        }),
        r.subscribe('auctions:update-bid:complete', function() {
          $(window).trigger('scroll')
        })
    }

    function o() {
      if (s && s.bounds) n(), m()
      else {
        var a = _.once(function() {
          var a = (p && p.activeApartment()) || null
          if (!a) return void m()
          var b = a.location.latitude,
            c = a.location.longitude,
            d = {
              latitude: b,
              longitude: c,
            }
          Geocoder.executeAfterGettingCityBounds(d, function(a) {
            a || (s.coordinates = d),
              a &&
                (s.bounds = {
                  lb: {
                    lat: a[0][0],
                    long: a[0][1],
                  },
                  rt: {
                    lat: a[1][0],
                    long: a[1][1],
                  },
                }),
              m()
          })
        })
        n(),
          r.subscribe('auctions:update-apartments:complete', function() {
            a()
          }),
          r.subscribe('auctions:settings:error', function() {
            a()
          })
      }
    }
    ;(window.initSearchApartments = m), (window.initSearchApartmentsAfterAuctions = o)
    var p,
      q,
      r = new a(),
      s = g.getInitialState(),
      t = new i('pk'),
      u = new j(
        {
          selectors: {
            trigger: '.arenda-popover__trigger, #search-filter-results .classified__badge',
            open: '.arenda-popover__open',
            container: '.arenda-popover',
            close: '.arenda-popover__close, .arenda-popover__control_close',
            unclosable: '.arenda-popover_unclosable',
          },
          modifiers: {
            opened: 'arenda-popover_visible',
          },
        },
        r,
      ),
      v = new l(new k('auctions-popup')),
      w = new k('money-popup')
    ;(s = _.isArray(s) ? {} : s || {}),
      (window.onpopstate = function(a) {
        $('.dropdown').removeClass('dropdown_opened'), r.trigger('popstate:restore', a.state || g.getInitialState())
      })
  })(
    EventDispatcher,
    SearchResponse,
    SearchRequestDesktop,
    SearchApartmentsDesktop,
    SearchMapDesktop,
    SearchFilterDesktop,
    SearchState,
    SearchAuctions,
    AuctionsAPI,
    Popovers,
    Popup,
    Tutorial,
  )
