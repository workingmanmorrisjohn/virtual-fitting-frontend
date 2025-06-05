interface CustomSpacerProps {
    height: number
}

const CustomSpacer = ({height} : CustomSpacerProps) => {
    return (
        <div className={`mt-4 flex justify-center items-center h-[${height}]`}></div>
    )
}

export default CustomSpacer;