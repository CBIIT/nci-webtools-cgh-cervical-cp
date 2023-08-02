import { useState } from "react";
import { useRecoilValue } from "recoil";
import { Link, Navigate } from "react-router-dom";
import { saveAs } from "file-saver";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { paramsState, resultsState } from "./state";
import { localeState } from "../../app.state";
import {
  scenarios,
  screeningTests,
  triageTests,
  diagnosticTests,
} from "../../services/models";
import { getTimestamp } from "../../services/file-utils";
import { exportPdf } from "../../services/pdf-utils";
import { asLabel, asPercent } from "../../services/formatters";
import PieChart from "./pie-chart";
import BarChart from "./bar-chart";
import { exportSvg, saveChartAsPNG } from "../../services/plot-utils";
import * as d3 from "d3";
import { exportExcel } from "../../services/excel-utils";
import { useTranslation, Trans } from "react-i18next";

export default function ScenarioResults() {
  const { t } = useTranslation();
  const params = useRecoilValue(paramsState);
  const results = useRecoilValue(resultsState);
  const [activeTab, setActiveTab] = useState("results");
  const locale = useRecoilValue(localeState);
  const ScreentestBarChartId = "screenTestBarChart";
  const barChartId = "barChart";
  const pieChartId = "pieChart";
  const barChartTitle = t("results.interventionsRequired");
  const pieChartTitle1 = t("results.populationWithPrecancer");
  const pieChartTitle2 = t("results.populationWithoutPrecancer");
  let screenTest = "";
  let triageTest = "";
  let diagnosisTest = "";
  let chartTiles = t("results.screenTreatment");

  // console.log("params", params);
  console.log("result", results);

  // chartTiles =
  //   results.checkedValues &&
  //   results.checkedValues.length === 2 &&
  //   results.checkedValues[1] === "ScreenDiagnosticTestTreat"
  //     ? t("results.screenDiagnosisTreatment")
  //     : results.checkedValues &&
  //       results.checkedValues.length === 2 &&
  //       results.checkedValues[1] === "ScreenTriageDiagnosticTestTreat"
  //     ? t("results.screenTriageTreatment")
  //     : results.checkedValues && results.checkedValues.length === 3
  //     ? t("results.screenTriageDiagnosisTreatment")
  //     : t("results.screenTreatment");

  if (
    results.checkedValues &&
    results.checkedValues.length === 2 &&
    results.checkedValues[1] === "ScreenDiagnosticTestTreat"
  ) {
    chartTiles = t("results.screenDiagnosisTreatment");
    if (results.screentest[0] === "pap") {
      screenTest = "(" + t("runScenario.PapTest") + ")";
    } else if (results.screentest[0] === "ivaa") {
      screenTest = "(" + t("runScenario.VIA") + ")";
    } else if (results.screentest[0] === "hpv") {
      screenTest = "(" + t("runScenario.HPV") + ")";
    } else if (results.screentest[0] === "hpv16or18") {
      screenTest = "(" + t("runScenario.HPV1618") + ")";
    } else {
      screenTest = "";
    }

    if (results.screentest[1] === "pap") {
      diagnosisTest = "(" + t("runScenario.PapTest") + ")";
    } else if (results.screentest[1] === "ivaa") {
      diagnosisTest = "(" + t("runScenario.VIA") + ")";
    } else if (results.screentest[1] === "hpv") {
      diagnosisTest = "(" + t("runScenario.HPV") + ")";
    } else if (results.screentest[1] === "hpv16or18") {
      diagnosisTest = "(" + t("runScenario.HPV1618") + ")";
    } else {
      diagnosisTest = "";
    }
  } else if (
    results.checkedValues &&
    results.checkedValues.length === 2 &&
    results.checkedValues[1] === "ScreenTriageDiagnosticTestTreat"
  ) {
    chartTiles = t("results.screenTriageTreatment");

    if (results.screentest[0] === "pap") {
      screenTest = "(" + t("runScenario.PapTest") + ")";
    } else if (results.screentest[0] === "ivaa") {
      screenTest = "(" + t("runScenario.VIA") + ")";
    } else if (results.screentest[0] === "hpv") {
      screenTest = "(" + t("runScenario.HPV") + ")";
    } else if (results.screentest[0] === "hpv16or18") {
      screenTest = "(" + t("runScenario.HPV1618") + ")";
    } else {
      screenTest = "";
    }

    if (results.screentest[1] === "pap") {
      triageTest = "(" + t("runScenario.PapTest") + ")";
    } else if (results.screentest[1] === "ivaa") {
      triageTest = "(" + t("runScenario.VIA") + ")";
    } else if (results.screentest[1] === "hpv") {
      triageTest = "(" + t("runScenario.HPV") + ")";
    } else if (results.screentest[1] === "hpv16or18") {
      triageTest = "(" + t("runScenario.HPV1618") + ")";
    } else {
      triageTest = "";
    }
  } else if (results.checkedValues && results.checkedValues.length === 3) {
    t("results.screenTriageDiagnosisTreatment");

    if (results.screentest[0] === "pap") {
      screenTest = "(" + t("runScenario.PapTest") + ")";
    } else if (results.screentest[0] === "ivaa") {
      screenTest = "(" + t("runScenario.VIA") + ")";
    } else if (results.screentest[0] === "hpv") {
      screenTest = "(" + t("runScenario.HPV") + ")";
    } else if (results.screentest[0] === "hpv16or18") {
      screenTest = "(" + t("runScenario.HPV1618") + ")";
    } else {
      screenTest = "";
    }

    if (results.screentest[1] === "pap") {
      triageTest = "(" + t("runScenario.PapTest") + ")";
    } else if (results.screentest[1] === "ivaa") {
      triageTest = "(" + t("runScenario.VIA") + ")";
    } else if (results.screentest[1] === "hpv") {
      triageTest = "(" + t("runScenario.HPV") + ")";
    } else if (results.screentest[1] === "hpv16or18") {
      triageTest = "(" + t("runScenario.HPV1618") + ")";
    } else if (results.screentest[1] === "colposcopicImpression") {
      triageTest = "(" + t("runScenario.impressionOfColposcopy") + ")";
    } else if (results.screentest[1] === "colposcopyWithBiopsy") {
      triageTest = "(" + t("runScenario.colposcopyWithBiopsy") + ")";
    } else {
      triageTest = "";
    }

    if (results.screentest[2] === "pap") {
      diagnosisTest = "(" + t("runScenario.PapTest") + ")";
    } else if (results.screentest[2] === "ivaa") {
      diagnosisTest = "(" + t("runScenario.VIA") + ")";
    } else if (results.screentest[2] === "hpv") {
      diagnosisTest = "(" + t("runScenario.HPV") + ")";
    } else if (results.screentest[2] === "hpv16or18") {
      diagnosisTest = "(" + t("runScenario.HPV1618") + ")";
    } else if (results.screentest[2] === "colposcopicImpression") {
      diagnosisTest = "(" + t("runScenario.impressionOfColposcopy") + ")";
    } else if (results.screentest[2] === "colposcopyWithBiopsy") {
      diagnosisTest = "(" + t("runScenario.colposcopyWithBiopsy") + ")";
    } else {
      diagnosisTest = "";
    }
  } else {
    t("results.screenTreatment");
    if (results.screentest[0] === "pap") {
      screenTest = "(" + t("runScenario.PapTest") + ")";
    } else if (results.screentest[0] === "ivaa") {
      screenTest = "(" + t("runScenario.VIA") + ")";
    } else if (results.screentest[0] === "hpv") {
      screenTest = "(" + t("runScenario.HPV") + ")";
    } else if (results.screentest[0] === "hpv16or18") {
      screenTest = "(" + t("runScenario.HPV1618") + ")";
    } else {
      screenTest = "";
    }
  }

  const treatedIndex = results.totalNeeded.length - 1;
  let totalNeededToScreen,
    totalNeededToTriage,
    totalNeededToDiagnosticTriage,
    totalNeededToTreat;

  totalNeededToScreen =
    results.totalNeeded[0] !== undefined && !isNaN(results.totalNeeded[0])
      ? Math.round(results.totalNeeded[0]).toLocaleString(locale)
      : "N/A";

  totalNeededToTriage =
    results.scenario === "ScreenTreat"
      ? "N/A"
      : results.scenario === "ScreenTriageDiagnosticTestTreat"
      ? results.totalNeeded[treatedIndex - 2] !== undefined &&
        !isNaN(results.totalNeeded[treatedIndex - 2])
        ? Math.round(results.totalNeeded[treatedIndex - 2]).toLocaleString(
            locale
          )
        : "N/A"
      : results.totalNeeded[treatedIndex - 1] !== undefined &&
        !isNaN(results.totalNeeded[treatedIndex - 1])
      ? Math.round(results.totalNeeded[treatedIndex - 1]).toLocaleString(locale)
      : "N/A";

  totalNeededToDiagnosticTriage =
    results.scenario === "ScreenTreat"
      ? "N/A"
      : results.scenario === "ScreenTriageDiagnosticTestTreat"
      ? results.totalNeeded[treatedIndex - 1] !== undefined &&
        !isNaN(results.totalNeeded[treatedIndex - 1])
        ? Math.round(results.totalNeeded[treatedIndex - 1]).toLocaleString(
            locale
          )
        : "N/A"
      : "N/A";

  totalNeededToTreat =
    results.totalNeeded[treatedIndex] !== undefined &&
    !isNaN(results.totalNeeded[treatedIndex])
      ? Math.round(results.totalNeeded[treatedIndex]).toLocaleString(locale)
      : "N/A";

  function saveScenario() {
    const filename = `${params.scenario} ${getTimestamp()}.scenario`;
    const type = "text/plain;charset=utf-8";
    const contents = JSON.stringify(params);
    saveAs(new Blob([contents]), filename, { type });
  }

  async function exportResults() {
    const filename = `${params.scenario} ${getTimestamp()}.pdf`;
    const nodes = Array.from(document.querySelectorAll("[data-export]"));
    exportPdf(filename, nodes);
  }

  function exportResultsExcel() {
    const filename = `${params.scenario} ${getTimestamp()}.xlsx`;
    exportExcel(filename);
  }
  //export chart to SVG
  function handleExportSvg(id) {
    const plotSelector = `#${id}`;
    const fileName = `${results.scenario}_${id}.svg`;
    exportSvg(plotSelector, fileName);
  }

  d3.select("#savePNG0").on("click", function () {
    saveChartAsPNG(
      pieChartId,
      `${results.scenario}_${pieChartId}`,
      barChartTitle
    );
  });

  d3.select("#savePNG1").on("click", function () {
    saveChartAsPNG(
      barChartId,
      `${results.scenario}_${barChartId}`,
      barChartTitle
    );
  });

  d3.select("#savePNG2").on("click", function () {
    saveChartAsPNG(
      ScreentestBarChartId,
      `${results.scenario}_${ScreentestBarChartId}`,
      pieChartTitle1
    );
  });

  if (!params || !results) {
    return null;
    //return <Navigate to="/run-scenario" />;
  }

  return (
    <div>
      {/* <Container style={{ overflow: "auto", maxHeight: "100vh" }}> */}
      <Container>
        <Card className="mb-4 d-none">
          <Card.Header>
            <Card.Title data-export>
              {asLabel(params.scenario, scenarios)}
            </Card.Title>
            <Card.Text className="small text-muted">
              Scenario Assumptions
            </Card.Text>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={6}>
                <Table hover responsive data-export>
                  <thead>
                    <tr className="bg-grey">
                      <th>{t("runScenario.epidemiological")}</th>
                      {/* Placeholder th simplifies pdf export (consistent row lengths) */}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{t("runScenario.numPeople")}</th>
                      <td className="text-end text-nowrap">
                        {params.populationSize?.toLocaleString(locale) ?? "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("runScenario.prevelance")}</th>
                      <td className="text-end text-nowrap">
                        {asPercent(params.cinPrevalence, 0) ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <Table hover responsive data-export>
                  <thead>
                    <tr className="bg-grey">
                      <th> {t("runScenario.participationTitle")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th> {t("runScenario.intervalofCervicalInYears")}</th>
                      <td className="text-end text-nowrap">
                        {params.screeningInterval?.toLocaleString(locale) ??
                          "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("runScenario.percentScreeningCoverage")}</th>
                      <td className="text-end text-nowrap">
                        {asPercent(params.percentScreened, 0) ?? "N/A"}
                      </td>
                    </tr>
                    {["ScreenTriageDiagnosticTestTreat"].includes(
                      params.scenario
                    ) && (
                      <tr>
                        <th>
                          {t("runScenario.percentScreeningPositiveWithTriage")}
                        </th>
                        <td className="text-end text-nowrap">
                          {asPercent(params.percentTriaged, 0) ?? "N/A"}
                        </td>
                      </tr>
                    )}
                    {[
                      "ScreenDiagnosticTestTreat",
                      "ScreenTriageDiagnosticTestTreat",
                    ].includes(params.scenario) && (
                      <tr>
                        <th>
                          {
                            {
                              ScreenDiagnosticTestTreat:
                                "Percent of screen positives with triage/diagnostic test",
                              ScreenTriageDiagnosticTestTreat:
                                "Percent of triage positives with diagnostic test",
                            }[params.scenario]
                          }
                        </th>
                        <td className="text-end text-nowrap">
                          {asPercent(params.percentDiagnosticTriaged, 0) ??
                            "N/A"}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th>
                        {
                          {
                            ScreenTreat: "Percent of screen positives treated",
                            ScreenDiagnosticTestTreat:
                              "Percent of triage/diagnostic test positives treated",
                            ScreenTriageDiagnosticTestTreat:
                              "Percent of diagnostic test positives treated",
                          }[params.scenario]
                        }
                      </th>
                      <td className="text-end text-nowrap">
                        {asPercent(params.percentTreated, 0) ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col lg={6}>
                <Table hover responsive data-export>
                  <thead>
                    <tr className="bg-grey">
                      <th>{t("runScenario.screeningAndTreatmentTitle")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.screeningTest && (
                      <>
                        <tr className="table-light">
                          <th>
                            {t("runScenario.cervicalScreeningTestChosen")}
                          </th>
                          <td className="text-end text-nowrap">
                            {asLabel(params.screeningTest, screeningTests) ??
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-3">
                            {t("runScenario.screeningTestSenvitivity")}
                          </th>
                          <td className="text-end text-nowrap">
                            {asPercent(params.screeningTestSensitivity, 0) ??
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-3">
                            {t("runScenario.screeningTestSpecificity")}
                          </th>
                          <td className="text-end text-nowrap">
                            {asPercent(params.screeningTestSpecificity, 0) ??
                              "N/A"}
                          </td>
                        </tr>
                      </>
                    )}

                    {params.triageTest && (
                      <>
                        <tr className="table-light">
                          <th>
                            {t("runScenario.triageOrDiagnosticTestChosen")}
                          </th>
                          <td className="text-end text-nowrap">
                            {asLabel(params.triageTest, triageTests) ?? "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-3">
                            {t("runScenario.triageOrDiagnosticTestSensitivity")}
                          </th>
                          <td className="text-end text-nowrap">
                            {asPercent(params.triageTestSensitivity, 0) ??
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-3">
                            {t("runScenario.triageOrDiagnosticTestSpecificity")}
                          </th>
                          <td className="text-end text-nowrap">
                            {asPercent(params.triageTestSpecificity, 0) ??
                              "N/A"}
                          </td>
                        </tr>
                      </>
                    )}

                    {params.diagnosticTest && (
                      <>
                        <tr className="table-light">
                          <th> {t("runScenario.diagnosticTestChosen")}</th>
                          <td className="text-end text-nowrap">
                            {asLabel(params.diagnosticTest, diagnosticTests) ??
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-3">
                            {t("runScenario.diagnosticTestSensitivity")}
                          </th>
                          <td className="text-end text-nowrap">
                            {asPercent(params.diagnosticTestSensitivity, 0) ??
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-3">
                            {t("runScenario.diagnosticTestSpecificity")}
                          </th>
                          <td className="text-end text-nowrap">
                            {asPercent(params.diagnosticTestSpecificity, 0) ??
                              "N/A"}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <Card.Title>{chartTiles}</Card.Title>
          </Card.Header>
          <Card.Body className="pt-1">
            <h2 className="text-center h5">{barChartTitle}</h2>
            <Row>
              <Col md={6}>
                <BarChart
                  id={ScreentestBarChartId}
                  data={[
                    {
                      label: "Screening Test",
                      value:
                        parseInt(totalNeededToScreen.replace(/,/g, "")) || 0,
                    },
                  ]}
                  color="#95f4a2" // Set the color to blue
                  //layout={{ width: 450, height: 350 * 1.5 }} // Adjust the width and height as needed
                />
                <Col md={12} className="d-flex justify-content-center ">
                  <Button
                    variant="link"
                    onClick={() => handleExportSvg(ScreentestBarChartId)}
                  >
                    {t("general.exportSVG")}
                  </Button>
                  <Button variant="link" id="savePNG2" className="savePNG">
                    {t("general.exportPNG")}
                  </Button>
                </Col>
              </Col>

              <Col md={6}>
                <BarChart
                  id={barChartId}
                  data={[
                    {
                      label: "Triage Test",
                      value:
                        parseInt(totalNeededToTriage.replace(/,/g, "")) || 0,
                    },
                    {
                      label: "Diagnostic Test",
                      value:
                        parseInt(
                          totalNeededToDiagnosticTriage.replace(/,/g, "")
                        ) || 0,
                    },
                    {
                      label: "Treatment",
                      value:
                        parseInt(totalNeededToTreat.replace(/,/g, "")) || 0,
                    },
                  ]}
                  color="#0DAB61"
                  //layout={{ width: 450, height: 350 - 50 }} // Adjust the width and height as needed
                />
                <Col md={12} className="d-flex justify-content-center ">
                  <Button
                    variant="link"
                    onClick={() => handleExportSvg(barChartId)}
                  >
                    {t("general.exportSVG")}
                  </Button>
                  <Button variant="link" id="savePNG1" className="savePNG">
                    {t("general.exportPNG")}
                  </Button>
                </Col>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <h2 className="text-center h5">{pieChartTitle1}</h2>
                <PieChart
                  id={pieChartId}
                  data={[
                    {
                      label: "% Precancers Missed",
                      value: +results.numberPrecancersMissed,
                    },
                    {
                      label: "% Precancers Treated",
                      value: +results.testedPositives[treatedIndex + 1],
                    },
                  ]}
                  colors={["#D13C4B", "#FD7E14"]} // Pass the custom color palette to the PieChart component
                />
                <Col md={12} className="d-flex justify-content-center">
                  <Button
                    variant="link"
                    onClick={() => handleExportSvg(pieChartId)}
                  >
                    {t("general.exportSVG")}
                  </Button>
                  <Button variant="link" id="savePNG0" className="savePNG">
                    {t("general.exportPNG")}
                  </Button>
                </Col>
              </Col>
              <Col md={6}>
                <h2 className="text-center h5">{pieChartTitle2}</h2>
                <PieChart
                  id={pieChartId}
                  data={[
                    {
                      label: "Population Not Not-Overtreated",
                      value: +results.testedFalsePositives[0],
                    },
                    {
                      label: "% Precancers Over-Treated",
                      value: +results.healthyOvertreated,
                    },
                  ]}
                  colors={["#f7b885", "#FD7E14"]} // Pass the custom color palette to the PieChart component
                />
                <Col md={12} className="d-flex justify-content-center">
                  <Button
                    variant="link"
                    onClick={() => handleExportSvg(pieChartId)}
                  >
                    {t("general.exportSVG")}
                  </Button>
                  <Button variant="link" id="savePNG0" className="savePNG">
                    {t("general.exportPNG")}
                  </Button>
                </Col>
              </Col>
            </Row>
            <Row className="mt-3"></Row>
          </Card.Body>
        </Card>

        {/* pdf page break */}
        <hr className="d-none" data-export />

        <Card className="mb-4">
          <Card.Body>
            <Table hover responsive data-export>
              <thead>
                <tr className="bg-info text-light">
                  <th>{t("results.annualTargets")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-info">
                  <th>{t("results.populationTargetedWithCoverageTitle")}</th>
                  <td className="text-end text-nowrap">
                    {" "}
                    {results.populationTargeted !== undefined &&
                    !isNaN(results.populationTargeted)
                      ? Math.round(results.populationTargeted).toLocaleString(
                          locale
                        )
                      : "N/A"}
                  </td>
                </tr>
                <tr className="table-info">
                  <th className="ps-3">
                    {t("results.populationTargetedWithoutPrecancer")}
                  </th>
                  <td className="text-end text-nowrap">
                    {/* {results.healthyWomenTargetedForScreening?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}
                    {results.testedFalsePositives[0] !== undefined &&
                    !isNaN(results.testedFalsePositives[0])
                      ? Math.round(
                          results.testedFalsePositives[0]
                        ).toLocaleString(locale)
                      : "N/A"}
                  </td>
                </tr>
                <tr className="table-info">
                  <th className="ps-3">
                    {t("results.populationTargetedWithPrecancer")}
                  </th>
                  <td className="text-end text-nowrap">
                    {/* {results.precancersTargetedForScreening?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}
                    {results.testedTruePositives[0] !== undefined &&
                    !isNaN(results.testedTruePositives[0])
                      ? Math.round(
                          results.testedTruePositives[0]
                        ).toLocaleString(locale)
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </Table>

            <Table hover responsive data-export>
              <thead>
                <tr className="bg-warning text-light">
                  <th>{t("results.impactOnCervicalPrecancerTitle")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-warning">
                  <th>{t("results.percentPrecancersTreated")}</th>
                  <td className="text-end text-nowrap">
                    {asPercent(results.percentPrecancersTreated) ?? "N/A"}
                  </td>
                </tr>
                <tr className="table-warning">
                  <th>{t("results.percentPolulationTargetedOverTreated")}</th>
                  <td className="text-end text-nowrap">
                    {asPercent(results.percentHealthyOvertreated) ?? "N/A"}
                  </td>
                </tr>
              </tbody>
            </Table>

            <Table hover responsive data-export>
              <thead>
                <tr className="bg-danger text-light">
                  <th>{t("results.missedPrecancersTitle")}</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-danger">
                  <th>{t("results.totalPrecancersMissed")}</th>
                  <td className="text-end text-nowrap">
                    {asPercent(results.percentPrecancersMissed) ?? "N/A"}
                  </td>
                  <td className="text-end text-nowrap">
                    {results.numberPrecancersMissed !== undefined &&
                    !isNaN(results.numberPrecancersMissed)
                      ? Math.round(
                          results.numberPrecancersMissed
                        ).toLocaleString(locale)
                      : "N/A"}
                  </td>
                </tr>
                <tr className="table-danger">
                  <th>{t("results.sourcesMissedPrecancers")}</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr className="table-light">
                  <th className="ps-3">
                    {t("results.didNotHaveScreeningTest")} {screenTest}
                  </th>
                  <td className="text-end text-nowrap">
                    {/* {asPercent(results.percentMissedDueToNoScreening) ?? "N/A"} */}
                    {asPercent(results.percentMissed[0]) ?? "N/A"}
                  </td>
                  <td className="text-end text-nowrap">
                    {/* {results.numberMissedDueToNoScreening?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}
                    {results.untestedPositives[1] !== undefined &&
                    !isNaN(results.untestedPositives[1])
                      ? Math.round(results.untestedPositives[1]).toLocaleString(
                          locale
                        )
                      : "N/A"}
                  </td>
                </tr>
                <tr className="table-light">
                  <th className="ps-3">
                    {t("results.sensitivityOfScreeningTest")} {screenTest}
                  </th>
                  <td className="text-end text-nowrap">
                    {/* {asPercent(
                      results.percentMissedDueToSensitivityOfScreeningTest
                    ) ?? "N/A"} */}
                    {asPercent(results.percentMissedDueToSensitivity[0]) ??
                      "N/A"}
                  </td>
                  <td className="text-end text-nowrap">
                    {/* {results.numberMissedDueToSensitivityOfScreeningTest?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}
                    {results.testedFalseNegatives[1] !== undefined &&
                    !isNaN(results.testedFalseNegatives[1])
                      ? Math.round(
                          results.testedFalseNegatives[1]
                        ).toLocaleString(locale)
                      : "N/A"}
                  </td>
                </tr>

                <tr className="table-light">
                  <th className="ps-3">
                    {t("results.lossAtTriageTest")} {triageTest}
                  </th>
                  <td className="text-end text-nowrap">
                    {/* {asPercent(results.percentMissedDueToLossAtTriage) ?? "N/A"} */}
                    {/* {asPercent(results.percentMissed[1]) ?? "N/A"} */}
                    {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenDiagnosticTestTreat" &&
                        results.checkedValues &&
                        results.checkedValues.length === 2 &&
                        results.checkedValues[1] === "ScreenDiagnosticTestTreat"
                      ? "N/A"
                      : results.scenario === "ScreenTriageDiagnosticTestTreat"
                      ? results.percentMissed[treatedIndex - 2] !== undefined &&
                        !isNaN(results.percentMissed[treatedIndex - 2])
                        ? asPercent(results.percentMissed[treatedIndex - 2])
                        : "N/A"
                      : results.percentMissed[treatedIndex - 1] !== undefined &&
                        !isNaN(results.percentMissed[treatedIndex - 1])
                      ? asPercent(results.percentMissed[treatedIndex - 1])
                      : "N/A"}
                  </td>
                  <td className="text-end text-nowrap">
                    {/* {results.numberMissedDueToLossAtTriage?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}
                    {/* {results.untestedPositives[2]?.toLocaleString(locale) ??
                      "N/A"} */}
                    {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenDiagnosticTestTreat" &&
                        results.checkedValues &&
                        results.checkedValues.length === 2 &&
                        results.checkedValues[1] === "ScreenDiagnosticTestTreat"
                      ? "N/A"
                      : results.scenario === "ScreenTriageDiagnosticTestTreat"
                      ? results.untestedPositives[treatedIndex - 1] !==
                          undefined &&
                        !isNaN(results.untestedPositives[treatedIndex - 1])
                        ? Math.round(
                            results.untestedPositives[treatedIndex - 1]
                          ).toLocaleString(locale)
                        : "N/A"
                      : results.untestedPositives[treatedIndex] !== undefined &&
                        !isNaN(results.untestedPositives[treatedIndex])
                      ? Math.round(
                          results.untestedPositives[treatedIndex]
                        ).toLocaleString(locale)
                      : "N/A"}
                  </td>
                </tr>

                <tr className="table-light">
                  <th className="ps-3">
                    {t("results.sensitivityOfTriageTest")} {triageTest}
                  </th>
                  <td className="text-end text-nowrap">
                    {/* {asPercent(
                      results.percentMissedDueToSensitivityOfTriageTest
                    ) ?? "N/A"} */}
                    {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenDiagnosticTestTreat" &&
                        results.checkedValues &&
                        results.checkedValues.length === 2 &&
                        results.checkedValues[1] === "ScreenDiagnosticTestTreat"
                      ? "N/A"
                      : results.scenario === "ScreenTriageDiagnosticTestTreat"
                      ? results.percentMissedDueToSensitivity[
                          treatedIndex - 2
                        ] !== undefined &&
                        !isNaN(
                          results.percentMissedDueToSensitivity[
                            treatedIndex - 2
                          ]
                        )
                        ? asPercent(
                            results.percentMissedDueToSensitivity[
                              treatedIndex - 2
                            ]
                          )
                        : "NA"
                      : results.percentMissedDueToSensitivity[
                          treatedIndex - 1
                        ] !== undefined &&
                        !isNaN(
                          results.percentMissedDueToSensitivity[
                            treatedIndex - 1
                          ]
                        )
                      ? asPercent(
                          results.percentMissedDueToSensitivity[
                            treatedIndex - 1
                          ]
                        )
                      : "N/A"}
                  </td>
                  <td className="text-end text-nowrap">
                    {/* {results.numberMissedDueToSensitivityOfTriageTest?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}
                    {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenDiagnosticTestTreat" &&
                        results.checkedValues &&
                        results.checkedValues.length === 2 &&
                        results.checkedValues[1] === "ScreenDiagnosticTestTreat"
                      ? "N/A"
                      : results.scenario === "ScreenTriageDiagnosticTestTreat"
                      ? results.testedFalseNegatives[treatedIndex - 1] !==
                          undefined &&
                        !isNaN(results.testedFalseNegatives[treatedIndex - 1])
                        ? Math.round(
                            results.testedFalseNegatives[treatedIndex - 1]
                          ).toLocaleString(locale)
                        : "N/A"
                      : results.testedFalseNegatives[treatedIndex] !==
                          undefined &&
                        !isNaN(results.testedFalseNegatives[treatedIndex])
                      ? Math.round(
                          results.testedFalseNegatives[treatedIndex]
                        ).toLocaleString(locale)
                      : "N/A"}
                  </td>
                </tr>

                <tr className="table-light">
                  <th className="ps-3">
                    {t("results.lossAtDiagnosis")} {diagnosisTest}
                  </th>
                  <td className="text-end text-nowrap">
                    {/* {asPercent(
                      results.percentMissedDueToLossAtDiagnosticTriage
                    ) ?? "N/A"} */}
                    {/* {asPercent(results.percentMissed[3]) ?? "N/A"} */}
                    {/* {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenTriageDiagnosticTestTreat"
                      ? results.percentMissed[treatedIndex - 1] !== undefined &&
                        !isNaN(results.percentMissed[treatedIndex - 1])
                        ? asPercent(results.percentMissed[treatedIndex - 1])
                        : "N/A"
                      : "N/A"} */}
                    {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenDiagnosticTestTreat" &&
                        results.checkedValues &&
                        results.checkedValues.length === 2 &&
                        results.checkedValues[1] === "ScreenDiagnosticTestTreat"
                      ? results.percentMissed[treatedIndex - 1] !== undefined &&
                        !isNaN(results.percentMissed[treatedIndex - 1])
                        ? asPercent(results.percentMissed[treatedIndex - 1])
                        : "N/A"
                      : results.scenario ===
                          "ScreenTriageDiagnosticTestTreat" &&
                        results.percentMissed[treatedIndex - 1] !== undefined &&
                        !isNaN(results.percentMissed[treatedIndex - 1])
                      ? asPercent(results.percentMissed[treatedIndex - 1])
                      : "N/A"}
                  </td>
                  <td className="text-end text-nowrap">
                    {/* {results.numberMissedDueToLossAtDiagnosticTriage?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}
                    {/* {results.untestedPositives[4]?.toLocaleString(locale) ??
                      "N/A"} */}
                    {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenDiagnosticTestTreat" &&
                        results.checkedValues &&
                        results.checkedValues.length === 2 &&
                        results.checkedValues[1] === "ScreenDiagnosticTestTreat"
                      ? Math.round(
                          results.untestedPositives[treatedIndex]
                        ).toLocaleString(locale)
                      : results.scenario === "ScreenTriageDiagnosticTestTreat"
                      ? results.untestedPositives[treatedIndex] !== undefined &&
                        !isNaN(results.untestedPositives[treatedIndex])
                        ? Math.round(
                            results.untestedPositives[treatedIndex]
                          ).toLocaleString(locale)
                        : "N/A"
                      : "N/A"}
                  </td>
                </tr>

                <tr className="table-light">
                  <th className="ps-3">
                    {t("results.sensitivityOfDiagnosticTest")} {diagnosisTest}
                  </th>
                  <td className="text-end text-nowrap">
                    {/* {asPercent(
                      results.percentMissedDueToSensitivityOfDiagnosticTriageTest
                    ) ?? "N/A"} */}

                    {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenDiagnosticTestTreat" &&
                        results.checkedValues &&
                        results.checkedValues.length === 2 &&
                        results.checkedValues[1] === "ScreenDiagnosticTestTreat"
                      ? asPercent(
                          results.percentMissedDueToSensitivity[
                            treatedIndex - 1
                          ]
                        )
                      : results.scenario === "ScreenTriageDiagnosticTestTreat"
                      ? results.percentMissedDueToSensitivity[
                          treatedIndex - 1
                        ] !== undefined &&
                        !isNaN(
                          results.percentMissedDueToSensitivity[
                            treatedIndex - 1
                          ]
                        )
                        ? asPercent(
                            results.percentMissedDueToSensitivity[
                              treatedIndex - 1
                            ]
                          )
                        : "N/A"
                      : "N/A"}
                  </td>
                  <td className="text-end text-nowrap">
                    {/* {results.numberMissedDueToSensitivityOfDiagnosticTriageTest?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}

                    {results.scenario === "ScreenTreat"
                      ? "N/A"
                      : results.scenario === "ScreenDiagnosticTestTreat" &&
                        results.checkedValues &&
                        results.checkedValues.length === 2 &&
                        results.checkedValues[1] === "ScreenDiagnosticTestTreat"
                      ? Math.round(
                          results.testedFalseNegatives[treatedIndex]
                        ).toLocaleString(locale)
                      : results.scenario === "ScreenTriageDiagnosticTestTreat"
                      ? results.testedFalseNegatives[treatedIndex] !==
                          undefined &&
                        !isNaN(results.testedFalseNegatives[treatedIndex])
                        ? Math.round(
                            results.testedFalseNegatives[treatedIndex]
                          ).toLocaleString(locale)
                        : "N/A"
                      : "N/A"}
                  </td>
                </tr>

                <tr className="table-light">
                  <th className="ps-3">{t("results.lossAtTreatment")}</th>
                  <td className="text-end text-nowrap">
                    {/* {asPercent(results.percentMissedDueToLossAtTreatment) ??
                      "N/A"} */}
                    {asPercent(results.percentMissed[treatedIndex]) ?? "N/A"}
                  </td>
                  <td className="text-end text-nowrap">
                    {/* {results.numberMissedDueToLossAtTreatment?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}
                    {results.untestedPositives[treatedIndex + 1] !==
                      undefined &&
                    !isNaN(results.untestedPositives[treatedIndex + 1])
                      ? Math.round(
                          results.untestedPositives[treatedIndex + 1]
                        ).toLocaleString(locale)
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </Table>

            <Table hover responsive data-export>
              <thead>
                <tr className="bg-success text-light">
                  <th>{t("results.AnnualImpactOnResourcesTitle")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-light">
                  <th>{t("results.totalRequiringScreeningTest")}</th>
                  <td className="text-end text-nowrap">
                    {/* {results.totalNeededToScreen?.toLocaleString(locale) ??
                      "N/A"} */}

                    {totalNeededToScreen}
                  </td>
                </tr>
                <tr className="table-light">
                  <th>{t("results.totalRequiringTriageDiagnosticTest")}</th>
                  <td className="text-end text-nowrap">
                    {/* {results.totalNeededToTriage?.toLocaleString(locale) ??
                      "N/A"} */}

                    {totalNeededToTriage}
                  </td>
                </tr>
                <tr className="table-light">
                  <th>{t("results.totalRequiringDiagnosticTest")}</th>
                  <td className="text-end text-nowrap">
                    {/* {results.totalNeededToDiagnosticTriage?.toLocaleString(
                      locale
                    ) ?? "N/A"} */}

                    {totalNeededToDiagnosticTriage}
                  </td>
                </tr>
                <tr className="table-light">
                  <th>{t("results.totalRequiringTreatment")}</th>
                  <td className="text-end text-nowrap">
                    {/* {results.totalNeededToTreat?.toLocaleString(locale) ??
                      "N/A"} */}

                    {totalNeededToTreat}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <div className="text-center">
          {/* <Link className="btn btn-outline-primary text-decoration-none m-1" to="/run-scenario">
            Back to Scenario
          </Link> */}
          <Button onClick={saveScenario} className="m-1" variant="primary">
            {t("results.saveScenario")}
          </Button>
          <Button onClick={exportResults} className="m-1" variant="primary">
            {t("results.exportResultsToPDF")}
          </Button>
          <Button
            onClick={exportResultsExcel}
            className="m-1"
            variant="primary"
          >
            {t("results.exportResultsToExcel")}
          </Button>
        </div>
      </Container>
    </div>
  );
}
