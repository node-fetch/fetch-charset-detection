import test from "ava"
import { Headers } from "node-fetch"
import { encode } from "iconv-lite"
import _ from "lodash"
import convertBody from "./src"

test("should support encoding decode, xml dtd detect", (t) => {
    const text = "<?xml version=\"1.0\" encoding=\"EUC-JP\"?><title>日本語</title>"
    t.is(convertBody(encode(text, "EUC-JP"), new Headers({ "Content-Type": "text/xml" })), text)
})

test("should support encoding decode, content-type detect", (t) => {
    const text = "<div>日本語</div>"
    t.is(convertBody(encode(text, "Shift_JIS"), new Headers({ "Content-Type": "text/html; charset=Shift-JIS" })), text)
})

test("should support encoding decode, html5 detect", (t) => {
    const text = "<meta charset=\"gbk\"><div>中文</div>"
    t.is(convertBody(encode(text, "gbk"), new Headers({ "Content-Type": "text/html" })), text)
})

test("should support encoding decode, html4 detect", (t) => {
    const text = "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=gb2312\"><div>中文</div>"
    t.is(convertBody(encode(text, "gb2312"), new Headers({ "Content-Type": "text/html" })), text)
})

test("should default to utf8 encoding", (t) => {
    const text = "中文"
    t.is(convertBody(text), text)
})

test("should support uncommon content-type order, end with qs", (t) => {
    const text = "中文"
    t.is(convertBody(encode(text, "gbk"), new Headers({ "Content-Type": "text/plain; charset=gbk; qs=1" })), text)
})

test("should support chunked encoding, html4 detect", (t) => {
    const text = "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=Shift_JIS\" /><div>日本語</div>"
    const padding = _.repeat("a", 10)
    t.is(convertBody(encode(padding + text, "Shift_JIS"), new Headers({ "Content-Type": "text/html", "Transfer-Encoding": "chunked" })), padding + text)
})

test("should only do encoding detection up to 1024 bytes", (t) => {
    const text = "中文"
    const padding = "a".repeat(1200)
    t.not(convertBody(encode(padding + text, "gbk"), new Headers({ "Content-Type": "text/html", "Transfer-Encoding": "chunked" })), text)
})
