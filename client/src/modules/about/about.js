import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import { useTranslation, Trans } from "react-i18next";

export default function About() {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-light py-4">
      <Container>
        <h1 className="text-center h2">{t("about.title")}</h1>
        <Card className="mb-2 mt-2">
          <Card.Body className="pt-2">
            <h4 className="text-center mb-1">
              {t("runScenario.epidemiological")}
            </h4>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>{t("general.parameter")}</th>
                  <th>{t("general.lowValue")}</th>
                  <th>{t("general.highValue")}</th>
                  <th>{t("general.defaultValue")}</th>
                  <th>{t("general.justification")}</th>
                  <th>{t("general.sources")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("runScenario.prevelance")}</td>
                  <td>0%</td>
                  <td>5%</td>
                  <td>2%</td>
                  <td>{t("about.prevalenceJustitication")}</td>
                  <td>
                    <p>{t("about.prevalenceSources0")}</p>
                    <p>{t("about.prevalenceSources1")}</p>
                    <p>{t("about.prevalenceSources2")}</p>
                    <p>{t("about.prevalenceSources3")}</p>
                    <p>{t("about.prevalenceSources4")}</p>
                    <p>{t("about.prevalenceSources5")}</p>
                    <p>{t("about.prevalenceSources6")}</p>
                    <p>{t("about.prevalenceSources7")}</p>
                    <p>{t("about.prevalenceSources8")}</p>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="pt-2">
            <h4 className="text-center mb-1">
              {t("runScenario.participationTitle")}
            </h4>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>{t("general.parameter")}</th>
                  <th>{t("general.lowValue")}</th>
                  <th>{t("general.highValue")}</th>
                  <th>{t("general.defaultValue")}</th>
                  <th>{t("general.justification")}</th>
                  <th>{t("general.sourcesJustification")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("runScenario.intervalofCervicalInYears")}</td>
                  <td>1</td>
                  <td>40</td>
                  <td>5</td>
                  <td>
                    <p>{t("about.intervalofCervicalInYearsJustification0")}</p>
                    <p>{t("about.intervalofCervicalInYearsJustification1")}</p>
                    <p>{t("about.intervalofCervicalInYearsJustification2")}</p>
                    <p>{t("about.intervalofCervicalInYearsJustification3")}</p>
                  </td>
                  <td>
                    <p>{t("about.prevalenceSources3")}</p>
                    <p>{t("about.percentScreeningCoverageSource")}</p>
                  </td>
                </tr>
                <tr>
                  <td>{t("runScenario.percentScreeningCoverage")}</td>
                  <td>0%</td>
                  <td>100%</td>
                  <td>None</td>
                  <td>{t("about.percentScreeningCoverageJustification")}</td>
                  <td></td>
                </tr>

                <tr>
                  <td>{t("runScenario.ScreenDiagnosticTestTreat")}</td>
                  <td>0%</td>
                  <td>100%</td>
                  <td>None</td>
                  <td>
                    {t(
                      "about.percentTriageDiagnosticTestPositivesJustification"
                    )}
                  </td>
                  <td>
                    <p>
                      {t("about.percentTriageDiagnosticTestPositivesSource0")}
                    </p>
                    <p>
                      {t("about.percentTriageDiagnosticTestPositivesSource1")}
                    </p>
                    <p>
                      {t("about.percentTriageDiagnosticTestPositivesSource2")}
                    </p>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="pt-2">
            <h4 className="text-center mb-1">
              {t("runScenario.screeningAndTreatmentTitle")}
            </h4>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>{t("general.testName")}</th>
                  <th>{t("general.defaultSensitivity")}</th>
                  <th>{t("general.defaultSpecificity")}</th>
                  <th>{t("general.justificationText")}t </th>
                  <th>{t("general.sourcesJustification")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("runScenario.PapTest")}</td>
                  <td>61</td>
                  <td>90</td>
                  <td>{t("about.papTestJustification")}</td>
                  <td>
                    <p>{t("about.papTestSource0")}</p>
                    <p>{t("about.papTestSource1")}</p>
                    <p>{t("about.papTestSource2")}</p>
                    <p>{t("about.papTestSource3")}</p>
                    <p>{t("about.papTestSource4")}</p>
                    <p>{t("about.papTestSource5")}</p>
                  </td>
                </tr>
                <tr>
                  <td>{t("runScenario.VIA")} </td>
                  <td>60</td>
                  <td>84</td>
                  <td>{t("about.viaJustification")}</td>
                  <td>
                    <p>{t("about.papTestSource5")}</p>
                    <p>{t("about.papTestSource3")}</p>
                  </td>
                </tr>
                <tr>
                  <td>{t("runScenario.HPV")}</td>
                  <td>90</td>
                  <td>89</td>
                  <td>{t("about.hpvJustification")}</td>
                  <td>
                    <p>{t("about.papTestSource5")}</p>
                    <p>{t("about.papTestSource1")}</p>
                    <p>{t("about.papTestSource3")}</p>
                  </td>
                </tr>
                <tr>
                  <td>{t("runScenario.HPV1618")} </td>
                  <td>60</td>
                  <td>75</td>
                  <td></td>
                  <td>
                    <p>{t("about.papTestSource5")}</p>
                  </td>
                </tr>
                <tr>
                  <td>{t("runScenario.impressionOfColposcopy")}</td>
                  <td>70</td>
                  <td>75</td>
                  <td>{t("about.impressionOfColposcopyJustification")}</td>
                  <td>
                    <p>{t("about.impressionOfColposcopySource")}</p>
                  </td>
                </tr>
                <tr>
                  <td>{t("runScenario.colposcopyWithBiopsy")}</td>
                  <td>65</td>
                  <td>85</td>
                  <td></td>
                  <td>
                    <p>{t("about.impressionOfColposcopySource")}</p>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
