import { render, screen, act } from "@testing-library/react";
import DisprzLocalizer from "./DisprzLocalizer";
import useLocalizerContext from "./useLocalizerContext";
import { server } from "../../__mocks__/nodeServer";
import { rest } from "../../__mocks__/apiHandler";
describe("Localizer", () => {
  test("rendered text should match the localized text", async () => {
    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return <span>{getLanguageText("message")}</span>;
    };

    render(
      <DisprzLocalizer
        lang="en"
        defaultTranslation={{
          message: "Hello world",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    const span = await screen.findByText(/Hello world/);
    expect(span).toBeInTheDocument();
  });

  test("rendered text should match the localized text after changing language", async () => {
    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return <span>{getLanguageText("message")}</span>;
    };

    const { rerender } = render(
      <DisprzLocalizer
        lang="en"
        defaultTranslation={{
          message: "Hello world",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
          fr: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    rerender(
      <DisprzLocalizer
        key="fr"
        lang="fr"
        defaultTranslation={{
          message: "Hello world",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
          fr: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    const span = await screen.findByText("Bonjour le monde", {
      timeout: 1000,
    });
    expect(span).toBeInTheDocument();
  });

  test("when specific language is not available, it should revert back to english", async () => {
    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return <span>{getLanguageText("message")}</span>;
    };

    const { rerender } = render(
      await act(async () => (
        <DisprzLocalizer
          lang="en"
          defaultTranslation={{
            message: "Hello world",
          }}
          mfe={"storybook"}
          clientIdentifier=""
          terminologyInfoString={{
            en: [
              {
                itemIdentifier: "term_skill_short",
                itemName: "Skill",
                singularForm: "Skill",
                pluralForm: "Skills",
                examples: ["Courses"],
              },
            ],
            fr: [
              {
                itemIdentifier: "term_skill_short",
                itemName: "Skill",
                singularForm: "Skill",
                pluralForm: "Skills",
                examples: ["Courses"],
              },
            ],
          }}
        >
          <Child />
        </DisprzLocalizer>
      ))
    );

    rerender(
      <DisprzLocalizer
        lang="invalid"
        defaultTranslation={{
          message: "Hello world",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
          fr: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    const span = await screen.findByText("Hello world", {
      timeout: 1000,
    });
    expect(span).toBeInTheDocument();
  });

  test("language should be fetch and merged for a particular client if applicable", async () => {
    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return <span>{getLanguageText("message")}</span>;
    };

    await act(
      async () =>
        await render(
          <DisprzLocalizer
            lang="en"
            defaultTranslation={{
              message: "Hello world",
            }}
            mfe={"storybook"}
            clientIdentifier="Components"
            terminologyInfoString={{
              en: [
                {
                  itemIdentifier: "term_skill_short",
                  itemName: "Skill",
                  singularForm: "Skill",
                  pluralForm: "Skills",
                  examples: ["Courses"],
                },
              ],
              fr: [
                {
                  itemIdentifier: "term_skill_short",
                  itemName: "Skill",
                  singularForm: "Skill",
                  pluralForm: "Skills",
                  examples: ["Courses"],
                },
              ],
            }}
          >
            <Child />
          </DisprzLocalizer>
        )
    );
    const span = await screen.findByText(
      "This is a overridden for a client with name Components"
    );
    expect(span).toBeInTheDocument();
  });

  test("default language should be available when clientIdentifier the api throws an error", async () => {
    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return <span>{getLanguageText("message")}</span>;
    };

    await act(
      async () =>
        await render(
          <DisprzLocalizer
            lang="en"
            defaultTranslation={{
              message: "Hello world",
            }}
            mfe={"storybook"}
            clientIdentifier="InvalidIdentifier"
            terminologyInfoString={{
              en: [
                {
                  itemIdentifier: "term_skill_short",
                  itemName: "Skill",
                  singularForm: "Skill",
                  pluralForm: "Skills",
                  examples: ["Courses"],
                },
              ],
              fr: [
                {
                  itemIdentifier: "term_skill_short",
                  itemName: "Skill",
                  singularForm: "Skill",
                  pluralForm: "Skills",
                  examples: ["Courses"],
                },
              ],
            }}
          >
            <Child />
          </DisprzLocalizer>
        )
    );
    const span = await screen.findByText("Hello world");
    expect(span).toBeInTheDocument();
  });

  test("terminology should be applied when DisprzLocalizer is used", async () => {
    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return (
        <>
          <span>{getLanguageText("pluralForm")}</span>
          <span>{getLanguageText("singularForm")}</span>
        </>
      );
    };

    render(
      <DisprzLocalizer
        lang="en"
        defaultTranslation={{
          pluralForm: "These are {term_skill_short_n} - Plural Form",
          singularForm: "This is a {term_skill_short_1} - Singular Form",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
          fr: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    const singularSpan = await screen.findByText(
      "This is a Skill - Singular Form"
    );
    const pluralSpan = await screen.findByText(
      "These are Skills - Plural Form"
    );
    expect(singularSpan).toBeInTheDocument();
    expect(pluralSpan).toBeInTheDocument();
  });

  test("terminology should return term type when it's not available in terminology info item with DisprzLocalizer", async () => {
    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return (
        <>
          <span>{getLanguageText("pluralForm")}</span>
          <span>{getLanguageText("singularForm")}</span>
        </>
      );
    };

    render(
      <DisprzLocalizer
        lang="en"
        defaultTranslation={{
          pluralForm: "These are {term_invalid_short_n} - Plural Form",
          singularForm: "This is a {term_invalid_short_1} - Singular Form",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
          fr: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    const singularSpan = await screen.findByText(
      "This is a term_invalid_short - Singular Form"
    );
    const pluralSpan = await screen.findByText(
      "These are term_invalid_short - Plural Form"
    );
    expect(singularSpan).toBeInTheDocument();
    expect(pluralSpan).toBeInTheDocument();
  });

  test("missing key on other languages should display default translation string", async () => {
    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return <span>{getLanguageText("hiText")}</span>;
    };

    render(
      <DisprzLocalizer
        lang="fr"
        defaultTranslation={{
          hiText: "Hi",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
          fr: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    const directKeyWithoutTranslation = await screen.findByText("Hi");
    expect(directKeyWithoutTranslation).toBeInTheDocument();
  });

  test("missing mfe translations should not affect dcmp translations and display default string", async () => {
    server.use(
      rest.get(
        "https://disprztranslations.blob.core.windows.net/resfiles/microfrontends/storybook/res-fr.json",
        (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ error: "Blob not found" }));
        }
      )
    );

    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return (
        <>
          <span>{getLanguageText("message")}</span>
          <span>{getLanguageText("dcmp:message")}</span>
        </>
      );
    };

    render(
      <DisprzLocalizer
        lang="fr"
        defaultTranslation={{
          message: "Hello world",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
          fr: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    const spanWithDcmpText = await screen.findByText("Bonjour le monde", {
      timeout: 1000,
    });

    const span = await screen.findByText("Hello world", {
      timeout: 1000,
    });
    expect(spanWithDcmpText).toBeInTheDocument();
    expect(span).toBeInTheDocument();
  });

  test("missing dcmp translations should not affect mfe translations", async () => {
    server.use(
      rest.get(
        "https://disprztranslations.blob.core.windows.net/resfiles/microfrontends/disprz-components/res-fr.json",
        (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ error: "Blob not found" }));
        }
      )
    );

    const Child = () => {
      const { getLanguageText } = useLocalizerContext();
      return <span>{getLanguageText("message")}</span>;
    };

    render(
      <DisprzLocalizer
        lang="fr"
        defaultTranslation={{
          message: "Hello world",
        }}
        mfe={"storybook"}
        clientIdentifier=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
          fr: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <Child />
      </DisprzLocalizer>
    );

    const span = await screen.findByText("Bonjour le monde", {
      timeout: 1000,
    });
    expect(span).toBeInTheDocument();
  });
});
