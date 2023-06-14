export const scenarios = [
  { value: "ScreenTreat", label: "Screening Test", strategy: "Screening" },
  {
    value: "ScreenDiagnosticTestTreat",
    label: "Diagnostic Test",
    strategy: "Diagnosis",
  },
  {
    value: "ScreenTriageDiagnosticTestTreat",
    label: "Triage Test",
    strategy: "Triage",
  },
];

export const screeningTests = [
  { value: "pap", label: "Pap test" },
  { value: "ivaa", label: "VIA (IVAA)" },
  { value: "hpv", label: "HPV" },
  { value: "hpv16or18", label: "HPV16/18" },
];

export const triageTests = [
  { value: "pap", label: "Pap test" },
  { value: "ivaa", label: "VIA (IVAA)" },
  { value: "hpv16or18", label: "HPV16/18" },
  { value: "colposcopicImpression", label: "Impression of colposcopy" },
  { value: "colposcopyWithBiopsy", label: "Colposcopy with Biopsy" },
];

export const diagnosticTests = [
  { value: "colposcopicImpression", label: "Impression of colposcopy" },
  { value: "colposcopyWithBiopsy", label: "Colposcopy with Biopsy" },
];

export const tests = {
  ivaa: {
    sensitivity: 60,
    specificity: 84,
  },
  pap: {
    sensitivity: 60,
    specificity: 91,
  },
  hpv: {
    sensitivity: 90,
    specificity: 89,
  },
  colposcopyWithBiopsy: {
    sensitivity: 65,
    specificity: 85,
  },
  hpv16or18: {
    sensitivity: 60,
    specificity: 75,
  },
  colposcopicImpression: {
    sensitivity: 70,
    specificity: 75,
  },
};

// export function runModel(params) {
//   console.log("params RUN MODEL", params);
//   switch (params?.scenario) {
//     case "ScreenDiagnosticTestTreat":
//       return runScreenDiagnosticTestTreatModel(params);
//     case "ScreenTreat":
//       return runScreenTreatModel(params);
//     case "ScreenTriageDiagnosticTestTreat":
//       return runScreenTriageDiagnosticTestTreatModel(params);
//     default:
//       return null;
//   }
// }

export function runModel(params) {
  console.log("params RUN MODEL", params);
  const populationSize = parseInt(params.populationSize, 10);
  const screeningInterval = parseInt(params.screeningInterval, 10);
  const cinPrevalence = parseInt(params.cinPrevalence, 10) / 100;
  let coverage = [];
  let sensitivity = [];
  let specificity = [];
  coverage[0] = 0;
  coverage[1] = parseInt(params?.percentScreened, 10) / 100 || 0;
  sensitivity[0] = parseInt(params?.screeningTestSensitivity, 10) / 100 || 0;
  specificity[0] = parseInt(params?.screeningTestSpecificity, 10) / 100 || 0;
  if (params.scenario === "ScreenDiagnosticTestTreat") {
    console.log("STAGE 2-----");
    coverage[2] = parseInt(params?.percentDiagnosticTriaged, 10) / 100 || 0;
    coverage[3] = parseInt(params?.percentTreated, 10) / 100 || 0;
    sensitivity[1] = parseInt(params?.triageTestSensitivity, 10) / 100 || 0;
    specificity[1] = parseInt(params?.triageTestSpecificity, 10) / 100 || 0;
  } else if (params.scenario === "ScreenTriageDiagnosticTestTreat") {
    console.log("STAGE 3-----");
    coverage[2] = parseInt(params?.percentTriaged, 10) / 100 || 0;
    coverage[3] = parseInt(params?.percentDiagnosticTriaged, 10) / 100 || 0;
    coverage[4] = parseInt(params?.percentTreated, 10) / 100 || 0;
    sensitivity[1] = parseInt(params?.triageTestSensitivity, 10) / 100 || 0;
    specificity[1] = parseInt(params?.triageTestSpecificity, 10) / 100 || 0;
    sensitivity[2] = parseInt(params?.diagnosticTestSensitivity, 10) / 100 || 0;
    specificity[2] = parseInt(params?.diagnosticTestSpecificity, 10) / 100 || 0;
  } else {
    coverage[2] = parseInt(params?.percentTreated, 10) / 100 || 0;
  }

  console.log("populationSize", populationSize);
  console.log("screeningInterval", screeningInterval);
  console.log("cinPrevalence", cinPrevalence);
  console.log("coverage", coverage);
  console.log("sensitivity", sensitivity);
  console.log("specificity", specificity);

  return calculateValues(
    populationSize,
    screeningInterval,
    cinPrevalence,
    coverage,
    sensitivity,
    specificity
  );
}

