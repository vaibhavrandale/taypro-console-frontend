import React from "react";
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
} from "@coreui/react";
import { DocsComponents, DocsExample } from "../../../components";
import { Link } from "react-router-dom";

const Breadcrumbs = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <DocsComponents to="components/breadcrumb/" />
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Breadcrumb</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              The breadcrumb navigation provides links back to each previous
              page the user navigated through and shows the current location in
              a website or an application. You don’t have to add separators,
              because they automatically added in CSS through{" "}
              <Link to="https://developer.mozilla.org/en-US/docs/Web/CSS/::before">
                {" "}
                <code>::before</code>
              </Link>{" "}
              and{" "}
              <Link to="https://developer.mozilla.org/en-US/docs/Web/CSS/content">
                {" "}
                <code>content</code>
              </Link>
              .
            </p>
            <DocsExample to="components/breadcrumb">
              <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink to="#">Home</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem active>Library</CBreadcrumbItem>
              </CBreadcrumb>
              <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink to="#">Home</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem>
                  <CLink to="#">Library</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem active>Data</CBreadcrumbItem>
              </CBreadcrumb>
              <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink to="#">Home</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem>
                  <CLink to="#">Library</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem>
                  <CLink to="#">Data</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem active>Bootstrap</CBreadcrumbItem>
              </CBreadcrumb>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Breadcrumbs;
