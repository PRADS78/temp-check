import { SearchBar } from ".";
import { useArgs } from "@storybook/client-api";
import { useState } from "react";

export default {
  title: "Disprz/DisprzSearchBar",
  component: SearchBar,
};

function Template(args) {
  // eslint-disable-next-line no-unused-vars
  const [storyArgs, updateArgs] = useArgs();
  const [searchInput, setSearchInput] = useState(args.value ?? "");

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "15px",
  };
  return (
    <div
      data-testid="search-bar-container"
      style={containerStyle}
      onChange={(event) => updateArgs({ value: event.target.value })}
    >
      <SearchBar
        {...args}
        onSearch={(e) => {
          args.onSearch(e);
          console.log("search works");
        }}
        onChange={(e) => {
          args.onChange(e);
          setSearchInput(e.target.value);
        }}
        value={searchInput}
        onClear={() => {
          args.onClear();
          setSearchInput("");
        }}
        uniqueId={1666950229909}
      />
    </div>
  );
}

export const Standard = Template.bind({});

Standard.args = {
  ctrCls: "",
};

export const WithText = Template.bind({});

WithText.args = {
  value: "Text",
};

export const Disabled = Template.bind({});

Disabled.args = {
  isDisabled: true,
};

const parameters = {
  jest: ["SearchBar.test.js"],
};

Standard.parameters = parameters;
