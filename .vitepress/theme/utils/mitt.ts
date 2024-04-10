import mitt from "mitt";
type Events = {
  changeLoginStatus: string;
};
export default mitt<Events>();
