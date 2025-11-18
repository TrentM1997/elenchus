
export const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
}





export const headerTransitions = {
    initial: { opacity: 0 },
    open: { opacity: 1, transition: { duration: 0.2, delay: 0.2, type: 'tween' } },
    closed: { opacity: 0, transition: { duration: 0.2, delay: 0, type: 'tween' } }
};

export const softEase: Array<number> = [0.33, 0, 0.67, 1];

export const hideBottom = {
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'tween',
            duration: 0.2,
            delay: 0.4,
            ease: softEase
        },
    },
    hide: {
        opacity: 0,
        y: 100,
        transition: {
            type: 'tween',
            duration: 0.2,
            delay: 0,
            ease: softEase
        }
    }
}

export const hideTop = {
    show: {
        y: 0,
        opacity: 1
    },
    hide: {
        y: -100,
        opacity: 0
    }
};

export const popoverVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.3, duration: 0.3, type: 'tween', ease: softEase } },
    exit: { opacity: 0, transition: { delay: 0, duration: 0.4, type: 'tween', ease: softEase } }
};

export const stepVariants = {
    open: {
        opacity: 1,
        transition: {
            type: 'tween',
            duration: 0.2,
            delay: 0.2,
            ease: softEase
        }
    },
    closed: {
        opacity: 0,
        transition: {
            duration: 0.2,
            type: 'tween'
        }
    },
    exit: {
        opacity: 0,
        transition: {
            type: 'tween',
            duration: 0.2,
            delay: 0,
            ease: softEase
        }
    }

};


export const delays = {
    open: {
        opacity: 1,
        transition: {
            duration: 0.2,
            type: 'tween',
            delay: 0.2
        }
    },
    closed: {
        opacity: 0,
        transition: {
            duration: 0.2,
            type: 'tween'
        }
    }
}


export const scaleUpDown = {
    closed: {
        opacity: 0,
        scale: 0,
    },
    open: {
        opacity: 1,
        scale: 1

    }
};


export const investigationsVariants = {
    open: {
        opacity: 1,
        transition: {
            duration: 0.2,
            type: 'tween',
            delay: 0.3
        }
    },
    closed: {
        opacity: 0,
        transition: {
            duration: 0.2,
            type: 'tween'
        }
    }
}


export const searchResultsVariants = {
    open: {
        opacity: 1,
        transition: {
            duration: 0.2,
            type: 'tween',
            delay: 0.3,
            ease: [0.33, 0, 0.67, 1]
        }
    },
    closed: {
        opacity: 0,
        transition: {
            duration: 0.2,
            type: 'tween',
            delay: 0,
            ease: [0.33, 0, 0.67, 1]
        }
    }
};


export const pagesVariants = {
    show: {
        opacity: 1,
        transition: { type: 'tween', duration: 0.4, ease: 'easeInOut', delay: 0.4 }
    },
    hide: {
        opacity: 0,
        transition: { type: 'tween', duration: 0.4, ease: 'easeInOut' }
    }
};



export const extractionToastVariants = {
    initial: {
        opacity: 0,
        backgroundColor: "rgba(29, 78, 216, 0.90)", // darker blue-600/90
    },

    animate: {
        opacity: 1,
        backgroundColor: [
            "rgba(37, 99, 235, 0.88)", // -2%
            "rgba(37, 99, 235, 0.92)", // +2%
            "rgba(37, 99, 235, 0.88)"
        ],
        transition: {
            type: "tween",
            opacity: { duration: 0.2, ease: softEase },
            backgroundColor: {
                duration: 2.2,
                repeat: Infinity,
                ease: softEase,
            },
        },
    },

    exit: {
        opacity: 0,
        transition: { type: 'tween', duration: 0.2, ease: softEase },
    },
};


//had to inline this due to variance in mountDelay prop
//export const overlayVariants = {
//    initial: {
//        opacity: 0
//    },
//    animate: {
//        opacity: 1, transition: { delay: mountDelay, duration: 0.25, type: 'tween', ease: softEase }
//    },
//    exit: {}
//}