import { forwardRef } from "react";
import { useLocalizerWithNameSpace } from "../DisprzLocalizer";

function withLocalizerContext(WrappedComponent) {
  function TranslationComponent(props, ref) {
    const { getLanguageText: t } = useLocalizerWithNameSpace();

    return <WrappedComponent {...props} t={t} ref={ref} />;
  }
  return forwardRef(TranslationComponent);
}

export default withLocalizerContext;
