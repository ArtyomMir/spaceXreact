import * as d3 from "d3";
import * as Geo from "../geo.json";
import { useRef, useEffect } from "react";

function Map({ launchpads, activeLaunchpadId }) {
    const width = 1000;
    const height = 600;
    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 100
    };

    const containerRef = useRef(null);

    // Рисуем карту и точки
    useEffect(() => {
        if (!containerRef.current) return;

        const container = d3.select(containerRef.current);
        container.selectAll("*").remove();

        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([width / 2 - margin.left, height / 2 - margin.top]);

        const path = d3.geoPath().projection(projection);

        // карта мира
        g.selectAll("path")
            .data(Geo.features)
            .enter()
            .append("path")
            .attr("class", "topo")
            .attr("d", path)
            .style("opacity", 0.7);

        // точки launchpads
        if (launchpads && launchpads.length > 0) {
            const circles = g.selectAll(".launchpad-circle")
                .data(launchpads)
                .enter()
                .append("circle")
                .attr("class", "launchpad-circle")
                .attr("cx", d => projection([d.longitude, d.latitude])[0])
                .attr("cy", d => projection([d.longitude, d.latitude])[1])
                .attr("r", 5)
                .attr("fill", "red")
                .attr("stroke", "white");
        
            // тултип как в старом проекте
            circles
                .append("title")
                .text(d => d.name);
}
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", function (event) {
                // двигаем всю группу, чтобы зумился и фон, и точки
                g.attr("transform", event.transform);
            });

        svg.call(zoom);
    }, [launchpads]);

    // Подсветка активного launchpad
    useEffect(() => {
        if (!containerRef.current) return;

        const container = d3.select(containerRef.current);

        container
            .selectAll(".launchpad-circle")
            .attr("fill", d =>
                d && d.id === activeLaunchpadId ? "orange" : "red"
            )
            .attr("r", d =>
                d && d.id === activeLaunchpadId ? 8 : 5
            );
    }, [activeLaunchpadId, launchpads]);

    return (
        <div className="mapContainer map" ref={containerRef}>
        </div>
    );
}

export { Map };
