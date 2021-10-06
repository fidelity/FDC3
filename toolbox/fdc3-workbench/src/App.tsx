import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Grid, Paper, Tabs, Tab, Typography, Link } from "@material-ui/core";
import { observer } from "mobx-react";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import "normalize.css";
import "@fontsource/roboto";
import "@fontsource/source-code-pro";
import { TabPanel } from "./components/common/TabPanel";
import { Header } from "./components/Header";
import { Channels } from "./components/Channels";
import { Workbench } from "./components/Workbench/Workbench";
import { ContextCreate } from "./components/ContextCreate";
import { Intents } from "./components/Intents";
import snackbarStore from "./store/SnackbarStore";
import "./App.css";
import { fdc3Ready } from "@finos/fdc3";

const mainTheme = createTheme({
	palette: {
		primary: {
			light: "#005d85",
			main: "#0086bf",
			dark: "#339ecb",
			contrastText: "#fff",
		},
	},
});

mainTheme.typography.h4 = {
	fontFamily: "Source Code Pro",
	fontSize: "20px",
	color: "#0086bf",
	paddingLeft: "4px",
	paddingBottom: "11px",
};

mainTheme.typography.h5 = {
	fontSize: "16px",
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		"@global": {
			".MuiFormHelperText-contained.Mui-error": {
				position: "absolute",
				marginLeft: "9px",
				bottom: "-11px",
				padding: "0 4px",
				backgroundColor: theme.palette.common.white,
			},
			".MuiButton-contained": {
				boxShadow: "none",
			},
		},
		root: {
			flexGrow: 1,
		},
		header: {
			marginBottom: theme.spacing(2),
		},
		body: {
			padding: theme.spacing(1),
			height: "100%",
		},
		paper: {
			marginTop: theme.spacing(2),
			padding: theme.spacing(2),
			height: "100%",
			"&:first-child": {
				marginTop: 0,
			},
		},
		tabs: {
			borderBottomColor: "#acb2c0",
			borderBottomStyle: "solid",
			borderBottomWidth: "1px",
			minHeight: "28px",
			"& [aria-selected='true']": {
				backgroundColor: "rgba(0, 134, 191, 0.21)",
			},
		},
		tabIndicator: {
			backgroundColor: "rgba(0, 134, 191, 0.21)",
		},
		indicator: {
			backgroundColor: "#00bbe1",
		},
		footer: {
			fontSize: "10px",
			fontStyle: "italic",
			color: "#5b606f",
			flexDirection: "row",
			justifyContent: "center",
			margin: theme.spacing(2),
			"& *:first-child": {
				paddingTop: "27px",
			},
		},
		link: {
			color: "#5b606f",
			fontWeight: "bold",
			"&:hover": {
				color: "#5b606f",
			},
		},
		code: {
			fontFamily: "courier, courier new, serif",
		},
	})
);

const openAPIDocs = (event: React.MouseEvent<HTMLElement>) => {
	event.preventDefault();
	window.open("https://fdc3.finos.org/docs/api/overview", "FDC3ApiDocs");
	return false;
};

const openSpecAccessDocs = (event: React.MouseEvent<HTMLElement>) => {
	event.preventDefault();
	window.open("https://fdc3.finos.org/docs/api/spec#api-access", "FDC3ApiDocs");
	return false;
};

export const App = observer(() => {
	const classes = useStyles();
	const [fdc3Available, setFdc3Available] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);

	const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
		setTabIndex(newIndex);
	};

	const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
		// Need to show close animation
		setTimeout(() => snackbarStore.clearSnackbarData(), 500);
	};

	//check if the FDC3 API is available so we know whether to render
	useEffect(() => {
		(async () => {
			try {
				await fdc3Ready(5000);
				setFdc3Available(true);
			} catch (e) {}
		})();

		//check window.fdc3 as the FDC3 import will override fdc3
		// if (typeof window.fdc3.broadcast != "undefined") {
		// 	setFdc3Available(true);
		// } else {
		// 	window.addEventListener("fdc3Ready", () => {setFdc3Available(true);});
		// }
	}, []);

	useEffect(() => {
		setOpenSnackbar(!!snackbarStore.snackbarData);
	}, [snackbarStore.snackbarData]);

	return (
		<ThemeProvider theme={mainTheme}>
			<Grid className={classes.root} container>
				<Grid className={classes.header} container item xs={12}>
					<Header fdc3Available={fdc3Available} />
				</Grid>
				{fdc3Available ? (
					<Grid className={classes.body} container spacing={2} item xs={12} style={{ marginLeft: "0px" }}>
						<Grid item xs={8} style={{ flex: 1 }}>
							<Paper className={classes.paper}>
								<Typography variant="h4">{`{workbench}`}</Typography>
								<Tabs
									value={tabIndex}
									indicatorColor="primary"
									onChange={handleTabChange}
									variant="scrollable"
									scrollButtons="auto"
									className={classes.tabs}
									classes={{
										indicator: classes.indicator,
									}}
								>
									<Tab label="System Channels" />
									<Tab label="Context" />
									<Tab label="Intent" />
								</Tabs>
								<TabPanel value={tabIndex} index={0}>
									<Channels />
								</TabPanel>
								<TabPanel value={tabIndex} index={1}>
									<ContextCreate />
								</TabPanel>
								<TabPanel value={tabIndex} index={2}>
									<Intents />
								</TabPanel>
							</Paper>
						</Grid>

						<Grid item xs={4}>
							<Paper className={classes.paper}>
								<Workbench />
							</Paper>
						</Grid>
					</Grid>
				) : (
					<Grid className={classes.body} container spacing={2} item xs={12} style={{ marginLeft: "0px" }}>
						<Grid container direction="column" justifyContent="center" alignItems="center" spacing={2} item xs={12}>
							<Paper className={classes.paper}>
								<Typography variant="h4">FDC3 API not detected!</Typography>
								<Typography variant="body1">
									An FDC3 desktop agent implementation was not found at{" "}
									<span className={classes.code}>window.fdc3</span>.
								</Typography>
								<Typography variant="body1">
									See the{" "}
									<Link
										className={classes.link}
										href="https://fdc3.finos.org/docs/api/spec#api-access"
										onClick={openSpecAccessDocs}
									>
										FDC3 standard documentation
									</Link>{" "}
									for more details.
								</Typography>
							</Paper>
						</Grid>
					</Grid>
				)}

				<Grid container item xs={12} className={classes.footer}>
					<Typography variant="body1">
						Learn more about the{" "}
						<Link className={classes.link} href="https://fdc3.finos.org/docs/api/overview" onClick={openAPIDocs}>
							FDC3 Standard and APIs
						</Link>{" "}
						| Proud member of the{" "}
						<Link className={classes.link} href="https://www.finos.org/">
							Fintech Open Source Foundation
						</Link>{" "}
						| Copyright © 2021 Cosaic, inc. &amp; Contributors to the FDC3 standards project
					</Typography>
				</Grid>
			</Grid>

			<Snackbar key={snackbarStore.snackbarData?.id} open={openSnackbar} autoHideDuration={4000} onClose={handleClose}>
				<Alert elevation={6} variant="filled" onClose={handleClose} severity={snackbarStore.snackbarData?.type}>
					{snackbarStore.snackbarData?.message}
				</Alert>
			</Snackbar>
		</ThemeProvider>
	);
});

export default App;