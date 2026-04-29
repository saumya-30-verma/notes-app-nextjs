export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ summary: "kuch likho pehle" });
    }

    const firstLine = text.split(".")[0];

    return Response.json({
      summary: firstLine + "...",
    });

  } catch (error) {
    return Response.json({
      summary: "error aa gaya",
    });
  }
}