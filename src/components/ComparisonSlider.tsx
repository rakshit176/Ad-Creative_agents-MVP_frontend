import React, { useEffect } from 'react';
import "../assets/stylesheets/comparisonSlider.css"

const ComparisonSlider = ({ beforeImage, afterImage }: { beforeImage: string, afterImage: string }) => {
    useEffect(() => {
        // Function to handle the slider functionality
        const drags = (dragElement: HTMLElement, resizeElement: HTMLElement, container: HTMLElement) => {
            let touched = false;
            window.addEventListener('touchstart', () => {
                touched = true;
            });
            window.addEventListener('touchend', () => {
                touched = false;
            });

            dragElement.addEventListener("mousedown", onMouseDown);
            dragElement.addEventListener("touchstart", onTouchStart);

            function onMouseDown(e: MouseEvent) {
                e.preventDefault();
                dragElement.classList.add("draggable");
                resizeElement.classList.add("resizable");
                let startX = e.pageX;
                let dragWidth = dragElement.offsetWidth;
                let posX = dragElement.offsetLeft + dragWidth - startX;
                let containerOffset = container.offsetLeft;
                let containerWidth = container.offsetWidth;
                let minLeft = containerOffset + 10;
                let maxLeft = containerOffset + containerWidth - dragWidth - 10;

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);

                function onMouseMove(e: MouseEvent) {
                    let moveX = e.pageX;
                    let leftValue = moveX + posX - dragWidth;

                    if (leftValue < minLeft) {
                        leftValue = minLeft;
                    } else if (leftValue > maxLeft) {
                        leftValue = maxLeft;
                    }

                    let widthValue = ((leftValue + dragWidth / 2 - containerOffset) * 100) / containerWidth + "%";

                    dragElement.style.left = widthValue;
                    resizeElement.style.width = widthValue;
                }

                function onMouseUp() {
                    dragElement.classList.remove("draggable");
                    resizeElement.classList.remove("resizable");
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                }
            }

            function onTouchStart(e: TouchEvent) {
                e.preventDefault();
                const touch = e.touches[0];
                const startX = touch.pageX;
                const dragWidth = dragElement.offsetWidth;
                const posX = dragElement.offsetLeft + dragWidth - startX;
                const containerOffset = container.offsetLeft;
                const containerWidth = container.offsetWidth;
                const minLeft = containerOffset + 10;
                const maxLeft = containerOffset + containerWidth - dragWidth - 10;

                document.addEventListener("touchmove", onTouchMove);
                document.addEventListener("touchend", onTouchEnd);

                function onTouchMove(e: TouchEvent) {
                    const touch = e.touches[0];
                    const moveX = touch.pageX;
                    let leftValue = moveX + posX - dragWidth;

                    if (leftValue < minLeft) {
                        leftValue = minLeft;
                    } else if (leftValue > maxLeft) {
                        leftValue = maxLeft;
                    }

                    const widthValue = ((leftValue + dragWidth / 2 - containerOffset) * 100) / containerWidth + "%";

                    dragElement.style.left = widthValue;
                    resizeElement.style.width = widthValue;
                }

                function onTouchEnd() {
                    dragElement.classList.remove("draggable");
                    resizeElement.classList.remove("resizable");
                    document.removeEventListener("touchmove", onTouchMove);
                    document.removeEventListener("touchend", onTouchEnd);
                }
            }
        };

        const compSlider = document.querySelector(".comparison-slider") as HTMLElement;
        if (compSlider) {
            const compSliderWidth = compSlider.offsetWidth + "px";
            compSlider.querySelectorAll(".resize img").forEach((img: HTMLElement) => {
                img.style.width = compSliderWidth;
            });
            const divider = compSlider.querySelector(".divider") as HTMLElement;
            const resize = compSlider.querySelector(".resize") as HTMLElement;
            const container = compSlider.closest(".comparison-slider-wrapper") as HTMLElement;
            drags(divider, resize, container);

            window.addEventListener("resize", () => {
                const compSliderWidth = compSlider.offsetWidth + "px";
                compSlider.querySelectorAll(".resize img").forEach((img: HTMLElement) => {
                    img.style.width = compSliderWidth;
                });
            });
        }
    }, []);

    return (
        <div className="container">
            <div className="inner">
                <div className="comparison-slider-wrapper">
                    <div className="comparison-slider">
                        <div className="overlay">
                            <strong className='text-white'>After</strong>
                        </div>
                        <img src={afterImage} alt="After Image" className='max-h-[75vh] rounded-xl' />
                        <div className="resize">
                            <div className="overlay">
                                <strong className='text-white'>Before</strong>
                            </div>
                            <img src={beforeImage} className='border border-l-0 border-y-0 max-h-[75vh] rounded-xl rounded-r-none' alt="Before Image" />
                        </div>
                        <div className="divider">
                            <img src="/icons/resizer.svg" alt="Resizer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonSlider;
