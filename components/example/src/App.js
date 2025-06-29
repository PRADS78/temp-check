import { useMemo, useState } from "react";
import logo from "./logo.png";
import "./App.css";
import {
  DisprzDatePicker,
  DateTimePicker,
  DisprzButton,
  DisprzDropDown,
  DisprzTextField,
  DisprzSwitch,
  DisprzSnackbar,
  AutomationIdPrefixProvider,
  DisprzToggleSwitch,
  DisprzTabs,
  DisprzImageSelector
} from "@disprz/components";
import "@disprz/components/build/index.css";
import { useRef } from "react";

function App() {
  const [switchOn, setSwitchOn] = useState(false);
  const standardSnackRef = useRef(null);
  const oneButtonSnackRef = useRef(null);
  const withDismissSnackRef = useRef(null);

  console.log("The values are ", AutomationIdPrefixProvider);

  const [toggleState, setToggleState] = useState(2);
  const [tabId, setTabId] = useState("chocolate");

  const data = useMemo(() => {
    return [
      {
        id: "strawberry",
        label: "Strawberry",
        panel: <div>Strawberries are popular in home gardens.</div>,
        ctrCls: "strawberry-class",
      },
      {
        id: "chocolate",
        label: "Chocolate",
        panel: (
          <div>
            Chocolate is a food product made from roasted and ground cacao pods.
          </div>
        ),
      },
      {
        id: "mango",
        label: "Mango",
        panel: (
          <div>
            A mango is an edible stone fruit produced by the tropical tree
            Mangifera indica
          </div>
        ),
      },
      {
        id: "vanilla",
        label: "Vanilla",
        panel: (
          <div>
            Vanilla is a spice derived from orchids of the genus Vanilla
          </div>
        ),
      },
    ];
  }, []);

  return (
    <AutomationIdPrefixProvider value="example">
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="Component">
          <DisprzButton
            type="primary"
            label="Button"
            onClick={() => { }}
            uniqueId={1665747922048}
          />
        </div>
        <div className="Component">
          <DisprzImageSelector
            uniqueId={1682417561792}
            defaultSearchText="cat"
            accessToken="yRxeW0VB3uvyFTFq+eGoqXOsMS/Ng5hbfUkF5KJ5SlJtadSgyaLD1pjGwkmOxAR+qYh5/TJZdlVrYfE9XKXYUxz4HdYjosmGTQpxRkhjpCaQDMi2tdeZ1Djf8VmKizUmCwKJ2ZitPGQPssSm5VsdUDhJ5f4FtatbN5p6mGEac8wj8Nz9cl7qV8JxD2x04kJKqvh8XgA7vCYe9qy7qvnd2Fxwm5dTTcnlauCunDpLzD+u42jKRr6TYBNsLDDi17Z1c6cgjdiK5rEXrNTdd2iRcxwTzD+R84sygKyw/yGy55H2yknxz1ckg+IKru4qGA4EN9pbktOGPbqjdIfq2tJMJkKLUeLa1TiUL6q047DmIT5YSFEKtA2FZA1zHK7LrD5UZIZT6Nyhkig="
          />
        </div>
        <div className="Component">
          <h2>Snackbar1</h2>
          <DisprzButton
            label="standard"
            onClick={() => {
              standardSnackRef.current.show();
            }}
            uniqueId={1665747938423}
          />
          <DisprzSnackbar
            ref={standardSnackRef}
            type="warning"
            message={" One line text string. working fine text string."}
            uniqueId={1668670932197}
          />
        </div>
        <div className="Component">
          <h2>Snackbar2</h2>
          <DisprzButton
            label="with one button"
            onClick={() => {
              oneButtonSnackRef.current.show();
            }}
            uniqueId={1665747954674}
          />
          <DisprzSnackbar
            ref={oneButtonSnackRef}
            action={{
              label: "test",
              onClick: () => {
                console.log("first");
              },
            }}
            message={"One line i is owrking"}
            uniqueId={1668670942457}
          />
        </div>
        <div className="Component">
          <h2>Snackbar2</h2>
          <DisprzButton
            label="with dismiss"
            onClick={() => {
              withDismissSnackRef.current.show();
            }}
            uniqueId={1665747954674}
          />
          <DisprzSnackbar
            canShowDismiss={true}
            ref={withDismissSnackRef}
            message={
              "One line text string. One line text string. One line text string. it is owrking"
            }
            uniqueId={1668670951694}
          />
        </div>
        <div className="Component">
          <h2>DropDownRefactored</h2>
          <DisprzDropDown
            placeholder="Select flavor"
            name="drop-down"
            items={[
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" },
            ]}
            ctrCls=""
            isClearable={false}
            searchable={false}
            isMulti={false}
            isDisabled={false}
            size="small"
            uniqueId={1668670963530}
          />
        </div>
        <div className="Component">
          <h2>Date Picker</h2>
          <DateTimePicker
            ctrCls=""
            name={"date"}
            label="Date Picker"
            dateFormat="dd/MM/yyyy"
            selected={null}
            selectRange={false}
            startDate={null}
            endDate={null}
            disabled={false}
            placeholder={"Select start date"}
            uniqueId={1668670975621}
          />
        </div>
        <div className="Component">
          <h2>Multi-select DropDown</h2>
          <DisprzDropDown
            placeholder="Select flavors"
            name="drop-down"
            items={[
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" },
              { value: "cheese", label: "Cheese" },
            ]}
            ctrCls=""
            isClearable={false}
            isSearchable={true}
            isMulti={true}
            isDisabled={false}
            onSelect={() => undefined}
            size="small"
            uniqueId={1668670986853}
          />
        </div>
        <div className="Component">
          <h2>TextField</h2>
          <DisprzTextField
            borderGapColor="#ffffff"
            type="number"
            onChange={(text) => console.log(text)}
            uniqueId={1668670998392}
          />
        </div>
        <div className="Component">
          <h2>Switch</h2>
          <DisprzSwitch
            uniqueId={1668671013076}
            on={switchOn}
            onChange={() => setSwitchOn(!switchOn)}
          />
        </div>

        <div className="Component">
          <h2>Date Picker</h2>
          <DisprzDatePicker
            dateFormat="dd/MM/yyyy h:mm a"
            defaultDates={[new Date()]}
            canShowTimeInput={true}
            onChange={(date) => undefined}
            uniqueId={1668671034402}
          />
        </div>

        <div className="Component">
          <h2>ToggleSwitch</h2>
          <DisprzToggleSwitch
            items={[
              {
                label: "Option 1",
                id: 1,
              },
              {
                label: "Long Option Here",
                id: 2,
              },
            ]}
            selectedId={toggleState}
            uniqueId={1671101408509}
            onChange={(e, item) => setToggleState(item.id)}
          ></DisprzToggleSwitch>
        </div>
        <div className="Component">
          <h2>Disprz Tabs</h2>
          <DisprzTabs
            data={data}
            defaultTabId={"vanilla"}
            uniqueId={1671101402356}
            onTabChange={({ id }) => {
              setTabId(id);
            }}
          ></DisprzTabs>
        </div>

        <a
          className="App-link"
          href="https://disprzpipeline.disprz.com/disprzcomponentsdoc/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Public Storybook link
        </a>
      </div>
    </AutomationIdPrefixProvider>
  );
}

export default App;
