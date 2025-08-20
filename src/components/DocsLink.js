import PropTypes from "prop-types";
import React from "react";
import { CLink } from "@coreui/react";

const DocsLink = (props) => {
  const { to, name, text, ...rest } = props;

  const _href = name ? `https://coreui.io/react/docs/components/${name}` : to;

  return (
    <div className="float-end">
      <CLink
        {...rest}
        to={_href}
        rel="noreferrer noopener"
        target="_blank"
        className="card-header-action"
      >
        <small className="text-body-secondary">{text || "docs"}</small>
      </CLink>
    </div>
  );
};

DocsLink.propTypes = {
  to: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
};

export default React.memo(DocsLink);
