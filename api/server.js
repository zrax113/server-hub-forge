import handler from "../dist/server/index.js";

function nodeStreamToWeb(req) {
  return new ReadableStream({
    start(controller) {
      req.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk)));
      req.on("end", () => controller.close());
      req.on("error", (error) => controller.error(error));
    },
    cancel() {
      req.destroy();
    },
  });
}

export default async function vercelHandler(req, res) {
  const protocol = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";
  const url = new URL(req.url ?? "/", `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value != null) {
      headers.set(key, value);
    }
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body: hasBody ? nodeStreamToWeb(req) : undefined,
    duplex: hasBody ? "half" : undefined,
  });

  const response = await handler.fetch(request, process.env, {
    waitUntil() {},
    passThroughOnException() {},
  });

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
  }

  res.end();
}