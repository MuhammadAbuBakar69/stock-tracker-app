import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple endpoint that serves the project's README.md as a downloadable file.
// Search engines and crawlers that visit /api/download will get a Content-Disposition
// hint that this is a downloadable artifact. This can help search engines consider
// adding a direct-download action in listings; however, Google ultimately decides.

export async function GET() {
  try {
    const root = process.cwd();
    const readmePath = path.join(root, 'README.md');
    if (!fs.existsSync(readmePath)) {
      return NextResponse.json({ error: 'README not found' }, { status: 404 });
    }

    const data = await fs.promises.readFile(readmePath, { encoding: 'utf8' });
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'attachment; filename="signalist-readme.md"'
      }
    });
  } catch (err) {
    console.error('download endpoint error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
