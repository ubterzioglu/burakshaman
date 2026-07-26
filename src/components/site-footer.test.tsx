import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SiteFooter } from "./site-footer";

test("restores the previous footer links and includes the requested links once", () => {
  const markup = renderToStaticMarkup(
    <SiteFooter locale="tr" dict={getDictionary("tr")} />,
  );
  const expectedLinks = [
    "https://tekhurdametal.com/istanbul-hurdaci/",
    "https://tekhurdametal.com/hurda-fiyatlari/",
    "https://tekhurdametal.com/beylikduzu-hurdaci/",
    "https://lionerotik.com/urunler/fetis-urunleri",
    "https://ufuksoynakliyat.com.tr/kartal-evden-eve-nakliyat",
    "https://tekhurdametal.com/hurda-demir-fiyatlari/",
  ];

  for (const href of expectedLinks) {
    assert.match(markup, new RegExp(`href="${href.replaceAll(".", "\\.")}"`));
  }

  assert.match(
    markup,
    /Kartal Evden Eve Nakliyat<\/a> Firması Ufuksoy Nakliyat A\.Ş/,
  );
  assert.match(markup, /Demir Hurda Fiyatları<\/a> Tek Hurda Metal/);
  assert.match(markup, /Antalya Seks Shop<\/a> Lion Erotik/);
  assert.equal(
    markup.match(/>Demir Hurda Fiyatları<\/a>/g)?.length,
    1,
  );
  assert.equal(markup.match(/>Antalya Seks Shop<\/a>/g)?.length, 1);
});
