import React from 'react'
import styles from "./styles.js"



function ToolBar() {
    const classes = styles()
    return (
        <div className={classes.toolbar}>
            Toolbar
        </div>
    )
}

export default ToolBar
