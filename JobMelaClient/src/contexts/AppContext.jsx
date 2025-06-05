import React, { createContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const apiurl = "http://localhost:8000"
    //  const apiurl = "https://47dhks5r-8000.inc1.devtunnels.ms";
    const [cardData, setCardData] = useState([]); // State for card data
    const [alertType, setAlertType] = useState('success'); // State for alert type
    const [alertMessage, setAlertMessage] = useState('Random text'); // State for alert message
    const [open, setOpen] = useState(false); // State for modal visibility
    const [enrolledJobs, setEnrolledJobs] = useState([]); // State for enrolled jobs
    
    const handleClose = () => {
        setOpen(false); // Function to close the modal
    };
    return (
        <AppContext.Provider value={ {apiurl,open,setOpen,alertType,setAlertType,alertMessage,setAlertMessage,handleClose,cardData,setCardData ,enrolledJobs,setEnrolledJobs} }>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;