(function($) {
    var $raw_tpl = $('script[name=queue-row]').html();
    var noQueuesHtml = $('script[name=no-queues-row]').html();
    var template = _.template($raw_tpl);
    var $tbody = $('table#queues tbody');
    var $placeholderEl = $('tr[data-role=loading-placeholder]', $tbody);

    var reload_table = function(done) {
        $placeholderEl.show();

        // Fetch the available queues
        api.getQueues(function(queues, err) {
            // Return immediately in case of error
            if (err) {
                return done();
            }
            var html = '';

            $tbody.empty();

            if (queues.length > 0) {
                $.each(queues, function(i, queue) {
                    var el = template({d: queue}, {variable: 'd'});
                    html += el;
                });
                $tbody.append(html);
            } else {
                $tbody.append(noQueuesHtml);
            }

            if (done !== undefined) {
                done();
            }
        });
    };

    var refresh_table_loop = function() {
        $('span.loading').fadeIn('fast');
        if (AUTOREFRESH_FLAG){
            reload_table(function() {
                $('span.loading').fadeOut('fast');
                setTimeout(refresh_table_loop, POLL_INTERVAL);
            });
        } else {
            setTimeout(refresh_table_loop, POLL_INTERVAL);
        }
    };

    $(document).ready(function() {
        refresh_table_loop();
        $('#refresh-button').click(reload_table);
        $('[data-toggle=tooltip]').tooltip();
    });

    $('#requeue-all-queues-btn').click(function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this);

        modalConfirm('requeue all', function() {
            $.get($this.attr('href'), function(data) {});
        });
        return false;
    });

    $('#remove-empty-failed-jobs-btn').click(function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this);

        modalConfirm('remove empty failed jobs', function() {
            $.get($this.attr('href'), function(data) {});
        });
        return false;
    });
})($);