export function runScreenDiagnosticTestTreatModel({
  populationSize,
  screeningInterval,
  cinPrevalence,
  percentScreened,
  percentDiagnosticTriaged,
  percentTriaged,
  percentTreated,
  screeningTestSensitivity,
  screeningTestSpecificity,
  triageTestSensitivity,
  triageTestSpecificity,
}) {
  cinPrevalence /= 100;
  percentScreened /= 100; //coverage[1]
  percentTriaged /= 100; //coverage[]
  percentDiagnosticTriaged /= 100;
  percentTreated /= 100;
  screeningTestSensitivity /= 100;
  screeningTestSpecificity /= 100;
  triageTestSensitivity /= 100;
  triageTestSpecificity /= 100;

  percentTriaged = percentDiagnosticTriaged;

  console.log("populationSize ", populationSize);
  console.log("screeningInterval ", screeningInterval);
  console.log("cinPrevalence ", cinPrevalence);
  console.log("percentScreened ", percentScreened);
  console.log("percentTreated ", percentTreated);
  console.log("percentDiagnosticTriaged ", percentDiagnosticTriaged);
  console.log("percentTriaged ", percentTriaged);
  console.log("screeningTestSensitivity ", screeningTestSensitivity);
  console.log("screeningTestSpecificity ", screeningTestSpecificity);
  console.log("triageTestSensitivity", triageTestSensitivity);
  console.log("triageTestSpecificity, ", triageTestSpecificity);

  // target population
  //testedFalsePositives[0]
  const healthyWomenTargetedForScreening =
    (populationSize / screeningInterval) * (1 - cinPrevalence);
  console.log("testedFalsePositives[0]]", healthyWomenTargetedForScreening);
  //testedTruePositives[0]
  const precancersTargetedForScreening =
    (populationSize / screeningInterval) * cinPrevalence;
  console.log("testedTruePositives[0]", precancersTargetedForScreening);

  // screened population
  //untestedPositives[1]
  const unscreenedPrecancers =
    precancersTargetedForScreening * (1 - percentScreened);
  //testedNegatives[1]
  const screenedHealthy = healthyWomenTargetedForScreening * percentScreened;
  //testedPositives[1]
  const screenedWithPrecancer =
    precancersTargetedForScreening * percentScreened;
  //testedFalseNegatives[1]
  const screenedFalseNegatives =
    screenedWithPrecancer * (1 - screeningTestSensitivity);
  // testedTrueNegatives[1]
  const screenedTrueNegatives = screenedHealthy * screeningTestSpecificity;
  //testedTruePositives[1]
  const screenedTruePositives =
    screenedWithPrecancer * screeningTestSensitivity;
  //testedFalsePositives[1]
  const screenedFalsePositives =
    screenedHealthy * (1 - screeningTestSpecificity);

  // diagnostic triaged population
  //untestedPositives[2]
  const lostToFollowUpAtTriage = screenedTruePositives * (1 - percentTriaged);
  //testedNegatives[2]
  const triagedHealthy = screenedFalsePositives * percentTriaged;
  //testedPositives[2]
  const triagedWithPrecancer = screenedTruePositives * percentTriaged;
  //testedFalseNegatives[2]
  const triagedFalseNegatives =
    triagedWithPrecancer * (1 - triageTestSensitivity);
  //testedTrueNegatives[2]
  const triagedTrueNegatives = triagedHealthy * triageTestSpecificity;
  //testedTruePositives[2]
  const triagedTruePositives = triagedWithPrecancer * triageTestSensitivity;
  //testedFalsePositives[2]
  const triagedFalsePositives = triagedHealthy * (1 - triageTestSpecificity);

  // treated population
  //untestedPositives[3]
  const lostToFollowUpAtTreatment = triagedTruePositives * (1 - percentTreated);
  //testedNegatives[3]
  const treatedHealthy = triagedFalsePositives * percentTreated;
  //testedPositives[3]
  const treatedWithPrecancer = triagedTruePositives * percentTreated;

  // impact on disease
  const percentPrecancersTreated =
    (100 * treatedWithPrecancer) / precancersTargetedForScreening;
  const percentHealthyOvertreated =
    (100 * treatedHealthy) / healthyWomenTargetedForScreening;

  // sources of missed precancers
  const numberMissedDueToNoScreening = unscreenedPrecancers;
  const numberMissedDueToSensitivityOfScreeningTest = screenedFalseNegatives;
  const numberMissedDueToLossAtTriage = lostToFollowUpAtTriage;
  const numberMissedDueToSensitivityOfTriageTest = triagedFalseNegatives;
  const numberMissedDueToLossAtTreatment = lostToFollowUpAtTreatment;
  const numberPrecancersMissed =
    numberMissedDueToNoScreening +
    numberMissedDueToSensitivityOfScreeningTest +
    numberMissedDueToLossAtTriage +
    numberMissedDueToSensitivityOfTriageTest +
    numberMissedDueToLossAtTreatment;
  console.log("____numberPrecancersMissed", numberPrecancersMissed);

  const percentMissedDueToNoScreening =
    (100 * unscreenedPrecancers) / numberPrecancersMissed;
  const percentMissedDueToSensitivityOfScreeningTest =
    (100 * screenedFalseNegatives) / numberPrecancersMissed;
  const percentMissedDueToLossAtTriage =
    (100 * lostToFollowUpAtTriage) / numberPrecancersMissed;
  const percentMissedDueToSensitivityOfTriageTest =
    (100 * triagedFalseNegatives) / numberPrecancersMissed;
  const percentMissedDueToLossAtTreatment =
    (100 * lostToFollowUpAtTreatment) / numberPrecancersMissed;
  const percentPrecancersMissed =
    (100 * numberPrecancersMissed) / precancersTargetedForScreening;

  // impact on resources
  const totalNeededToScreen = screenedHealthy + screenedWithPrecancer;
  const totalNeededToTriage = triagedHealthy + triagedWithPrecancer;
  const totalNeededToTreat = treatedHealthy + treatedWithPrecancer;

  const results = {
    healthyWomenTargetedForScreening: Math.round(
      healthyWomenTargetedForScreening
    ),
    precancersTargetedForScreening: Math.round(precancersTargetedForScreening),

    unscreenedPrecancers: Math.round(unscreenedPrecancers),
    screenedHealthy: Math.round(screenedHealthy),
    screenedWithPrecancer: Math.round(screenedWithPrecancer),
    screenedFalseNegatives: Math.round(screenedFalseNegatives),
    screenedTrueNegatives: Math.round(screenedTrueNegatives),
    screenedTruePositives: Math.round(screenedTruePositives),
    screenedFalsePositives: Math.round(screenedFalsePositives),

    lostToFollowUpAtTriage: Math.round(lostToFollowUpAtTriage),
    triagedHealthy: Math.round(triagedHealthy),
    triagedWithPrecancer: Math.round(triagedWithPrecancer),
    triagedFalseNegatives: Math.round(triagedFalseNegatives),
    triagedTrueNegatives: Math.round(triagedTrueNegatives),
    triagedTruePositives: Math.round(triagedTruePositives),
    triagedFalsePositives: Math.round(triagedFalsePositives),

    lostToFollowUpAtTreatment: Math.round(lostToFollowUpAtTreatment),
    treatedHealthy: Math.round(treatedHealthy),
    treatedWithPrecancer: Math.round(treatedWithPrecancer),

    percentPrecancersTreated: percentPrecancersTreated,
    percentHealthyOvertreated: percentHealthyOvertreated,

    percentMissedDueToNoScreening: percentMissedDueToNoScreening,
    percentMissedDueToSensitivityOfScreeningTest:
      percentMissedDueToSensitivityOfScreeningTest,
    percentMissedDueToLossAtTriage: percentMissedDueToLossAtTriage,
    percentMissedDueToSensitivityOfTriageTest:
      percentMissedDueToSensitivityOfTriageTest,
    percentMissedDueToLossAtTreatment: percentMissedDueToLossAtTreatment,
    percentPrecancersMissed: percentPrecancersMissed,

    numberMissedDueToNoScreening: Math.round(numberMissedDueToNoScreening),
    numberMissedDueToSensitivityOfScreeningTest: Math.round(
      numberMissedDueToSensitivityOfScreeningTest
    ),
    numberMissedDueToLossAtTriage: Math.round(numberMissedDueToLossAtTriage),
    numberMissedDueToSensitivityOfTriageTest: Math.round(
      numberMissedDueToSensitivityOfTriageTest
    ),
    numberMissedDueToLossAtTreatment: Math.round(
      numberMissedDueToLossAtTreatment
    ),
    numberPrecancersMissed: Math.round(numberPrecancersMissed),

    totalNeededToScreen: Math.round(totalNeededToScreen),
    totalNeededToTriage: Math.round(totalNeededToTriage),
    totalNeededToTreat: Math.round(totalNeededToTreat),
  };

  return results;
}

