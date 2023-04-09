
type props = {
  AchievementData:any;
}

const OverlayAchievementData = (props) => {
  {/* 
  because gamedata can be different, CAN BE, depending on what game. ehre you can setup a default path,
  meaning if you have a specicfic name, you can say "if this, do this, else default system"
  
  onClose() will close this

  */}

    return (
      <div>
            <div>
              <p>{props.AchievementData.name}</p>
            </div>
            <div>
              <p>{props.AchievementData.message}</p>
            </div>
      </div>
    );
  };



export default OverlayAchievementData;