const Background = () => {
    return (
        <>
            <div className="bg-transparent mt-[1git 00px]">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="bg-background"
                    // width="100%"
                    height="100%"
                >
                    <source
                        src="/backround_video.mp4"
                        type="video/mp4"
                        className="bg-background"
                    />
                </video>
            </div>
        </>
    );
};

export default Background;