export function runScreenTreatModel({
  populationSize,
  screeningInterval,
  cinPrevalence,
  percentScreened,
  percentTreated,
  screeningTestSensitivity,
  screeningTestSpecificity,
}) {
  cinPrevalence /= 100;
  percentScreened /= 100; //coverage[0]
  percentTreated /= 100;
  screeningTestSensitivity /= 100;
  screeningTestSpecificity /= 100;
  console.log("populationSize ", populationSize);
  console.log("screeningInterval ", screeningInterval);
  console.log("cinPrevalence ", cinPrevalence);
  console.log("percentScreened ", percentScreened);
  console.log("percentTreated ", percentTreated);
  console.log("screeningTestSensitivity ", screeningTestSensitivity);
  console.log("screeningTestSpecificity ", screeningTestSpecificity);

  // target population
  //testedFalsePositives[0]
  const healthyWomenTargetedForScreening =
    (populationSize / screeningInterval) * (1 - cinPrevalence);
  //testedTruePositives[0]
  const precancersTargetedForScreening =
    (populationSize / screeningInterval) * cinPrevalence;

  // screened population
  //untestedPositives[1]
  const unscreenedPrecancers =
    precancersTargetedForScreening * (1 - percentScreened);
  //testedNegatives[1]
  const screenedHealthy = healthyWomenTargetedForScreening * percentScreened;
  //testedPositives[1]
  const screenedWithPrecancer =
    precancersTargetedForScreening * percentScreened;
  //testedFalseNegatives[1]
  const screenedFalseNegatives =
    screenedWithPrecancer * (1 - screeningTestSensitivity);
  //testedTrueNegatives[1]
  const screenedTrueNegatives = screenedHealthy * screeningTestSpecificity;
  //testedTruePositives[1]
  const screenedTruePositives =
    screenedWithPrecancer * screeningTestSensitivity;
  //testedFalsePositives[1]
  const screenedFalsePositives =
    screenedHealthy * (1 - screeningTestSpecificity);

  // treated population
  //untestedPositives[2]
  const lostToFollowUpAtTreatment =
    screenedTruePositives * (1 - percentTreated);
  //testedNegatives[2]
  const treatedHealthy = screenedFalsePositives * percentTreated;
  //testedPositives[2]
  const treatedWithPrecancer = screenedTruePositives * percentTreated;

  // impact on disease
  const percentPrecancersTreated =
    (100 * treatedWithPrecancer) / precancersTargetedForScreening;
  const percentHealthyOvertreated =
    (100 * treatedHealthy) / healthyWomenTargetedForScreening;

  // sources of missed precancers
  const numberMissedDueToNoScreening = unscreenedPrecancers;
  const numberMissedDueToSensitivityOfScreeningTest = screenedFalseNegatives;
  const numberMissedDueToLossAtTreatment = lostToFollowUpAtTreatment;
  const numberPrecancersMissed =
    numberMissedDueToNoScreening +
    numberMissedDueToSensitivityOfScreeningTest +
    numberMissedDueToLossAtTreatment;

  const percentMissedDueToNoScreening =
    (100 * unscreenedPrecancers) / numberPrecancersMissed;
  const percentMissedDueToSensitivityOfScreeningTest =
    (100 * screenedFalseNegatives) / numberPrecancersMissed;
  const percentMissedDueToLossAtTreatment =
    (100 * lostToFollowUpAtTreatment) / numberPrecancersMissed;
  const percentPrecancersMissed =
    (100 * numberPrecancersMissed) / precancersTargetedForScreening;

  // impact on resources
  const totalNeededToScreen = screenedHealthy + screenedWithPrecancer;
  const totalNeededToTreat = treatedHealthy + treatedWithPrecancer;

  const results = {
    healthyWomenTargetedForScreening: Math.round(
      healthyWomenTargetedForScreening
    ),
    precancersTargetedForScreening: Math.round(precancersTargetedForScreening),

    unscreenedPrecancers: Math.round(unscreenedPrecancers),
    screenedHealthy: Math.round(screenedHealthy),
    screenedWithPrecancer: Math.round(screenedWithPrecancer),
    screenedFalseNegatives: Math.round(screenedFalseNegatives),
    screenedTrueNegatives: Math.round(screenedTrueNegatives),
    screenedTruePositives: Math.round(screenedTruePositives),
    screenedFalsePositives: Math.round(screenedFalsePositives),

    lostToFollowUpAtTreatment: Math.round(lostToFollowUpAtTreatment),
    treatedHealthy: Math.round(treatedHealthy),
    treatedWithPrecancer: Math.round(treatedWithPrecancer),

    percentPrecancersTreated: percentPrecancersTreated,
    percentHealthyOvertreated: percentHealthyOvertreated,

    percentMissedDueToNoScreening: percentMissedDueToNoScreening,
    percentMissedDueToSensitivityOfScreeningTest:
      percentMissedDueToSensitivityOfScreeningTest,
    percentMissedDueToLossAtTreatment: percentMissedDueToLossAtTreatment,
    percentPrecancersMissed: percentPrecancersMissed,

    numberMissedDueToNoScreening: Math.round(numberMissedDueToNoScreening),
    numberMissedDueToSensitivityOfScreeningTest: Math.round(
      numberMissedDueToSensitivityOfScreeningTest
    ),
    numberMissedDueToLossAtTreatment: Math.round(
      numberMissedDueToLossAtTreatment
    ),
    numberPrecancersMissed: Math.round(numberPrecancersMissed),

    totalNeededToScreen: Math.round(totalNeededToScreen),
    totalNeededToTreat: Math.round(totalNeededToTreat),
  };

  return results;
}

