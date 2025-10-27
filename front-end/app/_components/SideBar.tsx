
type Props = {
    active: string;
}

function SideBar({ active }: Props) {
    return (
        <div className='h-full p-3 shadow-sm'>
            <img src="logo.svg" alt="logo" className="w-16" />
        </div>
    )
}

export default SideBar