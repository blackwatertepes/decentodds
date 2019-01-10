! function(t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).eosjs_ecc = t()
    }
}(function() {
    return function o(s, f, a) {
        function h(r, t) {
            if (!f[r]) {
                if (!s[r]) {
                    var e = "function" == typeof require && require;
                    if (!t && e) return e(r, !0);
                    if (u) return u(r, !0);
                    var i = new Error("Cannot find module '" + r + "'");
                    throw i.code = "MODULE_NOT_FOUND", i
                }
                var n = f[r] = {
                    exports: {}
                };
                s[r][0].call(n.exports, function(t) {
                    var e = s[r][1][t];
                    return h(e || t)
                }, n, n.exports, o, s, f, a)
            }
            return f[r].exports
        }
        for (var u = "function" == typeof require && require, t = 0; t < a.length; t++) h(a[t]);
        return h
    }({
        1: [function(t, e, r) {
            (function(l) {
                "use strict";
                var n = t("randombytes"),
                    c = t("bytebuffer"),
                    p = t("browserify-aes"),
                    d = t("assert"),
                    g = t("./key_public"),
                    y = t("./key_private"),
                    v = t("./hash"),
                    o = c.Long;

                function s(t, e, r, i, n) {
                    if (!(t = y(t))) throw new TypeError("private_key is required");
                    if (!(e = g(e))) throw new TypeError("public_key is required");
                    if (!(r = b(r))) throw new TypeError("nonce is required");
                    if (!l.isBuffer(i)) {
                        if ("string" != typeof i) throw new TypeError("message should be buffer or string");
                        i = new l(i, "binary")
                    }
                    if (n && "number" != typeof n) throw new TypeError("checksum should be a number");
                    var o = t.getSharedSecret(e),
                        s = new c(c.DEFAULT_CAPACITY, c.LITTLE_ENDIAN);
                    s.writeUint64(r), s.append(o.toString("binary"), "binary"), s = new l(s.copy(0, s.offset).toBinary(), "binary");
                    var f = v.sha512(s),
                        a = f.slice(32, 48),
                        h = f.slice(0, 32),
                        u = v.sha256(f);
                    if (u = u.slice(0, 4), u = c.fromBinary(u.toString("binary"), c.DEFAULT_CAPACITY, c.LITTLE_ENDIAN).readUint32(), n) {
                        if (u !== n) throw new Error("Invalid key");
                        i = function(t, e, r) {
                            d(t, "Missing cipher text"), t = w(t);
                            var i = p.createDecipheriv("aes-256-cbc", e, r);
                            return t = l.concat([i.update(t), i.final()])
                        }(i, h, a)
                    } else i = function(t, e, r) {
                        d(t, "Missing plain text"), t = w(t);
                        var i = p.createCipheriv("aes-256-cbc", e, r);
                        return t = l.concat([i.update(t), i.final()])
                    }(i, h, a);
                    return {
                        nonce: r,
                        message: i,
                        checksum: u
                    }
                }
                e.exports = {
                    encrypt: function(t, e, r) {
                        var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : function() {
                                if (null === f) {
                                    var t = new Uint8Array(n(2));
                                    f = parseInt(t[0] << 8 | t[1], 10)
                                }
                                var e = o.fromNumber(Date.now()),
                                    r = ++f % 65535;
                                return (e = e.shiftLeft(16).or(o.fromNumber(r))).toString()
                            }();
                        return s(t, e, i, r)
                    },
                    decrypt: function(t, e, r, i, n) {
                        return s(t, e, r, i, n).message
                    }
                };
                var f = null,
                    b = function(t) {
                        return t ? o.isLong(t) ? t : o.fromString(t) : t
                    }, w = function(t) {
                        return t ? l.isBuffer(t) ? t : new l(t, "binary") : t
                    }
            }).call(this, t("buffer").Buffer)
        }, {
            "./hash": 7,
            "./key_private": 9,
            "./key_public": 10,
            assert: 14,
            "browserify-aes": 24,
            buffer: 40,
            bytebuffer: 41,
            randombytes: 66
        }],
        2: [function(t, e, r) {
            "use strict";
            t("./aes");
            var i = t("./key_private"),
                n = t("./key_public"),
                o = t("./signature"),
                s = (t("./key_utils"), t("./hash")),
                f = {
                    initialize: i.initialize,
                    unsafeRandomKey: function() {
                        return i.unsafeRandomKey().then(function(t) {
                            return t.toString()
                        })
                    },
                    randomKey: function(t) {
                        return i.randomKey(t).then(function(t) {
                            return t.toString()
                        })
                    },
                    seedPrivate: function(t) {
                        return i.fromSeed(t).toString()
                    },
                    privateToPublic: function(t) {
                        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "EOS";
                        return i(t).toPublic().toString(e)
                    },
                    isValidPublic: function(t) {
                        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "EOS";
                        return n.isValid(t, e)
                    },
                    isValidPrivate: function(t) {
                        return i.isValid(t)
                    },
                    sign: function(t, e) {
                        var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "utf8";
                        if (!0 === r) throw new TypeError("API changed, use signHash(..) instead");
                        return !1 === r && console.log("Warning: ecc.sign hashData parameter was removed"), o.sign(t, e, r).toString()
                    },
                    signHash: function(t, e) {
                        var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "hex";
                        return o.signHash(t, e, r).toString()
                    },
                    verify: function(t, e, r) {
                        var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "utf8";
                        if (!0 === i) throw new TypeError("API changed, use verifyHash(..) instead");
                        return !1 === i && console.log("Warning: ecc.verify hashData parameter was removed"), (t = o.from(t)).verify(e, r, i)
                    },
                    verifyHash: function(t, e, r) {
                        var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "hex";
                        return (t = o.from(t)).verifyHash(e, r, i)
                    },
                    recover: function(t, e) {
                        var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "utf8";
                        if (!0 === r) throw new TypeError("API changed, use recoverHash(signature, data) instead");
                        return !1 === r && console.log("Warning: ecc.recover hashData parameter was removed"), (t = o.from(t)).recover(e, r).toString()
                    },
                    recoverHash: function(t, e) {
                        var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "hex";
                        return (t = o.from(t)).recoverHash(e, r).toString()
                    },
                    sha256: function(t) {
                        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "hex";
                        return s.sha256(t, e)
                    }
                };
            e.exports = f
        }, {
            "./aes": 1,
            "./hash": 7,
            "./key_private": 9,
            "./key_public": 10,
            "./key_utils": 11,
            "./signature": 13
        }],
        3: [function(t, e, r) {
            "use strict";
            var i = t("./aes"),
                n = t("./key_private"),
                o = t("./key_public"),
                s = t("./signature"),
                f = t("./key_utils");
            e.exports = {
                Aes: i,
                PrivateKey: n,
                PublicKey: o,
                Signature: s,
                key_utils: f
            }
        }, {
            "./aes": 1,
            "./key_private": 9,
            "./key_public": 10,
            "./key_utils": 11,
            "./signature": 13
        }],
        4: [function(t, e, r) {
            (function(h) {
                "use strict";
                var g = t("assert"),
                    u = t("./hash"),
                    l = t("./enforce_types"),
                    c = t("bigi"),
                    p = t("./ecsignature");

                function d(t, e, r, i, n) {
                    l("Buffer", e), l(c, r), n && (e = u.sha256(h.concat([e, new h(n)]))), g.equal(e.length, 32, "Hash must be 256 bit");
                    var o = r.toBuffer(32),
                        s = new h(32),
                        f = new h(32);
                    f.fill(1), s.fill(0), s = u.HmacSHA256(h.concat([f, new h([0]), o, e]), s), f = u.HmacSHA256(f, s), s = u.HmacSHA256(h.concat([f, new h([1]), o, e]), s), f = u.HmacSHA256(f, s), f = u.HmacSHA256(f, s);
                    for (var a = c.fromBuffer(f); a.signum() <= 0 || 0 <= a.compareTo(t.n) || !i(a);) s = u.HmacSHA256(h.concat([f, new h([0])]), s), f = u.HmacSHA256(f, s), f = u.HmacSHA256(f, s), a = c.fromBuffer(f);
                    return a
                }
                function n(t, e, r, i) {
                    var n = t.n,
                        o = t.G,
                        s = r.r,
                        f = r.s;
                    if (s.signum() <= 0 || 0 <= s.compareTo(n)) return !1;
                    if (f.signum() <= 0 || 0 <= f.compareTo(n)) return !1;
                    var a = f.modInverse(n),
                        h = e.multiply(a).mod(n),
                        u = s.multiply(a).mod(n),
                        l = o.multiplyTwo(h, i, u);
                    return !t.isInfinity(l) && l.affineX.mod(n).equals(s)
                }
                function o(t, e, r, i) {
                    g.strictEqual(3 & i, i, "Recovery param is more than two bits");
                    var n = t.n,
                        o = t.G,
                        s = r.r,
                        f = r.s;
                    g(0 < s.signum() && s.compareTo(n) < 0, "Invalid r value"), g(0 < f.signum() && f.compareTo(n) < 0, "Invalid s value");
                    var a = 1 & i,
                        h = i >> 1 ? s.add(n) : s,
                        u = t.pointFromX(a, h),
                        l = u.multiply(n);
                    g(t.isInfinity(l), "nR is not a valid curve point");
                    var c = e.negate().mod(n),
                        p = s.modInverse(n),
                        d = u.multiplyTwo(f, o, c).multiply(p);
                    return t.validate(d), d
                }
                e.exports = {
                    calcPubKeyRecoveryParam: function(t, e, r, i) {
                        for (var n = 0; n < 4; n++) if (o(t, e, r, n).equals(i)) return n;
                        throw new Error("Unable to find valid recovery factor")
                    },
                    deterministicGenerateK: d,
                    recoverPubKey: o,
                    sign: function(r, t, i, e) {
                        var n, o, s = c.fromBuffer(t),
                            f = r.n,
                            a = r.G,
                            h = (d(r, t, i, function(t) {
                                var e = a.multiply(t);
                                return !r.isInfinity(e) && 0 !== (n = e.affineX.mod(f)).signum() && 0 !== (o = t.modInverse(f).multiply(s.add(i.multiply(n))).mod(f)).signum()
                            }, e), f.shiftRight(1));
                        return 0 < o.compareTo(h) && (o = f.subtract(o)), p(n, o)
                    },
                    verify: function(t, e, r, i) {
                        return n(t, c.fromBuffer(e), r, i)
                    },
                    verifyRaw: n
                }
            }).call(this, t("buffer").Buffer)
        }, {
            "./ecsignature": 5,
            "./enforce_types": 6,
            "./hash": 7,
            assert: 14,
            bigi: 19,
            buffer: 40
        }],
        5: [function(e, r, t) {
            (function(o) {
                "use strict";
                var a = e("assert"),
                    t = e("./enforce_types"),
                    h = e("bigi");

                function u(i, n) {
                    function r() {
                        var t = i.toDERInteger(),
                            e = n.toDERInteger(),
                            r = [];
                        return r.push(2, t.length), (r = r.concat(t)).push(2, e.length), (r = r.concat(e)).unshift(48, r.length), new o(r)
                    }
                    return t(h, i), t(h, n), {
                        r: i,
                        s: n,
                        toCompact: function(t, e) {
                            e && (t += 4), t += 27;
                            var r = new o(65);
                            return r.writeUInt8(t, 0), i.toBuffer(32).copy(r, 1), n.toBuffer(32).copy(r, 33), r
                        },
                        toDER: r,
                        toScriptSignature: function(t) {
                            var e = new o(1);
                            return e.writeUInt8(t, 0), o.concat([r(), e])
                        }
                    }
                }
                u.parseCompact = function(t) {
                    a.equal(t.length, 65, "Invalid signature length");
                    var e = t.readUInt8(0) - 27;
                    return a.equal(e, 7 & e, "Invalid signature parameter"), {
                        compressed: !! (4 & e),
                        i: e &= 3,
                        signature: u(h.fromBuffer(t.slice(1, 33)), h.fromBuffer(t.slice(33)))
                    }
                }, u.fromDER = function(t) {
                    a.equal(t.readUInt8(0), 48, "Not a DER sequence"), a.equal(t.readUInt8(1), t.length - 2, "Invalid sequence length"), a.equal(t.readUInt8(2), 2, "Expected a DER integer");
                    var e = t.readUInt8(3);
                    a(0 < e, "R length is zero");
                    var r = 4 + e;
                    a.equal(t.readUInt8(r), 2, "Expected a DER integer (2)");
                    var i = t.readUInt8(r + 1);
                    a(0 < i, "S length is zero");
                    var n = t.slice(4, r),
                        o = t.slice(r + 2);
                    r += 2 + i, 1 < e && 0 === n.readUInt8(0) && a(128 & n.readUInt8(1), "R value excessively padded"), 1 < i && 0 === o.readUInt8(0) && a(128 & o.readUInt8(1), "S value excessively padded"), a.equal(r, t.length, "Invalid DER encoding");
                    var s = h.fromDERInteger(n),
                        f = h.fromDERInteger(o);
                    return a(0 <= s.signum(), "R value is negative"), a(0 <= f.signum(), "S value is negative"), u(s, f)
                }, u.parseScriptSignature = function(t) {
                    var e = t.readUInt8(t.length - 1),
                        r = -129 & e;
                    return a(0 < r && r < 4, "Invalid hashType"), {
                        signature: u.fromDER(t.slice(0, - 1)),
                        hashType: e
                    }
                }, r.exports = u
            }).call(this, e("buffer").Buffer)
        }, {
            "./enforce_types": 6,
            assert: 14,
            bigi: 19,
            buffer: 40
        }],
        6: [function(t, e, r) {
            (function(r) {
                "use strict";

                function i(t) {
                    var e = t.toString().match(/function (.*?)\(/);
                    return e ? e[1] : null
                }
                e.exports = function(t, e) {
                    switch (t) {
                        case "Array":
                            if (Array.isArray(e)) return;
                            break;
                        case "Boolean":
                            if ("boolean" == typeof e) return;
                            break;
                        case "Buffer":
                            if (r.isBuffer(e)) return;
                            break;
                        case "Number":
                            if ("number" == typeof e) return;
                            break;
                        case "String":
                            if ("string" == typeof e) return;
                            break;
                        default:
                            if (i(e.constructor) === i(t)) return
                    }
                    throw new TypeError("Expected " + (i(t) || t) + ", got " + e)
                }
            }).call(this, {
                isBuffer: t("../node_modules/is-buffer/index.js")
            })
        }, {
            "../node_modules/is-buffer/index.js": 59
        }],
        7: [function(t, e, r) {
            "use strict";
            var i = t("create-hash"),
                n = t("create-hmac");
            e.exports = {
                sha1: function(t, e) {
                    return i("sha1").update(t).digest(e)
                },
                sha256: function(t, e) {
                    return i("sha256").update(t).digest(e)
                },
                sha512: function(t, e) {
                    return i("sha512").update(t).digest(e)
                },
                HmacSHA256: function(t, e) {
                    return n("sha256", e).update(t).digest()
                },
                ripemd160: function(t) {
                    return i("rmd160").update(t).digest()
                }
            }
        }, {
            "create-hash": 44,
            "create-hmac": 47
        }],
        8: [function(t, e, r) {
            "use strict";
            var i = t("./api_common"),
                n = t("./api_object"),
                o = Object.assign({}, i, n);
            e.exports = o
        }, {
            "./api_common": 2,
            "./api_object": 3
        }],
        9: [function(v, b, t) {
            (function(i) {
                "use strict";
                var f = function(t, e) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return function(t, e) {
                        var r = [],
                            i = !0,
                            n = !1,
                            o = void 0;
                        try {
                            for (var s, f = t[Symbol.iterator](); !(i = (s = f.next()).done) && (r.push(s.value), !e || r.length !== e); i = !0);
                        } catch (t) {
                            n = !0, o = t
                        } finally {
                            try {
                                !i && f.
                                return &&f.
                                return ()
                            } finally {
                                if (n) throw o
                            }
                        }
                        return r
                    }(t, e);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }, a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                        return typeof t
                    } : function(t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    };
                var t = v("ecurve"),
                    s = t.Point,
                    h = t.getCurveByName("secp256k1"),
                    u = v("bigi"),
                    l = v("assert"),
                    c = v("./hash"),
                    p = v("./key_public"),
                    d = v("./key_utils"),
                    n = v("create-hash"),
                    e = v("./promise-async");
                h.G, h.n;

                function g(e) {
                    if ("string" == typeof e) return g.fromString(e);
                    if (i.isBuffer(e)) return g.fromBuffer(e);
                    if ("object" === (void 0 === e ? "undefined" : a(e)) && u.isBigInteger(e.d)) return g(e.d);
                    if (!u.isBigInteger(e)) throw new TypeError("Invalid private key");

                    function t() {
                        var t = o();
                        return t = i.concat([new i([128]), t]), d.checkEncode(t, "sha256x2")
                    }
                    var r = void 0;

                    function o() {
                        return e.toBuffer(32)
                    }
                    return {
                        d: e,
                        toWif: t,
                        toString: function() {
                            return t()
                        },
                        toPublic: function() {
                            if (r) return r;
                            var t = h.G.multiply(e);
                            return r = p.fromPoint(t)
                        },
                        toBuffer: o,
                        getSharedSecret: function(t) {
                            var e = (t = p(t)).toUncompressed().toBuffer(),
                                r = s.fromAffine(h, u.fromBuffer(e.slice(1, 33)), u.fromBuffer(e.slice(33, 65))),
                                i = o(),
                                n = r.multiply(u.fromBuffer(i)).affineX.toBuffer({
                                    size: 32
                                });
                            return c.sha512(n)
                        },
                        getChildKey: function(t) {
                            return g(n("sha256").update(o()).update(t).digest())
                        }
                    }
                }
                function r(t) {
                    l.equal(void 0 === t ? "undefined" : a(t), "string", "privateStr");
                    var e = t.match(/^PVT_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
                    if (null === e) {
                        var r = d.checkDecode(t, "sha256x2"),
                            i = r.readUInt8(0);
                        l.equal(128, i, "Expected version 128, instead got " + i);
                        return {
                            privateKey: g.fromBuffer(r.slice(1)),
                            format: "WIF",
                            keyType: "K1"
                        }
                    }
                    l(3 === e.length, "Expecting private key like: PVT_K1_base58privateKey..");
                    var n = f(e, 3),
                        o = n[1],
                        s = n[2];
                    return l.equal(o, "K1", "K1 private key expected"), {
                        privateKey: g.fromBuffer(d.checkDecode(s, o)),
                        format: "PVT",
                        keyType: o
                    }
                }(b.exports = g).fromHex = function(t) {
                    return g.fromBuffer(new i(t, "hex"))
                }, g.fromBuffer = function(t) {
                    if (!i.isBuffer(t)) throw new Error("Expecting parameter to be a Buffer type");
                    if (33 === t.length && 1 === t[32] && (t = t.slice(0, - 1)), 32 !== t.length) throw new Error("Expecting 32 bytes, instead got " + t.length);
                    return g(u.fromBuffer(t))
                }, g.fromSeed = function(t) {
                    if ("string" != typeof t) throw new Error("seed must be of type string");
                    return g.fromBuffer(c.sha256(t))
                }, g.isWif = function(t) {
                    try {
                        return l("WIF" === r(t).format), !0
                    } catch (t) {
                        return !1
                    }
                }, g.isValid = function(t) {
                    try {
                        return g(t), !0
                    } catch (t) {
                        return !1
                    }
                }, g.fromWif = function(t) {
                    return console.log("PrivateKey.fromWif is deprecated, please use PrivateKey.fromString"), g.fromString(t)
                }, g.fromString = function(t) {
                    return r(t).privateKey
                }, g.randomKey = function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    return g.initialize().then(function() {
                        return g.fromBuffer(d.random32ByteBuffer({
                            cpuEntropyBits: t
                        }))
                    })
                };
                var o = !(g.unsafeRandomKey = function() {
                    return Promise.resolve(g.fromBuffer(d.random32ByteBuffer({
                        safe: !1
                    })))
                });
                g.initialize = e(function() {
                    o || (function() {
                        var t = g(c.sha256("")),
                            e = "key comparison test failed on a known private key";
                        l.equal(t.toWif(), "5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss", e), l.equal(t.toString(), "5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss", e);
                        var r = t.toPublic();
                        l.equal(r.toString(), "EOS859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM", "pubkey string comparison test failed on a known public key"), y(function() {
                            return g.fromString(t.toWif())
                        }, "converting known wif from string"), y(function() {
                            return g.fromString(t.toString())
                        }, "converting known pvt from string"), y(function() {
                            return p.fromString(r.toString())
                        }, "converting known public key from string"), !0
                    }(), d.addEntropy.apply(d, function(t) {
                        if (Array.isArray(t)) {
                            for (var e = 0, r = Array(t.length); e < t.length; e++) r[e] = t[e];
                            return r
                        }
                        return Array.from(t)
                    }(d.cpuEntropy())), l(128 <= d.entropyCount(), "insufficient entropy"), o = !0)
                });
                var y = function(t, e) {
                    try {
                        t()
                    } catch (t) {
                        throw t.message = e + " ==> " + t.message, t
                    }
                }
            }).call(this, v("buffer").Buffer)
        }, {
            "./hash": 7,
            "./key_public": 10,
            "./key_utils": 11,
            "./promise-async": 12,
            assert: 14,
            bigi: 19,
            buffer: 40,
            "create-hash": 44,
            ecurve: 51
        }],
        10: [function(t, e, r) {
            (function(s) {
                "use strict";
                var f = function(t, e) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return function(t, e) {
                        var r = [],
                            i = !0,
                            n = !1,
                            o = void 0;
                        try {
                            for (var s, f = t[Symbol.iterator](); !(i = (s = f.next()).done) && (r.push(s.value), !e || r.length !== e); i = !0);
                        } catch (t) {
                            n = !0, o = t
                        } finally {
                            try {
                                !i && f.
                                return &&f.
                                return ()
                            } finally {
                                if (n) throw o
                            }
                        }
                        return r
                    }(t, e);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }, a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                        return typeof t
                    } : function(t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    }, h = t("assert"),
                    r = t("ecurve"),
                    u = t("bigi"),
                    l = r.getCurveByName("secp256k1"),
                    c = t("./hash"),
                    p = t("./key_utils"),
                    d = l.G,
                    g = l.n;

                function y(n) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "EOS";
                    if ("string" == typeof n) {
                        var e = y.fromString(n, t);
                        return h(null != e, "Invalid public key"), e
                    }
                    if (s.isBuffer(n)) return y.fromBuffer(n);
                    if ("object" === (void 0 === n ? "undefined" : a(n)) && n.Q) return y(n.Q);

                    function o() {
                        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : n.compressed;
                        return n.getEncoded(t)
                    }
                    h.equal(void 0 === n ? "undefined" : a(n), "object", "Invalid public key"), h.equal(a(n.compressed), "boolean", "Invalid public key");
                    return {
                        Q: n,
                        toString: function() {
                            return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "EOS") + p.checkEncode(o())
                        },
                        toUncompressed: function() {
                            var t = n.getEncoded(!1),
                                e = r.Point.decodeFrom(l, t);
                            return y.fromPoint(e)
                        },
                        toBuffer: o,
                        child: function(t) {
                            console.error("Deprecated warning: PublicKey.child"), h(s.isBuffer(t), "Buffer required: offset"), h.equal(t.length, 32, "offset length"), t = s.concat([o(), t]), t = c.sha256(t);
                            var e = u.fromBuffer(t);
                            if (0 <= e.compareTo(g)) throw new Error("Child offset went out of bounds, try again");
                            var r = d.multiply(e),
                                i = n.add(r);
                            if (l.isInfinity(i)) throw new Error("Child offset derived to an invalid key, try again");
                            return y.fromPoint(i)
                        },
                        toHex: function() {
                            return o().toString("hex")
                        }
                    }
                }(e.exports = y).isValid = function(t) {
                    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "EOS";
                    try {
                        return y(t, e), !0
                    } catch (t) {
                        return !1
                    }
                }, y.fromBinary = function(t) {
                    return y.fromBuffer(new s(t, "binary"))
                }, y.fromBuffer = function(t) {
                    return y(r.Point.decodeFrom(l, t))
                }, y.fromPoint = function(t) {
                    return y(t)
                }, y.fromString = function(t) {
                    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "EOS";
                    try {
                        return y.fromStringOrThrow(t, e)
                    } catch (t) {
                        return null
                    }
                }, y.fromStringOrThrow = function(t) {
                    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "EOS";
                    h.equal(void 0 === t ? "undefined" : a(t), "string", "public_key");
                    var r = t.match(/^PUB_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
                    if (null === r) return new RegExp("^" + e).test(t) && (t = t.substring(e.length)), y.fromBuffer(p.checkDecode(t));
                    h(3 === r.length, "Expecting public key like: PUB_K1_base58pubkey..");
                    var i = f(r, 3),
                        n = i[1],
                        o = i[2];
                    return h.equal(n, "K1", "K1 private key expected"), y.fromBuffer(p.checkDecode(o, n))
                }, y.fromHex = function(t) {
                    return y.fromBuffer(new s(t, "hex"))
                }, y.fromStringHex = function(t) {
                    return y.fromString(new s(t, "hex"))
                }
            }).call(this, t("buffer").Buffer)
        }, {
            "./hash": 7,
            "./key_utils": 11,
            assert: 14,
            bigi: 19,
            buffer: 40,
            ecurve: 51
        }],
        11: [function(t, e, r) {
            (function(f) {
                "use strict";
                var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                        return typeof t
                    } : function(t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    }, a = t("bs58"),
                    l = t("assert"),
                    h = t("randombytes"),
                    u = t("./hash");
                e.exports = {
                    random32ByteBuffer: function() {
                        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, e = t.cpuEntropyBits,
                            r = void 0 === e ? 0 : e,
                            i = t.safe,
                            n = void 0 === i || i;
                        l.equal(void 0 === r ? "undefined" : s(r), "number", "cpuEntropyBits"), l.equal(void 0 === n ? "undefined" : s(n), "boolean", "boolean"), n && l(128 <= p, "Call initialize() to add entropy");
                        var o = [];
                        return o.push(h(32)), o.push(f.from(g(r))), o.push(d), o.push(function() {
                            var e = Array(h(101)).join();
                            try {
                                e += (new Date).toString() + " " + window.screen.height + " " + window.screen.width + " " + window.screen.colorDepth + "  " + window.screen.availHeight + " " + window.screen.availWidth + " " + window.screen.pixelDepth + navigator.language + " " + window.location + " " + window.history.length;
                                for (var t, r = 0; r < navigator.mimeTypes.length; r++) t = navigator.mimeTypes[r], e += t.description + " " + t.type + " " + t.suffixes + " "
                            } catch (t) {
                                e += u.sha256((new Date).toString())
                            }
                            for (var i = new f(e), n = e += i.toString("binary") + " " + (new Date).toString(), o = Date.now(); Date.now() - o < 25;) n = u.sha256(n);
                            return n
                        }()), u.sha256(f.concat(o))
                    },
                    addEntropy: function() {
                        l.equal(d.length, 101, "externalEntropyArray");
                        for (var t = arguments.length, e = Array(t), r = 0; r < t; r++) e[r] = arguments[r];
                        p += e.length;
                        var i = !0,
                            n = !1,
                            o = void 0;
                        try {
                            for (var s, f = e[Symbol.iterator](); !(i = (s = f.next()).done); i = !0) {
                                var a = s.value,
                                    h = c++ % 101,
                                    u = d[h] += a;
                                9007199254740991 < u && (d[h] = 0)
                            }
                        } catch (t) {
                            n = !0, o = t
                        } finally {
                            try {
                                !i && f.
                                return &&f.
                                return ()
                            } finally {
                                if (n) throw o
                            }
                        }
                    },
                    cpuEntropy: g,
                    entropyCount: function() {
                        return p
                    },
                    checkDecode: function(t) {
                        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
                        l(null != t, "private key expected");
                        var r = new f(a.decode(t)),
                            i = r.slice(-4),
                            n = r.slice(0, - 4),
                            o = void 0;
                        if ("sha256x2" === e) o = u.sha256(u.sha256(n)).slice(0, 4);
                        else {
                            var s = [n];
                            e && s.push(f.from(e)), o = u.ripemd160(f.concat(s)).slice(0, 4)
                        }
                        if (i.toString() !== o.toString()) throw new Error("Invalid checksum, " + i.toString("hex") + " != " + o.toString("hex"));
                        return n
                    },
                    checkEncode: function(t) {
                        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null; {
                            if (l(f.isBuffer(t), "expecting keyBuffer<Buffer>"), "sha256x2" === e) {
                                var r = u.sha256(u.sha256(t)).slice(0, 4);
                                return a.encode(f.concat([t, r]))
                            }
                            var i = [t];
                            e && i.push(f.from(e));
                            var n = u.ripemd160(f.concat(i)).slice(0, 4);
                            return a.encode(f.concat([t, n]))
                        }
                    }
                };
                var c = 0,
                    p = 0,
                    d = h(101);

                function g() {
                    for (var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 128, e = [], r = null, i = 0; e.length < t;) {
                        var n = y();
                        if (null != r) {
                            var o = n - r;
                            if (Math.abs(o) < 1) {
                                i++;
                                continue
                            }
                            var s = Math.floor(v(Math.abs(o)) + 1);
                            if (s < 4) {
                                s < 2 && i++;
                                continue
                            }
                            e.push(o)
                        }
                        r = n
                    }
                    if (10 < i) {
                        var f = Number(i / t * 100).toFixed(2);
                        console.warn("WARN: " + f + "% low CPU entropy re-sampled")
                    }
                    return e
                }
                function y() {
                    for (var t = Date.now(), e = 0, r = 0; Date.now() < t + 7 + 1;) r = Math.sin(Math.sqrt(Math.log(++e + r)));
                    return e
                }
                var v = function(t) {
                    return Math.log(t) / Math.LN2
                }
            }).call(this, t("buffer").Buffer)
        }, {
            "./hash": 7,
            assert: 14,
            bs58: 38,
            buffer: 40,
            randombytes: 66
        }],
        12: [function(t, e, r) {
            "use strict";
            e.exports = function(i) {
                return function() {
                    for (var t = arguments.length, r = Array(t), e = 0; e < t; e++) r[e] = arguments[e];
                    return new Promise(function(t, e) {
                        setTimeout(function() {
                            try {
                                t(i.apply(void 0, r))
                            } catch (t) {
                                e(t)
                            }
                        })
                    })
                }
            }
        }, {}],
        13: [function(t, e, r) {
            (function(u) {
                "use strict";
                var o = function(t, e) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return function(t, e) {
                        var r = [],
                            i = !0,
                            n = !1,
                            o = void 0;
                        try {
                            for (var s, f = t[Symbol.iterator](); !(i = (s = f.next()).done) && (r.push(s.value), !e || r.length !== e); i = !0);
                        } catch (t) {
                            n = !0, o = t
                        } finally {
                            try {
                                !i && f.
                                return &&f.
                                return ()
                            } finally {
                                if (n) throw o
                            }
                        }
                        return r
                    }(t, e);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }, s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                        return typeof t
                    } : function(t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    }, l = t("./ecdsa"),
                    h = t("./hash"),
                    c = t("ecurve").getCurveByName("secp256k1"),
                    p = t("assert"),
                    d = t("bigi"),
                    g = t("./key_utils"),
                    y = t("./key_public"),
                    v = t("./key_private");

                function b(o, s, f) {
                    function r(t, e) {
                        var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "utf8";
                        return "string" == typeof t && (t = u.from(t, r)), p(u.isBuffer(t), "data is a required String or Buffer"), i(t = h.sha256(t), e)
                    }
                    function i(t, e) {
                        var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "hex";
                        if ("string" == typeof t && (t = u.from(t, r)), 32 !== t.length || !u.isBuffer(t)) throw new Error("dataSha256: 32 bytes required");
                        var i = y(e);
                        return p(i, "pubkey required"), l.verify(c, t, {
                            r: o,
                            s: s
                        }, i.Q)
                    }
                    function t(t) {
                        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "utf8";
                        return "string" == typeof t && (t = u.from(t, e)), p(u.isBuffer(t), "data is a required String or Buffer"), n(t = h.sha256(t))
                    }
                    function n(t) {
                        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "hex";
                        if ("string" == typeof t && (t = u.from(t, e)), 32 !== t.length || !u.isBuffer(t)) throw new Error("dataSha256: 32 byte String or buffer requred");
                        var r = d.fromBuffer(t),
                            i = f;
                        i -= 27, i &= 3;
                        var n = l.recoverPubKey(c, r, {
                            r: o,
                            s: s,
                            i: f
                        }, i);
                        return y.fromPoint(n)
                    }
                    function e() {
                        var t;
                        return (t = new u(65)).writeUInt8(f, 0), o.toBuffer(32).copy(t, 1), s.toBuffer(32).copy(t, 33), t
                    }
                    p.equal(null != o, !0, "Missing parameter"), p.equal(null != s, !0, "Missing parameter"), p.equal(null != f, !0, "Missing parameter");
                    var a = void 0;
                    return {
                        r: o,
                        s: s,
                        i: f,
                        toBuffer: e,
                        verify: r,
                        verifyHash: i,
                        verifyHex: function(t, e) {
                            return console.log('Deprecated: use verify(data, pubkey, "hex")'), r(u.from(t, "hex"), e)
                        },
                        recover: t,
                        recoverHash: n,
                        toHex: function() {
                            return e().toString("hex")
                        },
                        toString: function() {
                            return a || (a = "SIG_K1_" + g.checkEncode(e(), "K1"))
                        },
                        verifyBuffer: function() {
                            return console.log("Deprecated: use signature.verify instead (same arguments)"), r.apply(void 0, arguments)
                        },
                        recoverPublicKey: function() {
                            return console.log("Deprecated: use signature.recover instead (same arguments)"), t.apply(void 0, arguments)
                        },
                        recoverPublicKeyFromBuffer: function() {
                            return console.log("Deprecated: use signature.recoverHash instead (same arguments)"), n.apply(void 0, arguments)
                        }
                    }
                }(e.exports = b).sign = function(t, e) {
                    var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "utf8";
                    return "string" == typeof t && (t = u.from(t, r)), p(u.isBuffer(t), "data is a required String or Buffer"), t = h.sha256(t), b.signHash(t, e)
                }, b.signHash = function(t, e) {
                    var r, i, n, o, s, f, a, h = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "hex";
                    if ("string" == typeof t && (t = u.from(t, h)), 32 !== t.length || !u.isBuffer(t)) throw new Error("dataSha256: 32 byte buffer requred");
                    for (e = v(e), p(e, "privateKey required"), o = null, a = 0, i = d.fromBuffer(t);;) {
                        if (f = (r = (n = l.sign(c, t, e.d, a++)).toDER())[5 + (s = r[3])], 32 === s && 32 === f) {
                            o = l.calcPubKeyRecoveryParam(c, i, n, e.toPublic().Q), o += 4, o += 27;
                            break
                        }
                        a % 10 == 0 && console.log("WARN: " + a + " attempts to find canonical signature")
                    }
                    return b(n.r, n.s, o)
                }, b.fromBuffer = function(t) {
                    var e;
                    return p(u.isBuffer(t), "Buffer is required"), p.equal(t.length, 65, "Invalid signature length"), e = t.readUInt8(0), p.equal(e - 27, e - 27 & 7, "Invalid signature parameter"), b(d.fromBuffer(t.slice(1, 33)), d.fromBuffer(t.slice(33)), e)
                }, b.fromHex = function(t) {
                    return b.fromBuffer(u.from(t, "hex"))
                }, b.fromString = function(t) {
                    try {
                        return b.fromStringOrThrow(t)
                    } catch (t) {
                        return null
                    }
                }, b.fromStringOrThrow = function(t) {
                    p.equal(void 0 === t ? "undefined" : s(t), "string", "signature");
                    var e = t.match(/^SIG_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
                    p(null != e && 3 === e.length, "Expecting signature like: SIG_K1_base58signature..");
                    var r = o(e, 3),
                        i = r[1],
                        n = r[2];
                    return p.equal(i, "K1", "K1 signature expected"), b.fromBuffer(g.checkDecode(n, i))
                }, b.from = function(t) {
                    var e = t ? t.r && t.s && t.i ? t : "string" == typeof t && 130 === t.length ? b.fromHex(t) : "string" == typeof t && 130 !== t.length ? b.fromStringOrThrow(t) : u.isBuffer(t) ? b.fromBuffer(t) : null : t;
                    if (!e) throw new TypeError("signature should be a hex string or buffer");
                    return e
                }
            }).call(this, t("buffer").Buffer)
        }, {
            "./ecdsa": 4,
            "./hash": 7,
            "./key_private": 9,
            "./key_public": 10,
            "./key_utils": 11,
            assert: 14,
            bigi: 19,
            buffer: 40,
            ecurve: 51
        }],
        14: [function(_, E, t) {
            (function(e) {
                "use strict";

                function o(t, e) {
                    if (t === e) return 0;
                    for (var r = t.length, i = e.length, n = 0, o = Math.min(r, i); n < o; ++n) if (t[n] !== e[n]) {
                        r = t[n], i = e[n];
                        break
                    }
                    return r < i ? -1 : i < r ? 1 : 0
                }
                function s(t) {
                    return e.Buffer && "function" == typeof e.Buffer.isBuffer ? e.Buffer.isBuffer(t) : !(null == t || !t._isBuffer)
                }
                var u = _("util/"),
                    i = Object.prototype.hasOwnProperty,
                    l = Array.prototype.slice,
                    r = "foo" === function() {}.name;

                function f(t) {
                    return Object.prototype.toString.call(t)
                }
                function a(t) {
                    return !s(t) && ("function" == typeof e.ArrayBuffer && ("function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : !! t && (t instanceof DataView || !! (t.buffer && t.buffer instanceof ArrayBuffer))))
                }
                var h = E.exports = t,
                    n = /\s*function\s+([^\(\s]*)\s*/;

                function c(t) {
                    if (u.isFunction(t)) {
                        if (r) return t.name;
                        var e = t.toString().match(n);
                        return e && e[1]
                    }
                }
                function p(t, e) {
                    return "string" == typeof t ? t.length < e ? t : t.slice(0, e) : t
                }
                function d(t) {
                    if (r || !u.isFunction(t)) return u.inspect(t);
                    var e = c(t);
                    return "[Function" + (e ? ": " + e : "") + "]"
                }
                function g(t, e, r, i, n) {
                    throw new h.AssertionError({
                        message: r,
                        actual: t,
                        expected: e,
                        operator: i,
                        stackStartFunction: n
                    })
                }
                function t(t, e) {
                    t || g(t, !0, e, "==", h.ok)
                }
                function y(t, e, r, i) {
                    if (t === e) return !0;
                    if (s(t) && s(e)) return 0 === o(t, e);
                    if (u.isDate(t) && u.isDate(e)) return t.getTime() === e.getTime();
                    if (u.isRegExp(t) && u.isRegExp(e)) return t.source === e.source && t.global === e.global && t.multiline === e.multiline && t.lastIndex === e.lastIndex && t.ignoreCase === e.ignoreCase;
                    if (null !== t && "object" == typeof t || null !== e && "object" == typeof e) {
                        if (a(t) && a(e) && f(t) === f(e) && !(t instanceof Float32Array || t instanceof Float64Array)) return 0 === o(new Uint8Array(t.buffer), new Uint8Array(e.buffer));
                        if (s(t) !== s(e)) return !1;
                        var n = (i = i || {
                            actual: [],
                            expected: []
                        }).actual.indexOf(t);
                        return -1 !== n && n === i.expected.indexOf(e) || (i.actual.push(t), i.expected.push(e), function(t, e, r, i) {
                            if (null == t || null == e) return !1;
                            if (u.isPrimitive(t) || u.isPrimitive(e)) return t === e;
                            if (r && Object.getPrototypeOf(t) !== Object.getPrototypeOf(e)) return !1;
                            var n = v(t),
                                o = v(e);
                            if (n && !o || !n && o) return !1;
                            if (n) return t = l.call(t), e = l.call(e), y(t, e, r);
                            var s, f, a = m(t),
                                h = m(e);
                            if (a.length !== h.length) return !1;
                            for (a.sort(), h.sort(), f = a.length - 1; 0 <= f; f--) if (a[f] !== h[f]) return !1;
                            for (f = a.length - 1; 0 <= f; f--) if (s = a[f], !y(t[s], e[s], r, i)) return !1;
                            return !0
                        }(t, e, r, i))
                    }
                    return r ? t === e : t == e
                }
                function v(t) {
                    return "[object Arguments]" == Object.prototype.toString.call(t)
                }
                function b(t, e) {
                    if (!t || !e) return !1;
                    if ("[object RegExp]" == Object.prototype.toString.call(e)) return e.test(t);
                    try {
                        if (t instanceof e) return !0
                    } catch (t) {}
                    return !Error.isPrototypeOf(e) && !0 === e.call({}, t)
                }
                function w(t, e, r, i) {
                    var n;
                    if ("function" != typeof e) throw new TypeError('"block" argument must be a function');
                    "string" == typeof r && (i = r, r = null), n = function(t) {
                        var e;
                        try {
                            t()
                        } catch (t) {
                            e = t
                        }
                        return e
                    }(e), i = (r && r.name ? " (" + r.name + ")." : ".") + (i ? " " + i : "."), t && !n && g(n, r, "Missing expected exception" + i);
                    var o = "string" == typeof i,
                        s = !t && n && !r;
                    if ((!t && u.isError(n) && o && b(n, r) || s) && g(n, r, "Got unwanted exception" + i), t && n && r && !b(n, r) || !t && n) throw n
                }
                h.AssertionError = function(t) {
                    var e;
                    this.name = "AssertionError", this.actual = t.actual, this.expected = t.expected, this.operator = t.operator, t.message ? (this.message = t.message, this.generatedMessage = !1) : (this.message = p(d((e = this).actual), 128) + " " + e.operator + " " + p(d(e.expected), 128), this.generatedMessage = !0);
                    var r = t.stackStartFunction || g;
                    if (Error.captureStackTrace) Error.captureStackTrace(this, r);
                    else {
                        var i = new Error;
                        if (i.stack) {
                            var n = i.stack,
                                o = c(r),
                                s = n.indexOf("\n" + o);
                            if (0 <= s) {
                                var f = n.indexOf("\n", s + 1);
                                n = n.substring(f + 1)
                            }
                            this.stack = n
                        }
                    }
                }, u.inherits(h.AssertionError, Error), h.fail = g, h.ok = t, h.equal = function(t, e, r) {
                    t != e && g(t, e, r, "==", h.equal)
                }, h.notEqual = function(t, e, r) {
                    t == e && g(t, e, r, "!=", h.notEqual)
                }, h.deepEqual = function(t, e, r) {
                    y(t, e, !1) || g(t, e, r, "deepEqual", h.deepEqual)
                }, h.deepStrictEqual = function(t, e, r) {
                    y(t, e, !0) || g(t, e, r, "deepStrictEqual", h.deepStrictEqual)
                }, h.notDeepEqual = function(t, e, r) {
                    y(t, e, !1) && g(t, e, r, "notDeepEqual", h.notDeepEqual)
                }, h.notDeepStrictEqual = function t(e, r, i) {
                    y(e, r, !0) && g(e, r, i, "notDeepStrictEqual", t)
                }, h.strictEqual = function(t, e, r) {
                    t !== e && g(t, e, r, "===", h.strictEqual)
                }, h.notStrictEqual = function(t, e, r) {
                    t === e && g(t, e, r, "!==", h.notStrictEqual)
                }, h.throws = function(t, e, r) {
                    w(!0, t, e, r)
                }, h.doesNotThrow = function(t, e, r) {
                    w(!1, t, e, r)
                }, h.ifError = function(t) {
                    if (t) throw t
                };
                var m = Object.keys || function(t) {
                        var e = [];
                        for (var r in t) i.call(t, r) && e.push(r);
                        return e
                    }
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "util/": 95
        }],
        15: [function(t, e, r) {
            var l = t("safe-buffer").Buffer;
            e.exports = function(a) {
                for (var f = {}, h = a.length, u = a.charAt(0), t = 0; t < a.length; t++) {
                    var e = a.charAt(t);
                    if (void 0 !== f[e]) throw new TypeError(e + " is ambiguous");
                    f[e] = t
                }
                function r(t) {
                    if (0 === t.length) return l.allocUnsafe(0);
                    for (var e = [0], r = 0; r < t.length; r++) {
                        var i = f[t[r]];
                        if (void 0 === i) return;
                        for (var n = 0, o = i; n < e.length; ++n) o += e[n] * h, e[n] = 255 & o, o >>= 8;
                        for (; 0 < o;) e.push(255 & o), o >>= 8
                    }
                    for (var s = 0; t[s] === u && s < t.length - 1; ++s) e.push(0);
                    return l.from(e.reverse())
                }
                return {
                    encode: function(t) {
                        if (0 === t.length) return "";
                        for (var e = [0], r = 0; r < t.length; ++r) {
                            for (var i = 0, n = t[r]; i < e.length; ++i) n += e[i] << 8, e[i] = n % h, n = n / h | 0;
                            for (; 0 < n;) e.push(n % h), n = n / h | 0
                        }
                        for (var o = "", s = 0; 0 === t[s] && s < t.length - 1; ++s) o += a[0];
                        for (var f = e.length - 1; 0 <= f; --f) o += a[e[f]];
                        return o
                    },
                    decodeUnsafe: r,
                    decode: function(t) {
                        var e = r(t);
                        if (e) return e;
                        throw new Error("Non-base" + h + " character")
                    }
                }
            }
        }, {
            "safe-buffer": 81
        }],
        16: [function(t, e, r) {
            "use strict";
            r.byteLength = function(t) {
                return 3 * t.length / 4 - l(t)
            }, r.toByteArray = function(t) {
                var e, r, i, n, o, s = t.length;
                n = l(t), o = new u(3 * s / 4 - n), r = 0 < n ? s - 4 : s;
                var f = 0;
                for (e = 0; e < r; e += 4) i = h[t.charCodeAt(e)] << 18 | h[t.charCodeAt(e + 1)] << 12 | h[t.charCodeAt(e + 2)] << 6 | h[t.charCodeAt(e + 3)], o[f++] = i >> 16 & 255, o[f++] = i >> 8 & 255, o[f++] = 255 & i;
                2 === n ? (i = h[t.charCodeAt(e)] << 2 | h[t.charCodeAt(e + 1)] >> 4, o[f++] = 255 & i) : 1 === n && (i = h[t.charCodeAt(e)] << 10 | h[t.charCodeAt(e + 1)] << 4 | h[t.charCodeAt(e + 2)] >> 2, o[f++] = i >> 8 & 255, o[f++] = 255 & i);
                return o
            }, r.fromByteArray = function(t) {
                for (var e, r = t.length, i = r % 3, n = "", o = [], s = 0, f = r - i; s < f; s += 16383) o.push(c(t, s, f < s + 16383 ? f : s + 16383));
                1 === i ? (e = t[r - 1], n += a[e >> 2], n += a[e << 4 & 63], n += "==") : 2 === i && (e = (t[r - 2] << 8) + t[r - 1], n += a[e >> 10], n += a[e >> 4 & 63], n += a[e << 2 & 63], n += "=");
                return o.push(n), o.join("")
            };
            for (var a = [], h = [], u = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, o = i.length; n < o; ++n) a[n] = i[n], h[i.charCodeAt(n)] = n;

            function l(t) {
                var e = t.length;
                if (0 < e % 4) throw new Error("Invalid string. Length must be a multiple of 4");
                return "=" === t[e - 2] ? 2 : "=" === t[e - 1] ? 1 : 0
            }
            function c(t, e, r) {
                for (var i, n, o = [], s = e; s < r; s += 3) i = (t[s] << 16) + (t[s + 1] << 8) + t[s + 2], o.push(a[(n = i) >> 18 & 63] + a[n >> 12 & 63] + a[n >> 6 & 63] + a[63 & n]);
                return o.join("")
            }
            h["-".charCodeAt(0)] = 62, h["_".charCodeAt(0)] = 63
        }, {}],
        17: [function(t, e, r) {
            function m(t, e, r) {
                if (!(this instanceof m)) return new m(t, e, r);
                null != t && ("number" == typeof t ? this.fromNumber(t, e, r) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
            }
            var i = m.prototype;
            i.__bigi = t("../package.json").version, m.isBigInteger = function(t, e) {
                return t && t.__bigi && (!e || t.__bigi === i.__bigi)
            }, m.prototype.am = function(t, e, r, i, n, o) {
                for (; 0 <= --o;) {
                    var s = e * this[t++] + r[i] + n;
                    n = Math.floor(s / 67108864), r[i++] = 67108863 & s
                }
                return n
            }, m.prototype.DB = 26, m.prototype.DM = 67108863;
            var n = m.prototype.DV = 1 << 26;
            m.prototype.FV = Math.pow(2, 52), m.prototype.F1 = 26, m.prototype.F2 = 0;
            var o, s, f = "0123456789abcdefghijklmnopqrstuvwxyz",
                a = new Array;
            for (o = "0".charCodeAt(0), s = 0; s <= 9; ++s) a[o++] = s;
            for (o = "a".charCodeAt(0), s = 10; s < 36; ++s) a[o++] = s;
            for (o = "A".charCodeAt(0), s = 10; s < 36; ++s) a[o++] = s;

            function h(t) {
                return f.charAt(t)
            }
            function u(t, e) {
                var r = a[t.charCodeAt(e)];
                return null == r ? -1 : r
            }
            function y(t) {
                var e = new m;
                return e.fromInt(t), e
            }
            function _(t) {
                var e, r = 1;
                return 0 != (e = t >>> 16) && (t = e, r += 16), 0 != (e = t >> 8) && (t = e, r += 8), 0 != (e = t >> 4) && (t = e, r += 4), 0 != (e = t >> 2) && (t = e, r += 2), 0 != (e = t >> 1) && (t = e, r += 1), r
            }
            function v(t) {
                this.m = t
            }
            function b(t) {
                this.m = t, this.mp = t.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << t.DB - 15) - 1, this.mt2 = 2 * t.t
            }
            function l(t, e) {
                return t & e
            }
            function c(t, e) {
                return t | e
            }
            function p(t, e) {
                return t ^ e
            }
            function d(t, e) {
                return t & ~e
            }
            function g(t) {
                if (0 == t) return -1;
                var e = 0;
                return 0 == (65535 & t) && (t >>= 16, e += 16), 0 == (255 & t) && (t >>= 8, e += 8), 0 == (15 & t) && (t >>= 4, e += 4), 0 == (3 & t) && (t >>= 2, e += 2), 0 == (1 & t) && ++e, e
            }
            function w(t) {
                for (var e = 0; 0 != t;) t &= t - 1, ++e;
                return e
            }
            function E() {}
            function S(t) {
                return t
            }
            function B(t) {
                this.r2 = new m, this.q3 = new m, m.ONE.dlShiftTo(2 * t.t, this.r2), this.mu = this.r2.divide(t), this.m = t
            }
            v.prototype.convert = function(t) {
                return t.s < 0 || 0 <= t.compareTo(this.m) ? t.mod(this.m) : t
            }, v.prototype.revert = function(t) {
                return t
            }, v.prototype.reduce = function(t) {
                t.divRemTo(this.m, null, t)
            }, v.prototype.mulTo = function(t, e, r) {
                t.multiplyTo(e, r), this.reduce(r)
            }, v.prototype.sqrTo = function(t, e) {
                t.squareTo(e), this.reduce(e)
            }, b.prototype.convert = function(t) {
                var e = new m;
                return t.abs().dlShiftTo(this.m.t, e), e.divRemTo(this.m, null, e), t.s < 0 && 0 < e.compareTo(m.ZERO) && this.m.subTo(e, e), e
            }, b.prototype.revert = function(t) {
                var e = new m;
                return t.copyTo(e), this.reduce(e), e
            }, b.prototype.reduce = function(t) {
                for (; t.t <= this.mt2;) t[t.t++] = 0;
                for (var e = 0; e < this.m.t; ++e) {
                    var r = 32767 & t[e],
                        i = r * this.mpl + ((r * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
                    for (t[r = e + this.m.t] += this.m.am(0, i, t, e, 0, this.m.t); t[r] >= t.DV;) t[r] -= t.DV, t[++r]++
                }
                t.clamp(), t.drShiftTo(this.m.t, t), 0 <= t.compareTo(this.m) && t.subTo(this.m, t)
            }, b.prototype.mulTo = function(t, e, r) {
                t.multiplyTo(e, r), this.reduce(r)
            }, b.prototype.sqrTo = function(t, e) {
                t.squareTo(e), this.reduce(e)
            }, i.copyTo = function(t) {
                for (var e = this.t - 1; 0 <= e; --e) t[e] = this[e];
                t.t = this.t, t.s = this.s
            }, i.fromInt = function(t) {
                this.t = 1, this.s = t < 0 ? -1 : 0, 0 < t ? this[0] = t : t < -1 ? this[0] = t + n : this.t = 0
            }, i.fromString = function(t, e) {
                var r, i = this;
                if (16 == e) r = 4;
                else if (8 == e) r = 3;
                else if (256 == e) r = 8;
                else if (2 == e) r = 1;
                else if (32 == e) r = 5;
                else {
                    if (4 != e) return void i.fromRadix(t, e);
                    r = 2
                }
                i.t = 0, i.s = 0;
                for (var n = t.length, o = !1, s = 0; 0 <= --n;) {
                    var f = 8 == r ? 255 & t[n] : u(t, n);
                    f < 0 ? "-" == t.charAt(n) && (o = !0) : (o = !1, 0 == s ? i[i.t++] = f : s + r > i.DB ? (i[i.t - 1] |= (f & (1 << i.DB - s) - 1) << s, i[i.t++] = f >> i.DB - s) : i[i.t - 1] |= f << s, (s += r) >= i.DB && (s -= i.DB))
                }
                8 == r && 0 != (128 & t[0]) && (i.s = -1, 0 < s && (i[i.t - 1] |= (1 << i.DB - s) - 1 << s)), i.clamp(), o && m.ZERO.subTo(i, i)
            }, i.clamp = function() {
                for (var t = this.s & this.DM; 0 < this.t && this[this.t - 1] == t;)--this.t
            }, i.dlShiftTo = function(t, e) {
                var r;
                for (r = this.t - 1; 0 <= r; --r) e[r + t] = this[r];
                for (r = t - 1; 0 <= r; --r) e[r] = 0;
                e.t = this.t + t, e.s = this.s
            }, i.drShiftTo = function(t, e) {
                for (var r = t; r < this.t; ++r) e[r - t] = this[r];
                e.t = Math.max(this.t - t, 0), e.s = this.s
            }, i.lShiftTo = function(t, e) {
                var r, i = this,
                    n = t % i.DB,
                    o = i.DB - n,
                    s = (1 << o) - 1,
                    f = Math.floor(t / i.DB),
                    a = i.s << n & i.DM;
                for (r = i.t - 1; 0 <= r; --r) e[r + f + 1] = i[r] >> o | a, a = (i[r] & s) << n;
                for (r = f - 1; 0 <= r; --r) e[r] = 0;
                e[f] = a, e.t = i.t + f + 1, e.s = i.s, e.clamp()
            }, i.rShiftTo = function(t, e) {
                var r = this;
                e.s = r.s;
                var i = Math.floor(t / r.DB);
                if (i >= r.t) e.t = 0;
                else {
                    var n = t % r.DB,
                        o = r.DB - n,
                        s = (1 << n) - 1;
                    e[0] = r[i] >> n;
                    for (var f = i + 1; f < r.t; ++f) e[f - i - 1] |= (r[f] & s) << o, e[f - i] = r[f] >> n;
                    0 < n && (e[r.t - i - 1] |= (r.s & s) << o), e.t = r.t - i, e.clamp()
                }
            }, i.subTo = function(t, e) {
                for (var r = this, i = 0, n = 0, o = Math.min(t.t, r.t); i < o;) n += r[i] - t[i], e[i++] = n & r.DM, n >>= r.DB;
                if (t.t < r.t) {
                    for (n -= t.s; i < r.t;) n += r[i], e[i++] = n & r.DM, n >>= r.DB;
                    n += r.s
                } else {
                    for (n += r.s; i < t.t;) n -= t[i], e[i++] = n & r.DM, n >>= r.DB;
                    n -= t.s
                }
                e.s = n < 0 ? -1 : 0, n < -1 ? e[i++] = r.DV + n : 0 < n && (e[i++] = n), e.t = i, e.clamp()
            }, i.multiplyTo = function(t, e) {
                var r = this.abs(),
                    i = t.abs(),
                    n = r.t;
                for (e.t = n + i.t; 0 <= --n;) e[n] = 0;
                for (n = 0; n < i.t; ++n) e[n + r.t] = r.am(0, i[n], e, n, 0, r.t);
                e.s = 0, e.clamp(), this.s != t.s && m.ZERO.subTo(e, e)
            }, i.squareTo = function(t) {
                for (var e = this.abs(), r = t.t = 2 * e.t; 0 <= --r;) t[r] = 0;
                for (r = 0; r < e.t - 1; ++r) {
                    var i = e.am(r, e[r], t, 2 * r, 0, 1);
                    (t[r + e.t] += e.am(r + 1, 2 * e[r], t, 2 * r + 1, i, e.t - r - 1)) >= e.DV && (t[r + e.t] -= e.DV, t[r + e.t + 1] = 1)
                }
                0 < t.t && (t[t.t - 1] += e.am(r, e[r], t, 2 * r, 0, 1)), t.s = 0, t.clamp()
            }, i.divRemTo = function(t, e, r) {
                var i = this,
                    n = t.abs();
                if (!(n.t <= 0)) {
                    var o = i.abs();
                    if (o.t < n.t) return null != e && e.fromInt(0), void(null != r && i.copyTo(r));
                    null == r && (r = new m);
                    var s = new m,
                        f = i.s,
                        a = t.s,
                        h = i.DB - _(n[n.t - 1]);
                    0 < h ? (n.lShiftTo(h, s), o.lShiftTo(h, r)) : (n.copyTo(s), o.copyTo(r));
                    var u = s.t,
                        l = s[u - 1];
                    if (0 != l) {
                        var c = l * (1 << i.F1) + (1 < u ? s[u - 2] >> i.F2 : 0),
                            p = i.FV / c,
                            d = (1 << i.F1) / c,
                            g = 1 << i.F2,
                            y = r.t,
                            v = y - u,
                            b = null == e ? new m : e;
                        for (s.dlShiftTo(v, b), 0 <= r.compareTo(b) && (r[r.t++] = 1, r.subTo(b, r)), m.ONE.dlShiftTo(u, b), b.subTo(s, s); s.t < u;) s[s.t++] = 0;
                        for (; 0 <= --v;) {
                            var w = r[--y] == l ? i.DM : Math.floor(r[y] * p + (r[y - 1] + g) * d);
                            if ((r[y] += s.am(0, w, r, v, 0, u)) < w) for (s.dlShiftTo(v, b), r.subTo(b, r); r[y] < --w;) r.subTo(b, r)
                        }
                        null != e && (r.drShiftTo(u, e), f != a && m.ZERO.subTo(e, e)), r.t = u, r.clamp(), 0 < h && r.rShiftTo(h, r), f < 0 && m.ZERO.subTo(r, r)
                    }
                }
            }, i.invDigit = function() {
                if (this.t < 1) return 0;
                var t = this[0];
                if (0 == (1 & t)) return 0;
                var e = 3 & t;
                return 0 < (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) ? this.DV - e : -e
            }, i.isEven = function() {
                return 0 == (0 < this.t ? 1 & this[0] : this.s)
            }, i.exp = function(t, e) {
                if (4294967295 < t || t < 1) return m.ONE;
                var r = new m,
                    i = new m,
                    n = e.convert(this),
                    o = _(t) - 1;
                for (n.copyTo(r); 0 <= --o;) if (e.sqrTo(r, i), 0 < (t & 1 << o)) e.mulTo(i, n, r);
                else {
                    var s = r;
                    r = i, i = s
                }
                return e.revert(r)
            }, i.toString = function(t) {
                var e, r = this;
                if (r.s < 0) return "-" + r.negate().toString(t);
                if (16 == t) e = 4;
                else if (8 == t) e = 3;
                else if (2 == t) e = 1;
                else if (32 == t) e = 5;
                else {
                    if (4 != t) return r.toRadix(t);
                    e = 2
                }
                var i, n = (1 << e) - 1,
                    o = !1,
                    s = "",
                    f = r.t,
                    a = r.DB - f * r.DB % e;
                if (0 < f--) for (a < r.DB && 0 < (i = r[f] >> a) && (o = !0, s = h(i)); 0 <= f;) a < e ? (i = (r[f] & (1 << a) - 1) << e - a, i |= r[--f] >> (a += r.DB - e)) : (i = r[f] >> (a -= e) & n, a <= 0 && (a += r.DB, --f)), 0 < i && (o = !0), o && (s += h(i));
                return o ? s : "0"
            }, i.negate = function() {
                var t = new m;
                return m.ZERO.subTo(this, t), t
            }, i.abs = function() {
                return this.s < 0 ? this.negate() : this
            }, i.compareTo = function(t) {
                var e = this.s - t.s;
                if (0 != e) return e;
                var r = this.t;
                if (0 != (e = r - t.t)) return this.s < 0 ? -e : e;
                for (; 0 <= --r;) if (0 != (e = this[r] - t[r])) return e;
                return 0
            }, i.bitLength = function() {
                return this.t <= 0 ? 0 : this.DB * (this.t - 1) + _(this[this.t - 1] ^ this.s & this.DM)
            }, i.byteLength = function() {
                return this.bitLength() >> 3
            }, i.mod = function(t) {
                var e = new m;
                return this.abs().divRemTo(t, null, e), this.s < 0 && 0 < e.compareTo(m.ZERO) && t.subTo(e, e), e
            }, i.modPowInt = function(t, e) {
                var r;
                return r = t < 256 || e.isEven() ? new v(e) : new b(e), this.exp(t, r)
            }, E.prototype.convert = S, E.prototype.revert = S, E.prototype.mulTo = function(t, e, r) {
                t.multiplyTo(e, r)
            }, E.prototype.sqrTo = function(t, e) {
                t.squareTo(e)
            }, B.prototype.convert = function(t) {
                if (t.s < 0 || t.t > 2 * this.m.t) return t.mod(this.m);
                if (t.compareTo(this.m) < 0) return t;
                var e = new m;
                return t.copyTo(e), this.reduce(e), e
            }, B.prototype.revert = function(t) {
                return t
            }, B.prototype.reduce = function(t) {
                var e = this;
                for (t.drShiftTo(e.m.t - 1, e.r2), t.t > e.m.t + 1 && (t.t = e.m.t + 1, t.clamp()), e.mu.multiplyUpperTo(e.r2, e.m.t + 1, e.q3), e.m.multiplyLowerTo(e.q3, e.m.t + 1, e.r2); t.compareTo(e.r2) < 0;) t.dAddOffset(1, e.m.t + 1);
                for (t.subTo(e.r2, t); 0 <= t.compareTo(e.m);) t.subTo(e.m, t)
            }, B.prototype.mulTo = function(t, e, r) {
                t.multiplyTo(e, r), this.reduce(r)
            }, B.prototype.sqrTo = function(t, e) {
                t.squareTo(e), this.reduce(e)
            };
            var T = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997],
                I = (1 << 26) / T[T.length - 1];
            i.chunkSize = function(t) {
                return Math.floor(Math.LN2 * this.DB / Math.log(t))
            }, i.toRadix = function(t) {
                if (null == t && (t = 10), 0 == this.signum() || t < 2 || 36 < t) return "0";
                var e = this.chunkSize(t),
                    r = Math.pow(t, e),
                    i = y(r),
                    n = new m,
                    o = new m,
                    s = "";
                for (this.divRemTo(i, n, o); 0 < n.signum();) s = (r + o.intValue()).toString(t).substr(1) + s, n.divRemTo(i, n, o);
                return o.intValue().toString(t) + s
            }, i.fromRadix = function(t, e) {
                var r = this;
                r.fromInt(0), null == e && (e = 10);
                for (var i = r.chunkSize(e), n = Math.pow(e, i), o = !1, s = 0, f = 0, a = 0; a < t.length; ++a) {
                    var h = u(t, a);
                    h < 0 ? "-" == t.charAt(a) && 0 == r.signum() && (o = !0) : (f = e * f + h, ++s >= i && (r.dMultiply(n), r.dAddOffset(f, 0), f = s = 0))
                }
                0 < s && (r.dMultiply(Math.pow(e, s)), r.dAddOffset(f, 0)), o && m.ZERO.subTo(r, r)
            }, i.fromNumber = function(t, e, r) {
                var i = this;
                if ("number" == typeof e) if (t < 2) i.fromInt(1);
                else for (i.fromNumber(t, r), i.testBit(t - 1) || i.bitwiseTo(m.ONE.shiftLeft(t - 1), c, i), i.isEven() && i.dAddOffset(1, 0); !i.isProbablePrime(e);) i.dAddOffset(2, 0), i.bitLength() > t && i.subTo(m.ONE.shiftLeft(t - 1), i);
                else {
                    var n = new Array,
                        o = 7 & t;
                    n.length = 1 + (t >> 3), e.nextBytes(n), 0 < o ? n[0] &= (1 << o) - 1 : n[0] = 0, i.fromString(n, 256)
                }
            }, i.bitwiseTo = function(t, e, r) {
                var i, n, o = this,
                    s = Math.min(t.t, o.t);
                for (i = 0; i < s; ++i) r[i] = e(o[i], t[i]);
                if (t.t < o.t) {
                    for (n = t.s & o.DM, i = s; i < o.t; ++i) r[i] = e(o[i], n);
                    r.t = o.t
                } else {
                    for (n = o.s & o.DM, i = s; i < t.t; ++i) r[i] = e(n, t[i]);
                    r.t = t.t
                }
                r.s = e(o.s, t.s), r.clamp()
            }, i.changeBit = function(t, e) {
                var r = m.ONE.shiftLeft(t);
                return this.bitwiseTo(r, e, r), r
            }, i.addTo = function(t, e) {
                for (var r = this, i = 0, n = 0, o = Math.min(t.t, r.t); i < o;) n += r[i] + t[i], e[i++] = n & r.DM, n >>= r.DB;
                if (t.t < r.t) {
                    for (n += t.s; i < r.t;) n += r[i], e[i++] = n & r.DM, n >>= r.DB;
                    n += r.s
                } else {
                    for (n += r.s; i < t.t;) n += t[i], e[i++] = n & r.DM, n >>= r.DB;
                    n += t.s
                }
                e.s = n < 0 ? -1 : 0, 0 < n ? e[i++] = n : n < -1 && (e[i++] = r.DV + n), e.t = i, e.clamp()
            }, i.dMultiply = function(t) {
                this[this.t] = this.am(0, t - 1, this, 0, 0, this.t), ++this.t, this.clamp()
            }, i.dAddOffset = function(t, e) {
                if (0 != t) {
                    for (; this.t <= e;) this[this.t++] = 0;
                    for (this[e] += t; this[e] >= this.DV;) this[e] -= this.DV, ++e >= this.t && (this[this.t++] = 0), ++this[e]
                }
            }, i.multiplyLowerTo = function(t, e, r) {
                var i, n = Math.min(this.t + t.t, e);
                for (r.s = 0, r.t = n; 0 < n;) r[--n] = 0;
                for (i = r.t - this.t; n < i; ++n) r[n + this.t] = this.am(0, t[n], r, n, 0, this.t);
                for (i = Math.min(t.t, e); n < i; ++n) this.am(0, t[n], r, n, 0, e - n);
                r.clamp()
            }, i.multiplyUpperTo = function(t, e, r) {
                --e;
                var i = r.t = this.t + t.t - e;
                for (r.s = 0; 0 <= --i;) r[i] = 0;
                for (i = Math.max(e - this.t, 0); i < t.t; ++i) r[this.t + i - e] = this.am(e - i, t[i], r, 0, 0, this.t + i - e);
                r.clamp(), r.drShiftTo(1, r)
            }, i.modInt = function(t) {
                if (t <= 0) return 0;
                var e = this.DV % t,
                    r = this.s < 0 ? t - 1 : 0;
                if (0 < this.t) if (0 == e) r = this[0] % t;
                else for (var i = this.t - 1; 0 <= i; --i) r = (e * r + this[i]) % t;
                return r
            }, i.millerRabin = function(t) {
                var e = this.subtract(m.ONE),
                    r = e.getLowestSetBit();
                if (r <= 0) return !1;
                var i = e.shiftRight(r);
                T.length < (t = t + 1 >> 1) && (t = T.length);
                for (var n = new m(null), o = [], s = 0; s < t; ++s) {
                    for (; a = T[Math.floor(Math.random() * T.length)], - 1 != o.indexOf(a););
                    o.push(a), n.fromInt(a);
                    var f = n.modPow(i, this);
                    if (0 != f.compareTo(m.ONE) && 0 != f.compareTo(e)) {
                        for (var a = 1; a++ < r && 0 != f.compareTo(e);) if (0 == (f = f.modPowInt(2, this)).compareTo(m.ONE)) return !1;
                        if (0 != f.compareTo(e)) return !1
                    }
                }
                return !0
            }, i.clone = function() {
                var t = new m;
                return this.copyTo(t), t
            }, i.intValue = function() {
                if (this.s < 0) {
                    if (1 == this.t) return this[0] - this.DV;
                    if (0 == this.t) return -1
                } else {
                    if (1 == this.t) return this[0];
                    if (0 == this.t) return 0
                }
                return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
            }, i.byteValue = function() {
                return 0 == this.t ? this.s : this[0] << 24 >> 24
            }, i.shortValue = function() {
                return 0 == this.t ? this.s : this[0] << 16 >> 16
            }, i.signum = function() {
                return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
            }, i.toByteArray = function() {
                var t = this,
                    e = t.t,
                    r = new Array;
                r[0] = t.s;
                var i, n = t.DB - e * t.DB % 8,
                    o = 0;
                if (0 < e--) for (n < t.DB && (i = t[e] >> n) != (t.s & t.DM) >> n && (r[o++] = i | t.s << t.DB - n); 0 <= e;) n < 8 ? (i = (t[e] & (1 << n) - 1) << 8 - n, i |= t[--e] >> (n += t.DB - 8)) : (i = t[e] >> (n -= 8) & 255, n <= 0 && (n += t.DB, --e)), 0 != (128 & i) && (i |= -256), 0 === o && (128 & t.s) != (128 & i) && ++o, (0 < o || i != t.s) && (r[o++] = i);
                return r
            }, i.equals = function(t) {
                return 0 == this.compareTo(t)
            }, i.min = function(t) {
                return this.compareTo(t) < 0 ? this : t
            }, i.max = function(t) {
                return 0 < this.compareTo(t) ? this : t
            }, i.and = function(t) {
                var e = new m;
                return this.bitwiseTo(t, l, e), e
            }, i.or = function(t) {
                var e = new m;
                return this.bitwiseTo(t, c, e), e
            }, i.xor = function(t) {
                var e = new m;
                return this.bitwiseTo(t, p, e), e
            }, i.andNot = function(t) {
                var e = new m;
                return this.bitwiseTo(t, d, e), e
            }, i.not = function() {
                for (var t = new m, e = 0; e < this.t; ++e) t[e] = this.DM & ~this[e];
                return t.t = this.t, t.s = ~this.s, t
            }, i.shiftLeft = function(t) {
                var e = new m;
                return t < 0 ? this.rShiftTo(-t, e) : this.lShiftTo(t, e), e
            }, i.shiftRight = function(t) {
                var e = new m;
                return t < 0 ? this.lShiftTo(-t, e) : this.rShiftTo(t, e), e
            }, i.getLowestSetBit = function() {
                for (var t = 0; t < this.t; ++t) if (0 != this[t]) return t * this.DB + g(this[t]);
                return this.s < 0 ? this.t * this.DB : -1
            }, i.bitCount = function() {
                for (var t = 0, e = this.s & this.DM, r = 0; r < this.t; ++r) t += w(this[r] ^ e);
                return t
            }, i.testBit = function(t) {
                var e = Math.floor(t / this.DB);
                return e >= this.t ? 0 != this.s : 0 != (this[e] & 1 << t % this.DB)
            }, i.setBit = function(t) {
                return this.changeBit(t, c)
            }, i.clearBit = function(t) {
                return this.changeBit(t, d)
            }, i.flipBit = function(t) {
                return this.changeBit(t, p)
            }, i.add = function(t) {
                var e = new m;
                return this.addTo(t, e), e
            }, i.subtract = function(t) {
                var e = new m;
                return this.subTo(t, e), e
            }, i.multiply = function(t) {
                var e = new m;
                return this.multiplyTo(t, e), e
            }, i.divide = function(t) {
                var e = new m;
                return this.divRemTo(t, e, null), e
            }, i.remainder = function(t) {
                var e = new m;
                return this.divRemTo(t, null, e), e
            }, i.divideAndRemainder = function(t) {
                var e = new m,
                    r = new m;
                return this.divRemTo(t, e, r), new Array(e, r)
            }, i.modPow = function(t, e) {
                var r, i, n = t.bitLength(),
                    o = y(1);
                if (n <= 0) return o;
                r = n < 18 ? 1 : n < 48 ? 3 : n < 144 ? 4 : n < 768 ? 5 : 6, i = n < 8 ? new v(e) : e.isEven() ? new B(e) : new b(e);
                var s = new Array,
                    f = 3,
                    a = r - 1,
                    h = (1 << r) - 1;
                if (s[1] = i.convert(this), 1 < r) {
                    var u = new m;
                    for (i.sqrTo(s[1], u); f <= h;) s[f] = new m, i.mulTo(u, s[f - 2], s[f]), f += 2
                }
                var l, c, p = t.t - 1,
                    d = !0,
                    g = new m;
                for (n = _(t[p]) - 1; 0 <= p;) {
                    for (a <= n ? l = t[p] >> n - a & h : (l = (t[p] & (1 << n + 1) - 1) << a - n, 0 < p && (l |= t[p - 1] >> this.DB + n - a)), f = r; 0 == (1 & l);) l >>= 1, --f;
                    if ((n -= f) < 0 && (n += this.DB, --p), d) s[l].copyTo(o), d = !1;
                    else {
                        for (; 1 < f;) i.sqrTo(o, g), i.sqrTo(g, o), f -= 2;
                        0 < f ? i.sqrTo(o, g) : (c = o, o = g, g = c), i.mulTo(g, s[l], o)
                    }
                    for (; 0 <= p && 0 == (t[p] & 1 << n);) i.sqrTo(o, g), c = o, o = g, g = c, --n < 0 && (n = this.DB - 1, --p)
                }
                return i.revert(o)
            }, i.modInverse = function(t) {
                var e = t.isEven();
                if (0 === this.signum()) throw new Error("division by zero");
                if (this.isEven() && e || 0 == t.signum()) return m.ZERO;
                for (var r = t.clone(), i = this.clone(), n = y(1), o = y(0), s = y(0), f = y(1); 0 != r.signum();) {
                    for (; r.isEven();) r.rShiftTo(1, r), e ? (n.isEven() && o.isEven() || (n.addTo(this, n), o.subTo(t, o)), n.rShiftTo(1, n)) : o.isEven() || o.subTo(t, o), o.rShiftTo(1, o);
                    for (; i.isEven();) i.rShiftTo(1, i), e ? (s.isEven() && f.isEven() || (s.addTo(this, s), f.subTo(t, f)), s.rShiftTo(1, s)) : f.isEven() || f.subTo(t, f), f.rShiftTo(1, f);
                    0 <= r.compareTo(i) ? (r.subTo(i, r), e && n.subTo(s, n), o.subTo(f, o)) : (i.subTo(r, i), e && s.subTo(n, s), f.subTo(o, f))
                }
                if (0 != i.compareTo(m.ONE)) return m.ZERO;
                for (; 0 <= f.compareTo(t);) f.subTo(t, f);
                for (; f.signum() < 0;) f.addTo(t, f);
                return f
            }, i.pow = function(t) {
                return this.exp(t, new E)
            }, i.gcd = function(t) {
                var e = this.s < 0 ? this.negate() : this.clone(),
                    r = t.s < 0 ? t.negate() : t.clone();
                if (e.compareTo(r) < 0) {
                    var i = e;
                    e = r, r = i
                }
                var n = e.getLowestSetBit(),
                    o = r.getLowestSetBit();
                if (o < 0) return e;
                for (n < o && (o = n), 0 < o && (e.rShiftTo(o, e), r.rShiftTo(o, r)); 0 < e.signum();) 0 < (n = e.getLowestSetBit()) && e.rShiftTo(n, e), 0 < (n = r.getLowestSetBit()) && r.rShiftTo(n, r), 0 <= e.compareTo(r) ? (e.subTo(r, e), e.rShiftTo(1, e)) : (r.subTo(e, r), r.rShiftTo(1, r));
                return 0 < o && r.lShiftTo(o, r), r
            }, i.isProbablePrime = function(t) {
                var e, r = this.abs();
                if (1 == r.t && r[0] <= T[T.length - 1]) {
                    for (e = 0; e < T.length; ++e) if (r[0] == T[e]) return !0;
                    return !1
                }
                if (r.isEven()) return !1;
                for (e = 1; e < T.length;) {
                    for (var i = T[e], n = e + 1; n < T.length && i < I;) i *= T[n++];
                    for (i = r.modInt(i); e < n;) if (i % T[e++] == 0) return !1
                }
                return r.millerRabin(t)
            }, i.square = function() {
                var t = new m;
                return this.squareTo(t), t
            }, m.ZERO = y(0), m.ONE = y(1), m.valueOf = y, e.exports = m
        }, {
            "../package.json": 20
        }],
        18: [function(t, e, r) {
            (function(n) {
                var e = t("assert"),
                    r = t("./bigi");
                r.fromByteArrayUnsigned = function(t) {
                    return 128 & t[0] ? new r([0].concat(t)) : new r(t)
                }, r.prototype.toByteArrayUnsigned = function() {
                    var t = this.toByteArray();
                    return 0 === t[0] ? t.slice(1) : t
                }, r.fromDERInteger = function(t) {
                    return new r(t)
                }, r.prototype.toDERInteger = r.prototype.toByteArray, r.fromBuffer = function(t) {
                    if (128 & t[0]) {
                        var e = Array.prototype.slice.call(t);
                        return new r([0].concat(e))
                    }
                    return new r(t)
                }, r.fromHex = function(t) {
                    return "" === t ? r.ZERO : (e.equal(t, t.match(/^[A-Fa-f0-9]+/), "Invalid hex string"), e.equal(t.length % 2, 0, "Incomplete hex"), new r(t, 16))
                }, r.prototype.toBuffer = function(t) {
                    for (var e = this.toByteArrayUnsigned(), r = [], i = t - e.length; r.length < i;) r.push(0);
                    return new n(r.concat(e))
                }, r.prototype.toHex = function(t) {
                    return this.toBuffer(t).toString("hex")
                }
            }).call(this, t("buffer").Buffer)
        }, {
            "./bigi": 17,
            assert: 14,
            buffer: 40
        }],
        19: [function(t, e, r) {
            var i = t("./bigi");
            t("./convert"), e.exports = i
        }, {
            "./bigi": 17,
            "./convert": 18
        }],
        20: [function(t, e, r) {
            e.exports = {
                _args: [
                    ["bigi@1.4.2", "/home/james/eosjs/ecc"]
                ],
                _from: "bigi@1.4.2",
                _id: "bigi@1.4.2",
                _inBundle: !1,
                _integrity: "sha1-nGZalfiLiwj8Bc/XMfVhhZ1yWCU=",
                _location: "/bigi",
                _phantomChildren: {},
                _requested: {
                    type: "version",
                    registry: !0,
                    raw: "bigi@1.4.2",
                    name: "bigi",
                    escapedName: "bigi",
                    rawSpec: "1.4.2",
                    saveSpec: null,
                    fetchSpec: "1.4.2"
                },
                _requiredBy: ["/", "/ecurve"],
                _resolved: "https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz",
                _spec: "1.4.2",
                _where: "/home/james/eosjs/ecc",
                bugs: {
                    url: "https://github.com/cryptocoinjs/bigi/issues"
                },
                dependencies: {},
                description: "Big integers.",
                devDependencies: {
                    coveralls: "^2.11.2",
                    istanbul: "^0.3.5",
                    jshint: "^2.5.1",
                    mocha: "^2.1.0",
                    mochify: "^2.1.0"
                },
                homepage: "https://github.com/cryptocoinjs/bigi#readme",
                keywords: ["cryptography", "math", "bitcoin", "arbitrary", "precision", "arithmetic", "big", "integer", "int", "number", "biginteger", "bigint", "bignumber", "decimal", "float"],
                main: "./lib/index.js",
                name: "bigi",
                repository: {
                    url: "git+https://github.com/cryptocoinjs/bigi.git",
                    type: "git"
                },
                scripts: {
                    "browser-test": "mochify --wd -R spec",
                    coverage: "istanbul cover ./node_modules/.bin/_mocha -- --reporter list test/*.js",
                    coveralls: "npm run-script coverage && node ./node_modules/.bin/coveralls < coverage/lcov.info",
                    jshint: "jshint --config jshint.json lib/*.js ; true",
                    test: "_mocha -- test/*.js",
                    unit: "mocha"
                },
                testling: {
                    files: "test/*.js",
                    harness: "mocha",
                    browsers: ["ie/9..latest", "firefox/latest", "chrome/latest", "safari/6.0..latest", "iphone/6.0..latest", "android-browser/4.2..latest"]
                },
                version: "1.4.2"
            }
        }, {}],
        21: [function(t, e, r) {}, {}],
        22: [function(t, e, r) {
            var n = t("safe-buffer").Buffer;

            function o(t) {
                n.isBuffer(t) || (t = n.from(t));
                for (var e = t.length / 4 | 0, r = new Array(e), i = 0; i < e; i++) r[i] = t.readUInt32BE(4 * i);
                return r
            }
            function i(t) {
                for (; 0 < t.length; t++) t[0] = 0
            }
            function s(t, e, r, i, n) {
                for (var o, s, f, a, h = r[0], u = r[1], l = r[2], c = r[3], p = t[0] ^ e[0], d = t[1] ^ e[1], g = t[2] ^ e[2], y = t[3] ^ e[3], v = 4, b = 1; b < n; b++) o = h[p >>> 24] ^ u[d >>> 16 & 255] ^ l[g >>> 8 & 255] ^ c[255 & y] ^ e[v++], s = h[d >>> 24] ^ u[g >>> 16 & 255] ^ l[y >>> 8 & 255] ^ c[255 & p] ^ e[v++], f = h[g >>> 24] ^ u[y >>> 16 & 255] ^ l[p >>> 8 & 255] ^ c[255 & d] ^ e[v++], a = h[y >>> 24] ^ u[p >>> 16 & 255] ^ l[d >>> 8 & 255] ^ c[255 & g] ^ e[v++], p = o, d = s, g = f, y = a;
                return o = (i[p >>> 24] << 24 | i[d >>> 16 & 255] << 16 | i[g >>> 8 & 255] << 8 | i[255 & y]) ^ e[v++], s = (i[d >>> 24] << 24 | i[g >>> 16 & 255] << 16 | i[y >>> 8 & 255] << 8 | i[255 & p]) ^ e[v++], f = (i[g >>> 24] << 24 | i[y >>> 16 & 255] << 16 | i[p >>> 8 & 255] << 8 | i[255 & d]) ^ e[v++], a = (i[y >>> 24] << 24 | i[p >>> 16 & 255] << 16 | i[d >>> 8 & 255] << 8 | i[255 & g]) ^ e[v++], [o >>>= 0, s >>>= 0, f >>>= 0, a >>>= 0]
            }
            var l = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
                c = function() {
                    for (var t = new Array(256), e = 0; e < 256; e++) t[e] = e < 128 ? e << 1 : e << 1 ^ 283;
                    for (var r = [], i = [], n = [
                        [],
                        [],
                        [],
                        []
                    ], o = [
                        [],
                        [],
                        [],
                        []
                    ], s = 0, f = 0, a = 0; a < 256; ++a) {
                        var h = f ^ f << 1 ^ f << 2 ^ f << 3 ^ f << 4;
                        h = h >>> 8 ^ 255 & h ^ 99;
                        var u = t[i[r[s] = h] = s],
                            l = t[u],
                            c = t[l],
                            p = 257 * t[h] ^ 16843008 * h;
                        n[0][s] = p << 24 | p >>> 8, n[1][s] = p << 16 | p >>> 16, n[2][s] = p << 8 | p >>> 24, n[3][s] = p, p = 16843009 * c ^ 65537 * l ^ 257 * u ^ 16843008 * s, o[0][h] = p << 24 | p >>> 8, o[1][h] = p << 16 | p >>> 16, o[2][h] = p << 8 | p >>> 24, o[3][h] = p, 0 === s ? s = f = 1 : (s = u ^ t[t[t[c ^ u]]], f ^= t[t[f]])
                    }
                    return {
                        SBOX: r,
                        INV_SBOX: i,
                        SUB_MIX: n,
                        INV_SUB_MIX: o
                    }
                }();

            function f(t) {
                this._key = o(t), this._reset()
            }
            f.blockSize = 16, f.keySize = 32, f.prototype.blockSize = f.blockSize, f.prototype.keySize = f.keySize, f.prototype._reset = function() {
                for (var t = this._key, e = t.length, r = e + 6, i = 4 * (r + 1), n = [], o = 0; o < e; o++) n[o] = t[o];
                for (o = e; o < i; o++) {
                    var s = n[o - 1];
                    o % e == 0 ? (s = s << 8 | s >>> 24, s = c.SBOX[s >>> 24] << 24 | c.SBOX[s >>> 16 & 255] << 16 | c.SBOX[s >>> 8 & 255] << 8 | c.SBOX[255 & s], s ^= l[o / e | 0] << 24) : 6 < e && o % e == 4 && (s = c.SBOX[s >>> 24] << 24 | c.SBOX[s >>> 16 & 255] << 16 | c.SBOX[s >>> 8 & 255] << 8 | c.SBOX[255 & s]), n[o] = n[o - e] ^ s
                }
                for (var f = [], a = 0; a < i; a++) {
                    var h = i - a,
                        u = n[h - (a % 4 ? 0 : 4)];
                    f[a] = a < 4 || h <= 4 ? u : c.INV_SUB_MIX[0][c.SBOX[u >>> 24]] ^ c.INV_SUB_MIX[1][c.SBOX[u >>> 16 & 255]] ^ c.INV_SUB_MIX[2][c.SBOX[u >>> 8 & 255]] ^ c.INV_SUB_MIX[3][c.SBOX[255 & u]]
                }
                this._nRounds = r, this._keySchedule = n, this._invKeySchedule = f
            }, f.prototype.encryptBlockRaw = function(t) {
                return s(t = o(t), this._keySchedule, c.SUB_MIX, c.SBOX, this._nRounds)
            }, f.prototype.encryptBlock = function(t) {
                var e = this.encryptBlockRaw(t),
                    r = n.allocUnsafe(16);
                return r.writeUInt32BE(e[0], 0), r.writeUInt32BE(e[1], 4), r.writeUInt32BE(e[2], 8), r.writeUInt32BE(e[3], 12), r
            }, f.prototype.decryptBlock = function(t) {
                var e = (t = o(t))[1];
                t[1] = t[3], t[3] = e;
                var r = s(t, this._invKeySchedule, c.INV_SUB_MIX, c.INV_SBOX, this._nRounds),
                    i = n.allocUnsafe(16);
                return i.writeUInt32BE(r[0], 0), i.writeUInt32BE(r[3], 4), i.writeUInt32BE(r[2], 8), i.writeUInt32BE(r[1], 12), i
            }, f.prototype.scrub = function() {
                i(this._keySchedule), i(this._invKeySchedule), i(this._key)
            }, e.exports.AES = f
        }, {
            "safe-buffer": 81
        }],
        23: [function(t, e, r) {
            var o = t("./aes"),
                s = t("safe-buffer").Buffer,
                f = t("cipher-base"),
                i = t("inherits"),
                a = t("./ghash"),
                n = t("buffer-xor");

            function h(t, e, r, i) {
                f.call(this), this._finID = s.concat([r, s.from([0, 0, 0, 1])]), r = s.concat([r, s.from([0, 0, 0, 2])]), this._cipher = new o.AES(e), this._prev = s.from(r), this._cache = s.allocUnsafe(0), this._secCache = s.allocUnsafe(0), this._decrypt = i, this._alen = 0, this._len = 0, this._mode = t;
                var n = s.alloc(4, 0);
                this._ghash = new a(this._cipher.encryptBlock(n)), this._authTag = null, this._called = !1
            }
            i(h, f), h.prototype._update = function(t) {
                if (!this._called && this._alen) {
                    var e = 16 - this._alen % 16;
                    e < 16 && (e = s.alloc(e, 0), this._ghash.update(e))
                }
                this._called = !0;
                var r = this._mode.encrypt(this, t);
                return this._decrypt ? this._ghash.update(t) : this._ghash.update(r), this._len += t.length, r
            }, h.prototype._final = function() {
                if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
                var t = n(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
                if (this._decrypt && function(t, e) {
                    var r = 0;
                    t.length !== e.length && r++;
                    for (var i = Math.min(t.length, e.length), n = 0; n < i; ++n) r += t[n] ^ e[n];
                    return r
                }(t, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
                this._authTag = t, this._cipher.scrub()
            }, h.prototype.getAuthTag = function() {
                if (this._decrypt || !s.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
                return this._authTag
            }, h.prototype.setAuthTag = function(t) {
                if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
                this._authTag = t
            }, h.prototype.setAAD = function(t) {
                if (this._called) throw new Error("Attempting to set AAD in unsupported state");
                this._ghash.update(t), this._alen += t.length
            }, e.exports = h
        }, {
            "./aes": 22,
            "./ghash": 27,
            "buffer-xor": 39,
            "cipher-base": 42,
            inherits: 58,
            "safe-buffer": 81
        }],
        24: [function(t, e, r) {
            var i = t("./encrypter"),
                n = t("./decrypter"),
                o = t("./modes/list.json");
            r.createCipher = r.Cipher = i.createCipher, r.createCipheriv = r.Cipheriv = i.createCipheriv, r.createDecipher = r.Decipher = n.createDecipher, r.createDecipheriv = r.Decipheriv = n.createDecipheriv, r.listCiphers = r.getCiphers = function() {
                return Object.keys(o)
            }
        }, {
            "./decrypter": 25,
            "./encrypter": 26,
            "./modes/list.json": 35
        }],
        25: [function(t, e, r) {
            var n = t("./authCipher"),
                o = t("safe-buffer").Buffer,
                s = t("./modes"),
                f = t("./streamCipher"),
                i = t("cipher-base"),
                a = t("./aes"),
                h = t("evp_bytestokey");

            function u(t, e, r) {
                i.call(this), this._cache = new l, this._last = void 0, this._cipher = new a.AES(e), this._prev = o.from(r), this._mode = t, this._autopadding = !0
            }
            function l() {
                this.cache = o.allocUnsafe(0)
            }
            function c(t, e, r) {
                var i = s[t.toLowerCase()];
                if (!i) throw new TypeError("invalid suite type");
                if ("string" == typeof r && (r = o.from(r)), r.length !== i.iv) throw new TypeError("invalid iv length " + r.length);
                if ("string" == typeof e && (e = o.from(e)), e.length !== i.key / 8) throw new TypeError("invalid key length " + e.length);
                return "stream" === i.type ? new f(i.module, e, r, !0) : "auth" === i.type ? new n(i.module, e, r, !0) : new u(i.module, e, r)
            }
            t("inherits")(u, i), u.prototype._update = function(t) {
                var e, r;
                this._cache.add(t);
                for (var i = []; e = this._cache.get(this._autopadding);) r = this._mode.decrypt(this, e), i.push(r);
                return o.concat(i)
            }, u.prototype._final = function() {
                var t = this._cache.flush();
                if (this._autopadding) return function(t) {
                    var e = t[15],
                        r = -1;
                    for (; ++r < e;) if (t[r + (16 - e)] !== e) throw new Error("unable to decrypt data");
                    if (16 === e) return;
                    return t.slice(0, 16 - e)
                }(this._mode.decrypt(this, t));
                if (t) throw new Error("data not multiple of block length")
            }, u.prototype.setAutoPadding = function(t) {
                return this._autopadding = !! t, this
            }, l.prototype.add = function(t) {
                this.cache = o.concat([this.cache, t])
            }, l.prototype.get = function(t) {
                var e;
                if (t) {
                    if (16 < this.cache.length) return e = this.cache.slice(0, 16), this.cache = this.cache.slice(16), e
                } else if (16 <= this.cache.length) return e = this.cache.slice(0, 16), this.cache = this.cache.slice(16), e;
                return null
            }, l.prototype.flush = function() {
                if (this.cache.length) return this.cache
            }, r.createDecipher = function(t, e) {
                var r = s[t.toLowerCase()];
                if (!r) throw new TypeError("invalid suite type");
                var i = h(e, !1, r.key, r.iv);
                return c(t, i.key, i.iv)
            }, r.createDecipheriv = c
        }, {
            "./aes": 22,
            "./authCipher": 23,
            "./modes": 34,
            "./streamCipher": 37,
            "cipher-base": 42,
            evp_bytestokey: 55,
            inherits: 58,
            "safe-buffer": 81
        }],
        26: [function(t, e, r) {
            var n = t("./modes"),
                o = t("./authCipher"),
                s = t("safe-buffer").Buffer,
                f = t("./streamCipher"),
                i = t("cipher-base"),
                a = t("./aes"),
                h = t("evp_bytestokey");

            function u(t, e, r) {
                i.call(this), this._cache = new c, this._cipher = new a.AES(e), this._prev = s.from(r), this._mode = t, this._autopadding = !0
            }
            t("inherits")(u, i), u.prototype._update = function(t) {
                var e, r;
                this._cache.add(t);
                for (var i = []; e = this._cache.get();) r = this._mode.encrypt(this, e), i.push(r);
                return s.concat(i)
            };
            var l = s.alloc(16, 16);

            function c() {
                this.cache = s.allocUnsafe(0)
            }
            function p(t, e, r) {
                var i = n[t.toLowerCase()];
                if (!i) throw new TypeError("invalid suite type");
                if ("string" == typeof e && (e = s.from(e)), e.length !== i.key / 8) throw new TypeError("invalid key length " + e.length);
                if ("string" == typeof r && (r = s.from(r)), r.length !== i.iv) throw new TypeError("invalid iv length " + r.length);
                return "stream" === i.type ? new f(i.module, e, r) : "auth" === i.type ? new o(i.module, e, r) : new u(i.module, e, r)
            }
            u.prototype._final = function() {
                var t = this._cache.flush();
                if (this._autopadding) return t = this._mode.encrypt(this, t), this._cipher.scrub(), t;
                if (!t.equals(l)) throw this._cipher.scrub(), new Error("data not multiple of block length")
            }, u.prototype.setAutoPadding = function(t) {
                return this._autopadding = !! t, this
            }, c.prototype.add = function(t) {
                this.cache = s.concat([this.cache, t])
            }, c.prototype.get = function() {
                if (15 < this.cache.length) {
                    var t = this.cache.slice(0, 16);
                    return this.cache = this.cache.slice(16), t
                }
                return null
            }, c.prototype.flush = function() {
                for (var t = 16 - this.cache.length, e = s.allocUnsafe(t), r = -1; ++r < t;) e.writeUInt8(t, r);
                return s.concat([this.cache, e])
            }, r.createCipheriv = p, r.createCipher = function(t, e) {
                var r = n[t.toLowerCase()];
                if (!r) throw new TypeError("invalid suite type");
                var i = h(e, !1, r.key, r.iv);
                return p(t, i.key, i.iv)
            }
        }, {
            "./aes": 22,
            "./authCipher": 23,
            "./modes": 34,
            "./streamCipher": 37,
            "cipher-base": 42,
            evp_bytestokey: 55,
            inherits: 58,
            "safe-buffer": 81
        }],
        27: [function(t, e, r) {
            var i = t("safe-buffer").Buffer,
                n = i.alloc(16, 0);

            function s(t) {
                var e = i.allocUnsafe(16);
                return e.writeUInt32BE(t[0] >>> 0, 0), e.writeUInt32BE(t[1] >>> 0, 4), e.writeUInt32BE(t[2] >>> 0, 8), e.writeUInt32BE(t[3] >>> 0, 12), e
            }
            function o(t) {
                this.h = t, this.state = i.alloc(16, 0), this.cache = i.allocUnsafe(0)
            }
            o.prototype.ghash = function(t) {
                for (var e = -1; ++e < t.length;) this.state[e] ^= t[e];
                this._multiply()
            }, o.prototype._multiply = function() {
                for (var t, e, r, i = [(t = this.h).readUInt32BE(0), t.readUInt32BE(4), t.readUInt32BE(8), t.readUInt32BE(12)], n = [0, 0, 0, 0], o = -1; ++o < 128;) {
                    for (0 != (this.state[~~ (o / 8)] & 1 << 7 - o % 8) && (n[0] ^= i[0], n[1] ^= i[1], n[2] ^= i[2], n[3] ^= i[3]), r = 0 != (1 & i[3]), e = 3; 0 < e; e--) i[e] = i[e] >>> 1 | (1 & i[e - 1]) << 31;
                    i[0] = i[0] >>> 1, r && (i[0] = i[0] ^ 225 << 24)
                }
                this.state = s(n)
            }, o.prototype.update = function(t) {
                var e;
                for (this.cache = i.concat([this.cache, t]); 16 <= this.cache.length;) e = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(e)
            }, o.prototype.final = function(t, e) {
                return this.cache.length && this.ghash(i.concat([this.cache, n], 16)), this.ghash(s([0, t, 0, e])), this.state
            }, e.exports = o
        }, {
            "safe-buffer": 81
        }],
        28: [function(t, e, r) {
            var n = t("buffer-xor");
            r.encrypt = function(t, e) {
                var r = n(e, t._prev);
                return t._prev = t._cipher.encryptBlock(r), t._prev
            }, r.decrypt = function(t, e) {
                var r = t._prev;
                t._prev = e;
                var i = t._cipher.decryptBlock(e);
                return n(i, r)
            }
        }, {
            "buffer-xor": 39
        }],
        29: [function(t, e, r) {
            var o = t("safe-buffer").Buffer,
                s = t("buffer-xor");

            function f(t, e, r) {
                var i = e.length,
                    n = s(e, t._cache);
                return t._cache = t._cache.slice(i), t._prev = o.concat([t._prev, r ? e : n]), n
            }
            r.encrypt = function(t, e, r) {
                for (var i, n = o.allocUnsafe(0); e.length;) {
                    if (0 === t._cache.length && (t._cache = t._cipher.encryptBlock(t._prev), t._prev = o.allocUnsafe(0)), !(t._cache.length <= e.length)) {
                        n = o.concat([n, f(t, e, r)]);
                        break
                    }
                    i = t._cache.length, n = o.concat([n, f(t, e.slice(0, i), r)]), e = e.slice(i)
                }
                return n
            }
        }, {
            "buffer-xor": 39,
            "safe-buffer": 81
        }],
        30: [function(t, e, r) {
            var s = t("safe-buffer").Buffer;

            function f(t, e, r) {
                for (var i, n, o = -1, s = 0; ++o < 8;) i = e & 1 << 7 - o ? 128 : 0, s += (128 & (n = t._cipher.encryptBlock(t._prev)[0] ^ i)) >> o % 8, t._prev = a(t._prev, r ? i : n);
                return s
            }
            function a(t, e) {
                var r = t.length,
                    i = -1,
                    n = s.allocUnsafe(t.length);
                for (t = s.concat([t, s.from([e])]); ++i < r;) n[i] = t[i] << 1 | t[i + 1] >> 7;
                return n
            }
            r.encrypt = function(t, e, r) {
                for (var i = e.length, n = s.allocUnsafe(i), o = -1; ++o < i;) n[o] = f(t, e[o], r);
                return n
            }
        }, {
            "safe-buffer": 81
        }],
        31: [function(t, e, r) {
            (function(u) {
                r.encrypt = function(t, e, r) {
                    for (var i, n, o, s, f = e.length, a = u.allocUnsafe(f), h = -1; ++h < f;) a[h] = (i = t, n = e[h], o = r, void 0, s = i._cipher.encryptBlock(i._prev)[0] ^ n, i._prev = u.concat([i._prev.slice(1), u.from([o ? n : s])]), s);
                    return a
                }
            }).call(this, t("buffer").Buffer)
        }, {
            buffer: 40
        }],
        32: [function(t, e, r) {
            (function(u) {
                var l = t("buffer-xor");
                r.encrypt = function(t, e) {
                    var r, i, n = Math.ceil(e.length / 16),
                        o = t._cache.length;
                    t._cache = u.concat([t._cache, u.allocUnsafe(16 * n)]);
                    for (var s = 0; s < n; s++) {
                        var f = (void 0, i = (r = t)._cipher.encryptBlockRaw(r._prev), function(t) {
                            for (var e, r = t.length; r--;) {
                                if (255 !== (e = t.readUInt8(r))) {
                                    e++, t.writeUInt8(e, r);
                                    break
                                }
                                t.writeUInt8(0, r)
                            }
                        }(r._prev), i),
                            a = o + 16 * s;
                        t._cache.writeUInt32BE(f[0], a + 0), t._cache.writeUInt32BE(f[1], a + 4), t._cache.writeUInt32BE(f[2], a + 8), t._cache.writeUInt32BE(f[3], a + 12)
                    }
                    var h = t._cache.slice(0, e.length);
                    return t._cache = t._cache.slice(e.length), l(e, h)
                }
            }).call(this, t("buffer").Buffer)
        }, {
            buffer: 40,
            "buffer-xor": 39
        }],
        33: [function(t, e, r) {
            r.encrypt = function(t, e) {
                return t._cipher.encryptBlock(e)
            }, r.decrypt = function(t, e) {
                return t._cipher.decryptBlock(e)
            }
        }, {}],
        34: [function(t, e, r) {
            var i = {
                ECB: t("./ecb"),
                CBC: t("./cbc"),
                CFB: t("./cfb"),
                CFB8: t("./cfb8"),
                CFB1: t("./cfb1"),
                OFB: t("./ofb"),
                CTR: t("./ctr"),
                GCM: t("./ctr")
            }, n = t("./list.json");
            for (var o in n) n[o].module = i[n[o].mode];
            e.exports = n
        }, {
            "./cbc": 28,
            "./cfb": 29,
            "./cfb1": 30,
            "./cfb8": 31,
            "./ctr": 32,
            "./ecb": 33,
            "./list.json": 35,
            "./ofb": 36
        }],
        35: [function(t, e, r) {
            e.exports = {
                "aes-128-ecb": {
                    cipher: "AES",
                    key: 128,
                    iv: 0,
                    mode: "ECB",
                    type: "block"
                },
                "aes-192-ecb": {
                    cipher: "AES",
                    key: 192,
                    iv: 0,
                    mode: "ECB",
                    type: "block"
                },
                "aes-256-ecb": {
                    cipher: "AES",
                    key: 256,
                    iv: 0,
                    mode: "ECB",
                    type: "block"
                },
                "aes-128-cbc": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                "aes-192-cbc": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                "aes-256-cbc": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                aes128: {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                aes192: {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                aes256: {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                "aes-128-cfb": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CFB",
                    type: "stream"
                },
                "aes-192-cfb": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CFB",
                    type: "stream"
                },
                "aes-256-cfb": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CFB",
                    type: "stream"
                },
                "aes-128-cfb8": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CFB8",
                    type: "stream"
                },
                "aes-192-cfb8": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CFB8",
                    type: "stream"
                },
                "aes-256-cfb8": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CFB8",
                    type: "stream"
                },
                "aes-128-cfb1": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CFB1",
                    type: "stream"
                },
                "aes-192-cfb1": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CFB1",
                    type: "stream"
                },
                "aes-256-cfb1": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CFB1",
                    type: "stream"
                },
                "aes-128-ofb": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "OFB",
                    type: "stream"
                },
                "aes-192-ofb": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "OFB",
                    type: "stream"
                },
                "aes-256-ofb": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "OFB",
                    type: "stream"
                },
                "aes-128-ctr": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CTR",
                    type: "stream"
                },
                "aes-192-ctr": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CTR",
                    type: "stream"
                },
                "aes-256-ctr": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CTR",
                    type: "stream"
                },
                "aes-128-gcm": {
                    cipher: "AES",
                    key: 128,
                    iv: 12,
                    mode: "GCM",
                    type: "auth"
                },
                "aes-192-gcm": {
                    cipher: "AES",
                    key: 192,
                    iv: 12,
                    mode: "GCM",
                    type: "auth"
                },
                "aes-256-gcm": {
                    cipher: "AES",
                    key: 256,
                    iv: 12,
                    mode: "GCM",
                    type: "auth"
                }
            }
        }, {}],
        36: [function(t, e, r) {
            (function(n) {
                var o = t("buffer-xor");
                r.encrypt = function(t, e) {
                    for (; t._cache.length < e.length;) t._cache = n.concat([t._cache, (r = t, r._prev = r._cipher.encryptBlock(r._prev), r._prev)]);
                    var r, i = t._cache.slice(0, e.length);
                    return t._cache = t._cache.slice(e.length), o(e, i)
                }
            }).call(this, t("buffer").Buffer)
        }, {
            buffer: 40,
            "buffer-xor": 39
        }],
        37: [function(t, e, r) {
            var n = t("./aes"),
                o = t("safe-buffer").Buffer,
                s = t("cipher-base");

            function i(t, e, r, i) {
                s.call(this), this._cipher = new n.AES(e), this._prev = o.from(r), this._cache = o.allocUnsafe(0), this._secCache = o.allocUnsafe(0), this._decrypt = i, this._mode = t
            }
            t("inherits")(i, s), i.prototype._update = function(t) {
                return this._mode.encrypt(this, t, this._decrypt)
            }, i.prototype._final = function() {
                this._cipher.scrub()
            }, e.exports = i
        }, {
            "./aes": 22,
            "cipher-base": 42,
            inherits: 58,
            "safe-buffer": 81
        }],
        38: [function(t, e, r) {
            var i = t("base-x");
            e.exports = i("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
        }, {
            "base-x": 15
        }],
        39: [function(t, e, r) {
            (function(o) {
                e.exports = function(t, e) {
                    for (var r = Math.min(t.length, e.length), i = new o(r), n = 0; n < r; ++n) i[n] = t[n] ^ e[n];
                    return i
                }
            }).call(this, t("buffer").Buffer)
        }, {
            buffer: 40
        }],
        40: [function(t, e, r) {
            "use strict";
            var i = t("base64-js"),
                o = t("ieee754");
            r.Buffer = l, r.SlowBuffer = function(t) {
                +t != t && (t = 0);
                return l.alloc(+t)
            }, r.INSPECT_MAX_BYTES = 50;
            var n = 2147483647;

            function s(t) {
                if (n < t) throw new RangeError("Invalid typed array length");
                var e = new Uint8Array(t);
                return e.__proto__ = l.prototype, e
            }
            function l(t, e, r) {
                if ("number" == typeof t) {
                    if ("string" == typeof e) throw new Error("If encoding is specified then the first argument must be a string");
                    return h(t)
                }
                return f(t, e, r)
            }
            function f(t, e, r) {
                if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                return M(t) ? function(t, e, r) {
                    if (e < 0 || t.byteLength < e) throw new RangeError("'offset' is out of bounds");
                    if (t.byteLength < e + (r || 0)) throw new RangeError("'length' is out of bounds");
                    var i;
                    i = void 0 === e && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, e) : new Uint8Array(t, e, r);
                    return i.__proto__ = l.prototype, i
                }(t, e, r) : "string" == typeof t ? function(t, e) {
                    "string" == typeof e && "" !== e || (e = "utf8");
                    if (!l.isEncoding(e)) throw new TypeError('"encoding" must be a valid string encoding');
                    var r = 0 | p(t, e),
                        i = s(r),
                        n = i.write(t, e);
                    n !== r && (i = i.slice(0, n));
                    return i
                }(t, e) : function(t) {
                    if (l.isBuffer(t)) {
                        var e = 0 | c(t.length),
                            r = s(e);
                        return 0 === r.length || t.copy(r, 0, 0, e), r
                    }
                    if (t) {
                        if (N(t) || "length" in t) return "number" != typeof t.length || j(t.length) ? s(0) : u(t);
                        if ("Buffer" === t.type && Array.isArray(t.data)) return u(t.data)
                    }
                    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                }(t)
            }
            function a(t) {
                if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
                if (t < 0) throw new RangeError('"size" argument must not be negative')
            }
            function h(t) {
                return a(t), s(t < 0 ? 0 : 0 | c(t))
            }
            function u(t) {
                for (var e = t.length < 0 ? 0 : 0 | c(t.length), r = s(e), i = 0; i < e; i += 1) r[i] = 255 & t[i];
                return r
            }
            function c(t) {
                if (n <= t) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n.toString(16) + " bytes");
                return 0 | t
            }
            function p(t, e) {
                if (l.isBuffer(t)) return t.length;
                if (N(t) || M(t)) return t.byteLength;
                "string" != typeof t && (t = "" + t);
                var r = t.length;
                if (0 === r) return 0;
                for (var i = !1;;) switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return r;
                    case "utf8":
                    case "utf-8":
                    case void 0:
                        return O(t).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * r;
                    case "hex":
                        return r >>> 1;
                    case "base64":
                        return C(t).length;
                    default:
                        if (i) return O(t).length;
                        e = ("" + e).toLowerCase(), i = !0
                }
            }
            function d(t, e, r) {
                var i = t[e];
                t[e] = t[r], t[r] = i
            }
            function g(t, e, r, i, n) {
                if (0 === t.length) return -1;
                if ("string" == typeof r ? (i = r, r = 0) : 2147483647 < r ? r = 2147483647 : r < -2147483648 && (r = -2147483648), j(r = +r) && (r = n ? 0 : t.length - 1), r < 0 && (r = t.length + r), r >= t.length) {
                    if (n) return -1;
                    r = t.length - 1
                } else if (r < 0) {
                    if (!n) return -1;
                    r = 0
                }
                if ("string" == typeof e && (e = l.from(e, i)), l.isBuffer(e)) return 0 === e.length ? -1 : y(t, e, r, i, n);
                if ("number" == typeof e) return e &= 255, "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : y(t, [e], r, i, n);
                throw new TypeError("val must be string, number or Buffer")
            }
            function y(t, e, r, i, n) {
                var o, s = 1,
                    f = t.length,
                    a = e.length;
                if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
                    if (t.length < 2 || e.length < 2) return -1;
                    f /= s = 2, a /= 2, r /= 2
                }
                function h(t, e) {
                    return 1 === s ? t[e] : t.readUInt16BE(e * s)
                }
                if (n) {
                    var u = -1;
                    for (o = r; o < f; o++) if (h(t, o) === h(e, - 1 === u ? 0 : o - u)) {
                        if (-1 === u && (u = o), o - u + 1 === a) return u * s
                    } else -1 !== u && (o -= o - u), u = -1
                } else for (f < r + a && (r = f - a), o = r; 0 <= o; o--) {
                    for (var l = !0, c = 0; c < a; c++) if (h(t, o + c) !== h(e, c)) {
                        l = !1;
                        break
                    }
                    if (l) return o
                }
                return -1
            }
            function v(t, e, r, i) {
                r = Number(r) || 0;
                var n = t.length - r;
                i ? n < (i = Number(i)) && (i = n) : i = n;
                var o = e.length;
                if (o % 2 != 0) throw new TypeError("Invalid hex string");
                o / 2 < i && (i = o / 2);
                for (var s = 0; s < i; ++s) {
                    var f = parseInt(e.substr(2 * s, 2), 16);
                    if (j(f)) return s;
                    t[r + s] = f
                }
                return s
            }
            function b(t, e, r, i) {
                return D(function(t) {
                    for (var e = [], r = 0; r < t.length; ++r) e.push(255 & t.charCodeAt(r));
                    return e
                }(e), t, r, i)
            }
            function w(t, e, r) {
                return 0 === e && r === t.length ? i.fromByteArray(t) : i.fromByteArray(t.slice(e, r))
            }
            function m(t, e, r) {
                r = Math.min(t.length, r);
                for (var i = [], n = e; n < r;) {
                    var o, s, f, a, h = t[n],
                        u = null,
                        l = 239 < h ? 4 : 223 < h ? 3 : 191 < h ? 2 : 1;
                    if (n + l <= r) switch (l) {
                        case 1:
                            h < 128 && (u = h);
                            break;
                        case 2:
                            128 == (192 & (o = t[n + 1])) && 127 < (a = (31 & h) << 6 | 63 & o) && (u = a);
                            break;
                        case 3:
                            o = t[n + 1], s = t[n + 2], 128 == (192 & o) && 128 == (192 & s) && 2047 < (a = (15 & h) << 12 | (63 & o) << 6 | 63 & s) && (a < 55296 || 57343 < a) && (u = a);
                            break;
                        case 4:
                            o = t[n + 1], s = t[n + 2], f = t[n + 3], 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & f) && 65535 < (a = (15 & h) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & f) && a < 1114112 && (u = a)
                    }
                    null === u ? (u = 65533, l = 1) : 65535 < u && (u -= 65536, i.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), i.push(u), n += l
                }
                return function(t) {
                    var e = t.length;
                    if (e <= _) return String.fromCharCode.apply(String, t);
                    var r = "",
                        i = 0;
                    for (; i < e;) r += String.fromCharCode.apply(String, t.slice(i, i += _));
                    return r
                }(i)
            }
            r.kMaxLength = n, (l.TYPED_ARRAY_SUPPORT = function() {
                try {
                    var t = new Uint8Array(1);
                    return t.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function() {
                            return 42
                        }
                    }, 42 === t.foo()
                } catch (t) {
                    return !1
                }
            }()) || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), "undefined" != typeof Symbol && Symbol.species && l[Symbol.species] === l && Object.defineProperty(l, Symbol.species, {
                value: null,
                configurable: !0,
                enumerable: !1,
                writable: !1
            }), l.poolSize = 8192, l.from = function(t, e, r) {
                return f(t, e, r)
            }, l.prototype.__proto__ = Uint8Array.prototype, l.__proto__ = Uint8Array, l.alloc = function(t, e, r) {
                return n = e, o = r, a(i = t), i <= 0 ? s(i) : void 0 !== n ? "string" == typeof o ? s(i).fill(n, o) : s(i).fill(n) : s(i);
                var i, n, o
            }, l.allocUnsafe = function(t) {
                return h(t)
            }, l.allocUnsafeSlow = function(t) {
                return h(t)
            }, l.isBuffer = function(t) {
                return null != t && !0 === t._isBuffer
            }, l.compare = function(t, e) {
                if (!l.isBuffer(t) || !l.isBuffer(e)) throw new TypeError("Arguments must be Buffers");
                if (t === e) return 0;
                for (var r = t.length, i = e.length, n = 0, o = Math.min(r, i); n < o; ++n) if (t[n] !== e[n]) {
                    r = t[n], i = e[n];
                    break
                }
                return r < i ? -1 : i < r ? 1 : 0
            }, l.isEncoding = function(t) {
                switch (String(t).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1
                }
            }, l.concat = function(t, e) {
                if (!Array.isArray(t)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === t.length) return l.alloc(0);
                var r;
                if (void 0 === e) for (r = e = 0; r < t.length; ++r) e += t[r].length;
                var i = l.allocUnsafe(e),
                    n = 0;
                for (r = 0; r < t.length; ++r) {
                    var o = t[r];
                    if (!l.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
                    o.copy(i, n), n += o.length
                }
                return i
            }, l.byteLength = p, l.prototype._isBuffer = !0, l.prototype.swap16 = function() {
                var t = this.length;
                if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var e = 0; e < t; e += 2) d(this, e, e + 1);
                return this
            }, l.prototype.swap32 = function() {
                var t = this.length;
                if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var e = 0; e < t; e += 4) d(this, e, e + 3), d(this, e + 1, e + 2);
                return this
            }, l.prototype.swap64 = function() {
                var t = this.length;
                if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var e = 0; e < t; e += 8) d(this, e, e + 7), d(this, e + 1, e + 6), d(this, e + 2, e + 5), d(this, e + 3, e + 4);
                return this
            }, l.prototype.toString = function() {
                var t = this.length;
                return 0 === t ? "" : 0 === arguments.length ? m(this, 0, t) : function(t, e, r) {
                    var i = !1;
                    if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
                    if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                    if ((r >>>= 0) <= (e >>>= 0)) return "";
                    for (t || (t = "utf8");;) switch (t) {
                        case "hex":
                            return B(this, e, r);
                        case "utf8":
                        case "utf-8":
                            return m(this, e, r);
                        case "ascii":
                            return E(this, e, r);
                        case "latin1":
                        case "binary":
                            return S(this, e, r);
                        case "base64":
                            return w(this, e, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return T(this, e, r);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + t);
                            t = (t + "").toLowerCase(), i = !0
                    }
                }.apply(this, arguments)
            }, l.prototype.equals = function(t) {
                if (!l.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
                return this === t || 0 === l.compare(this, t)
            }, l.prototype.inspect = function() {
                var t = "",
                    e = r.INSPECT_MAX_BYTES;
                return 0 < this.length && (t = this.toString("hex", 0, e).match(/.{2}/g).join(" "), this.length > e && (t += " ... ")), "<Buffer " + t + ">"
            }, l.prototype.compare = function(t, e, r, i, n) {
                if (!l.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
                if (void 0 === e && (e = 0), void 0 === r && (r = t ? t.length : 0), void 0 === i && (i = 0), void 0 === n && (n = this.length), e < 0 || r > t.length || i < 0 || n > this.length) throw new RangeError("out of range index");
                if (n <= i && r <= e) return 0;
                if (n <= i) return -1;
                if (r <= e) return 1;
                if (this === t) return 0;
                for (var o = (n >>>= 0) - (i >>>= 0), s = (r >>>= 0) - (e >>>= 0), f = Math.min(o, s), a = this.slice(i, n), h = t.slice(e, r), u = 0; u < f; ++u) if (a[u] !== h[u]) {
                    o = a[u], s = h[u];
                    break
                }
                return o < s ? -1 : s < o ? 1 : 0
            }, l.prototype.includes = function(t, e, r) {
                return -1 !== this.indexOf(t, e, r)
            }, l.prototype.indexOf = function(t, e, r) {
                return g(this, t, e, r, !0)
            }, l.prototype.lastIndexOf = function(t, e, r) {
                return g(this, t, e, r, !1)
            }, l.prototype.write = function(t, e, r, i) {
                if (void 0 === e) i = "utf8", r = this.length, e = 0;
                else if (void 0 === r && "string" == typeof e) i = e, r = this.length, e = 0;
                else {
                    if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    e >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === i && (i = "utf8")) : (i = r, r = void 0)
                }
                var n = this.length - e;
                if ((void 0 === r || n < r) && (r = n), 0 < t.length && (r < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                i || (i = "utf8");
                for (var o, s, f, a, h, u, l, c, p, d = !1;;) switch (i) {
                    case "hex":
                        return v(this, t, e, r);
                    case "utf8":
                    case "utf-8":
                        return c = e, p = r, D(O(t, (l = this).length - c), l, c, p);
                    case "ascii":
                        return b(this, t, e, r);
                    case "latin1":
                    case "binary":
                        return b(this, t, e, r);
                    case "base64":
                        return a = this, h = e, u = r, D(C(t), a, h, u);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return s = e, f = r, D(function(t, e) {
                            for (var r, i, n, o = [], s = 0; s < t.length && !((e -= 2) < 0); ++s) r = t.charCodeAt(s), i = r >> 8, n = r % 256, o.push(n), o.push(i);
                            return o
                        }(t, (o = this).length - s), o, s, f);
                    default:
                        if (d) throw new TypeError("Unknown encoding: " + i);
                        i = ("" + i).toLowerCase(), d = !0
                }
            }, l.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            };
            var _ = 4096;

            function E(t, e, r) {
                var i = "";
                r = Math.min(t.length, r);
                for (var n = e; n < r; ++n) i += String.fromCharCode(127 & t[n]);
                return i
            }
            function S(t, e, r) {
                var i = "";
                r = Math.min(t.length, r);
                for (var n = e; n < r; ++n) i += String.fromCharCode(t[n]);
                return i
            }
            function B(t, e, r) {
                var i = t.length;
                (!e || e < 0) && (e = 0), (!r || r < 0 || i < r) && (r = i);
                for (var n = "", o = e; o < r; ++o) n += R(t[o]);
                return n
            }
            function T(t, e, r) {
                for (var i = t.slice(e, r), n = "", o = 0; o < i.length; o += 2) n += String.fromCharCode(i[o] + 256 * i[o + 1]);
                return n
            }
            function I(t, e, r) {
                if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
                if (r < t + e) throw new RangeError("Trying to access beyond buffer length")
            }
            function k(t, e, r, i, n, o) {
                if (!l.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (n < e || e < o) throw new RangeError('"value" argument is out of bounds');
                if (r + i > t.length) throw new RangeError("Index out of range")
            }
            function A(t, e, r, i, n, o) {
                if (r + i > t.length) throw new RangeError("Index out of range");
                if (r < 0) throw new RangeError("Index out of range")
            }
            function x(t, e, r, i, n) {
                return e = +e, r >>>= 0, n || A(t, 0, r, 4), o.write(t, e, r, i, 23, 4), r + 4
            }
            function L(t, e, r, i, n) {
                return e = +e, r >>>= 0, n || A(t, 0, r, 8), o.write(t, e, r, i, 52, 8), r + 8
            }
            l.prototype.slice = function(t, e) {
                var r = this.length;
                (t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : r < t && (t = r), (e = void 0 === e ? r : ~~e) < 0 ? (e += r) < 0 && (e = 0) : r < e && (e = r), e < t && (e = t);
                var i = this.subarray(t, e);
                return i.__proto__ = l.prototype, i
            }, l.prototype.readUIntLE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || I(t, e, this.length);
                for (var i = this[t], n = 1, o = 0; ++o < e && (n *= 256);) i += this[t + o] * n;
                return i
            }, l.prototype.readUIntBE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || I(t, e, this.length);
                for (var i = this[t + --e], n = 1; 0 < e && (n *= 256);) i += this[t + --e] * n;
                return i
            }, l.prototype.readUInt8 = function(t, e) {
                return t >>>= 0, e || I(t, 1, this.length), this[t]
            }, l.prototype.readUInt16LE = function(t, e) {
                return t >>>= 0, e || I(t, 2, this.length), this[t] | this[t + 1] << 8
            }, l.prototype.readUInt16BE = function(t, e) {
                return t >>>= 0, e || I(t, 2, this.length), this[t] << 8 | this[t + 1]
            }, l.prototype.readUInt32LE = function(t, e) {
                return t >>>= 0, e || I(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
            }, l.prototype.readUInt32BE = function(t, e) {
                return t >>>= 0, e || I(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
            }, l.prototype.readIntLE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || I(t, e, this.length);
                for (var i = this[t], n = 1, o = 0; ++o < e && (n *= 256);) i += this[t + o] * n;
                return (n *= 128) <= i && (i -= Math.pow(2, 8 * e)), i
            }, l.prototype.readIntBE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || I(t, e, this.length);
                for (var i = e, n = 1, o = this[t + --i]; 0 < i && (n *= 256);) o += this[t + --i] * n;
                return (n *= 128) <= o && (o -= Math.pow(2, 8 * e)), o
            }, l.prototype.readInt8 = function(t, e) {
                return t >>>= 0, e || I(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            }, l.prototype.readInt16LE = function(t, e) {
                t >>>= 0, e || I(t, 2, this.length);
                var r = this[t] | this[t + 1] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, l.prototype.readInt16BE = function(t, e) {
                t >>>= 0, e || I(t, 2, this.length);
                var r = this[t + 1] | this[t] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, l.prototype.readInt32LE = function(t, e) {
                return t >>>= 0, e || I(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
            }, l.prototype.readInt32BE = function(t, e) {
                return t >>>= 0, e || I(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
            }, l.prototype.readFloatLE = function(t, e) {
                return t >>>= 0, e || I(t, 4, this.length), o.read(this, t, !0, 23, 4)
            }, l.prototype.readFloatBE = function(t, e) {
                return t >>>= 0, e || I(t, 4, this.length), o.read(this, t, !1, 23, 4)
            }, l.prototype.readDoubleLE = function(t, e) {
                return t >>>= 0, e || I(t, 8, this.length), o.read(this, t, !0, 52, 8)
            }, l.prototype.readDoubleBE = function(t, e) {
                return t >>>= 0, e || I(t, 8, this.length), o.read(this, t, !1, 52, 8)
            }, l.prototype.writeUIntLE = function(t, e, r, i) {
                (t = +t, e >>>= 0, r >>>= 0, i) || k(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                var n = 1,
                    o = 0;
                for (this[e] = 255 & t; ++o < r && (n *= 256);) this[e + o] = t / n & 255;
                return e + r
            }, l.prototype.writeUIntBE = function(t, e, r, i) {
                (t = +t, e >>>= 0, r >>>= 0, i) || k(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                var n = r - 1,
                    o = 1;
                for (this[e + n] = 255 & t; 0 <= --n && (o *= 256);) this[e + n] = t / o & 255;
                return e + r
            }, l.prototype.writeUInt8 = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 1, 255, 0), this[e] = 255 & t, e + 1
            }, l.prototype.writeUInt16LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 2, 65535, 0), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2
            }, l.prototype.writeUInt16BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2
            }, l.prototype.writeUInt32LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t, e + 4
            }, l.prototype.writeUInt32BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4
            }, l.prototype.writeIntLE = function(t, e, r, i) {
                if (t = +t, e >>>= 0, !i) {
                    var n = Math.pow(2, 8 * r - 1);
                    k(this, t, e, r, n - 1, - n)
                }
                var o = 0,
                    s = 1,
                    f = 0;
                for (this[e] = 255 & t; ++o < r && (s *= 256);) t < 0 && 0 === f && 0 !== this[e + o - 1] && (f = 1), this[e + o] = (t / s >> 0) - f & 255;
                return e + r
            }, l.prototype.writeIntBE = function(t, e, r, i) {
                if (t = +t, e >>>= 0, !i) {
                    var n = Math.pow(2, 8 * r - 1);
                    k(this, t, e, r, n - 1, - n)
                }
                var o = r - 1,
                    s = 1,
                    f = 0;
                for (this[e + o] = 255 & t; 0 <= --o && (s *= 256);) t < 0 && 0 === f && 0 !== this[e + o + 1] && (f = 1), this[e + o] = (t / s >> 0) - f & 255;
                return e + r
            }, l.prototype.writeInt8 = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 1, 127, - 128), t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1
            }, l.prototype.writeInt16LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 2, 32767, - 32768), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2
            }, l.prototype.writeInt16BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 2, 32767, - 32768), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2
            }, l.prototype.writeInt32LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 4, 2147483647, - 2147483648), this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4
            }, l.prototype.writeInt32BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || k(this, t, e, 4, 2147483647, - 2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4
            }, l.prototype.writeFloatLE = function(t, e, r) {
                return x(this, t, e, !0, r)
            }, l.prototype.writeFloatBE = function(t, e, r) {
                return x(this, t, e, !1, r)
            }, l.prototype.writeDoubleLE = function(t, e, r) {
                return L(this, t, e, !0, r)
            }, l.prototype.writeDoubleBE = function(t, e, r) {
                return L(this, t, e, !1, r)
            }, l.prototype.copy = function(t, e, r, i) {
                if (r || (r = 0), i || 0 === i || (i = this.length), e >= t.length && (e = t.length), e || (e = 0), 0 < i && i < r && (i = r), i === r) return 0;
                if (0 === t.length || 0 === this.length) return 0;
                if (e < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length), t.length - e < i - r && (i = t.length - e + r);
                var n, o = i - r;
                if (this === t && r < e && e < i) for (n = o - 1; 0 <= n; --n) t[n + e] = this[n + r];
                else if (o < 1e3) for (n = 0; n < o; ++n) t[n + e] = this[n + r];
                else Uint8Array.prototype.set.call(t, this.subarray(r, r + o), e);
                return o
            }, l.prototype.fill = function(t, e, r, i) {
                if ("string" == typeof t) {
                    if ("string" == typeof e ? (i = e, e = 0, r = this.length) : "string" == typeof r && (i = r, r = this.length), 1 === t.length) {
                        var n = t.charCodeAt(0);
                        n < 256 && (t = n)
                    }
                    if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
                    if ("string" == typeof i && !l.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
                } else "number" == typeof t && (t &= 255);
                if (e < 0 || this.length < e || this.length < r) throw new RangeError("Out of range index");
                if (r <= e) return this;
                var o;
                if (e >>>= 0, r = void 0 === r ? this.length : r >>> 0, t || (t = 0), "number" == typeof t) for (o = e; o < r; ++o) this[o] = t;
                else {
                    var s = l.isBuffer(t) ? t : new l(t, i),
                        f = s.length;
                    for (o = 0; o < r - e; ++o) this[o + e] = s[o % f]
                }
                return this
            };
            var U = /[^+/0-9A-Za-z-_]/g;

            function R(t) {
                return t < 16 ? "0" + t.toString(16) : t.toString(16)
            }
            function O(t, e) {
                var r;
                e = e || 1 / 0;
                for (var i = t.length, n = null, o = [], s = 0; s < i; ++s) {
                    if (55295 < (r = t.charCodeAt(s)) && r < 57344) {
                        if (!n) {
                            if (56319 < r) {
                                -1 < (e -= 3) && o.push(239, 191, 189);
                                continue
                            }
                            if (s + 1 === i) {
                                -1 < (e -= 3) && o.push(239, 191, 189);
                                continue
                            }
                            n = r;
                            continue
                        }
                        if (r < 56320) {
                            -1 < (e -= 3) && o.push(239, 191, 189), n = r;
                            continue
                        }
                        r = 65536 + (n - 55296 << 10 | r - 56320)
                    } else n && -1 < (e -= 3) && o.push(239, 191, 189);
                    if (n = null, r < 128) {
                        if ((e -= 1) < 0) break;
                        o.push(r)
                    } else if (r < 2048) {
                        if ((e -= 2) < 0) break;
                        o.push(r >> 6 | 192, 63 & r | 128)
                    } else if (r < 65536) {
                        if ((e -= 3) < 0) break;
                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                    } else {
                        if (!(r < 1114112)) throw new Error("Invalid code point");
                        if ((e -= 4) < 0) break;
                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                    }
                }
                return o
            }
            function C(t) {
                return i.toByteArray(function(t) {
                    if ((t = t.trim().replace(U, "")).length < 2) return "";
                    for (; t.length % 4 != 0;) t += "=";
                    return t
                }(t))
            }
            function D(t, e, r, i) {
                for (var n = 0; n < i && !(n + r >= e.length || n >= t.length); ++n) e[n + r] = t[n];
                return n
            }
            function M(t) {
                return t instanceof ArrayBuffer || null != t && null != t.constructor && "ArrayBuffer" === t.constructor.name && "number" == typeof t.byteLength
            }
            function N(t) {
                return "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(t)
            }
            function j(t) {
                return t != t
            }
        }, {
            "base64-js": 16,
            ieee754: 57
        }],
        41: [function(e, t, r) {
            var i, n;
            i = this, n = function(a) {
                "use strict";
                var d = function(t, e, r) {
                    if (void 0 === t && (t = d.DEFAULT_CAPACITY), void 0 === e && (e = d.DEFAULT_ENDIAN), void 0 === r && (r = d.DEFAULT_NOASSERT), !r) {
                        if ((t |= 0) < 0) throw RangeError("Illegal capacity");
                        e = !! e, r = !! r
                    }
                    this.buffer = 0 === t ? o : new ArrayBuffer(t), this.view = 0 === t ? null : new Uint8Array(this.buffer), this.offset = 0, this.markedOffset = -1, this.limit = t, this.littleEndian = e, this.noAssert = r
                };
                d.VERSION = "5.0.1", d.LITTLE_ENDIAN = !0, d.BIG_ENDIAN = !1, d.DEFAULT_CAPACITY = 16, d.DEFAULT_ENDIAN = d.BIG_ENDIAN, d.DEFAULT_NOASSERT = !1, d.Long = a || null;
                var s = d.prototype;
                s.__isByteBuffer__, Object.defineProperty(s, "__isByteBuffer__", {
                    value: !0,
                    enumerable: !1,
                    configurable: !1
                });
                var o = new ArrayBuffer(0),
                    r = String.fromCharCode;

                function f(t) {
                    var e = 0;
                    return function() {
                        return e < t.length ? t.charCodeAt(e++) : null
                    }
                }
                function h() {
                    var t = [],
                        e = [];
                    return function() {
                        if (0 === arguments.length) return e.join("") + r.apply(String, t);
                        1024 < t.length + arguments.length && (e.push(r.apply(String, t)), t.length = 0), Array.prototype.push.apply(t, arguments)
                    }
                }
                function i(t, e, r, i, n) {
                    var o, s, f = 8 * n - i - 1,
                        a = (1 << f) - 1,
                        h = a >> 1,
                        u = -7,
                        l = r ? n - 1 : 0,
                        c = r ? -1 : 1,
                        p = t[e + l];
                    for (l += c, o = p & (1 << -u) - 1, p >>= -u, u += f; 0 < u; o = 256 * o + t[e + l], l += c, u -= 8);
                    for (s = o & (1 << -u) - 1, o >>= -u, u += i; 0 < u; s = 256 * s + t[e + l], l += c, u -= 8);
                    if (0 === o) o = 1 - h;
                    else {
                        if (o === a) return s ? NaN : 1 / 0 * (p ? -1 : 1);
                        s += Math.pow(2, i), o -= h
                    }
                    return (p ? -1 : 1) * s * Math.pow(2, o - i)
                }
                function n(t, e, r, i, n, o) {
                    var s, f, a, h = 8 * o - n - 1,
                        u = (1 << h) - 1,
                        l = u >> 1,
                        c = 23 === n ? Math.pow(2, - 24) - Math.pow(2, - 77) : 0,
                        p = i ? 0 : o - 1,
                        d = i ? 1 : -1,
                        g = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
                    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (f = isNaN(e) ? 1 : 0, s = u) : (s = Math.floor(Math.log(e) / Math.LN2), e * (a = Math.pow(2, - s)) < 1 && (s--, a *= 2), 2 <= (e += 1 <= s + l ? c / a : c * Math.pow(2, 1 - l)) * a && (s++, a /= 2), u <= s + l ? (f = 0, s = u) : 1 <= s + l ? (f = (e * a - 1) * Math.pow(2, n), s += l) : (f = e * Math.pow(2, l - 1) * Math.pow(2, n), s = 0)); 8 <= n; t[r + p] = 255 & f, p += d, f /= 256, n -= 8);
                    for (s = s << n | f, h += n; 0 < h; t[r + p] = 255 & s, p += d, s /= 256, h -= 8);
                    t[r + p - d] |= 128 * g
                }
                d.accessor = function() {
                    return Uint8Array
                }, d.allocate = function(t, e, r) {
                    return new d(t, e, r)
                }, d.concat = function(t, e, r, i) {
                    "boolean" != typeof e && "string" == typeof e || (i = r, r = e, e = void 0);
                    for (var n, o = 0, s = 0, f = t.length; s < f; ++s) d.isByteBuffer(t[s]) || (t[s] = d.wrap(t[s], e)), 0 < (n = t[s].limit - t[s].offset) && (o += n);
                    if (0 === o) return new d(0, r, i);
                    var a, h = new d(o, r, i);
                    for (s = 0; s < f;)(n = (a = t[s++]).limit - a.offset) <= 0 || (h.view.set(a.view.subarray(a.offset, a.limit), h.offset), h.offset += n);
                    return h.limit = h.offset, h.offset = 0, h
                }, d.isByteBuffer = function(t) {
                    return !0 === (t && t.__isByteBuffer__)
                }, d.type = function() {
                    return ArrayBuffer
                }, d.wrap = function(t, e, r, i) {
                    if ("string" != typeof e && (i = r, r = e, e = void 0), "string" == typeof t) switch (void 0 === e && (e = "utf8"), e) {
                        case "base64":
                            return d.fromBase64(t, r);
                        case "hex":
                            return d.fromHex(t, r);
                        case "binary":
                            return d.fromBinary(t, r);
                        case "utf8":
                            return d.fromUTF8(t, r);
                        case "debug":
                            return d.fromDebug(t, r);
                        default:
                            throw Error("Unsupported encoding: " + e)
                    }
                    if (null === t || "object" != typeof t) throw TypeError("Illegal buffer");
                    var n;
                    if (d.isByteBuffer(t)) return (n = s.clone.call(t)).markedOffset = -1, n;
                    if (t instanceof Uint8Array) n = new d(0, r, i), 0 < t.length && (n.buffer = t.buffer, n.offset = t.byteOffset, n.limit = t.byteOffset + t.byteLength, n.view = new Uint8Array(t.buffer));
                    else if (t instanceof ArrayBuffer) n = new d(0, r, i), 0 < t.byteLength && (n.buffer = t, n.offset = 0, n.limit = t.byteLength, n.view = 0 < t.byteLength ? new Uint8Array(t) : null);
                    else {
                        if ("[object Array]" !== Object.prototype.toString.call(t)) throw TypeError("Illegal buffer");
                        (n = new d(t.length, r, i)).limit = t.length;
                        for (var o = 0; o < t.length; ++o) n.view[o] = t[o]
                    }
                    return n
                }, s.writeBitSet = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if (!(t instanceof Array)) throw TypeError("Illegal BitSet: Not an array");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    var i, n = e,
                        o = t.length,
                        s = o >> 3,
                        f = 0;
                    for (e += this.writeVarint32(o, e); s--;) i = 1 & !! t[f++] | (1 & !! t[f++]) << 1 | (1 & !! t[f++]) << 2 | (1 & !! t[f++]) << 3 | (1 & !! t[f++]) << 4 | (1 & !! t[f++]) << 5 | (1 & !! t[f++]) << 6 | (1 & !! t[f++]) << 7, this.writeByte(i, e++);
                    if (f < o) {
                        var a = 0;
                        for (i = 0; f < o;) i |= (1 & !! t[f++]) << a++;
                        this.writeByte(i, e++)
                    }
                    return r ? (this.offset = e, this) : e - n
                }, s.readBitSet = function(t) {
                    var e = void 0 === t;
                    e && (t = this.offset);
                    var r, i = this.readVarint32(t),
                        n = i.value,
                        o = n >> 3,
                        s = 0,
                        f = [];
                    for (t += i.length; o--;) r = this.readByte(t++), f[s++] = !! (1 & r), f[s++] = !! (2 & r), f[s++] = !! (4 & r), f[s++] = !! (8 & r), f[s++] = !! (16 & r), f[s++] = !! (32 & r), f[s++] = !! (64 & r), f[s++] = !! (128 & r);
                    if (s < n) {
                        var a = 0;
                        for (r = this.readByte(t++); s < n;) f[s++] = !! (r >> a++ & 1)
                    }
                    return e && (this.offset = t), f
                }, s.readBytes = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + t > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+" + t + ") <= " + this.buffer.byteLength)
                    }
                    var i = this.slice(e, e + t);
                    return r && (this.offset += t), i
                }, s.writeBytes = s.append, s.writeInt8 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal value: " + t + " (not an integer)");
                        if (t |= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    e += 1;
                    var i = this.buffer.byteLength;
                    return i < e && this.resize((i *= 2) > e ? i : e), e -= 1, this.view[e] = t, r && (this.offset += 1), this
                }, s.writeByte = s.writeInt8, s.readInt8 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+1) <= " + this.buffer.byteLength)
                    }
                    var r = this.view[t];
                    return 128 == (128 & r) && (r = -(255 - r + 1)), e && (this.offset += 1), r
                }, s.readByte = s.readInt8, s.writeUint8 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal value: " + t + " (not an integer)");
                        if (t >>>= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    e += 1;
                    var i = this.buffer.byteLength;
                    return i < e && this.resize((i *= 2) > e ? i : e), e -= 1, this.view[e] = t, r && (this.offset += 1), this
                }, s.writeUInt8 = s.writeUint8, s.readUint8 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+1) <= " + this.buffer.byteLength)
                    }
                    var r = this.view[t];
                    return e && (this.offset += 1), r
                }, s.readUInt8 = s.readUint8, s.writeInt16 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal value: " + t + " (not an integer)");
                        if (t |= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    e += 2;
                    var i = this.buffer.byteLength;
                    return i < e && this.resize((i *= 2) > e ? i : e), e -= 2, this.littleEndian ? (this.view[e + 1] = (65280 & t) >>> 8, this.view[e] = 255 & t) : (this.view[e] = (65280 & t) >>> 8, this.view[e + 1] = 255 & t), r && (this.offset += 2), this
                }, s.writeShort = s.writeInt16, s.readInt16 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+2) <= " + this.buffer.byteLength)
                    }
                    var r = 0;
                    return this.littleEndian ? (r = this.view[t], r |= this.view[t + 1] << 8) : (r = this.view[t] << 8, r |= this.view[t + 1]), 32768 == (32768 & r) && (r = -(65535 - r + 1)), e && (this.offset += 2), r
                }, s.readShort = s.readInt16, s.writeUint16 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal value: " + t + " (not an integer)");
                        if (t >>>= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    e += 2;
                    var i = this.buffer.byteLength;
                    return i < e && this.resize((i *= 2) > e ? i : e), e -= 2, this.littleEndian ? (this.view[e + 1] = (65280 & t) >>> 8, this.view[e] = 255 & t) : (this.view[e] = (65280 & t) >>> 8, this.view[e + 1] = 255 & t), r && (this.offset += 2), this
                }, s.writeUInt16 = s.writeUint16, s.readUint16 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+2) <= " + this.buffer.byteLength)
                    }
                    var r = 0;
                    return this.littleEndian ? (r = this.view[t], r |= this.view[t + 1] << 8) : (r = this.view[t] << 8, r |= this.view[t + 1]), e && (this.offset += 2), r
                }, s.readUInt16 = s.readUint16, s.writeInt32 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal value: " + t + " (not an integer)");
                        if (t |= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    e += 4;
                    var i = this.buffer.byteLength;
                    return i < e && this.resize((i *= 2) > e ? i : e), e -= 4, this.littleEndian ? (this.view[e + 3] = t >>> 24 & 255, this.view[e + 2] = t >>> 16 & 255, this.view[e + 1] = t >>> 8 & 255, this.view[e] = 255 & t) : (this.view[e] = t >>> 24 & 255, this.view[e + 1] = t >>> 16 & 255, this.view[e + 2] = t >>> 8 & 255, this.view[e + 3] = 255 & t), r && (this.offset += 4), this
                }, s.writeInt = s.writeInt32, s.readInt32 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+4) <= " + this.buffer.byteLength)
                    }
                    var r = 0;
                    return this.littleEndian ? (r = this.view[t + 2] << 16, r |= this.view[t + 1] << 8, r |= this.view[t], r += this.view[t + 3] << 24 >>> 0) : (r = this.view[t + 1] << 16, r |= this.view[t + 2] << 8, r |= this.view[t + 3], r += this.view[t] << 24 >>> 0), r |= 0, e && (this.offset += 4), r
                }, s.readInt = s.readInt32, s.writeUint32 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal value: " + t + " (not an integer)");
                        if (t >>>= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    e += 4;
                    var i = this.buffer.byteLength;
                    return i < e && this.resize((i *= 2) > e ? i : e), e -= 4, this.littleEndian ? (this.view[e + 3] = t >>> 24 & 255, this.view[e + 2] = t >>> 16 & 255, this.view[e + 1] = t >>> 8 & 255, this.view[e] = 255 & t) : (this.view[e] = t >>> 24 & 255, this.view[e + 1] = t >>> 16 & 255, this.view[e + 2] = t >>> 8 & 255, this.view[e + 3] = 255 & t), r && (this.offset += 4), this
                }, s.writeUInt32 = s.writeUint32, s.readUint32 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+4) <= " + this.buffer.byteLength)
                    }
                    var r = 0;
                    return this.littleEndian ? (r = this.view[t + 2] << 16, r |= this.view[t + 1] << 8, r |= this.view[t], r += this.view[t + 3] << 24 >>> 0) : (r = this.view[t + 1] << 16, r |= this.view[t + 2] << 8, r |= this.view[t + 3], r += this.view[t] << 24 >>> 0), e && (this.offset += 4), r
                }, s.readUInt32 = s.readUint32, a && (s.writeInt64 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" == typeof t) t = a.fromNumber(t);
                        else if ("string" == typeof t) t = a.fromString(t);
                        else if (!(t && t instanceof a)) throw TypeError("Illegal value: " + t + " (not an integer or Long)");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    "number" == typeof t ? t = a.fromNumber(t) : "string" == typeof t && (t = a.fromString(t)), e += 8;
                    var i = this.buffer.byteLength;
                    i < e && this.resize((i *= 2) > e ? i : e), e -= 8;
                    var n = t.low,
                        o = t.high;
                    return this.littleEndian ? (this.view[e + 3] = n >>> 24 & 255, this.view[e + 2] = n >>> 16 & 255, this.view[e + 1] = n >>> 8 & 255, this.view[e] = 255 & n, e += 4, this.view[e + 3] = o >>> 24 & 255, this.view[e + 2] = o >>> 16 & 255, this.view[e + 1] = o >>> 8 & 255, this.view[e] = 255 & o) : (this.view[e] = o >>> 24 & 255, this.view[e + 1] = o >>> 16 & 255, this.view[e + 2] = o >>> 8 & 255, this.view[e + 3] = 255 & o, e += 4, this.view[e] = n >>> 24 & 255, this.view[e + 1] = n >>> 16 & 255, this.view[e + 2] = n >>> 8 & 255, this.view[e + 3] = 255 & n), r && (this.offset += 8), this
                }, s.writeLong = s.writeInt64, s.readInt64 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+8) <= " + this.buffer.byteLength)
                    }
                    var r = 0,
                        i = 0;
                    this.littleEndian ? (r = this.view[t + 2] << 16, r |= this.view[t + 1] << 8, r |= this.view[t], r += this.view[t + 3] << 24 >>> 0, t += 4, i = this.view[t + 2] << 16, i |= this.view[t + 1] << 8, i |= this.view[t], i += this.view[t + 3] << 24 >>> 0) : (i = this.view[t + 1] << 16, i |= this.view[t + 2] << 8, i |= this.view[t + 3], i += this.view[t] << 24 >>> 0, t += 4, r = this.view[t + 1] << 16, r |= this.view[t + 2] << 8, r |= this.view[t + 3], r += this.view[t] << 24 >>> 0);
                    var n = new a(r, i, !1);
                    return e && (this.offset += 8), n
                }, s.readLong = s.readInt64, s.writeUint64 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" == typeof t) t = a.fromNumber(t);
                        else if ("string" == typeof t) t = a.fromString(t);
                        else if (!(t && t instanceof a)) throw TypeError("Illegal value: " + t + " (not an integer or Long)");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    "number" == typeof t ? t = a.fromNumber(t) : "string" == typeof t && (t = a.fromString(t)), e += 8;
                    var i = this.buffer.byteLength;
                    i < e && this.resize((i *= 2) > e ? i : e), e -= 8;
                    var n = t.low,
                        o = t.high;
                    return this.littleEndian ? (this.view[e + 3] = n >>> 24 & 255, this.view[e + 2] = n >>> 16 & 255, this.view[e + 1] = n >>> 8 & 255, this.view[e] = 255 & n, e += 4, this.view[e + 3] = o >>> 24 & 255, this.view[e + 2] = o >>> 16 & 255, this.view[e + 1] = o >>> 8 & 255, this.view[e] = 255 & o) : (this.view[e] = o >>> 24 & 255, this.view[e + 1] = o >>> 16 & 255, this.view[e + 2] = o >>> 8 & 255, this.view[e + 3] = 255 & o, e += 4, this.view[e] = n >>> 24 & 255, this.view[e + 1] = n >>> 16 & 255, this.view[e + 2] = n >>> 8 & 255, this.view[e + 3] = 255 & n), r && (this.offset += 8), this
                }, s.writeUInt64 = s.writeUint64, s.readUint64 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+8) <= " + this.buffer.byteLength)
                    }
                    var r = 0,
                        i = 0;
                    this.littleEndian ? (r = this.view[t + 2] << 16, r |= this.view[t + 1] << 8, r |= this.view[t], r += this.view[t + 3] << 24 >>> 0, t += 4, i = this.view[t + 2] << 16, i |= this.view[t + 1] << 8, i |= this.view[t], i += this.view[t + 3] << 24 >>> 0) : (i = this.view[t + 1] << 16, i |= this.view[t + 2] << 8, i |= this.view[t + 3], i += this.view[t] << 24 >>> 0, t += 4, r = this.view[t + 1] << 16, r |= this.view[t + 2] << 8, r |= this.view[t + 3], r += this.view[t] << 24 >>> 0);
                    var n = new a(r, i, !0);
                    return e && (this.offset += 8), n
                }, s.readUInt64 = s.readUint64), s.writeFloat32 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t) throw TypeError("Illegal value: " + t + " (not a number)");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    e += 4;
                    var i = this.buffer.byteLength;
                    return i < e && this.resize((i *= 2) > e ? i : e), e -= 4, n(this.view, t, e, this.littleEndian, 23, 4), r && (this.offset += 4), this
                }, s.writeFloat = s.writeFloat32, s.readFloat32 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+4) <= " + this.buffer.byteLength)
                    }
                    var r = i(this.view, t, this.littleEndian, 23, 4);
                    return e && (this.offset += 4), r
                }, s.readFloat = s.readFloat32, s.writeFloat64 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t) throw TypeError("Illegal value: " + t + " (not a number)");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    e += 8;
                    var i = this.buffer.byteLength;
                    return i < e && this.resize((i *= 2) > e ? i : e), e -= 8, n(this.view, t, e, this.littleEndian, 52, 8), r && (this.offset += 8), this
                }, s.writeDouble = s.writeFloat64, s.readFloat64 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+8) <= " + this.buffer.byteLength)
                    }
                    var r = i(this.view, t, this.littleEndian, 52, 8);
                    return e && (this.offset += 8), r
                }, s.readDouble = s.readFloat64, d.MAX_VARINT32_BYTES = 5, d.calculateVarint32 = function(t) {
                    return (t >>>= 0) < 128 ? 1 : t < 16384 ? 2 : t < 1 << 21 ? 3 : t < 1 << 28 ? 4 : 5
                }, d.zigZagEncode32 = function(t) {
                    return ((t |= 0) << 1 ^ t >> 31) >>> 0
                }, d.zigZagDecode32 = function(t) {
                    return t >>> 1 ^ -(1 & t) | 0
                }, s.writeVarint32 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal value: " + t + " (not an integer)");
                        if (t |= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    var i, n = d.calculateVarint32(t);
                    e += n;
                    var o = this.buffer.byteLength;
                    for (o < e && this.resize((o *= 2) > e ? o : e), e -= n, t >>>= 0; 128 <= t;) i = 127 & t | 128, this.view[e++] = i, t >>>= 7;
                    return this.view[e++] = t, r ? (this.offset = e, this) : n
                }, s.writeVarint32ZigZag = function(t, e) {
                    return this.writeVarint32(d.zigZagEncode32(t), e)
                }, s.readVarint32 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+1) <= " + this.buffer.byteLength)
                    }
                    var r, i = 0,
                        n = 0;
                    do {
                        if (!this.noAssert && t > this.limit) {
                            var o = Error("Truncated");
                            throw o.truncated = !0, o
                        }
                        r = this.view[t++], i < 5 && (n |= (127 & r) << 7 * i), ++i
                    } while (0 != (128 & r));
                    return n |= 0, e ? (this.offset = t, n) : {
                        value: n,
                        length: i
                    }
                }, s.readVarint32ZigZag = function(t) {
                    var e = this.readVarint32(t);
                    return "object" == typeof e ? e.value = d.zigZagDecode32(e.value) : e = d.zigZagDecode32(e), e
                }, a && (d.MAX_VARINT64_BYTES = 10, d.calculateVarint64 = function(t) {
                    "number" == typeof t ? t = a.fromNumber(t) : "string" == typeof t && (t = a.fromString(t));
                    var e = t.toInt() >>> 0,
                        r = t.shiftRightUnsigned(28).toInt() >>> 0,
                        i = t.shiftRightUnsigned(56).toInt() >>> 0;
                    return 0 == i ? 0 == r ? e < 16384 ? e < 128 ? 1 : 2 : e < 1 << 21 ? 3 : 4 : r < 16384 ? r < 128 ? 5 : 6 : r < 1 << 21 ? 7 : 8 : i < 128 ? 9 : 10
                }, d.zigZagEncode64 = function(t) {
                    return "number" == typeof t ? t = a.fromNumber(t, !1) : "string" == typeof t ? t = a.fromString(t, !1) : !1 !== t.unsigned && (t = t.toSigned()), t.shiftLeft(1).xor(t.shiftRight(63)).toUnsigned()
                }, d.zigZagDecode64 = function(t) {
                    return "number" == typeof t ? t = a.fromNumber(t, !1) : "string" == typeof t ? t = a.fromString(t, !1) : !1 !== t.unsigned && (t = t.toSigned()), t.shiftRightUnsigned(1).xor(t.and(a.ONE).toSigned().negate()).toSigned()
                }, s.writeVarint64 = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("number" == typeof t) t = a.fromNumber(t);
                        else if ("string" == typeof t) t = a.fromString(t);
                        else if (!(t && t instanceof a)) throw TypeError("Illegal value: " + t + " (not an integer or Long)");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    "number" == typeof t ? t = a.fromNumber(t, !1) : "string" == typeof t ? t = a.fromString(t, !1) : !1 !== t.unsigned && (t = t.toSigned());
                    var i = d.calculateVarint64(t),
                        n = t.toInt() >>> 0,
                        o = t.shiftRightUnsigned(28).toInt() >>> 0,
                        s = t.shiftRightUnsigned(56).toInt() >>> 0;
                    e += i;
                    var f = this.buffer.byteLength;
                    switch (f < e && this.resize((f *= 2) > e ? f : e), e -= i, i) {
                        case 10:
                            this.view[e + 9] = s >>> 7 & 1;
                        case 9:
                            this.view[e + 8] = 9 !== i ? 128 | s : 127 & s;
                        case 8:
                            this.view[e + 7] = 8 !== i ? o >>> 21 | 128 : o >>> 21 & 127;
                        case 7:
                            this.view[e + 6] = 7 !== i ? o >>> 14 | 128 : o >>> 14 & 127;
                        case 6:
                            this.view[e + 5] = 6 !== i ? o >>> 7 | 128 : o >>> 7 & 127;
                        case 5:
                            this.view[e + 4] = 5 !== i ? 128 | o : 127 & o;
                        case 4:
                            this.view[e + 3] = 4 !== i ? n >>> 21 | 128 : n >>> 21 & 127;
                        case 3:
                            this.view[e + 2] = 3 !== i ? n >>> 14 | 128 : n >>> 14 & 127;
                        case 2:
                            this.view[e + 1] = 2 !== i ? n >>> 7 | 128 : n >>> 7 & 127;
                        case 1:
                            this.view[e] = 1 !== i ? 128 | n : 127 & n
                    }
                    return r ? (this.offset += i, this) : i
                }, s.writeVarint64ZigZag = function(t, e) {
                    return this.writeVarint64(d.zigZagEncode64(t), e)
                }, s.readVarint64 = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+1) <= " + this.buffer.byteLength)
                    }
                    var r = t,
                        i = 0,
                        n = 0,
                        o = 0,
                        s = 0;
                    if (i = 127 & (s = this.view[t++]), 128 & s && (i |= (127 & (s = this.view[t++])) << 7, (128 & s || this.noAssert && void 0 === s) && (i |= (127 & (s = this.view[t++])) << 14, (128 & s || this.noAssert && void 0 === s) && (i |= (127 & (s = this.view[t++])) << 21, (128 & s || this.noAssert && void 0 === s) && (n = 127 & (s = this.view[t++]), (128 & s || this.noAssert && void 0 === s) && (n |= (127 & (s = this.view[t++])) << 7, (128 & s || this.noAssert && void 0 === s) && (n |= (127 & (s = this.view[t++])) << 14, (128 & s || this.noAssert && void 0 === s) && (n |= (127 & (s = this.view[t++])) << 21, (128 & s || this.noAssert && void 0 === s) && (o = 127 & (s = this.view[t++]), (128 & s || this.noAssert && void 0 === s) && (o |= (127 & (s = this.view[t++])) << 7, 128 & s || this.noAssert && void 0 === s)))))))))) throw Error("Buffer overrun");
                    var f = a.fromBits(i | n << 28, n >>> 4 | o << 24, !1);
                    return e ? (this.offset = t, f) : {
                        value: f,
                        length: t - r
                    }
                }, s.readVarint64ZigZag = function(t) {
                    var e = this.readVarint64(t);
                    return e && e.value instanceof a ? e.value = d.zigZagDecode64(e.value) : e = d.zigZagDecode64(e), e
                }), s.writeCString = function(t, e) {
                    var r = void 0 === e;
                    r && (e = this.offset);
                    var i, n = t.length;
                    if (!this.noAssert) {
                        if ("string" != typeof t) throw TypeError("Illegal str: Not a string");
                        for (i = 0; i < n; ++i) if (0 === t.charCodeAt(i)) throw RangeError("Illegal str: Contains NULL-characters");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    n = c.calculateUTF16asUTF8(f(t))[1], e += n + 1;
                    var o = this.buffer.byteLength;
                    return o < e && this.resize((o *= 2) > e ? o : e), e -= n + 1, c.encodeUTF16toUTF8(f(t), function(t) {
                        this.view[e++] = t
                    }.bind(this)), this.view[e++] = 0, r ? (this.offset = e, this) : n
                }, s.readCString = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+1) <= " + this.buffer.byteLength)
                    }
                    var r, i = t,
                        n = -1;
                    return c.decodeUTF8toUTF16(function() {
                        if (0 === n) return null;
                        if (t >= this.limit) throw RangeError("Illegal range: Truncated data, " + t + " < " + this.limit);
                        return 0 === (n = this.view[t++]) ? null : n
                    }.bind(this), r = h(), !0), e ? (this.offset = t, r()) : {
                        string: r(),
                        length: t - i
                    }
                }, s.writeIString = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("string" != typeof t) throw TypeError("Illegal str: Not a string");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    var i, n = e;
                    i = c.calculateUTF16asUTF8(f(t), this.noAssert)[1], e += 4 + i;
                    var o = this.buffer.byteLength;
                    if (o < e && this.resize((o *= 2) > e ? o : e), e -= 4 + i, this.littleEndian ? (this.view[e + 3] = i >>> 24 & 255, this.view[e + 2] = i >>> 16 & 255, this.view[e + 1] = i >>> 8 & 255, this.view[e] = 255 & i) : (this.view[e] = i >>> 24 & 255, this.view[e + 1] = i >>> 16 & 255, this.view[e + 2] = i >>> 8 & 255, this.view[e + 3] = 255 & i), e += 4, c.encodeUTF16toUTF8(f(t), function(t) {
                        this.view[e++] = t
                    }.bind(this)), e !== n + 4 + i) throw RangeError("Illegal range: Truncated data, " + e + " == " + (e + 4 + i));
                    return r ? (this.offset = e, this) : e - n
                }, s.readIString = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+4) <= " + this.buffer.byteLength)
                    }
                    var r = t,
                        i = this.readUint32(t),
                        n = this.readUTF8String(i, d.METRICS_BYTES, t += 4);
                    return t += n.length, e ? (this.offset = t, n.string) : {
                        string: n.string,
                        length: t - r
                    }
                }, d.METRICS_CHARS = "c", d.METRICS_BYTES = "b", s.writeUTF8String = function(t, e) {
                    var r, i = void 0 === e;
                    if (i && (e = this.offset), !this.noAssert) {
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    var n = e;
                    r = c.calculateUTF16asUTF8(f(t))[1], e += r;
                    var o = this.buffer.byteLength;
                    return o < e && this.resize((o *= 2) > e ? o : e), e -= r, c.encodeUTF16toUTF8(f(t), function(t) {
                        this.view[e++] = t
                    }.bind(this)), i ? (this.offset = e, this) : e - n
                }, s.writeString = s.writeUTF8String, d.calculateUTF8Chars = function(t) {
                    return c.calculateUTF16asUTF8(f(t))[0]
                }, d.calculateUTF8Bytes = function(t) {
                    return c.calculateUTF16asUTF8(f(t))[1]
                }, d.calculateString = d.calculateUTF8Bytes, s.readUTF8String = function(t, e, r) {
                    "number" == typeof e && (r = e, e = void 0);
                    var i = void 0 === r;
                    if (i && (r = this.offset), void 0 === e && (e = d.METRICS_CHARS), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal length: " + t + " (not an integer)");
                        if (t |= 0, "number" != typeof r || r % 1 != 0) throw TypeError("Illegal offset: " + r + " (not an integer)");
                        if ((r >>>= 0) < 0 || r + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + r + " (+0) <= " + this.buffer.byteLength)
                    }
                    var n, o = 0,
                        s = r;
                    if (e === d.METRICS_CHARS) {
                        if (n = h(), c.decodeUTF8(function() {
                            return o < t && r < this.limit ? this.view[r++] : null
                        }.bind(this), function(t) {
                            ++o, c.UTF8toUTF16(t, n)
                        }), o !== t) throw RangeError("Illegal range: Truncated data, " + o + " == " + t);
                        return i ? (this.offset = r, n()) : {
                            string: n(),
                            length: r - s
                        }
                    }
                    if (e === d.METRICS_BYTES) {
                        if (!this.noAssert) {
                            if ("number" != typeof r || r % 1 != 0) throw TypeError("Illegal offset: " + r + " (not an integer)");
                            if ((r >>>= 0) < 0 || r + t > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + r + " (+" + t + ") <= " + this.buffer.byteLength)
                        }
                        var f = r + t;
                        if (c.decodeUTF8toUTF16(function() {
                            return r < f ? this.view[r++] : null
                        }.bind(this), n = h(), this.noAssert), r !== f) throw RangeError("Illegal range: Truncated data, " + r + " == " + f);
                        return i ? (this.offset = r, n()) : {
                            string: n(),
                            length: r - s
                        }
                    }
                    throw TypeError("Unsupported metrics: " + e)
                }, s.readString = s.readUTF8String, s.writeVString = function(t, e) {
                    var r = void 0 === e;
                    if (r && (e = this.offset), !this.noAssert) {
                        if ("string" != typeof t) throw TypeError("Illegal str: Not a string");
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: " + e + " (not an integer)");
                        if ((e >>>= 0) < 0 || e + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + e + " (+0) <= " + this.buffer.byteLength)
                    }
                    var i, n, o = e;
                    i = c.calculateUTF16asUTF8(f(t), this.noAssert)[1], n = d.calculateVarint32(i), e += n + i;
                    var s = this.buffer.byteLength;
                    if (s < e && this.resize((s *= 2) > e ? s : e), e -= n + i, e += this.writeVarint32(i, e), c.encodeUTF16toUTF8(f(t), function(t) {
                        this.view[e++] = t
                    }.bind(this)), e !== o + i + n) throw RangeError("Illegal range: Truncated data, " + e + " == " + (e + i + n));
                    return r ? (this.offset = e, this) : e - o
                }, s.readVString = function(t) {
                    var e = void 0 === t;
                    if (e && (t = this.offset), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+1) <= " + this.buffer.byteLength)
                    }
                    var r = t,
                        i = this.readVarint32(t),
                        n = this.readUTF8String(i.value, d.METRICS_BYTES, t += i.length);
                    return t += n.length, e ? (this.offset = t, n.string) : {
                        string: n.string,
                        length: t - r
                    }
                }, s.append = function(t, e, r) {
                    "number" != typeof e && "string" == typeof e || (r = e, e = void 0);
                    var i = void 0 === r;
                    if (i && (r = this.offset), !this.noAssert) {
                        if ("number" != typeof r || r % 1 != 0) throw TypeError("Illegal offset: " + r + " (not an integer)");
                        if ((r >>>= 0) < 0 || r + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + r + " (+0) <= " + this.buffer.byteLength)
                    }
                    t instanceof d || (t = d.wrap(t, e));
                    var n = t.limit - t.offset;
                    if (n <= 0) return this;
                    r += n;
                    var o = this.buffer.byteLength;
                    return o < r && this.resize((o *= 2) > r ? o : r), r -= n, this.view.set(t.view.subarray(t.offset, t.limit), r), t.offset += n, i && (this.offset += n), this
                }, s.appendTo = function(t, e) {
                    return t.append(this, e), this
                }, s.assert = function(t) {
                    return this.noAssert = !t, this
                }, s.capacity = function() {
                    return this.buffer.byteLength
                }, s.clear = function() {
                    return this.offset = 0, this.limit = this.buffer.byteLength, this.markedOffset = -1, this
                }, s.clone = function(t) {
                    var e = new d(0, this.littleEndian, this.noAssert);
                    return t ? (e.buffer = new ArrayBuffer(this.buffer.byteLength), e.view = new Uint8Array(e.buffer)) : (e.buffer = this.buffer, e.view = this.view), e.offset = this.offset, e.markedOffset = this.markedOffset, e.limit = this.limit, e
                }, s.compact = function(t, e) {
                    if (void 0 === t && (t = this.offset), void 0 === e && (e = this.limit), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal begin: Not an integer");
                        if (t >>>= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal end: Not an integer");
                        if (e >>>= 0, t < 0 || e < t || e > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + t + " <= " + e + " <= " + this.buffer.byteLength)
                    }
                    if (0 === t && e === this.buffer.byteLength) return this;
                    var r = e - t;
                    if (0 === r) return this.buffer = o, this.view = null, 0 <= this.markedOffset && (this.markedOffset -= t), this.offset = 0, this.limit = 0, this;
                    var i = new ArrayBuffer(r),
                        n = new Uint8Array(i);
                    return n.set(this.view.subarray(t, e)), this.buffer = i, this.view = n, 0 <= this.markedOffset && (this.markedOffset -= t), this.offset = 0, this.limit = r, this
                }, s.copy = function(t, e) {
                    if (void 0 === t && (t = this.offset), void 0 === e && (e = this.limit), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal begin: Not an integer");
                        if (t >>>= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal end: Not an integer");
                        if (e >>>= 0, t < 0 || e < t || e > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + t + " <= " + e + " <= " + this.buffer.byteLength)
                    }
                    if (t === e) return new d(0, this.littleEndian, this.noAssert);
                    var r = e - t,
                        i = new d(r, this.littleEndian, this.noAssert);
                    return i.offset = 0, i.limit = r, 0 <= i.markedOffset && (i.markedOffset -= t), this.copyTo(i, 0, t, e), i
                }, s.copyTo = function(t, e, r, i) {
                    var n, o;
                    if (!this.noAssert && !d.isByteBuffer(t)) throw TypeError("Illegal target: Not a ByteBuffer");
                    if (e = (o = void 0 === e) ? t.offset : 0 | e, r = (n = void 0 === r) ? this.offset : 0 | r, i = void 0 === i ? this.limit : 0 | i, e < 0 || e > t.buffer.byteLength) throw RangeError("Illegal target range: 0 <= " + e + " <= " + t.buffer.byteLength);
                    if (r < 0 || i > this.buffer.byteLength) throw RangeError("Illegal source range: 0 <= " + r + " <= " + this.buffer.byteLength);
                    var s = i - r;
                    return 0 === s ? t : (t.ensureCapacity(e + s), t.view.set(this.view.subarray(r, i), e), n && (this.offset += s), o && (t.offset += s), this)
                }, s.ensureCapacity = function(t) {
                    var e = this.buffer.byteLength;
                    return e < t ? this.resize((e *= 2) > t ? e : t) : this
                }, s.fill = function(t, e, r) {
                    var i = void 0 === e;
                    if (i && (e = this.offset), "string" == typeof t && 0 < t.length && (t = t.charCodeAt(0)), void 0 === e && (e = this.offset), void 0 === r && (r = this.limit), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal value: " + t + " (not an integer)");
                        if (t |= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal begin: Not an integer");
                        if (e >>>= 0, "number" != typeof r || r % 1 != 0) throw TypeError("Illegal end: Not an integer");
                        if (r >>>= 0, e < 0 || r < e || r > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + e + " <= " + r + " <= " + this.buffer.byteLength)
                    }
                    if (r <= e) return this;
                    for (; e < r;) this.view[e++] = t;
                    return i && (this.offset = e), this
                }, s.flip = function() {
                    return this.limit = this.offset, this.offset = 0, this
                }, s.mark = function(t) {
                    if (t = void 0 === t ? this.offset : t, !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal offset: " + t + " (not an integer)");
                        if ((t >>>= 0) < 0 || t + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + t + " (+0) <= " + this.buffer.byteLength)
                    }
                    return this.markedOffset = t, this
                }, s.order = function(t) {
                    if (!this.noAssert && "boolean" != typeof t) throw TypeError("Illegal littleEndian: Not a boolean");
                    return this.littleEndian = !! t, this
                }, s.LE = function(t) {
                    return this.littleEndian = void 0 === t || !! t, this
                }, s.BE = function(t) {
                    return this.littleEndian = void 0 !== t && !t, this
                }, s.prepend = function(t, e, r) {
                    "number" != typeof e && "string" == typeof e || (r = e, e = void 0);
                    var i = void 0 === r;
                    if (i && (r = this.offset), !this.noAssert) {
                        if ("number" != typeof r || r % 1 != 0) throw TypeError("Illegal offset: " + r + " (not an integer)");
                        if ((r >>>= 0) < 0 || r + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + r + " (+0) <= " + this.buffer.byteLength)
                    }
                    t instanceof d || (t = d.wrap(t, e));
                    var n = t.limit - t.offset;
                    if (n <= 0) return this;
                    var o = n - r;
                    if (0 < o) {
                        var s = new ArrayBuffer(this.buffer.byteLength + o),
                            f = new Uint8Array(s);
                        f.set(this.view.subarray(r, this.buffer.byteLength), n), this.buffer = s, this.view = f, this.offset += o, 0 <= this.markedOffset && (this.markedOffset += o), this.limit += o, r += o
                    } else new Uint8Array(this.buffer);
                    return this.view.set(t.view.subarray(t.offset, t.limit), r - n), t.offset = t.limit, i && (this.offset -= n), this
                }, s.prependTo = function(t, e) {
                    return t.prepend(this, e), this
                }, s.printDebug = function(t) {
                    "function" != typeof t && (t = console.log.bind(console)), t(this.toString() + "\n-------------------------------------------------------------------\n" + this.toDebug(!0))
                }, s.remaining = function() {
                    return this.limit - this.offset
                }, s.reset = function() {
                    return 0 <= this.markedOffset ? (this.offset = this.markedOffset, this.markedOffset = -1) : this.offset = 0, this
                }, s.resize = function(t) {
                    if (!this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal capacity: " + t + " (not an integer)");
                        if ((t |= 0) < 0) throw RangeError("Illegal capacity: 0 <= " + t)
                    }
                    if (this.buffer.byteLength < t) {
                        var e = new ArrayBuffer(t),
                            r = new Uint8Array(e);
                        r.set(this.view), this.buffer = e, this.view = r
                    }
                    return this
                }, s.reverse = function(t, e) {
                    if (void 0 === t && (t = this.offset), void 0 === e && (e = this.limit), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal begin: Not an integer");
                        if (t >>>= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal end: Not an integer");
                        if (e >>>= 0, t < 0 || e < t || e > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + t + " <= " + e + " <= " + this.buffer.byteLength)
                    }
                    return t === e || Array.prototype.reverse.call(this.view.subarray(t, e)), this
                }, s.skip = function(t) {
                    if (!this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal length: " + t + " (not an integer)");
                        t |= 0
                    }
                    var e = this.offset + t;
                    if (!this.noAssert && (e < 0 || e > this.buffer.byteLength)) throw RangeError("Illegal length: 0 <= " + this.offset + " + " + t + " <= " + this.buffer.byteLength);
                    return this.offset = e, this
                }, s.slice = function(t, e) {
                    if (void 0 === t && (t = this.offset), void 0 === e && (e = this.limit), !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal begin: Not an integer");
                        if (t >>>= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal end: Not an integer");
                        if (e >>>= 0, t < 0 || e < t || e > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + t + " <= " + e + " <= " + this.buffer.byteLength)
                    }
                    var r = this.clone();
                    return r.offset = t, r.limit = e, r
                }, s.toBuffer = function(t) {
                    var e = this.offset,
                        r = this.limit;
                    if (!this.noAssert) {
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal offset: Not an integer");
                        if (e >>>= 0, "number" != typeof r || r % 1 != 0) throw TypeError("Illegal limit: Not an integer");
                        if (r >>>= 0, e < 0 || r < e || r > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + e + " <= " + r + " <= " + this.buffer.byteLength)
                    }
                    if (!t && 0 === e && r === this.buffer.byteLength) return this.buffer;
                    if (e === r) return o;
                    var i = new ArrayBuffer(r - e);
                    return new Uint8Array(i).set(new Uint8Array(this.buffer).subarray(e, r), 0), i
                }, s.toArrayBuffer = s.toBuffer, s.toString = function(t, e, r) {
                    if (void 0 === t) return "ByteBufferAB(offset=" + this.offset + ",markedOffset=" + this.markedOffset + ",limit=" + this.limit + ",capacity=" + this.capacity() + ")";
                    switch ("number" == typeof t && (r = e = t = "utf8"), t) {
                        case "utf8":
                            return this.toUTF8(e, r);
                        case "base64":
                            return this.toBase64(e, r);
                        case "hex":
                            return this.toHex(e, r);
                        case "binary":
                            return this.toBinary(e, r);
                        case "debug":
                            return this.toDebug();
                        case "columns":
                            return this.toColumns();
                        default:
                            throw Error("Unsupported encoding: " + t)
                    }
                };
                var u = function() {
                    for (var t = {}, n = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47], s = [], e = 0, r = n.length; e < r; ++e) s[n[e]] = e;
                    return t.encode = function(t, e) {
                        for (var r, i; null !== (r = t());) e(n[r >> 2 & 63]), i = (3 & r) << 4, null !== (r = t()) ? (e(n[63 & ((i |= r >> 4 & 15) | r >> 4 & 15)]), i = (15 & r) << 2, null !== (r = t()) ? (e(n[63 & (i | r >> 6 & 3)]), e(n[63 & r])) : (e(n[63 & i]), e(61))) : (e(n[63 & i]), e(61), e(61))
                    }, t.decode = function(t, e) {
                        var r, i, n;

                        function o(t) {
                            throw Error("Illegal character code: " + t)
                        }
                        for (; null !== (r = t());) if (void 0 === (i = s[r]) && o(r), null !== (r = t()) && (void 0 === (n = s[r]) && o(r), e(i << 2 >>> 0 | (48 & n) >> 4), null !== (r = t()))) {
                            if (void 0 === (i = s[r])) {
                                if (61 === r) break;
                                o(r)
                            }
                            if (e((15 & n) << 4 >>> 0 | (60 & i) >> 2), null !== (r = t())) {
                                if (void 0 === (n = s[r])) {
                                    if (61 === r) break;
                                    o(r)
                                }
                                e((3 & i) << 6 >>> 0 | n)
                            }
                        }
                    }, t.test = function(t) {
                        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t)
                    }, t
                }();
                s.toBase64 = function(t, e) {
                    if (void 0 === t && (t = this.offset), void 0 === e && (e = this.limit), e |= 0, (t |= 0) < 0 || e > this.capacity || e < t) throw RangeError("begin, end");
                    var r;
                    return u.encode(function() {
                        return t < e ? this.view[t++] : null
                    }.bind(this), r = h()), r()
                }, d.fromBase64 = function(t, e) {
                    if ("string" != typeof t) throw TypeError("str");
                    var r = new d(t.length / 4 * 3, e),
                        i = 0;
                    return u.decode(f(t), function(t) {
                        r.view[i++] = t
                    }), r.limit = i, r
                }, d.btoa = function(t) {
                    return d.fromBinary(t).toBase64()
                }, d.atob = function(t) {
                    return d.fromBase64(t).toBinary()
                }, s.toBinary = function(t, e) {
                    if (void 0 === t && (t = this.offset), void 0 === e && (e = this.limit), e |= 0, (t |= 0) < 0 || e > this.capacity() || e < t) throw RangeError("begin, end");
                    if (t === e) return "";
                    for (var r = [], i = []; t < e;) r.push(this.view[t++]), 1024 <= r.length && (i.push(String.fromCharCode.apply(String, r)), r = []);
                    return i.join("") + String.fromCharCode.apply(String, r)
                }, d.fromBinary = function(t, e) {
                    if ("string" != typeof t) throw TypeError("str");
                    for (var r, i = 0, n = t.length, o = new d(n, e); i < n;) {
                        if (255 < (r = t.charCodeAt(i))) throw RangeError("illegal char code: " + r);
                        o.view[i++] = r
                    }
                    return o.limit = n, o
                }, s.toDebug = function(t) {
                    for (var e, r = -1, i = this.buffer.byteLength, n = "", o = "", s = ""; r < i;) {
                        if (-1 !== r && (n += (e = this.view[r]) < 16 ? "0" + e.toString(16).toUpperCase() : e.toString(16).toUpperCase(), t && (o += 32 < e && e < 127 ? String.fromCharCode(e) : ".")), ++r, t && 0 < r && r % 16 == 0 && r !== i) {
                            for (; n.length < 51;) n += " ";
                            s += n + o + "\n", n = o = ""
                        }
                        r === this.offset && r === this.limit ? n += r === this.markedOffset ? "!" : "|" : r === this.offset ? n += r === this.markedOffset ? "[" : "<" : r === this.limit ? n += r === this.markedOffset ? "]" : ">" : n += r === this.markedOffset ? "'" : t || 0 !== r && r !== i ? " " : ""
                    }
                    if (t && " " !== n) {
                        for (; n.length < 51;) n += " ";
                        s += n + o + "\n"
                    }
                    return t ? s : n
                }, d.fromDebug = function(t, e, r) {
                    for (var i, n, o = t.length, s = new d((o + 1) / 3 | 0, e, r), f = 0, a = 0, h = !1, u = !1, l = !1, c = !1, p = !1; f < o;) {
                        switch (i = t.charAt(f++)) {
                            case "!":
                                if (!r) {
                                    if (u || l || c) {
                                        p = !0;
                                        break
                                    }
                                    u = l = c = !0
                                }
                                s.offset = s.markedOffset = s.limit = a, h = !1;
                                break;
                            case "|":
                                if (!r) {
                                    if (u || c) {
                                        p = !0;
                                        break
                                    }
                                    u = c = !0
                                }
                                s.offset = s.limit = a, h = !1;
                                break;
                            case "[":
                                if (!r) {
                                    if (u || l) {
                                        p = !0;
                                        break
                                    }
                                    u = l = !0
                                }
                                s.offset = s.markedOffset = a, h = !1;
                                break;
                            case "<":
                                if (!r) {
                                    if (u) {
                                        p = !0;
                                        break
                                    }
                                    u = !0
                                }
                                s.offset = a, h = !1;
                                break;
                            case "]":
                                if (!r) {
                                    if (c || l) {
                                        p = !0;
                                        break
                                    }
                                    c = l = !0
                                }
                                s.limit = s.markedOffset = a, h = !1;
                                break;
                            case ">":
                                if (!r) {
                                    if (c) {
                                        p = !0;
                                        break
                                    }
                                    c = !0
                                }
                                s.limit = a, h = !1;
                                break;
                            case "'":
                                if (!r) {
                                    if (l) {
                                        p = !0;
                                        break
                                    }
                                    l = !0
                                }
                                s.markedOffset = a, h = !1;
                                break;
                            case " ":
                                h = !1;
                                break;
                            default:
                                if (!r && h) {
                                    p = !0;
                                    break
                                }
                                if (n = parseInt(i + t.charAt(f++), 16), !r && (isNaN(n) || n < 0 || 255 < n)) throw TypeError("Illegal str: Not a debug encoded string");
                                s.view[a++] = n, h = !0
                        }
                        if (p) throw TypeError("Illegal str: Invalid symbol at " + f)
                    }
                    if (!r) {
                        if (!u || !c) throw TypeError("Illegal str: Missing offset or limit");
                        if (a < s.buffer.byteLength) throw TypeError("Illegal str: Not a debug encoded string (is it hex?) " + a + " < " + o)
                    }
                    return s
                }, s.toHex = function(t, e) {
                    if (t = void 0 === t ? this.offset : t, e = void 0 === e ? this.limit : e, !this.noAssert) {
                        if ("number" != typeof t || t % 1 != 0) throw TypeError("Illegal begin: Not an integer");
                        if (t >>>= 0, "number" != typeof e || e % 1 != 0) throw TypeError("Illegal end: Not an integer");
                        if (e >>>= 0, t < 0 || e < t || e > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + t + " <= " + e + " <= " + this.buffer.byteLength)
                    }
                    for (var r, i = new Array(e - t); t < e;)(r = this.view[t++]) < 16 ? i.push("0", r.toString(16)) : i.push(r.toString(16));
                    return i.join("")
                }, d.fromHex = function(t, e, r) {
                    if (!r) {
                        if ("string" != typeof t) throw TypeError("Illegal str: Not a string");
                        if (t.length % 2 != 0) throw TypeError("Illegal str: Length not a multiple of 2")
                    }
                    for (var i, n = t.length, o = new d(n / 2 | 0, e), s = 0, f = 0; s < n; s += 2) {
                        if (i = parseInt(t.substring(s, s + 2), 16), !r && (!isFinite(i) || i < 0 || 255 < i)) throw TypeError("Illegal str: Contains non-hex characters");
                        o.view[f++] = i
                    }
                    return o.limit = f, o
                };
                var l, c = l = {
                    MAX_CODEPOINT: 1114111,
                    encodeUTF8: function(t, e) {
                        var r = null;
                        for ("number" == typeof t && (r = t, t = function() {
                            return null
                        }); null !== r || null !== (r = t());) r < 128 ? e(127 & r) : (r < 2048 ? e(r >> 6 & 31 | 192) : (r < 65536 ? e(r >> 12 & 15 | 224) : (e(r >> 18 & 7 | 240), e(r >> 12 & 63 | 128)), e(r >> 6 & 63 | 128)), e(63 & r | 128)), r = null
                    },
                    decodeUTF8: function(t, e) {
                        for (var r, i, n, o, s = function(t) {
                            t = t.slice(0, t.indexOf(null));
                            var e = Error(t.toString());
                            throw e.name = "TruncatedError", e.bytes = t, e
                        }; null !== (r = t());) if (0 == (128 & r)) e(r);
                        else if (192 == (224 & r)) null === (i = t()) && s([r, i]), e((31 & r) << 6 | 63 & i);
                        else if (224 == (240 & r))(null === (i = t()) || null === (n = t())) && s([r, i, n]), e((15 & r) << 12 | (63 & i) << 6 | 63 & n);
                        else {
                            if (240 != (248 & r)) throw RangeError("Illegal starting byte: " + r);
                            (null === (i = t()) || null === (n = t()) || null === (o = t())) && s([r, i, n, o]), e((7 & r) << 18 | (63 & i) << 12 | (63 & n) << 6 | 63 & o)
                        }
                    },
                    UTF16toUTF8: function(t, e) {
                        for (var r, i = null; null !== (r = null !== i ? i : t());) 55296 <= r && r <= 57343 && null !== (i = t()) && 56320 <= i && i <= 57343 ? (e(1024 * (r - 55296) + i - 56320 + 65536), i = null) : e(r);
                        null !== i && e(i)
                    },
                    UTF8toUTF16: function(t, e) {
                        var r = null;
                        for ("number" == typeof t && (r = t, t = function() {
                            return null
                        }); null !== r || null !== (r = t());) r <= 65535 ? e(r) : (e(55296 + ((r -= 65536) >> 10)), e(r % 1024 + 56320)), r = null
                    },
                    encodeUTF16toUTF8: function(t, e) {
                        l.UTF16toUTF8(t, function(t) {
                            l.encodeUTF8(t, e)
                        })
                    },
                    decodeUTF8toUTF16: function(t, e) {
                        l.decodeUTF8(t, function(t) {
                            l.UTF8toUTF16(t, e)
                        })
                    },
                    calculateCodePoint: function(t) {
                        return t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4
                    },
                    calculateUTF8: function(t) {
                        for (var e, r = 0; null !== (e = t());) r += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
                        return r
                    },
                    calculateUTF16asUTF8: function(t) {
                        var e = 0,
                            r = 0;
                        return l.UTF16toUTF8(t, function(t) {
                            ++e, r += t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4
                        }), [e, r]
                    }
                };
                return s.toUTF8 = function(e, r) {
                    if (void 0 === e && (e = this.offset), void 0 === r && (r = this.limit), !this.noAssert) {
                        if ("number" != typeof e || e % 1 != 0) throw TypeError("Illegal begin: Not an integer");
                        if (e >>>= 0, "number" != typeof r || r % 1 != 0) throw TypeError("Illegal end: Not an integer");
                        if (r >>>= 0, e < 0 || r < e || r > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + e + " <= " + r + " <= " + this.buffer.byteLength)
                    }
                    var t;
                    try {
                        c.decodeUTF8toUTF16(function() {
                            return e < r ? this.view[e++] : null
                        }.bind(this), t = h())
                    } catch (t) {
                        if (e !== r) throw RangeError("Illegal range: Truncated data, " + e + " != " + r)
                    }
                    return t()
                }, d.fromUTF8 = function(t, e, r) {
                    if (!r && "string" != typeof t) throw TypeError("Illegal str: Not a string");
                    var i = new d(c.calculateUTF16asUTF8(f(t), !0)[1], e, r),
                        n = 0;
                    return c.encodeUTF16toUTF8(f(t), function(t) {
                        i.view[n++] = t
                    }), i.limit = n, i
                }, d
            }, "function" == typeof e && "object" == typeof t && t && t.exports ? t.exports = function() {
                var t;
                try {
                    t = e("long")
                } catch (t) {}
                return n(t)
            }() : (i.dcodeIO = i.dcodeIO || {}).ByteBuffer = n(i.dcodeIO.Long)
        }, {
            long: 61
        }],
        42: [function(t, e, r) {
            var n = t("safe-buffer").Buffer,
                i = t("stream").Transform,
                o = t("string_decoder").StringDecoder;

            function s(t) {
                i.call(this), this.hashMode = "string" == typeof t, this.hashMode ? this[t] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null
            }
            t("inherits")(s, i), s.prototype.update = function(t, e, r) {
                "string" == typeof t && (t = n.from(t, e));
                var i = this._update(t);
                return this.hashMode ? this : (r && (i = this._toString(i, r)), i)
            }, s.prototype.setAutoPadding = function() {}, s.prototype.getAuthTag = function() {
                throw new Error("trying to get auth tag in unsupported state")
            }, s.prototype.setAuthTag = function() {
                throw new Error("trying to set auth tag in unsupported state")
            }, s.prototype.setAAD = function() {
                throw new Error("trying to set aad in unsupported state")
            }, s.prototype._transform = function(t, e, r) {
                var i;
                try {
                    this.hashMode ? this._update(t) : this.push(this._update(t))
                } catch (t) {
                    i = t
                } finally {
                    r(i)
                }
            }, s.prototype._flush = function(t) {
                var e;
                try {
                    this.push(this.__final())
                } catch (t) {
                    e = t
                }
                t(e)
            }, s.prototype._finalOrDigest = function(t) {
                var e = this.__final() || n.alloc(0);
                return t && (e = this._toString(e, t, !0)), e
            }, s.prototype._toString = function(t, e, r) {
                if (this._decoder || (this._decoder = new o(e), this._encoding = e), this._encoding !== e) throw new Error("can't switch encodings");
                var i = this._decoder.write(t);
                return r && (i += this._decoder.end()), i
            }, e.exports = s
        }, {
            inherits: 58,
            "safe-buffer": 81,
            stream: 90,
            string_decoder: 91
        }],
        43: [function(t, e, r) {
            (function(t) {
                function e(t) {
                    return Object.prototype.toString.call(t)
                }
                r.isArray = function(t) {
                    return Array.isArray ? Array.isArray(t) : "[object Array]" === e(t)
                }, r.isBoolean = function(t) {
                    return "boolean" == typeof t
                }, r.isNull = function(t) {
                    return null === t
                }, r.isNullOrUndefined = function(t) {
                    return null == t
                }, r.isNumber = function(t) {
                    return "number" == typeof t
                }, r.isString = function(t) {
                    return "string" == typeof t
                }, r.isSymbol = function(t) {
                    return "symbol" == typeof t
                }, r.isUndefined = function(t) {
                    return void 0 === t
                }, r.isRegExp = function(t) {
                    return "[object RegExp]" === e(t)
                }, r.isObject = function(t) {
                    return "object" == typeof t && null !== t
                }, r.isDate = function(t) {
                    return "[object Date]" === e(t)
                }, r.isError = function(t) {
                    return "[object Error]" === e(t) || t instanceof Error
                }, r.isFunction = function(t) {
                    return "function" == typeof t
                }, r.isPrimitive = function(t) {
                    return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == typeof t || void 0 === t
                }, r.isBuffer = t.isBuffer
            }).call(this, {
                isBuffer: t("../../is-buffer/index.js")
            })
        }, {
            "../../is-buffer/index.js": 59
        }],
        44: [function(a, h, t) {
            (function(r) {
                "use strict";
                var t = a("inherits"),
                    e = a("./md5"),
                    i = a("ripemd160"),
                    n = a("sha.js"),
                    o = a("cipher-base");

                function s(t) {
                    o.call(this, "digest"), this._hash = t, this.buffers = []
                }
                function f(t) {
                    o.call(this, "digest"), this._hash = t
                }
                t(s, o), s.prototype._update = function(t) {
                    this.buffers.push(t)
                }, s.prototype._final = function() {
                    var t = r.concat(this.buffers),
                        e = this._hash(t);
                    return this.buffers = null, e
                }, t(f, o), f.prototype._update = function(t) {
                    this._hash.update(t)
                }, f.prototype._final = function() {
                    return this._hash.digest()
                }, h.exports = function(t) {
                    return "md5" === (t = t.toLowerCase()) ? new s(e) : new f("rmd160" === t || "ripemd160" === t ? new i : n(t))
                }
            }).call(this, a("buffer").Buffer)
        }, {
            "./md5": 46,
            buffer: 40,
            "cipher-base": 42,
            inherits: 58,
            ripemd160: 80,
            "sha.js": 83
        }],
        45: [function(t, e, r) {
            (function(o) {
                "use strict";
                var s = new o(4);
                s.fill(0);
                e.exports = function(t, e) {
                    var r = e(function(t) {
                        if (t.length % 4 != 0) {
                            var e = t.length + (4 - t.length % 4);
                            t = o.concat([t, s], e)
                        }
                        for (var r = new Array(t.length >>> 2), i = 0, n = 0; i < t.length; i += 4, n++) r[n] = t.readInt32LE(i);
                        return r
                    }(t), 8 * t.length);
                    t = new o(16);
                    for (var i = 0; i < r.length; i++) t.writeInt32LE(r[i], i << 2, !0);
                    return t
                }
            }).call(this, t("buffer").Buffer)
        }, {
            buffer: 40
        }],
        46: [function(t, e, r) {
            "use strict";
            var i = t("./make-hash");

            function n(t, e) {
                t[e >> 5] |= 128 << e % 32, t[14 + (e + 64 >>> 9 << 4)] = e;
                for (var r = 1732584193, i = -271733879, n = -1732584194, o = 271733878, s = 0; s < t.length; s += 16) {
                    var f = r,
                        a = i,
                        h = n,
                        u = o;
                    i = d(i = d(i = d(i = d(i = p(i = p(i = p(i = p(i = c(i = c(i = c(i = c(i = l(i = l(i = l(i = l(i, n = l(n, o = l(o, r = l(r, i, n, o, t[s + 0], 7, - 680876936), i, n, t[s + 1], 12, - 389564586), r, i, t[s + 2], 17, 606105819), o, r, t[s + 3], 22, - 1044525330), n = l(n, o = l(o, r = l(r, i, n, o, t[s + 4], 7, - 176418897), i, n, t[s + 5], 12, 1200080426), r, i, t[s + 6], 17, - 1473231341), o, r, t[s + 7], 22, - 45705983), n = l(n, o = l(o, r = l(r, i, n, o, t[s + 8], 7, 1770035416), i, n, t[s + 9], 12, - 1958414417), r, i, t[s + 10], 17, - 42063), o, r, t[s + 11], 22, - 1990404162), n = l(n, o = l(o, r = l(r, i, n, o, t[s + 12], 7, 1804603682), i, n, t[s + 13], 12, - 40341101), r, i, t[s + 14], 17, - 1502002290), o, r, t[s + 15], 22, 1236535329), n = c(n, o = c(o, r = c(r, i, n, o, t[s + 1], 5, - 165796510), i, n, t[s + 6], 9, - 1069501632), r, i, t[s + 11], 14, 643717713), o, r, t[s + 0], 20, - 373897302), n = c(n, o = c(o, r = c(r, i, n, o, t[s + 5], 5, - 701558691), i, n, t[s + 10], 9, 38016083), r, i, t[s + 15], 14, - 660478335), o, r, t[s + 4], 20, - 405537848), n = c(n, o = c(o, r = c(r, i, n, o, t[s + 9], 5, 568446438), i, n, t[s + 14], 9, - 1019803690), r, i, t[s + 3], 14, - 187363961), o, r, t[s + 8], 20, 1163531501), n = c(n, o = c(o, r = c(r, i, n, o, t[s + 13], 5, - 1444681467), i, n, t[s + 2], 9, - 51403784), r, i, t[s + 7], 14, 1735328473), o, r, t[s + 12], 20, - 1926607734), n = p(n, o = p(o, r = p(r, i, n, o, t[s + 5], 4, - 378558), i, n, t[s + 8], 11, - 2022574463), r, i, t[s + 11], 16, 1839030562), o, r, t[s + 14], 23, - 35309556), n = p(n, o = p(o, r = p(r, i, n, o, t[s + 1], 4, - 1530992060), i, n, t[s + 4], 11, 1272893353), r, i, t[s + 7], 16, - 155497632), o, r, t[s + 10], 23, - 1094730640), n = p(n, o = p(o, r = p(r, i, n, o, t[s + 13], 4, 681279174), i, n, t[s + 0], 11, - 358537222), r, i, t[s + 3], 16, - 722521979), o, r, t[s + 6], 23, 76029189), n = p(n, o = p(o, r = p(r, i, n, o, t[s + 9], 4, - 640364487), i, n, t[s + 12], 11, - 421815835), r, i, t[s + 15], 16, 530742520), o, r, t[s + 2], 23, - 995338651), n = d(n, o = d(o, r = d(r, i, n, o, t[s + 0], 6, - 198630844), i, n, t[s + 7], 10, 1126891415), r, i, t[s + 14], 15, - 1416354905), o, r, t[s + 5], 21, - 57434055), n = d(n, o = d(o, r = d(r, i, n, o, t[s + 12], 6, 1700485571), i, n, t[s + 3], 10, - 1894986606), r, i, t[s + 10], 15, - 1051523), o, r, t[s + 1], 21, - 2054922799), n = d(n, o = d(o, r = d(r, i, n, o, t[s + 8], 6, 1873313359), i, n, t[s + 15], 10, - 30611744), r, i, t[s + 6], 15, - 1560198380), o, r, t[s + 13], 21, 1309151649), n = d(n, o = d(o, r = d(r, i, n, o, t[s + 4], 6, - 145523070), i, n, t[s + 11], 10, - 1120210379), r, i, t[s + 2], 15, 718787259), o, r, t[s + 9], 21, - 343485551), r = g(r, f), i = g(i, a), n = g(n, h), o = g(o, u)
                }
                return [r, i, n, o]
            }
            function f(t, e, r, i, n, o) {
                return g((s = g(g(e, t), g(i, o))) << (f = n) | s >>> 32 - f, r);
                var s, f
            }
            function l(t, e, r, i, n, o, s) {
                return f(e & r | ~e & i, t, e, n, o, s)
            }
            function c(t, e, r, i, n, o, s) {
                return f(e & i | r & ~i, t, e, n, o, s)
            }
            function p(t, e, r, i, n, o, s) {
                return f(e ^ r ^ i, t, e, n, o, s)
            }
            function d(t, e, r, i, n, o, s) {
                return f(r ^ (e | ~i), t, e, n, o, s)
            }
            function g(t, e) {
                var r = (65535 & t) + (65535 & e);
                return (t >> 16) + (e >> 16) + (r >> 16) << 16 | 65535 & r
            }
            e.exports = function(t) {
                return i(t, n)
            }
        }, {
            "./make-hash": 45
        }],
        47: [function(t, e, r) {
            "use strict";
            var i = t("inherits"),
                n = t("./legacy"),
                s = t("cipher-base"),
                f = t("safe-buffer").Buffer,
                o = t("create-hash/md5"),
                a = t("ripemd160"),
                h = t("sha.js"),
                u = f.alloc(128);

            function l(t, e) {
                s.call(this, "digest"), "string" == typeof e && (e = f.from(e));
                var r = "sha512" === t || "sha384" === t ? 128 : 64;
                (this._alg = t, (this._key = e).length > r) ? e = ("rmd160" === t ? new a : h(t)).update(e).digest() : e.length < r && (e = f.concat([e, u], r));
                for (var i = this._ipad = f.allocUnsafe(r), n = this._opad = f.allocUnsafe(r), o = 0; o < r; o++) i[o] = 54 ^ e[o], n[o] = 92 ^ e[o];
                this._hash = "rmd160" === t ? new a : h(t), this._hash.update(i)
            }
            i(l, s), l.prototype._update = function(t) {
                this._hash.update(t)
            }, l.prototype._final = function() {
                var t = this._hash.digest();
                return ("rmd160" === this._alg ? new a : h(this._alg)).update(this._opad).update(t).digest()
            }, e.exports = function(t, e) {
                return "rmd160" === (t = t.toLowerCase()) || "ripemd160" === t ? new l("rmd160", e) : "md5" === t ? new n(o, e) : new l(t, e)
            }
        }, {
            "./legacy": 48,
            "cipher-base": 42,
            "create-hash/md5": 46,
            inherits: 58,
            ripemd160: 80,
            "safe-buffer": 81,
            "sha.js": 83
        }],
        48: [function(t, e, r) {
            "use strict";
            var i = t("inherits"),
                o = t("safe-buffer").Buffer,
                s = t("cipher-base"),
                f = o.alloc(128);

            function n(t, e) {
                s.call(this, "digest"), "string" == typeof e && (e = o.from(e)), this._alg = t, 64 < (this._key = e).length ? e = t(e) : e.length < 64 && (e = o.concat([e, f], 64));
                for (var r = this._ipad = o.allocUnsafe(64), i = this._opad = o.allocUnsafe(64), n = 0; n < 64; n++) r[n] = 54 ^ e[n], i[n] = 92 ^ e[n];
                this._hash = [r]
            }
            i(n, s), n.prototype._update = function(t) {
                this._hash.push(t)
            }, n.prototype._final = function() {
                var t = this._alg(o.concat(this._hash));
                return this._alg(o.concat([this._opad, t]))
            }, e.exports = n
        }, {
            "cipher-base": 42,
            inherits: 58,
            "safe-buffer": 81
        }],
        49: [function(t, e, r) {
            var i = t("assert"),
                f = t("bigi"),
                a = t("./point");

            function n(t, e, r, i, n, o, s) {
                this.p = t, this.a = e, this.b = r, this.G = a.fromAffine(this, i, n), this.n = o, this.h = s, this.infinity = new a(this, null, null, f.ZERO), this.pOverFour = t.add(f.ONE).shiftRight(2), this.pLength = Math.floor((this.p.bitLength() + 7) / 8)
            }
            n.prototype.pointFromX = function(t, e) {
                var r = e.pow(3).add(this.a.multiply(e)).add(this.b).mod(this.p).modPow(this.pOverFour, this.p),
                    i = r;
                return r.isEven() ^ !t && (i = this.p.subtract(i)), a.fromAffine(this, e, i)
            }, n.prototype.isInfinity = function(t) {
                return t === this.infinity || 0 === t.z.signum() && 0 !== t.y.signum()
            }, n.prototype.isOnCurve = function(t) {
                if (this.isInfinity(t)) return !0;
                var e = t.affineX,
                    r = t.affineY,
                    i = this.a,
                    n = this.b,
                    o = this.p;
                if (e.signum() < 0 || 0 <= e.compareTo(o)) return !1;
                if (r.signum() < 0 || 0 <= r.compareTo(o)) return !1;
                var s = r.square().mod(o),
                    f = e.pow(3).add(i.multiply(e)).add(n).mod(o);
                return s.equals(f)
            }, n.prototype.validate = function(t) {
                i(!this.isInfinity(t), "Point is at infinity"), i(this.isOnCurve(t), "Point is not on the curve");
                var e = t.multiply(this.n);
                return i(this.isInfinity(e), "Point is not a scalar multiple of G"), !0
            }, e.exports = n
        }, {
            "./point": 53,
            assert: 14,
            bigi: 19
        }],
        50: [function(t, e, r) {
            e.exports = {
                secp128r1: {
                    p: "fffffffdffffffffffffffffffffffff",
                    a: "fffffffdfffffffffffffffffffffffc",
                    b: "e87579c11079f43dd824993c2cee5ed3",
                    n: "fffffffe0000000075a30d1b9038a115",
                    h: "01",
                    Gx: "161ff7528b899b2d0c28607ca52c5b86",
                    Gy: "cf5ac8395bafeb13c02da292dded7a83"
                },
                secp160k1: {
                    p: "fffffffffffffffffffffffffffffffeffffac73",
                    a: "00",
                    b: "07",
                    n: "0100000000000000000001b8fa16dfab9aca16b6b3",
                    h: "01",
                    Gx: "3b4c382ce37aa192a4019e763036f4f5dd4d7ebb",
                    Gy: "938cf935318fdced6bc28286531733c3f03c4fee"
                },
                secp160r1: {
                    p: "ffffffffffffffffffffffffffffffff7fffffff",
                    a: "ffffffffffffffffffffffffffffffff7ffffffc",
                    b: "1c97befc54bd7a8b65acf89f81d4d4adc565fa45",
                    n: "0100000000000000000001f4c8f927aed3ca752257",
                    h: "01",
                    Gx: "4a96b5688ef573284664698968c38bb913cbfc82",
                    Gy: "23a628553168947d59dcc912042351377ac5fb32"
                },
                secp192k1: {
                    p: "fffffffffffffffffffffffffffffffffffffffeffffee37",
                    a: "00",
                    b: "03",
                    n: "fffffffffffffffffffffffe26f2fc170f69466a74defd8d",
                    h: "01",
                    Gx: "db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d",
                    Gy: "9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"
                },
                secp192r1: {
                    p: "fffffffffffffffffffffffffffffffeffffffffffffffff",
                    a: "fffffffffffffffffffffffffffffffefffffffffffffffc",
                    b: "64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1",
                    n: "ffffffffffffffffffffffff99def836146bc9b1b4d22831",
                    h: "01",
                    Gx: "188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012",
                    Gy: "07192b95ffc8da78631011ed6b24cdd573f977a11e794811"
                },
                secp256k1: {
                    p: "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
                    a: "00",
                    b: "07",
                    n: "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
                    h: "01",
                    Gx: "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
                    Gy: "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
                },
                secp256r1: {
                    p: "ffffffff00000001000000000000000000000000ffffffffffffffffffffffff",
                    a: "ffffffff00000001000000000000000000000000fffffffffffffffffffffffc",
                    b: "5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",
                    n: "ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",
                    h: "01",
                    Gx: "6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
                    Gy: "4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"
                }
            }
        }, {}],
        51: [function(t, e, r) {
            var i = t("./point"),
                n = t("./curve"),
                o = t("./names");
            e.exports = {
                Curve: n,
                Point: i,
                getCurveByName: o
            }
        }, {
            "./curve": 49,
            "./names": 52,
            "./point": 53
        }],
        52: [function(t, e, r) {
            var h = t("bigi"),
                u = t("./curves.json"),
                l = t("./curve");
            e.exports = function(t) {
                var e = u[t];
                if (!e) return null;
                var r = new h(e.p, 16),
                    i = new h(e.a, 16),
                    n = new h(e.b, 16),
                    o = new h(e.n, 16),
                    s = new h(e.h, 16),
                    f = new h(e.Gx, 16),
                    a = new h(e.Gy, 16);
                return new l(r, i, n, f, a, o, s)
            }
        }, {
            "./curve": 49,
            "./curves.json": 50,
            bigi: 19
        }],
        53: [function(t, e, r) {
            (function(o) {
                var h = t("assert"),
                    u = t("bigi"),
                    p = u.valueOf(3);

                function d(t, e, r, i) {
                    h.notStrictEqual(i, void 0, "Missing Z coordinate"), this.curve = t, this.x = e, this.y = r, this.z = i, this._zInv = null, this.compressed = !0
                }
                Object.defineProperty(d.prototype, "zInv", {
                    get: function() {
                        return null === this._zInv && (this._zInv = this.z.modInverse(this.curve.p)), this._zInv
                    }
                }), Object.defineProperty(d.prototype, "affineX", {
                    get: function() {
                        return this.x.multiply(this.zInv).mod(this.curve.p)
                    }
                }), Object.defineProperty(d.prototype, "affineY", {
                    get: function() {
                        return this.y.multiply(this.zInv).mod(this.curve.p)
                    }
                }), d.fromAffine = function(t, e, r) {
                    return new d(t, e, r, u.ONE)
                }, d.prototype.equals = function(t) {
                    return t === this || (this.curve.isInfinity(this) ? this.curve.isInfinity(t) : this.curve.isInfinity(t) ? this.curve.isInfinity(this) : 0 === t.y.multiply(this.z).subtract(this.y.multiply(t.z)).mod(this.curve.p).signum() && 0 === t.x.multiply(this.z).subtract(this.x.multiply(t.z)).mod(this.curve.p).signum())
                }, d.prototype.negate = function() {
                    var t = this.curve.p.subtract(this.y);
                    return new d(this.curve, this.x, t, this.z)
                }, d.prototype.add = function(t) {
                    if (this.curve.isInfinity(this)) return t;
                    if (this.curve.isInfinity(t)) return this;
                    var e = this.x,
                        r = this.y,
                        i = t.x,
                        n = t.y.multiply(this.z).subtract(r.multiply(t.z)).mod(this.curve.p),
                        o = i.multiply(this.z).subtract(e.multiply(t.z)).mod(this.curve.p);
                    if (0 === o.signum()) return 0 === n.signum() ? this.twice() : this.curve.infinity;
                    var s = o.square(),
                        f = s.multiply(o),
                        a = e.multiply(s),
                        h = n.square().multiply(this.z),
                        u = h.subtract(a.shiftLeft(1)).multiply(t.z).subtract(f).multiply(o).mod(this.curve.p),
                        l = a.multiply(p).multiply(n).subtract(r.multiply(f)).subtract(h.multiply(n)).multiply(t.z).add(n.multiply(f)).mod(this.curve.p),
                        c = f.multiply(this.z).multiply(t.z).mod(this.curve.p);
                    return new d(this.curve, u, l, c)
                }, d.prototype.twice = function() {
                    if (this.curve.isInfinity(this)) return this;
                    if (0 === this.y.signum()) return this.curve.infinity;
                    var t = this.x,
                        e = this.y,
                        r = e.multiply(this.z).mod(this.curve.p),
                        i = r.multiply(e).mod(this.curve.p),
                        n = this.curve.a,
                        o = t.square().multiply(p);
                    0 !== n.signum() && (o = o.add(this.z.square().multiply(n)));
                    var s = (o = o.mod(this.curve.p)).square().subtract(t.shiftLeft(3).multiply(i)).shiftLeft(1).multiply(r).mod(this.curve.p),
                        f = o.multiply(p).multiply(t).subtract(i.shiftLeft(1)).shiftLeft(2).multiply(i).subtract(o.pow(3)).mod(this.curve.p),
                        a = r.pow(3).shiftLeft(3).mod(this.curve.p);
                    return new d(this.curve, s, f, a)
                }, d.prototype.multiply = function(t) {
                    if (this.curve.isInfinity(this)) return this;
                    if (0 === t.signum()) return this.curve.infinity;
                    for (var e = t, r = e.multiply(p), i = this.negate(), n = this, o = r.bitLength() - 2; 0 < o; --o) {
                        var s = r.testBit(o),
                            f = e.testBit(o);
                        n = n.twice(), s !== f && (n = n.add(s ? this : i))
                    }
                    return n
                }, d.prototype.multiplyTwo = function(t, e, r) {
                    for (var i = Math.max(t.bitLength(), r.bitLength()) - 1, n = this.curve.infinity, o = this.add(e); 0 <= i;) {
                        var s = t.testBit(i),
                            f = r.testBit(i);
                        n = n.twice(), s ? n = f ? n.add(o) : n.add(this) : f && (n = n.add(e)), --i
                    }
                    return n
                }, d.prototype.getEncoded = function(t) {
                    if (null == t && (t = this.compressed), this.curve.isInfinity(this)) return new o("00", "hex");
                    var e, r = this.affineX,
                        i = this.affineY,
                        n = this.curve.pLength;
                    return t ? (e = new o(1 + n)).writeUInt8(i.isEven() ? 2 : 3, 0) : ((e = new o(1 + n + n)).writeUInt8(4, 0), i.toBuffer(n).copy(e, 1 + n)), r.toBuffer(n).copy(e, 1), e
                }, d.decodeFrom = function(t, e) {
                    var r, i = e.readUInt8(0),
                        n = 4 !== i,
                        o = Math.floor((t.p.bitLength() + 7) / 8),
                        s = u.fromBuffer(e.slice(1, 1 + o));
                    if (n) {
                        h.equal(e.length, o + 1, "Invalid sequence length"), h(2 === i || 3 === i, "Invalid sequence tag");
                        var f = 3 === i;
                        r = t.pointFromX(f, s)
                    } else {
                        h.equal(e.length, 1 + o + o, "Invalid sequence length");
                        var a = u.fromBuffer(e.slice(1 + o));
                        r = d.fromAffine(t, s, a)
                    }
                    return r.compressed = n, r
                }, d.prototype.toString = function() {
                    return this.curve.isInfinity(this) ? "(INFINITY)" : "(" + this.affineX.toString() + "," + this.affineY.toString() + ")"
                }, e.exports = d
            }).call(this, t("buffer").Buffer)
        }, {
            assert: 14,
            bigi: 19,
            buffer: 40
        }],
        54: [function(t, e, r) {
            function i() {
                this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
            }
            function a(t) {
                return "function" == typeof t
            }
            function h(t) {
                return "object" == typeof t && null !== t
            }
            function u(t) {
                return void 0 === t
            }((e.exports = i).EventEmitter = i).prototype._events = void 0, i.prototype._maxListeners = void 0, i.defaultMaxListeners = 10, i.prototype.setMaxListeners = function(t) {
                if ("number" != typeof t || t < 0 || isNaN(t)) throw TypeError("n must be a positive number");
                return this._maxListeners = t, this
            }, i.prototype.emit = function(t) {
                var e, r, i, n, o, s;
                if (this._events || (this._events = {}), "error" === t && (!this._events.error || h(this._events.error) && !this._events.error.length)) {
                    if ((e = arguments[1]) instanceof Error) throw e;
                    var f = new Error('Uncaught, unspecified "error" event. (' + e + ")");
                    throw f.context = e, f
                }
                if (u(r = this._events[t])) return !1;
                if (a(r)) switch (arguments.length) {
                    case 1:
                        r.call(this);
                        break;
                    case 2:
                        r.call(this, arguments[1]);
                        break;
                    case 3:
                        r.call(this, arguments[1], arguments[2]);
                        break;
                    default:
                        n = Array.prototype.slice.call(arguments, 1), r.apply(this, n)
                } else if (h(r)) for (n = Array.prototype.slice.call(arguments, 1), i = (s = r.slice()).length, o = 0; o < i; o++) s[o].apply(this, n);
                return !0
            }, i.prototype.on = i.prototype.addListener = function(t, e) {
                var r;
                if (!a(e)) throw TypeError("listener must be a function");
                return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", t, a(e.listener) ? e.listener : e), this._events[t] ? h(this._events[t]) ? this._events[t].push(e) : this._events[t] = [this._events[t], e] : this._events[t] = e, h(this._events[t]) && !this._events[t].warned && (r = u(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners) && 0 < r && this._events[t].length > r && (this._events[t].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length), "function" == typeof console.trace && console.trace()), this
            }, i.prototype.once = function(t, e) {
                if (!a(e)) throw TypeError("listener must be a function");
                var r = !1;

                function i() {
                    this.removeListener(t, i), r || (r = !0, e.apply(this, arguments))
                }
                return i.listener = e, this.on(t, i), this
            }, i.prototype.removeListener = function(t, e) {
                var r, i, n, o;
                if (!a(e)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[t]) return this;
                if (n = (r = this._events[t]).length, i = -1, r === e || a(r.listener) && r.listener === e) delete this._events[t], this._events.removeListener && this.emit("removeListener", t, e);
                else if (h(r)) {
                    for (o = n; 0 < o--;) if (r[o] === e || r[o].listener && r[o].listener === e) {
                        i = o;
                        break
                    }
                    if (i < 0) return this;
                    1 === r.length ? (r.length = 0, delete this._events[t]) : r.splice(i, 1), this._events.removeListener && this.emit("removeListener", t, e)
                }
                return this
            }, i.prototype.removeAllListeners = function(t) {
                var e, r;
                if (!this._events) return this;
                if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[t] && delete this._events[t], this;
                if (0 === arguments.length) {
                    for (e in this._events) "removeListener" !== e && this.removeAllListeners(e);
                    return this.removeAllListeners("removeListener"), this._events = {}, this
                }
                if (a(r = this._events[t])) this.removeListener(t, r);
                else if (r) for (; r.length;) this.removeListener(t, r[r.length - 1]);
                return delete this._events[t], this
            }, i.prototype.listeners = function(t) {
                return this._events && this._events[t] ? a(this._events[t]) ? [this._events[t]] : this._events[t].slice() : []
            }, i.prototype.listenerCount = function(t) {
                if (this._events) {
                    var e = this._events[t];
                    if (a(e)) return 1;
                    if (e) return e.length
                }
                return 0
            }, i.listenerCount = function(t, e) {
                return t.listenerCount(e)
            }
        }, {}],
        55: [function(t, e, r) {
            var p = t("safe-buffer").Buffer,
                d = t("md5.js");
            e.exports = function(t, e, r, i) {
                if (p.isBuffer(t) || (t = p.from(t, "binary")), e && (p.isBuffer(e) || (e = p.from(e, "binary")), 8 !== e.length)) throw new RangeError("salt should be Buffer with 8 byte length");
                for (var n = r / 8, o = p.alloc(n), s = p.alloc(i || 0), f = p.alloc(0); 0 < n || 0 < i;) {
                    var a = new d;
                    a.update(f), a.update(t), e && a.update(e), f = a.digest();
                    var h = 0;
                    if (0 < n) {
                        var u = o.length - n;
                        h = Math.min(n, f.length), f.copy(o, u, 0, h), n -= h
                    }
                    if (h < f.length && 0 < i) {
                        var l = s.length - i,
                            c = Math.min(i, f.length - h);
                        f.copy(s, l, h, h + c), i -= c
                    }
                }
                return f.fill(0), {
                    key: o,
                    iv: s
                }
            }
        }, {
            "md5.js": 62,
            "safe-buffer": 81
        }],
        56: [function(r, i, t) {
            (function(f) {
                "use strict";
                var e = r("stream").Transform;

                function t(t) {
                    e.call(this), this._block = new f(t), this._blockSize = t, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1
                }
                r("inherits")(t, e), t.prototype._transform = function(t, e, r) {
                    var i = null;
                    try {
                        "buffer" !== e && (t = new f(t, e)), this.update(t)
                    } catch (t) {
                        i = t
                    }
                    r(i)
                }, t.prototype._flush = function(t) {
                    var e = null;
                    try {
                        this.push(this._digest())
                    } catch (t) {
                        e = t
                    }
                    t(e)
                }, t.prototype.update = function(t, e) {
                    if (!f.isBuffer(t) && "string" != typeof t) throw new TypeError("Data must be a string or a buffer");
                    if (this._finalized) throw new Error("Digest already called");
                    f.isBuffer(t) || (t = new f(t, e || "binary"));
                    for (var r = this._block, i = 0; this._blockOffset + t.length - i >= this._blockSize;) {
                        for (var n = this._blockOffset; n < this._blockSize;) r[n++] = t[i++];
                        this._update(), this._blockOffset = 0
                    }
                    for (; i < t.length;) r[this._blockOffset++] = t[i++];
                    for (var o = 0, s = 8 * t.length; 0 < s; ++o) this._length[o] += s, 0 < (s = this._length[o] / 4294967296 | 0) && (this._length[o] -= 4294967296 * s);
                    return this
                }, t.prototype._update = function(t) {
                    throw new Error("_update is not implemented")
                }, t.prototype.digest = function(t) {
                    if (this._finalized) throw new Error("Digest already called");
                    this._finalized = !0;
                    var e = this._digest();
                    return void 0 !== t && (e = e.toString(t)), e
                }, t.prototype._digest = function() {
                    throw new Error("_digest is not implemented")
                }, i.exports = t
            }).call(this, r("buffer").Buffer)
        }, {
            buffer: 40,
            inherits: 58,
            stream: 90
        }],
        57: [function(t, e, r) {
            r.read = function(t, e, r, i, n) {
                var o, s, f = 8 * n - i - 1,
                    a = (1 << f) - 1,
                    h = a >> 1,
                    u = -7,
                    l = r ? n - 1 : 0,
                    c = r ? -1 : 1,
                    p = t[e + l];
                for (l += c, o = p & (1 << -u) - 1, p >>= -u, u += f; 0 < u; o = 256 * o + t[e + l], l += c, u -= 8);
                for (s = o & (1 << -u) - 1, o >>= -u, u += i; 0 < u; s = 256 * s + t[e + l], l += c, u -= 8);
                if (0 === o) o = 1 - h;
                else {
                    if (o === a) return s ? NaN : 1 / 0 * (p ? -1 : 1);
                    s += Math.pow(2, i), o -= h
                }
                return (p ? -1 : 1) * s * Math.pow(2, o - i)
            }, r.write = function(t, e, r, i, n, o) {
                var s, f, a, h = 8 * o - n - 1,
                    u = (1 << h) - 1,
                    l = u >> 1,
                    c = 23 === n ? Math.pow(2, - 24) - Math.pow(2, - 77) : 0,
                    p = i ? 0 : o - 1,
                    d = i ? 1 : -1,
                    g = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
                for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (f = isNaN(e) ? 1 : 0, s = u) : (s = Math.floor(Math.log(e) / Math.LN2), e * (a = Math.pow(2, - s)) < 1 && (s--, a *= 2), 2 <= (e += 1 <= s + l ? c / a : c * Math.pow(2, 1 - l)) * a && (s++, a /= 2), u <= s + l ? (f = 0, s = u) : 1 <= s + l ? (f = (e * a - 1) * Math.pow(2, n), s += l) : (f = e * Math.pow(2, l - 1) * Math.pow(2, n), s = 0)); 8 <= n; t[r + p] = 255 & f, p += d, f /= 256, n -= 8);
                for (s = s << n | f, h += n; 0 < h; t[r + p] = 255 & s, p += d, s /= 256, h -= 8);
                t[r + p - d] |= 128 * g
            }
        }, {}],
        58: [function(t, e, r) {
            "function" == typeof Object.create ? e.exports = function(t, e) {
                t.super_ = e, t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                })
            } : e.exports = function(t, e) {
                t.super_ = e;
                var r = function() {};
                r.prototype = e.prototype, t.prototype = new r, t.prototype.constructor = t
            }
        }, {}],
        59: [function(t, e, r) {
            function i(t) {
                return !!t.constructor && "function" == typeof t.constructor.isBuffer && t.constructor.isBuffer(t)
            }
            e.exports = function(t) {
                return null != t && (i(t) || "function" == typeof(e = t).readFloatLE && "function" == typeof e.slice && i(e.slice(0, 0)) || !! t._isBuffer);
                var e
            }
        }, {}],
        60: [function(t, e, r) {
            var i = {}.toString;
            e.exports = Array.isArray || function(t) {
                return "[object Array]" == i.call(t)
            }
        }, {}],
        61: [function(t, e, r) {
            var i, n;
            i = this, n = function() {
                "use strict";

                function i(t, e, r) {
                    this.low = 0 | t, this.high = 0 | e, this.unsigned = !! r
                }
                function p(t) {
                    return !0 === (t && t.__isLong__)
                }
                Object.defineProperty(i.prototype, "__isLong__", {
                    value: !0,
                    enumerable: !1,
                    configurable: !1
                }), i.isLong = p;
                var o = {}, s = {};

                function t(t, e) {
                    var r, i, n;
                    return e ? (n = 0 <= (t >>>= 0) && t < 256) && (i = s[t]) ? i : (r = g(t, (0 | t) < 0 ? -1 : 0, !0), n && (s[t] = r), r) : (n = -128 <= (t |= 0) && t < 128) && (i = o[t]) ? i : (r = g(t, t < 0 ? -1 : 0, !1), n && (o[t] = r), r)
                }
                function d(t, e) {
                    if (isNaN(t) || !isFinite(t)) return e ? a : b;
                    if (e) {
                        if (t < 0) return a;
                        if (n <= t) return _
                    } else {
                        if (t <= -f) return E;
                        if (f <= t + 1) return m
                    }
                    return t < 0 ? d(-t, e).neg() : g(t % r | 0, t / r | 0, e)
                }
                function g(t, e, r) {
                    return new i(t, e, r)
                }
                i.fromInt = t, i.fromNumber = d, i.fromBits = g;
                var u = Math.pow;

                function l(t, e, r) {
                    if (0 === t.length) throw Error("empty string");
                    if ("NaN" === t || "Infinity" === t || "+Infinity" === t || "-Infinity" === t) return b;
                    if ("number" == typeof e ? (r = e, e = !1) : e = !! e, (r = r || 10) < 2 || 36 < r) throw RangeError("radix");
                    var i;
                    if (0 < (i = t.indexOf("-"))) throw Error("interior hyphen");
                    if (0 === i) return l(t.substring(1), e, r).neg();
                    for (var n = d(u(r, 8)), o = b, s = 0; s < t.length; s += 8) {
                        var f = Math.min(8, t.length - s),
                            a = parseInt(t.substring(s, s + f), r);
                        if (f < 8) {
                            var h = d(u(r, f));
                            o = o.mul(h).add(d(a))
                        } else o = (o = o.mul(n)).add(d(a))
                    }
                    return o.unsigned = e, o
                }
                function y(t) {
                    return t instanceof i ? t : "number" == typeof t ? d(t) : "string" == typeof t ? l(t) : g(t.low, t.high, t.unsigned)
                }
                i.fromString = l, i.fromValue = y;
                var r = 4294967296,
                    n = r * r,
                    f = n / 2,
                    v = t(1 << 24),
                    b = t(0);
                i.ZERO = b;
                var a = t(0, !0);
                i.UZERO = a;
                var h = t(1);
                i.ONE = h;
                var c = t(1, !0);
                i.UONE = c;
                var w = t(-1);
                i.NEG_ONE = w;
                var m = g(-1, 2147483647, !1);
                i.MAX_VALUE = m;
                var _ = g(-1, - 1, !0);
                i.MAX_UNSIGNED_VALUE = _;
                var E = g(0, - 2147483648, !1);
                i.MIN_VALUE = E;
                var e = i.prototype;
                return e.toInt = function() {
                    return this.unsigned ? this.low >>> 0 : this.low
                }, e.toNumber = function() {
                    return this.unsigned ? (this.high >>> 0) * r + (this.low >>> 0) : this.high * r + (this.low >>> 0)
                }, e.toString = function(t) {
                    if ((t = t || 10) < 2 || 36 < t) throw RangeError("radix");
                    if (this.isZero()) return "0";
                    if (this.isNegative()) {
                        if (this.eq(E)) {
                            var e = d(t),
                                r = this.div(e),
                                i = r.mul(e).sub(this);
                            return r.toString(t) + i.toInt().toString(t)
                        }
                        return "-" + this.neg().toString(t)
                    }
                    for (var n = d(u(t, 6), this.unsigned), o = this, s = "";;) {
                        var f = o.div(n),
                            a = (o.sub(f.mul(n)).toInt() >>> 0).toString(t);
                        if ((o = f).isZero()) return a + s;
                        for (; a.length < 6;) a = "0" + a;
                        s = "" + a + s
                    }
                }, e.getHighBits = function() {
                    return this.high
                }, e.getHighBitsUnsigned = function() {
                    return this.high >>> 0
                }, e.getLowBits = function() {
                    return this.low
                }, e.getLowBitsUnsigned = function() {
                    return this.low >>> 0
                }, e.getNumBitsAbs = function() {
                    if (this.isNegative()) return this.eq(E) ? 64 : this.neg().getNumBitsAbs();
                    for (var t = 0 != this.high ? this.high : this.low, e = 31; 0 < e && 0 == (t & 1 << e); e--);
                    return 0 != this.high ? e + 33 : e + 1
                }, e.isZero = function() {
                    return 0 === this.high && 0 === this.low
                }, e.isNegative = function() {
                    return !this.unsigned && this.high < 0
                }, e.isPositive = function() {
                    return this.unsigned || 0 <= this.high
                }, e.isOdd = function() {
                    return 1 == (1 & this.low)
                }, e.isEven = function() {
                    return 0 == (1 & this.low)
                }, e.equals = function(t) {
                    return p(t) || (t = y(t)), (this.unsigned === t.unsigned || this.high >>> 31 != 1 || t.high >>> 31 != 1) && (this.high === t.high && this.low === t.low)
                }, e.eq = e.equals, e.notEquals = function(t) {
                    return !this.eq(t)
                }, e.neq = e.notEquals, e.lessThan = function(t) {
                    return this.comp(t) < 0
                }, e.lt = e.lessThan, e.lessThanOrEqual = function(t) {
                    return this.comp(t) <= 0
                }, e.lte = e.lessThanOrEqual, e.greaterThan = function(t) {
                    return 0 < this.comp(t)
                }, e.gt = e.greaterThan, e.greaterThanOrEqual = function(t) {
                    return 0 <= this.comp(t)
                }, e.gte = e.greaterThanOrEqual, e.compare = function(t) {
                    if (p(t) || (t = y(t)), this.eq(t)) return 0;
                    var e = this.isNegative(),
                        r = t.isNegative();
                    return e && !r ? -1 : !e && r ? 1 : this.unsigned ? t.high >>> 0 > this.high >>> 0 || t.high === this.high && t.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(t).isNegative() ? -1 : 1
                }, e.comp = e.compare, e.negate = function() {
                    return !this.unsigned && this.eq(E) ? E : this.not().add(h)
                }, e.neg = e.negate, e.add = function(t) {
                    p(t) || (t = y(t));
                    var e = this.high >>> 16,
                        r = 65535 & this.high,
                        i = this.low >>> 16,
                        n = 65535 & this.low,
                        o = t.high >>> 16,
                        s = 65535 & t.high,
                        f = t.low >>> 16,
                        a = 0,
                        h = 0,
                        u = 0,
                        l = 0;
                    return u += (l += n + (65535 & t.low)) >>> 16, h += (u += i + f) >>> 16, a += (h += r + s) >>> 16, a += e + o, g((u &= 65535) << 16 | (l &= 65535), (a &= 65535) << 16 | (h &= 65535), this.unsigned)
                }, e.subtract = function(t) {
                    return p(t) || (t = y(t)), this.add(t.neg())
                }, e.sub = e.subtract, e.multiply = function(t) {
                    if (this.isZero()) return b;
                    if (p(t) || (t = y(t)), t.isZero()) return b;
                    if (this.eq(E)) return t.isOdd() ? E : b;
                    if (t.eq(E)) return this.isOdd() ? E : b;
                    if (this.isNegative()) return t.isNegative() ? this.neg().mul(t.neg()) : this.neg().mul(t).neg();
                    if (t.isNegative()) return this.mul(t.neg()).neg();
                    if (this.lt(v) && t.lt(v)) return d(this.toNumber() * t.toNumber(), this.unsigned);
                    var e = this.high >>> 16,
                        r = 65535 & this.high,
                        i = this.low >>> 16,
                        n = 65535 & this.low,
                        o = t.high >>> 16,
                        s = 65535 & t.high,
                        f = t.low >>> 16,
                        a = 65535 & t.low,
                        h = 0,
                        u = 0,
                        l = 0,
                        c = 0;
                    return l += (c += n * a) >>> 16, u += (l += i * a) >>> 16, l &= 65535, u += (l += n * f) >>> 16, h += (u += r * a) >>> 16, u &= 65535, h += (u += i * f) >>> 16, u &= 65535, h += (u += n * s) >>> 16, h += e * a + r * f + i * s + n * o, g((l &= 65535) << 16 | (c &= 65535), (h &= 65535) << 16 | (u &= 65535), this.unsigned)
                }, e.mul = e.multiply, e.divide = function(t) {
                    if (p(t) || (t = y(t)), t.isZero()) throw Error("division by zero");
                    if (this.isZero()) return this.unsigned ? a : b;
                    var e, r, i;
                    if (this.unsigned) {
                        if (t.unsigned || (t = t.toUnsigned()), t.gt(this)) return a;
                        if (t.gt(this.shru(1))) return c;
                        i = a
                    } else {
                        if (this.eq(E)) return t.eq(h) || t.eq(w) ? E : t.eq(E) ? h : (e = this.shr(1).div(t).shl(1)).eq(b) ? t.isNegative() ? h : w : (r = this.sub(t.mul(e)), i = e.add(r.div(t)));
                        else if (t.eq(E)) return this.unsigned ? a : b;
                        if (this.isNegative()) return t.isNegative() ? this.neg().div(t.neg()) : this.neg().div(t).neg();
                        if (t.isNegative()) return this.div(t.neg()).neg();
                        i = b
                    }
                    for (r = this; r.gte(t);) {
                        e = Math.max(1, Math.floor(r.toNumber() / t.toNumber()));
                        for (var n = Math.ceil(Math.log(e) / Math.LN2), o = n <= 48 ? 1 : u(2, n - 48), s = d(e), f = s.mul(t); f.isNegative() || f.gt(r);) f = (s = d(e -= o, this.unsigned)).mul(t);
                        s.isZero() && (s = h), i = i.add(s), r = r.sub(f)
                    }
                    return i
                }, e.div = e.divide, e.modulo = function(t) {
                    return p(t) || (t = y(t)), this.sub(this.div(t).mul(t))
                }, e.mod = e.modulo, e.not = function() {
                    return g(~this.low, ~this.high, this.unsigned)
                }, e.and = function(t) {
                    return p(t) || (t = y(t)), g(this.low & t.low, this.high & t.high, this.unsigned)
                }, e.or = function(t) {
                    return p(t) || (t = y(t)), g(this.low | t.low, this.high | t.high, this.unsigned)
                }, e.xor = function(t) {
                    return p(t) || (t = y(t)), g(this.low ^ t.low, this.high ^ t.high, this.unsigned)
                }, e.shiftLeft = function(t) {
                    return p(t) && (t = t.toInt()), 0 == (t &= 63) ? this : t < 32 ? g(this.low << t, this.high << t | this.low >>> 32 - t, this.unsigned) : g(0, this.low << t - 32, this.unsigned)
                }, e.shl = e.shiftLeft, e.shiftRight = function(t) {
                    return p(t) && (t = t.toInt()), 0 == (t &= 63) ? this : t < 32 ? g(this.low >>> t | this.high << 32 - t, this.high >> t, this.unsigned) : g(this.high >> t - 32, 0 <= this.high ? 0 : -1, this.unsigned)
                }, e.shr = e.shiftRight, e.shiftRightUnsigned = function(t) {
                    if (p(t) && (t = t.toInt()), 0 === (t &= 63)) return this;
                    var e = this.high;
                    return t < 32 ? g(this.low >>> t | e << 32 - t, e >>> t, this.unsigned) : g(32 === t ? e : e >>> t - 32, 0, this.unsigned)
                }, e.shru = e.shiftRightUnsigned, e.toSigned = function() {
                    return this.unsigned ? g(this.low, this.high, !1) : this
                }, e.toUnsigned = function() {
                    return this.unsigned ? this : g(this.low, this.high, !0)
                }, e.toBytes = function(t) {
                    return t ? this.toBytesLE() : this.toBytesBE()
                }, e.toBytesLE = function() {
                    var t = this.high,
                        e = this.low;
                    return [255 & e, e >>> 8 & 255, e >>> 16 & 255, e >>> 24 & 255, 255 & t, t >>> 8 & 255, t >>> 16 & 255, t >>> 24 & 255]
                }, e.toBytesBE = function() {
                    var t = this.high,
                        e = this.low;
                    return [t >>> 24 & 255, t >>> 16 & 255, t >>> 8 & 255, 255 & t, e >>> 24 & 255, e >>> 16 & 255, e >>> 8 & 255, 255 & e]
                }, i
            }, "function" == typeof t && "object" == typeof e && e && e.exports ? e.exports = n() : (i.dcodeIO = i.dcodeIO || {}).Long = n()
        }, {}],
        62: [function(n, o, t) {
            (function(e) {
                "use strict";
                var t = n("inherits"),
                    r = n("hash-base"),
                    s = new Array(16);

                function i() {
                    r.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878
                }
                function f(t, e) {
                    return t << e | t >>> 32 - e
                }
                function a(t, e, r, i, n, o, s) {
                    return f(t + (e & r | ~e & i) + n + o | 0, s) + e | 0
                }
                function h(t, e, r, i, n, o, s) {
                    return f(t + (e & i | r & ~i) + n + o | 0, s) + e | 0
                }
                function u(t, e, r, i, n, o, s) {
                    return f(t + (e ^ r ^ i) + n + o | 0, s) + e | 0
                }
                function l(t, e, r, i, n, o, s) {
                    return f(t + (r ^ (e | ~i)) + n + o | 0, s) + e | 0
                }
                t(i, r), i.prototype._update = function() {
                    for (var t = s, e = 0; e < 16; ++e) t[e] = this._block.readInt32LE(4 * e);
                    var r = this._a,
                        i = this._b,
                        n = this._c,
                        o = this._d;
                    i = l(i = l(i = l(i = l(i = u(i = u(i = u(i = u(i = h(i = h(i = h(i = h(i = a(i = a(i = a(i = a(i, n = a(n, o = a(o, r = a(r, i, n, o, t[0], 3614090360, 7), i, n, t[1], 3905402710, 12), r, i, t[2], 606105819, 17), o, r, t[3], 3250441966, 22), n = a(n, o = a(o, r = a(r, i, n, o, t[4], 4118548399, 7), i, n, t[5], 1200080426, 12), r, i, t[6], 2821735955, 17), o, r, t[7], 4249261313, 22), n = a(n, o = a(o, r = a(r, i, n, o, t[8], 1770035416, 7), i, n, t[9], 2336552879, 12), r, i, t[10], 4294925233, 17), o, r, t[11], 2304563134, 22), n = a(n, o = a(o, r = a(r, i, n, o, t[12], 1804603682, 7), i, n, t[13], 4254626195, 12), r, i, t[14], 2792965006, 17), o, r, t[15], 1236535329, 22), n = h(n, o = h(o, r = h(r, i, n, o, t[1], 4129170786, 5), i, n, t[6], 3225465664, 9), r, i, t[11], 643717713, 14), o, r, t[0], 3921069994, 20), n = h(n, o = h(o, r = h(r, i, n, o, t[5], 3593408605, 5), i, n, t[10], 38016083, 9), r, i, t[15], 3634488961, 14), o, r, t[4], 3889429448, 20), n = h(n, o = h(o, r = h(r, i, n, o, t[9], 568446438, 5), i, n, t[14], 3275163606, 9), r, i, t[3], 4107603335, 14), o, r, t[8], 1163531501, 20), n = h(n, o = h(o, r = h(r, i, n, o, t[13], 2850285829, 5), i, n, t[2], 4243563512, 9), r, i, t[7], 1735328473, 14), o, r, t[12], 2368359562, 20), n = u(n, o = u(o, r = u(r, i, n, o, t[5], 4294588738, 4), i, n, t[8], 2272392833, 11), r, i, t[11], 1839030562, 16), o, r, t[14], 4259657740, 23), n = u(n, o = u(o, r = u(r, i, n, o, t[1], 2763975236, 4), i, n, t[4], 1272893353, 11), r, i, t[7], 4139469664, 16), o, r, t[10], 3200236656, 23), n = u(n, o = u(o, r = u(r, i, n, o, t[13], 681279174, 4), i, n, t[0], 3936430074, 11), r, i, t[3], 3572445317, 16), o, r, t[6], 76029189, 23), n = u(n, o = u(o, r = u(r, i, n, o, t[9], 3654602809, 4), i, n, t[12], 3873151461, 11), r, i, t[15], 530742520, 16), o, r, t[2], 3299628645, 23), n = l(n, o = l(o, r = l(r, i, n, o, t[0], 4096336452, 6), i, n, t[7], 1126891415, 10), r, i, t[14], 2878612391, 15), o, r, t[5], 4237533241, 21), n = l(n, o = l(o, r = l(r, i, n, o, t[12], 1700485571, 6), i, n, t[3], 2399980690, 10), r, i, t[10], 4293915773, 15), o, r, t[1], 2240044497, 21), n = l(n, o = l(o, r = l(r, i, n, o, t[8], 1873313359, 6), i, n, t[15], 4264355552, 10), r, i, t[6], 2734768916, 15), o, r, t[13], 1309151649, 21), n = l(n, o = l(o, r = l(r, i, n, o, t[4], 4149444226, 6), i, n, t[11], 3174756917, 10), r, i, t[2], 718787259, 15), o, r, t[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + i | 0, this._c = this._c + n | 0, this._d = this._d + o | 0
                }, i.prototype._digest = function() {
                    this._block[this._blockOffset++] = 128, 56 < this._blockOffset && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
                    var t = new e(16);
                    return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t
                }, o.exports = i
            }).call(this, n("buffer").Buffer)
        }, {
            buffer: 40,
            "hash-base": 63,
            inherits: 58
        }],
        63: [function(t, e, r) {
            "use strict";
            var f = t("safe-buffer").Buffer,
                i = t("stream").Transform;

            function n(t) {
                i.call(this), this._block = f.allocUnsafe(t), this._blockSize = t, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1
            }
            t("inherits")(n, i), n.prototype._transform = function(t, e, r) {
                var i = null;
                try {
                    this.update(t, e)
                } catch (t) {
                    i = t
                }
                r(i)
            }, n.prototype._flush = function(t) {
                var e = null;
                try {
                    this.push(this.digest())
                } catch (t) {
                    e = t
                }
                t(e)
            }, n.prototype.update = function(t, e) {
                if (function(t, e) {
                    if (!f.isBuffer(t) && "string" != typeof t) throw new TypeError(e + " must be a string or a buffer")
                }(t, "Data"), this._finalized) throw new Error("Digest already called");
                f.isBuffer(t) || (t = f.from(t, e));
                for (var r = this._block, i = 0; this._blockOffset + t.length - i >= this._blockSize;) {
                    for (var n = this._blockOffset; n < this._blockSize;) r[n++] = t[i++];
                    this._update(), this._blockOffset = 0
                }
                for (; i < t.length;) r[this._blockOffset++] = t[i++];
                for (var o = 0, s = 8 * t.length; 0 < s; ++o) this._length[o] += s, 0 < (s = this._length[o] / 4294967296 | 0) && (this._length[o] -= 4294967296 * s);
                return this
            }, n.prototype._update = function() {
                throw new Error("_update is not implemented")
            }, n.prototype.digest = function(t) {
                if (this._finalized) throw new Error("Digest already called");
                this._finalized = !0;
                var e = this._digest();
                void 0 !== t && (e = e.toString(t)), this._block.fill(0);
                for (var r = this._blockOffset = 0; r < 4; ++r) this._length[r] = 0;
                return e
            }, n.prototype._digest = function() {
                throw new Error("_digest is not implemented")
            }, e.exports = n
        }, {
            inherits: 58,
            "safe-buffer": 81,
            stream: 90
        }],
        64: [function(t, e, r) {
            (function(f) {
                "use strict";
                !f.version || 0 === f.version.indexOf("v0.") || 0 === f.version.indexOf("v1.") && 0 !== f.version.indexOf("v1.8.") ? e.exports = function(t, e, r, i) {
                    if ("function" != typeof t) throw new TypeError('"callback" argument must be a function');
                    var n, o, s = arguments.length;
                    switch (s) {
                        case 0:
                        case 1:
                            return f.nextTick(t);
                        case 2:
                            return f.nextTick(function() {
                                t.call(null, e)
                            });
                        case 3:
                            return f.nextTick(function() {
                                t.call(null, e, r)
                            });
                        case 4:
                            return f.nextTick(function() {
                                t.call(null, e, r, i)
                            });
                        default:
                            for (n = new Array(s - 1), o = 0; o < n.length;) n[o++] = arguments[o];
                            return f.nextTick(function() {
                                t.apply(null, n)
                            })
                    }
                } : e.exports = f.nextTick
            }).call(this, t("_process"))
        }, {
            _process: 65
        }],
        65: [function(t, e, r) {
            var i, n, o = e.exports = {};

            function s() {
                throw new Error("setTimeout has not been defined")
            }
            function f() {
                throw new Error("clearTimeout has not been defined")
            }
            function a(e) {
                if (i === setTimeout) return setTimeout(e, 0);
                if ((i === s || !i) && setTimeout) return i = setTimeout, setTimeout(e, 0);
                try {
                    return i(e, 0)
                } catch (t) {
                    try {
                        return i.call(null, e, 0)
                    } catch (t) {
                        return i.call(this, e, 0)
                    }
                }
            }! function() {
                try {
                    i = "function" == typeof setTimeout ? setTimeout : s
                } catch (t) {
                    i = s
                }
                try {
                    n = "function" == typeof clearTimeout ? clearTimeout : f
                } catch (t) {
                    n = f
                }
            }();
            var h, u = [],
                l = !1,
                c = -1;

            function p() {
                l && h && (l = !1, h.length ? u = h.concat(u) : c = -1, u.length && d())
            }
            function d() {
                if (!l) {
                    var t = a(p);
                    l = !0;
                    for (var e = u.length; e;) {
                        for (h = u, u = []; ++c < e;) h && h[c].run();
                        c = -1, e = u.length
                    }
                    h = null, l = !1,
                    function(e) {
                        if (n === clearTimeout) return clearTimeout(e);
                        if ((n === f || !n) && clearTimeout) return n = clearTimeout, clearTimeout(e);
                        try {
                            n(e)
                        } catch (t) {
                            try {
                                return n.call(null, e)
                            } catch (t) {
                                return n.call(this, e)
                            }
                        }
                    }(t)
                }
            }
            function g(t, e) {
                this.fun = t, this.array = e
            }
            function y() {}
            o.nextTick = function(t) {
                var e = new Array(arguments.length - 1);
                if (1 < arguments.length) for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
                u.push(new g(t, e)), 1 !== u.length || l || a(d)
            }, g.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = y, o.addListener = y, o.once = y, o.off = y, o.removeListener = y, o.removeAllListeners = y, o.emit = y, o.prependListener = y, o.prependOnceListener = y, o.listeners = function(t) {
                return []
            }, o.binding = function(t) {
                throw new Error("process.binding is not supported")
            }, o.cwd = function() {
                return "/"
            }, o.chdir = function(t) {
                throw new Error("process.chdir is not supported")
            }, o.umask = function() {
                return 0
            }
        }, {}],
        66: [function(t, e, r) {
            (function(n, o) {
                "use strict";
                var s = t("safe-buffer").Buffer,
                    f = o.crypto || o.msCrypto;
                f && f.getRandomValues ? e.exports = function(t, e) {
                    if (65536 < t) throw new Error("requested too many random bytes");
                    var r = new o.Uint8Array(t);
                    0 < t && f.getRandomValues(r);
                    var i = s.from(r.buffer);
                    if ("function" == typeof e) return n.nextTick(function() {
                        e(null, i)
                    });
                    return i
                } : e.exports = function() {
                    throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11")
                }
            }).call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            _process: 65,
            "safe-buffer": 81
        }],
        67: [function(t, e, r) {
            e.exports = t("./lib/_stream_duplex.js")
        }, {
            "./lib/_stream_duplex.js": 68
        }],
        68: [function(t, e, r) {
            "use strict";
            var i = t("process-nextick-args"),
                n = Object.keys || function(t) {
                    var e = [];
                    for (var r in t) e.push(r);
                    return e
                };
            e.exports = l;
            var o = t("core-util-is");
            o.inherits = t("inherits");
            var s = t("./_stream_readable"),
                f = t("./_stream_writable");
            o.inherits(l, s);
            for (var a = n(f.prototype), h = 0; h < a.length; h++) {
                var u = a[h];
                l.prototype[u] || (l.prototype[u] = f.prototype[u])
            }
            function l(t) {
                if (!(this instanceof l)) return new l(t);
                s.call(this, t), f.call(this, t), t && !1 === t.readable && (this.readable = !1), t && !1 === t.writable && (this.writable = !1), this.allowHalfOpen = !0, t && !1 === t.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", c)
            }
            function c() {
                this.allowHalfOpen || this._writableState.ended || i(p, this)
            }
            function p(t) {
                t.end()
            }
            Object.defineProperty(l.prototype, "destroyed", {
                get: function() {
                    return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
                },
                set: function(t) {
                    void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = t, this._writableState.destroyed = t)
                }
            }), l.prototype._destroy = function(t, e) {
                this.push(null), this.end(), i(e, t)
            }
        }, {
            "./_stream_readable": 70,
            "./_stream_writable": 72,
            "core-util-is": 43,
            inherits: 58,
            "process-nextick-args": 64
        }],
        69: [function(t, e, r) {
            "use strict";
            e.exports = o;
            var i = t("./_stream_transform"),
                n = t("core-util-is");

            function o(t) {
                if (!(this instanceof o)) return new o(t);
                i.call(this, t)
            }
            n.inherits = t("inherits"), n.inherits(o, i), o.prototype._transform = function(t, e, r) {
                r(null, t)
            }
        }, {
            "./_stream_transform": 71,
            "core-util-is": 43,
            inherits: 58
        }],
        70: [function(O, C, t) {
            (function(y, t) {
                "use strict";
                var v = O("process-nextick-args");
                C.exports = c;
                var n, b = O("isarray");
                c.ReadableState = l;
                O("events").EventEmitter;
                var w = function(t, e) {
                    return t.listeners(e).length
                }, o = O("./internal/streams/stream"),
                    h = O("safe-buffer").Buffer,
                    u = t.Uint8Array || function() {};
                var e = O("core-util-is");
                e.inherits = O("inherits");
                var r = O("util"),
                    m = void 0;
                m = r && r.debuglog ? r.debuglog("stream") : function() {};
                var s, f = O("./internal/streams/BufferList"),
                    i = O("./internal/streams/destroy");
                e.inherits(c, o);
                var a = ["error", "close", "destroy", "pause", "resume"];

                function l(t, e) {
                    n = n || O("./_stream_duplex"), t = t || {}, this.objectMode = !! t.objectMode, e instanceof n && (this.objectMode = this.objectMode || !! t.readableObjectMode);
                    var r = t.highWaterMark,
                        i = this.objectMode ? 16 : 16384;
                    this.highWaterMark = r || 0 === r ? r : i, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new f, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (s || (s = O("string_decoder/").StringDecoder), this.decoder = new s(t.encoding), this.encoding = t.encoding)
                }
                function c(t) {
                    if (n = n || O("./_stream_duplex"), !(this instanceof c)) return new c(t);
                    this._readableState = new l(t, this), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), "function" == typeof t.destroy && (this._destroy = t.destroy)), o.call(this)
                }
                function p(t, e, r, i, n) {
                    var o, s, f, a = t._readableState;
                    null === e ? (a.reading = !1, function(t, e) {
                        if (e.ended) return;
                        if (e.decoder) {
                            var r = e.decoder.end();
                            r && r.length && (e.buffer.push(r), e.length += e.objectMode ? 1 : r.length)
                        }
                        e.ended = !0, E(t)
                    }(t, a)) : (n || (o = function(t, e) {
                        var r;
                        i = e, h.isBuffer(i) || i instanceof u || "string" == typeof e || void 0 === e || t.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
                        var i;
                        return r
                    }(a, e)), o ? t.emit("error", o) : a.objectMode || e && 0 < e.length ? ("string" == typeof e || a.objectMode || Object.getPrototypeOf(e) === h.prototype || (s = e, e = h.from(s)), i ? a.endEmitted ? t.emit("error", new Error("stream.unshift() after end event")) : d(t, a, e, !0) : a.ended ? t.emit("error", new Error("stream.push() after EOF")) : (a.reading = !1, a.decoder && !r ? (e = a.decoder.write(e), a.objectMode || 0 !== e.length ? d(t, a, e, !1) : B(t, a)) : d(t, a, e, !1))) : i || (a.reading = !1));
                    return !(f = a).ended && (f.needReadable || f.length < f.highWaterMark || 0 === f.length)
                }
                function d(t, e, r, i) {
                    e.flowing && 0 === e.length && !e.sync ? (t.emit("data", r), t.read(0)) : (e.length += e.objectMode ? 1 : r.length, i ? e.buffer.unshift(r) : e.buffer.push(r), e.needReadable && E(t)), B(t, e)
                }
                Object.defineProperty(c.prototype, "destroyed", {
                    get: function() {
                        return void 0 !== this._readableState && this._readableState.destroyed
                    },
                    set: function(t) {
                        this._readableState && (this._readableState.destroyed = t)
                    }
                }), c.prototype.destroy = i.destroy, c.prototype._undestroy = i.undestroy, c.prototype._destroy = function(t, e) {
                    this.push(null), e(t)
                }, c.prototype.push = function(t, e) {
                    var r, i = this._readableState;
                    return i.objectMode ? r = !0 : "string" == typeof t && ((e = e || i.defaultEncoding) !== i.encoding && (t = h.from(t, e), e = ""), r = !0), p(this, t, e, !1, r)
                }, c.prototype.unshift = function(t) {
                    return p(this, t, null, !0, !1)
                }, c.prototype.isPaused = function() {
                    return !1 === this._readableState.flowing
                }, c.prototype.setEncoding = function(t) {
                    return s || (s = O("string_decoder/").StringDecoder), this._readableState.decoder = new s(t), this._readableState.encoding = t, this
                };
                var g = 8388608;

                function _(t, e) {
                    return t <= 0 || 0 === e.length && e.ended ? 0 : e.objectMode ? 1 : t != t ? e.flowing && e.length ? e.buffer.head.data.length : e.length : (t > e.highWaterMark && (e.highWaterMark = (g <= (r = t) ? r = g : (r--, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r++), r)), t <= e.length ? t : e.ended ? e.length : (e.needReadable = !0, 0));
                    var r
                }
                function E(t) {
                    var e = t._readableState;
                    e.needReadable = !1, e.emittedReadable || (m("emitReadable", e.flowing), e.emittedReadable = !0, e.sync ? v(S, t) : S(t))
                }
                function S(t) {
                    m("emit readable"), t.emit("readable"), A(t)
                }
                function B(t, e) {
                    e.readingMore || (e.readingMore = !0, v(T, t, e))
                }
                function T(t, e) {
                    for (var r = e.length; !e.reading && !e.flowing && !e.ended && e.length < e.highWaterMark && (m("maybeReadMore read 0"), t.read(0), r !== e.length);) r = e.length;
                    e.readingMore = !1
                }
                function I(t) {
                    m("readable nexttick read 0"), t.read(0)
                }
                function k(t, e) {
                    e.reading || (m("resume read 0"), t.read(0)), e.resumeScheduled = !1, e.awaitDrain = 0, t.emit("resume"), A(t), e.flowing && !e.reading && t.read(0)
                }
                function A(t) {
                    var e = t._readableState;
                    for (m("flow", e.flowing); e.flowing && null !== t.read(););
                }
                function x(t, e) {
                    return 0 === e.length ? null : (e.objectMode ? r = e.buffer.shift() : !t || t >= e.length ? (r = e.decoder ? e.buffer.join("") : 1 === e.buffer.length ? e.buffer.head.data : e.buffer.concat(e.length), e.buffer.clear()) : r = function(t, e, r) {
                        var i;
                        t < e.head.data.length ? (i = e.head.data.slice(0, t), e.head.data = e.head.data.slice(t)) : i = t === e.head.data.length ? e.shift() : r ? function(t, e) {
                            var r = e.head,
                                i = 1,
                                n = r.data;
                            t -= n.length;
                            for (; r = r.next;) {
                                var o = r.data,
                                    s = t > o.length ? o.length : t;
                                if (s === o.length ? n += o : n += o.slice(0, t), 0 === (t -= s)) {
                                    s === o.length ? (++i, r.next ? e.head = r.next : e.head = e.tail = null) : (e.head = r).data = o.slice(s);
                                    break
                                }++i
                            }
                            return e.length -= i, n
                        }(t, e) : function(t, e) {
                            var r = h.allocUnsafe(t),
                                i = e.head,
                                n = 1;
                            i.data.copy(r), t -= i.data.length;
                            for (; i = i.next;) {
                                var o = i.data,
                                    s = t > o.length ? o.length : t;
                                if (o.copy(r, r.length - t, 0, s), 0 === (t -= s)) {
                                    s === o.length ? (++n, i.next ? e.head = i.next : e.head = e.tail = null) : (e.head = i).data = o.slice(s);
                                    break
                                }++n
                            }
                            return e.length -= n, r
                        }(t, e);
                        return i
                    }(t, e.buffer, e.decoder), r);
                    var r
                }
                function L(t) {
                    var e = t._readableState;
                    if (0 < e.length) throw new Error('"endReadable()" called on non-empty stream');
                    e.endEmitted || (e.ended = !0, v(U, e, t))
                }
                function U(t, e) {
                    t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"))
                }
                function R(t, e) {
                    for (var r = 0, i = t.length; r < i; r++) if (t[r] === e) return r;
                    return -1
                }
                c.prototype.read = function(t) {
                    m("read", t), t = parseInt(t, 10);
                    var e = this._readableState,
                        r = t;
                    if (0 !== t && (e.emittedReadable = !1), 0 === t && e.needReadable && (e.length >= e.highWaterMark || e.ended)) return m("read: emitReadable", e.length, e.ended), 0 === e.length && e.ended ? L(this) : E(this), null;
                    if (0 === (t = _(t, e)) && e.ended) return 0 === e.length && L(this), null;
                    var i, n = e.needReadable;
                    return m("need readable", n), (0 === e.length || e.length - t < e.highWaterMark) && m("length less than watermark", n = !0), e.ended || e.reading ? m("reading or ended", n = !1) : n && (m("do read"), e.reading = !0, e.sync = !0, 0 === e.length && (e.needReadable = !0), this._read(e.highWaterMark), e.sync = !1, e.reading || (t = _(r, e))), null === (i = 0 < t ? x(t, e) : null) ? (e.needReadable = !0, t = 0) : e.length -= t, 0 === e.length && (e.ended || (e.needReadable = !0), r !== t && e.ended && L(this)), null !== i && this.emit("data", i), i
                }, c.prototype._read = function(t) {
                    this.emit("error", new Error("_read() is not implemented"))
                }, c.prototype.pipe = function(r, t) {
                    var i = this,
                        n = this._readableState;
                    switch (n.pipesCount) {
                        case 0:
                            n.pipes = r;
                            break;
                        case 1:
                            n.pipes = [n.pipes, r];
                            break;
                        default:
                            n.pipes.push(r)
                    }
                    n.pipesCount += 1, m("pipe count=%d opts=%j", n.pipesCount, t);
                    var e = (!t || !1 !== t.end) && r !== y.stdout && r !== y.stderr ? s : g;

                    function o(t, e) {
                        m("onunpipe"), t === i && e && !1 === e.hasUnpiped && (e.hasUnpiped = !0, m("cleanup"), r.removeListener("close", p), r.removeListener("finish", d), r.removeListener("drain", a), r.removeListener("error", c), r.removeListener("unpipe", o), i.removeListener("end", s), i.removeListener("end", g), i.removeListener("data", l), h = !0, !n.awaitDrain || r._writableState && !r._writableState.needDrain || a())
                    }
                    function s() {
                        m("onend"), r.end()
                    }
                    n.endEmitted ? v(e) : i.once("end", e), r.on("unpipe", o);
                    var f, a = (f = i, function() {
                        var t = f._readableState;
                        m("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && w(f, "data") && (t.flowing = !0, A(f))
                    });
                    r.on("drain", a);
                    var h = !1;
                    var u = !1;

                    function l(t) {
                        m("ondata"), (u = !1) !== r.write(t) || u || ((1 === n.pipesCount && n.pipes === r || 1 < n.pipesCount && -1 !== R(n.pipes, r)) && !h && (m("false write response, pause", i._readableState.awaitDrain), i._readableState.awaitDrain++, u = !0), i.pause())
                    }
                    function c(t) {
                        m("onerror", t), g(), r.removeListener("error", c), 0 === w(r, "error") && r.emit("error", t)
                    }
                    function p() {
                        r.removeListener("finish", d), g()
                    }
                    function d() {
                        m("onfinish"), r.removeListener("close", p), g()
                    }
                    function g() {
                        m("unpipe"), i.unpipe(r)
                    }
                    return i.on("data", l),
                    function(t, e, r) {
                        if ("function" == typeof t.prependListener) return t.prependListener(e, r);
                        t._events && t._events[e] ? b(t._events[e]) ? t._events[e].unshift(r) : t._events[e] = [r, t._events[e]] : t.on(e, r)
                    }(r, "error", c), r.once("close", p), r.once("finish", d), r.emit("pipe", i), n.flowing || (m("pipe resume"), i.resume()), r
                }, c.prototype.unpipe = function(t) {
                    var e = this._readableState,
                        r = {
                            hasUnpiped: !1
                        };
                    if (0 === e.pipesCount) return this;
                    if (1 === e.pipesCount) return t && t !== e.pipes || (t || (t = e.pipes), e.pipes = null, e.pipesCount = 0, e.flowing = !1, t && t.emit("unpipe", this, r)), this;
                    if (!t) {
                        var i = e.pipes,
                            n = e.pipesCount;
                        e.pipes = null, e.pipesCount = 0, e.flowing = !1;
                        for (var o = 0; o < n; o++) i[o].emit("unpipe", this, r);
                        return this
                    }
                    var s = R(e.pipes, t);
                    return -1 === s || (e.pipes.splice(s, 1), e.pipesCount -= 1, 1 === e.pipesCount && (e.pipes = e.pipes[0]), t.emit("unpipe", this, r)), this
                }, c.prototype.addListener = c.prototype.on = function(t, e) {
                    var r = o.prototype.on.call(this, t, e);
                    if ("data" === t)!1 !== this._readableState.flowing && this.resume();
                    else if ("readable" === t) {
                        var i = this._readableState;
                        i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && E(this) : v(I, this))
                    }
                    return r
                }, c.prototype.resume = function() {
                    var t, e, r = this._readableState;
                    return r.flowing || (m("resume"), r.flowing = !0, t = this, (e = r).resumeScheduled || (e.resumeScheduled = !0, v(k, t, e))), this
                }, c.prototype.pause = function() {
                    return m("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (m("pause"), this._readableState.flowing = !1, this.emit("pause")), this
                }, c.prototype.wrap = function(e) {
                    var r = this._readableState,
                        i = !1,
                        n = this;
                    for (var t in e.on("end", function() {
                        if (m("wrapped end"), r.decoder && !r.ended) {
                            var t = r.decoder.end();
                            t && t.length && n.push(t)
                        }
                        n.push(null)
                    }), e.on("data", function(t) {
                        (m("wrapped data"), r.decoder && (t = r.decoder.write(t)), r.objectMode && null == t) || (r.objectMode || t && t.length) && (n.push(t) || (i = !0, e.pause()))
                    }), e) void 0 === this[t] && "function" == typeof e[t] && (this[t] = function(t) {
                        return function() {
                            return e[t].apply(e, arguments)
                        }
                    }(t));
                    for (var o = 0; o < a.length; o++) e.on(a[o], n.emit.bind(n, a[o]));
                    return n._read = function(t) {
                        m("wrapped _read", t), i && (i = !1, e.resume())
                    }, n
                }, c._fromList = x
            }).call(this, O("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./_stream_duplex": 68,
            "./internal/streams/BufferList": 73,
            "./internal/streams/destroy": 74,
            "./internal/streams/stream": 75,
            _process: 65,
            "core-util-is": 43,
            events: 54,
            inherits: 58,
            isarray: 60,
            "process-nextick-args": 64,
            "safe-buffer": 81,
            "string_decoder/": 91,
            util: 21
        }],
        71: [function(t, e, r) {
            "use strict";
            e.exports = s;
            var i = t("./_stream_duplex"),
                n = t("core-util-is");

            function o(r) {
                this.afterTransform = function(t, e) {
                    return function(t, e, r) {
                        var i = t._transformState;
                        i.transforming = !1;
                        var n = i.writecb;
                        if (!n) return t.emit("error", new Error("write callback called multiple times"));
                        i.writechunk = null, (i.writecb = null) != r && t.push(r);
                        n(e);
                        var o = t._readableState;
                        o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && t._read(o.highWaterMark)
                    }(r, t, e)
                }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null
            }
            function s(t) {
                if (!(this instanceof s)) return new s(t);
                i.call(this, t), this._transformState = new o(this);
                var r = this;
                this._readableState.needReadable = !0, this._readableState.sync = !1, t && ("function" == typeof t.transform && (this._transform = t.transform), "function" == typeof t.flush && (this._flush = t.flush)), this.once("prefinish", function() {
                    "function" == typeof this._flush ? this._flush(function(t, e) {
                        f(r, t, e)
                    }) : f(r)
                })
            }
            function f(t, e, r) {
                if (e) return t.emit("error", e);
                null != r && t.push(r);
                var i = t._writableState,
                    n = t._transformState;
                if (i.length) throw new Error("Calling transform done when ws.length != 0");
                if (n.transforming) throw new Error("Calling transform done when still transforming");
                return t.push(null)
            }
            n.inherits = t("inherits"), n.inherits(s, i), s.prototype.push = function(t, e) {
                return this._transformState.needTransform = !1, i.prototype.push.call(this, t, e)
            }, s.prototype._transform = function(t, e, r) {
                throw new Error("_transform() is not implemented")
            }, s.prototype._write = function(t, e, r) {
                var i = this._transformState;
                if (i.writecb = r, i.writechunk = t, i.writeencoding = e, !i.transforming) {
                    var n = this._readableState;
                    (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark)
                }
            }, s.prototype._read = function(t) {
                var e = this._transformState;
                null !== e.writechunk && e.writecb && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0
            }, s.prototype._destroy = function(t, e) {
                var r = this;
                i.prototype._destroy.call(this, t, function(t) {
                    e(t), r.emit("close")
                })
            }
        }, {
            "./_stream_duplex": 68,
            "core-util-is": 43,
            inherits: 58
        }],
        72: [function(E, S, t) {
            (function(t, e) {
                "use strict";
                var v = E("process-nextick-args");

                function l(t) {
                    var e = this;
                    this.next = null, this.entry = null, this.finish = function() {
                        ! function(t, e, r) {
                            var i = t.entry;
                            t.entry = null;
                            for (; i;) {
                                var n = i.callback;
                                e.pendingcb--, n(r), i = i.next
                            }
                            e.corkedRequestsFree ? e.corkedRequestsFree.next = t : e.corkedRequestsFree = t
                        }(e, t)
                    }
                }
                S.exports = h;
                var o, c = !t.browser && -1 < ["v0.10", "v0.9."].indexOf(t.version.slice(0, 5)) ? setImmediate : v;
                h.WritableState = a;
                var r = E("core-util-is");
                r.inherits = E("inherits");
                var i = {
                    deprecate: E("util-deprecate")
                }, n = E("./internal/streams/stream"),
                    b = E("safe-buffer").Buffer,
                    w = e.Uint8Array || function() {};
                var s, f = E("./internal/streams/destroy");

                function m() {}
                function a(t, e) {
                    o = o || E("./_stream_duplex"), t = t || {}, this.objectMode = !! t.objectMode, e instanceof o && (this.objectMode = this.objectMode || !! t.writableObjectMode);
                    var r = t.highWaterMark,
                        i = this.objectMode ? 16 : 16384;
                    this.highWaterMark = r || 0 === r ? r : i, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
                    var n = (this.destroyed = !1) === t.decodeStrings;
                    this.decodeStrings = !n, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(t) {
                        ! function(t, e) {
                            var r = t._writableState,
                                i = r.sync,
                                n = r.writecb;
                            if (l = r, l.writing = !1, l.writecb = null, l.length -= l.writelen, l.writelen = 0, e) s = t, f = r, a = i, h = e, u = n, --f.pendingcb, a ? (v(u, h), v(y, s, f), s._writableState.errorEmitted = !0, s.emit("error", h)) : (u(h), s._writableState.errorEmitted = !0, s.emit("error", h), y(s, f));
                            else {
                                var o = g(r);
                                o || r.corked || r.bufferProcessing || !r.bufferedRequest || d(t, r), i ? c(p, t, r, o, n) : p(t, r, o, n)
                            }
                            var s, f, a, h, u;
                            var l
                        }(e, t)
                    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new l(this)
                }
                function h(t) {
                    if (o = o || E("./_stream_duplex"), !(s.call(h, this) || this instanceof o)) return new h(t);
                    this._writableState = new a(t, this), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t.final && (this._final = t.final)), n.call(this)
                }
                function _(t, e, r, i, n, o, s) {
                    e.writelen = i, e.writecb = s, e.writing = !0, e.sync = !0, r ? t._writev(n, e.onwrite) : t._write(n, o, e.onwrite), e.sync = !1
                }
                function p(t, e, r, i) {
                    var n, o;
                    r || (n = t, 0 === (o = e).length && o.needDrain && (o.needDrain = !1, n.emit("drain"))), e.pendingcb--, i(), y(t, e)
                }
                function d(t, e) {
                    e.bufferProcessing = !0;
                    var r = e.bufferedRequest;
                    if (t._writev && r && r.next) {
                        var i = e.bufferedRequestCount,
                            n = new Array(i),
                            o = e.corkedRequestsFree;
                        o.entry = r;
                        for (var s = 0, f = !0; r;)(n[s] = r).isBuf || (f = !1), r = r.next, s += 1;
                        n.allBuffers = f, _(t, e, !0, e.length, n, "", o.finish), e.pendingcb++, e.lastBufferedRequest = null, o.next ? (e.corkedRequestsFree = o.next, o.next = null) : e.corkedRequestsFree = new l(e)
                    } else {
                        for (; r;) {
                            var a = r.chunk,
                                h = r.encoding,
                                u = r.callback;
                            if (_(t, e, !1, e.objectMode ? 1 : a.length, a, h, u), r = r.next, e.writing) break
                        }
                        null === r && (e.lastBufferedRequest = null)
                    }
                    e.bufferedRequestCount = 0, e.bufferedRequest = r, e.bufferProcessing = !1
                }
                function g(t) {
                    return t.ending && 0 === t.length && null === t.bufferedRequest && !t.finished && !t.writing
                }
                function u(e, r) {
                    e._final(function(t) {
                        r.pendingcb--, t && e.emit("error", t), r.prefinished = !0, e.emit("prefinish"), y(e, r)
                    })
                }
                function y(t, e) {
                    var r, i, n = g(e);
                    return n && (r = t, (i = e).prefinished || i.finalCalled || ("function" == typeof r._final ? (i.pendingcb++, i.finalCalled = !0, v(u, r, i)) : (i.prefinished = !0, r.emit("prefinish"))), 0 === e.pendingcb && (e.finished = !0, t.emit("finish"))), n
                }
                r.inherits(h, n), a.prototype.getBuffer = function() {
                    for (var t = this.bufferedRequest, e = []; t;) e.push(t), t = t.next;
                    return e
                },
                function() {
                    try {
                        Object.defineProperty(a.prototype, "buffer", {
                            get: i.deprecate(function() {
                                return this.getBuffer()
                            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                        })
                    } catch (t) {}
                }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (s = Function.prototype[Symbol.hasInstance], Object.defineProperty(h, Symbol.hasInstance, {
                    value: function(t) {
                        return !!s.call(this, t) || t && t._writableState instanceof a
                    }
                })) : s = function(t) {
                    return t instanceof this
                }, h.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe, not readable"))
                }, h.prototype.write = function(t, e, r) {
                    var i, n, o, s, f, a, h, u, l, c, p, d = this._writableState,
                        g = !1,
                        y = (i = t, (b.isBuffer(i) || i instanceof w) && !d.objectMode);
                    return y && !b.isBuffer(t) && (n = t, t = b.from(n)), "function" == typeof e && (r = e, e = null), y ? e = "buffer" : e || (e = d.defaultEncoding), "function" != typeof r && (r = m), d.ended ? (l = this, c = r, p = new Error("write after end"), l.emit("error", p), v(c, p)) : (y || (o = this, s = d, a = r, u = !(h = !0), null === (f = t) ? u = new TypeError("May not write null values to stream") : "string" == typeof f || void 0 === f || s.objectMode || (u = new TypeError("Invalid non-string/buffer chunk")), u && (o.emit("error", u), v(a, u), h = !1), h)) && (d.pendingcb++, g = function(t, e, r, i, n, o) {
                        if (!r) {
                            var s = function(t, e, r) {
                                t.objectMode || !1 === t.decodeStrings || "string" != typeof e || (e = b.from(e, r));
                                return e
                            }(e, i, n);
                            i !== s && (r = !0, n = "buffer", i = s)
                        }
                        var f = e.objectMode ? 1 : i.length;
                        e.length += f;
                        var a = e.length < e.highWaterMark;
                        a || (e.needDrain = !0);
                        if (e.writing || e.corked) {
                            var h = e.lastBufferedRequest;
                            e.lastBufferedRequest = {
                                chunk: i,
                                encoding: n,
                                isBuf: r,
                                callback: o,
                                next: null
                            }, h ? h.next = e.lastBufferedRequest : e.bufferedRequest = e.lastBufferedRequest, e.bufferedRequestCount += 1
                        } else _(t, e, !1, f, i, n, o);
                        return a
                    }(this, d, y, t, e, r)), g
                }, h.prototype.cork = function() {
                    this._writableState.corked++
                }, h.prototype.uncork = function() {
                    var t = this._writableState;
                    t.corked && (t.corked--, t.writing || t.corked || t.finished || t.bufferProcessing || !t.bufferedRequest || d(this, t))
                }, h.prototype.setDefaultEncoding = function(t) {
                    if ("string" == typeof t && (t = t.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((t + "").toLowerCase()))) throw new TypeError("Unknown encoding: " + t);
                    return this._writableState.defaultEncoding = t, this
                }, h.prototype._write = function(t, e, r) {
                    r(new Error("_write() is not implemented"))
                }, h.prototype._writev = null, h.prototype.end = function(t, e, r) {
                    var i = this._writableState;
                    "function" == typeof t ? (r = t, e = t = null) : "function" == typeof e && (r = e, e = null), null != t && this.write(t, e), i.corked && (i.corked = 1, this.uncork()), i.ending || i.finished || function(t, e, r) {
                        e.ending = !0, y(t, e), r && (e.finished ? v(r) : t.once("finish", r));
                        e.ended = !0, t.writable = !1
                    }(this, i, r)
                }, Object.defineProperty(h.prototype, "destroyed", {
                    get: function() {
                        return void 0 !== this._writableState && this._writableState.destroyed
                    },
                    set: function(t) {
                        this._writableState && (this._writableState.destroyed = t)
                    }
                }), h.prototype.destroy = f.destroy, h.prototype._undestroy = f.undestroy, h.prototype._destroy = function(t, e) {
                    this.end(), e(t)
                }
            }).call(this, E("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./_stream_duplex": 68,
            "./internal/streams/destroy": 74,
            "./internal/streams/stream": 75,
            _process: 65,
            "core-util-is": 43,
            inherits: 58,
            "process-nextick-args": 64,
            "safe-buffer": 81,
            "util-deprecate": 92
        }],
        73: [function(t, e, r) {
            "use strict";
            var f = t("safe-buffer").Buffer;
            e.exports = function() {
                function t() {
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.head = null, this.tail = null, this.length = 0
                }
                return t.prototype.push = function(t) {
                    var e = {
                        data: t,
                        next: null
                    };
                    0 < this.length ? this.tail.next = e : this.head = e, this.tail = e, ++this.length
                }, t.prototype.unshift = function(t) {
                    var e = {
                        data: t,
                        next: this.head
                    };
                    0 === this.length && (this.tail = e), this.head = e, ++this.length
                }, t.prototype.shift = function() {
                    if (0 !== this.length) {
                        var t = this.head.data;
                        return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, t
                    }
                }, t.prototype.clear = function() {
                    this.head = this.tail = null, this.length = 0
                }, t.prototype.join = function(t) {
                    if (0 === this.length) return "";
                    for (var e = this.head, r = "" + e.data; e = e.next;) r += t + e.data;
                    return r
                }, t.prototype.concat = function(t) {
                    if (0 === this.length) return f.alloc(0);
                    if (1 === this.length) return this.head.data;
                    for (var e, r, i, n = f.allocUnsafe(t >>> 0), o = this.head, s = 0; o;) e = o.data, r = n, i = s, e.copy(r, i), s += o.data.length, o = o.next;
                    return n
                }, t
            }()
        }, {
            "safe-buffer": 81
        }],
        74: [function(t, e, r) {
            "use strict";
            var o = t("process-nextick-args");

            function s(t, e) {
                t.emit("error", e)
            }
            e.exports = {
                destroy: function(t, e) {
                    var r = this,
                        i = this._readableState && this._readableState.destroyed,
                        n = this._writableState && this._writableState.destroyed;
                    i || n ? e ? e(t) : !t || this._writableState && this._writableState.errorEmitted || o(s, this, t) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(t || null, function(t) {
                        !e && t ? (o(s, r, t), r._writableState && (r._writableState.errorEmitted = !0)) : e && e(t)
                    }))
                },
                undestroy: function() {
                    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1)
                }
            }
        }, {
            "process-nextick-args": 64
        }],
        75: [function(t, e, r) {
            e.exports = t("events").EventEmitter
        }, {
            events: 54
        }],
        76: [function(t, e, r) {
            e.exports = t("./readable").PassThrough
        }, {
            "./readable": 77
        }],
        77: [function(t, e, r) {
            (((r = e.exports = t("./lib/_stream_readable.js")).Stream = r).Readable = r).Writable = t("./lib/_stream_writable.js"), r.Duplex = t("./lib/_stream_duplex.js"), r.Transform = t("./lib/_stream_transform.js"), r.PassThrough = t("./lib/_stream_passthrough.js")
        }, {
            "./lib/_stream_duplex.js": 68,
            "./lib/_stream_passthrough.js": 69,
            "./lib/_stream_readable.js": 70,
            "./lib/_stream_transform.js": 71,
            "./lib/_stream_writable.js": 72
        }],
        78: [function(t, e, r) {
            e.exports = t("./readable").Transform
        }, {
            "./readable": 77
        }],
        79: [function(t, e, r) {
            e.exports = t("./lib/_stream_writable.js")
        }, {
            "./lib/_stream_writable.js": 72
        }],
        80: [function(n, o, t) {
            (function(e) {
                "use strict";
                var t = n("inherits"),
                    r = n("hash-base");

                function i() {
                    r.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520
                }
                function p(t, e) {
                    return t << e | t >>> 32 - e
                }
                function d(t, e, r, i, n, o, s, f) {
                    return p(t + (e ^ r ^ i) + o + s | 0, f) + n | 0
                }
                function g(t, e, r, i, n, o, s, f) {
                    return p(t + (e & r | ~e & i) + o + s | 0, f) + n | 0
                }
                function y(t, e, r, i, n, o, s, f) {
                    return p(t + ((e | ~r) ^ i) + o + s | 0, f) + n | 0
                }
                function v(t, e, r, i, n, o, s, f) {
                    return p(t + (e & i | r & ~i) + o + s | 0, f) + n | 0
                }
                function b(t, e, r, i, n, o, s, f) {
                    return p(t + (e ^ (r | ~i)) + o + s | 0, f) + n | 0
                }
                t(i, r), i.prototype._update = function() {
                    for (var t = new Array(16), e = 0; e < 16; ++e) t[e] = this._block.readInt32LE(4 * e);
                    var r = this._a,
                        i = this._b,
                        n = this._c,
                        o = this._d,
                        s = this._e;
                    s = d(s, r = d(r, i, n, o, s, t[0], 0, 11), i, n = p(n, 10), o, t[1], 0, 14), i = d(i = p(i, 10), n = d(n, o = d(o, s, r, i, n, t[2], 0, 15), s, r = p(r, 10), i, t[3], 0, 12), o, s = p(s, 10), r, t[4], 0, 5), o = d(o = p(o, 10), s = d(s, r = d(r, i, n, o, s, t[5], 0, 8), i, n = p(n, 10), o, t[6], 0, 7), r, i = p(i, 10), n, t[7], 0, 9), r = d(r = p(r, 10), i = d(i, n = d(n, o, s, r, i, t[8], 0, 11), o, s = p(s, 10), r, t[9], 0, 13), n, o = p(o, 10), s, t[10], 0, 14), n = d(n = p(n, 10), o = d(o, s = d(s, r, i, n, o, t[11], 0, 15), r, i = p(i, 10), n, t[12], 0, 6), s, r = p(r, 10), i, t[13], 0, 7), s = g(s = p(s, 10), r = d(r, i = d(i, n, o, s, r, t[14], 0, 9), n, o = p(o, 10), s, t[15], 0, 8), i, n = p(n, 10), o, t[7], 1518500249, 7), i = g(i = p(i, 10), n = g(n, o = g(o, s, r, i, n, t[4], 1518500249, 6), s, r = p(r, 10), i, t[13], 1518500249, 8), o, s = p(s, 10), r, t[1], 1518500249, 13), o = g(o = p(o, 10), s = g(s, r = g(r, i, n, o, s, t[10], 1518500249, 11), i, n = p(n, 10), o, t[6], 1518500249, 9), r, i = p(i, 10), n, t[15], 1518500249, 7), r = g(r = p(r, 10), i = g(i, n = g(n, o, s, r, i, t[3], 1518500249, 15), o, s = p(s, 10), r, t[12], 1518500249, 7), n, o = p(o, 10), s, t[0], 1518500249, 12), n = g(n = p(n, 10), o = g(o, s = g(s, r, i, n, o, t[9], 1518500249, 15), r, i = p(i, 10), n, t[5], 1518500249, 9), s, r = p(r, 10), i, t[2], 1518500249, 11), s = g(s = p(s, 10), r = g(r, i = g(i, n, o, s, r, t[14], 1518500249, 7), n, o = p(o, 10), s, t[11], 1518500249, 13), i, n = p(n, 10), o, t[8], 1518500249, 12), i = y(i = p(i, 10), n = y(n, o = y(o, s, r, i, n, t[3], 1859775393, 11), s, r = p(r, 10), i, t[10], 1859775393, 13), o, s = p(s, 10), r, t[14], 1859775393, 6), o = y(o = p(o, 10), s = y(s, r = y(r, i, n, o, s, t[4], 1859775393, 7), i, n = p(n, 10), o, t[9], 1859775393, 14), r, i = p(i, 10), n, t[15], 1859775393, 9), r = y(r = p(r, 10), i = y(i, n = y(n, o, s, r, i, t[8], 1859775393, 13), o, s = p(s, 10), r, t[1], 1859775393, 15), n, o = p(o, 10), s, t[2], 1859775393, 14), n = y(n = p(n, 10), o = y(o, s = y(s, r, i, n, o, t[7], 1859775393, 8), r, i = p(i, 10), n, t[0], 1859775393, 13), s, r = p(r, 10), i, t[6], 1859775393, 6), s = y(s = p(s, 10), r = y(r, i = y(i, n, o, s, r, t[13], 1859775393, 5), n, o = p(o, 10), s, t[11], 1859775393, 12), i, n = p(n, 10), o, t[5], 1859775393, 7), i = v(i = p(i, 10), n = v(n, o = y(o, s, r, i, n, t[12], 1859775393, 5), s, r = p(r, 10), i, t[1], 2400959708, 11), o, s = p(s, 10), r, t[9], 2400959708, 12), o = v(o = p(o, 10), s = v(s, r = v(r, i, n, o, s, t[11], 2400959708, 14), i, n = p(n, 10), o, t[10], 2400959708, 15), r, i = p(i, 10), n, t[0], 2400959708, 14), r = v(r = p(r, 10), i = v(i, n = v(n, o, s, r, i, t[8], 2400959708, 15), o, s = p(s, 10), r, t[12], 2400959708, 9), n, o = p(o, 10), s, t[4], 2400959708, 8), n = v(n = p(n, 10), o = v(o, s = v(s, r, i, n, o, t[13], 2400959708, 9), r, i = p(i, 10), n, t[3], 2400959708, 14), s, r = p(r, 10), i, t[7], 2400959708, 5), s = v(s = p(s, 10), r = v(r, i = v(i, n, o, s, r, t[15], 2400959708, 6), n, o = p(o, 10), s, t[14], 2400959708, 8), i, n = p(n, 10), o, t[5], 2400959708, 6), i = b(i = p(i, 10), n = v(n, o = v(o, s, r, i, n, t[6], 2400959708, 5), s, r = p(r, 10), i, t[2], 2400959708, 12), o, s = p(s, 10), r, t[4], 2840853838, 9), o = b(o = p(o, 10), s = b(s, r = b(r, i, n, o, s, t[0], 2840853838, 15), i, n = p(n, 10), o, t[5], 2840853838, 5), r, i = p(i, 10), n, t[9], 2840853838, 11), r = b(r = p(r, 10), i = b(i, n = b(n, o, s, r, i, t[7], 2840853838, 6), o, s = p(s, 10), r, t[12], 2840853838, 8), n, o = p(o, 10), s, t[2], 2840853838, 13), n = b(n = p(n, 10), o = b(o, s = b(s, r, i, n, o, t[10], 2840853838, 12), r, i = p(i, 10), n, t[14], 2840853838, 5), s, r = p(r, 10), i, t[1], 2840853838, 12), s = b(s = p(s, 10), r = b(r, i = b(i, n, o, s, r, t[3], 2840853838, 13), n, o = p(o, 10), s, t[8], 2840853838, 14), i, n = p(n, 10), o, t[11], 2840853838, 11), i = b(i = p(i, 10), n = b(n, o = b(o, s, r, i, n, t[6], 2840853838, 8), s, r = p(r, 10), i, t[15], 2840853838, 5), o, s = p(s, 10), r, t[13], 2840853838, 6), o = p(o, 10);
                    var f = this._a,
                        a = this._b,
                        h = this._c,
                        u = this._d,
                        l = this._e;
                    l = b(l, f = b(f, a, h, u, l, t[5], 1352829926, 8), a, h = p(h, 10), u, t[14], 1352829926, 9), a = b(a = p(a, 10), h = b(h, u = b(u, l, f, a, h, t[7], 1352829926, 9), l, f = p(f, 10), a, t[0], 1352829926, 11), u, l = p(l, 10), f, t[9], 1352829926, 13), u = b(u = p(u, 10), l = b(l, f = b(f, a, h, u, l, t[2], 1352829926, 15), a, h = p(h, 10), u, t[11], 1352829926, 15), f, a = p(a, 10), h, t[4], 1352829926, 5), f = b(f = p(f, 10), a = b(a, h = b(h, u, l, f, a, t[13], 1352829926, 7), u, l = p(l, 10), f, t[6], 1352829926, 7), h, u = p(u, 10), l, t[15], 1352829926, 8), h = b(h = p(h, 10), u = b(u, l = b(l, f, a, h, u, t[8], 1352829926, 11), f, a = p(a, 10), h, t[1], 1352829926, 14), l, f = p(f, 10), a, t[10], 1352829926, 14), l = v(l = p(l, 10), f = b(f, a = b(a, h, u, l, f, t[3], 1352829926, 12), h, u = p(u, 10), l, t[12], 1352829926, 6), a, h = p(h, 10), u, t[6], 1548603684, 9), a = v(a = p(a, 10), h = v(h, u = v(u, l, f, a, h, t[11], 1548603684, 13), l, f = p(f, 10), a, t[3], 1548603684, 15), u, l = p(l, 10), f, t[7], 1548603684, 7), u = v(u = p(u, 10), l = v(l, f = v(f, a, h, u, l, t[0], 1548603684, 12), a, h = p(h, 10), u, t[13], 1548603684, 8), f, a = p(a, 10), h, t[5], 1548603684, 9), f = v(f = p(f, 10), a = v(a, h = v(h, u, l, f, a, t[10], 1548603684, 11), u, l = p(l, 10), f, t[14], 1548603684, 7), h, u = p(u, 10), l, t[15], 1548603684, 7), h = v(h = p(h, 10), u = v(u, l = v(l, f, a, h, u, t[8], 1548603684, 12), f, a = p(a, 10), h, t[12], 1548603684, 7), l, f = p(f, 10), a, t[4], 1548603684, 6), l = v(l = p(l, 10), f = v(f, a = v(a, h, u, l, f, t[9], 1548603684, 15), h, u = p(u, 10), l, t[1], 1548603684, 13), a, h = p(h, 10), u, t[2], 1548603684, 11), a = y(a = p(a, 10), h = y(h, u = y(u, l, f, a, h, t[15], 1836072691, 9), l, f = p(f, 10), a, t[5], 1836072691, 7), u, l = p(l, 10), f, t[1], 1836072691, 15), u = y(u = p(u, 10), l = y(l, f = y(f, a, h, u, l, t[3], 1836072691, 11), a, h = p(h, 10), u, t[7], 1836072691, 8), f, a = p(a, 10), h, t[14], 1836072691, 6), f = y(f = p(f, 10), a = y(a, h = y(h, u, l, f, a, t[6], 1836072691, 6), u, l = p(l, 10), f, t[9], 1836072691, 14), h, u = p(u, 10), l, t[11], 1836072691, 12), h = y(h = p(h, 10), u = y(u, l = y(l, f, a, h, u, t[8], 1836072691, 13), f, a = p(a, 10), h, t[12], 1836072691, 5), l, f = p(f, 10), a, t[2], 1836072691, 14), l = y(l = p(l, 10), f = y(f, a = y(a, h, u, l, f, t[10], 1836072691, 13), h, u = p(u, 10), l, t[0], 1836072691, 13), a, h = p(h, 10), u, t[4], 1836072691, 7), a = g(a = p(a, 10), h = g(h, u = y(u, l, f, a, h, t[13], 1836072691, 5), l, f = p(f, 10), a, t[8], 2053994217, 15), u, l = p(l, 10), f, t[6], 2053994217, 5), u = g(u = p(u, 10), l = g(l, f = g(f, a, h, u, l, t[4], 2053994217, 8), a, h = p(h, 10), u, t[1], 2053994217, 11), f, a = p(a, 10), h, t[3], 2053994217, 14), f = g(f = p(f, 10), a = g(a, h = g(h, u, l, f, a, t[11], 2053994217, 14), u, l = p(l, 10), f, t[15], 2053994217, 6), h, u = p(u, 10), l, t[0], 2053994217, 14), h = g(h = p(h, 10), u = g(u, l = g(l, f, a, h, u, t[5], 2053994217, 6), f, a = p(a, 10), h, t[12], 2053994217, 9), l, f = p(f, 10), a, t[2], 2053994217, 12), l = g(l = p(l, 10), f = g(f, a = g(a, h, u, l, f, t[13], 2053994217, 9), h, u = p(u, 10), l, t[9], 2053994217, 12), a, h = p(h, 10), u, t[7], 2053994217, 5), a = d(a = p(a, 10), h = g(h, u = g(u, l, f, a, h, t[10], 2053994217, 15), l, f = p(f, 10), a, t[14], 2053994217, 8), u, l = p(l, 10), f, t[12], 0, 8), u = d(u = p(u, 10), l = d(l, f = d(f, a, h, u, l, t[15], 0, 5), a, h = p(h, 10), u, t[10], 0, 12), f, a = p(a, 10), h, t[4], 0, 9), f = d(f = p(f, 10), a = d(a, h = d(h, u, l, f, a, t[1], 0, 12), u, l = p(l, 10), f, t[5], 0, 5), h, u = p(u, 10), l, t[8], 0, 14), h = d(h = p(h, 10), u = d(u, l = d(l, f, a, h, u, t[7], 0, 6), f, a = p(a, 10), h, t[6], 0, 8), l, f = p(f, 10), a, t[2], 0, 13), l = d(l = p(l, 10), f = d(f, a = d(a, h, u, l, f, t[13], 0, 6), h, u = p(u, 10), l, t[14], 0, 5), a, h = p(h, 10), u, t[0], 0, 15), a = d(a = p(a, 10), h = d(h, u = d(u, l, f, a, h, t[3], 0, 13), l, f = p(f, 10), a, t[9], 0, 11), u, l = p(l, 10), f, t[11], 0, 11), u = p(u, 10);
                    var c = this._b + n + u | 0;
                    this._b = this._c + o + l | 0, this._c = this._d + s + f | 0, this._d = this._e + r + a | 0, this._e = this._a + i + h | 0, this._a = c
                }, i.prototype._digest = function() {
                    this._block[this._blockOffset++] = 128, 56 < this._blockOffset && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
                    var t = new e(20);
                    return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t.writeInt32LE(this._e, 16), t
                }, o.exports = i
            }).call(this, n("buffer").Buffer)
        }, {
            buffer: 40,
            "hash-base": 56,
            inherits: 58
        }],
        81: [function(t, e, r) {
            var i = t("buffer"),
                n = i.Buffer;

            function o(t, e) {
                for (var r in t) e[r] = t[r]
            }
            function s(t, e, r) {
                return n(t, e, r)
            }
            n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? e.exports = i : (o(i, r), r.Buffer = s), o(n, s), s.from = function(t, e, r) {
                if ("number" == typeof t) throw new TypeError("Argument must not be a number");
                return n(t, e, r)
            }, s.alloc = function(t, e, r) {
                if ("number" != typeof t) throw new TypeError("Argument must be a number");
                var i = n(t);
                return void 0 !== e ? "string" == typeof r ? i.fill(e, r) : i.fill(e) : i.fill(0), i
            }, s.allocUnsafe = function(t) {
                if ("number" != typeof t) throw new TypeError("Argument must be a number");
                return n(t)
            }, s.allocUnsafeSlow = function(t) {
                if ("number" != typeof t) throw new TypeError("Argument must be a number");
                return i.SlowBuffer(t)
            }
        }, {
            buffer: 40
        }],
        82: [function(t, e, r) {
            (function(a) {
                function t(t, e) {
                    this._block = new a(t), this._finalSize = e, this._blockSize = t, this._len = 0, this._s = 0
                }
                t.prototype.update = function(t, e) {
                    "string" == typeof t && (t = new a(t, e = e || "utf8"));
                    for (var r = this._len += t.length, i = this._s || 0, n = 0, o = this._block; i < r;) {
                        for (var s = Math.min(t.length, n + this._blockSize - i % this._blockSize) - n, f = 0; f < s; f++) o[i % this._blockSize + f] = t[f + n];
                        n += s, (i += s) % this._blockSize == 0 && this._update(o)
                    }
                    return this._s = i, this
                }, t.prototype.digest = function(t) {
                    var e = 8 * this._len;
                    this._block[this._len % this._blockSize] = 128, this._block.fill(0, this._len % this._blockSize + 1), e % (8 * this._blockSize) >= 8 * this._finalSize && (this._update(this._block), this._block.fill(0)), this._block.writeInt32BE(e, this._blockSize - 4);
                    var r = this._update(this._block) || this._hash();
                    return t ? r.toString(t) : r
                }, t.prototype._update = function() {
                    throw new Error("_update must be implemented by subclass")
                }, e.exports = t
            }).call(this, t("buffer").Buffer)
        }, {
            buffer: 40
        }],
        83: [function(t, e, r) {
            (r = e.exports = function(t) {
                t = t.toLowerCase();
                var e = r[t];
                if (!e) throw new Error(t + " is not supported (we accept pull requests)");
                return new e
            }).sha = t("./sha"), r.sha1 = t("./sha1"), r.sha224 = t("./sha224"), r.sha256 = t("./sha256"), r.sha384 = t("./sha384"), r.sha512 = t("./sha512")
        }, {
            "./sha": 84,
            "./sha1": 85,
            "./sha224": 86,
            "./sha256": 87,
            "./sha384": 88,
            "./sha512": 89
        }],
        84: [function(o, s, t) {
            (function(e) {
                var t = o("inherits"),
                    r = o("./hash"),
                    v = [1518500249, 1859775393, - 1894007588, - 899497514],
                    i = new Array(80);

                function n() {
                    this.init(), this._w = i, r.call(this, 64, 56)
                }
                t(n, r), n.prototype.init = function() {
                    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this
                }, n.prototype._update = function(t) {
                    for (var e, r, i, n, o, s, f = this._w, a = 0 | this._a, h = 0 | this._b, u = 0 | this._c, l = 0 | this._d, c = 0 | this._e, p = 0; p < 16; ++p) f[p] = t.readInt32BE(4 * p);
                    for (; p < 80; ++p) f[p] = f[p - 3] ^ f[p - 8] ^ f[p - 14] ^ f[p - 16];
                    for (var d = 0; d < 80; ++d) {
                        var g = ~~ (d / 20),
                            y = 0 | ((s = a) << 5 | s >>> 27) + (i = h, n = u, o = l, 0 === (r = g) ? i & n | ~i & o : 2 === r ? i & n | i & o | n & o : i ^ n ^ o) + c + f[d] + v[g];
                        c = l, l = u, u = (e = h) << 30 | e >>> 2, h = a, a = y
                    }
                    this._a = a + this._a | 0, this._b = h + this._b | 0, this._c = u + this._c | 0, this._d = l + this._d | 0, this._e = c + this._e | 0
                }, n.prototype._hash = function() {
                    var t = new e(20);
                    return t.writeInt32BE(0 | this._a, 0), t.writeInt32BE(0 | this._b, 4), t.writeInt32BE(0 | this._c, 8), t.writeInt32BE(0 | this._d, 12), t.writeInt32BE(0 | this._e, 16), t
                }, s.exports = n
            }).call(this, o("buffer").Buffer)
        }, {
            "./hash": 82,
            buffer: 40,
            inherits: 58
        }],
        85: [function(o, s, t) {
            (function(e) {
                var t = o("inherits"),
                    r = o("./hash"),
                    b = [1518500249, 1859775393, - 1894007588, - 899497514],
                    i = new Array(80);

                function n() {
                    this.init(), this._w = i, r.call(this, 64, 56)
                }
                t(n, r), n.prototype.init = function() {
                    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this
                }, n.prototype._update = function(t) {
                    for (var e, r, i, n, o, s, f, a = this._w, h = 0 | this._a, u = 0 | this._b, l = 0 | this._c, c = 0 | this._d, p = 0 | this._e, d = 0; d < 16; ++d) a[d] = t.readInt32BE(4 * d);
                    for (; d < 80; ++d) a[d] = (e = a[d - 3] ^ a[d - 8] ^ a[d - 14] ^ a[d - 16]) << 1 | e >>> 31;
                    for (var g = 0; g < 80; ++g) {
                        var y = ~~ (g / 20),
                            v = 0 | ((f = h) << 5 | f >>> 27) + (n = u, o = l, s = c, 0 === (i = y) ? n & o | ~n & s : 2 === i ? n & o | n & s | o & s : n ^ o ^ s) + p + a[g] + b[y];
                        p = c, c = l, l = (r = u) << 30 | r >>> 2, u = h, h = v
                    }
                    this._a = h + this._a | 0, this._b = u + this._b | 0, this._c = l + this._c | 0, this._d = c + this._d | 0, this._e = p + this._e | 0
                }, n.prototype._hash = function() {
                    var t = new e(20);
                    return t.writeInt32BE(0 | this._a, 0), t.writeInt32BE(0 | this._b, 4), t.writeInt32BE(0 | this._c, 8), t.writeInt32BE(0 | this._d, 12), t.writeInt32BE(0 | this._e, 16), t
                }, s.exports = n
            }).call(this, o("buffer").Buffer)
        }, {
            "./hash": 82,
            buffer: 40,
            inherits: 58
        }],
        86: [function(s, f, t) {
            (function(e) {
                var t = s("inherits"),
                    r = s("./sha256"),
                    i = s("./hash"),
                    n = new Array(64);

                function o() {
                    this.init(), this._w = n, i.call(this, 64, 56)
                }
                t(o, r), o.prototype.init = function() {
                    return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this
                }, o.prototype._hash = function() {
                    var t = new e(28);
                    return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t
                }, f.exports = o
            }).call(this, s("buffer").Buffer)
        }, {
            "./hash": 82,
            "./sha256": 87,
            buffer: 40,
            inherits: 58
        }],
        87: [function(o, s, t) {
            (function(e) {
                var t = o("inherits"),
                    r = o("./hash"),
                    _ = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
                    i = new Array(64);

                function n() {
                    this.init(), this._w = i, r.call(this, 64, 56)
                }
                t(n, r), n.prototype.init = function() {
                    return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this
                }, n.prototype._update = function(t) {
                    for (var e, r, i, n, o, s, f, a = this._w, h = 0 | this._a, u = 0 | this._b, l = 0 | this._c, c = 0 | this._d, p = 0 | this._e, d = 0 | this._f, g = 0 | this._g, y = 0 | this._h, v = 0; v < 16; ++v) a[v] = t.readInt32BE(4 * v);
                    for (; v < 64; ++v) a[v] = 0 | (((r = a[v - 2]) >>> 17 | r << 15) ^ (r >>> 19 | r << 13) ^ r >>> 10) + a[v - 7] + (((e = a[v - 15]) >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3) + a[v - 16];
                    for (var b = 0; b < 64; ++b) {
                        var w = y + (((f = p) >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7)) + ((s = g) ^ p & (d ^ s)) + _[b] + a[b] | 0,
                            m = 0 | (((o = h) >>> 2 | o << 30) ^ (o >>> 13 | o << 19) ^ (o >>> 22 | o << 10)) + ((i = h) & (n = u) | l & (i | n));
                        y = g, g = d, d = p, p = c + w | 0, c = l, l = u, u = h, h = w + m | 0
                    }
                    this._a = h + this._a | 0, this._b = u + this._b | 0, this._c = l + this._c | 0, this._d = c + this._d | 0, this._e = p + this._e | 0, this._f = d + this._f | 0, this._g = g + this._g | 0, this._h = y + this._h | 0
                }, n.prototype._hash = function() {
                    var t = new e(32);
                    return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t.writeInt32BE(this._h, 28), t
                }, s.exports = n
            }).call(this, o("buffer").Buffer)
        }, {
            "./hash": 82,
            buffer: 40,
            inherits: 58
        }],
        88: [function(s, f, t) {
            (function(e) {
                var t = s("inherits"),
                    r = s("./sha512"),
                    i = s("./hash"),
                    n = new Array(160);

                function o() {
                    this.init(), this._w = n, i.call(this, 128, 112)
                }
                t(o, r), o.prototype.init = function() {
                    return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this
                }, o.prototype._hash = function() {
                    var i = new e(48);

                    function t(t, e, r) {
                        i.writeInt32BE(t, r), i.writeInt32BE(e, r + 4)
                    }
                    return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), i
                }, f.exports = o
            }).call(this, s("buffer").Buffer)
        }, {
            "./hash": 82,
            "./sha512": 89,
            buffer: 40,
            inherits: 58
        }],
        89: [function(o, s, t) {
            (function(e) {
                var t = o("inherits"),
                    r = o("./hash"),
                    tt = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591],
                    i = new Array(160);

                function n() {
                    this.init(), this._w = i, r.call(this, 128, 112)
                }
                function et(t, e, r) {
                    return r ^ t & (e ^ r)
                }
                function rt(t, e, r) {
                    return t & e | r & (t | e)
                }
                function it(t, e) {
                    return (t >>> 28 | e << 4) ^ (e >>> 2 | t << 30) ^ (e >>> 7 | t << 25)
                }
                function nt(t, e) {
                    return (t >>> 14 | e << 18) ^ (t >>> 18 | e << 14) ^ (e >>> 9 | t << 23)
                }
                function ot(t, e) {
                    return t >>> 0 < e >>> 0 ? 1 : 0
                }
                t(n, r), n.prototype.init = function() {
                    return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this
                }, n.prototype._update = function(t) {
                    for (var e, r, i, n, o, s, f, a, h = this._w, u = 0 | this._ah, l = 0 | this._bh, c = 0 | this._ch, p = 0 | this._dh, d = 0 | this._eh, g = 0 | this._fh, y = 0 | this._gh, v = 0 | this._hh, b = 0 | this._al, w = 0 | this._bl, m = 0 | this._cl, _ = 0 | this._dl, E = 0 | this._el, S = 0 | this._fl, B = 0 | this._gl, T = 0 | this._hl, I = 0; I < 32; I += 2) h[I] = t.readInt32BE(4 * I), h[I + 1] = t.readInt32BE(4 * I + 4);
                    for (; I < 160; I += 2) {
                        var k = h[I - 30],
                            A = h[I - 30 + 1],
                            x = ((f = k) >>> 1 | (a = A) << 31) ^ (f >>> 8 | a << 24) ^ f >>> 7,
                            L = ((o = A) >>> 1 | (s = k) << 31) ^ (o >>> 8 | s << 24) ^ (o >>> 7 | s << 25);
                        k = h[I - 4], A = h[I - 4 + 1];
                        var U = ((i = k) >>> 19 | (n = A) << 13) ^ (n >>> 29 | i << 3) ^ i >>> 6,
                            R = ((e = A) >>> 19 | (r = k) << 13) ^ (r >>> 29 | e << 3) ^ (e >>> 6 | r << 26),
                            O = h[I - 14],
                            C = h[I - 14 + 1],
                            D = h[I - 32],
                            M = h[I - 32 + 1],
                            N = L + C | 0,
                            j = x + O + ot(N, L) | 0;
                        j = (j = j + U + ot(N = N + R | 0, R) | 0) + D + ot(N = N + M | 0, M) | 0, h[I] = j, h[I + 1] = N
                    }
                    for (var q = 0; q < 160; q += 2) {
                        j = h[q], N = h[q + 1];
                        var F = rt(u, l, c),
                            z = rt(b, w, m),
                            P = it(u, b),
                            V = it(b, u),
                            H = nt(d, E),
                            Z = nt(E, d),
                            X = tt[q],
                            G = tt[q + 1],
                            K = et(d, g, y),
                            W = et(E, S, B),
                            Y = T + Z | 0,
                            J = v + H + ot(Y, T) | 0;
                        J = (J = (J = J + K + ot(Y = Y + W | 0, W) | 0) + X + ot(Y = Y + G | 0, G) | 0) + j + ot(Y = Y + N | 0, N) | 0;
                        var Q = V + z | 0,
                            $ = P + F + ot(Q, V) | 0;
                        v = y, T = B, y = g, B = S, g = d, S = E, d = p + J + ot(E = _ + Y | 0, _) | 0, p = c, _ = m, c = l, m = w, l = u, w = b, u = J + $ + ot(b = Y + Q | 0, Y) | 0
                    }
                    this._al = this._al + b | 0, this._bl = this._bl + w | 0, this._cl = this._cl + m | 0, this._dl = this._dl + _ | 0, this._el = this._el + E | 0, this._fl = this._fl + S | 0, this._gl = this._gl + B | 0, this._hl = this._hl + T | 0, this._ah = this._ah + u + ot(this._al, b) | 0, this._bh = this._bh + l + ot(this._bl, w) | 0, this._ch = this._ch + c + ot(this._cl, m) | 0, this._dh = this._dh + p + ot(this._dl, _) | 0, this._eh = this._eh + d + ot(this._el, E) | 0, this._fh = this._fh + g + ot(this._fl, S) | 0, this._gh = this._gh + y + ot(this._gl, B) | 0, this._hh = this._hh + v + ot(this._hl, T) | 0
                }, n.prototype._hash = function() {
                    var i = new e(64);

                    function t(t, e, r) {
                        i.writeInt32BE(t, r), i.writeInt32BE(e, r + 4)
                    }
                    return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), t(this._gh, this._gl, 48), t(this._hh, this._hl, 56), i
                }, s.exports = n
            }).call(this, o("buffer").Buffer)
        }, {
            "./hash": 82,
            buffer: 40,
            inherits: 58
        }],
        90: [function(t, e, r) {
            e.exports = i;
            var u = t("events").EventEmitter;

            function i() {
                u.call(this)
            }
            t("inherits")(i, u), i.Readable = t("readable-stream/readable.js"), i.Writable = t("readable-stream/writable.js"), i.Duplex = t("readable-stream/duplex.js"), i.Transform = t("readable-stream/transform.js"), i.PassThrough = t("readable-stream/passthrough.js"), (i.Stream = i).prototype.pipe = function(e, t) {
                var r = this;

                function i(t) {
                    e.writable && !1 === e.write(t) && r.pause && r.pause()
                }
                function n() {
                    r.readable && r.resume && r.resume()
                }
                r.on("data", i), e.on("drain", n), e._isStdio || t && !1 === t.end || (r.on("end", s), r.on("close", f));
                var o = !1;

                function s() {
                    o || (o = !0, e.end())
                }
                function f() {
                    o || (o = !0, "function" == typeof e.destroy && e.destroy())
                }
                function a(t) {
                    if (h(), 0 === u.listenerCount(this, "error")) throw t
                }
                function h() {
                    r.removeListener("data", i), e.removeListener("drain", n), r.removeListener("end", s), r.removeListener("close", f), r.removeListener("error", a), e.removeListener("error", a), r.removeListener("end", h), r.removeListener("close", h), e.removeListener("close", h)
                }
                return r.on("error", a), e.on("error", a), r.on("end", h), r.on("close", h), e.on("close", h), e.emit("pipe", r), e
            }
        }, {
            events: 54,
            inherits: 58,
            "readable-stream/duplex.js": 67,
            "readable-stream/passthrough.js": 76,
            "readable-stream/readable.js": 77,
            "readable-stream/transform.js": 78,
            "readable-stream/writable.js": 79
        }],
        91: [function(t, e, r) {
            "use strict";
            var i = t("safe-buffer").Buffer,
                n = i.isEncoding || function(t) {
                    switch ((t = "" + t) && t.toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                        case "raw":
                            return !0;
                        default:
                            return !1
                    }
                };

            function o(t) {
                var e;
                switch (this.encoding = function(t) {
                    var e = function(t) {
                        if (!t) return "utf8";
                        for (var e;;) switch (t) {
                            case "utf8":
                            case "utf-8":
                                return "utf8";
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return "utf16le";
                            case "latin1":
                            case "binary":
                                return "latin1";
                            case "base64":
                            case "ascii":
                            case "hex":
                                return t;
                            default:
                                if (e) return;
                                t = ("" + t).toLowerCase(), e = !0
                        }
                    }(t);
                    if ("string" != typeof e && (i.isEncoding === n || !n(t))) throw new Error("Unknown encoding: " + t);
                    return e || t
                }(t), this.encoding) {
                    case "utf16le":
                        this.text = a, this.end = h, e = 4;
                        break;
                    case "utf8":
                        this.fillLast = f, e = 4;
                        break;
                    case "base64":
                        this.text = u, this.end = l, e = 3;
                        break;
                    default:
                        return this.write = c, void(this.end = p)
                }
                this.lastNeed = 0, this.lastTotal = 0, this.lastChar = i.allocUnsafe(e)
            }
            function s(t) {
                return t <= 127 ? 0 : t >> 5 == 6 ? 2 : t >> 4 == 14 ? 3 : t >> 3 == 30 ? 4 : -1
            }
            function f(t) {
                var e = this.lastTotal - this.lastNeed,
                    r = function(t, e, r) {
                        if (128 != (192 & e[0])) return t.lastNeed = 0, "�".repeat(r);
                        if (1 < t.lastNeed && 1 < e.length) {
                            if (128 != (192 & e[1])) return t.lastNeed = 1, "�".repeat(r + 1);
                            if (2 < t.lastNeed && 2 < e.length && 128 != (192 & e[2])) return t.lastNeed = 2, "�".repeat(r + 2)
                        }
                    }(this, t, e);
                return void 0 !== r ? r : this.lastNeed <= t.length ? (t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (t.copy(this.lastChar, e, 0, t.length), void(this.lastNeed -= t.length))
            }
            function a(t, e) {
                if ((t.length - e) % 2 == 0) {
                    var r = t.toString("utf16le", e);
                    if (r) {
                        var i = r.charCodeAt(r.length - 1);
                        if (55296 <= i && i <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1], r.slice(0, - 1)
                    }
                    return r
                }
                return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t[t.length - 1], t.toString("utf16le", e, t.length - 1)
            }
            function h(t) {
                var e = t && t.length ? this.write(t) : "";
                if (this.lastNeed) {
                    var r = this.lastTotal - this.lastNeed;
                    return e + this.lastChar.toString("utf16le", 0, r)
                }
                return e
            }
            function u(t, e) {
                var r = (t.length - e) % 3;
                return 0 === r ? t.toString("base64", e) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - r))
            }
            function l(t) {
                var e = t && t.length ? this.write(t) : "";
                return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e
            }
            function c(t) {
                return t.toString(this.encoding)
            }
            function p(t) {
                return t && t.length ? this.write(t) : ""
            }(r.StringDecoder = o).prototype.write = function(t) {
                if (0 === t.length) return "";
                var e, r;
                if (this.lastNeed) {
                    if (void 0 === (e = this.fillLast(t))) return "";
                    r = this.lastNeed, this.lastNeed = 0
                } else r = 0;
                return r < t.length ? e ? e + this.text(t, r) : this.text(t, r) : e || ""
            }, o.prototype.end = function(t) {
                var e = t && t.length ? this.write(t) : "";
                return this.lastNeed ? e + "�".repeat(this.lastTotal - this.lastNeed) : e
            }, o.prototype.text = function(t, e) {
                var r = function(t, e, r) {
                    var i = e.length - 1;
                    if (i < r) return 0;
                    var n = s(e[i]);
                    if (0 <= n) return 0 < n && (t.lastNeed = n - 1), n;
                    if (--i < r) return 0;
                    if (0 <= (n = s(e[i]))) return 0 < n && (t.lastNeed = n - 2), n;
                    if (--i < r) return 0;
                    if (0 <= (n = s(e[i]))) return 0 < n && (2 === n ? n = 0 : t.lastNeed = n - 3), n;
                    return 0
                }(this, t, e);
                if (!this.lastNeed) return t.toString("utf8", e);
                this.lastTotal = r;
                var i = t.length - (r - this.lastNeed);
                return t.copy(this.lastChar, 0, i), t.toString("utf8", e, i)
            }, o.prototype.fillLast = function(t) {
                if (this.lastNeed <= t.length) return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
                t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length
            }
        }, {
            "safe-buffer": 81
        }],
        92: [function(t, e, r) {
            (function(r) {
                function i(t) {
                    try {
                        if (!r.localStorage) return !1
                    } catch (t) {
                        return !1
                    }
                    var e = r.localStorage[t];
                    return null != e && "true" === String(e).toLowerCase()
                }
                e.exports = function(t, e) {
                    if (i("noDeprecation")) return t;
                    var r = !1;
                    return function() {
                        if (!r) {
                            if (i("throwDeprecation")) throw new Error(e);
                            i("traceDeprecation") ? console.trace(e) : console.warn(e), r = !0
                        }
                        return t.apply(this, arguments)
                    }
                }
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        93: [function(t, e, r) {
            arguments[4][58][0].apply(r, arguments)
        }, {
            dup: 58
        }],
        94: [function(t, e, r) {
            e.exports = function(t) {
                return t && "object" == typeof t && "function" == typeof t.copy && "function" == typeof t.fill && "function" == typeof t.readUInt8
            }
        }, {}],
        95: [function(c, t, k) {
            (function(i, n) {
                var f = /%[sdj%]/g;
                k.format = function(t) {
                    if (!m(t)) {
                        for (var e = [], r = 0; r < arguments.length; r++) e.push(a(arguments[r]));
                        return e.join(" ")
                    }
                    r = 1;
                    for (var i = arguments, n = i.length, o = String(t).replace(f, function(t) {
                        if ("%%" === t) return "%";
                        if (n <= r) return t;
                        switch (t) {
                            case "%s":
                                return String(i[r++]);
                            case "%d":
                                return Number(i[r++]);
                            case "%j":
                                try {
                                    return JSON.stringify(i[r++])
                                } catch (t) {
                                    return "[Circular]"
                                }
                            default:
                                return t
                        }
                    }), s = i[r]; r < n; s = i[++r]) b(s) || !u(s) ? o += " " + s : o += " " + a(s);
                    return o
                }, k.deprecate = function(t, e) {
                    if (_(n.process)) return function() {
                        return k.deprecate(t, e).apply(this, arguments)
                    };
                    if (!0 === i.noDeprecation) return t;
                    var r = !1;
                    return function() {
                        if (!r) {
                            if (i.throwDeprecation) throw new Error(e);
                            i.traceDeprecation ? console.trace(e) : console.error(e), r = !0
                        }
                        return t.apply(this, arguments)
                    }
                };
                var t, o = {};

                function a(t, e) {
                    var r = {
                        seen: [],
                        stylize: h
                    };
                    return 3 <= arguments.length && (r.depth = arguments[2]), 4 <= arguments.length && (r.colors = arguments[3]), v(e) ? r.showHidden = e : e && k._extend(r, e), _(r.showHidden) && (r.showHidden = !1), _(r.depth) && (r.depth = 2), _(r.colors) && (r.colors = !1), _(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = s), p(r, t, r.depth)
                }
                function s(t, e) {
                    var r = a.styles[e];
                    return r ? "[" + a.colors[r][0] + "m" + t + "[" + a.colors[r][1] + "m" : t
                }
                function h(t, e) {
                    return t
                }
                function p(e, r, i) {
                    if (e.customInspect && r && T(r.inspect) && r.inspect !== k.inspect && (!r.constructor || r.constructor.prototype !== r)) {
                        var t = r.inspect(i, e);
                        return m(t) || (t = p(e, t, i)), t
                    }
                    var n = function(t, e) {
                        if (_(e)) return t.stylize("undefined", "undefined");
                        if (m(e)) {
                            var r = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                            return t.stylize(r, "string")
                        }
                        if (w(e)) return t.stylize("" + e, "number");
                        if (v(e)) return t.stylize("" + e, "boolean");
                        if (b(e)) return t.stylize("null", "null")
                    }(e, r);
                    if (n) return n;
                    var o, s = Object.keys(r),
                        f = (o = {}, s.forEach(function(t, e) {
                            o[t] = !0
                        }), o);
                    if (e.showHidden && (s = Object.getOwnPropertyNames(r)), B(r) && (0 <= s.indexOf("message") || 0 <= s.indexOf("description"))) return d(r);
                    if (0 === s.length) {
                        if (T(r)) {
                            var a = r.name ? ": " + r.name : "";
                            return e.stylize("[Function" + a + "]", "special")
                        }
                        if (E(r)) return e.stylize(RegExp.prototype.toString.call(r), "regexp");
                        if (S(r)) return e.stylize(Date.prototype.toString.call(r), "date");
                        if (B(r)) return d(r)
                    }
                    var h, u = "",
                        l = !1,
                        c = ["{", "}"];
                    (y(r) && (l = !0, c = ["[", "]"]), T(r)) && (u = " [Function" + (r.name ? ": " + r.name : "") + "]");
                    return E(r) && (u = " " + RegExp.prototype.toString.call(r)), S(r) && (u = " " + Date.prototype.toUTCString.call(r)), B(r) && (u = " " + d(r)), 0 !== s.length || l && 0 != r.length ? i < 0 ? E(r) ? e.stylize(RegExp.prototype.toString.call(r), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(r), h = l ? function(e, r, i, n, t) {
                        for (var o = [], s = 0, f = r.length; s < f; ++s) I(r, String(s)) ? o.push(g(e, r, i, n, String(s), !0)) : o.push("");
                        return t.forEach(function(t) {
                            t.match(/^\d+$/) || o.push(g(e, r, i, n, t, !0))
                        }), o
                    }(e, r, i, f, s) : s.map(function(t) {
                        return g(e, r, i, f, t, l)
                    }), e.seen.pop(), function(t, e, r) {
                        if (60 < t.reduce(function(t, e) {
                            return 0, 0 <= e.indexOf("\n") && 0, t + e.replace(/\u001b\[\d\d?m/g, "").length + 1
                        }, 0)) return r[0] + ("" === e ? "" : e + "\n ") + " " + t.join(",\n  ") + " " + r[1];
                        return r[0] + e + " " + t.join(", ") + " " + r[1]
                    }(h, u, c)) : c[0] + u + c[1]
                }
                function d(t) {
                    return "[" + Error.prototype.toString.call(t) + "]"
                }
                function g(t, e, r, i, n, o) {
                    var s, f, a;
                    if ((a = Object.getOwnPropertyDescriptor(e, n) || {
                        value: e[n]
                    }).get ? f = a.set ? t.stylize("[Getter/Setter]", "special") : t.stylize("[Getter]", "special") : a.set && (f = t.stylize("[Setter]", "special")), I(i, n) || (s = "[" + n + "]"), f || (t.seen.indexOf(a.value) < 0 ? -1 < (f = b(r) ? p(t, a.value, null) : p(t, a.value, r - 1)).indexOf("\n") && (f = o ? f.split("\n").map(function(t) {
                        return "  " + t
                    }).join("\n").substr(2) : "\n" + f.split("\n").map(function(t) {
                        return "   " + t
                    }).join("\n")) : f = t.stylize("[Circular]", "special")), _(s)) {
                        if (o && n.match(/^\d+$/)) return f;
                        (s = JSON.stringify("" + n)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = t.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = t.stylize(s, "string"))
                    }
                    return s + ": " + f
                }
                function y(t) {
                    return Array.isArray(t)
                }
                function v(t) {
                    return "boolean" == typeof t
                }
                function b(t) {
                    return null === t
                }
                function w(t) {
                    return "number" == typeof t
                }
                function m(t) {
                    return "string" == typeof t
                }
                function _(t) {
                    return void 0 === t
                }
                function E(t) {
                    return u(t) && "[object RegExp]" === e(t)
                }
                function u(t) {
                    return "object" == typeof t && null !== t
                }
                function S(t) {
                    return u(t) && "[object Date]" === e(t)
                }
                function B(t) {
                    return u(t) && ("[object Error]" === e(t) || t instanceof Error)
                }
                function T(t) {
                    return "function" == typeof t
                }
                function e(t) {
                    return Object.prototype.toString.call(t)
                }
                function r(t) {
                    return t < 10 ? "0" + t.toString(10) : t.toString(10)
                }
                k.debuglog = function(e) {
                    if (_(t) && (t = i.env.NODE_DEBUG || ""), e = e.toUpperCase(), !o[e]) if (new RegExp("\\b" + e + "\\b", "i").test(t)) {
                        var r = i.pid;
                        o[e] = function() {
                            var t = k.format.apply(k, arguments);
                            console.error("%s %d: %s", e, r, t)
                        }
                    } else o[e] = function() {};
                    return o[e]
                }, (k.inspect = a).colors = {
                    bold: [1, 22],
                    italic: [3, 23],
                    underline: [4, 24],
                    inverse: [7, 27],
                    white: [37, 39],
                    grey: [90, 39],
                    black: [30, 39],
                    blue: [34, 39],
                    cyan: [36, 39],
                    green: [32, 39],
                    magenta: [35, 39],
                    red: [31, 39],
                    yellow: [33, 39]
                }, a.styles = {
                    special: "cyan",
                    number: "yellow",
                    boolean: "yellow",
                    undefined: "grey",
                    null: "bold",
                    string: "green",
                    date: "magenta",
                    regexp: "red"
                }, k.isArray = y, k.isBoolean = v, k.isNull = b, k.isNullOrUndefined = function(t) {
                    return null == t
                }, k.isNumber = w, k.isString = m, k.isSymbol = function(t) {
                    return "symbol" == typeof t
                }, k.isUndefined = _, k.isRegExp = E, k.isObject = u, k.isDate = S, k.isError = B, k.isFunction = T, k.isPrimitive = function(t) {
                    return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == typeof t || void 0 === t
                }, k.isBuffer = c("./support/isBuffer");
                var l = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                function I(t, e) {
                    return Object.prototype.hasOwnProperty.call(t, e)
                }
                k.log = function() {
                    var t, e;
                    console.log("%s - %s", (t = new Date, e = [r(t.getHours()), r(t.getMinutes()), r(t.getSeconds())].join(":"), [t.getDate(), l[t.getMonth()], e].join(" ")), k.format.apply(k, arguments))
                }, k.inherits = c("inherits"), k._extend = function(t, e) {
                    if (!e || !u(e)) return t;
                    for (var r = Object.keys(e), i = r.length; i--;) t[r[i]] = e[r[i]];
                    return t
                }
            }).call(this, c("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./support/isBuffer": 94,
            _process: 65,
            inherits: 93
        }]
    }, {}, [8])(8)
});
