// src/routes/api/cart/[table]/stream/+server.ts
import type { RequestHandler } from '@sveltejs/kit'
import {carts} from '$lib/services/cart-service'


export const GET: RequestHandler = ({ request, params }) => {
    const table = params.table!
    const enc = new TextEncoder()

    const stream = new ReadableStream({
        start(controller) {
            let closed = false
            const send = (data: string, event = 'update') => {
                if (closed) return
                try {
                    controller.enqueue(enc.encode(`event: ${event}\ndata: ${data}\n\n`))
                } catch {
                    // enqueue can still throw if already closed, shut down gracefully
                    close()
                }
            }

            // 1) send initial snapshot
            send(JSON.stringify(carts.getState(table)))

            // 2) subscribe, but guard the writer so errors never escape
            const unsubscribe = carts.subscribe(table, json => {
                try {
                    send(json, 'update')
                } catch {
                    // belt and suspenders, but we already guard in send()
                }
            })

            // 3) heartbeat to keep proxies happy
            const ping = setInterval(() => send('{}', 'ping'), 15000)

            // 4) single close path that also unregisters the subscriber
            const close = () => {
                if (closed) return
                closed = true
                clearInterval(ping)
                try { unsubscribe() } catch {}
                try { controller.close() } catch {}
            }

            // client disconnects
            request.signal.addEventListener('abort', close)
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        }
    })
}