import { useEffect } from "react";
import "./TikTokProfileEmbed.css";

const TIKTOK_EMBED_SCRIPT = "https://www.tiktok.com/embed.js";

export default function TikTokProfileEmbed() {
  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src="${TIKTOK_EMBED_SCRIPT}"]`,
    );
    existingScript?.remove();

    const script = document.createElement("script");
    script.src = TIKTOK_EMBED_SCRIPT;
    script.async = true;
    script.dataset.tiktokCreatorEmbed = "true";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <section className="tiktokProfile" aria-labelledby="tiktok-profile-title">
      <header className="tiktokProfile__header">
        <p className="tiktokProfile__eyebrow mono">3SGO · TIKTOK</p>
        <h2 id="tiktok-profile-title" className="tiktokProfile__title">
          Theo dõi 3sGo trên TikTok
        </h2>
      </header>

      <div className="tiktokProfile__embed">
        <blockquote
          className="tiktok-embed"
          cite="https://www.tiktok.com/@kietnguyenxedien"
          data-unique-id="kietnguyenxedien"
          data-embed-type="creator"
          style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}
        >
          <section>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.tiktok.com/@kietnguyenxedien?refer=creator_embed"
            >
              @kietnguyenxedien
            </a>
          </section>
        </blockquote>
      </div>
    </section>
  );
}
