import fs from "node:fs";
import path from "node:path";
import { type CollectionEntry, getCollection } from "astro:content";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";

const collectionEntries = await getCollection("posts");
const pages = Object.fromEntries(
	collectionEntries.map(({ slug, data }) => [
		slug,
		{
			title: data.title,
			description: data.description,
		},
	]),
);

console.log("Registered pages for OG image generation (Satori direct):");
console.log(JSON.stringify(pages, null, 2));

// フォントデータの読み込み
const currentWorkingDir = process.cwd();
console.log(`Current working directory for font loading: ${currentWorkingDir}`);

const fontPathRegular = path.join(
	currentWorkingDir,
	"src",
	"fonts",
	"NotoSansJP-Regular.ttf",
);
const fontPathBold = path.join(
	currentWorkingDir,
	"src",
	"fonts",
	"NotoSansJP-Bold.ttf",
);

console.log(`Attempting to load regular font from: ${fontPathRegular}`);
console.log(`Attempting to load bold font from: ${fontPathBold}`);

let fontRegularData: Buffer | null = null;
let fontBoldData: Buffer | null = null;

try {
	fontRegularData = fs.readFileSync(fontPathRegular);
	fontBoldData = fs.readFileSync(fontPathBold);
	console.log("Successfully loaded font files.");
} catch (error) {
	console.error("Error loading font files:", error);
	// フォントが読み込めない場合は、後続の処理でエラーが発生するため、ここでエラーを投げるか、
	// あるいはフォントなしで実行を試みる（その場合はsatori呼び出しでフォントデータがnullでないことを確認する必要がある）
	// ここではログ出力に留め、satori呼び出しでフォントが必須であることを期待する
}

interface AstroFileProps {
	params: { slug: string };
	props: { page: CollectionEntry<"posts">["data"] };
}

export async function getStaticPaths() {
	const pages = await getCollection("posts", ({ data }) => {
		return data.draft !== true;
	});

	return pages.map((page) => ({
		params: { slug: `${page.slug}.png` },
		props: { page: page.data },
	}));
}

export async function GET({ params, props }: AstroFileProps) {
	const actualSlug = params.slug.replace(/\.png$/, "");
	console.log(
		`[GET /og/${params.slug}] Received request for actual slug: ${actualSlug}`,
	);

	const page = props.page;

	if (!page) {
		console.error(
			`[GET /og/${params.slug}] Page data not found for actual slug: ${actualSlug}`,
		);
		return new Response("Page not found", { status: 404 });
	}

	if (!fontRegularData || !fontBoldData) {
		console.error("Font data is not available, cannot generate OG image.");
		return new Response("Internal Server Error: Font data missing", {
			status: 500,
		});
	}

	console.log(
		`[GET /og/${params.slug}] Generating OG image with Satori for: ${page.title}`,
	);

	try {
		const imageHtml = html`
      <div
        style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; background: #fcf8ff ; color: #222; padding: 60px; font-family: 'Noto Sans JP'; border: 40px solid #74492B;"
      >
        <div style="font-size: 70px; font-weight: bold; margin-bottom: 30px; text-align: left; color: #2f0800;">
          ${page.title}
        </div>
        <div style="font-size: 40px; font-weight: normal; color: #320e00; text-align: left;">
          ${page.description}
        </div>
        <div style="position: absolute; bottom: 30px; right: 60px; font-size: 40px; color: #320e00;">
          ailogs.dev
        </div>
      </div>
    `;

		const svg = await satori(
			imageHtml as React.ReactNode, // satori-htmlの出力はReactNodeとして扱える
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: "Noto Sans JP",
						data: fontRegularData,
						weight: 400,
						style: "normal",
					},
					{
						name: "Noto Sans JP",
						data: fontBoldData,
						weight: 700,
						style: "normal",
					},
				],
			},
		);

		const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

		return new Response(pngBuffer, {
			status: 200,
			headers: {
				"Content-Type": "image/png",
				"Cache-Control": "public, max-age=31536000, immutable", // キャッシュ設定はお好みで
			},
		});
	} catch (e: unknown) {
		let errorMessage =
			"An unknown error occurred while generating the image with Satori.";
		if (e instanceof Error) {
			errorMessage = e.message;
		}
		console.error(
			`Error generating OG image for /og/${params.slug} (actual: ${actualSlug}) with Satori: ${errorMessage}`,
			e,
		);
		return new Response(`Failed to generate OG image: ${errorMessage}`, {
			status: 500,
		});
	}
}
