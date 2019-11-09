import test, { before, after } from "ava"
import resumer from "resumer"
import FormData from "form-data"
import * as stream from "stream"
import { extractContentType, getTotalBytes } from "./src"
import express from "express"
import getPort from "get-port" // eslint-disable-line import/default
import { Request } from "node-fetch"
import Blob from "fetch-blob"
const app = express()

before(async (t) => {
    t.context.port = await getPort()
    t.context.server = app.listen(t.context.port)
    t.context.baseURL = `http://localhost:${t.context.port}/`
})

after.always((t) => t.context.server.close())

test("should calculate content length and extract content type for each body type", (t) => {
    const url = `${t.context.baseURL}hello`
    const bodyContent = "a=1"

    let streamBody = resumer().queue(bodyContent).end()
    streamBody = streamBody.pipe(new stream.PassThrough())
    const streamRequest = new Request(url, {
        method: "POST",
        body: streamBody,
        size: 1024,
    })

    const blobBody = new Blob([bodyContent], { type: "text/plain" })
    const blobRequest = new Request(url, {
        method: "POST",
        body: blobBody,
        size: 1024,
    })

    const formBody = new FormData()
    formBody.append("a", "1")
    const formRequest = new Request(url, {
        method: "POST",
        body: formBody,
        size: 1024,
    })

    const bufferBody = Buffer.from(bodyContent)
    const bufferRequest = new Request(url, {
        method: "POST",
        body: bufferBody,
        size: 1024,
    })

    const stringRequest = new Request(url, {
        method: "POST",
        body: bodyContent,
        size: 1024,
    })

    const nullRequest = new Request(url, {
        method: "GET",
        body: null,
        size: 1024,
    })

    t.is(getTotalBytes(streamRequest), null)
    t.is(getTotalBytes(blobRequest), blobBody.size)
    t.not(getTotalBytes(formRequest), null)
    t.is(getTotalBytes(bufferRequest), bufferBody.length)
    t.is(getTotalBytes(stringRequest), bodyContent.length)
    t.is(getTotalBytes(nullRequest), 0)

    t.is(extractContentType(streamBody), null)
    t.is(extractContentType(blobBody), "text/plain")
    t.true(extractContentType(formBody).startsWith("multipart/form-data"))
    t.is(extractContentType(bufferBody), null)
    t.is(extractContentType(bodyContent), "text/plain;charset=UTF-8")
    t.is(extractContentType(null), null)
})
