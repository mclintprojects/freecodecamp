Array.prototype.clear = function()
{
  this.splice(0, this.length);
}

const app = new Vue({
  el: '#app',
  data: {
    watchList: 'freecodecamp, ESL_SC2, OgamingSC2, cretetion',
    watchArray: [],
    streamers: []
  },
  template: `
<div class="container-fluid">
<h1>Twitchy</h1><br>

<p>Who should I monitor?</p>
<input id="watchListTb" type="text" v-model="watchList" />
<button id="monitorBtn" class="btn" @click="showStreamStatus">Monitor</button>

<ul id="streamer-list">
<li :id="streamer.name" class="streamer-list-item" v-for="(streamer, index) in streamers" @click="navigateToTwitchChannel(index)">
  <div class="row">
  <div class="col-sm-3 col-xs-3"><img class="streamer-avi" :src="streamer.avi" /></div>
<div class="col-sm-9 col-xs-9">
  <div class="stream-details-container">
    <h4 class="streamer-name">{{streamer.name}}</h4>
    <p>{{streamer.stream_details}}</p>
  </div>
</div>
</div>
</li>
<ul>
</div>
  `,
  mounted: function(){
    this.watchArray = this.watchList.split(', ');
    this.showStreamStatus();
  },
  watch: {
    watchList: function()
    {
      this.watchArray = this.watchList.split(', ');
    }
  },
  methods: {
    navigateToTwitchChannel: function(index){
      var streamer = this.streamers[index];
      window.open('https://www.twitch.tv/' + streamer.name, '_blank');
    },
    showStreamStatus: function(){
      var me = this;
      
      this.streamers.clear();
      var endpoint = 'https://wind-bow.glitch.me/twitch-api/streams/';
      for(var i = 0; i < me.watchArray.length; i++)
        {
          $.getJSON(endpoint + me.watchArray[i], function(stream){
            if(stream.stream == null){
              me.streamers.push({
                avi: 'https://image.flaticon.com/icons/svg/217/217187.svg',
                name: me.watchArray[i],
                stream_details: 'Offline'
              });
              console.log(me.watchArray[i]);
            }
            else{
              me.streamers.push({
                avi: stream.stream.channel.logo,
                name: stream.stream.channel.display_name,
                stream_details: stream.stream.channel.game
              });
            }
          });
        }
    }
  }
});