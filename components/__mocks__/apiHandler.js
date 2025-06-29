import { rest } from "msw";
import { res } from "./apiGenericResponse";
import {
  getTableAllRows,
  getTableAllRowsUserName,
  getTableRows,
  getTableRowsWithoutTotal,
  getTableGlobalFilters,
} from "./tableRows";
import { getGlobalImages } from "./imageSelector.js";
import udfs from "./udfs";

const handlers = [
  rest.get("https://storybookapi.disprz.com/udfs/", (req, _, ctx) => {
    return res(ctx.status(200), ctx.json(udfs));
  }),
  rest.post("https://storybookapi.disprz.com/table", async (req, _, ctx) => {
    const bodyParams = await req.json();
    const limit = bodyParams.limit;
    const offset = bodyParams.offset;
    const sortBy = bodyParams.sortBy;
    const sortOrder = bodyParams.sortOrder;
    const searchText = bodyParams.searchText;
    const filters = bodyParams.filters;

    const { rows, total } = getTableRows({
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      sortOrder,
      searchText,
      filters,
    });
    return res(
      ctx.status(200),
      ctx.json({
        users: rows,
        total: total,
      })
    );
  }),
  rest.post(
    "https://storybookapi.disprz.com/tableWithoutTotal",
    async (req, _, ctx) => {
      const bodyParams = await req.json();
      const limit = bodyParams.limit;
      const offset = bodyParams.offset;
      const sortBy = bodyParams.sortBy;
      const sortOrder = bodyParams.sortOrder;
      const searchText = bodyParams.searchText;
      const filters = bodyParams.filters;

      const { rows, isTruncated } = getTableRowsWithoutTotal({
        limit: parseInt(limit),
        offset: parseInt(offset),
        sortBy,
        sortOrder,
        searchText,
        filters,
      });
      return res(
        ctx.status(200),
        ctx.json({
          users: rows,
          isTruncated,
        })
      );
    }
  ),
  rest.get("https://storybookapi.disprz.com/table/usernames", (req, _, ctx) => {
    const data = getTableAllRowsUserName();
    const allData = getTableAllRows();
    return res(
      ctx.status(200),
      ctx.json({
        rowIds: data,
        rows: allData,
      })
    );
  }),
  rest.get("https://storybookapi.disprz.com/tablefilters", (req, res, ctx) => {
    const data = getTableGlobalFilters();
    return res(ctx.status(200), ctx.json(data));
  }),
  rest.get("https://storybookapi.disprz.com/*", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post("https://imagesearch-msvc.disprz.com/images", (req, _, ctx) => {
    const data = getGlobalImages();
    return res(ctx.status(200), ctx.json(data));
  }),
  rest.get(
    "https://disprztranslations.blob.core.windows.net/resfiles/microfrontends/disprz-components/res-fr.json",
    (req, _, ctx) => {
      return res(ctx.status(200), ctx.json({ message: "Bonjour le monde" }));
    }
  ),
  rest.get(
    "https://disprztranslations.blob.core.windows.net/resfiles/microfrontends/storybook/res-fr.json",
    (req, _, ctx) => {
      return res(ctx.status(200), ctx.json({ message: "Bonjour le monde" }));
    }
  ),
  rest.get(
    "https://disprztranslations.blob.core.windows.net/resfiles/microfrontends/storybook/res-en.json",
    (req, _, ctx) => {
      return res(ctx.status(200), ctx.json({ message: "Hello World!" }));
    }
  ),
  rest.get(
    "https://disprztranslations.blob.core.windows.net/resfiles/microfrontends/storybook/client/Components/res-en.json",
    (req, _, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          message: "This is a overridden for a client with name Components",
        })
      );
    }
  ),
];

export { handlers, rest };
