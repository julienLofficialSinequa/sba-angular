---
layout: default
title: Custom entities
parent: Tips and Tricks
nav_order: 3
---

# Custom entities

Entities work just like [metadata](metadata.html), with additional characteristics:
- Entities are extracted from text, we would like to highlight them in the HTML preview.
- Entities normally have a display form ("Président") and a normalized form ("PRESIDENT"):

    ![Entities]({{site.baseurl}}assets/tipstricks/entities.png){: .d-block .mx-auto }

We will assume a new entity was extracted and stored in a column of the index (via a whitelist, TMA, or any other mean).

## Back-end configuration

As in the [previous chapter](metadata.html#back-end-configuration), you can configure an *alias* and an *aggregation* for your custom entity.

Additionally, you need to configure your *Preview web service* to highlight this new entity. This is done via the administration in *Search-Based Applications > Web Services > Your preview configuration*. Add your entity in *Highlights to display*:

![List of highlights]({{site.baseurl}}assets/tipstricks/highlights.png){: .d-block .mx-auto }

## Highlighting entities

If you open a document's HTML preview, your entity may not appear as highlighted (yet). You need to add some configuration, so that the entities marked with HTML tags are highlighted (eg. `<span class="person">Barack Obama</span>`).

In [Vanilla Search]({{site.baseurl}}apps/2-vanilla-search.html), you can find the default configuration in the `config.ts` file with the `PREVIEW_HIGHLIGHTS` constant:

```ts
export const PREVIEW_HIGHLIGHTS: PreviewHighlightColors[] = [
    {
        name: 'company',
        color: 'white',
        bgColor: '#FF7675'
    },
    {
        name: 'geo',
        color: 'white',
        bgColor: '#74B9FF'
    },
    {
        name: 'person',
        color: 'white',
        bgColor: '#00ABB5'
    },
    {
        name: 'extractslocations',
        color: 'black',
        bgColor: '#fffacd'
    },
    {
        name: 'matchlocations',
        color: 'black',
        bgColor: '#ff0'
    }
];
```

The understanding is pretty straight forward, where we define that the classes of name `name` take `color` as text color and `bgColor` as background color.

This value is then passed by default to the [Preview component]({{site.baseurl}}libraries/components/preview.html) if there is no config for `previewHighlights` in the `AppService`.

Just below in `config.ts` is the `SELECTORS_HIGHLIGHTS` constant which is used by the `HighlightService` to apply additional highlights to other components that require some. Note this can also be overriden if you configure the `highlights` parameter in the `AppService`.

```ts
export const SELECTORS_HIGHLIGHTS: {selectors: string[], highlights: PreviewHighlightColors[]}[] = [
    {
        selectors: ['.sq-metadata-tooltip span', 'sq-preview-extracts-panel span'],
        highlights: PREVIEW_HIGHLIGHTS
    }
];
```

In this case, the same highlights than the Preview are applied to the spans in the `sq-metadata-tooltip` class (for the [metadata entity tooltip]({{site.baseurl}}libraries/components/metadata.html)) and in the `sq-preview-extracts-panel` component (inside the list of extracts next to the preview of a document).

## Troubleshooting

If you followed the above steps but cannot see highlights in the preview, consider the following failure cases:
- Entities might not be indexed properly: In the inspector, look at the content of a record, and check whether it contains your entity:

![Entity]({{site.baseurl}}assets/tipstricks/entity-values.png){: .d-block .mx-auto }

- Entities might not be highlighted by the preview web service: In the inspector, inspect the HTML preview to check whether your entities are properly surrounded by `<span>` tags:

![Entity]({{site.baseurl}}assets/tipstricks/entity.png){: .d-block .mx-auto }

- You have not setup properly the JS and/or CSS files as described on the [Preview Module]({{site.baseurl}}libraries/components/preview.html#preview-css-and-js-files) page.

- Your CSS rules might be incorrect or overriden: Make sure that the `<span>` tags are properly targetted by the rules.

![Preview CSS]({{site.baseurl}}assets/tipstricks/preview-css.png){: .d-block .mx-auto }
