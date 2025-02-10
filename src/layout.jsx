import {Menubar} from "primereact/menubar";
import {useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons/faHouse";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import {classNames} from "primereact/utils";

const MainLayout = ({children}) => {
    const navigate = useNavigate();
    return (
        <div className={"p-2 w-full h-screen xl:w-4/5 2xl:w-3/5 mx-auto flex flex-col"}>
            <Menubar
                model={[
                    {
                        label: 'Home',
                        icon: (options) => <FontAwesomeIcon icon={faHouse} {...options?.iconProps} />,
                        command: () => navigate("/")
                    },
                    {
                        label: 'About',
                        command: () => navigate("/about")
                    },
                    {
                        label: 'Download',
                        command: () => navigate("/downloads")
                    },
                    {
                        label: 'Documentation',
                        command: () => navigate("/docs")
                    }
                ]}
                end={<>
                    <div
                        className={classNames("sm:relative sm:w-auto w-full static transition-shadow duration-200",
                            "rounded-md text-gray-700 dark:text-white/80 hover:text-gray-700 dark:hover:text-white/80",
                            "hover:bg-gray-200 dark:hover:bg-gray-800/80")}>
                        <a href={"https://github.com/sauna-sim/sauna-ui"} aria-label={"SaunaSim GitHub"}
                           className={"select-none cursor-pointer flex items-center no-underline overflow-hidden relative py-3 px-3"}>
                            <FontAwesomeIcon icon={faGithub}/>
                        </a>
                    </div>
                </>}
            />
            <div className={"flex-grow-1"}>
                {children}
            </div>
        </div>
    )
}

export default MainLayout;