export function runScreenTriageDiagnosticTestTreatModel({
  populationSize,
  screeningInterval,
  cinPrevalence,
  percentScreened,
  percentTriaged,
  percentDiagnosticTriaged,
  percentTreated,
  screeningTestSensitivity,
  screeningTestSpecificity,
  triageTestSensitivity,
  triageTestSpecificity,
  diagnosticTestSensitivity,
  diagnosticTestSpecificity,
}) {
  cinPrevalence /= 100;
  percentScreened /= 100;
  percentTriaged /= 100;
  percentDiagnosticTriaged /= 100;
  percentTreated /= 100;
  screeningTestSensitivity /= 100;
  screeningTestSpecificity /= 100;
  triageTestSensitivity /= 100;
  triageTestSpecificity /= 100;
  diagnosticTestSensitivity /= 100;
  diagnosticTestSpecificity /= 100;

  // target population
  //testedFalsePositives[0]
  const healthyWomenTargetedForScreening =
    (populationSize / screeningInterval) * (1 - cinPrevalence);
  //testedTruePositives[0]
  const precancersTargetedForScreening =
    (populationSize / screeningInterval) * cinPrevalence;

  // screened population
  //untestedPositives[1]
  const unscreenedPrecancers =
    precancersTargetedForScreening * (1 - percentScreened);
  //testedNegatives[1]
  const screenedHealthy = healthyWomenTargetedForScreening * percentScreened;
  //testedPositives[1]
  const screenedWithPrecancer =
    precancersTargetedForScreening * percentScreened;
  //testedFalseNegatives[1]
  const screenedFalseNegatives =
    screenedWithPrecancer * (1 - screeningTestSensitivity);
  //testedFalseNegatives[1]
  const screenedTrueNegatives = screenedHealthy * screeningTestSpecificity;
  //testedTruePositives[1]
  const screenedTruePositives =
    screenedWithPrecancer * screeningTestSensitivity;
  //testedFalsePositives[1]
  const screenedFalsePositives =
    screenedHealthy * (1 - screeningTestSpecificity);

  // triaged population
  //untestedPositives[2]
  const lostToFollowUpAtTriage = screenedTruePositives * (1 - percentTriaged);
  //testedNegatives[2]
  const triagedHealthy = screenedFalsePositives * percentTriaged;
  //testedPositives[2]
  const triagedWithPrecancer = screenedTruePositives * percentTriaged;
  //testedFalseNegatives[2]
  const triagedFalseNegatives =
    triagedWithPrecancer * (1 - triageTestSensitivity);
  //testedTrueNegatives[2]
  const triagedTrueNegatives = triagedHealthy * triageTestSpecificity;
  //testedTruePositives[2]
  const triagedTruePositives = triagedWithPrecancer * triageTestSensitivity;
  //testedFalsePositives[2]
  const triagedFalsePositives = triagedHealthy * (1 - triageTestSpecificity);

  // diagnostic triaged population
  //untestedPositives[3]
  const lostToFollowUpAtDiagnosticTriage =
    triagedTruePositives * (1 - percentDiagnosticTriaged);
  //testedNegatives[3]
  const diagnosticTriagedHealthy =
    triagedFalsePositives * percentDiagnosticTriaged;
  //testedPositives[3]
  const diagnosticTriagedWithPrecancer =
    triagedTruePositives * percentDiagnosticTriaged;
  //testedFalseNegatives[3]
  const diagnosticTriagedFalseNegatives =
    diagnosticTriagedWithPrecancer * (1 - diagnosticTestSensitivity);
  //testedTrueNegatives[3]
  const diagnosticTriagedTrueNegatives =
    diagnosticTriagedHealthy * diagnosticTestSpecificity;
  //testedTruePositives[3]
  const diagnosticTriagedTruePositives =
    diagnosticTriagedWithPrecancer * diagnosticTestSensitivity;
  //testedFalsePositives[3]
  const diagnosticTriagedFalsePositives =
    diagnosticTriagedHealthy * (1 - diagnosticTestSpecificity);

  // treated population
  //untestedPositives[4]
  const lostToFollowUpAtTreatment =
    diagnosticTriagedTruePositives * (1 - percentTreated);
  //testedNegatives[4]
  const treatedHealthy = diagnosticTriagedFalsePositives * percentTreated;
  //testedPositives[4]
  const treatedWithPrecancer = diagnosticTriagedTruePositives * percentTreated;

  // impact on disease
  const percentPrecancersTreated =
    (100 * treatedWithPrecancer) / precancersTargetedForScreening;
  const percentHealthyOvertreated =
    (100 * treatedHealthy) / healthyWomenTargetedForScreening;

  // sources of missed precancers
  const numberMissedDueToNoScreening = unscreenedPrecancers;
  const numberMissedDueToSensitivityOfScreeningTest = screenedFalseNegatives;
  const numberMissedDueToLossAtTriage = lostToFollowUpAtTriage;
  const numberMissedDueToSensitivityOfTriageTest = triagedFalseNegatives;
  const numberMissedDueToLossAtDiagnosticTriage =
    lostToFollowUpAtDiagnosticTriage;
  const numberMissedDueToSensitivityOfDiagnosticTriageTest =
    diagnosticTriagedFalseNegatives;
  const numberMissedDueToLossAtTreatment = lostToFollowUpAtTreatment;
  const numberPrecancersMissed =
    numberMissedDueToNoScreening +
    numberMissedDueToSensitivityOfScreeningTest +
    numberMissedDueToLossAtTriage +
    numberMissedDueToSensitivityOfTriageTest +
    numberMissedDueToLossAtDiagnosticTriage +
    numberMissedDueToSensitivityOfDiagnosticTriageTest +
    numberMissedDueToLossAtTreatment;

  const percentMissedDueToNoScreening =
    (100 * unscreenedPrecancers) / numberPrecancersMissed;
  const percentMissedDueToSensitivityOfScreeningTest =
    (100 * screenedFalseNegatives) / numberPrecancersMissed;
  const percentMissedDueToLossAtTriage =
    (100 * lostToFollowUpAtTriage) / numberPrecancersMissed;
  const percentMissedDueToSensitivityOfTriageTest =
    (100 * triagedFalseNegatives) / numberPrecancersMissed;
  const percentMissedDueToLossAtDiagnosticTriage =
    (100 * lostToFollowUpAtDiagnosticTriage) / numberPrecancersMissed;
  const percentMissedDueToSensitivityOfDiagnosticTriageTest =
    (100 * diagnosticTriagedFalseNegatives) / numberPrecancersMissed;
  const percentMissedDueToLossAtTreatment =
    (100 * lostToFollowUpAtTreatment) / numberPrecancersMissed;
  const percentPrecancersMissed =
    (100 * numberPrecancersMissed) / precancersTargetedForScreening;

  // impact on resources
  const totalNeededToScreen = screenedHealthy + screenedWithPrecancer;
  const totalNeededToTriage = triagedHealthy + triagedWithPrecancer;
  const totalNeededToDiagnosticTriage =
    diagnosticTriagedHealthy + diagnosticTriagedWithPrecancer;
  const totalNeededToTreat = treatedHealthy + treatedWithPrecancer;

  const results = {
    healthyWomenTargetedForScreening: Math.round(
      healthyWomenTargetedForScreening
    ),
    precancersTargetedForScreening: Math.round(precancersTargetedForScreening),

    unscreenedPrecancers: Math.round(unscreenedPrecancers),
    screenedHealthy: Math.round(screenedHealthy),
    screenedWithPrecancer: Math.round(screenedWithPrecancer),
    screenedFalseNegatives: Math.round(screenedFalseNegatives),
    screenedTrueNegatives: Math.round(screenedTrueNegatives),
    screenedTruePositives: Math.round(screenedTruePositives),
    screenedFalsePositives: Math.round(screenedFalsePositives),

    lostToFollowUpAtTriage: Math.round(lostToFollowUpAtTriage),
    triagedHealthy: Math.round(triagedHealthy),
    triagedWithPrecancer: Math.round(triagedWithPrecancer),
    triagedFalseNegatives: Math.round(triagedFalseNegatives),
    triagedTrueNegatives: Math.round(triagedTrueNegatives),
    triagedTruePositives: Math.round(triagedTruePositives),
    triagedFalsePositives: Math.round(triagedFalsePositives),

    lostToFollowUpAtDiagnosticTriage: Math.round(
      lostToFollowUpAtDiagnosticTriage
    ),
    diagnosticTriagedHealthy: Math.round(diagnosticTriagedHealthy),
    diagnosticTriagedWithPrecancer: Math.round(diagnosticTriagedWithPrecancer),
    diagnosticTriagedFalseNegatives: Math.round(
      diagnosticTriagedFalseNegatives
    ),
    diagnosticTriagedTrueNegatives: Math.round(diagnosticTriagedTrueNegatives),
    diagnosticTriagedTruePositives: Math.round(diagnosticTriagedTruePositives),
    diagnosticTriagedFalsePositives: Math.round(
      diagnosticTriagedFalsePositives
    ),

    lostToFollowUpAtTreatment: Math.round(lostToFollowUpAtTreatment),
    treatedHealthy: Math.round(treatedHealthy),
    treatedWithPrecancer: Math.round(treatedWithPrecancer),

    percentPrecancersTreated: percentPrecancersTreated,
    percentHealthyOvertreated: percentHealthyOvertreated,

    percentMissedDueToNoScreening: percentMissedDueToNoScreening,
    percentMissedDueToSensitivityOfScreeningTest:
      percentMissedDueToSensitivityOfScreeningTest,
    percentMissedDueToLossAtTriage: percentMissedDueToLossAtTriage,
    percentMissedDueToSensitivityOfTriageTest:
      percentMissedDueToSensitivityOfTriageTest,
    percentMissedDueToLossAtDiagnosticTriage:
      percentMissedDueToLossAtDiagnosticTriage,
    percentMissedDueToSensitivityOfDiagnosticTriageTest:
      percentMissedDueToSensitivityOfDiagnosticTriageTest,
    percentMissedDueToLossAtTreatment: percentMissedDueToLossAtTreatment,
    percentPrecancersMissed: percentPrecancersMissed,

    numberMissedDueToNoScreening: Math.round(numberMissedDueToNoScreening),
    numberMissedDueToSensitivityOfScreeningTest: Math.round(
      numberMissedDueToSensitivityOfScreeningTest
    ),
    numberMissedDueToLossAtTriage: Math.round(numberMissedDueToLossAtTriage),
    numberMissedDueToSensitivityOfTriageTest: Math.round(
      numberMissedDueToSensitivityOfTriageTest
    ),
    numberMissedDueToLossAtDiagnosticTriage: Math.round(
      numberMissedDueToLossAtDiagnosticTriage
    ),
    numberMissedDueToSensitivityOfDiagnosticTriageTest: Math.round(
      numberMissedDueToSensitivityOfDiagnosticTriageTest
    ),
    numberMissedDueToLossAtTreatment: Math.round(
      numberMissedDueToLossAtTreatment
    ),
    numberPrecancersMissed: Math.round(numberPrecancersMissed),

    totalNeededToScreen: Math.round(totalNeededToScreen),
    totalNeededToTriage: Math.round(totalNeededToTriage),
    totalNeededToDiagnosticTriage: Math.round(totalNeededToDiagnosticTriage),
    totalNeededToTreat: Math.round(totalNeededToTreat),
  };

  return results;
}

