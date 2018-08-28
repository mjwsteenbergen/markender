
export function getBasicStyle(): string {
    return /* css */ `
    
@media screen {
    #markenderContent {
        max-width: 720px;
        margin-left: auto;
        margin-right: auto;
    }

    body {
        /* padding: 0; */
        padding-left: 26px;
        padding-right: 26px;
        margin: 0;
    }
}

    pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }

p {
    word-wrap: break-word;
}

table, th, td {
    border: 1px solid black;
    padding-left: 5px;
    padding-right: 5px;
}

table {
    border-collapse: collapse;
    margin-left: auto;
    margin-right: auto;
    page-break-inside: avoid;   
}


.task-list-item {
    list-style-type: none;
}

en-todo {
    /* ;
    width: 13px;
    height: 13px;
    display: inline-block;
    background-size: contain;
    vertical-align: middle; */
}

en-todo::before {
  content: "☐";
  margin-left: -20px;
}

en-todo[checked='true']::before {
  content: "🗹";
}



`
}