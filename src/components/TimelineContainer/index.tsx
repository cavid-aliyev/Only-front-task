import React, { useState } from 'react';
import MockData from "../../db/mock-data.json"
import LeftButton from '../../elements/LeftButton';
import RightButton from '../../elements/RightButton';
import EventSlider from '../EventSlider';

interface YearsState {
    start: number | undefined;
    end: number | undefined;
}

const TimelineContainer: React.FC = () => {
    const [years, setYears] = useState<YearsState>({
        start: MockData.at(0)?.active_start_year,
        end: MockData.at(0)?.active_end_year,
    })
    const [yearStep, setYearStep] = useState<number>(0)
    const length: number = MockData.length
    const angle: number = 360 / length
    const timelinePoints = document.getElementsByClassName("timeline-block")

    const handleSelectYears = (direct: string): void => {
        if (direct === "next") {
            setYearStep(prev => prev + 1)
            setYears({
                start: MockData.at(yearStep + 1)?.active_start_year,
                end: MockData.at(yearStep + 1)?.active_end_year,
            })

            Array.from(timelinePoints).forEach((point, i) => {
                const element = point as HTMLElement;
                // Calculate the new rotate value
                const rotateValue = angle * ((i + length) - (yearStep + 2));

                element.style.transform = `rotate(${rotateValue}deg) translate(270px) rotate(-${rotateValue}deg)`
            })
        } else {
            setYearStep(prev => prev - 1)
            setYears({
                start: MockData.at(yearStep - 1)?.active_start_year,
                end: MockData.at(yearStep - 1)?.active_end_year,
            })

            Array.from(timelinePoints).forEach((point, i) => {
                const element = point as HTMLElement;
                // Calculate the new rotate value
                const rotateValue = angle * (i + length - yearStep);

                element.style.transform = `rotate(${rotateValue}deg) translate(270px) rotate(-${rotateValue}deg)`
            })
        }
    }

    const handleSelectPoint = (id: number): void => {
        if (!timelinePoints[id].className.includes("active-point")) {
            setYearStep(id)
            setYears({
                start: MockData.at(id)?.active_start_year,
                end: MockData.at(id)?.active_end_year,
            })
            const activeElId = yearStep
            let distance
            let direction

            if (id < activeElId) {
                distance = activeElId - id
                direction = distance < length / 2 ? false : true
            } else {
                distance = id - activeElId
                direction = distance < length / 2 ? true : false
            }

            Array.from(timelinePoints).forEach((point, i) => {
                const element = point as HTMLElement;

                if (direction) {
                    const rotateValue = angle * (i + length - distance - yearStep - 1);
                    element.style.transform = `rotate(${rotateValue}deg) translate(270px) rotate(-${rotateValue}deg)`
                } else {
                    const rotateValue = angle * (i + length + distance - yearStep - 1);
                    element.style.transform = `rotate(${rotateValue}deg) translate(270px) rotate(-${rotateValue}deg)`
                }
            })
        }
    }

    return (
        <main className='main-container'>
            <div className='desktop-lines horizontal-line' />
            <div className='desktop-lines vertical-line' />
            <div className='title-block'>
                <div className='title-gradient' />
                <h1 className='title pt-sans-bold'>Исторические  <br /> даты</h1>
            </div>
            <div className='display-timeline'>
                <div className="timeline-circle">
                    {MockData.map((e, i) => (
                        <div 
                            key={i}
                            style={{transform: `rotate(${angle * (i + length - 1)}deg) translate(270px) rotate(-${angle * (i + length - 1)}deg)`,
                            }} 
                            className={`timeline-block pt-sans-regular ${yearStep === i && "active-point"}`}
                            onClick={() => handleSelectPoint(i)}
                        >
                            <span className="timeline-point">
                                {i+1}
                            </span>
                            <p className='point-title'>{e.title}</p>
                        </div>
                    ))}
                </div>
                <div className='years-blcok'>
                    <span className='start-year pt-sans-bold'>{years.start}</span>
                    <span className='end-year pt-sans-bold'>{years.end}</span>
                </div>
            </div>
            <div className='timeline-change-container'>
                <div className='timeline-actions'>
                    <span className='timeline-steps pt-sans-regular'>0{yearStep+1}/0{length}</span>
                    <div className='actions-buttons-block'>
                        <div className={`action-button ${yearStep ? "" : "btn-disable"}`} onClick={() => yearStep && handleSelectYears("prev")}>
                            <LeftButton />
                        </div>
                        <div className={`action-button ${yearStep === length - 1 ? "btn-disable" : ""}`} onClick={() => yearStep !== length - 1 && handleSelectYears("next")}>
                            <RightButton />
                        </div>
                    </div>
                </div>
                <EventSlider yearStep={yearStep} />
            </div>
        </main>
    );
};

export default TimelineContainer;