import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SiteFooter } from "./site-footer";

test("renders unique partner links beside the copyright at half size", () => {
  const markup = renderToStaticMarkup(
    <SiteFooter locale="en" dict={getDictionary("en")} />,
  );
  const expectedLinks = [
    "https://ufuksoynakliyat.com.tr/tuzla-evden-eve-nakliyat",
    "https://ufuksoynakliyat.com.tr/kartal-evden-eve-nakliyat",
    "https://tekhurdametal.com/istanbul-hurdaci/",
    "https://tekhurdametal.com/hurda-fiyatlari/",
    "https://tekhurdametal.com/hurda-demir-fiyatlari/",
    "https://tekhurdametal.com/beylikduzu-hurdaci/",
    "https://lionerotik.com/urunler/fetis-urunleri",
  ];

  for (const href of expectedLinks) {
    assert.match(markup, new RegExp(`href="${href.replaceAll(".", "\\.")}"`));
  }

  assert.ok(
    markup.indexOf("All rights reserved.") <
      markup.indexOf("https://ufuksoynakliyat.com.tr"),
  );
  assert.match(markup, /aria-label="Partner links"/);
  assert.match(markup, /text-\[7px\]/);
  assert.match(
    markup,
    /Kartal Evden Eve Nakliyat<\/a> Firması Ufuksoy Nakliyat A\.Ş/,
  );
  assert.match(markup, /Demir Hurda Fiyatları<\/a> Tek Hurda Metal/);
  assert.match(markup, /Antalya Seks Shop<\/a> Lion Erotik/);
  assert.equal(
    markup.match(
      /href="https:\/\/lionerotik\.com\/urunler\/fetis-urunleri"/g,
    )?.length,
    1,
  );
  assert.doesNotMatch(markup, /Antalya (?:Sex|Erotik) Shop/);
});
