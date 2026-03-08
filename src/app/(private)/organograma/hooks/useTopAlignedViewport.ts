"use client";

import { useCallback, useEffect, useRef } from "react";
import { getNodesBounds, getViewportForBounds } from "reactflow";
import type { Node, ReactFlowInstance } from "reactflow";
import type { OrganogramaNodeData } from "../lib/types";

const FIT_PADDING = 0.2;
const TOP_PADDING = 24;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 1;

export function useTopAlignedViewport(nodes: Node<OrganogramaNodeData>[]) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const reactFlowRef = useRef<ReactFlowInstance | null>(null);

    const alignViewportToTop = useCallback(() => {
        const instance = reactFlowRef.current;
        const container = containerRef.current;

        if (!instance || !container || !instance.viewportInitialized) {
            return;
        }

        const renderedNodes = instance.getNodes();

        if (renderedNodes.length === 0) {
            return;
        }

        const bounds = getNodesBounds(renderedNodes);
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width <= 0 || height <= 0) {
            return;
        }

        const viewport = getViewportForBounds(
            bounds,
            width,
            height,
            MIN_ZOOM,
            MAX_ZOOM,
            FIT_PADDING
        );

        const centeredX =
            (width - bounds.width * viewport.zoom) / 2 - bounds.x * viewport.zoom;
        const topAlignedY = TOP_PADDING - bounds.y * viewport.zoom;

        instance.setViewport(
            {
                x: centeredX,
                y: topAlignedY,
                zoom: viewport.zoom,
            },
            { duration: 0 }
        );
    }, []);

    useEffect(() => {
        if (nodes.length === 0) {
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            alignViewportToTop();
        });

        const handleResize = () => {
            alignViewportToTop();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [alignViewportToTop, nodes]);

    const handleInit = useCallback(
        (instance: ReactFlowInstance) => {
            reactFlowRef.current = instance;
            alignViewportToTop();
        },
        [alignViewportToTop]
    );

    return {
        containerRef,
        handleInit,
    };
}
