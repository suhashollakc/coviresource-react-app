import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import "./InfoBox.css";
function InfoBox({title, cases, active, total, ...props}) {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} `}onClick = {props.onClick}>
            
            <CardContent>
            
            <Typography className="infoBox__title" color="textSecondary">
                {title}
                </Typography>
              
               
                <h2 className="infoBox__cases">{cases} <span className="">new cases</span></h2>
             
                <Typography className="infoBox__total" color="textSecondary">
                Total Cases: {total} 
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
