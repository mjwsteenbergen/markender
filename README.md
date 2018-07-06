# md-report-components
WebComponents to enhance your reports


# Useful regex
`!\[([^\|\]]*)\|?([^\]]+)?\]\(([^\)]+)\)`
to
`<md-img id='$1' src='$3' alt='$2'></md-img>`