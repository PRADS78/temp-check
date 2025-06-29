import { useState, useEffect } from "react";
import AppButton from "../AppButton/AppButton";
import AppIcon from "../AppIcon/AppIcon";
import DropDown from "../DropDown/DropDown";
import RadioButton from "../RadioButton/RadioButton";
import "../RadioButton/RadioButton.scss";
import UdfSelector from "../UdfSelector/UdfSelector";
import UserSelectionWidget from "../UserSelectionWidget/UserSelectionWidget";
import "./SchedulingWidget.scss";

const periodicityOptions = [
  {
    label: "Daily",
    name: "daily",
    id: "daily",
  },
  {
    label: "Weekly",
    name: "weekly",
    id: "weekly",
  },
  {
    label: "Monthly",
    name: "monthly",
    id: "monthly",
  },
];

const weeklyPeriodicityOption = [
  {
    label: "Mon",
    name: "mon",
    id: "mon",
  },
  {
    label: "Tue",
    name: "tue",
    id: "tue",
  },
  {
    label: "Wed",
    name: "wed",
    id: "wed",
  },
  {
    label: "Thu",
    name: "thu",
    id: "thu",
  },
  {
    label: "Fri",
    name: "fri",
    id: "fri",
  },
  {
    label: "Sat",
    name: "sat",
    id: "sat",
  },
  {
    label: "Sun",
    name: "sun",
    id: "sun",
  },
];

const preferredTimeOptions = [
  {
    label: "Morning (4am - 12pm)",
    name: "morning",
    id: "morning",
  },
  {
    label: "Evening (5pm - 9pm)",
    name: "evening",
    id: "evening",
  },
  {
    label: "Night (9pm - 12am)",
    name: "night",
    id: "night",
  },
];

const preferredDate = [];
for (let i = 1; i <= 31; i++) {
  const entry = {
    label: i,
    value: i,
  };
  preferredDate.push(entry);
}

const userSelectionOptions = [
  {
    id: 0,
    name: "ByUdf",
    label: "All administrator who fulfill the target audience criteria",
  },
  {
    id: 1,
    name: "BySelection",
    label: "Select users",
  },
];

