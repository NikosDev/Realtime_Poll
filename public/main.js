const form = document.getElementById('vote-form');
var event;

form.addEventListener('submit', e=>{
    
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = {os: choice};

    fetch('/poll',{
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(res => res.json())
    .catch(err => console.log(err));

    e.preventDefault();
});

fetch("/poll")
    .then(res => res.json())
    .then(data => {

        let votes = data.votes;
        let totalVotes = votes.length;
        document.querySelector('#chartTitle').textContent = `Total Votes: ${totalVotes}`;

        let voteCounts = {
            Windows: 0,
            MacOS: 0,
            Linux: 0,
            Other: 0
        };

        voteCounts = votes.reduce((acc, vote) => (
            (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc),
            {}
        );

       /*  var arr = data.votes;

        var obj = {};            
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i]['os']] = ( parseInt(obj[arr[i]['os']]) || 0 ) + 
            parseInt(arr[i]['points']);
        }
        console.log( obj);  */

        let dataPoints = [
            { label: 'Windows', y: (voteCounts.Windows || 0) },
            { label: 'MacOS', y: (voteCounts.MacOS || 0) },
            { label: 'Linux', y: (voteCounts.Linux || 0) },
            { label: 'Other', y: (voteCounts.Other || 0) }
        ];
           
        const chartContainer = document.querySelector('#chartContainer');
        
        

            // Listen for the event.
            document.addEventListener('votesAdded', function (e) { 
                document.querySelector('#chartTitle').textContent = `Total Votes: ${e.detail.totalVotes}`;
            });
            
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                data:[
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();
        
             // Enable pusher logging - don't include this in production
             // Pusher.logToConsole = true;
        
             var pusher = new Pusher('84bf4e5a61c1a23733d6', {
               cluster: 'eu',
               encrypted: true
             });
         
             var channel = pusher.subscribe('os-poll');

             channel.bind('os-vote', function(data) {
               dataPoints.forEach((point)=>{
                   if(point.label==data.os)
                   {
                        point.y+=data.points;
                        totalVotes+=data.points;
                        event = new CustomEvent('votesAdded',{detail:{totalVotes:totalVotes}});
                        // Dispatch the event.
                        document.dispatchEvent(event);
                   }
               });
               chart.render();
             });
        

});

