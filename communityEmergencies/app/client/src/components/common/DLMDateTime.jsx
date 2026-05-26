import React from "react";
import { Text } from "react-native";

const DLMDateTime = ({
                         date,
                     }) => {

    const formatDate = (dateString) => {

        const parsedDate = new Date(dateString);

        const day = parsedDate.getDate();

        const getOrdinal = (n) => {

            if (n > 3 && n < 21) {
                return "th";
            }

            switch (n % 10) {
                case 1:
                    return "st";

                case 2:
                    return "nd";

                case 3:
                    return "rd";

                default:
                    return "th";
            }
        };

        const month = parsedDate.toLocaleString("en-US", {
            month: "long",
        });

        const year = parsedDate.getFullYear();

        const time = parsedDate.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        return `${day}${getOrdinal(day)} ${month}, ${year} ${time}`;
    };

    return (
        <>
            {formatDate(date)}
        </>
    );
};

export default DLMDateTime;