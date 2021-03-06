import { createStyles } from '@material-ui/core/styles'

export const borderColor = 'rgb(0, 0, 0, 0.18)'

const styles = (theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    container: {
      marginTop: '0 !important',
      marginBottom: '0 !important',
      minHeight: '100vh',
    },
    leftPanelGrid: {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
    leftPanelCard: {
      height: '100%',
      borderLeft: `1px solid ${borderColor}`,
      borderRight: `1px solid ${borderColor}`,
      '& .fa-star': {
        fontSize: '10px',
      },
      '& .f5': {
        fontSize: '14px',
      },
      '& .right-align': {
        fontSize: '14px',
        '& .smaller2': {
          fontSize: '12px !important',
          fontWeight: 500,
          marginTop: '8px',
        },
      },
    },
    mainPanel: {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
    mainContainer: {
      marginBottom: '0 !important',
    },
    contentContainer: {
      [theme.breakpoints.up('md')]: {
        maxWidth: '70%',
        flexBasis: '70%',
      },
    },
    chartContainer: {},
    widgetContainer: {
      [theme.breakpoints.up('md')]: {
        maxWidth: '30%',
        flexBasis: '30%',
      },
    },
    header: {},
    searchBarCard: {
      backgroundColor: '#f7f8fa', // athens
      border: `1px solid ${borderColor}`,
      height: '60px', // taken from CoinListHeader.js (+! for bottom border)
      display: 'flex',
      alignItems: 'center',
      overflow: 'unset',
      '& .search-field': {
        '& .f5': {
          fontSize: '14px !important',
        },
      },
      [theme.breakpoints.up('md')]: {
        padding: '8px 16px',
      },
    },
    mobileCoinButton: {
      borderRadius: '2px',
      display: 'inline-flex',
      padding: '16px',
      textTransform: 'none',
      background: '#2495ce',
      marginLeft: '16px !important',
      marginRight: '0 !important',
      flex: 0,
    },
    topBarWrapper: {
      border: `1px solid ${borderColor}`,
      marginTop: '-1px !important', // hide top border
    },
    tabsRoot: {
      backgroundColor: '#fff',
    },
    tabRoot: {
      textTransform: 'none',
      minWidth: 'unset',
      fontSize: '14px',
      [theme.breakpoints.down('sm')]: {
        whiteSpace: 'nowrap',
      },
    },
    tabSelected: {
      fontWeight: 600,
    },
    tabLabelContainer: {
      paddingRight: '12px',
      paddingLeft: '12px',
    },
    cardHeader: {
      paddingBottom: 0,
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.87)',
      marginBottom: 0,
    },
    tokenMetricHeader: {
      [theme.breakpoints.up('md')]: {
        '&:first-child': {
          marginTop: '10px',
        },
        '&:not(:first-child)': {
          marginTop: '30px',
        },
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '16px', // container has a -8px margin
        marginTop: '10px',
      },
    },
    tokenMetricHeaderText: {
      fontSize: '20px',
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.87)',
    },
    tokenChartCardContent: {
      padding: '18px 8px 0 0 !important',
    },
    tokenCardContent: {
      padding: '30px 24px !important',
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 0.87)',
    },
    tokenMetricValue: {
      fontSize: '35px',
      fontWeight: 600,
    },
    tokenMetricSubtitle: {
      textAlign: 'center',
      fontSize: '16px',
    },
    progressWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      '& *:not(:first-child)': {
        marginTop: '10px',
      },
    },
    expansionRoot: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
      borderRadius: '2px',
      border: `1px solid ${borderColor}`,
      '&:before': {
        backgroundColor: 'unset',
      },
    },
    expansionDetails: {
      display: 'block',
    },
    subCardHeader: {
      paddingBottom: 0,
      marginBottom: 0,
    },
    subCardTitle: {
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: '16px',
      fontWeight: 500,
    },
    subCardContent: {
      paddingTop: '12px',
    },
    ctaCardContent: {
      padding: '0 !important',
    },
    ctaRoot: {
      fontSize: '16px',
      padding: '30px 20px 25px',
      '& > *': {
        marginBottom: '25px',
      },
    },
    ctaImage: {
      textAlign: 'center',
      '& img': {
        height: '65px',
      },
    },
    ctaTitle: {
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: 500,
    },
    ctaIconContainer: {
      textAlign: 'right',
      paddingRight: '10px',
      alignSelf: 'center',
    },
    ctaIcon: {
      color: '#50ba53',
    },
    ctaButtonContainer: {
      textAlign: 'center',
    },
    ctaButton: {
      textTransform: 'none',
      boxShadow: 'none !important',
      backgroundColor: '#2faeed !important', // sky-blue
      color: '#fff !important',
      fontSize: '16px',
      fontWeight: 600,
    },
    linkListItem: {
      padding: '0',
    },
    linkListText: {
      fontSize: '16px',
    },
  })

export default styles
