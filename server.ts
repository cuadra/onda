Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    // Serve processor.js explicitly (prevents SPA fallback from hijacking it)
    if (path === "/processor.js") {
      return new Response(Bun.file("./public/processor.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    if (path === "/recess.mp3") {
      return new Response(Bun.file("./src/recess.mp3"), {
        headers: { "Content-Type": "audio/mpeg" },
      });
    }
    if (path === "/src/index.js") {
      return new Response(Bun.file("./src/index.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }
    if (path === "/src/AudioInfo.js") {
      return new Response(Bun.file("./src/AudioInfo.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }
    if (path === "/src/Views.js") {
      return new Response(Bun.file("./src/Views.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }
    if (path === "/src/Animation.js") {
      return new Response(Bun.file("./src/Animation.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    if (path === "/") {
      return new Response(Bun.file("./src/index.html"), {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log("Server running on http://localhost:3000");
