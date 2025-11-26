function LaunchList({ launches, onLaunchHover }) {

    return (
        <aside className="aside" id="launchesContainer">
            <h3>Launches</h3>
            <div id="listContainer">
                <ul>
                    {launches.map(launch => (
                        <li
                            key={launch.id}
                            onMouseEnter={() => onLaunchHover && onLaunchHover(launch.launchpad)}
                            onMouseLeave={() => onLaunchHover && onLaunchHover(null)}
                            style={{ cursor: "pointer" }}
                        >
                            {launch.name}{" "}
                            {launch.date_utc && `(${new Date(launch.date_utc).getFullYear()})`}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export { LaunchList };