const SchedulingWidget = ({
  accessToken,
  skillTronAPI,
  user,
  title,
  usersSelected,
  periodicityInfo,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [isSelectionTypeByUdf, setIsSelectionTypeByUdf] = useState(false);
  const [displayUserSelectionScreen, setDisplayUserSelectionScreen] =
    useState(false);
  const [userSelectionType, setUserSelectionType] = useState(0);
  const [selectedUdfValues, setSelectedUdfValues] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [periodicity, setPeriodicity] = useState("");
  const [preferredDay, setPreferredDay] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  useEffect(() => {
    setSelectedUdfValues(
      JSON.parse(localStorage.getItem("selectedUdfValues")) || []
    );
    setPeriodicity(periodicityInfo?.periodicity || periodicityOptions[0].id);
    setPreferredTime(
      periodicityInfo?.preferredTime || preferredTimeOptions[0].id
    );
    if (usersSelected?.length > 0 && typeof usersSelected[0] === "number") {
      setIsSelectionTypeByUdf(false);
      setSelectedUsers([...usersSelected]);
      setUserSelectionType(userSelectionOptions[1].id);
    } else {
      setIsSelectionTypeByUdf(true);
      setSelectedUdfValues([...usersSelected]);
      setUserSelectionType(userSelectionOptions[0].id);
    }
  }, []);

  useEffect(() => {
    if (periodicity === "weekly") {
      setPreferredDay(
        periodicityInfo?.preferredDay || weeklyPeriodicityOption[0].id
      );
    } else if (periodicity === "monthly") {
      if (!isNaN(Number(periodicityInfo?.preferredDay)))
        setPreferredDay(
          {
            label: periodicityInfo?.preferredDay,
            value: periodicityInfo?.preferredDay,
          } || preferredDate[0]
        );
      else setPreferredDay(preferredDate[0]);
    } else if (periodicity === "daily") {
      setPreferredDay(null);
    }
  }, [periodicity]);

  const onRadioChange = (e) => {
    setUserSelectionType(Number(e.target.id));
    setSelectedUdfValues([]);
    setSelectedUsers([]);
  };

  const onUdfValueSelect = (values) => {
    setSelectedUdfValues([...values]);
    localStorage.setItem("selectedUdfValues", JSON.stringify(values));
  };

  const onUserSelection = (users) => {
    const userIds = users?.map((user) => {
      if (typeof user !== "object") {
        return user;
      } else {
        return user.userId;
      }
    });
    setSelectedUsers([...userIds]);
    onUserSelectionScreenClick();
  };

  const onPeriodicityChange = (e) => {
    setPeriodicity(e.target.id);
  };

  const onPreferredDayChange = (e) => {
    setPreferredDay(e.target.id);
  };

  const onDateSelect = (value) => {
    setPreferredDay(value);
  };

  const onPreferredTimeChange = (e) => {
    setPreferredTime(e.target.id);
  };

  const onUserSelectionScreenClick = () => {
    setDisplayUserSelectionScreen(!displayUserSelectionScreen);
  };

  const onSchedulingSubmit = () => {
    const payload = {
      selectionTypeByUdf: isSelectionTypeByUdf,
      selectedUdfValues:
        selectedUdfValues.length > 0 ? selectedUdfValues : null,
      selectedUsers: selectedUsers.length > 0 ? selectedUsers : null,
      periodicity: periodicity,
      preferredDay:
        periodicity !== "daily"
          ? periodicity.value === "monthly"
            ? preferredDay.value
            : preferredDay
          : null,
      preferredTime: preferredTime,
    };
    onSubmit(payload);
  };

  const getMonthLabel = () => {
    let prefix = "";
    if (preferredDay?.value === 1) {
      prefix = "st";
    } else if (preferredDay?.value === 2) {
      prefix = "nd";
    } else if (preferredDay?.value === 3) {
      prefix = "rd";
    } else if (preferredDay?.value) {
      prefix = "th";
    }
    return `${prefix} of the month`;
  };

  const isSubmitButtonDisabled = !(
    (selectedUdfValues?.length > 0 || selectedUsers?.length > 0) &&
    periodicity !== "" &&
    preferredTime !== ""
  );

  const renderUdfSelection = () => {
    return (
      <UdfSelector
        udfFetchAPiUrl={`${skillTronAPI}api/admin/getLimitedUserDefinedFieldsSummary`}
        accessToken={accessToken}
        selectedUdfValues={selectedUdfValues}
        onUdfValueSelect={onUdfValueSelect}
      />
    );
  };

  const renderUserSelectionWidget = () => {
    return (
      <div className="select-user-screen">
        <UserSelectionWidget
          userFetchAPIUrl={`${skillTronAPI}api/user/searchUsers`}
          onProcessSelection={onUserSelection}
          onCancel={onUserSelectionScreenClick}
          apiParams={{ userContexts: [3] }}
          excludeSelectedUsers
          selectedUsers={selectedUsers}
          limitedUserDefinedFieldsSummaryFetchAPIUrl={`${skillTronAPI}api/admin/getLimitedUserDefinedFieldsSummary`}
          rowSelectable
          showAdvancedSearch
          showTotalCountAsHeading
          user={user}
          extraQueryParams={{
            restrictToMyUsers: false,
          }}
          accessToken={accessToken}
        />
      </div>
    );
  };

  const renderUserSelectionBlock = () => {
    return (
      <>
        <div className="block-header-wrapper">
          <div className="block-header">This report is send to:</div>
        </div>
        <div className="selection-block">
          <div className="custom-radio" key={0}>
            <input
              id={userSelectionOptions[0].id}
              type="radio"
              checked={userSelectionType === 0}
              onChange={onRadioChange}
            />
            <label htmlFor={userSelectionOptions[0].id}>
              {userSelectionOptions[0].label}
            </label>
          </div>
          {userSelectionType === 0 && renderUdfSelection()}
          <div className="custom-radio" key={1}>
            <input
              id={userSelectionOptions[1].id}
              type="radio"
              checked={userSelectionType === 1}
              name={userSelectionOptions[1].name}
              onChange={onRadioChange}
            />
            <label htmlFor={userSelectionOptions[1].id}>
              {userSelectionOptions[1].label}
            </label>
          </div>
          {userSelectionType === 1 && (
            <div className="user-selection">
              <AppButton
                ctrCls="user-selection-button"
                type="outlined"
                buttonLabel="Select Users"
                clickHandler={() => {
                  onUserSelectionScreenClick();
                }}
              />
              <div
                className="user-selection-info"
                onClick={onUserSelectionScreenClick}
              >
                {selectedUsers.length > 0
                  ? `${selectedUsers.length} user${
                      selectedUsers.length > 1 ? "s" : ""
                    } selected`
                  : null}
              </div>
            </div>
          )}
          {displayUserSelectionScreen && renderUserSelectionWidget()}
        </div>
      </>
    );
  };

  const renderPeriodicityBlock = () => {
    return (
      <>
        <div className="block-header-wrapper block-margin">
          <div className="block-header">Periodicity:</div>
          <div className="block-description">
            Set the periodicity of how often do you want to send this report
          </div>
        </div>
        <div className="selection-block">
          <div className="selection-item">
            <div className="selection-name">Repeats:</div>
            <RadioButton
              ctrCls={"radio-input"}
              value={periodicity}
              radioGroups={periodicityOptions}
              onRadioChange={onPeriodicityChange}
            />
          </div>
          {renderPeriodicityOption()}
          {renderPreferredTimeOption()}
        </div>
      </>
    );
  };

  const renderPeriodicityOption = () => {
    switch (periodicity) {
      case "weekly":
        return (
          <div className="selection-item">
            <div className="selection-name">Repeats On:</div>
            <RadioButton
              ctrCls={"radio-input"}
              value={preferredDay}
              radioGroups={weeklyPeriodicityOption}
              onRadioChange={onPreferredDayChange}
            />
          </div>
        );
      case "monthly":
        return (
          <div className="selection-item">
            <div className="selection-name">Repeats On:</div>
            <DropDown
              items={preferredDate}
              value={preferredDay}
              placeholder={"Select Date"}
              onSelect={onDateSelect}
            />
            <label>{`${getMonthLabel()}`}</label>
          </div>
        );
      default:
        return;
    }
  };

  const renderPreferredTimeOption = () => {
    return (
      <div className="selection-item">
        <div className="selection-name">Repeat Time:</div>
        <RadioButton
          ctrCls={"radio-input"}
          value={preferredTime}
          radioGroups={preferredTimeOptions}
          onRadioChange={onPreferredTimeChange}
        />
      </div>
    );
  };

  return (
    <>
      <div className="blur-background">
        <div className="scheduling-modal">
          <div className="modal-title-bar">
            <div className="modal-title">{title}</div>
            <div className="modal-close" onClick={onClose}>
              <AppIcon iconCls="modal-close"></AppIcon>
            </div>
          </div>
          <div className="modal-content">
            {renderUserSelectionBlock()}
            {renderPeriodicityBlock()}
          </div>
          <div className="scheduling-ctas">
            <AppButton
              ctrCls="cta-button"
              type="primary"
              buttonLabel="Submit"
              disabled={isSubmitButtonDisabled}
              clickHandler={onSchedulingSubmit}
            />
            <AppButton
              ctrCls={`cta-button ${
                usersSelected.length > 0 ? "delete-button" : ""
              }`}
              type="outlined"
              buttonLabel="Delete"
              disabled={usersSelected.length === 0}
              clickHandler={onDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
};

SchedulingWidget.defaultProps = {
  title: "Settings",
};

export default SchedulingWidget;