export function calculateValues(
  populationSize,
  screeningInterval,
  cinPrevalence,
  coverage,
  sensitivity,
  specificity
) {
  const stages = sensitivity.length;
  console.log("STAGEs", stages);

  const testedFalsePositives = [];
  const testedTruePositives = [];
  const untestedPositives = [];
  const testedNegatives = [];
  const testedPositives = [];
  const testedFalseNegatives = [];
  const testedTrueNegatives = [];

  untestedPositives[0] = 0;
  testedNegatives[0] = 0;
  testedPositives[0] = 0;
  testedFalseNegatives[0] = 0;
  testedTrueNegatives[0] = 0;

  // Stage 0 (initial conditions)
  testedFalsePositives[0] =
    (populationSize / screeningInterval) * (1 - cinPrevalence);
  testedTruePositives[0] = (populationSize / screeningInterval) * cinPrevalence;

  //coverage[1] = percentScreened
  //coverage[2] =  -- If DIAGNOSIS => percentDiagnosticTriaged , else percentTriaged.
  //coverage[3] = -- If Triage => percentTriaged
  //coverage[4] = percentTreated -- always the last one
  console.log("coverage", coverage);

  //sensitivity[0] - screening
  //sensitivity[1] - diagnosis
  //sensitivity[2] - triage

  for (let stage = 1; stage <= stages; stage++) {
    untestedPositives[stage] =
      testedTruePositives[stage - 1] * (1 - coverage[stage]);
    testedNegatives[stage] = testedFalsePositives[stage - 1] * coverage[stage];
    testedPositives[stage] = testedTruePositives[stage - 1] * coverage[stage];
    testedFalseNegatives[stage] =
      testedPositives[stage] * (1 - sensitivity[stage - 1]);
    testedTrueNegatives[stage] =
      testedNegatives[stage] * specificity[stage - 1];
    testedTruePositives[stage] =
      testedPositives[stage] * sensitivity[stage - 1];
    testedFalsePositives[stage] =
      testedNegatives[stage] * (1 - specificity[stage - 1]);
  }
  console.log("coverage[stages + 1] --- ", coverage[stages + 1]);
  //treaeted
  untestedPositives[stages + 1] =
    testedTruePositives[stages] * (1 - coverage[stages + 1]); //treated is the last one

  testedNegatives[stages + 1] =
    testedFalsePositives[stages] * coverage[stages + 1];
  testedPositives[stages + 1] =
    testedTruePositives[stages] * coverage[stages + 1];

  // impact on disease
  const percentPrecancersTreated =
    (100 * testedPositives[stages + 1]) / testedTruePositives[0];
  const percentHealthyOvertreated =
    (100 * testedNegatives[stages + 1]) / testedFalsePositives[0];

  let numberPrecancersMissed = 0;

  for (let stage = 1; stage <= stages; stage++) {
    numberPrecancersMissed += untestedPositives[stage];
    numberPrecancersMissed += testedFalseNegatives[stage];
  }

  numberPrecancersMissed += untestedPositives[stages + 1];

  // const percentMissedDueToNoScreening =
  //   (100 * untestedPositives[1]) / numberPrecancersMissed;
  // const percentMissedDueToSensitivityOfScreeningTest =
  //   (100 * testedFalseNegatives[1]) / numberPrecancersMissed;
  // const percentMissedDueToLossAtTriage =
  //   (100 * untestedPositives[2]) / numberPrecancersMissed;
  // const percentMissedDueToSensitivityOfTriageTest =
  //   (100 * testedFalseNegatives[2]) / numberPrecancersMissed;
  // const percentMissedDueToLossAtDiagnosticTriage =
  //   (100 * untestedPositives[3]) / numberPrecancersMissed;
  // const percentMissedDueToSensitivityOfDiagnosticTriageTest =
  //   (100 * testedFalseNegatives[3]) / numberPrecancersMissed;
  // const percentMissedDueToLossAtTreatment =
  //   (100 * untestedPositives[4]) / numberPrecancersMissed;
  // const percentPrecancersMissed =
  //   (100 * numberPrecancersMissed) / testedTruePositives[0];

  const percentMissed = [];
  const percentMissedDueToSensitivity = [];
  const totalNeeded = [];

  for (let stage = 1; stage <= stages; stage++) {
    const percentMissedDueToNoScreening =
      (100 * untestedPositives[stage]) / numberPrecancersMissed;
    const percentMissedDueToSensitivityOfScreeningTest =
      (100 * testedFalseNegatives[stage]) / numberPrecancersMissed;
    const totalNeededToScreen = testedNegatives[stage] + testedPositives[stage];

    percentMissed.push(percentMissedDueToNoScreening);
    percentMissedDueToSensitivity.push(
      percentMissedDueToSensitivityOfScreeningTest
    );
    totalNeeded.push(totalNeededToScreen);
  }

  const percentMissedDueToLossAtTreatment =
    (100 * untestedPositives[stages + 1]) / numberPrecancersMissed;
  console.log(
    "percentMissedDueToLossAtTreatment",
    percentMissedDueToLossAtTreatment
  );

  percentMissed.push(percentMissedDueToLossAtTreatment); // the last number is percent precancers treated
  const totalNeededToTreat = testedNegatives[4] + testedPositives[4];
  totalNeeded.push(totalNeededToTreat);

  const percentPrecancersMissed =
    (100 * numberPrecancersMissed) / testedTruePositives[0];

  // impact on resources
  // const totalNeededToScreen = testedNegatives[1] + testedPositives[1];
  // const totalNeededToTriage = testedNegatives[2] + testedPositives[2];
  // const totalNeededToDiagnosticTriage = testedNegatives[3] + testedPositives[3];
  // const totalNeededToTreat = testedNegatives[4] + testedPositives[4];

  return {
    testedTrueNegatives,
    testedFalsePositives,
    untestedPositives,
    testedNegatives,
    testedPositives,
    testedFalseNegatives,
    testedTruePositives,
    percentPrecancersTreated,
    percentHealthyOvertreated,
    numberPrecancersMissed,
    percentMissed,
    percentMissedDueToSensitivity,
    percentPrecancersMissed,
    totalNeeded, //last one
  };
}
